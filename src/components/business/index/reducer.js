'use strict';

import * as Immutable from 'immutable';

import * as actions from 'action';

export default function jewelInfor (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		//1. main 数据入口
		case `${actions.JEWEL_ALL_LIST_INIT_INFO}_SUCCESS`:
			return state.set('jewelInfoList', ret.records);


		//3. 初始化修改珠宝
		case actions.INIT_CURRENT_JEWEL_INFOR:
			let currentJewelData = [];
			if (currentJewelData) {
				currentJewelData = ret;
			}
			return state.set('currentJewelData', currentJewelData).delete('rspInfo');

		//4.修改珠宝
		case `${actions.EDIT_JEWEL_INFOR}_SUCCESS`:

		//5.删除珠宝
		case `${actions.DEL_JEWEL_INFOR}_SUCCESS`:
			return state.delete('currentObj');

		//6. 珠宝图片
		case `${actions.JEWEL_ALL_IMG_INFOR}_SUCCESS`:
			return state.set('JewelPicList', ret.records);

		//7. 初始化珠宝图片
		case actions.INIT_JEWEL_PHTO_INFOR:
			return state.set('SeletCurrentPic', ret);
		//注：此处一定要定义currentAppName 为编辑页面供用

		//8. 修改当前珠定初始化后的图片
		case `${actions.EDIT_JEWEL_PHTO_INFOR}_SUCCESS`:

		//9.删除珠宝图片
		case `${actions.DEL_JEWEL_PHTO_INFOR}_SUCCESS`:
			return state.delete('currentImgObj');

		// 10. add珠宝图传递旧数据
		case actions.ADD_JEWEL_PHTO_INFOR:
			return state.set('currentJewel', ret).set('JewelPicList', ret.JewelPicList);

		default:
			return state;
	}
};
