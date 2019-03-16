'use strict';

import { message } from 'antd';

/** 显示info级别信息 */
export const showinfo = function (msg) {
	message.info(msg);
};

/** 显示error级别信息*/
export const showerror = function (msg) {
	message.error(msg);
};

/** 显示warning级别信息*/
export const showwarning = function (msg) {
	message.warning(msg);
};
