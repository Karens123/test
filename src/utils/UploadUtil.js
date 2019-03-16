'use strict';

import * as Immutable from 'immutable';
import OSS from 'root/lib/ali-oss/aliyun-oss-sdk.min.js';

import co from 'co';

import WenwenApiHeaders from 'WenwenApiHeaders';
import * as HttpUtil from 'utils/HttpUtil';
import * as DateUtil from 'utils/DateUtil';
import * as Constant from 'utils/Constant';
import * as CookieUtil from 'utils/CookieUtil';
import * as MsgUtil from 'utils/MsgUtil';

export function handleUploadFile (fileList, filters) {
	// 1. 上传列表数量的限制
	//    只显示最近上传的一个，旧的会被新的顶掉
	let newFileList = fileList.slice(-1);
	// 2. 读取远程路径并显示链接
	newFileList = newFileList.map((file) => {
		const newFile = file;
		if (newFile.response) {
			// console.trace('mark',newFile);
			// 组件会将 file.url 作为链接进行展示
			newFile.url = file.response.url;
			newFile.uid = file.response.uid;
			newFile.name = file.response.name;
			newFile.path = file.response.path;
		}
		return newFile;
	});

	// 3. 按照服务器返回信息筛选成功上传的文件
	newFileList = newFileList.filter((file) => {
		if (file.response) {
			return true;
		}
		return true;
	});

	let FileUploadPath = '';
	let SrcPath = '';
	const item = newFileList && newFileList.length > 0 && newFileList[0];
	if (item) {
		if ((filters && filters(item)) || !filters) {
			SrcPath = item.url;
			FileUploadPath = item.path;
		}
	}
	return { FileUploadPath, SrcPath };
}

export function handleUploadImage (fileList) {
	function imageFilter (item) {
		let isOk = false;
		if (item.response) {
			// UploadPath = item.response.path;
			const url = item.response.url;
			// 教验图片格式
			const name = url.substring(url.lastIndexOf('.') + 1, url.length);
			if (name === 'jpg' || name === 'bmp' || name === 'png' ||
				name === 'jpeg') {
				// 校验图片大小
				const fileSize = item.size;
				const size = fileSize / 1024;
				if (size > 2000) {
					MsgUtil.showwarning('附件不能大于2M');
				} else {
					isOk = true;
				}
			} else {
				MsgUtil.showwarning('请输入jpg,bmp, png, jpeg格的图');
			}
		} else {
			console.log(item);
			console.log('没有path出错！');
		}
		return isOk;
	}
	console.log('handleUploadImage',fileList);
	return handleUploadFile(fileList, imageFilter);
}

export function handleUploadExcel (fileList) {
	function excelFilter (item) {
		let isOk = false;
		if (item.status === 'done') {
			if (item.response) {
				//  UploadPath = item.response.path;
				const name = item.response.name;
				// 校验文件格式
				const suffix = name.substring(name.lastIndexOf('.') + 1);
				if (suffix === 'xls' || suffix === 'xlsx') {
					isOk = true;
				} else {
					MsgUtil.showwarning('请选择excel文件');
				}
			} else {
				console.log('没有path出错！');
			}
		}
		return isOk;
	}

	return handleUploadFile(fileList, excelFilter);
}

const PubUploadProps = { multiple: false };

// 设置api Server 地址
const baseApiUrl = process.env.WENWEN_API_BASE_URL;

export const PubImageUploadProps = () => {
	const headers = WenwenApiHeaders('/admin/base/uploadImage');
	return Immutable.Map(PubUploadProps).
		set('action', `${baseApiUrl}/admin/base/uploadImage`).
		set('headers', headers);
};

export const PubFileUploadProps = () => Immutable.Map(PubUploadProps).
	set('action', `${baseApiUrl}/admin/base/uploadFile`).
	set('headers', WenwenApiHeaders('/admin/base/uploadFile'));

const OSS_BUCKET = process.env.OSS_BUCKET || 'test-img-server';
export const OSS_UPLOAD_SERVER = `http://${OSS_BUCKET}.oss-cn-shenzhen.aliyuncs.com`;
export const OSS_DEFAULT_UPLOAD_FILE_DIR_PATH = '/file' ;
class OssFileUploadClient {
	region = 'oss-cn-shenzhen';
	bucket = OSS_BUCKET;
	pathPrefix =OSS_UPLOAD_SERVER;
	accessKeyId;
	accessKeySecret;
	securityToken;
	expiration;

	constructor (props) {
		this.props = props || {};
		const { accessKeyId, accessKeySecret, securityToken, expiration } = this.props;
		this.accessKeyId = accessKeyId;
		this.accessKeySecret = accessKeySecret;
		this.securityToken = securityToken;
		this.expiration = expiration;
		console.log('OSS_BUCKET ---->', process.env.OSS_BUCKET);
	}

	multipartUpload (
		onProgress, onError, onSuccess, targetDir, file, ifRename) {
		const { region, accessKeyId, accessKeySecret, bucket,pathPrefix } = this;
		const ossClient = new OSS.Wrapper({
			region,
			accessKeyId,
			accessKeySecret,
			bucket,
			stsToken: this.securityToken,
		});
		const currDate = new Date();
		console.log('multipartUpload',file);
		const suffix = file.name.substring(file.name.lastIndexOf('.'));
		const userId = CookieUtil.getCookie('userId');
		const fileName = ifRename ? `admin_${userId &&
		userId}_${currDate.getTime() + suffix}` : file.name;
		const uploadPath = `${DateUtil.getYear(currDate)}/${Number(
			DateUtil.getMonth(currDate))}/${Number(
			DateUtil.getDay(currDate))}/${fileName}`;
		const objectKey = `${targetDir}/${uploadPath}`;
		// console.log('objectKey',objectKey);
		co(
			function* () {
				console.log('multipartUpload',file);
				const result = yield ossClient.multipartUpload(objectKey, file,
					{
						parallel: 4,
						partSize: 1024 * 1024,
						* progress(p) {
							yield* onProgress({ percent: p * 100 });
						},
					});
				if (result) {
					// console.log('result mark',result);
					const { bucket } = result;
					let { url } = result;
					url = url ? url : `${pathPrefix}/${result.name}`;
					console.log('uploadPath', uploadPath);
					onSuccess({
						url,
						uid: result.res.headers.etag,
						name: file.name,
						path: uploadPath,
					}, file);
				}
			},
			(err) => {
				console.log('err', err);
				onError(err);
			},
		);
	}
	bufferUpload (
		onError, onSuccess, targetDir, buffer, ifRename) {
		const { region, accessKeyId, accessKeySecret, bucket } = this;
		const ossClient = new OSS.Wrapper({
			region,
			accessKeyId,
			accessKeySecret,
			bucket,
			stsToken: this.securityToken,
		});
		const currDate = new Date();
		console.log('multipartUpload',buffer);
		const userId = CookieUtil.getCookie('userId');
		const fileName = `admin_${userId && userId}_${currDate.getTime()}`;
		const uploadPath = `${DateUtil.getYear(currDate)}/${Number(
			DateUtil.getMonth(currDate))}/${Number(
			DateUtil.getDay(currDate))}/${fileName}`;
		const objectKey = `${targetDir}/${uploadPath}`;
		console.log('objectKey',objectKey);
		co(
			function* () {
				console.log('bufferUpload',buffer);
				const result = yield ossClient.put(objectKey, new Buffer(buffer));
				if (result) {
					console.warning(result);
					onSuccess(result);
				}
			},
			(err) => {
				console.log('err', err);
				onError(err);
			},
		);

	}


}

OssFileUploadClient.getOssUploadeClient = () => {
	const ossUploadClient = OssFileUploadClient.client;
	console.log('OssFileUploadClient.getOssUploadeClient');
	if (ossUploadClient === undefined) {
		return HttpUtil.WenwenApi.post('/admin/data/requestAliyunCredentials',
			{ data: { pubInfo: HttpUtil.getPubInfo() } },
		).then((ret) => {
			if (ret && ret.rspInfo.resultCode === Constant.REST_OK) {
				OssFileUploadClient.client = new OssFileUploadClient({
					accessKeyId: ret.accessKeyId,
					accessKeySecret: ret.accessKeySecret,
					expiration: ret.expiration,
					securityToken: ret.securityToken,
				});
			}
			return OssFileUploadClient.client;
		});
	}
	return Promise.resolve(ossUploadClient);
};

export const initOssFileUploadProps = (options = {}) => {
	const targetDir = options.targetDir ? options.targetDir : 'file';
	const ifRename = options.ifRename !== undefined ? options.ifRename : true;
	const customRequest = ({ onProgress, onError, onSuccess, file }) => {
		co(
			function* () {
				const client = yield OssFileUploadClient.getOssUploadeClient();
				if (client) {
					console.info('initOssFileUploadProps:',file);
					client.multipartUpload(onProgress, onError, onSuccess,
						targetDir, file, ifRename);
				}
			},
			(err) => {
				console.log('err', err);
				onError(err);
			},
		);
	};
	const props = Immutable.Map({
		multiple: false,
		customRequest,
	}).merge(options);
	return props.toObject();
};

export const initOssBufferUploadProps = (options = {}) => {
	const targetDir = options.targetDir ? options.targetDir :OSS_DEFAULT_UPLOAD_FILE_DIR_PATH;
	const ifRename = options.ifRename !== undefined ? options.ifRename : true;
	const customRequest = ({  onError, onSuccess, buffer }) => {
		co(
			function* () {
				const client = yield OssFileUploadClient.getOssUploadeClient();
				if (client) {
					console.log('initOssBufferUploadProps:',buffer);
					client.bufferUpload(onError, onSuccess, targetDir, buffer, ifRename);
				}
			},
			(err) => {
				console.log('err', err);
				onError(err);
			},
		);
	};
	const props = Immutable.Map({
		multiple: false,
		customRequest,
	}).merge(options);
	return props.toObject();
};
