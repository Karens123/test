'use strict';

import superagent from 'superagent';
import * as Immutable from 'immutable';
import moment from 'moment';
import $ from 'jquery';

import WenwenApiHeaders from 'WenwenApiHeaders';

const methods = ['get', 'head', 'post', 'put', 'del', 'options', 'patch'];
const wenwenApiExcludePattern = [
	'/admin/oauth/gitlab/authSysUser',
	'/admin/user/authSysUser',
	'/admin/oauth/getAuthorizeConfig'];

//设置api Server 地址
const baseApiUrl = process.env.WENWEN_API_BASE_URL;

//设置oss server地址
const ossUrl = process.env.WENWEN_OSS_URL;

/*
 使用Promise形式处理请求
 */
class HttpUtil {
	/*
	 接收2个参数: 请求头通过构造函数传入
	 1. baseURI: 需要传入,否则抛Error
	 2. headers:
	 */
	constructor (opts) {
		this.opts = opts || {};
		if (!this.opts.baseURI) {
			throw new Error('baseURI option is required');
		}
		/*
		 targetType,请求目标类型
		 0-express api
		 1-wenwen api
		 2-third api
		 */
		this.isWenwenApi = this.opts.targetType === 1;
		this.headers = Immutable.Map(
			this.opts.headers ? this.opts.headers : {});
		methods.forEach(method =>
			this[method] = (
				path, { headers, params, data } = {}) => new Promise(
				(resolve, reject) => {
					let reqUrl = this.opts.baseURI;
					if (reqUrl.lastIndexOf('/') === reqUrl.length - 1) {
						reqUrl = reqUrl.substring(0, reqUrl.lastIndexOf('/'));
					}
					reqUrl = reqUrl + path;
					const request = superagent[method](reqUrl);
					//请求参数: query-string, 可接收对象或者string
					if (params) {
						request.query(params);
					}

					//设置请求头: request header
					let defaultheaders = this.headers;
					if (this.isWenwenApi &&
						!(path in wenwenApiExcludePattern)) {
						const wenwenApiHeaders = WenwenApiHeaders(path,
							'application/json',);
						defaultheaders = defaultheaders.merge(wenwenApiHeaders);
					}
					if (headers) {
						defaultheaders = defaultheaders.merge(headers);
					}
					request.set(defaultheaders.toObject());

					if (data) {
						if (!data.pubInfo && this.isWenwenApi) {
							data.pubInfo = getPubInfo();
						}
						request.send(data);
					}

					const requestSuccess = (body) => {
						if (/^([\w\W]*\/{1,2})+deal[\w\W]*$/.test(path)) { //对敏感操作记录日志
							console.log('log option uri', path);
							const logRequest = superagent['post'](
								'/api/option/log');
							logRequest.set(defaultheaders.toObject());

							const logParams = Immutable.Map(params).
								set('path', path).
								toObject();
							logRequest.query(logParams);

							if (data) {
								logRequest.send(data);
							}
							logRequest.end();
						}
						return body;
					};
					request.end((err, res = {}) => {
						err ? reject(res.body || err) : resolve(
							requestSuccess(res.body || res));
					});
				}),
		);
	}
}

//获取公用调用的PubInfo
export const getPubInfo = function () {
	return {
		version: '1.0.0_alpha',
	};
};

//统计公共地址
export const statisticUrl = function () {
	return '/appStatistic/sysMsgList/';
};

//提供统一调用Http的工具类
export const ExpressApi = new HttpUtil({
	baseURI: '/api',
	// baseURI: 'http://120.25.196.51:8081',
	headers: {
		Accept: 'application/json',
		wenwenTest: 0,
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '',
	},
});

//提供统一调用Http的工具类
export const WenwenApi = new HttpUtil({
	baseURI: baseApiUrl,
	targetType: 1,
	WenwenApiHeaders,
});

//第三方服务
export const ThirdApi = baseURI => new HttpUtil({ baseURI });

//长整形转化为日期格式
export function formatTime (timeLong) {
	return moment(timeLong).format('YYYY-MM-DD HH');
}

export const clearUnderline = function () {
	$('.ant-layout-header').
		find('.ant-menu-item').
		removeClass('ant-menu-item-selected');
	$('.ant-layout-header').
		find('.ant-menu-submenu').
		removeClass('ant-menu-item-selected');
};

export const getOssFileDownloadUrl = function (relativeFilePath) {
	if (relativeFilePath === undefined) return '';
	return `${ossUrl}file/${relativeFilePath}`;
};
class ThirdPartHttpUtil {
	constructor(opts) {
		methods.forEach((method) => {
			this[method] = (url, { headers, params, data } = {},callback) => {
				new Promise((resolve, reject) => {
					const request = superagent[method](url);
					//请求参数: query-string, 可接收对象或者string
					if (params) {
						request.query(params);
					}
					if (headers) {
						request.set(headers);
					}
					if (data) {
						request.send(data);
					}
					const requestSuccess = (body) => {
						if (typeof callback === 'function'){
							callback(body);
						}
						return body;
					};
					request.end((err, res = {}) => {
						err ? reject(res.body || err) : resolve(
							requestSuccess(res.body || res));
					});
				});
			};
		});
	}
}
export const ThirdPartApi = new ThirdPartHttpUtil();