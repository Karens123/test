'use strict';

import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Row, Col, Button, Table, Modal} from 'antd';

import * as MsgUtil from 'utils/MsgUtil';
import * as DateUtil from 'utils/DateUtil';
import * as Constant from 'utils/Constant';
import * as businessRoute from 'business/route';

import 'business/style/index.less';

import {
	qrySysVersionData,
	QRY_SYS_VERSION_DATA,
} from 'business/common/SysVersionDataService';
import {
	QRY_ACTIVITY_BY_FORM,
	GET_PRAYER_ACTIVITY_DETAIL_BY_ACTIVITY_ID,
	DEL_PRAYER_ACTIVITY,
	DEL_PRAYER_ACTIVITY_DETAIL,
	qryPrayerActivityByForm,
	getActivityDetailByActivityId,
} from 'src/components/business/prayeradmin/activityadmin/action';

import PrayerActivitySearchForm, {PrayerActivitySearchFormCacheKey} from './PrayerActivitySearchForm';

class PrayerActivityAdmin extends React.Component {
	//检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired,
	};
	static propTypes = {
		prayerActivityList: PropTypes.array,
		rspInfo: PropTypes.object,
		actionType: PropTypes.string,
		prayerActivityDetailList: PropTypes.array,
		actions: PropTypes.object.isRequired,
		currentPrayerActivity: PropTypes.object,
		currentPrayerActivityDetail: PropTypes.object,
	};

	static defaultProps = {
		prayerActivityList: [],
		prayerActivityDetailList: [],
		rspInfo: undefined,
		actionType: '',
		currentPrayerActivity: undefined,
		currentPrayerActivityDetail: undefined,
	};

	constructor(props) {
		super(props);
		const {currentPrayerActivity, currentPrayerActivityDetail} = props;
		const pager = {
			currentPage: 1,       //当前选中的分页
			pageSize: 10,       //当前选中的分页
		};
		if (currentPrayerActivityDetail) {
			this.state = {
				selectedActivityRowKeys: [currentPrayerActivityDetail.activityId],
				selectedDetailRowKeys: currentPrayerActivityDetail.id
					? [currentPrayerActivityDetail.id]
					: [],
				...pager,
			};
		} else if (currentPrayerActivity) {
			this.state = {
				selectedActivityRowKeys: currentPrayerActivity.id
					? [currentPrayerActivity.id]
					: [],
				selectedDetailRowKeys: [],
				...pager,
			};
		} else {
			this.state = {
				selectedActivityRowKeys: [],
				selectedDetailRowKeys: [],
				...pager,
			};
		}
	};

	componentWillMount() {
		const {actions} = this.props;
		this.handleQuery();
		if (this.state.selectedActivityRowKeys[0]) {
			actions.getActivityDetailByActivityId(
				this.state.selectedActivityRowKeys[0]);
		}
	}

	componentWillReceiveProps(nextProps) {
		const {actions, rspInfo, actionType} = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				let isRefresh = false;
				if (`${QRY_ACTIVITY_BY_FORM}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询佛云活动列表失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${GET_PRAYER_ACTIVITY_DETAIL_BY_ACTIVITY_ID}_SUCCESS` ===
					actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询活动详情列表失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${DEL_PRAYER_ACTIVITY}_SUCCESS` === actionType ||
					`${DEL_PRAYER_ACTIVITY_DETAIL}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`删除活动主体信息失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					} else {
						isRefresh = true;
					}
				}

				if (isRefresh) {
					this.handleQuery();
					if (this.state.selectedActivityRowKeys[0]) {
						actions.getActivityDetailByActivityId(
							this.state.selectedActivityRowKeys[0]);
					}
				}
			}
		}
	};

	//[查询] 按钮
	handleQuery = (record, stateList) => {
		const {actions} = this.props;
		if (!record) {
			record = JSON.parse(
				localStorage.getItem(PrayerActivitySearchFormCacheKey));
		}
		if (!record) {
			record = {};
		}
		this.setState({
			currentPage: 1,
		}, () => {
			const {currentPage, pageSize} = this.state;
			actions.qryPrayerActivityByForm(record, stateList, currentPage,
				pageSize);
		});

	};

	//[新增] 活动主体按钮
	handleAddActivity = () => {
		this.context.router.replace(`${businessRoute.prayerActivityAdd}`);
	};

	//[新增] 活动详情按钮
	handleAddActivityDetail = () => {
		const select = this.state.selectedActivityRowKeys;
		if (select[0]) {
			this.context.router.replace(
				`${businessRoute.prayerActivityDetailAdd}${select[0]}`);
		} else {
			MsgUtil.showwarning('请选择一条活动主体数据');
		}
	};

	//[修改] 按钮
	handleEditActivity = () => {
		const select = this.state.selectedActivityRowKeys;
		if (select && select[0]) {
			this.context.router.replace(
				`${businessRoute.prayerActivityEdit}${select[0]}`);
		} else {
			MsgUtil.showwarning('请选择一条需要修改的活动主体');
		}
	};
	//[修改] 按钮
	handleEditActivityForItem = (currentActivity) => {
		this.context.router.replace(
			`${businessRoute.prayerActivityEdit}${currentActivity.activityId}`);
	};

	//[修改]活动详情按钮
	handleEditActivityDetail = () => {
		const select = this.state.selectedDetailRowKeys;
		if (select && select[0]) {
			this.context.router.replace(
				`${businessRoute.prayerActivityDetailEdit}${select[0]}`);
		} else {
			MsgUtil.showwarning('请选择需要修改的活动主体');
		}
	};

	//[删除] 活动主体按钮
	handleDeleteActivity = () => {
		const {selectedActivityRowKeys} = this.state;
		const {actions, prayerActivityList} = this.props;

		let currentPrayerActivity;
		const select = selectedActivityRowKeys &&
			selectedActivityRowKeys[0];
		if (!select) {
			MsgUtil.showwarning('请选择需要删除的活动主体数据？');
			return;
		}

		for (const item of prayerActivityList) {
			if (item.id == select) {
				currentPrayerActivity = item;
				break;
			}
		}

		if (currentPrayerActivity) {
			Modal.confirm({
				title: `确定要删除 [活动id:${currentPrayerActivity.activityId}] 的活动吗?`,
				content: '',
				onOk() {
					actions.deleteActivity(currentPrayerActivity);
				},
				onCancel() {
				},
			});
		} else {
			MsgUtil.showwarning('请选择需要删除的活动？');
		}
	};

	//[删除] 活动详情按钮
	handleDeleteDiscovery = () => {
		const {selectedDetailRowKeys} = this.state;
		const {actions, prayerActivityDetailList} = this.props;

		let currentPrayerActivityDetail;

		prayerActivityDetailList.forEach((item) => {
			if (item.id == selectedDetailRowKeys) {
				currentPrayerActivityDetail = item;
			}
		});

		if (currentPrayerActivityDetail) {
			Modal.confirm({
				title: '确定要删除吗?',
				content: '',
				onOk() {
					actions.deleteActivityItem(currentPrayerActivityDetail);
				},
				onCancel() {
				},
			});
		} else {
			MsgUtil.showwarning('请选择需要删除的活动详情');
		}
	};

	//radio选择变更事件处理
	onActivitySelectChange = (selectedActivityRowKeys) => {
		this.setState({selectedActivityRowKeys});
		const select = selectedActivityRowKeys;
		if (select && select[0]) {
			const {actions} = this.props;
			actions.getActivityDetailByActivityId(select[0]);
		}
	};
	//Table行选择事件
	handleRowClk = (selectedRow) => {
		this.setState({selectedActivityRowKeys: [selectedRow.activityId]});
		const {actions} = this.props;
		actions.getActivityDetailByActivityId(selectedRow.activityId);
	};
	//活动详情选择
	onActivityDetailSelectChange = (selectedDetailRowKeys) => {
		this.setState({selectedDetailRowKeys});
	};
	handleActivityDetailRowClk = (selectedRow) => {
		this.setState(
			{selectedDetailRowKeys: [`${selectedRow.activityId}/${selectedRow.locale}`]});
	};

	//表格分页
	pagination = (data) => {
		const component = this;
		return {
			total: data.length,
			current: component.state.currentPage,
			showSizeChanger: true,
			onShowSizeChange(current, pageSize) {
				component.setState({currentPage: 1, pageSize});
			},
			onChange(current) {
				component.setState({currentPage: current});
			},
		};
	};

	render() {
		const {prayerActivityList, prayerActivityDetailList} = this.props;
		const {selectedActivityRowKeys, selectedDetailRowKeys} = this.state;
		const hasSelectedActivity = selectedActivityRowKeys &&
			selectedActivityRowKeys.length > 0;
		const hasSelectedActivityDetail = selectedDetailRowKeys &&
			selectedDetailRowKeys.length > 0;

		const activityRowSelection = {
			selectedRowKeys: selectedActivityRowKeys,
			type: 'radio',
			onChange: this.onActivitySelectChange,
		};
		const now = Date.now();
		const activityColumns = [
			{
				title: 'id',
				dataIndex: 'activityId',
				key: 'activityId',
				width: 50,
			}, {
				title: '活动来源',
				dataIndex: 'activitySource',
				key: 'activitySource',
				width: 100,
				render: (activitySource) => {
					if (activitySource === 1) {
						return '后台';
					} else if (activitySource === 0) {
						return '用户';
					} else {
						return '未知';
					}
				},
			}, {
				title: '活动说明',
				dataIndex: 'remark',
				key: 'remark',
				width: 200,
			}, {
				title: '总目标',
				width: 200,
				dataIndex: 'targetNum',
				key: 'targetNum',
			}, {
				title: '开始时间',
				width: 200,
				dataIndex: 'startTime',
				key: 'startTime',
				render(text) {
					return text ? DateUtil.parseDateTime(text) : '';
				},
			}, {
				title: '结束时间',
				width: 200,
				dataIndex: 'endTime',
				key: 'endTime',
				render(text) {
					return text ? DateUtil.parseDateTime(text) : '';
				},
			}, {
				title: '状态',
				width: 200,
				dataIndex: 'state',
				key: 'state',
				render(state) {
					if (state === 0) {
						return '草稿';
					} else if (state === 1) {
						return '待审核';
					} else if (state === 2) {
						return '已审核';
					} else {
						return '未知';
					}
				},
			}, {
				title: '活动进度',
				width: 400,
				dataIndex: 'activityProgress',
				key: 'activityProgress',
				render(activityProgress, record) {
					let text = '未审核';
					if (activityProgress === 0) {
						text = '准备中';
					} else if (activityProgress == 1) {
						text = '进行中';
					} else if (activityProgress === 2) {
						text = '已结束';
					}
					return (
						<Row>
							<Row>参与人数：{record.peopleCount === undefined
								? '0'
								: `${record.peopleCount}`}</Row>
							<Row>已念诵数：{record.doneNum === undefined
								? '0'
								: `${record.doneNum}`}</Row>
							<Row>进度：{text}</Row>
						</Row>

					);
				},
			}, {
				title: '操作',
				width: 200,
				dataIndex: 'opt',
				key: 'opt',
				render: (text, record) => {
					return (
						<Button
							type="primary" icon="edit"
							onClick={() => this.handleEditActivityForItem(
								record)}
						>修改</Button>
					);
				},
			},
		];

		const activityDetailRowSelection = {
			selectedRowKeys: this.state.selectedDetailRowKeys,
			type: 'radio',
			onChange: this.onActivityDetailSelectChange,
		};

		const resItemColumns = [
			{
				title: '活动id',
				dataIndex: 'activityId',
				key: 'activityId',
				width: 80,
			}, {
				title: '语言',
				dataIndex: 'locale',
				key: 'locale',
				width: 80,
			}, {
				title: '活动标题',
				dataIndex: 'activityTitle',
				width: 200,
				key: 'activityTitle',
			}, {
				title: '佛号',
				width: 200,
				dataIndex: 'buddhist',
				key: 'buddhist',
			}, {
				title: '经文',
				width: 200,
				dataIndex: 'lectionTitle',
				key: 'lectionTitle',
			}, {
				title: '经文内容',
				width: 400,
				dataIndex: 'lectionContent',
				key: 'lectionContent',
			}, {
				title: '音频',
				width: 200,
				dataIndex: 'lectionVoice',
				key: 'lectionVoice',
				render: text => text
					? <a href={text} target="_blank"
						 rel="noopener noreferrer">下载</a>
					: '无',
			}, {
				title: '封面',
				width: 200,
				dataIndex: 'activityCover',
				key: 'activityCover',
				render: text => text ? <img src={text} width={200}/> : '无',
			},

		];

		return (
			<div>
				<Row>
					<Col span={16}>
						<PrayerActivitySearchForm
							handleQuery={this.handleQuery}/>
					</Col>
					<Col style={{textAlign: 'right'}}>
						{/*<Button*/}
						{/*type="primary" icon="edit"*/}
						{/*onClick={this.handleEditActivity}*/}
						{/*disabled={!hasSelectedActivity}*/}
						{/*>修改</Button>&nbsp;&nbsp;*/}
						<Button
							type="primary" icon="plus"
							onClick={this.handleAddActivity}
						>新增</Button>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<Table
							size="small"
							scroll={{ y: 350 }}
							rowSelection={activityRowSelection}
							columns={activityColumns}
							rowKey={record => record.activityId}
							dataSource={prayerActivityList}
							onRowClick={this.handleRowClk}
							pagination={this.pagination(prayerActivityList)}
						/>
					</Col>
				</Row>
				<Row>
					<Col span={24} className="fr">
						<Button
							type="primary" icon="edit"
							onClick={this.handleEditActivityDetail}
							disabled={!hasSelectedActivityDetail}
						>修改</Button>
						&nbsp;&nbsp;
						<Button
							type="primary" size="large"
							onClick={this.handleAddActivityDetail}
							disabled={!hasSelectedActivity}
						>新增</Button>
					</Col>
				</Row>
				<Row>
					<Col span={24} className="fr">
						<Table
							size="small"
							rowSelection={activityDetailRowSelection}
							columns={resItemColumns}
							rowKey={
								record => `${record.activityId}/${record.locale}`}
							dataSource={prayerActivityDetailList}
							onRowClick={this.handleActivityDetailRowClk}
							pagination={this.pagination(
								prayerActivityDetailList)}
						/>
					</Col>
				</Row>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const {rspInfo, actionType} = state.get('RootService').toObject();
	const {prayerActivityList, prayerActivityDetailList, currentPrayerActivity, currentPrayerActivityDetail} = state.get(
		'ActivityService').toObject();
	return {
		rspInfo,
		actionType,
		prayerActivityList,
		prayerActivityDetailList,
		currentPrayerActivity,
		currentPrayerActivityDetail,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryPrayerActivityByForm,
			getActivityDetailByActivityId,
			qrySysVersionData,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	PrayerActivityAdmin);
