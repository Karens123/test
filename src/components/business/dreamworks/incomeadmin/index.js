'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Modal, Row, Table,Icon,Tabs,Pagination,Select,Input } from 'antd';
import { Link } from 'react-router';
import { qryIcomeList,qryIncomeDisbursementDetails } from 'action';
import { parseDate,parseDateTime } from 'utils/DateUtil';

import * as businessRoute from 'business/route';
import './index.less';

class IncomeAdmin extends React.Component {
	//检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
		data: PropTypes.object,
		params: PropTypes.object,
		iconeList: PropTypes.object.isRequired,
		incomeDisbursementDetails: PropTypes.object.isRequired,
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
			visible: false,
			incomeIdState: '',
			porjectName: '',
			incomeDisbursementDetailsData: {}
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
		let { data } = nextProps;
		const { iconeList,incomeDisbursementDetails } = nextProps;
		const inComeInfo=[];
		data={ ...iconeList };

		this.setState({
			incomeDisbursementDetailsData: incomeDisbursementDetails
		});

		if (data && data.records) {
			const ret = data.records;
			for (let i = 0, len = ret.length; i < len; i++) {
				const data = ret[i];
				inComeInfo.push({
					requestorName: data.requestorName,
					createTime: parseDateTime(data.createTime),
					remark: data.remark,
					totalAmount: (data.totalAmount/100).toFixed(2),
					Auditing: data.Auditing,
					incomeId: data.incomeId,
					action: (<Link
						onClick={() => {
							const { actions } = this.props;
							const qryForm={
								detailsId: data.detailsId,
							};
							actions.qryIncomeDisbursementDetails(qryForm);
							this.showModal();
						}}
					>查看</Link>),
				});
			}
			this.setState({
				totalCount: iconeList.totalCount,
			});
		}
		this.setState({
			showList: inComeInfo
		}, () => {
		});
	};
	//控制查询
	qryTable = () => {
		const { actions } = this.props;
		const { currentPage, record,pageSize } = this.state;
		actions.qryIcomeList({ currentPage, pageSize,record });
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

	showModal = () => {
		this.setState({
			visible: true,
		});
	};

	handleOk = (e) => {
		console.log(e);
		const { incomeDisbursementDetailsData } = this.state;
		console.log('incomeDisbursementDetailsData', incomeDisbursementDetailsData);

		const entityId = incomeDisbursementDetailsData.record.entityId;

		if (entityId) {
			window.open(`${businessRoute.incomeDemandDetails}/${entityId}`);
			// this.context.router.replace();
			this.setState({
				visible: false,
			});

		}
	};

	handleCancel = (e) => {
		console.log(e);
		this.setState({
			visible: false,
		});
	};

	renderModal = (incomeIdState) => {
		const styleObje=(
			 {
				 title: {
					 lineHeight: '35px',
					 marginBottom: '10px',
					 paddingBottom: '10px',
					 borderBottom: 'solid 1px #ddd'
				 }
			}
		);
		const lineHeight34=(
			{
				lineHeight: '34px'
			}
		);

		if (incomeIdState) {
			return (
				<div style={{ lineHeight: '30px' }}>
					<Row span={24} style={styleObje.title}>
						<Col span={20} style={lineHeight34}>
							<strong>基本详情</strong>
						</Col>
					</Row>
					<Row span={24} >
						<Col span={8} style={lineHeight34}>
							付款方：{incomeIdState.requestorName}
						</Col>
						<Col span={8} style={lineHeight34}>
							联系方式：{incomeIdState.requestorPhone}
						</Col>
						<Col span={8} >
							付款项目：{incomeIdState.remark}
						</Col>
					</Row>
					<Row span={24} >
						<Col span={8} style={lineHeight34}>
							打款方式：{
							((() => {
								if (incomeIdState) {
									return incomeIdState.channel==0 ? '支付宝': '微信';
								}
							})())
							 }
						</Col>
						<Col span={8} style={lineHeight34}>
							打款时间：{incomeIdState && incomeIdState.createTime ? parseDateTime(incomeIdState.createTime) :''}
						</Col>
						<Col span={8} style={lineHeight34}>
							到账时间：{incomeIdState && incomeIdState.channelPayTime ? parseDateTime(incomeIdState.channelPayTime) :''}
						</Col>

					</Row>
					<Row span={24} >
						<Col span={24} style={lineHeight34}>
							交易编号：{incomeIdState.channelTradeNo}
						</Col>

					</Row>
					<Row span={24} >
						<Col span={24} style={lineHeight34}>
							支付金额：¥ <span className="red"> { (incomeIdState.totalAmount/100).toFixed(2) }</span>元
						</Col>

					</Row>
				</div>
			);
		}
	};
	render (){
		const { showList,  totalCount, currentPage,incomeIdState,incomeDisbursementDetailsData } = this.state;
		const TabPane = Tabs.TabPane;
		const Option = Select.Option;
		const Search = Input.Search;
		let ret={};
		console.log('incomeDisbursementDetailsData______________render______________', incomeDisbursementDetailsData);
		if (incomeDisbursementDetailsData) {
			ret={ ...incomeDisbursementDetailsData.record };
		}




		const IcomeAdminColumns = [
			{
				title: '付款人',
				dataIndex: 'requestorName',
				key: 'requestorName',
			},{
				title: '备注',
				dataIndex: 'remark',
				key: 'remark',
			},{
				title: '日期',
				dataIndex: 'createTime',
				key: 'createTime',
			},  {
				title: '金额',
				dataIndex: 'totalAmount',
				key: 'totalAmount',
			},  {
				title: '操作',
				dataIndex: 'action',
				key: 'action',
			}, ];


		return (
			<div className="inComeAdmin">
				<Modal
					title={
						<div>
							<Row span={24} >
								<Col span={2}>
									收入
								</Col>
								<Col span={20} style={{ textAlign: 'center' }} >
									{ret.requestorName}
								</Col>
							</Row>
						</div>
					}
					visible={this.state.visible}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					okText="查看项目详情"
					cancelText=""
					width={720}
				>
					<div className="incomeDetail">{this.renderModal(ret)}</div>
				</Modal>

				<Row>
					<Col span={24} >
						<h3 style={{ fontSize: '36px', marginBottom: '20px' }} >收入 / Icome</h3>
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
										columns={IcomeAdminColumns}
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
	const { data,iconeList,incomeDisbursementDetails } = state.get('qryIcomeReducer').toObject();

	return {
		rspInfo,
		actionType,
		data,
		iconeList,
		incomeDisbursementDetails
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryIcomeList,
			qryIncomeDisbursementDetails,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(IncomeAdmin);