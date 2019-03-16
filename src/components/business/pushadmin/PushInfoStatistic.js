'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, Col, Icon, Popover, Progress, Row } from 'antd';

import * as businessRoute from 'business/route';
import * as MsgUtil from 'utils/MsgUtil';
import * as Constant from 'utils/Constant';

import { QRY_PUSH_STATINFOR, qryPushInfoById, qryPushStatInfor } from 'action';

class NotificationStatistic extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		currentPushInfo: PropTypes.object.isRequired,
		pushStatInfo: PropTypes.object.isRequired,
		actionType: PropTypes.string.isRequired,
		rspInfo: PropTypes.object.isRequired,
		route: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		params: PropTypes.object.isRequired,
	};

	constructor (props) {
		super(props);
		const { route, actions } = this.props;
		if (!route) {
			this.context.router.replace(businessRoute.NotificationRecord);
		}
		const { params } = this.props;
		const responseId = params.responseId;
		actions.qryPushStatInfor(responseId);
		actions.qryPushInfoById(responseId);
	}

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (`${QRY_PUSH_STATINFOR}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询通知统计信息失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				}
			}
		}
	}

	render () {
		const { pushStatInfo, currentPushInfo } = this.props;

		//没有统计数值
		let item;
		if (pushStatInfo.ifStated === true) {
			item = pushStatInfo;
		} else {
			item = {
				deletedCount: 0,
				openedCount: 0,
				receivedCount: 0,
				sentCount: 0,
			};
		}
		//显示图标
		let deviceTypeName;
		switch (currentPushInfo.deviceType) {
			case 0: {
				deviceTypeName = (
					<Icon
						type="apple"
						style={{
							color: '#2db7f5',
							fontSize: 23,
						}}
					/>
				);
				break;
			}
			case 1: {
				deviceTypeName = (
					<Icon
						type="android"
						style={{
							color: '#2db7f5',
							fontSize: 23,
						}}
					/>
				);
				break;
			}
			case 3: {
				deviceTypeName = ['android', 'apple'];
				deviceTypeName = deviceTypeName.map((item, index) => {
					return (
						<Icon
							type={item}
							style={{
								color: '#2db7f5',
								fontSize: 23,
							}}
						/>
					);
				});

				break;
			}
			default:
				deviceTypeName = '';
		}
		const tipMsg = (
			<div className="tipMsgStyle" >
				<b>发送数:</b>即推送通道在线设备量，为了尽可能让消息或通知到达到更多的备，
				推送的使用共享通道转发，比如开发者的应用A不在线，但是推送共享通道在线，我们会通过
				推送共享通道送达设备，但应用A不一定能及时处理该消息。
			</div>
		);

		const hrLine = (
			<div
				style={{
					borderTop: 'solid 1px #ddd',
					marginTop: '15px',
					paddingBottom: '15px',
				}}
			/>
		);

		const content = (
			<div>
				<p> 非实时数据，推送后最快一个小时左右出结果</p>
			</div>
		);

		return (
			<div>
				<Row><Col>&nbsp;</Col></Row>
				<Card
					title={
						<span>数据统计&nbsp;&nbsp;
							<Popover
								content={content}
								title={
									<span style={{ color: 'red' }} >吻吻提醒</span>}
								placement="rightTop"
							>
								<Icon type="info-circle-o" style={{ color: '#2db7f5' }} />
							</Popover>
						</span>
					}
				>
					<Row>
						<Col span={22} offset={1} >
							{tipMsg}
						</Col>
					</Row>
					<Row >
						<Col span={22} offset={1} style={{ height: 40 }} >
							{hrLine}
						</Col>
					</Row>
					<Row>
						<Col span={2} offset={1} style={{ height: 40 }} >发送数 :</Col>
						<Col span={10} >
							<Progress percent={item.sentCount} status="active" />
						</Col>
					</Row>
					<Row>
						<Col span={2} offset={1} style={{ height: 40 }} >到达数：</Col>
						<Col span={10} >
							<Progress percent={item.receivedCount} status="active" />
						</Col>
					</Row>
					<Row>
						<Col span={2} offset={1} style={{ height: 40 }} >打开数：</Col>
						<Col span={10} >
							<Progress percent={item.openedCount} status="active" />
						</Col>
					</Row>
					<Row>
						<Col span={2} offset={1} style={{ height: 40 }} >删除数：</Col>
						<Col span={10} >
							<Progress percent={item.deletedCount} status="active" />
						</Col>
					</Row>
				</Card>
				<Row>&nbsp;<br /><br /></Row>
				<Card
					title={
						<span>基本信息&nbsp;&nbsp;
							<Icon type="message" style={{ color: '#2db7f5' }} />
						</span>
					}
				>
					<Row>
						<Col span={22} offset={1} style={{ lineHeight: '30px' }} >
							<p >APP:吻吻科技 {deviceTypeName}</p>
							<p>{currentPushInfo.summary}</p>
						</Col>
					</Row>
				</Card>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { pushStatInfo, currentPushInfo } = state.get('PushService').
		toObject();
	return { rspInfo, actionType, pushStatInfo, currentPushInfo };
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({ qryPushInfoById, qryPushStatInfor },
			dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationStatistic);
