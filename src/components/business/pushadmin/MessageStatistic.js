'use strict';

import React, { PropTypes } from 'react';
import { Row, Tabs } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class MessageStatistic extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		callback: PropTypes.object.isRequired,
	};

	constructor (props) {
		super(props);
		this.state = {
			deviceType: 3,//设备类型，取值范围为：0：iOS设备 1：Andriod设备 3：全部类型设备
			pushBigType: undefined,// 1-系统 2-活动/推荐 3-吻吻服务 4-资讯
			pushType: undefined,// 大类1-系统：1-系统信息，1001-强制退出消息，后续从1002开始定义；
								// 大类2-活动/推荐：2-活动信息，后续从2001开始定义；
								// 大类3-吻吻服务：3-发起绑定 4-绑定回应 6-吻吻蜜语
								// 8-情侣等级提升 9-背景图片更新，后续从3001开始定义；
								// 大类4-资讯：4001-普通资讯
			type: 0,//0:表示消息(默认为0), 1:表示通知
			target: undefined,//推送目标: device:推送给设备;
							  //         account:推送给指定帐号,
							  //         tag:推送给自定义标签;
							  //         all: 推送给全部
			targetValue: undefined, // 根据Target来设定，多个值使用逗号分隔，最多支持100个。
									// Target=DEVICE，值如deviceid111,deviceid1111
									// Target=ACCOUNT，值如account111,account222
									// Target=alias，值如alias111,alias222
									// Target=tag，支持单Tag和多Tag，格式请参考标签格式
									// Target=ALL，值为all
			title: undefined,
			body: undefined,
			batchNumber: undefined,//批次号
			pushTime: undefined,//推送时间空为立即，UTC格式为YYYY-MM-DDThh:mm:ssZ
			storeOffline: true,//是否离线保存
			expireTime: undefined,//离线保存的失效时间,默认为72小时，UTC格式为YYYY-MM-DDThh:mm:ssZ
			extParameters: undefined,//开发者扩展用，map格式
			/*IOS通知使用*/
			summary: undefined,//ios通知内容
			iOSMusic: undefined,//Ios通知声音
			iOSBadge: undefined,//Ios应用右上角图
			apnsEnv: undefined,//是否通过apns发送通知
			/*IOS消息使用*/
			remind: undefined,//true/false当APP不在线时候，是否通过通知提醒
			/*ANDROID通知使用*/
			androidMusic: undefined, //Android通知声音
			androidOpenType: undefined, //点击通知后动作,APPLICATION:打开应用 ACTIVITY: 打开应用Activity URL:打开 url NONE : 无跳转逻辑
			androidActivity: undefined, //Android打开的activity
			xiaomiActivity: undefined, //Android打开的activity
			androidOpenUrl: undefined, //Android打开的url,Android收到推送后打开对应的url,仅仅当androidOpenType=3有效
		};
	}

	render () {
		const TabPane = Tabs.TabPane;
		return (
			<Row>
				吻吻科技&nbsp;&nbsp;
				<Tabs defaultActiveKey="1" onChange={callback} >
					<TabPane tab="Android" key="1" >选项卡一内容</TabPane>
					<TabPane tab="IOS" key="2" >选项卡二内容</TabPane>
					<TabPane tab="All" key="3" >选项卡三内容</TabPane>
				</Tabs>
			</Row>
		);
	}
}
;

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { pushStatInfo, currentPushInfo } = state.get('PushService').
		toObject();
	return { rspInfo, actionType, pushStatInfo, currentPushInfo };
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageStatistic);
