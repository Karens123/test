'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory, IndexRedirect, Route, Router } from 'react-router';

import { LocaleProvider } from 'antd';

import { addLocaleData, IntlProvider } from 'react-intl';
import * as AppLocaleData from 'src/locales/AppLocaleData';

import configureStore from 'store/configureStore';
import frameworkRoute from 'framework/views/route';

import businessRoute from 'business/route';
import App from 'framework/views/App';
//修改密码, 修改密码视图
import InforSeting from 'framework/views/AccountSeting/Seting';
import ModiInfor from 'framework/views/AccountSeting/ModiInfor';
//登录DiscoveryTypeEdit
import Login from 'framework/views/Login';
import Logout from 'framework/views/Logout';
//iframe嵌入外网模块
import IframeModule from 'framework/views/IframeModule';
//帮助
import Help from 'framework/views/Help';
import Demo from 'business/demo/Demo';
import Index from 'business/index/index';
import SysUserAdmin from 'business/useradmin/SysUserAdmin';
import SysUserEdit from 'business/useradmin/SysUserEdit';
import TenantAdmin from 'business/Tenantadmin/TenantAdmin';
import TenantEdit from 'business/Tenantadmin/TenantEdit';
import RoleAdmin from 'business/roleadmin/RoleAdmin';
import RoleEdit from 'business/roleadmin/RoleEdit';
import EntityAdmin from 'business/entityadmin/EntityAdmin';
import EntityEdit from 'business/entityadmin/EntityEdit';
import EntityAdd from 'business/entityadmin/EntityAdd';
import SysButtonAdmin from 'business/entityadmin/SysButtonAdmin';
import SysButtonEdit from 'business/entityadmin/SysButtonEdit';

import AppTypeAdmin from 'business/apptypeadmin/AppTypeAdmin';
import AppTypeEdit from 'business/apptypeadmin/AppTypeEdit';

import ProdAdmin from 'business/prodtype/ProdAdmin';
import ProdEdit from 'business/prodtype/ProdEdit';
import ProdPicEdit from 'business/prodtype/ProdPicEdit';

import DiscoveryEdit from 'business/discovery/DiscoveryEdit';
import DiscoveryTypeEdit from 'business/discovery/DiscoveryTypeEdit';
import DiscoveryTypeAdmin from 'business/discovery/DiscoveryTypeAdmin';

import AppStaticResItemEdit from 'business/appstaticresadmin/AppStaticResItemEdit';
import AppStaticResEdit from 'business/appstaticresadmin/AppStaticResEdit';
import AppStaticResAdmin from 'business/appstaticresadmin/AppStaticResAdmin';

import JewelAdmin from 'business/jewel/JewelAdmin';
import JewelEdit from 'business/jewel/JewelEdit';
import JewelImgEdit from 'business/jewel/JewelImgEdit';
//静态数据配置
import StaticDataAdmin from 'business/staticdata/StaticDataAdmin';
import StaticDataEdit from 'business/staticdata/StaticDataEdit';
//H5页面配置
import H5Admin from 'business/h5admin/H5Admin';
import H5Edit from 'business/h5admin/H5Edit';

import VersionAdmin from 'business/versionadmin/VersionAdmin';
import VersionEdit from 'business/versionadmin/VersionEdit';
//统计
import StatisticIndex from 'business/appstatistic/StatisticAdmin';
import SysMsgList from 'business/appstatistic/SysMsgList';
import HardwareStatistic from 'business/appstatistic/HardwareStatistic';
import UserStatistic from 'business/appstatistic/UserStatistic';
import StatUserRetain from 'business/appstatistic/StatUserRetain';
import HardwareConnectStatisticDetail from 'business/appstatistic/HardwareConnectStatisticDetail';
//错误日志
import ErrorLogAdmin from 'business/errorlogadmin/ErrorLogAdmin';
import ErrorLogEdit from 'business/errorlogadmin/ErrorLogEdit';
import OpinionAdmin from 'business/opinionadmin/OpinionAdmin';
import OpinionEdit from 'business/opinionadmin/OpinionEdit';
//设备激活管理
import DeviceActivationAdmin from 'business/deviceactivationadmin/DeviceActivationAdmin';
//推送管理
import PushNotification from 'business/pushadmin/PushNotification';
import PushMessage from 'business/pushadmin/PushMessage';
import NotificationRecord from 'business/pushadmin/NotificationRecord';
import MessageRecord from 'business/pushadmin/MessageRecord';
import PushInfoStatistic from 'business/pushadmin/PushInfoStatistic';
//设备配置
import Device from 'business/device/DeviceAdmin';
import DeviceGen from 'business/device/DeviceGen';
import DeviceImportByExcel from 'business/device/DeviceImportByExcel';
//设备增长分析
import DeviceIncreStatAdmin from 'business/deviceincrestat/DeviceIncreStatAdmin';
//设备属性分析
import DeviceAttrStatAdmin from 'business/deviceattrstat/DeviceAttrStatAdmin';
//用户属性分析
import UserAttrStatAdmin from 'business/userattrstat/UserAttrStatAdmin';
//用户增长分析
import UserIncreStatAdmin from 'business/userincrestat/UserStatisticAnalysisAdmin';
//应用日志下载
import AppLogDataDownload from 'business/applogdatadownload';
//例子
import MyAlert from 'example/Alert';
import MyExample from 'example';
import MyBadge from 'example/Badge';
import MyButton from 'example/Button';
import MyForm from 'example/Form';
import MyUpload from 'example/Upload';
//商家分析与统计
import Userareaadmin from 'business/userareaadmin/Userareaadmin';

//梦工厂
import qryApplicationAdmin from 'business/dreamworks/qryApplication/qryApplicationAdmin';
import EnterExamineAdmin from 'business/dreamworks/examineadmin/EnterExamineAdmin';
import qryApplyBusiness from 'business/dreamworks/qryApplication/qryApplyBusiness';
import qryApplyDesigner from 'business/dreamworks/qryApplication/qryApplyDesigner';
import WorksDetails from 'business/dreamworks/examineadmin/WorksDetails';
import AllBusinessAdmin from 'business/dreamworks/allbusiness';
import QryBusinessDetail from 'business/dreamworks/allbusiness/qrybusinessdetail';
import QryDesignerDetail from 'business/dreamworks/alldesigner/qrydesignerdetail';
import Pendingsettlementadmin from 'business/dreamworks/pendingsettlementadmin';
import Payincomedetailadmin from 'business/dreamworks/payincomedetail/Payincomedetailadmin';
import Payincomelist from 'business/dreamworks/payincomedetail/Payincomelist';



import AllDesigner from 'business/dreamworks/alldesigner';
import QryDemand from 'business/dreamworks/qrydemand';
import DemandDetails from 'business/dreamworks/examineadmin/DemandDetails';
import DemandAdmin from 'business/dreamworks/demandadmin/DemandAdmin';
import AllDemandDetails from 'business/dreamworks/demandadmin/AllDemandDetails';
import IncomeAdmin from 'business/dreamworks/incomeadmin';
import PayAdmin from 'business/dreamworks/payadmin';
import IncomeDemandDetails from 'business/dreamworks/incomeadmin/IncomeDemandDetails';
//财务汇总
import FinancialSummary from 'business/financialsummary/FinancialSummary';

//共享珠宝
import GoodsAdmin from 'business/sharejewel/goodsadmin';
// import OrderAdmin from 'business/sharejewel/orderadmin';
import ShareJewelOrderAdmin from 'business/sharejewel/orderadmin/ShareJewelOrderAdmin';
import OrderAdminDetail from 'business/sharejewel/orderadmininfo/OrderAdminDetail';
import ShareGoodsDetail from 'business/sharejewel/goodsdetail/ShareGoodsDetail';
import ExpressDetailPage from 'business/sharejewel/widget/OrderLogisticsDetails';

//佛云
import PurchaseOrderAdmin from 'business/prayeradmin/buyorderadmin/purchaseOrderAdmin';
import PurchaseOrderDetail from 'business/prayeradmin/buyorderadmin/purchaseOrderDetaill';
import PlacingOrderAdmin from 'business/prayeradmin/placingordersadmin/placingOrderAdmin';
import PlacingOrderDetail from 'business/prayeradmin/placingordersadmin/placingOrderDetaill';

import BeadsApplicationAdmin from 'business/prayeradmin/beadsapplicationadmin/BeadsApplicationAdmin';
import BeadsApplicationDetail from 'business/prayeradmin/beadsapplicationadmin/BeadsApplicationDetaill';
import DonationUseAdmin from 'business/prayeradmin/donationuseadmin/DonationUseAdmin';
import PrayerActivityAdmin from 'business/prayeradmin/activityadmin/PrayerActivityAdmin';
import PrayerActivityEdit from 'business/prayeradmin/activityadmin/PrayerActivityEdit';
import PrayerActivityDetailEdit from 'business/prayeradmin/activityadmin/PrayerActivityDetailEdit';


const store = configureStore();

addLocaleData(AppLocaleData.data);

ReactDOM.render(
	<Provider store={store}>
		<LocaleProvider locale={AppLocaleData.antd}>
			<IntlProvider locale={AppLocaleData.locale} messages={AppLocaleData.messages}>
				<Router history={browserHistory}>
					<Route path="/">
						<IndexRedirect to="home" />
						<Route component={App}>
							<Route path="home" component={Index} />
							<Route path={businessRoute.AppTypeAdmin} component={AppTypeAdmin} />
							<Route path={businessRoute.AppTypeAdminTemp} component={AppTypeAdmin} />
							<Route path={businessRoute.AppTypeEditByAppType} component={AppTypeEdit} />
							<Route path={businessRoute.AppTypeAdd} component={AppTypeEdit} />

							<Route path={businessRoute.ProdAdmin} component={ProdAdmin} />
							<Route path={businessRoute.ProdEdit} component={ProdEdit} />
							<Route path={businessRoute.ProdAdd} component={ProdEdit} />
							<Route path={businessRoute.ProdAdminTemp} component={ProdAdmin} />
							<Route path={businessRoute.ProdEditById} component={ProdEdit} />
							<Route path={businessRoute.ProdPicAddByProdId} component={ProdPicEdit} />
							<Route path={businessRoute.ProdPicEditById} component={ProdPicEdit} />

							<Route path={businessRoute.DiscoveryTypeAdmin} component={DiscoveryTypeAdmin} />
							<Route path={businessRoute.DiscoveryTypeEdit} component={DiscoveryTypeEdit} />
							<Route path={businessRoute.DiscoveryTypeEditById} component={DiscoveryTypeEdit} />
							<Route path={businessRoute.DiscoveryAddByDiscoveryTypeId} component={DiscoveryEdit} />
							<Route path={businessRoute.DiscoveryEditById} component={DiscoveryEdit} />

							<Route path={businessRoute.AppStaticResAdmin} component={AppStaticResAdmin} />
							<Route path={businessRoute.AppStaticResEdit} component={AppStaticResEdit} />
							<Route path={businessRoute.AppStaticResEditById} component={AppStaticResEdit} />
							<Route path={businessRoute.AppStaticResItemAddByResId} component={AppStaticResItemEdit} />
							<Route path={businessRoute.AppStaticResItemEditById} component={AppStaticResItemEdit} />

							<Route path={businessRoute.JewelAdmin} component={JewelAdmin} />
							<Route path={businessRoute.JewelAdminTemp} component={JewelAdmin} />
							<Route path={businessRoute.JewelAdd} component={JewelEdit} />
							<Route path={businessRoute.JewelAddTemp} component={JewelEdit} />
							<Route path={businessRoute.JewelEditById}  component={JewelEdit} />
							<Route path={businessRoute.JewelAddImg} component={JewelImgEdit} />
							<Route path={businessRoute.JewelEditImgById} component={JewelImgEdit} />



							<Route path={businessRoute.SysUserAdmin} component={SysUserAdmin} />
							<Route path={businessRoute.SysUserAdminTemp} component={SysUserAdmin} />
							<Route path={businessRoute.SysUserAdd} component={SysUserEdit} />
							<Route path={businessRoute.SysUserEditByUserId} component={SysUserEdit} />

							<Route path={businessRoute.RoleAdmin} component={RoleAdmin} />
							<Route path={businessRoute.RoleAdd} component={RoleEdit} />
							<Route path={businessRoute.RoleAddTemp} component={RoleEdit} />
							<Route path={businessRoute.RoleEditById} component={RoleEdit} />
							<Route path={businessRoute.RoleAdminTemp} component={RoleAdmin} />

							<Route path={businessRoute.EntityAdmin} component={EntityAdmin} />
							<Route path={businessRoute.EntityAdd} component={EntityAdd} />
							<Route path={businessRoute.EntityEditById} component={EntityEdit} />
							<Route path={businessRoute.EntityAdminTemp} component={EntityAdmin} />

							<Route path={businessRoute.buttonAdmin} component={SysButtonAdmin} />
							<Route path={businessRoute.SysbuttonEdit} component={SysButtonEdit} />
							<Route path={businessRoute.SysbuttonAdd} component={SysButtonEdit} />

							<Route path={businessRoute.StaticData} component={StaticDataAdmin} />
							<Route path={businessRoute.StaticDataAdd} component={StaticDataEdit} />
							<Route path={businessRoute.StaticDataTemp} component={StaticDataAdmin} />
							<Route path={businessRoute.StaticDataEditById} component={StaticDataEdit} />

							<Route path={businessRoute.H5Admin} component={H5Admin} />
							<Route path={businessRoute.H5Edit} component={H5Edit} />
							<Route path={businessRoute.H5EditById} component={H5Edit} />

							<Route path={businessRoute.VersionAdmin} component={VersionAdmin} />
							<Route path={businessRoute.VersionEdit} component={VersionEdit} />
							<Route path={businessRoute.VersionAdminTemp} component={VersionAdmin} />
							<Route path={businessRoute.VersionAdd} component={VersionEdit} />
							<Route path={businessRoute.VersionEditById} component={VersionEdit} />

							<Route path={businessRoute.DeviceAdmin} component={Device} />
							<Route path={businessRoute.DeviceGen} component={DeviceGen} />
							<Route path={businessRoute.DeviceImportByExcel} component={DeviceImportByExcel} />
							<Route path={businessRoute.DeviceIncreStatAdmin} component={DeviceIncreStatAdmin} />
							<Route path={businessRoute.DeviceAttrStatAdmin} component={DeviceAttrStatAdmin} />
							<Route path={businessRoute.UserAttrStatAdmin} component={UserAttrStatAdmin} />
							<Route path={businessRoute.UserIncreStatAdmin} component={UserIncreStatAdmin} />

							<Route path="/admin/example" component={MyExample} />
							<Route path="/admin/example/alert" component={MyAlert} />
							<Route path="/admin/example/badge" component={MyBadge} />
							<Route path="/admin/example/button" component={MyButton} />
							<Route path="/admin/example/form" component={MyForm} />
							<Route path="/admin/example/upload" component={MyUpload} />
							<Route path={frameworkRoute.Help} component={Help} />
							<Route path={frameworkRoute.Setting} component={InforSeting} />
							<Route path={frameworkRoute.ModiInfor} component={ModiInfor} />
							<Route path={frameworkRoute.IframeModule()} component={IframeModule} />
							<Route path={businessRoute.ErrorLogAdmin} component={ErrorLogAdmin} />
							<Route path={businessRoute.ErrorLogEditById} component={ErrorLogEdit} />

							<Route path={businessRoute.OpinionAdmin} component={OpinionAdmin} />
							<Route path={businessRoute.OpinionAdminTemp} component={OpinionAdmin} />
							<Route path={businessRoute.OpinionAdminEditByAdviceRecId} component={OpinionEdit} />

							<Route path={businessRoute.statUserRetain} component={StatUserRetain} />
							<Route path={businessRoute.DeviceActivationAdmin} component={DeviceActivationAdmin} />
							<Route path={businessRoute.PushNotification} component={PushNotification} />
							<Route path={businessRoute.PushMessage} component={PushMessage} />
							<Route path={businessRoute.NotificationRecord} component={NotificationRecord} />
							<Route path={businessRoute.MessageRecord} component={MessageRecord} />
							<Route path={businessRoute.NotificationStatisticByResponseId} component={PushInfoStatistic} />
							<Route path={businessRoute.MessageStatisticByResponseId} component={PushInfoStatistic} />
							<Route path={businessRoute.AppLogDataDownload} component={AppLogDataDownload} />
							<Route path="/appstatistic/statisticadmin" component={StatisticIndex} />
							<Route path="/appstatistic/sysmsglist/" component={SysMsgList} />
							<Route path="/appstatistic/userstatistic/:statistic" component={UserStatistic} />
							<Route path={businessRoute.HardwareStatistic} component={HardwareStatistic} />
							<Route path={businessRoute.HardwareConnectStatisticDetail} component={HardwareConnectStatisticDetail} />
							<Route path={businessRoute.Userareaadmin} component={Userareaadmin} />
							<Route path={businessRoute.Tenantadmin} component={TenantAdmin} />
							<Route path={businessRoute.TenantEdit} component={TenantEdit} />
							<Route path={businessRoute.TenantAdd} component={TenantEdit} />

							{/*<Route path={businessRoute.AllBusinessesAdmin} component={AllBusinessesAdmin} />*/}
							<Route path={businessRoute.qryApplicationAdmin} component={qryApplicationAdmin} />
							<Route path={businessRoute.qryApplicationAdminTemplate} component={qryApplicationAdmin} />
							<Route path={businessRoute.qryApplicationDsnById} component={qryApplyDesigner} />
							<Route path={businessRoute.qryApplicationBsnById} component={qryApplyBusiness} />
							<Route path={businessRoute.EnterExamineAdmin} component={EnterExamineAdmin} />
							<Route path={businessRoute.EnterExamineAdminTemp} component={EnterExamineAdmin} />
							<Route path={businessRoute.WorksDetails} component={WorksDetails} />
							<Route path={businessRoute.WorksDetailsTemplsteID} component={WorksDetails} />

							<Route path={businessRoute.QryDemandByIdBack} component={QryDemand} />

							<Route path={businessRoute.DemandDetailsById} component={DemandDetails} />

							<Route path={businessRoute.QryDemandById} component={QryDemand} />
							<Route path={businessRoute.AllBusinessAdmin} component={AllBusinessAdmin} />
							<Route path={businessRoute.AllBusinessAdminTemp} component={AllBusinessAdmin} />
							<Route path={businessRoute.QryBusinessDetailById} component={QryBusinessDetail} />

							<Route path={businessRoute.AllDesignerAdmin} component={AllDesigner} />
							<Route path={businessRoute.QryDesignerDetail} component={QryDesignerDetail} />
							<Route path={businessRoute.QryDesignerDetailById} component={QryDesignerDetail} />
							<Route path={businessRoute.AllDesignerAdminTemp} component={AllDesigner} />
							{/*<Route path={businessRoute.QryDesignerDetailById} component={QryDesignerDetail} />*/}

							<Route path={businessRoute.alldemandAdmin} component={DemandAdmin} />
							<Route path={businessRoute.alldemandAdminById} component={DemandAdmin} />
							<Route path={businessRoute.demandDetailsById} component={AllDemandDetails} />
							{/*<Route path={businessRoute.demandDetails} component={WorksDetails} />*/}

							<Route path={businessRoute.income} component={IncomeAdmin} />
							<Route path={businessRoute.incomeAdminById} component={IncomeDemandDetails} />

							<Route path={businessRoute.payoff} component={PayAdmin} />
							<Route path={businessRoute.settlementadmin} component={Pendingsettlementadmin} />
							<Route path={businessRoute.payincomedetailadmin} component={Payincomedetailadmin} />
							<Route path={businessRoute.PayincomelistById} component={Payincomelist} />
							<Route path={businessRoute.financialSummary} component={FinancialSummary} />

							<Route path={businessRoute.goodsAdminById} component={GoodsAdmin} />
							<Route path={businessRoute.goodsAdmin} component={GoodsAdmin} />
							<Route path={businessRoute.goodsAdminDetailAdd} component={ShareGoodsDetail} />
							<Route path={businessRoute.goodsAdminDetailEdit} component={ShareGoodsDetail} />
							<Route path={businessRoute.goodsAdminDetailEditBase} component={ShareGoodsDetail} />

							<Route path={businessRoute.OrderAdminDetail} component={OrderAdminDetail} />
							<Route path={businessRoute.OrderAdminDetailId} component={OrderAdminDetail} />
							<Route path={businessRoute.OrderAdminDetailOrderId} component={OrderAdminDetail} />



							<Route path={businessRoute.orderAdminType} component={ShareJewelOrderAdmin} />
							<Route path={businessRoute.OrderLogisticsDetailsid} component={ExpressDetailPage} />
							<Route path={businessRoute.purchaseOrderAdminId} component={PurchaseOrderAdmin} />
							<Route path={businessRoute.purchaseOrderDetailId} component={PurchaseOrderDetail} />
							<Route path={businessRoute.placingOrderAdminId} component={PlacingOrderAdmin} />
							<Route path={businessRoute.placingOrderDetailId} component={PlacingOrderDetail} />
							<Route path={businessRoute.beadsApplicationAdmin} component={BeadsApplicationAdmin} />
							<Route path={businessRoute.beadsApplicationDetailById} component={BeadsApplicationDetail} />

							<Route path={businessRoute.donationUserAdmin} component={DonationUseAdmin} />
							<Route path={businessRoute.prayerActivityAdmin} component={PrayerActivityAdmin} />
							<Route path={businessRoute.prayerActivityAdd} component={PrayerActivityEdit} />
							<Route path={businessRoute.prayerActivityEditById} component={PrayerActivityEdit} />
							<Route path={businessRoute.prayerActivityDetailAddByActivityId} component={PrayerActivityDetailEdit} />
							<Route path={businessRoute.prayerActivityDetailEditById} component={PrayerActivityDetailEdit} />


							<Route path="/dash/examle/:type" component={MyExample} />
							<Route path="/config/datatable" component={Demo} />
						</Route>
					</Route>
					<Route path={frameworkRoute.Login} component={Login} />
					<Route path={frameworkRoute.LoginOauthWithProvider} component={Login} />
					<Route path={frameworkRoute.Logout} component={Logout} />
				</Router>
			</IntlProvider>
		</LocaleProvider>
	</Provider>
	, document.getElementById('root'),
);