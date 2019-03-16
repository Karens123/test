import antdEn from 'antd/lib/locale-provider/en_US';
import * as CookieUtil from 'utils/CookieUtil';

let language = CookieUtil.getCookie('locale') || require('browser-locale')();

language = language.toLowerCase();

if (!language) {
	language = 'zh';
} else {
	language = language.split('-')[0];
}

const isZh = language.indexOf('zh') > -1;

/*eslint-disable import/no-dynamic-require*/
const data = require(`react-intl/locale-data/${language}`);
/*eslint-disable import/no-dynamic-require*/
const messages = require(`src/locales/${language}.json`);

module.exports = {
	messages,
	data,
	locale: language,
	antd: !isZh && antdEn,
};