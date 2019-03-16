'use strict';

import * as Immutable from 'immutable';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	Button,
	Col,
	Form,
	Icon,
	Input,
	Radio,
	Row,
	Select,
	Upload,
} from 'antd';
import * as Constant from 'utils/Constant';
import * as MsgUtil from 'utils/MsgUtil';
import * as businessRoute from 'business/route';
import { handleUploadFile, initOssFileUploadProps } from 'utils/UploadUtil';
import {
	DEAL_VERSION,
	dealVersion,
	initAVersionForAdd,
	QRY_VERSION_BY_REC_ID,
	qryVersionByRecId,
} from 'action';

const RadioGroup = Radio.Group;
class VersionEdit extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static propTypes = {
		currentVersion: PropTypes.object.isRequired,
		actionType: PropTypes.string.isRequired,
		rspInfo: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		form: PropTypes.object.isRequired,
		route: PropTypes.object.isRequired,
		params: PropTypes.object.isRequired,
	};
	static defaultProps = {
		currentVersion: {},
	};

	constructor (props) {
		super(props);
		const { route } = this.props;
		if (!route) {
			this.context.router.replace(businessRoute.VersionAdmin);
		}
		const operType = route.path === businessRoute.VersionEditById
			? Constant.OPER_TYPE_EDIT
			: Constant.OPER_TYPE_ADD;
		this.state = { operType };
	}

	componentWillMount () {
		const { actions } = this.props;
		const { operType } = this.state;
		if (operType == Constant.OPER_TYPE_EDIT) {
			const { params } = this.props;
			const versionId = params.versionId;
			actions.qryVersionByRecId(versionId);
		} else {
			actions.initAVersionForAdd();
		}
	}

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType } = nextProps;
		const { params } = this.props;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (`${DEAL_VERSION}_SUCCESS` === actionType) { //处理完成
					if (rspInfo.resultCode === Constant.REST_OK) {
						let msg = '版本信息成功';
						if (this.state.operType == Constant.OPER_TYPE_ADD) {
							msg = `新增${msg}`;
						} else if (this.state.operType ==
							Constant.OPER_TYPE_EDIT) {
							msg = `修改${msg}`;
						} else {
							MsgUtil.showwarning('未知操作');
							return;
						}
						MsgUtil.showinfo(msg);
						this.context.router.replace(`${businessRoute.VersionAdmin}${params.prepage?`/${params.prepage}`:''}`);
					} else {
						if (this.state.operType == Constant.OPER_TYPE_ADD) {
							MsgUtil.showerror(
								`新增版本信息错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						} else {
							MsgUtil.showerror(
								`修改版本信息错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						}
					}
				} else if (`${QRY_VERSION_BY_REC_ID}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询版本信息失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				}
			}
		}
	}

	handleReset = (e) => {
		e.preventDefault();
		this.props.form.resetFields();
	};

	handleSubmit = (e) => {
		e.preventDefault();
		const { actions, currentVersion } = this.props;
		const { operType } = this.state;

		this.props.form.validateFields((errors, editForm) => {
			const afterMergeForm = Immutable.Map(currentVersion).
				merge(editForm).
				toObject();
			console.log('VersionEdit commit formEdit', afterMergeForm);
			if (!!errors) {
				console.log('表单验证失败!!!');
				return;
			}
			actions.dealVersion(operType, [afterMergeForm]);
		});
	};

	handleFileChange = (info) => {
		const fileList = info.fileList;
		const { SrcPath } = handleUploadFile(fileList);
		this.setState({ downloadAddr: SrcPath });
	};

	render () {
		const { getFieldDecorator, getFieldValue } = this.props.form;
		const { currentVersion,params } = this.props;
		const { downloadAddr } = this.state;
		//版本编码
		const VersionCodeProps = getFieldDecorator('versionCode', {
			initialValue: currentVersion.versionCode,
			rules: [
				{ required: true, message: '版本编码不能为空' },
				{ max: 255, whitespace: true, message: '最多 255 个字符' },
			],
		});

		//版本名称
		const VersionNameProps = getFieldDecorator('versionName', {
			initialValue: currentVersion.versionName,
			rules: [
				{ required: true, message: '版本名称不能为空' },
				{ max: 150, whitespace: true, message: '最多 150 个字符' },
			],
		});
		//是否强制
		const ForceUpProps = getFieldDecorator('forceUp', {
			initialValue: currentVersion.forceUp === undefined
				? '0'
				: String(currentVersion.forceUp),
			size: 'large',
			rules: [
				{ required: true, message: '是否强制更新不能为空' },
			],
		});
		//语言
		const LanguageProps = getFieldDecorator('language', {
			initialValue: currentVersion.language,
			size: 'large',
			rules: [
				{ required: true, message: '版本语言不能为空' },
			],
		});
		//国家
		const CountryProps = getFieldDecorator('country', {
			initialValue: currentVersion.country,
			size: 'large',
			rules: [
				{ required: true, message: '国家不能为空' },
			],
		});

		//版本类型
		const TypeProps = getFieldDecorator('type', {
			initialValue: String(currentVersion.type),
			rules: [
				{ required: true, message: '版本类型不能为空' },
			],
		});

		//固件厂商
		const factoryNode = () => {
			if (getFieldValue('type') == 4) {
				const FactoryProps = getFieldDecorator('factory', {
					initialValue: currentVersion.factory,
					rules: [
						{ required: true, message: '固件厂商不能为空' },
						{ max: 150, whitespace: true, message: '最多 150 个字符' },
					],
				});
				return (
					<Form.Item {...formItemLayout} label="固件厂商" required hasFeedback >
						{FactoryProps(
							<Input placeholder="请输入固件厂商..." />,
						)}
					</Form.Item>
				);
			}
		};
		//固件厂商
		const appVersionNode = () => {
			if (getFieldValue('type') == 4) {
				const AppVersionProps = getFieldDecorator('appVersion', {
					initialValue: currentVersion.appVersion,
					rules: [
						{ required: true, message: 'app版本不能为空' },
						{ max: 150, whitespace: true, message: '最多 150 个字符' },
					],
				});
				return (
					<Form.Item {...formItemLayout} label="app版本" required hasFeedback >
						{AppVersionProps(
							<Input placeholder="请输入固件厂商..." />,
						)}
					</Form.Item>
				);
			}
		};
		//固件设备类型
		const deviceTypeNode = () => {
			if (getFieldValue('type') == 4) {
				const deviceType = !!currentVersion.deviceType
					? String(currentVersion.deviceType)
					: '1';
				const DeviceTypeProps = getFieldDecorator('deviceType', {
					initialValue: deviceType,
					rules: [
						{ required: true, message: '固件设备类型不能为空' },
					],
				});
				return (
					<Form.Item  {...formItemLayout} label="固件设备类型" >
						{DeviceTypeProps(
							<RadioGroup >
								<Radio key="a" value="1" >戒指</Radio>
								<Radio key="b" value="2" >手串</Radio>
								<Radio key="c" value="3" >项链</Radio>
								<Radio key="d" value="4" >手链</Radio>
							</RadioGroup>,
						)}
					</Form.Item>
				);
			}
		};
		//固件主板类型
		const mboardTypeNode = () => {
			if (getFieldValue('type') == 4) {
				const MboardTypeProps = getFieldDecorator('mboardType', {
					initialValue: currentVersion.mboardType
						? String(currentVersion.mboardType)
						: '1',
					rules: [
						{ required: true, message: '固件主板类型不能为空' },
					],
				});
				return (
					<Form.Item  {...formItemLayout} label="固件主板类型" >
						{MboardTypeProps(
							<RadioGroup  >
								<Radio key="a" value="1" >椭圆</Radio>
								<Radio key="b" value="2" >方型</Radio>
							</RadioGroup>,
						)}
					</Form.Item>
				);
			}
		};

		//版本描述
		const DescriptionProps = getFieldDecorator('description', {
			initialValue: currentVersion.description,
			rules: [
				{ max: 1000, whitespace: true, message: '最多 1000 个字符' },
			],
		});

		//启动图片
		const StartPicProps = getFieldDecorator('startPic', {
			initialValue: currentVersion.startPic,
			rules: [
				{ max: 255, whitespace: true, message: '最多 255 个字符' },
			],
		});

		//上传组件属性
		const uploadFileProps = initOssFileUploadProps({
			targetDir: 'zs',
			ifRename: false,
			onChange: this.handleFileChange,
			showUploadList: false,
		});
		//下载地址
		const DownloadAddrProps = getFieldDecorator('downloadAddr', {
			initialValue: downloadAddr
				? downloadAddr
				: currentVersion.downloadAddr,
			rules: [
				{ required: false, message: '下载地址不能为空' },
				{ max: 255, whitespace: true, message: '最多 255 个字符' },
			],
		});

		const formItemLayout = {
			labelCol: { span: 7 },
			wrapperCol: { span: 10 },
		};

		return (
			<div >
				<Row>
					<Col span={16} >
						<Link to={`${businessRoute.VersionAdmin}${params.prepage?`/${params.prepage}`:''}`} className="ant-btn" style={{ lineHeight: '25px' }} >
							<Icon type="backward" />
							<span>&nbsp;&nbsp;版本管理</span>
						</Link>
					</Col>
				</Row>
				<br /><br /><br />
				<Row>
					<Col span={16} >
						<Form layout="horizontal" >
							<Form.Item {...formItemLayout} label="版本编码" required hasFeedback >
								{VersionCodeProps(
									<Input placeholder="请输入版本编码..." />,
								)}
							</Form.Item>

							<Form.Item {...formItemLayout} label="版本名称" required hasFeedback >
								{VersionNameProps(
									<Input placeholder="请输入版本名称..." />,
								)}
							</Form.Item>

							<Form.Item {...formItemLayout} label="是否强制" required >
								{ForceUpProps(
									<Select >
										<Select.Option value="0" >0-否</Select.Option>
										<Select.Option value="1" >1-是</Select.Option>
									</Select>,
								)}
							</Form.Item>

							<Form.Item {...formItemLayout} label="语言" required >
								{LanguageProps(
									<Select >
										<Select.Option value="zh" >zh-中文</Select.Option>
										<Select.Option value="en" >en-英文</Select.Option>
									</Select>,
								)}
							</Form.Item>

							<Form.Item {...formItemLayout} label="国家" required >
								{CountryProps(
									<Select >
										<Select.Option value="CN" >CN-中国</Select.Option>
										<Select.Option value="US" >US-美国</Select.Option>
									</Select>,
								)}
							</Form.Item>

							<Form.Item  {...formItemLayout} label="版本类型" >
								{TypeProps(
									<RadioGroup  >
										<Radio key="a" value="0" >IOS</Radio>
										<Radio key="b" value="1" >Android</Radio>
										<Radio key="c" value="2" >WEB</Radio>
										<Radio key="d" value="4" >固件</Radio>
									</RadioGroup>,
								)}
							</Form.Item>
							{factoryNode()}
							{appVersionNode()}
							{deviceTypeNode()}
							{mboardTypeNode()}

							<Form.Item {...formItemLayout} label="下载地址" required >
								<Col span={15} >
									{DownloadAddrProps(
										<Input placeholder="请输入下载地址..." style={{ width: 191 }} />,
									)}
								</Col>
								<Col span={9} style={{ textAlign: 'right' }} >&nbsp;&nbsp;
									<Upload {...uploadFileProps} >
										<Button >
											<Icon type="upload" /> 点击上传
										</Button>
									</Upload>
								</Col>
							</Form.Item>

							<Form.Item {...formItemLayout} label="启动图片" hasFeedback >
								{StartPicProps(
									<Input placeholder="请输入启动图片..." />,
								)}
							</Form.Item>

							<Form.Item {...formItemLayout} label="版本描述" hasFeedback >
								{DescriptionProps(
									<Input type="textarea" rows="4" />,
								)}
							</Form.Item>

							<Form.Item wrapperCol={{ span: 12, offset: 8 }} >
								<Button type="primary" onClick={this.handleSubmit} >提交</Button> &nbsp;&nbsp;
								<Button type="primary" onClick={this.handleReset} >重置</Button> &nbsp;&nbsp;
							</Form.Item>
						</Form>
					</Col>
				</Row>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType, } = state.get('RootService').toObject();
	const { currentVersion } = state.get('versionAdmin').toObject();
	return { rspInfo, currentVersion, actionType };
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators(
			{ qryVersionByRecId, dealVersion, initAVersionForAdd }, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(VersionEdit));
