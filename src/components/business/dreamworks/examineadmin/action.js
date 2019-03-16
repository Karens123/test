'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import * as Constant from 'utils/Constant';

//1. 通过条件表单查询发现类型列表
export const QRY_ALLBUSINESSES_FORM = 'QRY_ALLBUSINESSES_FORM';

//2.查询作品详情
export const QRY_WORK_DETAIL_ID_FORM = 'QRY_WORK_DETAIL_ID_FORM';

//3.返回清数据
export const QRY_WORK_CLEAR_ID_FORM = 'QRY_WORK_CLEAR_ID_FORM';

//4.审核
export const AUDIT_DSN_WORK = 'AUDIT_DSN_WORK';

//5.商家待审核需求列表分页
export const QRY_ALLDEMAIND_FORM = 'QRY_ALLDEMAIND_FORM';

//.设计师需求详细
export const QRY_DEMAND_ID_FORM = 'QRY_DEMAND_ID_FORM';



//1.
export function qryAllBusinessesForm (currentPage = 1, pageSize = 10,qryForm = {}) {
	return {
		type: QRY_ALLBUSINESSES_FORM,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/pageQryMDsnWorksApply', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					record: qryForm,
					currentPage,
					pageSize,
				},
			}),
		},
	};
}



//2.查询作品详情
export function qryWorksDetailId (WorksDetailsId) {
	return {
		type: QRY_WORK_DETAIL_ID_FORM,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/getDsnWorksFullInfo', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					record: {
						worksId: WorksDetailsId,
					}
				},
			}),
		},
	};
}


//3.返回清数据
export function clearCurrentData () {
	return {
		type: QRY_WORK_CLEAR_ID_FORM,
		payload: { currentWorksDetail: {} },
	};
}



//4. 审核作品
export function auditDSNWork({ operType,entityType,entityId,auditResult,ifSendSms }) {
	return {
		type: AUDIT_DSN_WORK,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/auditDreamworksEntity', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType,
					auditDreamworksEntityAction: {
						entityType,entityId,auditResult,ifSendSms
					}
				},
			}),
		},
	};
}



//5.商家待审核需求列表分页
export function qryDemandForm (currentPage = 1, pageSize = 10,qryForm) {
	return {
		type: QRY_ALLDEMAIND_FORM,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/demand/enterprise/inAuditing', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					record: qryForm,
					currentPage,
					pageSize,
				},
			}),
		},
	};
}


//6.设计师需求详细
export function qryDemandDetailId (WorksDetailsId) {
	return {
		type: QRY_DEMAND_ID_FORM,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/demand/enterprise/inAuditing', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					record: {
						worksId: WorksDetailsId,
					}
				},
			}),
		},
	};
}
