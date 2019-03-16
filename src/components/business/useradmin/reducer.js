'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function SysUserService (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		//1. 根据条件查询发现列表
		case `${actions.QRY_SYS_USER_BY_FORM}_SUCCESS`://执行查询操作后
			return state.set('sysUserList', ret.sysUserList);
		case `${actions.USER_ADMIN_TENANT_QRY_FOR_SELECT}_SUCCESS`://执行查询操作后
			return state.set('tenantList', ret.records);
		//2. 通过id获取一个系统用户数据
		case `${actions.QRY_SYS_USER_BY_ID}_SUCCESS`: {
			const sysUserList = ret.sysUserList;
			let currentSysUser = {};
			if (sysUserList && sysUserList[0]) {
				currentSysUser = sysUserList[0];
			}
			return state.set('currentSysUser', currentSysUser);
		}
		//3. 通过系统用户id获取系统用户数据
		case `${actions.GET_USER_ROLES_BY_USER_ID}_SUCCESS`:
			return state.set('userRoleList', ret.userRoleList);
		//4. 初始化一个系统用户用于新增
		case actions.INIT_A_SYS_USER_FOR_ADD:
			return state.set('currentSysUser', ret).delete('userRoleList');
		//5. 删除单条系统用户数据
		case `${actions.DEL_SYS_USER}_SUCCESS`:
			return state.delete('currentSysUser');
		//6. 处理系统用户信息
		case `${actions.DEAL_SYS_USER}_SUCCESS`:
		default:
			return state;
	}
}
