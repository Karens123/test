'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Col, Form, Input, Modal, Pagination, Row, Select, Table, Tabs,Icon,Button } from 'antd';
import { parseDate, parseDateTime } from 'utils/DateUtil';
import { disbursementAudit, disbursementPaid, qryIncomeDisbursementDetails, qryPayAdmin } from 'action';
import * as DateUtil from 'src/utils/DateUtil';
import * as businessRoute from 'business/route';

import payColumnData from './payColumnData';
import './index.less';

const Option = Select.Option;
const { TextArea } = Input;

class Payincomelist extends React.Component {

	//检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
		allPayListData: PropTypes.object,
		incomeDisbursementDetails: PropTypes.object,
		params: PropTypes.object,
	};

	static defaultProps = {
		allPayListData: {},
		params: {},
		form: {},
		incomeDisbursementDetails: {}
	};

	constructor (props) {
		super(props);
		this.state = {
			showModal: false,
			showDataType: '1',
			pageSize: 10,
			record: {},
			PayincomelistData: [],
			PendingPaymentShowList: [],

			PayincomeCurrentPage: 1,
			PendingPaymentCurrentPage: 1,
			PayincomelistTotalCount: 10,

			allPaydState: '',
			incomeDisbursementDetailsStateData: '',
			selectChannel: 0,
			channelTradeNo: 0,
			okType: 'danger',
			textAreaStyle: ''
		};
	}

	componentWillMount () {
		const { PayincomelistData } = this.state;
		const { params, actions } = this.props;
		const { page, dataType } = params;
		if (page !== undefined && dataType !== undefined) {
			switch (dataType) {
				case '1': {
					this.setState({
						showDataType: dataType,
						PayincomeCurrentPage: parseInt(page),
						PendingPaymentCurrentPage: 1,
						finishCurrentPage: 1,
					}, () => {
						console.log('come back to allPayList-list');
						this.qryTable();
					});
					break;
				}
				default:
					break;
			}
		} else {
			//首次加载读取默认数据加载
			if (!PayincomelistData.length) {
				this.qryTable();
			}
		}
	}

	componentWillReceiveProps (nextProps) {
		const { showDataType, } = this.state;
		const { allPayListData, incomeDisbursementDetails } = nextProps;
		const { params, actions } = nextProps;
		const { page, dataType } = params;

		if (incomeDisbursementDetails) {
			this.setState({
				incomeDisbursementDetailsStateData: incomeDisbursementDetails,
			});
		}
		const showListData = [];
		switch (showDataType) {
			case '1': {
				if (allPayListData && allPayListData.records) {
					const ret = allPayListData.records;
					for (let i = 0, len = ret.length; i < len; i++) {
						const data = ret[i];
						showListData.push({
							publisher: data.publisher,
							payoff: data.payoff,
							time: data.time,
							remark: data.remark,
							reward: data && data.totalAmount ? (data.totalAmount / 100).toFixed(2) : '',
							actionren: data.actionren,
							action: (<Link
								onClick={() => {
									const { actions } = this.props;
									const qryForm = {
										detailsId: data.detailsId,
									};
									actions.qryIncomeDisbursementDetails(qryForm);
									this.showModal();
								}}
							>查看</Link>),
						});
					}
					this.setState({
						PayincomelistTotalCount: allPayListData.totalCount,
					});
				}
				this.setState({
					PayincomelistData: showListData
				}, () => {
				});
				break;
			}
		}
	};

	//tab切换
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
		const { pageSize, PayincomeCurrentPage,  record } = this.state;
		if (JSON.stringify(record) == '{}') {
			const record = {};
			actions.qryPayAdmin(PayincomeCurrentPage, pageSize, record);
		} else {
			actions.qryPayAdmin(PayincomeCurrentPage, pageSize, record);
		}
	};


	//分页控制
	paginationController = (num) => {
		const { showDataType } = this.state;
		switch (showDataType) {
			case '1': {
				this.setState({
					PayincomeCurrentPage: num
				}, () => {
					this.qryTable();
				});
				break;
			}

			default:
				break;
		}
	};

	showModal = () => {
		this.setState({
			visible: true,
		});
	};

	handleOk = (e) => {
		const { incomeDisbursementDetailsStateData } = this.state;
		const { actions } = this.props;
		const detailsId = incomeDisbursementDetailsStateData.record.detailsId;
		const channelTradeNo = incomeDisbursementDetailsStateData.record.channelTradeNo;

		//己完成,待审核
		if ((incomeDisbursementDetailsStateData.record.state) * 1 !== 4) {
			this.setState({
				visible: false,
			}, () => {
				const { incomeDisbursementDetailsStateData } = this.state;
				const { actions } = this.props;
				switch ((incomeDisbursementDetailsStateData.record.state) * 1) {
					case 2: {
						//审核
						actions.disbursementAudit(detailsId);
					}
				}
			});
		} else {
			//待付款必须填写打款编号
			const { okType } = this.state;
			if (okType == 'danger') {
				this.setState({
					textAreaStyle: 'TextareaStyle'
				});
				return false;

			} else {
				this.setState({
					visible: false,
				}, () => {
					actions.disbursementPaid(detailsId, channelTradeNo);
				});
			}
		}

	};

	handleCancel = (e) => {
		this.setState({
			visible: false,
		});
	};

	handleChange = (selectChannel) => {
		// console.log(`selected ${value}`);
		this.setState({
			selectChannel
		});
	};
	hanldValue = (val) => {
		console.log(`selected ${val}.`);
		console.log('selected_____', val.target.value);
		const Val = val.target.value;
		const okType = 'danger';
		if (Val.length > 0) {
			this.setState({
				okType: 'primary',
				textAreaStyle: ''
			});
		} else {
			this.setState({
				okType
			});
		}
	};
	renderModal = (ret = []) => {
		const { incomeDisbursementDetailsStateData } = this.state;
		const styleObje = (
			{
				title: {
					lineHeight: '35px',
					marginBottom: '10px',
					paddingBottom: '10px',
					borderBottom: 'solid 1px #ddd'
				}
			}
		);
		const lineHeight34 = (
			{
				lineHeight: '34px'
			}
		);



		ret = { ...incomeDisbursementDetailsStateData.record };
		if (ret) {
			//收支明细
			const html = (<div style={{ lineHeight: '30px' }} >
				<Row span={24} style={styleObje.title} >
					<Col span={20} style={lineHeight34} >
						基本信息：<span className="blue" >
							{
								ret && ret.state ? ret.state == 1 ? '收款中' : ret.state == 5 ? '已完成' : ret.state == 6 ? '失败' : ret.state == 4 ? '付款中' : ret.state == 2 ? '审核中' : ' ' : ' '
							}
						</span>

					</Col>
				</Row>
				<Row span={24} >
					<Col span={8} style={lineHeight34} >
						申请人：{ret && ret.requestorName ? ret.requestorName : ''}
					</Col>
					<Col span={8} style={lineHeight34} >
						联系人：{ret && ret.requestorPhone ? ret.requestorPhone : ''}
					</Col>
					<Col span={8} style={lineHeight34} >
						收款方式：{ret.channel == 0 ? '支付宝' : '微信' }
					</Col>
				</Row>
				<Row span={24} >
					<Col span={8} style={lineHeight34} >
						类型：{ret && ret.detailsType ? ret.detailsType == 0 ? '收入' : ret.detailsType == 1 ? '支出' : '' : ' '}
					</Col>

					<Col span={8} style={lineHeight34} >
						支付宝账号：{ret && ret.channelAccount ? ret.channelAccount : ''}
					</Col>
					<Col span={8} style={lineHeight34} >
						时间：{ret && ret.createTime ? DateUtil.parseDateTime(ret.createTime) : ''}
					</Col>
				</Row>
				<Row span={24} >
					<Col span={8} style={lineHeight34} >
						申请金额：{ret && ret.totalAmount == 0 ? 0 : ret.totalAmount == null ? '' :
						<span className="red" >{(ret.totalAmount / 100).toFixed(2)}</span> }
					</Col>
				</Row>
			</div>);


			switch ((ret.state) * 1) {
				case 2: {
					//审核中
					return (html);
				}
				case 4: {
					//付款中
					return (<Form>
						<div>
							<br />
							{html}
							<hr className="border" />
							<br />
							<div style={{ lineHeight: '30px' }} >
								<Row span={24} style={lineHeight34} >
									<Col span={3} >打款方式：</Col>
									<Col span={21} >
										<Select
											style={{ width: 120 }}
											onChange={this.handleChange}
											defaultValue="支付宝"
										>
											<Option value="0" >支付宝</Option>
										</Select>
									</Col>
								</Row>
								<Row span={24} style={lineHeight34} >
									打款编号：
									<span>
										<TextArea
											placeholder="打款编号"
											autosize={{ minRows: 2, maxRows: 6 }}
											onChange={this.hanldValue}
											className={this.state.textAreaStyle}
										/>
									</span>
								</Row>
							</div>
						</div>
					</Form>);
				}
				case 5: {
					//已完成
					return (<div>
						{html}
						<hr className="vline" />
						<div style={{ lineHeight: '30px' }} >
							<Row span={24} style={lineHeight34} >
								打款方式：
								<span className="blue" >
									{ret && ret.channel == 0 ? '支付宝' : '未知'}
								</span>
							</Row>
							<Row span={24} style={lineHeight34} >
								打款编号：
								<span className="blue" >
									{ret && ret.channelTradeNo}
								</span>
							</Row>
						</div>
					</div>);
				}
			}
		}
	};

	render () {
		const Search = Input.Search;
		const {
			incomeDisbursementDetailsStateData,
			allPaydState,
			PayincomelistData,
			PayincomelistTotalCount,
			showDataType,
			PayincomeCurrentPage,
		} = this.state;

		let ret = {};
		if (incomeDisbursementDetailsStateData) {
			ret = { ...incomeDisbursementDetailsStateData.record };
		}
		//1-收款中,5-已完成,6-失败
		const TabPane = Tabs.TabPane;
		const Option = Select.Option;
		return (<div className="qry-apply-admin" >
			<Modal
				title={
					<div>
						<Row span={24} >
							<Col span={2} >
								{
									ret && ret.state ? ret.state == 1 || ret.state == 3 ? '未知' : ret.state == 5 ? '已完成' : ret.state == 6 ? '失败' : ret.state == 4 ? '付款中' : ret.state == 2 ? '审核中' : '' : ''
								}
							</Col>
							<Col span={20} style={{ textAlign: 'center' }} >
								{ ret && ret.requestorName ? ret.requestorName : ' ' }
							</Col>
						</Row>
					</div>
				}
				visible={this.state.visible}
				onOk={this.handleOk}
				onCancel={this.handleCancel}
				okType={((() => {
					let str = 'primary';
					if (ret && ret.state == 4) {
						str = this.state.okType;
					}
					return str;
				})())}
				okText={((() => {
					let str = '';
					if (ret && ret.state) {
						const num = (ret.state) * 1;
						if (num == 1) {
							str = '未知';
						} else if (num == 5) {
							str = '确定';
						} else if (num == 2) {
							str = '通过审核';
						} else if (num == 4) {
							str = '确认己打款';
						}
					}
					return str;
				})())}
				cancelText="取消"
				width={720}
			>
				<div className="incomeDetail" >{this.renderModal(allPaydState)}</div>
			</Modal>

			<Row>
				<Col span={24} >
					<Button>
						<Link  to={businessRoute.payincomedetailadmin}>
							<Icon type="backward" />
							<span>&nbsp;&nbsp;返回收支明细</span>
						</Link>
					</Button>
				</Col>
			</Row>
			<Row>
				<Col span={24} >
					&nbsp;
				</Col>
			</Row>
			<Row>
				<Col span={24} >
					<h5 style={{ fontSize: '25px', marginBottom: '20px' }} >2017 10.20  收支明细</h5>
				</Col>
				<Col span={24} >
					<div className="admin-main" >
						<div className="div_relative">
							<a href=" " className="btnLoction">导出SVG</a>
							<div className="admin-ctr" >
								<Search
									placeholder="功能开发中。。。"
									style={{ width: 150 }}
									onSearch={this.searchHandler}
								/>
							</div>
						</div>
						<Tabs defaultActiveKey={showDataType} onChange={this.showDataTypeHandler} >
							<TabPane tab={`编号${12345}`} key="1" >
								<Table
									dataSource={PayincomelistData}
									columns={payColumnData.PayincomelistColumns}
									pagination={false}
								/>
								<div className="pg-ctr" >
									<Pagination
										defaultCurrent={PayincomeCurrentPage}
										current={PayincomeCurrentPage}
										total={PayincomelistTotalCount}
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
	const { allPayListData, incomeDisbursementDetails, disbursement } = state.get('PayicomedetailReducer').toObject();
	return {
		rspInfo,
		actionType,
		allPayListData,
		incomeDisbursementDetails,
		disbursement
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryPayAdmin,
			qryIncomeDisbursementDetails,
			disbursementAudit,
			disbursementPaid
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Payincomelist);
