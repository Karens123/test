'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import * as Constant from 'utils/Constant';

//1. 通过条件表单查询系统用户列表
export const QRY_SYS_USER_BY_FORM = 'QRY_SYS_USER_BY_FORM';
//2. 通过Id查询单个系统用户数据
export const QRY_SYS_USER_BY_ID = 'QRY_SYS_USER_BY_ID';
//3.根据userId获取用户角色列表
export const GET_USER_ROLES_BY_USER_ID = 'GET_USER_ROLES_BY_USER_ID';
//4. 删除系统用户
export const DEL_SYS_USER = 'DEL_SYS_USER';
//5. 初始化一个系统用户用于新增
export const INIT_A_SYS_USER_FOR_ADD = 'INIT_A_SYS_USER_FOR_ADD';
//6. 系统用户处理
export const DEAL_SYS_USER = 'DEAL_SYS_USER';
export const USER_ADMIN_TENANT_QRY_FOR_SELECT = 'USER_ADMIN_TENANT_QRY_FOR_SELECT';

//1. 查询系统用户
export function qrySysUserByForm (sysUser = {}) {
	return {
		type: QRY_SYS_USER_BY_FORM,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/user/qrySysUserLike', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					sysUser,
				},
			}),
		},
	};
}

//2. 根据userId查询系统用户数据
export function qrySysUserById (userId) {
	return {
		type: QRY_SYS_USER_BY_ID,
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

//3. 通过系统用户id获取发现信息数据列表
export function getUserRolesBySysUserId (userId) {
	return {
		type: GET_USER_ROLES_BY_USER_ID,
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

//4. 删除单条系统用户数据
export function deleteSysUser (currentSysUser = {}) {

	return {
		type: DEL_SYS_USER,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/user/dealSysUser', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType: Constant.OPER_TYPE_DELETE,
					sysUserList: [currentSysUser],
				},
			}),
		},
	};
}

//5. 初始化一个系统用户用于新增
export function initASysUserForAdd () {
	return {
		type: INIT_A_SYS_USER_FOR_ADD,
		payload: {},
	};
}

//6. 处理系统用户，新增或者修改
export function dealSysUser (operType, sysUser) {
	return {
		type: DEAL_SYS_USER,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/user/dealSysUser', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType,
					sysUserList: [sysUser],
				},
			}),
		},
	};
}


export function qryTenantForSelect () {
	return {
		type: USER_ADMIN_TENANT_QRY_FOR_SELECT,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/tenant/qryForCommonSelect', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					record: {},
				},
			}),
		},
	};
}