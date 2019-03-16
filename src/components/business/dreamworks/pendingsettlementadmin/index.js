'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Col, Row, Table, Tabs, Select, Pagination,Modal } from 'antd';
import { parseDate,parseDateTime } from 'utils/DateUtil';
import { qrypendingsettlement } from 'action';

import './index.less';

class Pendingsettlementadmin extends React.Component {
	//检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
		SettlementData: PropTypes.object,
		params: PropTypes.object,
	};

	static defaultProps = {
		SettlementData: {},
		params: {}
	};

	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			showDataType: '1',
			pageSize: 10,
			record: {},
			settlementListShowList: [],
			settlementListCurrentPage: 1,
			settlementListTotalCount: 10,
			porjectName: '',
			settlementdState: '',
		};
	}

	componentWillMount() {
		const { settlementListShowList } = this.state;
		const { params, actions } = this.props;
		const { page, dataType } = params;
		if (page !== undefined && dataType !== undefined) {
			switch (dataType) {
				case '1': {
					this.setState({
						showDataType: dataType,
						settlementListCurrentPage: parseInt(page),
						dealWithCurrentPage: 1
					}, () => {
						console.log('come back to settlementList-list');
						this.qryTable();
					});
					break;
				}
				default:
					break;
			}
		} else {
			//首次加载读取默认数据加载
			if (!settlementListShowList.length) {
				this.qryTable();
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		const { showDataType } = this.state;
		let { SettlementData } = nextProps;
		const temp={};

		temp.records=[{
			productName: 'ww',
			publisher: '1',
			remark: 'time',
			amount: '1000000',
			state: 1,
			reward: '100000',
			action: '1000',
			SettlementId: '3'
		}];
		temp.totalCount=1;
		SettlementData={ ...temp };
		const showListData = [];
		switch (showDataType) {
			case '1': {
				//列表模型
				if (SettlementData && SettlementData.records) {
					const ret = SettlementData.records;
					for (let i = 0, len = ret.length; i < len; i++) {
						const data = ret[i];
						showListData.push({
							productName: data.productName,
							publisher: data.publisher,
							remark: data.remark,
							SettlementId: data.SettlementId,
							amount: (data.amount/100).toFixed(2),
							reward: (data.reward/100).toFixed(1),
							state: data.state === 1 ? (<span className="blue" >审核中</span>) : data.state === 3 ? (
								<span className="red" >未通过</span>) : '未知状态',
							action: (<Link
								onClick={() => {
									this.showModal(data.SettlementId,data.productName);
								}}
							>查看</Link>),
						});
					}
					this.setState({
						settlementListTotalCount: SettlementData.totalCount,
					});
				}
				this.setState({
					settlementListShowList: showListData
				}, () => {
				});
				break;
			}
		}
	};
	//切换分页的控制
/*
	showDataTypeHandler = (key) => {
		this.setState({
			showDataType: key,
		}, () => {
			this.qryTable();
		});
	};
*/

	//控制查询
	qryTable = () => {
		const { actions } = this.props;
		const { record,settlementListCurrentPage,pageSize } = this.state;
		actions.qrypendingsettlement({ currentPage: settlementListCurrentPage, pageSize, record });
	};

	//状态筛选
	statusSelector = (v) => {
		const { record, showDataType } = this.state;
		record.state = v;
		this.setState({
			settlementListCurrentPage: 1,
		});


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
					settlementListCurrentPage: num
				}, () => {
					this.qryTable();
				});
				break;
			}
			default:
				break;
		}
	};

	showModal = (settlementdState,porjectName) => {
		this.setState({
			visible: true,
			settlementdState,
			porjectName

		});
	};

	handleOk = (e) => {
		console.log(e);
		this.setState({
			visible: false,
		});
	};

	handleCancel = (e) => {
		console.log(e);
		this.setState({
			visible: false,
		});
	};

	renderModal = (settlementdState) => {

		const { settlementListShowList } = this.state;
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
		const payoffData=[];
		settlementListShowList.map((item) => {
			console.log('item______________________________', item);

			if (item.SettlementId==settlementdState) {
				payoffData.push(item);
			}
		});
		const lineHeight34=(
			{
				lineHeight: '34px'
			}
		);

		console.log('payoffData______________________________', payoffData);


		if (payoffData.length >=1) {
			return (
				<div style={{ lineHeight: '30px' }}>
					<Row span={24} style={styleObje.title} >
						<Col span={20} style={lineHeight34}>
							需求详情：
						</Col>
						<Col span={4} style={lineHeight34}>
							审核人：{payoffData[0].Auditing}
						</Col>
					</Row>

					<Row span={24} >
						<Col span={8} style={lineHeight34}>
							申请人：{payoffData[0].realName}
						</Col>
						<Col span={8} style={lineHeight34}>
							联系人：{payoffData[0].prject}
						</Col>
						<Col span={8} style={lineHeight34}>
							上架时间：{payoffData[0].time}
						</Col>
					</Row>
					<Row span={24} >
						<Col span={8} style={lineHeight34}>
							需求名：{payoffData[0].realName}
						</Col>
						<Col span={8} style={lineHeight34}>
							类型：{payoffData[0].realName}
						</Col>
						<Col span={8} style={lineHeight34}>
							工期：{payoffData[0].litmtime}
						</Col>
					</Row>
					<Row span={24} >
						<Col span={8} style={lineHeight34}>
							芯片：{payoffData[0].chip}
						</Col>
						<Col span={8} style={lineHeight34}>
							总金额：<span className="redColor">{payoffData[0].reward}</span>
						</Col>
						<Col span={8} style={lineHeight34}>
							&nbsp;
						</Col>
					</Row>
					<Row span={24} style={styleObje.title} >
						<p>进度记录：</p>
					</Row>
					<Row span={24} >
						<div>
							2、完成订单结算剩余 <span className="redColor"> &nbsp; </span> <br />
							1、签约成功冻结定金 <span className="redColor"> &nbsp; </span>
						</div>
					</Row>

				</div>
			);
		}
	};
	render() {
		const {	settlementdState, settlementListShowList, settlementListTotalCount, showDataType, settlementListCurrentPage, } = this.state;

		console.log('settlementListShowList______________________________________', settlementListShowList);

		const TabPane = Tabs.TabPane;
		const Option = Select.Option;
		const pendingSettlementColumnData = [
			{
				title: '需求项目',
				dataIndex: 'productName',
				key: 'productName',
			}, {
				title: '结算方',
				dataIndex: 'publisher',
				key: 'publisher',
			}, {
				title: '备注',
				dataIndex: 'remark',
				key: 'remark',
			},{
				title: '金额',
				dataIndex: 'amount',
				key: 'amount',
			}, {
				title: '状态',
				dataIndex: 'state',
				key: 'state',
			},{
				title: '操作',
				dataIndex: 'action',
				key: 'action',
			}];

		return (<div className="qry-apply-admin" >
			<Modal
				title={
					<div>
						<Row span={24} >
							<Col span={2}>
								待结算
							</Col>
							<Col span={20} style={{ textAlign: 'center' }} >
								{this.state.porjectName}
							</Col>
						</Row>
					</div>
				}
				visible={this.state.visible}
				onOk={this.handleOk}
				onCancel={this.handleCancel}
				okText="查看项目详情"
				cancelText="取消"
				width={720}
			>
				<div className="incomeDetail">{this.renderModal(settlementdState)}</div>
			</Modal>
			<Row>
				<Col span={24} >
					<h3 style={{ fontSize: '36px', marginBottom: '20px' }} >待结算 / For the</h3>
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

						<Tabs defaultActiveKey={showDataType} >

							<TabPane tab="全部" key="1" >
								<Table
									dataSource={settlementListShowList}
									columns={pendingSettlementColumnData}
									pagination={false}
								/>
								<div className="pg-ctr" >
									<Pagination
										defaultCurrent={settlementListCurrentPage}
										current={settlementListCurrentPage}
										total={settlementListTotalCount}
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
	const { SettlementData,  } = state.get('qryPendingsettlementadminReducer').toObject();
	return {
		rspInfo,
		actionType,
		SettlementData,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qrypendingsettlement,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Pendingsettlementadmin);
