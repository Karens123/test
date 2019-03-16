'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Col, Row, Table, Tabs, Select, Pagination } from 'antd';
import { parseDate } from 'utils/DateUtil';
import { qryDsnApplication, qryBsnApplication } from 'action';

import * as businessRoute from 'business/route';
import './index.less';

class qryApplicationAdmin extends React.Component {
	//检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
		bsnData: PropTypes.object,
		dsnData: PropTypes.object,
		params: PropTypes.object,
	};

	static defaultProps = {
		bsnData: {},
		dsnData: {},
		params: {}
	};

	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			showDataType: '1',
			pageSize: 10,
			dsnCurrentPage: 1,
			dsnShowList: [],
			bsnCurrentPage: 1,
			bsnShowList: [],
			record: {},
			dsnTotalCount: 10,
			bsnTotalCount: 10,
			tempCurrentPage: 0,
			filtering: false
		};
	}

	componentWillMount() {
		const { dsnShowList } = this.state;
		const { params, actions } = this.props;
		const { page, dataType } = params;
		if (page !== undefined && dataType !== undefined) {
			switch (dataType) {
				case '1': {
					this.setState({
						showDataType: dataType,
						dsnCurrentPage: parseInt(page),
						bsnCurrentPage: 1
					}, () => {
						console.log('come back to dsn-list');
						this.qryTable();
					});
					break;
				}
				case '2': {
					this.setState({
						showDataType: dataType,
						bsnCurrentPage: parseInt(page),
						dsnCurrentPage: 1
					}, () => {
						console.log('come back to bsn-list');
						this.qryTable();
					});
					break;
				}
				default:
					break;
			}
		} else {
			//首次加载读取默认数据加载
			if (!dsnShowList.length) {
				this.qryTable();
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		const { showDataType, dsnCurrentPage, bsnCurrentPage } = this.state;
		const { bsnData, dsnData } = nextProps;
		const showListData = [];
		switch (showDataType) {
			case '1': {
				//列表模型
				if (dsnData && dsnData.records) {
					const ret = dsnData.records;
					for (let i = 0, len = ret.length; i < len; i++) {
						const data = ret[i];
						showListData.push({
							key: i,
							name: data.realName,
							id: data.designerId,
							// contact: 'null',
							appTime: parseDate(data.createTime),
							status: data.state === 1 ? (<span className="blue" >审核中</span>) : data.state === 3 ? (
								<span className="red" >未通过</span>) : '未知状态',
							action: (<Link
								to={`${businessRoute.qryApplicationDsn}/${data.designerId}/${dsnCurrentPage}/${showDataType}`}
							>查看</Link>),
						});
					}
					this.setState({
						dsnTotalCount: dsnData.totalCount,
					});
				}
				this.setState({
					dsnShowList: showListData
				}, () => {
					console.log('showListData________', showListData);
				});
				break;
			}
			case '2': {
				if (bsnData && bsnData.records) {
					const ret = bsnData.records;
					for (let i = 0, len = ret.length; i < len; i++) {
						const data = ret[i];
						showListData.push({
							key: i,
							name: data.name,
							id: data.enterpriseId,
							// contact: 'null',
							appTime: parseDate(data.createTime),
							status: data.state === 1 ? (<span className="blue" >审核中</span>) : data.state === 3 ? (
								<span className="red" >未通过</span>) : '未知状态',
							action: (<Link
								to={`${businessRoute.qryApplicationBsn}/${data.enterpriseId}/${bsnCurrentPage}/${showDataType}`}
							>查看</Link>),
						});
					}
					this.setState({
						bsnTotalCount: bsnData.totalCount,
					});
				}
				this.setState({
					bsnShowList: showListData
				}, () => {
					console.log('showListData________', showListData);
				});
				break;
			}
		}
	};
	//切换分页的控制
	showDataTypeHandler = (key) => {
		this.setState({
			showDataType: key,
		}, () => {
			this.qryTable();
		});
	};

	//控制查询
	qryTable = () => {
		const { actions } = this.props;
		const { showDataType, dsnCurrentPage, bsnCurrentPage, record } = this.state;

		switch (showDataType) {
			case '1': {
				actions.qryDsnApplication({ currentPage: dsnCurrentPage, record });
				break;
			}
			case '2': {
				actions.qryBsnApplication({ currentPage: bsnCurrentPage, record });
				break;
			}
			default:
				break;
		}
	};

	//状态筛选
	statusSelector = (v) => {
		const { record, showDataType } = this.state;
		record.state = v;
		switch (showDataType) {
			case '1': {
				this.setState({
					dsnCurrentPage: 1,
				});
				break;
			}
			case '2': {
				this.setState({
					bsnCurrentPage: 1,
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
					dsnCurrentPage: num
				}, () => {
					this.qryTable();
				});
				break;
			}
			case '2': {
				this.setState({
					bsnCurrentPage: num
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
		const { dsnShowList, bsnShowList, dsnTotalCount, bsnTotalCount, showDataType, dsnCurrentPage, bsnCurrentPage } = this.state;
		const TabPane = Tabs.TabPane;
		const Option = Select.Option;

		const designerColumns = [
			{
				title: '申请人',
				dataIndex: 'name',
				key: 'name',
			}, {
				title: 'ID',
				dataIndex: 'id',
				key: 'id',
			}, {
				// 	title: '联系方式',
				// 	dataIndex: 'contact',
				// 	key: 'contact',
				// },{
				title: '申请时间',
				dataIndex: 'appTime',
				key: 'appTime',
			}, {
				title: '状态',
				dataIndex: 'status',
				key: 'status',
			}, {
				title: '操作',
				dataIndex: 'action',
				key: 'action',
			}];

		const businessColumns = [
			{
				title: '申请企业',
				dataIndex: 'name',
				key: 'name',
			}, {
				title: 'ID',
				dataIndex: 'id',
				key: 'id',
			}, {
				title: '申请时间',
				dataIndex: 'appTime',
				key: 'appTime',
			}, {
				// 	title: '联系方式',
				// 	dataIndex: 'contact',
				// 	key: 'contact'
				// },{
				title: '状态',
				dataIndex: 'status',
				key: 'status',
			}, {
				title: '操作',
				dataIndex: 'action',
				key: 'action',
			}];

		return (<div className="qry-apply-admin" >
			<Row>
				<Col span={24} >
					<h3 style={{ fontSize: '36px', marginBottom: '20px' }} >入驻申请/Admission</h3>
				</Col>
				<Col span={24} >
					<div className="admin-main" >
						<div className="admin-ctr" >
							<Select
								defaultValue=""
								style={{ width: 120 }}
								onChange={this.statusSelector}
							>
								<Option value="" >全部</Option>
								<Option value="1" >审核中</Option>
								<Option value="3" >未通过</Option>
							</Select>
						</div>
						<Tabs defaultActiveKey={showDataType} onChange={this.showDataTypeHandler} >
							<TabPane tab="设计师" key="1" >
								<Table dataSource={dsnShowList} columns={designerColumns} pagination={false} />
								<div className="pg-ctr" >
									<Pagination
										defaultCurrent={dsnCurrentPage}
										current={dsnCurrentPage}
										total={dsnTotalCount}
										onChange={this.paginationController}
									/>
								</div>
							</TabPane>
							<TabPane tab="商户" key="2" >
								<Table dataSource={bsnShowList} columns={businessColumns} pagination={false} />
								<div className="pg-ctr" >
									<Pagination
										defaultCurrent={bsnCurrentPage}
										current={bsnCurrentPage}
										total={this.state.bsnTotalCount}
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
	const { dsnData, bsnData } = state.get('QryApplyReducer').toObject();
	return {
		rspInfo,
		actionType,
		dsnData,
		bsnData,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryDsnApplication,
			qryBsnApplication,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(qryApplicationAdmin);
