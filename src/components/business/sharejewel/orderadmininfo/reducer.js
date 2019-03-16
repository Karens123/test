'use strict';

import * as Immutable from 'immutable';
import * as actions from 'action';

export default function OrderDetailReducer (state = Immutable.Map(), action = {}) {
	const ret = action.payload;
	switch (action.type) {
		//查询设计师申请列表

		case `${actions.ORDER_DETAIL_INFO}_SUCCESS` :{
			return state.set('OK');
		}

		case `${actions.QRY_ORDER_ALL}_SUCCESS` :{
			return state.set('OrderAll', ret).set('self',{ address: '节能科技园xxxxxxxx' });
			// return state.set('OrderAll', ret);

		}

		case `${actions.QRY_ALLBUSINESS}_SUCCESS`:{
			console.log('here we go',ret);
			return state.set('allBusiness', ret);
		}


		case actions.ORDER_BACK_GOODS_SUBMIT :{
			return state.set('backgoods', ret);
		}

		case `${actions.ORDER_NOTICE_RETURN}_SUCCESS` :{
			return state.set('returnSucess',ret);
		}

		case `${actions.ORDER_CANCEL_RETURN_PAY}_SUCCESS` :{
			// return state.set('returnSucess',ret);
		}

		default:
			return state;
	}
}