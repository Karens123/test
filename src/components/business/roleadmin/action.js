'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import * as Constant from 'utils/Constant';

//1. getAllRole(查询角色列表)
export const ROLE_GET_ALL_ROLES = 'ROLE_GET_ALL_ROLES';

//2. dealRole(增加/修改/删除角色)
export const ROLE_DEAL_ROLE = 'ROLE_DEAL_ROLE';

//3. init_edit_user(修改用户前初始化信息)
export const ROLE_INIT_EDIT_ROLE = 'ROLE_INIT_EDIT_ROLE';

//4. init_edit_all_entities(修改/增加 用户前初始化权限实体信息)
export const ROLE_INIT_ALL_ENTITIES = 'ROLE_INIT_ALL_ENTITIES';

//5. init_edit_user_entities(修改/增加 用户前初始化权限实体信息)
export const ROLE_INIT_ROLE_ENTITIES = 'ROLE_INIT_ROLE_ENTITIES';

//1. getAllRole (REST)
export function getAllRole (sysRole) {
	return {
		type: ROLE_GET_ALL_ROLES,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/user/qrySysRole', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					sysRole,
				},
			}),
		},
	};
}

//2. dealUser: 修改, 刪除
export function dealRole (operType, sysRole = {}) {
	return {
		type: ROLE_DEAL_ROLE,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/user/dealSysRole', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType,
					sysRole,
				},
			}),
		},
	};
}

//3. 修改角色初始化
export function initEditRole (role = {}, currentPage = 1) {
	return {
		type: ROLE_INIT_EDIT_ROLE,
		payload: { role, currentPage },
	};
}

//4. 初始化所有权限实体信息列表
export function initEditAllEntities (entType, roleName = '') {
	if (entType === Constant.ENT_TYPE_MENU) {
		return {
			type: ROLE_INIT_ALL_ENTITIES,
			payload: {
				promise: HttpUtil.WenwenApi.post('/admin/user/qrySysEntity', {
					data: {
						pubInfo: HttpUtil.getPubInfo(),
						sysEntity: {
							state: 'U',
						},
					},
				}),
			},
		};
	} else if (entType == Constant.ENT_TYPE_BUTTON) {
		return {
			type: ROLE_INIT_ALL_ENTITIES,
			payload: {
				promise: HttpUtil.WenwenApi.post('/admin/user/qrySysEntity', {
					data: {
						pubInfo: HttpUtil.getPubInfo(),
						sysEntity: {},
					},
				}),
			},
		};
	} else {
		console.log('[initEditAllEntities] Should not happend', entType);
	}
}

//5. 初始化角色的权限实体信息列表
export function initEditRoleEntities (roleId = 0) {
	const payload = {
		promise: HttpUtil.WenwenApi.post('/admin/user/qryRoleEnt', {
			data: {
				pubInfo: HttpUtil.getPubInfo(),
				roleId,
			},
		}),
	};

	return {
		type: ROLE_INIT_ROLE_ENTITIES,
		payload,
	};
}
