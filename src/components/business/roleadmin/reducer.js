'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function roleadmin (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	state = Immutable.Map(state).set('actionType', action.type);
	if (ret && ret.rspInfo) {
		state = state.set('rspInfo', ret.rspInfo);
	}

	switch (action.type) {
		//查询角色列表成功
		case `${actions.ROLE_GET_ALL_ROLES}_SUCCESS`: {
			console.log('6666__________________: ',ret.sysRoleList);
			const currentPage = state.currentPage ? state.currentPage : 1;
			return state.
			set('roles', ret.sysRoleList).
			set('currentPage', currentPage).
			set('currentRole', ret.sysRoleList[0]);
		}
		case `${actions.ROLE_DEAL_ROLE}_SUCCESS`:
			return state.delete('currentRole');
		case actions.ROLE_INIT_EDIT_ROLE:
			return state.set('currentRole', ret.role).
				set('currentPage', ret.currentPage);
		//修改角色前,初始化所有权限实体信息
		case `${actions.ROLE_INIT_ALL_ENTITIES}_SUCCESS`: {
			let entities = ret.sysEntityList;
			if (entities == undefined) {
				entities = [];
			}
			return state.set('entities', entities);
		}
		case `${actions.ROLE_INIT_ROLE_ENTITIES}_SUCCESS`: {
			let roleEntList = ret.roleEntList;
			console.log('roleEntList_________rendufdsafsdcer____________', ret);
			if (roleEntList == undefined) {
				roleEntList = [];
			}
			return state.set('roleentities', roleEntList);
		}
		default:
			return state;
	}
}