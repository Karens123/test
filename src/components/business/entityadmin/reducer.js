'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function entityadmin (state = Immutable.Map(), action = {}) {

	const ret = action.payload;
	switch (action.type) {
		//查询角色列表成功
		case `${actions.ENTITY_GET_ALL_ENTITIES}_SUCCESS`: {
			const currentPage = state.currentPage ? state.currentPage : 1;
			return state.set('entities', ret.sysEntityList).
				set('currentPage', currentPage);
		}
		case `${actions.QRY_ENTITY_BY_ID}_SUCCESS`: {
			const sysEntityList = ret.sysEntityList;
			let currentEntity = {};
			if (sysEntityList && sysEntityList[0]) {
				currentEntity = sysEntityList[0];
			}
			return state.set('currentEntity', currentEntity);
		}

		case `${actions.GET_ALL_BUTTON}_SUCCESS`:
			return state.set('sysButtonList', ret.sysButtonList);

		//5. 初始化一个发现类型用于新增
		case actions.INIT_A_ENTITY_FOR_ADD:
			return state.set('currentEntity', ret);

		//6. 修改初始化
		case actions.ENTITY_INIT_EDIT_ENTITY:
			return state.set('currentMenus', ret.currentMenus);


		//8. 删除菜单
		case `${actions.DELETE_ENTITY}_SUCCESS`:
			return state.delete('currentMenus');

		//9. 系统菜单查询接口
		case `${actions.QRY_SYS_MENU}_SUCCESS`: {
			const sysMenuList=ret.sysMenuList;
			return state.set('sysMenuList',sysMenuList);
		}

		//10. 系统功能查询接口
		case `${actions.SYS_ENTITY_BUTTON_BEAN}_SUCCESS`: {
			let sysEntity=ret.sysButtonList;
			if (sysEntity && sysEntity[0]) {
				sysEntity = sysEntity[0];
			}
			return state.set('sysEntity', sysEntity);
		}

		//10.修改实体
		case `${actions.Edit_DEAL_ENTITY}_SUCCESS`:
			// return state.set('sysEntity', sysEntity);

		//7. 新增菜单，
		case `${actions.ENTITY_DEAL_ENTITY}_SUCCESS`:

		//8. 初始化当前实体，
		case actions.INIT_SYS_BOTTTON:
			return state.set('currentSysbutton', ret.currentSysbutton);


		//9. 修改，删除，新增管理系统功能
		case `${actions.Edit_DEAL_SYS_BUTTON}_SUCCESS`:
			return state.set('SysbuttonList', ret);


		default:
			return state;
	}
}
