'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Col, Row, Table, Tabs, Select, Pagination } from 'antd';
import { parseDate,getDay,getDiffDayFromNow  } from 'utils/DateUtil';
import { qryEnterpriseDemand, qryPendingAudit,qryPendingAuditTab } from 'action';
import { statusNumToClass,statusNumToText,chipNumToText,worksTypeNumToText,contractTypeNumToClass } from 'utils/MappingUtil';
import * as businessRoute from 'business/route';

import './index.less';
import demandColumnData from './demandColumnData';


class DemandAdmin extends React.Component {
	//检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
		PendingAuditInfo: PropTypes.object,
		allDemandInfo: PropTypes.object,
		params: PropTypes.object,
	};

	static defaultProps = {
		PendingAuditInfo: {},
		allDemandInfo: {},
		params: {}
	};

	constructor(props) {
		super(props);
		this.state = {
			showDataType: '1',
			pageSize: 10,

			record: {},
			tempCurrentPage: 0,
			filtering: false,
			bsnTotalCount: 10,

			allDemandList: [],//所有需求
			PendingAuditList: [], //特审核
			PendingContractList: [], //待签约
			InProcessList: [], //
			finishedList: [], //

			allDemandTotalCount: 10,
			PendingAuditTotalCount: 10,
			PendingContractTotalCount: 10,
			InProcessTotalCount: 10,
			finishedTotalCount: 10,

			allDemandCurrentPage: 1,
			PendingAuditCurrentPage: 1,
			pendingContractCurrentPage: 1,
			InProcessCurrentPage: 1,
			finishedCurrentPage: 1,
			PendingAuditSate: 2, //特审核状态
			demandStatInfo: {}


		};
	}

	componentWillMount() {
		const { allDemandList } = this.state;

		const { params, actions } = this.props;
		const { page, dataType } = params;
		if (page !== undefined && dataType !== undefined) {
			switch (dataType) {
				case '2': {
					this.setState({
						showDataType: dataType,
						pendingContractCurrentPage: parseInt(page),
						allDemandCurrentPage: 1,
						PendingAuditCurrentPage: 1,
						InProcessCurrentPage: 1,
						finishedCurrentPage: 1,

					}, () => {
						console.log('come back to bsn-list');
						this.qryTable();
					});
					break;
				}
				case '5': {
					this.setState({
						showDataType: dataType,
						allDemandCurrentPage: parseInt(page),
						pendingContractCurrentPage: 1,
						PendingAuditCurrentPage: 1,
						InProcessCurrentPage: 1,
						finishedCurrentPage: 1,
					}, () => {
						console.log('come back to dsn-list');
						this.qryTable();
					});
					break;
				}

				case '4': {
					this.setState({
						showDataType: dataType,
						allDemandCurrentPage: 1,
						pendingContractCurrentPage: 1,
						PendingAuditCurrentPage: 1,
						InProcessCurrentPage: 1,
						finishedCurrentPage: parseInt(page),
					}, () => {
						console.log('come back to dsn-list');
						this.qryTable();
					});
					break;
				}

				case '3': {
					this.setState({
						showDataType: dataType,
						allDemandCurrentPage: 1,
						pendingContractCurrentPage: 1,
						PendingAuditCurrentPage: 1,
						InProcessCurrentPage: parseInt(page),
						finishedCurrentPage: 1,
					}, () => {
						console.log('come back to dsn-list');
						this.qryTable();
					});
					break;
				}

				case '1': {
					this.setState({
						showDataType: dataType,
						allDemandCurrentPage: 1,
						pendingContractCurrentPage: 1,
						PendingAuditCurrentPage: parseInt(page),
						InProcessCurrentPage: 1,
						finishedCurrentPage: 1,
					}, () => {
						console.log('come back to dsn-list');
						this.qryTable();
					});
					break;
				}
				default:
					break;
			}
		} else {
			//首次加载读取默认数据加载
			if (!allDemandList.length) {
				this.qryTable();
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		const { showDataType, allDemandCurrentPage, pendingContractCurrentPage,PendingAuditCurrentPage,InProcessCurrentPage,finishedCurrentPage } = this.state;
		const { PendingAuditInfo, allDemandInfo } = nextProps;
		if (PendingAuditInfo.demandStatInfo) {
			this.setState({
				demandStatInfo: {
					completedNum: PendingAuditInfo.demandStatInfo.completedNum,
					handlingNum: PendingAuditInfo.demandStatInfo.handlingNum,
					inAuditingNum: PendingAuditInfo.demandStatInfo.inAuditingNum,
					pendingContractNum: PendingAuditInfo.demandStatInfo.pendingContractNum,
					totalCount: PendingAuditInfo.demandStatInfo.totalCount,
				}
			});
		}

		const showListData = [];
		switch (showDataType) {
			case '5': {
				//全部需求
				if (allDemandInfo && allDemandInfo.records) {
					const ret = allDemandInfo.records;

					for (let i=0;i<=ret.length-1;i++) {
						const data = ret[i];
						showListData.push({
							key: i,
							productName: data.productName,
							publisher: data.publisher.nick,
							chip: chipNumToText(data.chip),
							contractDeposit: (data.contractDeposit/100).toFixed(2),
							contractType: data.contractType==0 ? '设计师竞标':data.contractType==1 ? '商家委托' :'',
							designer: data.designer,
							type: data.type,
							timeLimit: ((() => {
								let currentDay='';
								const { record } = this.state;
								if (JSON.stringify(record)=='{}' || record.state==4) {
									currentDay=`${data.timeLimit-getDiffDayFromNow(data.contractCreateTime)}`;
								} else {
									currentDay=data.timeLimit;
								}

								if (currentDay<0) {
									currentDay=`超时${currentDay*(-1)}`;
								} else {
									currentDay=`剩于${currentDay}`;
								}
								return currentDay;
							})()),
							reward: (data.reward/100).toFixed(2),
							state: (<span className={`${statusNumToClass(data.state)} status`}>{statusNumToText(data.state)}</span>),
							opr: (<Link
								to={`${businessRoute.allDemandDetails}/${data.demandId}/${allDemandCurrentPage}/${showDataType}`}
							>查看</Link>),
						});
					}
					this.setState({
						allDemandTotalCount: allDemandInfo.totalCount,
					});
				}
				this.setState({
					allDemandList: showListData
				}, () => {
				});
				break;
			}
			case '1': {
				//审核
				if (PendingAuditInfo && PendingAuditInfo.records) {
					const ret = PendingAuditInfo.records;
					for (let i=0;i<=ret.length-1;i++) {
						const data = ret[i];
						showListData.push({
							key: i,
							productName: data.productName,
							publisher: data.publisher.nick,
							chip: chipNumToText(data.chip),
							type: data.type,
							timeLimit: data.timeLimit,
							reward: (data.reward/100).toFixed(2),
							state: (<span className={`${statusNumToClass(data.state)} status`}>{statusNumToText(data.state)}</span>),
							opr: (<Link
								to={`${businessRoute.allDemandDetails}/${data.demandId}/${PendingAuditCurrentPage}/${showDataType}`}
							>查看</Link>),
						});
					}
					this.setState({
						PendingAuditTotalCount: PendingAuditInfo.totalCount,
					});
				}
				this.setState({
					PendingAuditList: showListData
				}, () => {
				});
				break;
			}

			case '2':  {
				//待签约
				if (allDemandInfo && allDemandInfo.records) {
					const ret = allDemandInfo.records;
					for (let i=0;i<=ret.length-1;i++) {
						const data = ret[i];
						showListData.push({
							key: i,
							productName: data.productName,
							publisher: data.publisher.nick,
							chip: chipNumToText(data.chip),
							type: data.type,
							timeLimit: data.timeLimit,
							reward: (data.reward/100).toFixed(2),
							state: (<span className={`${statusNumToClass(data.state)} status`}>{statusNumToText(data.state)}</span>),
							opr: (<Link
								to={`${businessRoute.allDemandDetails}/${data.demandId}/${pendingContractCurrentPage}/${showDataType}`}
							>查看</Link>),
						});
					}
					this.setState({
						PendingContractTotalCount: allDemandInfo.totalCount,
					});
				}
				this.setState({
					PendingContractList: showListData
				}, () => {
				});
				break;
			}

			case '3':  {
				//进行中
				if (allDemandInfo && allDemandInfo.records) {
					const ret = allDemandInfo.records;
					for (let i=0;i<=ret.length-1;i++) {
						const data = ret[i];
						showListData.push({
							key: i,
							productName: data.productName,
							publisher: data.publisher.nick,
							chip: chipNumToText(data.chip),
							type: data.type,
							// timeLimit: `剩于${data.timeLimit-getDiffDayFromNow(data.contractCreateTime)}`,
							timeLimit: ((() => {
								let currentDay='';
								const { record } = this.state;
								if (JSON.stringify(record)=='{}' || record.state==4) {
									currentDay=`${data.timeLimit-getDiffDayFromNow(data.contractCreateTime)}`;
								} else {
									currentDay=data.timeLimit;
								}
								if (currentDay<0) {
									currentDay=`超时${currentDay*(-1)}`;
								} else {
									currentDay=`剩于${currentDay}`;
								}
								return currentDay;
							})()),
							contractDeposit: data && data.contractDeposit ? (data.contractDeposit/100).toFixed(2): '',
							contractType: data && data.contractType ? contractTypeNumToClass(data.contractType) : '',
							reward: (data.reward/100).toFixed(2),
							state: (<span className={`${statusNumToClass(data.state)} status`}>{statusNumToText(data.state)}</span>),
							opr: (<Link
								to={`${businessRoute.allDemandDetails}/${data.demandId}/${InProcessCurrentPage}/${showDataType}`}
							>查看</Link>),
						});
					}
					this.setState({
						InProcessTotalCount: allDemandInfo.totalCount,
					});
				}
				this.setState({
					InProcessList: showListData
				}, () => {
				});
				break;
			}

			case '4':  {
				//己完成
				if (allDemandInfo && allDemandInfo.records) {
					const ret = allDemandInfo.records;
					for (let i=0;i<=ret.length-1;i++) {
						const data = ret[i];
						showListData.push({
							key: i,
							productName: data.productName,
							publisher: data.publisher.nick,
							chip: chipNumToText(data.chip),
							type: data.type,
							timeLimit: data.timeLimit,
							reward: (data.reward/100).toFixed(2),
							state: (<span className={`${statusNumToClass(data.state)} status`}>{statusNumToText(data.state)}</span>),
							opr: (<Link
								to={`${businessRoute.allDemandDetails}/${data.demandId}/${finishedCurrentPage}/${showDataType}`}
							>查看</Link>),
						});
					}
					this.setState({
						finishedTotalCount: allDemandInfo.totalCount,
					});
				}
				this.setState({
					finishedList: showListData
				}, () => {
				});
				break;
			}
		}
	};
	showDataTypeHandler = (key) => {

		this.setState({
			showDataType: key,
			record: {
				state: key
			}
		}, () => {
			this.qryTable();
		});
	};

	//控制查询
	qryTable = () => {
		const { actions } = this.props;
		const { finishedCurrentPage, pageSize,showDataType, allDemandCurrentPage,PendingAuditCurrentPage, pendingContractCurrentPage, InProcessCurrentPage } = this.state;
		const { record } = this.state;
		if (showDataType) {
			//0-待支付, 1-待审核,2-未通过, 3-待签约, 4-进行中, 5-已完成
			if (showDataType==1) {	//待审核
				record.state='';
				actions.qryPendingAudit({ currentPage: PendingAuditCurrentPage,pageSize, record });
			} else {
				if ( showDataType==5) {
					console.log('record_____________________________123___:', record);
					console.log('JSON.stringify(record)_____________________________123___:', JSON.stringify(record));
					if (JSON.stringify(record)=='{}' || record.state==5) {
						record.state='';
					}
					actions.qryEnterpriseDemand({ currentPage: allDemandCurrentPage,pageSize, record });
					actions.qryPendingAuditTab({ currentPage: allDemandCurrentPage,pageSize, record });

				} else if ( showDataType==2) {
					record.state=3;
					actions.qryEnterpriseDemand({ currentPage: pendingContractCurrentPage,pageSize, record });
					actions.qryPendingAuditTab({ currentPage: allDemandCurrentPage,pageSize, record });
				} else if ( showDataType==3) {
					record.state=4;
					actions.qryEnterpriseDemand({ currentPage: InProcessCurrentPage,pageSize, record });
					actions.qryPendingAuditTab({ currentPage: allDemandCurrentPage,pageSize, record });
				} else if ( showDataType==4) {
					record.state=5;
					actions.qryEnterpriseDemand({ currentPage: finishedCurrentPage,pageSize, record });
					actions.qryPendingAuditTab({ currentPage: allDemandCurrentPage,pageSize, record });
				}
			}
		}
	};

	//状态筛选
	statusSelector = (v) => {
		const { record, showDataType } = this.state;
		record.state = v;

		switch (showDataType) {

			case '5': {
				this.setState({
					allDemandCurrentPage: 1,
				});
				break;
			}
			case '1': {
				this.setState({
					PendingAuditCurrentPage: 1,
				});
				break;
			}
			case '2': {
				this.setState({
					pendingContractCurrentPage: 1,
				});
				break;
			}
			case '3': {
				this.setState({
					InProcessCurrentPage: 1,
				});
				break;
			}
			case '4': {
				this.setState({
					finishedCurrentPage: 1,
				});
				break;
			}
		}
		this.setState({
			record,
		}, () => {
			this.qryTable();
		});
	};

	//分页控制
	paginationController = (num) => {
		const { showDataType } = this.state;
		switch (showDataType) {
			case '1': {
				this.setState({
					PendingAuditCurrentPage: num
				}, () => {
					this.qryTable();
				});
				break;
			}
			case '2': {
				this.setState({
					pendingContractCurrentPage: num
				}, () => {
					this.qryTable();
				});
				break;
			}
			case '3': {
				this.setState({
					InProcessCurrentPage: num
				}, () => {
					this.qryTable();
				});
				break;
			}

			case '4': {
				this.setState({
					finishedCurrentPage: num
				}, () => {
					this.qryTable();
				});
				break;
			}

			case '5': {
				this.setState({
					allDemandCurrentPage: num
				}, () => {
					this.qryTable();
				});
				break;
			}
			default:
				break;
		}
	};


	render() {
		const { demandStatInfo,finishedList,finishedCurrentPage,PendingAuditInfo, InProcessCurrentPage,InProcessList, PendingContractList, PendingAuditCurrentPage, allDemandList, PendingAuditList, allDemandTotalCount, PendingAuditTotalCount, showDataType, allDemandCurrentPage, pendingContractCurrentPage } = this.state;
		const TabPane = Tabs.TabPane;
		const Option = Select.Option;
		return (<div className="qry-apply-admin" >
			<Row>
				<Col span={24} >
					<h3 style={{ fontSize: '36px', marginBottom: '20px' }} >需求管理/Demand management</h3>
				</Col>
				<Col span={24} >
					<div className="admin-main" >
						{ showDataType ==5 ? (<div className="admin-ctr" >
							<Select
								defaultValue=""
								style={{ width: 120 }}
								onChange={this.statusSelector}
							>
								<Option value="" >全部</Option>
								<Option value="1" >待审核</Option>
								<Option value="2" >未通过</Option>
								<Option value="3" >待签约</Option>
								<Option value="4" >进行中</Option>
								<Option value="5" >已完成</Option>
							</Select>
						</div>) : '' }
						<Tabs defaultActiveKey={showDataType} onChange={this.showDataTypeHandler} >


							<TabPane tab={`待审核(${demandStatInfo && demandStatInfo.inAuditingNum ? demandStatInfo.inAuditingNum :''})`} key="1" >
								<Table
									dataSource={PendingAuditList}
									columns={demandColumnData.PendingAuditColumns}
									pagination={false}
								/>
								<div className="pg-ctr" >
									<Pagination
										defaultCurrent={PendingAuditCurrentPage}
										current={PendingAuditCurrentPage}
										total={this.state.PendingAuditTotalCount}
										onChange={this.paginationController}
									/>
								</div>
							</TabPane>

							<TabPane tab={`待签约(${demandStatInfo.pendingContractNum && demandStatInfo.pendingContractNum ? demandStatInfo.pendingContractNum: ''})`} key="2" >
								<Table
									dataSource={PendingContractList}
									columns={demandColumnData.pendingContractColumns}
									pagination={false}
								/>
								<div className="pg-ctr" >
									<Pagination
										defaultCurrent={pendingContractCurrentPage}
										current={pendingContractCurrentPage}
										total={this.state.PendingContractTotalCount}
										onChange={this.paginationController}
									/>
								</div>
							</TabPane>


							<TabPane tab={`进行中(${demandStatInfo.handlingNum && demandStatInfo.handlingNum ? demandStatInfo.handlingNum:  ''})`} key="3" >


								<Table
									dataSource={InProcessList}
									columns={demandColumnData.InProcessColumns}
									pagination={false}
								/>
								<div className="pg-ctr" >
									<Pagination
										defaultCurrent={InProcessCurrentPage}
										current={InProcessCurrentPage}
										total={this.state.InProcessTotalCount}
										onChange={this.paginationController}
									/>
								</div>
							</TabPane>
							<TabPane tab={`己完成(${demandStatInfo.completedNum && demandStatInfo.completedNum ? demandStatInfo.completedNum :''})`} key="4" >
								<Table
									dataSource={finishedList}
									columns={demandColumnData.finishedColumns}
									pagination={false}
								/>
								<div className="pg-ctr" >
									<Pagination
										defaultCurrent={finishedCurrentPage}
										current={finishedCurrentPage}
										total={this.state.finishedTotalCount}
										onChange={this.paginationController}
									/>
								</div>
							</TabPane>

							<TabPane tab={`全部需求(${demandStatInfo.totalCount && demandStatInfo.totalCount ? demandStatInfo.totalCount :''})`} key="5" >
								<Table
									dataSource={allDemandList}
									columns={demandColumnData.allDemandColumns}
									pagination={false}
								/>
								<div className="pg-ctr" >
									<Pagination
										defaultCurrent={allDemandCurrentPage}
										current={allDemandCurrentPage}
										total={allDemandTotalCount}
										onChange={this.paginationController}
									/>
								</div>
							</TabPane>



						</Tabs>
					</div>
				</Col>
			</Row>
		</div>);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { allDemandInfo, PendingAuditInfo } = state.get('DemandAdminReducer').toObject();
	return {
		rspInfo,
		actionType,
		allDemandInfo,
		PendingAuditInfo,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryEnterpriseDemand,
			qryPendingAudit,
			qryPendingAuditTab
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DemandAdmin);
