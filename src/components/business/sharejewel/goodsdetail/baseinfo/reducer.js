'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function ImgUpLoad (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		case `${actions.QRY_GOODS_LIST}_SUCCESS`:{
			return state.set('imglist', ret);
		}
		default:
			return state;
	}
}


