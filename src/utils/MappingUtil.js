'use strict';


export const chipNumToText = (num) => {
	switch (num){
		case 1: { return '蛋型'; }
		case 2: { return '方形'; }
		case 3:
		case 4:
		case 5:{ return '圆形'; }
		default:{ return undefined; }
	}
};
export const chipNumToSizeText = (num) => {
	switch (num){
		case 1: { return '12*16'; }
		case 2: { return '13*13'; }
		case 3: { return '18*18'; }
		case 4: { return '16*16'; }
		case 5: { return '14*14'; }
		default:{ return undefined; }
	}
};

export const statusNumToText = (num) => {
	switch (num){
		case 0:{ return '待支付'; }
		case 1:{ return '待审核'; }
		case 2:{ return '未通过'; }
		case 3:{ return '待签约'; }
		case 4:{ return '进行中'; }
		case 5:{ return '已完成'; }
		default:{ return undefined; }
	}
};
export const worksTypeNumToText = (num) => {
	switch (num){
		case 1:{ return '戒指'; }
		case 2:{ return '手串'; }
		case 3:{ return '项链'; }
		case 4:{ return '手链'; }
		case 5:{ return '手镯'; }
		default:{ return undefined; }
	}
};
export const demandTypeNumToText = (num) => {
	switch (num){
		case 0:{ return '竞选'; }
		case 1:{ return '企业委托'; }
		default:{ return undefined; }
	}
};
export const statusNumToClass = (num) => {
	switch (num){
		case 0:{ return 'paying'; }
		case 1:{ return 'audit'; }
		case 2:{ return 'fail'; }
		case 3:{ return 'pending'; }
		case 4:{ return 'ongoing'; }
		case 5:{ return 'finish'; }
		default:{ return undefined; }
	}
};

export const contractTypeNumToClass = (num) => {
	switch (num*1){
		case 0:{ return '设计师竞标'; }
		case 1:{ return '商家委托'; }
		default:{ return undefined; }
	}
};


export const shareJewelOrderTypeNumToPreText = (num) => {
	//订单状态： 0-取消/交易关闭 1-已创建/待付款 2-已付款/待确认 3-已确认/待发货 4-已发货/待收货
	//5-已收货/待归还 6-已归还/待验收 7-已验收/待赔偿 8-已验收/结束
	switch (num){
		case 0:{ return '取消/交易关闭'; }
		case 1:{ return '待付款'; }
		case 2:{ return '已付款'; }
		case 3:{ return '待发货'; }
		case 4:{ return '待收货'; }
		case 5:{ return '待归还'; }
		case 6:{ return '待验收'; }
		case 7:{ return '待赔偿'; }
		case 8:{ return '已完成'; }
		case 9:{ return '已收货'; }
		case 10:{ return '已完成'; }
		case 11:{ return '待自提'; }
		case 12:{ return '待退款'; }
		case 13:{ return '退款中'; }
		case 14:{ return '退款已完成'; }
		default:{ return num; }
	}
};

export const prayerOrderStateToNumText = (type) => {
	switch (type) {
		case 0: {
			return '全部';
		}
		case 1: {

			return '已下单';
		}
		case 2: {
			return '已支付';
		}
		case 3: {
			return '已发货';
		}
		case 4: {
			return '已完成';
		}
	}
};