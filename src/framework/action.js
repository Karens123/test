'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import * as CookieUtil from 'utils/CookieUtil';
import * as Constant from 'utils/Constant';

//注意: 后缀'_PENDING', '_SUCCESS'和'_ERROR', 由promiseMiddleware添加上. 在configureStore中定义

//1. logout: 退出
export const FRAMEWORK_LOGOUT = 'FRAMEWORK_LOGOUT';
//2. getAllMenu: 获取所有菜单
export const FRAMEWORK_GET_ALL_MENUS = 'FRAMEWORK_GET_ALL_MENUS';
//3. updateNavPath: 更新当前路径
export const FRAMEWORK_UPDATE_NAVPATH = 'FRAMEWORK_UPDATE_NAVPATH';
//4. updateNavPath: 更新当前路径
export const FRAMEWORK_UPDATE_TOP_NAVPATH = 'FRAMEWORK_UPDATE_TOP_NAVPATH';
//5. getAllNewsList: 获取所有新闻列表
export const FRAMEWORK_GET_ALL_NEWS = 'FRAMEWORK_GET_ALL_NEWS';
//6. 资料设置修改
export const USER_DEAL_USER = 'USER_DEAL_USER';
//7. 所有角色
export const USER_INIT_EDIT_ALLROLES = 'USER_INIT_EDIT_ALLROLES';
//8. init_edit_user_roles(修改/增加 用户前初始化用户已有的角色信息)
export const USER_INIT_EDIT_USERROLES = 'USER_INIT_EDIT_USERROLES';
//9. 获取当前用户
export const USER_INIT_EDIT_USER = 'USER_INIT_EDIT_USER';
//10. 用户资料基本设置
export const FRAMEWORK_USE_BASE_INFOR = 'FRAMEWORK_USE_BASE_INFOR';
export const FRAMEWORK_LOGIN_TENANT_QRY_FOR_SELECT = 'FRAMEWORK_LOGIN_TENANT_QRY_FOR_SELECT';

//获取系统登录验证码
export const FRAMEWORK_LOGIN_CAPTCHA = 'FRAMEWORK_LOGIN_CAPTCHA';
export function genCaptcha () {
	return {
		type: FRAMEWORK_LOGIN_CAPTCHA,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/user/captcha', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					height: 50,
					width: 65,
					fontSize: 22,
				},
			}),
		},
	};
}
//系统登录
export const FRAMEWORK_LOGIN = 'FRAMEWORK_LOGIN';
export function login (tenantId, username, password, captcha, captchaMd5) {
	return {
		type: FRAMEWORK_LOGIN,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/user/authSysUser', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					sysUser: { tenantId, username, password },
					captcha,
					captchaMd5,
				},
			}),
		},
	};
}

//获取oauth2鉴权配置
export const GET_GITLAB_AUTHORIZE_CONFIG = 'GET_GITLAB_AUTHORIZE_CONFIG';
export function getGitlabAuthorizeConfig () {
	return {
		type: GET_GITLAB_AUTHORIZE_CONFIG,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/oauth/getAuthorizeConfig',
				{
					data: {
						pubInfo: HttpUtil.getPubInfo(),
						appName: Constant.GITLAB_APP_NAME,
						oauthProvider: Constant.OAUTH_PROVIDER_GITLAB,
					},
				}),
		},
	};
}

//gitlab login: 登录
export const LOGIN_BY_GITLAB = 'LOGIN_BY_GITLAB';
export function loginByGitlab (code, state) {
	return {
		type: LOGIN_BY_GITLAB,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/oauth/gitlab/authSysUser',
				{
					data: {
						pubInfo: HttpUtil.getPubInfo(),
						code,
						state,
						appName: Constant.GITLAB_APP_NAME,
						oauthProvider: Constant.OAUTH_PROVIDER_GITLAB,
					},
				}),
		},
	};
}

//getUser: 获取用户信息
export const FRAMEWORK_GET_USER = 'FRAMEWORK_GET_USER';
export function getUser (userId = '') {
	if (!userId) {
		return;
	}
	return {
		type: FRAMEWORK_GET_USER,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/user/qrySysUser', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					sysUser: { userId },
				},
			}),
		},
	};
}

//3. logout: 退出
export function logout () {
	CookieUtil.clearUserCookie();
	return {
		type: FRAMEWORK_LOGOUT,
	};
}

//4. getAllMenu: 获取所有菜单
export function getAllMenu (userId = '') {
	return {
		type: FRAMEWORK_GET_ALL_MENUS,
		payload: {
			//promise: HttpUtil.ExpressApi.post('/menu')
			promise: HttpUtil.WenwenApi.post('/admin/user/qryUserEnt', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					userId,
				},
			}),
		},
	};
}

//5. updateNavPath: 更新当前路径
export function updateNavPath (path, key) {
	return {
		type: FRAMEWORK_UPDATE_NAVPATH,
		payload: {
			data: path,
			key,
		},
	};
}

//6. getAllNewsList: 获取所有新闻列表
export function getAllNewsList () {
	return {
		type: FRAMEWORK_GET_ALL_NEWS,
		payload: {
			promise: HttpUtil.ExpressApi.post('/newsList'),
		},
	};
}

//7. operUser: 资料设置修改
export function dealUser (operType, user = {}) {
	if (!operType || !user || !user.userId) {
		return;
	}
	return {
		type: USER_DEAL_USER,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/user/dealSysUser', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType,
					sysUserList: [user],
				},
			}),
		},
	};
}

//9. 初始化所有角色信息列表
export function initEditAllRoles (roleName = '') {
	return {
		type: USER_INIT_EDIT_ALLROLES,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/user/qrySysRole', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					sysRole: {
						roleName,
						state: 'U',
					},
				},
			}),
		},
	};
}

//10. 初始化用户的角色信息列表
export function initEditUserRoles (userId = '') {
	return {
		type: USER_INIT_EDIT_USERROLES,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/user/qryUserRole', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					userId,
				},
			}),
		},
	};
}

//11. 获取当前用户
export function initEditUser (user = {}) {
	return {
		type: USER_INIT_EDIT_USER,
		payload: { user },
	};
}

//12. 用户资料基本设置
export function userBaseInfor () {
	return {
		type: FRAMEWORK_USE_BASE_INFOR,
		payload: {
			promise: HttpUtil.ExpressApi.post('/UseBaseInfor'),
		},
	};
}

export function qryTenantForSelect () {
	return {
		type: FRAMEWORK_LOGIN_TENANT_QRY_FOR_SELECT,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/tenant/qryForLoginSelect', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					record: {},
				},
			}),
		},
	};
}
