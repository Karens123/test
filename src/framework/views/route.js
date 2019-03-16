'use strict';

const willExports = {
	Login: '/login',
	Help: '/help',
	Logout: '/logout',
	Setting: '/seting',
	ModiInfor: '/modiinfor',
	IframeModule: address => !address
		? '/module/iframe/:address'
		: `/module/iframe/${address}`,
};
willExports.LoginOauth = `${willExports.Login}/oauth/`;
willExports.LoginOauthWithProvider = `${willExports.LoginOauth}:provider`;
/*eslint-disable no-multi-assign*/
module.exports  = willExports;
