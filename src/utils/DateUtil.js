'use strict';

import moment from 'moment';

export const parseDateTime = dateTime => moment(dateTime).format('YYYY-MM-DD HH:mm:ss');
export const parseDateTime2 = dateTime => moment(dateTime).format('HH:mm:ss');
export const parseDate = dateTime => moment(dateTime).format('YYYY-MM-DD');
export const parseDate2 = dateTime => moment(dateTime).format('YYYY/MM/DD');
export const parseMonth = dateTime => moment(dateTime).format('YYYYMM');
export const getYear = date => moment(date).format('YYYY');

export const getMonth = date => moment(date).format('MM');

export const getDay = date => moment(date).format('DD');

export const m = moment;

export const getDiffDayFromNow = (dateTime) => {
	const now = Date.now();
	const diff = now - dateTime;
	return Math.floor(diff/86400000);
};