'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Modal, Row, Table,Icon,Tabs,Pagination,Select,Input } from 'antd';
import { Link } from 'react-router';
import { qryAllDesigner } from 'action';
import { parseDate } from 'utils/DateUtil';

import * as businessRoute from 'business/route';
import 'business/dreamworks/common.less';

class AlldesignerAdmin extends React.Component {
	//检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
		data: PropTypes.object,
		params: PropTypes.object,
	};

	static defaultProps = {
		data: {},
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
			if (!showList.length ) {
				this.qryTable();
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		const { currentPage } = this.state;
		const { data } = nextProps;
		const demandStatInfo=[];

		if (data && data.records) {
			const ret = data.records;
			for (let i = 0, len = ret.length; i < len; i++) {
				const data = ret[i];
				demandStatInfo.push({
					pendingContractNum: data.demandStatInfo.pendingContractNum,
					handlingNum: data.demandStatInfo.handlingNum,
					applyingNum: data.demandStatInfo.applyingNum,
					inAuditingNum: data.demandStatInfo.inAuditingNum,
					completedNum: data.demandStatInfo.completedNum,
					realName: data.dsnerInfo.realName,
					designerId: data.dsnerInfo.designerId,
					createTime: data.dsnerInfo.createTime,
					worksCnt: data.worksCnt,
					contact: data.userInfo.phoneId,
					action: (<Link to={`${businessRoute.QryDesignerDetail}/${currentPage}/${data.dsnerInfo.designerId}`} >查看</Link>),
				});
			}

			this.setState({
				totalCount: data.totalCount,
			});
		}
		this.setState({
			showList: demandStatInfo
		}, () => {
		});
	};
	//控制查询
	qryTable = () => {
		const { actions } = this.props;
		const { currentPage, record } = this.state;
		actions.qryAllDesigner({ currentPage, record });
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
		const { showList,  totalCount, currentPage } = this.state;
		console.log('showList______________________:', showList);
		const TabPane = Tabs.TabPane;
		const Option = Select.Option;
		const Search = Input.Search;
		const AllDesignerColumns = [
			{
				title: '设计师',
				dataIndex: 'realName',
				key: 'realName',
			}, {
				title: 'ID',
				dataIndex: 'designerId',
				key: 'designerId',
			}, {
				title: '联系方式',
				dataIndex: 'contact',
				key: 'contact',
			}, {
				title: '加入时间',
				dataIndex: 'createTime',
				key: 'createTime',
				render: (item) => {
					if (item) {
						return parseDate(item);
					} else {
						return '';
					}
				}
			}, {
				title: '待签约',
				dataIndex: 'pendingContractNum',
				key: 'pendingContractNum',
			}, {
				title: '进行中',
				dataIndex: 'handlingNum',
				key: 'handlingNum',
			},  {
				title: '申请中',
				dataIndex: 'applyingNum',
				key: 'applyingNum',
			}, {
				title: '审核中',
				dataIndex: 'inAuditingNum',
				key: 'inAuditingNum',
			},{
				title: '已完成',
				dataIndex: 'completedNum',
				key: 'completedNum',
			},{
				title: '个人创作',
				dataIndex: 'worksCnt',
				key: 'worksCnt',
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
						<h3 style={{ fontSize: '36px', marginBottom: '20px' }} >全部设计师/All designer</h3>
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
									<Table
										dataSource={showList}
										columns={AllDesignerColumns}
										pagination={false}
									/>

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
	const { data } = state.get('QryAllDesignerReducer').toObject();

	return {
		rspInfo,
		actionType,
		data
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryAllDesigner
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AlldesignerAdmin);