'use strict';

/** 定义form中的字段名 **/
/*eslint-disable no-multi-assign*/
module.exports = exports = {};
exports.titleFN = 'title'; //通知标题
exports.bodyFN = 'body';   //通知内容
exports.pushBigTypeFN = 'pushBigType'; // 通知大类
exports.pushTypeFN = 'pushType'; // 通知小类
exports.androidOpenTypeFN = 'androidOpenType'; //点击通知后动作,1:打开应用 2: 打开应用Activity 3:打开 url 4 : 无跳转逻辑
exports.androidActivityFN = 'androidActivity';//Android打开的activity
exports.androidOpenUrlFN = 'androidOpenUrl';//Android打开的url,Android收到推送后打开对应的url,仅仅当androidOpenType=3有效
exports.customExtParamsItemsFN = 'customExtParamsItems';//自定义扩展字段的item号
exports.isCustomExtParamsFN = 'isCustomExtParams';
exports.isIosAddOpenUrlFN = 'isIosAddOpenUrl';
exports.notifyTypeFN = 'notifyType';//0：静音，1：振动，2：声音，3：声音和振动
exports.targetFN = 'target';//推送目标: device:推送给设备; account:推送给指定帐号, tag:推送给自定义标签; all: 推送给全部
exports.targetValueFN = 'targetValue';// 根据Target来设定，多个值使用逗号分隔，最多支持100个。
// Target=device，值如deviceid111,deviceid1111
// Target=account，值如account111,account222
// Target=alias，值如alias111,alias222
// Target=tag，支持单Tag和多Tag，格式请参考标签格式
// Target=all，值为all
exports.isSetPushTimeFN = 'isSetPushTime';//是否设置推送时间
exports.pushTimeDatePickerFN = 'pushTimeDatePicker';//是否设置推送日期
exports.pushTimeTimePickerFN = 'pushTimeTimePicker';//是否设置推送时间
exports.isStoreOfflineFn = 'storeOffline';//是否设置离线保存，默认保存
exports.expireTimeFN = 'expireTime';//配合isStoreOffline，默认保存72小时
exports.apnsEnvFN = 'apnsEnv';//IOS apns推送环境
exports.remindFN = 'remind';
/*推送时设备不在线（
 即与移动推送的服务端的长连接通道不通），则这条推送会做为通知，通过苹果的APNs通道
 送达一次(发送通知时,Summary为通知的内容,Message不起作用)。注意：离线消息转通知仅适用于生产环境*/
exports.androidNotificationChannelFN = 'androidNotificationChannel';