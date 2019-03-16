'use strict';

import * as Immutable from 'immutable';
import md5 from 'md5';
import * as CookieUtil from 'utils/CookieUtil';
import headers from './api-headers';

const WenwenApiHeaders = (apiUrl, contentType) => {
	let afterMergeHeaders = Immutable.Map(headers).set('Version', '1.0.0');
	let userToken = CookieUtil.getCookie('userToken');
	if (userToken) {
		userToken = JSON.parse(userToken);
	}
	const userId = CookieUtil.getCookie('userId');
	if (userId) {
		afterMergeHeaders = afterMergeHeaders.set('userId', userId);
	}
	const tenantId = CookieUtil.getCookie('tenantId');
	if (tenantId) {
		afterMergeHeaders = afterMergeHeaders.set('tenantId',tenantId);
	}
	if (apiUrl && userToken) {
		afterMergeHeaders = afterMergeHeaders.set('Authorization',
            `bearer ${userToken.userToken}`).
			set('provider', userToken.provider);
	}
	if (contentType) {
		afterMergeHeaders = afterMergeHeaders.set('Content-Type', contentType);
	}
	return afterMergeHeaders.toObject();
};
export default WenwenApiHeaders;
