'use strict';

import * as HttpUtil from 'utils/HttpUtil';

//getAllEntities(查询实体列表)
export const GET_ALL_BUTTON = 'GET_ALL_BUTTON';

//查询单个数据
export const QRY_ENTITY_BY_ID = 'QRY_ENTITY_BY_ID';
//初始化一个实体
export const INIT_A_ENTITY_FOR_ADD = 'INIT_A_ENTITY_FOR_ADD';

//删除菜单
export const DELETE_ENTITY = 'DELETE_ENTITY';

export const ENTITY_DEAL_ENTITY = 'ENTITY_DEAL_ENTITY';

//init_edit_entity(修改实体前初始化信息)
export const ENTITY_INIT_EDIT_ENTITY = 'ENTITY_INIT_EDIT_ENTITY';

//(系统菜单查询)
export const QRY_SYS_MENU = 'QRY_SYS_MENU';

//SYS_ENTITY_BUTTON_BEAN(系统功能查询接口)
export const SYS_ENTITY_BUTTON_BEAN = 'SYS_ENTITY_BUTTON_BEAN';

//Edit_DEAL_ENTITY(系统功能查询接口)
export const Edit_DEAL_ENTITY = 'Edit_DEAL_ENTITY';

//INIT_SYS_BOTTTON(初始化当前实体)
export const INIT_SYS_BOTTTON = 'INIT_SYS_BOTTTON';

//修改，删除，新增管理系统功能
export const Edit_DEAL_SYS_BUTTON = 'Edit_DEAL_SYS_BUTTON';

//删除系统功能
export const Edit_DELETE_SYS_BUTTON = 'Edit_DELETE_SYS_BUTTON';



// 查询功能
export function getAllEntitiesButton (currentButton) {
	return {
		type: GET_ALL_BUTTON,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/user/qrySysButton', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					sysButton: currentButton,
				},
			}),
		},
	};
}


// 查询单个实体
export function qryEntityById (entId) {
	return {
		type: QRY_ENTITY_BY_ID,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/user/qrySysEntity', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					sysEntity: { entId },
				},
			}),
		},
	};
}



// 初始化一个实体用于新增
export function initAEntityForAdd () {
	return {
		type: INIT_A_ENTITY_FOR_ADD,
		payload: { },
	};
}


//删除菜单
export function deleteMenus (operType, currentMenus = {}) {
	return {
		type: DELETE_ENTITY,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/user/dealSysMenu', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType,
					menuList: [currentMenus],
				},
			}),
		},
	};
}


//增加
export function dealEntity (operType, currentMenus = {}) {
	return {
		type: ENTITY_DEAL_ENTITY,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/user/dealSysMenu', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType,
					menuList: [currentMenus],
				},
			}),
		},
	};
}




//init_edit_entity(修改实体前初始化信息)
export function initEditEntity (currentMenus = {}, currentPage = 1) {
	return {
		type: ENTITY_INIT_EDIT_ENTITY,
		payload: { currentMenus, currentPage },
	};
}



//QRY_SYS_MENU(系统菜单查询)
export function qrySysMenu (currentEntity = {}, currentPage = 1) {
	return {
		type: QRY_SYS_MENU,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/user/qrySysMenu', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					sysMenu: currentEntity
				},
			}),
		},
	};
}



//SYS_ENTITY_BUTTON_BEAN(系统功能查询接口)
export function SysEntityButtonBean (currentEntity = {}, currentPage = 1) {
	return {
		type: SYS_ENTITY_BUTTON_BEAN,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/user/qrySysButton', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					sysButton: currentEntity
				},
			}),
		},
	};
}



//Edit_DEAL_ENTITY(系统功能查询接口)
export function EditEntity (operType, currentEntity = {}) {
	return {
		type: Edit_DEAL_ENTITY,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/user/dealSysMenu', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType,
					menuList: [currentEntity],
				},
			}),
		},
	};
}



//初始化当前实体
export function initSysEntityButton (currentSysbutton = {}, currentPage) {
	return {
		type: INIT_SYS_BOTTTON,
		payload: { currentSysbutton, currentPage },
	};
}


//修改，删除，新增管理系统功能
export function dealSysButton (operType, currentSysButton = {}) {
	return {
		type: Edit_DEAL_SYS_BUTTON,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/user/dealSysButton', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType,
					buttonList: [currentSysButton],
				},
			}),
		},
	};
}




