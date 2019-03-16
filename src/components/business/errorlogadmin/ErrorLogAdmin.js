'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { Button, Col, Row, Table } from 'antd';

import * as MsgUtil from 'utils/MsgUtil';
import * as Constant from 'utils/Constant';
import * as businessRoute from 'business/route';
import {
	DEAL_ERROR_LOG,
	QRY_ERROR_LOG_BY_FORM,
	qryErrorLogByForm,
} from 'action';
import ErrorLogSearchForm from './ErrorLogSearchForm';

class ErrorLogAdmin extends React.Component {
	//检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		errorLogList: PropTypes.array,
		currentErrorLog: PropTypes.object,
		actionType: PropTypes.string.isRequired,
		rspInfo: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
	};

	static defaultProps = {
		errorLogList: [],
		currentErrorLog: undefined,
	};

	constructor (props) {
		super(props);
		const { currentErrorLog } = props;
		if (currentErrorLog) {
			this.state = {
				selectedRowKeys: currentErrorLog.recId
					? [currentErrorLog.recId]
					: [],
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
				if (`${QRY_ERROR_LOG_BY_FORM}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询错误日志列表失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${DEAL_ERROR_LOG}_SUCCESS` === actionType) {
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
		this.setState({ selectedRowKeys });
	};

	//Table行选择事件
	handleRowClk = (records) => {
		this.setState({
			selectedRowKeys: [records.recId],
		});
	};

	//[查询] 按钮
	handleQuery = (qryForm) => {
		const { actions } = this.props;
		// if (!qryForm) {
		//     qryForm = JSON.parse(localStorage.getItem(ErrorLogSearchFormCacheKey));
		// }
		if (!qryForm) {
			const currentDate = new Date();
			const currentDateTime = moment(
				`${moment(currentDate).format('YYYYMMDD')}235959`,
				'YYYYMMDDhhmmss').toDate().getTime();
			const last30DayTime = moment(
				moment(currentDate).subtract(30, 'days').format('YYYYMMDD'),
				'YYYYMMDDhhmmss').toDate().getTime();
			qryForm = {
				beginTime: last30DayTime,
				endTime: currentDateTime,
				qryBean: {},
			};
		}
		this.setState({
			currentPage: 1
		},() => {
			actions.qryErrorLogByForm(qryForm);
		});

	};

	//[修改] 按钮
	handleEdit = () => {
		const select = this.state.selectedRowKeys;
		if (select && select[0]) {
			this.context.router.replace(
				`${businessRoute.ErrorLogEdit}${select[0]}`);
		} else {
			MsgUtil.showwarning('请选择一条需要修改的数据');
		}
	};

	//表格分页
	pagination = (data) => {
		const component = this;
		if (data == undefined) {
			data = [];
		}
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

	render () {
		const { errorLogList } = this.props;
		const { selectedRowKeys } = this.state;
		// 通过 rowSelection 对象表明需要行选择
		const rowSelection = {
			type: 'radio',
			onChange: this.onRadioSelectChange,
			selectedRowKeys,
		};
		const columns = [
			{
				title: '错误ID',
				dataIndex: 'recId',
				key: 'recId',
				width: 180,
			}, {
				title: '错误端',
				dataIndex: 'systemType',
				key: 'systemType',
				width: 100,
			}, {
				title: '创建时间',
				dataIndex: 'createTime',
				key: 'createTime',
				width: 150,
				render: text => moment(text).format('YYYY-MM-DD hh:mm:ss'),
			}, {
				title: '处理状态',
				dataIndex: 'dealSts',
				key: 'dealSts',
				width: 100,
				render: (text) => {
					switch (text) {
						case 0: {
							return '待处理';
						}
						case 1: {
							return '己阅';
						}
						case 2: {
							return '已处理';
						}
						default: {
							return '未知';
						}
					}
				},
			}, {
				title: '处理人',
				dataIndex: 'dealPerson',
				key: 'dealPerson',
				width: 80,
			}, {
				title: '处理时间',
				dataIndex: 'dealTime',
				key: 'dealTime',
				width: 150,
				render: (text) => {
					if (text) {
						return moment(errorLogList.dealTime).
							format('YYYY-MM-DD hh:mm:ss');
					}
				},
			}, {
				title: '处理结果',
				dataIndex: 'dealResult',
				key: 'dealResult',
				width: 100,
			}];

		const hasSelected = selectedRowKeys && selectedRowKeys.length > 0;

		return (
			<div>
				<Row>
					<Col span={20} >
						<ErrorLogSearchForm handleQuery={this.handleQuery} />
					</Col>
					<Col style={{ textAlign: 'right' }} >
						<Button type="primary" icon="edit" onClick={this.handleEdit} disabled={!hasSelected} >修改</Button>
					</Col>
				</Row>
				<Row style={{ color: '#2db7f5' }} >注：默认为30天的统计(如：2016/11/07~2016/12/07),最长查询周期为90天</Row>
				<Row>&nbsp;</Row>
				<Row>
					<Col>
						<Table
							expandedRowRender={
								record => <p>错误内容：{record.errorInfo}</p>
							}
							rowSelection={rowSelection}
							columns={columns}
							onRowClick={this.handleRowClk}
							rowKey={record => record.recId}
							dataSource={errorLogList}
							pagination={this.pagination(errorLogList)}
						/>
					</Col>
				</Row>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { errorLogList } = state.get('ErrorLogService').toObject();
	return {
		rspInfo,
		actionType,
		errorLogList,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({ qryErrorLogByForm }, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorLogAdmin);
