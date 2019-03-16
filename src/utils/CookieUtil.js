'use strict';

//清除所有应用cookie
export const clearUserCookie = function () {
	const keys = document.cookie.match(/[^ =;]+(?==)/g);
	if (keys) {
		keys.map(key => clearCookie(key));
	}
};

//设置cookie
const interval30Minute = 24 * 60 * 60 * 1000;//有效时间默认30分钟
export function setCookie (cname, cvalue, intervalTime, path) {
	if (cname === undefined) {
		console.error('cname is undefined');
		return;
	}
	if (cvalue === undefined) {
		cvalue = '';
	}

	const d = new Date();
	const intervalTimeNum = Number(intervalTime);
	if (!isNaN(intervalTimeNum) && intervalTimeNum > interval30Minute) {
		d.setTime(d.getTime() + intervalTimeNum);
	} else {
		d.setTime(d.getTime() + interval30Minute);
	}

	const expires = `expires=${d.toUTCString()}`;
	if (typeof(cvalue) === 'object') {
		cvalue = JSON.stringify(cvalue);
	}

	let ck = `${cname}=${cvalue};${expires}`;
	if (path) {
		ck = `${ck};path=${path}`;
	} else {
		ck = `${ck};path=/`;
	}

	document.cookie = ck;
}

//获取cookie
export function getCookie (cname) {
	const name = `${cname}=`;
	const ca = document.cookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === ' ')
			c = c.substring(1);
		if (c.indexOf(name) !== -1)
			return c.substring(name.length, c.length);
	}
	return '';
}

//清除cookie
function clearCookie (name) {
	setCookie(name, '', -1);
}
