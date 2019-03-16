'use strict';

/*eslint-disable no-multi-assign*/
const exports = module.exports = {};

exports.SysUserAdmin = '/admin/userAdmin';
exports.SysUserEdit = `${exports.SysUserAdmin}/edit`;
exports.SysUserAdminTemp = `${exports.SysUserAdmin}/:page`;
exports.SysUserAdd = `${exports.SysUserEdit}/:prepage`;
exports.SysUserEditByUserId = `${exports.SysUserEdit}/:prepage/:userId`;

exports.Tenantadmin = '/admin/Tenantadmin';
exports.TenantEdit = `${exports.Tenantadmin}/TenantEdit`;
exports.TenantAdd = `${exports.Tenantadmin}/add`;

exports.RoleAdmin = '/admin/roleadmin';
exports.RoleEdit = `${exports.RoleAdmin}/edit`;
exports.RoleAdd = `${exports.RoleAdmin}/add`;
exports.RoleAddTemp = `${exports.RoleAdd}/:prepage`;
exports.RoleEditById = `${exports.RoleEdit}/:prepage/:role`;
exports.RoleAdminTemp = `${exports.RoleAdmin}/:page`;

exports.EntityAdmin = '/admin/entityadmin';
exports.EntityEdit = `${exports.EntityAdmin}/edit`;
exports.EntityEditById = `${exports.EntityEdit}/:prepage/:entity`;
exports.EntityAdd = `${exports.EntityEdit}/:prepage`;
exports.EntityAdminTemp = `${exports.EntityAdmin}/:page`;

exports.buttonAdmin = '/admin/buttonAdmin';

exports.SysbuttonEdit = `${exports.buttonAdmin}/edit`;
exports.SysbuttonAdd = `${exports.buttonAdmin}/add`;

exports.AppTypeAdmin = '/config/appkindconfig';
exports.AppTypeEdit = `${exports.AppTypeAdmin}/edit`;
exports.AppTypeAdminTemp =`${exports.AppTypeAdmin}/:page`;
exports.AppTypeAdd = `${exports.AppTypeEdit}/:prepage`;
exports.AppTypeEditByAppType = `${exports.AppTypeEdit}/:prepage/:appType`;

exports.DiscoveryTypeAdmin = '/config/discoverytype';
exports.DiscoveryTypeEdit = `${exports.DiscoveryTypeAdmin}/edit/`;
exports.DiscoveryTypeEditById = `${exports.DiscoveryTypeEdit}:discoveryTypeId`;
exports.DiscoveryAdmin = '/config/discovery';
exports.DiscoveryAdd = `${exports.DiscoveryAdmin}/add/`;
exports.DiscoveryAddByDiscoveryTypeId = `${exports.DiscoveryAdd}:discoveryTypeId`;
exports.DiscoveryEdit = `${exports.DiscoveryAdmin}/edit/`;
exports.DiscoveryEditById = `${exports.DiscoveryEdit}:discoveryId`;

exports.AppStaticResAdmin = '/config/appstaticresadmin';
exports.AppStaticResEdit = `${exports.AppStaticResAdmin}/edit/`;
exports.AppStaticResEditById = `${exports.AppStaticResEdit}:id`;
exports.AppStaticResItemAdmin = '/config/appstaticresitem';
exports.AppStaticResItemAdd = `${exports.AppStaticResItemAdmin}/add/`;
exports.AppStaticResItemAddByResId = `${exports.AppStaticResItemAdd}:appResourceId`;
exports.AppStaticResItemEdit = `${exports.AppStaticResItemAdmin}/edit/`;
exports.AppStaticResItemEditById = `${exports.AppStaticResItemEdit}:id`;
exports.HardwareStatistic = '/appstatistic/hardwarestatistic/';


exports.DeviceIncreStatAdmin = '/deviceincrestat/DeviceIncreStatAdmin/';
exports.DeviceAttrStatAdmin = '/deviceattrstat/DeviceAttrStatAdmin/';
exports.UserAttrStatAdmin = '/userattrstat/UserAttrStatAdmin/';
exports.UserIncreStatAdmin = '/userincrestat/userStatisticAnalysis';

exports.ErrorLogAdmin = '/errormanagement';
exports.ErrorLogEdit = `${exports.ErrorLogAdmin}/edit/`;
exports.ErrorLogEditById = `${exports.ErrorLogEdit}:recId`;

exports.DeviceActivationAdmin = '/deviceactivationmanagement';

exports.OpinionAdmin = '/opinionadmin';
exports.OpinionAdminEdit = `${exports.OpinionAdmin}/edit`;
exports.OpinionAdminTemp = `${exports.OpinionAdmin}/:page`;
exports.OpinionAdminEditByAdviceRecId = `${exports.OpinionAdminEdit}/:prepage/:adviceRecId`;

exports.PushNotification = '/pushadmin/pushnotification';
exports.PushMessage = '/pushadmin/pushmessage';

exports.MessageRecord = '/pushadmin/messagerecord';
exports.MessageStatistic = `${exports.MessageRecord}/messagestatistic`;
exports.MessageStatisticByResponseId = `${exports.MessageStatistic}:responseId`;

exports.NotificationRecord = '/pushadmin/notificationrecord';
exports.NotificationStatistic = `${exports.NotificationRecord}/notificationstatistic/`;
exports.NotificationStatisticByResponseId = `${exports.NotificationStatistic}:responseId`;

/** 静态数据配置 **/
exports.StaticData = '/config/staticdata';
exports.StaticDataEdit = `${exports.StaticData}/edit`;
exports.StaticDataTemp = `${exports.StaticData}/:page`;
exports.StaticDataAdd = `${exports.StaticDataEdit}/:prepage`;
exports.StaticDataEditById = `${exports.StaticDataEdit}/:prepage/:codeType`;

/** H5页面配置 **/
exports.H5Admin = '/config/h5admin';
exports.H5Edit = `${exports.H5Admin}/edit`;
exports.H5EditById = `${exports.H5Edit}/:codeType`;

exports.VersionAdmin = '/config/versionadmin';
exports.VersionEdit = `${exports.VersionAdmin}/edit`;
exports.VersionAdminTemp = `${exports.VersionAdmin}/:page`;
exports.VersionAdd=`${exports.VersionEdit}/:prepage`;
exports.VersionEditById = `${exports.VersionEdit}/:prepage/:versionId`;

exports.statistic = '/appstatistic/userstatistic/';
exports.statUserRetain = '/appstatistic/statuserretain/';
exports.HardwareConnectStatisticDetail = '/appstatistic/HardwareConnectStatisticDetail/';

/** 珠宝配置 **/
exports.JewelAdmin = '/config/jewel';
exports.JewelEditImgUpdate = '/config/jewel';
exports.JewelEdit = `${exports.JewelAdmin}/edit/`;
exports.JewelEditById = `${exports.JewelEdit}/:prepage/:edit`;
exports.JewelEditImg = `${exports.JewelAdmin}/jewelimgedit`;
exports.JewelAddImg = `${exports.JewelEditImg}/add/:prepage`;
exports.JewelEditImgById = `${exports.JewelEditImg}/:prepage/:edit`;
exports.JewelAdd = `${exports.JewelAdmin}/add`;
exports.JewelAddTemp = `${exports.JewelAdd}/:prepage`;
exports.JewelAdminTemp = `${exports.JewelAdmin}/:page`;

/* 产品配置 **/
exports.ProdAdmin = '/config/prodtype';
exports.ProdEdit = `${exports.ProdAdmin}/edit`;
exports.ProdAdminTemp = `${exports.ProdAdmin}/:page`;
exports.ProdAdd = `${exports.ProdEdit}/:prepage`;
exports.ProdEditById = `${exports.ProdEdit}/:prepage/:prodId`;

exports.ProdPicAdmin = '/config';
exports.ProdPicAdd = `${exports.ProdPicAdmin}/add`;
exports.ProdPicAddByProdId = `${exports.ProdPicAdd}/:prepage/:prodId`;
exports.ProdPicEdit = `${exports.ProdPicAdmin}/edit`;
exports.ProdPicEditById = `${exports.ProdPicEdit}/:prepage/:prodPicId`;

/** 设备配置 **/
exports.DeviceAdmin = '/config/device';
exports.DeviceGen = `${exports.DeviceAdmin}/gen`;
exports.DeviceImportByExcel = `${exports.DeviceAdmin}/import/excel`;

//用户日志下载
exports.AppLogDataDownload = '/applogdatadownload';

//商家分析与统计
exports.Userareaadmin = '/userareaadmin/Userareaadmin';


//入驻审核
exports.dreamworks = '/admin/dreamworks';
exports.EnterExamineAdmin = `${exports.dreamworks}/examineadmin`;
exports.EnterExamineAdminTemp = `${exports.EnterExamineAdmin}/:page/:dataType`;
exports.WorksDetails = `${exports.EnterExamineAdmin}/WorksDetails`;
exports.WorksDetailsTemplsteID = `${exports.WorksDetails}/:worksId/:page/:dataType`;
exports.DemandDetails = `${exports.EnterExamineAdmin}/demandDetails`;
exports.DemandDetailsById = `${exports.EnterExamineAdmin}/demandDetails/:page/:DemandId`;



exports.qryApplicationAdmin=`${exports.dreamworks}/allApplication`;
exports.qryApplicationAdminTemplate=`${exports.qryApplicationAdmin}/:page/:dataType`;
exports.qryApplicationDsn = `${exports.qryApplicationAdmin}/designer`;
exports.qryApplicationDsnById = `${exports.qryApplicationDsn}/:wenwenId/:page/:dataType`;
exports.qryApplicationBsn = `${exports.qryApplicationAdmin}/business`;
exports.qryApplicationBsnById = `${exports.qryApplicationBsn}/:wenwenId/:page/:dataType`;

exports.AllBusinessAdmin=`${exports.dreamworks}/business`;
exports.AllBusinessAdminTemp=`${exports.AllBusinessAdmin}/:page`;




exports.QryBusinessDetail=`${exports.AllBusinessAdmin}/d`;
exports.QryBusinessDetailById=`${exports.QryBusinessDetail}/:prepage/:cid`;
exports.QryBusinessDetailByIdTemp=`${exports.QryBusinessDetailById}/:prepage/:tapNumber`;


exports.QryDemand=`${exports.dreamworks}/demand`;
exports.QryDemandById=`${exports.QryDemand}/:cid`;
exports.QryDemandByIdBack=`${exports.QryDemand}/:cid/:page/:dataType`;

//全部设计师
exports.AllDesignerAdmin=`${exports.dreamworks}/AllDesigner`;
exports.AllBusinessesAdmin = `${exports.dreamworks}/userAdmin/allbusinesses`;
exports.AllDesignerAdminTemp=`${exports.AllDesignerAdmin}/:page`;
exports.QryDesignerDetail=`${exports.AllDesignerAdmin}/d`;
exports.QryDesignerDetailById=`${exports.QryDesignerDetail}/:page/:cid`;
exports.designerDetail=`${exports.dreamworks}/AllDesigner`;

//需求管理
exports.allDemandDetails='/admin/dreamworks/demandDetails';
exports.alldemandAdmin='/admin/dreamworks/demandadmin';
exports.alldemandAdminById = `${exports.alldemandAdmin}/:page/:dataType`;
exports.demandDetailsById = `${exports.allDemandDetails}/:demandId/:page/:dataType`;


//外部链接
exports.dreamworks='wenwen-tech.com:3200';
exports.designerDetailOutLink=`${exports.dreamworks}/pc-index/designer_detail/designerList`;
exports.designerDetailById=`${exports.designerDetailOutLink}/:designerId`;


//收入
exports.income='/admin/dreamworks/income';
exports.incomeDemandDetails='/admin/dreamworks/income/IncomeDemandDetails';
exports.incomeAdminById=`${exports.incomeDemandDetails}/:entityId`;
exports.payoff='/admin/dreamworks/payoff';

//结算
exports.settlementadmin='/admin/dreamworks/settlementadmin';

//收付明细
exports.payincomedetailadmin='/admin/dreamworks/payincomedetail';
exports.payincomedetailadmin='/admin/dreamworks/payincomedetail';
exports.Payincomelist=`${exports.payincomedetailadmin}/Payincomelist`;
exports.PayincomelistById=`${exports.Payincomelist}/:page/:dataType`;

//财务总结
exports.financialSummary='/financialsummary';


//共享珠宝
exports.share='/admin/share';
exports.goodsAdmin=`${exports.share}/goods`;


exports.goodsAdminById=`${exports.goodsAdmin}/list/:page/:goodsId/:fileType`;
exports.orderAdmin=`${exports.share}/orderAdmin`;
exports.goodsAdminDetail=`${exports.goodsAdmin}/detail`;

exports.orderAdminType=`${exports.orderAdmin}/:type/:tableType/:page/:filter`;
exports.OrderAdminDetail=`${exports.share}/OrderAdminDetail`;
exports.OrderAdminDetailId=`${exports.OrderAdminDetail}/:Id/:step`;
exports.OrderAdminDetailOrderId=`${exports.OrderAdminDetail}/:Id`;
exports.OrderLogisticsDetails=`${exports.OrderAdminDetail}/LogisticsDetails`;
exports.OrderLogisticsDetailsid=`${exports.OrderLogisticsDetails}/:buinessName/:logisticsTradeNo/:orderId`;

exports.goodsAdminDetailAddOrigin=`${exports.goodsAdminDetail}/add`;
exports.goodsAdminDetailAdd=`${exports.goodsAdminDetailAddOrigin}/:callbackUrl`;
exports.goodsAdminDetailEditBase=`${exports.goodsAdminDetail}/edit`;
exports.goodsAdminDetailEdit=`${exports.goodsAdminDetailEditBase}/:goodsId/:callbackUrl`;

//佛云
exports.purchaseOrderAdmin='/admin/prayer/orderadmin';
exports.purchaseOrderAdminId=`${exports.purchaseOrderAdmin}/:page/:fileType/:dataType`;
exports.purchaseOrderDetail=`${exports.purchaseOrderAdmin}/detail`;
exports.purchaseOrderDetailId=`${exports.purchaseOrderAdmin}/detail/:orderId/:page/:fileType/:dataType`;

exports.placingOrderAdmin='/admin/prayer/placing';
exports.placingOrderAdminId=`${exports.placingOrderAdmin}/:page/:fileType/:dataType`;
exports.placingOrderDetail=`${exports.placingOrderAdmin}/detail`;
exports.placingOrderDetailId=`${exports.placingOrderAdmin}/detail/:orderId/:page/:fileType/:dataType`;

exports.beadsApplicationAdmin='/admin/prayer/beads/application/admin';
exports.beadsApplicationDetail=`${exports.beadsApplicationAdmin}/detail`;
exports.beadsApplicationDetailById=`${exports.beadsApplicationAdmin}/detail/:applicationId`;

exports.donationUserAdmin='/admin/prayer/donation';
exports.prayerActivityAdmin='/admin/prayer/activity/admin';
exports.prayerActivityAdd=`${exports.prayerActivityAdmin}/add`;
exports.prayerActivityEdit=`${exports.prayerActivityAdmin}/edit/`;
exports.prayerActivityEditById=`${exports.prayerActivityEdit}:activityId`;
exports.prayerActivityDetail=`${exports.prayerActivityAdmin}/detail`;
exports.prayerActivityDetailAdd=`${exports.prayerActivityDetail}/add/`;
exports.prayerActivityDetailAddByActivityId=`${exports.prayerActivityDetailAdd}:activityId`;
exports.prayerActivityDetailEdit=`${exports.prayerActivityDetail}/edit/`;
exports.prayerActivityDetailEditById=`${exports.prayerActivityDetailEdit}:activityId/:locale`;
