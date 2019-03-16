'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import * as Constant from 'utils/Constant';

//1.用户意见反馈
export const QRY_OPINION_BY_FORM = 'QRY_OPINION_BY_FORM';
//2.用户意见反馈
export const QRY_OPINION_BY_ID = 'QRY_OPINION_BY_ID';
//3. 用户意见处理
export const DEAL_OPINION = 'DEAL_OPINION';
//4. 用户意见删除
export const DELETE_OPINION = 'DELETE_OPINION';
//4. 查看pic
export const QRY_USER_ADVICE_PIC_BY_ADVICE_REC_ID = 'QRY_USER_ADVICE_PIC_BY_ADVICE_REC_ID';

//1. 查询列表
export function qryOpinionByForm (qryForm = {}) {
	if (!qryForm.qryBean) {
		qryForm.qryBean = {};
	}
	return {
		type: QRY_OPINION_BY_FORM,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/user/qryUserAdviceBt', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					qryBean: qryForm.qryBean,
					beginTime: qryForm.beginTime,
					endTime: qryForm.endTime,
				},
			}),
		},
	};
}
//2.根据记录id查询
export function qryOpinionById (recId = '') {
	return {
		type: QRY_OPINION_BY_ID,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/user/qryUserAdvice', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					qryBean: { recId },
				},
			}),
		},
	};
}

//3. 处理用户意见处理
export function dealAdviceInfo (operType, adviceInfo = {}) {
	return {
		type: DEAL_OPINION,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/user/dealUserAdvice', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType,
					userAdviceList: [adviceInfo],

				},
			}),
		},
	};
}
//9.批量删除意见信息
export function deleteAdviceInfo (deleteAdviceInfoList = []) {
	return {
		type: DELETE_OPINION,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/prod/dealUpProd', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType: Constant.OPER_TYPE_DELETE,
					userAdviceList: deleteAdviceInfoList,
				},
			}),
		},
	};
}

//4. 查看pic
export function qryOpinionImgByAdviceRecId (adviceRecId) {
	return {
		type: QRY_USER_ADVICE_PIC_BY_ADVICE_REC_ID,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/user/qryUserAdvicePic', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					qryBean: { adviceRecId },
				},
			}),
		},
	};
}
