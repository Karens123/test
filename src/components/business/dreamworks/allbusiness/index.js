'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Modal, Row, Table,Icon,Tabs,Pagination,Select,Input } from 'antd';
import { Link } from 'react-router';
import { qryAllBusiness } from 'action';
import { parseDate } from 'utils/DateUtil';

import * as businessRoute from 'business/route';
import 'business/dreamworks/common.less';

class AllBusinessAdmin extends React.Component {

	//检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
		allBusiness: PropTypes.object,
		params: PropTypes.object,
	};

	static defaultProps = {
		allBusiness: {},
		params: {}
	};

	constructor(props) {
		super(props);
		this.state = {
			pageSize: 10,
			currentPage: 1,
			showList: [],
			record: {},
			totalCount: 10,
		};
	}

	componentWillMount() {
		const { showList } = this.state;
		const { params, actions } = this.props;
		const { page } = params;
		if (page !== undefined) {
			this.setState({
				currentPage: parseInt(page),
			}, () => {
				this.qryTable();
			});
		} else {
			//首次加载读取默认数据加载
			if (!showList.length) {
				this.qryTable();
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		const { currentPage } = this.state;
		const { allBusiness } = nextProps;
		const showListData = [];
		console.log('next props',allBusiness);
		if (allBusiness && allBusiness.records) {
			const ret = allBusiness.records;
			for (let i = 0, len = ret.length; i < len; i++) {
				const data = ret[i];
				showListData.push({
					key: i,
					name: data.entInfo.name,
					id: data.userInfo.wenwenId,
					contact: data.userInfo.phoneId,
					joinTime: parseDate(data.entInfo.createTime) ,
					pendingAudit: data.demandStatInfo.inAuditingNum,
					pendingSign: data.demandStatInfo.pendingContractNum,
					onProgress: data.demandStatInfo.handlingNum,
					completed: data.demandStatInfo.completed||0,
					demand: data.demandStatInfo.totalCount,
					balance: data.balance||0,
					action: (<Link to={`${businessRoute.QryBusinessDetail}/${currentPage}/${data.userInfo.wenwenId}`} >查看</Link>),
				});
			}
			this.setState({
				totalCount: allBusiness.totalCount,
			});
		} else {
			console.log('no records');
		}
		this.setState({
			showList: showListData
		}, () => {
			console.log('showListData________', showListData);
		});
	};
	//控制查询
	qryTable = () => {
		const { actions } = this.props;
		const { currentPage, record } = this.state;
		console.log('qry all business');
		actions.qryAllBusiness({ currentPage, record });
	};
	//分页控制
	paginationController = (num) => {
		this.setState({
			currentPage: num
		}, () => {
			this.qryTable();
		});
	};
	searchHandler = (val) => {
		console.log('功能开发中，输入信息为：',val);
	};

	render (){
		const { showList, totalCount, currentPage } = this.state;
		const TabPane = Tabs.TabPane;
		const Option = Select.Option;
		const Search = Input.Search;
		const AllBusinessColumns = [
			{
				title: '商家名称',
				dataIndex: 'name',
				key: 'name',
			}, {
				title: '商家ID',
				dataIndex: 'id',
				key: 'id',
			}, {
				title: '联系方式',
				dataIndex: 'contact',
				key: 'contact',
			}, {
				title: '加入时间',
				dataIndex: 'joinTime',
				key: 'joinTime',
			}, {
				title: '待审核',
				dataIndex: 'pendingAudit',
				key: 'pendingAudit',
			}, {
				title: '待签约',
				dataIndex: 'pendingSign',
				key: 'pendingSign',
			}, {
				title: '进行中',
				dataIndex: 'onProgress',
				key: 'onProgress',
			}, {
				title: '已完成',
				dataIndex: 'completed',
				key: 'completed',
			},{
				title: '需求',
				dataIndex: 'demand',
				key: 'demand',
			}, {
				title: '余额',
				dataIndex: 'balance',
				key: 'balance',
			}, {
				title: '操作',
				dataIndex: 'action',
				key: 'action',
			}];


		return (
			<div className="all-business">
				<Row>
					<Col span={24} >
						<h3 style={{ fontSize: '36px', marginBottom: '20px' }} >全部商家/All businesses</h3>
					</Col>
					<Col span={24} >
						<div className="admin-main" >
							<div className="admin-ctr" >
								<Search
									placeholder="功能开发中。。。"
									style={{ width: 150 }}
									onSearch={this.searchHandler}
								/>
							</div>
							<Tabs defaultActiveKey={'1'} >
								<TabPane tab="全部" key="1" >
									<Table dataSource={showList} columns={AllBusinessColumns} pagination={false} />
									<div className="pg-ctr" >
										<Pagination
											defaultCurrent={currentPage}
											current={currentPage}
											total={totalCount}
											onChange={this.paginationController}
										/>
									</div>
								</TabPane>
								{/*<TabPane tab="开发中" key="2" >*/}
								{/*开发中*/}
								{/*</TabPane>*/}
							</Tabs>
						</div>
					</Col>
				</Row>
			</div>
		);
	}
}


const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { allBusiness } = state.get('QryBusinessReducer').toObject();
	return {
		rspInfo,
		actionType,
		allBusiness
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryAllBusiness
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AllBusinessAdmin);