'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import * as Constant from 'utils/Constant';
import * as Immutable from 'immutable';

export const QRY_GOODS_LIST = 'QRY_GOODS_LIST';


export function ImgUpLoadSubmitServer (ret) {

	return {
		type: QRY_GOODS_LIST,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/base/uploadImage', {
				data: {
					file: ret,
				},
			}),
		},
	};
}


