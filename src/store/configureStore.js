'use strict';

import { applyMiddleware, createStore } from 'redux';
import { combineReducers } from 'redux-immutable';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'middlewares/promiseMiddleware';
import * as Immutable from 'immutable';
import { FRAMEWORK_LOGOUT } from 'framework/action';

import { AuthService, HelpService, MenuService, SettingService } from 'framework/reducer';
import roleadmin from 'business/roleadmin/reducer';
import SysUserService from 'business/useradmin/reducer';
import entityadmin from 'business/entityadmin/reducer';
import AppTypeService from 'business/apptypeadmin/reducer';
import prodInfor from 'business/prodtype/reducer';
import jewelInfor from 'business/jewel/reducer';
import DiscoveryTypeService from 'business/discovery/reducer';
import AppStaticResService from 'business/appstaticresadmin/reducer';
import StaticDataaAdminService from 'business/staticdata/reducer';
import H5AdminService from 'business/h5admin/reducer';
import versionAdmin from 'business/versionadmin/reducer';
import QryAllDesignerReducer from 'business/dreamworks/alldesigner/reducer';

import appStatistic from 'business/appstatistic/reducer';
import DeviceActivationService from 'business/deviceactivationadmin/reducer';
import ErrorLogService from 'business/errorlogadmin/reducer';
import OpinionService from 'business/opinionadmin/reducer';
import PushService from 'business/pushadmin/reducer';
import DeviceService from 'business/device/reducer';
import TenantService from 'business/Tenantadmin/reducer';
import DeviceIncreStat from 'business/deviceincrestat/reducer';
import DeviceAttrStat from 'business/deviceattrstat/reducer';
import UserAttrStat from 'business/userattrstat/reducer';
import userIncreStatReducer from 'business/userincrestat/reducer';




import QryApplyReducer from 'business/dreamworks/qryApplication/reducer';
// import AllBusinessesReducer from 'business/dreamworks/useradmin/allbusinesses/reducer';
import EnterExamineReducer from 'business/dreamworks/examineadmin/reducer';
import QryBusinessReducer from 'business/dreamworks/allbusiness/reducer';
import QryDemandReducer from 'business/dreamworks/qrydemand/reducer';
import QryBusinessDetail from 'business/dreamworks/allbusiness/qrybusinessdetail/reducer';
import DemandAdminReducer from 'business/dreamworks/demandadmin/reducer';
import qryIcomeReducer from 'business/dreamworks/incomeadmin/reducer';
import qryPayReducer from 'business/dreamworks/payadmin/reducer';
import qryPendingsettlementadminReducer from 'business/dreamworks/pendingsettlementadmin/reducer';
import PayicomedetailReducer from 'business/dreamworks/payincomedetail/reducer';
import OrderDetailReducer from 'business/sharejewel/orderadmininfo/reducer';
import qryPrayOrderReducer from 'business/prayeradmin/buyorderadmin/reducer';
//佛云活動管理
import ActivityService from 'business/prayeradmin/activityadmin/reducer';
//佛云申领申请表管理
import PrayerBeadsApplicationService from 'business/prayeradmin/beadsapplicationadmin/reducer';


import { StaticDataService } from 'business/common/StaticDataService';
import { SysRoleService } from 'business/common/SysRoleService';
import { SysVersionDataService } from 'business/common/SysVersionDataService';

import qryGoodsReducer from 'business/sharejewel/goodsadmin/reducer';


import * as MsgUtil from 'utils/MsgUtil';

import QryShareJewelOrdersReducer from 'business/sharejewel/orderadmin/reducer';

import ShareJewelGoodsDetailReducer from 'business/sharejewel/goodsdetail/reducer';
import ImgUpLoad from 'business/sharejewel/goodsdetail/baseinfo/reducer';


const RootService = (state = Immutable.Map(), action = {}) => {
	const ret = action.payload;
	state = state.set('actionType', action.type);
	if (ret && ret.rspInfo) {
		state = state.set('rspInfo', ret.rspInfo);
	}
	if (/^\w*_ERROR$/.test(action.type)) {
		console.log('errorAction', action.type);
		MsgUtil.showerror('网络访问失败，请稍后重试...');
	}
	return state;
};
const reducers = {
	RootService,
	AuthService,
	MenuService,
	SysUserService,
	roleadmin,
	entityadmin,
	AppTypeService,
	prodInfor,
	jewelInfor,
	DiscoveryTypeService,
	AppStaticResService,
	StaticDataaAdminService,
	H5AdminService,
	versionAdmin,
	HelpService,
	SettingService,
	appStatistic,
	ErrorLogService,
	DeviceActivationService,
	OpinionService,
	PushService,
	DeviceService,
	StaticDataService,
	SysRoleService,
	SysVersionDataService,
	TenantService,
	DeviceIncreStat,
	DeviceAttrStat,
	UserAttrStat,
	// AllBusinessesReducer,
	EnterExamineReducer,
	QryApplyReducer,
	QryAllDesignerReducer,
	QryBusinessReducer,
	QryBusinessDetail,
	QryDemandReducer,
	DemandAdminReducer,
	qryIcomeReducer,
	qryPayReducer,
	qryPendingsettlementadminReducer,
	userIncreStatReducer,
	PayicomedetailReducer,
	qryGoodsReducer,
	OrderDetailReducer,
	QryShareJewelOrdersReducer,
	ShareJewelGoodsDetailReducer,
	ImgUpLoad,
	qryPrayOrderReducer,
	ActivityService,
	PrayerBeadsApplicationService,
};

const appReducer = combineReducers(reducers);//合并所各个reducers变成一个reducer  ，combineReducers:合并reducer

const rootReducer = (state, action) => {
	if (action.type === FRAMEWORK_LOGOUT) {
		state = undefined;
	}
	return appReducer(state, action);
};

//applyMiddleware并createStore创建store
const createStoreWithMiddleware = applyMiddleware(thunkMiddleware,
	promiseMiddleware())(createStore);
window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
export default function configureStore (initialState = Immutable.Map()) {
	if (process.env.NODE_ENV !== 'production') {
		return createStoreWithMiddleware(rootReducer, initialState,
			window.__REDUX_DEVTOOLS_EXTENSION__ &&
			window.__REDUX_DEVTOOLS_EXTENSION__());
	}
	return createStoreWithMiddleware(rootReducer, initialState);
}