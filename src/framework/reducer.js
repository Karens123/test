'use strict';

import * as actions from 'action';
import * as Immutable from 'immutable';
import _ from 'lodash';

export function AuthService (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		case `${actions.GET_GITLAB_AUTHORIZE_CONFIG}_SUCCESS`: {
			let authorizeConfig = {};
			if (ret) {
				const { oauthServer, clientId, state, redirectUri, authorizeUrl, scope, requestAuthorizeCodeUrl } = ret;
				authorizeConfig = {
					oauthServer,
					clientId,
					state,
					redirectUri,
					authorizeUrl,
					scope,
					requestAuthorizeCodeUrl,
				};
			}

			return state.set('authorizeConfig', authorizeConfig);
		}
		case `${actions.FRAMEWORK_LOGIN}_SUCCESS`:
		case `${actions.LOGIN_BY_GITLAB}_SUCCESS`: {
			return state.set('currentUser', ret.sysUser).
				set('userToken', ret.userToken);
		}
		case `${actions.FRAMEWORK_LOGOUT}`: {
			return state.delete('currentUser').delete('rspInfo');
		}
		case `${actions.FRAMEWORK_LOGIN_TENANT_QRY_FOR_SELECT}_SUCCESS`: {
			return state.set('tenantList', ret.records);
		}
		case `${actions.FRAMEWORK_GET_TEST_USER}_SUCCESS`:
		case `${actions.FRAMEWORK_GET_USER}_SUCCESS`: {
			const { sysUserList } = ret;
			let currentUser = {};
			if (sysUserList && sysUserList.length > 0) {
				currentUser = sysUserList[0];
			}
			return state.set('currentUser', currentUser);
		}
		case `${actions.FRAMEWORK_LOGIN_CAPTCHA}_SUCCESS`: {
			const { captchaImgBase64, captchaMd5 } = ret;
			return state.set('captcha', { captchaImgBase64, captchaMd5 });
		}
		default: {
			return state;
		}
	}
}

export function MenuService (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		case `${actions.FRAMEWORK_GET_ALL_MENUS}_SUCCESS`: {
			return state.set('sysMenuList', ret.sysMenuList).
				set('sysButtonList', ret.sysButtonList);
		}
		case actions.FRAMEWORK_UPDATE_NAVPATH: {
			const navpath = [];
			let tmpOb;
			let tmpKey;
			let child;
			//非菜单地方
			if (action.payload.data == '') {
				navpath.length = 0;
				navpath.push({
					name: action.payload.key,
				});
			} else {
				if (action.payload.data) {
					action.payload.data.reverse().map((item) => {
						if (item.indexOf('sub') != -1) {
							tmpKey = item.replace('sub', '');
							tmpOb = _.find(state.get('sysMenuList'),
								o => o.menuId == tmpKey);
							child = tmpOb.childList;
							navpath.push({
								key: tmpOb.menuId,
								name: tmpOb.menuTitle,
								url: tmpOb.url,
							});
						}

						if (item.indexOf('menu') != -1) {
							//父菜单
							tmpKey = item.replace('menu', '');
							if (child) {
								tmpOb = _.find(child, o => o.menuId == tmpKey);
							}
							navpath.push({
								key: tmpOb.menuId,
								name: tmpOb.menuTitle,
							});
						}
					});
				}
			}
			return state.set('currentIndex', action.payload.key * 1).
				set('navpath', navpath);
		}
		default: {
			return state;
		}
	}
}

//帮肋中心
export function HelpService (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		case `${actions.FRAMEWORK_GET_ALL_NEWS}_SUCCESS`: {
			return state.set('newlist', ret.newsList);
		}
		default:
			return state;
	}
}

//资料设置
export function SettingService (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		case `${actions.USER_INIT_EDIT_ALLROLES}_SUCCESS`:
			return state.set('roles', ret.sysRoleList);
		case `${actions.USER_INIT_EDIT_USERROLES}_SUCCESS`:
			return state.set('userroles', ret.userRoleList);
		case actions.USER_INIT_EDIT_USER:
			return state.set('currentUser', ret.user).
				set('currentPage', ret.currentPage);
		//处理用户变更成功
		case `${actions.USER_DEAL_USER}_SUCCESS`:
			return state.set('usersID', ret.userId);
		case `${actions.FRAMEWORK_USE_BASE_INFOR}_SUCCESS`:
			return state.set('userProfile', ret.UseBaseInfor);
		default:
			return state;
	}
}
