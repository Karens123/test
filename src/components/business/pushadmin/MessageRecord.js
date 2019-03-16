'use strict';

import * as Immutable from 'immutable';
import moment from 'moment';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Row, Table } from 'antd';

import * as businessRoute from 'business/route';
import * as MsgUtil from 'utils/MsgUtil';
import * as Constant from 'utils/Constant';

import {
	DEAL_PUSH_INFORMATION,
	dealPushInfo,
	PUSH_NOTIFICATION_MESSAGE,
	QRY_PUSH_INFO_BY_FORM,
	qryPushInfoByForm,
	rePushMessage,
} from 'action';
import RePushModal from './RePushModal';
import PushInfoSearchForm from './PushInfoSearchForm';

class MessageRecord extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		pushInfoList: PropTypes.array,
		actionType: PropTypes.string.isRequired,
		rspInfo: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		type: PropTypes.number.isRequired,
		currentMessage: PropTypes.object.isRequired,
	};

	static defaultProps = {
		pushInfoList: [],
	};

	constructor (props) {
		super(props);
		const { currentMessage } = props;

		if (currentMessage) {
			this.state = {
				selectedRowKeys: [currentMessage.prodId],
				currentPage: 1,       //当前选中的分页
			};
		} else {
			this.state = {
				selectedRowKeys: [],
				currentPage: 1,       //当前选中的分页
			};
		}
	}

	componentWillMount () {
		this.handleQuery();
	}

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				let isRefresh = false;
				if (`${QRY_PUSH_INFO_BY_FORM}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询消息记录列表失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${DEAL_PUSH_INFORMATION}_SUCCESS` === actionType ||
					`${PUSH_NOTIFICATION_MESSAGE}_SUCCESS` === actionType) {
					isRefresh = true;
				}
				if (isRefresh) {
					this.handleQuery();
				}
			}
		}
	}

	//radio选择变更事件处理
	onRadioSelectChange = (selectedRowKeys) => {
		console.log('selectedRowKeys', selectedRowKeys);
		this.setState({ selectedRowKeys });
	};

	handleRowClk = (selectID) => {
		// console.log('selectID');
		this.setState({ selectedRowKeys: [selectID.responseId] });
	};

	//[查询] 按钮
	handleQuery = (qryForm) => {
		const { actions, type } = this.props;
		if (!qryForm) {
			const currentDate = new Date();
			const currentDateTime = moment(
				`${moment(currentDate).format('YYYYMMDD')}235959`,
				'YYYYMMDDhhmmss').toDate().getTime();
			const last7DayTime = moment(
				moment(currentDate).subtract(7, 'days').format('YYYYMMDD'),
				'YYYYMMDDhhmmss').toDate().getTime();
			qryForm = {
				beginTime: last7DayTime,
				endTime: currentDateTime,
				type,
			};
		}
		this.setState({
			currentPage: 1
		},() => {
			actions.qryPushInfoByForm(qryForm);
		});

	};

	//表格分页
	pagination = (data) => {
		const component = this;
		return {
			total: data.length,
			current: component.state.currentPage,
			showSizeChanger: true,
			onShowSizeChange(current, pageSize) {
				component.setState({ currentPage: 1 });
			},
			onChange(current) {
				component.setState({ currentPage: current });
			},
		};
	};

	showModal = (e) => {
		const { pushInfoList } = this.props;
		const { selectedRowKeys } = this.state;

		let currentItem = [];
		if (pushInfoList) {
			pushInfoList.forEach((item) => {
				if (item.responseId == selectedRowKeys) {
					currentItem = item;
				}
			});
		}

		this.setState({
			visible: true,
			currentPushInfo: currentItem,
		});
	};

	handleModalSubmit = (editForm) => {
		const { actions } = this.props;
		const { currentPushInfo } = this.state;
		const afterMergeForm = Immutable.Map(currentPushInfo).
			merge(editForm).
			toObject();
		actions.rePushMessage(afterMergeForm);
		this.setState({ visible: false });
	};

	handleModalCancel = () => {
		this.setState({ visible: false });
	};

	render () {
		const { pushInfoList } = this.props;
		const { selectedRowKeys } = this.state;

		const hasSelected = selectedRowKeys && selectedRowKeys.length > 0;
		// 通过 rowSelection 对象表明需要行选择
		const rowSelection = {
			type: 'radio',
			onChange: this.onRadioSelectChange,
			selectedRowKeys,
		};

		const columns = [
			{
				title: '消息ID',
				dataIndex: 'responseId',
				key: 'responseId',
				width: '100px',
			}, {
				title: '目标设备',
				dataIndex: 'deviceType',
				key: 'deviceType',
				width: '150px',
				render(text) {
					switch (text) {
						case 0: {
							return 'iOS设备';
						}
						case 1: {
							return 'Andriod设备';
						}
						case 3: {
							return '全部设备';
						}
						default:
							return '未知设备';
					}
				},
			}, {
				title: '标题',
				dataIndex: 'title',
				key: 'title',
				width: '150px',
			}, {
				title: '内容',
				dataIndex: 'body',
				key: 'body',
				width: '200px',
			}, {
				title: '定时发送时间',
				dataIndex: 'pushTime',
				key: 'pushTime',
				width: '200px',
				render(text) {
					if (!text) {
						return '立即发送';
					} else {
						return moment(text).format('YYYY-MM-DD HH:mm:ss');
					}
				},
			}, {
				title: '创建时间',
				dataIndex: 'createTime',
				key: 'createTime',
				width: '200px',
				render: (text) => {
					if (!text) {
						return '';
					} else {
						return moment(text).format('YYYY-MM-DD HH:mm:ss');
					}
				},
			}, {
				title: '操作',
				dataIndex: 'opreation',
				key: 'opreation',
				width: '100px',
				render(text, pushInfoList) {
					return (
						<span>
							<Link to={`${businessRoute.MessageStatistic}${pushInfoList.responseId}`} key="statistic" >
								<span>统计</span>
							</Link>
						</span>
					);
				},
			}];

		return (
			<div>
				<Row>
					<Col span={22} >
						<span style={{ float: 'left', width: 960 }} >
							<PushInfoSearchForm handleQuery={this.handleQuery} type={this.props.type} />
						</span>
						<span style={{ float: 'right' }} >
							<Button type="primary" icon="star-o" onClick={this.showModal} disabled={!hasSelected} >重发</Button>
						</span>
					</Col>
				</Row>
				<Row>&nbsp;</Row>
				<Row>
					<Col span={22} >
						<Table
							rowSelection={rowSelection}
							columns={columns}
							rowKey={record => record.responseId}
							dataSource={pushInfoList}
							onRowClick={this.handleRowClk}
							pagination={this.pagination(pushInfoList)}
						/>
					</Col>
				</Row>
				<RePushModal
					handleSubmit={this.handleModalSubmit}
					handleCancel={this.handleModalCancel}
					visible={this.state.visible}
					currentPushInfo={this.state.currentPushInfo}
					rePushType={this.props.type}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { pushInfoList, currentPushInfo, } = state.get('PushService').
		toObject();
	return { rspInfo, pushInfoList, currentPushInfo, actionType, type: 0 };//0-消息，1-通知
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators(
			{ dealPushInfo, rePushMessage, qryPushInfoByForm }, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageRecord);
