'use strict';

/** 成功调用的Result_Code返回值*/
export const REST_OK = 0;
export const REST_ERR_AUTHENTICATION = -500;
export const REST_ERR_USER_AUTH_STATE = -20;
export const REST_ERR_DATA_REPEAT = -60;

/**状态**/
export const STATE_U = 'U';//正常
export const STATE_E = 'E';//禁用

/**平台级**/
export const PLATFORM_ADMIN = -999;

//新增
export const OPER_TYPE_ADD = 1;
//修改
export const OPER_TYPE_EDIT = 2;
//删除
export const OPER_TYPE_DELETE = 3;

//gitlab 应用名称
console.log('process.env.isDev', process.env.isDev,
	', process.env.isDev == true: ', process.env.isDev == true);
export const GITLAB_APP_NAME = process.env.isDev == true
	? 'wenwen-app-admin-dev'
	: 'wenwen-app-admin';
//系统用户提供商
export const SYS_USER_PROVIDER_ADMIN = 'admin';
//oauth服务商 gitlab
export const OAUTH_PROVIDER_GITLAB = '1';

//菜单
export const ENT_TYPE_MENU = 1;
export const ENT_TYPE_BUTTON = 2;

//应用静态资源类型
export const RESOURCE_TYPE_IMAGE = '0';
export const RESOURCE_TYPE_MEDIA = '1';
export const RESOURCE_TYPE_TYPEFACE = '2';

export const WENWEN_BASE_API = process.env.WENWEN_API_BASE_URL;

//用户国家代码
export const USER_COUNTRY_ATTR_CODE = 'USER_COUNTRY_ATTR_CODE';
