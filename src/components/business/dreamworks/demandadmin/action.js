'use strict';

import * as HttpUtil from 'utils/HttpUtil';
import * as Constant from 'utils/Constant';

export const QRY_BSN_APPLICATION = 'QRY_BSN_APPLICATION';
export const QRY_ALL_DEMAND_ENTERISE = 'QRY_ALL_DEMAND_ENTERISE';
export const QRY_BSN_DETAIL = 'QRY_BSN_DETAIL';
export const QRY_DSN_DETAIL = 'QRY_DSN_DETAIL';
export const AUDIT_BSN = 'AUDIT_BSN';
export const AUDIT_DSN = 'AUDIT_BSN';
export const CLEAR_BSN_DETAIL ='CLEAR_BSN_DETAIL';
export const CLEAR_DSN_DETAIL ='CLEAR_DSN_DETAIL';

export const QRY_DEMAND_DETAIL ='QRY_DEMAND_DETAIL';
export const QRY_WORK_CLEAR_ID_FORM ='QRY_WORK_CLEAR_ID_FORM';
export const CONTRACT_MSG_LIST ='CONTRACT_MSG_LIST';
export const RE_MINDER_BUINESS_CONFIRMS ='RE_MINDER_BUINESS_CONFIRMS';
export const BUINESS_CONFIRM_COMPLETE ='BUINESS_CONFIRM_COMPLETE';



//4.审核
export const AUDIT_DSN_WORK = 'AUDIT_DSN_WORK';

//2.  全部需求管理
export function qryEnterpriseDemand({ currentPage=1,pageSize=10,record={} }) {
	return {
		type:	QRY_ALL_DEMAND_ENTERISE,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/demand/enterprise', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					currentPage,
					pageSize,
					record,
				},
			}),
		},
	};
}




//3. 待审核
export function qryPendingAudit({ currentPage=1,pageSize=10,record={} }) {
	return {
		type:	QRY_BSN_APPLICATION,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/demand/enterprise/inAuditing', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					currentPage,
					pageSize,
					record,
				},
			}),
		},
	};
}

//3. 待审核-查其它TAB的时候查询
export function qryPendingAuditTab({ currentPage=1,pageSize=10,record={} }) {
	return {
		type:	QRY_BSN_APPLICATION,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/demand/enterprise/inAuditing', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					currentPage,
					pageSize,
					record,
				},
			}),
		},
	};
}



export function qryDemandDetail (demandId) {
	return {
		type: QRY_DEMAND_DETAIL,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/demand', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					record: {
						demandId
					}
				},
			}),
		},
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



//3.返回清数据
export function clearCurrentData () {
	return {
		type: QRY_WORK_CLEAR_ID_FORM,
		payload: { currentWorksDetail: {} },
	};
}




export function contractMsg(currentPage,pageSize,DemandDetailsId) {
	return {
		type: CONTRACT_MSG_LIST,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/contract/msg', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					currentPage,
					pageSize,
					record: {
						demandId: DemandDetailsId
					},
				},
			}),
		},
	};
}


export function reMinderBuinessConfirms(DemandDetailsId,str) {
	return {
		type: RE_MINDER_BUINESS_CONFIRMS,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/ent/demand/completedRemind', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType: 1,
					records: [{
						demandId: DemandDetailsId,
						productName: str,
					}],
				},
			}),
		},
	};
}


export function confirmComplete(DemandDetailsId) {
	return {
		type: BUINESS_CONFIRM_COMPLETE,
		payload: {
			promise: HttpUtil.WenwenApi.post('/admin/find/ent/demand/completed', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					operType: 1,
					records: [{
						demandId: DemandDetailsId,
					}],
				},
			}),
		},
	};
}


