'use strict';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import * as Constant from 'utils/Constant';
import * as MsgUtil from 'utils/MsgUtil';

import { PUSH_MESSAGE } from 'action';
import './index.less';
import PushForm from './PushForm';

const TabPane = Tabs.TabPane;

class PushMessage extends React.Component {
	static propTypes = {
		actionType: PropTypes.string.isRequired,
		rspInfo: PropTypes.object.isRequired,
	};

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (`${PUSH_MESSAGE}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`推送消息失败: ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					} else {
						MsgUtil.showwarning('推送消息成功');
					}
				}
			}
		}
	}

	/**
	 deviceType:设备类型，取值范围为：0：iOS设备 1：Andriod设备 3：全部类型设备
	 type: 0-消息， 1-通知
	 **/
	render () {
		return (
			<Tabs className="wenwen-app-push-tabs" defaultActiveKey="1" >
				<TabPane tab="Android" key="1" >
					<PushForm deviceType="1" type="0" />
				</TabPane>
				<TabPane tab="IOS" key="2" >
					<PushForm deviceType="0" type="0" />
				</TabPane>
				<TabPane tab="All" key="3" >
					<PushForm deviceType="3" type="0" />
				</TabPane>
			</Tabs>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	return { rspInfo, actionType };
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PushMessage);
