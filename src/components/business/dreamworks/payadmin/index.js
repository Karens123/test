'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Col, Row, Table, Tabs, Select, Pagination,Modal,Input,Form  } from 'antd';
import { parseDate,parseDateTime } from 'utils/DateUtil';
import { qryPayAdmin,
	qryIncomeDisbursementDetails,
	disbursementAudit,
	disbursementPaid,
	DIS_BURSEMENT_AUDIT,
	DIS_BURSEMENT_PAID
} from 'action';
import * as MsgUtil from 'utils/MsgUtil';
import * as DateUtil from 'src/utils/DateUtil';
import * as WidgetUtil from 'utils/WidgetUtil';
import payColumnData from './payColumnData';
import './index.less';

const Option = Select.Option;
const { TextArea } = Input;

class PayAdmin extends React.Component {
	//检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
		bsnData: PropTypes.object,
		allPayListData: PropTypes.object,
		incomeDisbursementDetails: PropTypes.object,
		params: PropTypes.object,
		actionType: PropTypes.string.isRequired,
	};

	static defaultProps = {
		bsnData: {},
		allPayListData: {},
		params: {},
		form: {},
		incomeDisbursementDetails: {}
	};

	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			showDataType: '1',
			pageSize: 10,
			record: {},
			allPayListShowList: [],
			PendingAuditShowList: [],
			PendingPaymentShowList: [],
			finishListShowList: [],

			allPayListCurrentPage: 1,
			PendingAuditCurrentPage: 1,
			PendingPaymentCurrentPage: 1,
			finishCurrentPage: 1,

			allPayListTotalCount: 10,
			finishPayListTotalCount: 10,
			PendingPaymentTotalCount: 10,
			PendingAuditTotalCount: 10,

			filtering: false,
			porjectName: '',
			allPaydState: '',
			incomeDisbursementDetailsStateData: '',
			ModalBarTitle: '',
			selectChannel: 0,
			channelTradeNo: 0,
			okType: 'danger',
			textAreaStyle: '',
			isShouldUpdate: false
		};
	}

	componentWillMount() {
		const { allPayListShowList } = this.state;
		const { params, actions } = this.props;
		const { page, dataType } = params;
		if (page !== undefined && dataType !== undefined) {
			switch (dataType) {
				case '1': {
					this.setState({
						showDataType: dataType,
						allPayListCurrentPage: parseInt(page),
						PendingAuditCurrentPage: 1,
						PendingPaymentCurrentPage: 1,
						finishCurrentPage: 1,
					}, () => {
						console.log('come back to allPayList-list');
						this.qryTable();
					});
					break;
				}
				case '2': {
					this.setState({
						showDataType: dataType,
						PendingAuditCurrentPage: parseInt(page),
						allPayListCurrentPage: 1,
						PendingPaymentCurrentPage: 1,
						finishCurrentPage: 1,
					}, () => {
						console.log('come back to bsn-list');
						this.qryTable();
					});
					break;
				}

				case '3': {
					this.setState({
						showDataType: dataType,
						PendingPaymentCurrentPage: parseInt(page),
						allPayListCurrentPage: 1,
						PendingAuditCurrentPage: 1,
						finishCurrentPage: 1,
					}, () => {
						console.log('come back to bsn-list');
						this.qryTable();
					});
					break;
				}
				case '4': {
					this.setState({
						showDataType: dataType,
						finishCurrentPage: parseInt(page),
						allPayListCurrentPage: 1,
						PendingAuditCurrentPage: 1,
						PendingPaymentCurrentPage: 1,
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
			if (!allPayListShowList.length) {
				this.qryTable();
			}
		}
	}


	componentWillReceiveProps(nextProps) {
		const { allPayListData,incomeDisbursementDetails,actionType } = nextProps;
		if (`${DIS_BURSEMENT_AUDIT}_SUCCESS` === actionType) {
			MsgUtil.showinfo('通过审核');
		} else if (`${DIS_BURSEMENT_PAID}_SUCCESS` === actionType) {
			MsgUtil.showinfo('打款成功');
			this.setState({
				isShouldUpdate: true
			});
		}
		const { showDataType, allPayListCurrentPage,finishCurrentPage, PendingAuditCurrentPage } = this.state;
		const { bsnData } = nextProps;
		if (incomeDisbursementDetails) {
			this.setState({
				incomeDisbursementDetailsStateData: incomeDisbursementDetails,
			});
		}
		const showListData = [];
		switch (showDataType) {
			case '1': {
				//列表模型
				if (allPayListData && allPayListData.records) {
					const ret = allPayListData.records;
					for (let i = 0, len = ret.length; i < len; i++) {
						const data = ret[i];
						showListData.push({
							time: DateUtil.parseDateTime(data.createTime),
							name: data.requestorName,
							appMoney: data && data.totalAmount ? <span className="red">{(data.totalAmount/100).toFixed(2)}</span>:'',
							payoffId: data.payoffId,
							channel: data.channel,
							realName: data.realName,
							projectName: data.projectName,
							reward: data && data.totalAmount ?(data.totalAmount/100).toFixed(2):'' ,
							remark: data.remark,
							detailsId: data.detailsId,
							entityType: data.entityType,
							requestorId: data.requestorId,
							appTime: parseDate(data.createTime),
							status: data.state === 4 ? (<span className="blue" >付款中</span>) : data.state === 5 ? (<span className="red" >已完成</span>) : data.state === 2 ? (<span className="red" >待审核</span>): '' ,
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
						allPayListTotalCount: allPayListData.totalCount,
					});
				}
				this.setState({
					allPayListShowList: showListData
				}, () => {
				});
				break;
			}
			case '2': {
				if (allPayListData && allPayListData.records) {
					const ret = allPayListData.records;
					for (let i = 0, len = ret.length; i < len; i++) {
						const data = ret[i];
						showListData.push({
							time: DateUtil.parseDateTime(data.createTime),
							name: data.requestorName,
							appMoney: data && data.totalAmount ? <span className="red">{(data.totalAmount/100).toFixed(2)}</span>:'',
							payoffId: data.payoffId,
							channel: data.channel,
							realName: data.realName,
							projectName: data.projectName,
							reward: data &&data.totalAmount ? <span className="red">(data.totalAmount/100).toFixed(2)</span>:'' ,
							remark: data.remark,
							detailsId: data.detailsId,
							entityType: data.entityType,
							requestorId: data.requestorId,
							appTime: parseDate(data.createTime),
							status: data.state === 4 ? (<span className="blue" >付款中</span>) : data.state === 5 ? (<span className="red" >已完成</span>) : data.state === 2 ? (<span className="red" >待审核</span>): '' ,
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
						PendingAuditTotalCount: allPayListData.totalCount,
					});
				}
				this.setState({
					PendingAuditShowList: showListData
				}, () => {
				});
				break;
			}
			case '3': {
				console.log('cao____________123654__________', allPayListData);
				if (allPayListData && allPayListData.records) {
					const ret = allPayListData.records;
					for (let i = 0, len = ret.length; i < len; i++) {

						const data = ret[i];
						showListData.push({
							time: DateUtil.parseDateTime(data.createTime),
							name: data.requestorName,
							appMoney: data && data.totalAmount ? <span className="red">{(data.totalAmount/100).toFixed(2)}</span>:'',
							payoffId: data.payoffId,
							channel: data.channel,
							realName: data.realName,
							projectName: data.projectName,
							reward: data &&data.totalAmount ?<span className="red">(data.totalAmount/100).toFixed(2)</span>:'' ,
							remark: data.remark,
							detailsId: data.detailsId,
							entityType: data.entityType,
							requestorId: data.requestorId,
							appTime: parseDate(data.createTime),
							status: data.state === 4 ? (<span className="blue" >付款中</span>) : data.state === 5 ? (<span className="red" >已完成</span>) : data.state === 2 ? (<span className="red" >待审核</span>): '' ,
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
						PendingPaymentTotalCount: allPayListData.totalCount,
					});
				}

				this.setState({
					PendingPaymentShowList: showListData
				}, () => {
				});
				break;
			}
			case '4': {
				if (allPayListData && allPayListData.records) {
					const ret = allPayListData.records;
					for (let i = 0, len = ret.length; i < len; i++) {

						const data = ret[i];
						showListData.push({
							time: DateUtil.parseDateTime(data.createTime),
							name: data.requestorName,
							appMoney: data && data.totalAmount ? <span className="red">{(data.totalAmount/100).toFixed(2)}</span>:'',
							payoffId: data.payoffId,
							channel: data.channel,
							realName: data.realName,
							projectName: data.projectName,
							reward: data &&data.totalAmount ?<span className="red">(data.totalAmount/100).toFixed(2)</span>:'' ,
							remark: data.remark,
							detailsId: data.detailsId,
							entityType: data.entityType,
							requestorId: data.requestorId,
							appTime: parseDate(data.createTime),
							status: data.state === 4 ? (<span className="blue" >付款中</span>) : data.state === 5 ? (<span className="red" >已完成</span>) : data.state === 2 ? (<span className="red" >待审核</span>): '' ,
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
						finishPayListTotalCount: allPayListData.totalCount,
					});
				}

				this.setState({
					finishListShowList: showListData
				}, () => {
				});
				break;
			}
		}
	};


	getOperator = (list=[],filter) => {
		const ret=WidgetUtil.filter2(list,'handleType','handlerName',filter);
		return ret;
	}

	//tab切换
	showDataTypeHandler = (key) => {
		const { showDataType } = this.state;

		this.setState({
			showDataType: key,
			allPayListCurrentPage: 1,
			PendingAuditCurrentPage: 1,
			PendingPaymentCurrentPage: 1,
			finishCurrentPage: 1,
		}, () => {
			this.qryTable();
		});



	};

	//控制查询
	qryTable = () => {
		const { actions } = this.props;
		const { pageSize,showDataType, allPayListCurrentPage,finishCurrentPage, PendingAuditCurrentPage,PendingPaymentCurrentPage, record } = this.state;


		switch (showDataType) {
			case '1': {
				if (JSON.stringify(record) == '{}') {
					const record={ };
					actions.qryPayAdmin(allPayListCurrentPage, pageSize, record);
				} else {
					actions.qryPayAdmin(allPayListCurrentPage, pageSize, record);
				}
				break;
			}
			case '2': {
				const record={ state: 2 };
				actions.qryPayAdmin(PendingAuditCurrentPage,pageSize, record);
				break;
			}
			case '3': {
				const record={ state: 4 };
				actions.qryPayAdmin(PendingPaymentCurrentPage,pageSize, record);
				break;
			}
			case '4': {
				const record={ state: 5 };
				actions.qryPayAdmin(finishCurrentPage,pageSize, record);
				break;
			}
			default:
				break;
		}
	};

	//下拉select 状态筛选
	statusSelector = (v) => {
		const { record, showDataType } = this.state;
		record.state = v;
		switch (showDataType) {
			case '1': {
				this.setState({
					allPayListCurrentPage: 1,
				});
				break;
			}
			case '2': {
				this.setState({
					PendingAuditCurrentPage: 1,
				});
				break;
			}
			case '3': {
				this.setState({
					PendingPaymentCurrentPage: 1,
				});
				break;
			}
			case '4': {
				this.setState({
					finishCurrentPage: 1,
				});
				break;
			}
		}
		this.setState({
			record
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
					allPayListCurrentPage: num
				}, () => {
					this.qryTable();
				});
				break;
			}
			case '2': {
				this.setState({
					PendingAuditCurrentPage: num
				}, () => {
					this.qryTable();
				});
				break;
			}
			case '3': {
				this.setState({
					PendingPaymentCurrentPage: num
				}, () => {
					this.qryTable();
				});
				break;
			}

			case '4': {
				this.setState({
					finishCurrentPage: num
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
		const { incomeDisbursementDetailsStateData,channelTradeNo } = this.state;
		const { actions } = this.props;
		const detailsId=incomeDisbursementDetailsStateData.record.detailsId;

		//己完成,待审核
		if ((incomeDisbursementDetailsStateData.record.state)*1 !==4) {
			this.setState({
				visible: false,
			},() => {
				const { incomeDisbursementDetailsStateData } = this.state;
				const { actions } = this.props;
				switch ((incomeDisbursementDetailsStateData.record.state)*1) {
					case 2: {
						//审核
						actions.disbursementAudit(detailsId,channelTradeNo);
					}
				}
			});
		} else {
			//待付款必须填写打款编号
			const { okType } = this.state;
			if (okType=='danger') {
				this.setState({
					textAreaStyle: 'TextareaStyle'
				});
				return false;

			} else {
				this.setState({
					visible: false,
				}, () => {
					actions.disbursementPaid(detailsId,channelTradeNo);
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
		console.log('selected_____', val.target.value);
		const Val=val.target.value;
		const okType='danger';
		if (Val.length>0) {
			this.setState({
				okType: 'primary',
				textAreaStyle: '',
				channelTradeNo: val.target.value

			});
		} else {
			this.setState({
				okType,
				channelTradeNo: ''
			});
		}
	};

	renderModal = (ret=[]) => {
		const { incomeDisbursementDetailsStateData } = this.state;
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
		ret={ ...incomeDisbursementDetailsStateData.record };

		const test={
			state: 5
		};

		if (ret) {
			//明细状态1-收款中,2-审核中,4-付款中,5-已完成,6-失败
			const html=(<div style={{ lineHeight: '30px' }}>
				<Row span={24} style={styleObje.title} >
					<Col span={20} style={lineHeight34}>
						基本信息：<span className="blue">
							{
								ret && ret.state ? ret.state==1 ? '收款中' : ret.state==5 ? '已完成' : ret.state==6 ? '失败' :  ret.state==4 ? '待付款' :  ret.state==2 ? '待处理' :' ' :' '
							}
						</span>

					</Col>
				</Row>
				<Row span={24} >
					<Col span={8} style={lineHeight34}>
						申请人：{ret && ret.requestorName ? ret.requestorName : ''}
					</Col>
					<Col span={8} style={lineHeight34}>
						联系方式：{ret && ret.requestorPhone ? ret.requestorPhone : ''}
					</Col>
					<Col span={8} style={lineHeight34}>
						收款方式：{ret.channel==0? '支付宝' : '微信' }
					</Col>
				</Row>
				<Row span={24} >
					<Col span={8} style={lineHeight34}>
						类型：{ret && ret.detailsType ? ret.detailsType==0? '收入' : ret.detailsType==1 ? '钱包提现':'' :' '}
					</Col>

					<Col span={8} style={lineHeight34}>
						支付宝账号：{ret && ret.channelAccount ? ret.channelAccount : ''}
					</Col>
					<Col span={8} style={lineHeight34}>
						时间：{ret && ret.createTime ? DateUtil.parseDateTime(ret.createTime) : ''}
					</Col>
				</Row>
				<Row span={24} >
					<Col span={8} style={lineHeight34}>
						申请金额：{ret && ret.totalAmount==0 ? 0 : ret.totalAmount ==null ? '' : <span className="red">{(ret.totalAmount/100).toFixed(2)}元</span> }
					</Col>
				</Row>
			</div>);
			switch ((ret.state)*1) {
				case 2: {
					//审核中
					return (html);
				}
				case 4: {
					//付款中
					const cssObj=({
						activeObject: {
							position: 'relative',
							shy: {
								position: 'absolute',
								top: -140,
								right: '10px',
								zIndex: 1,
							}
						}
					});
					return (<Form>
						<div>
							<br />
							{html}
							<div style={cssObj.activeObject}>
								<div style={cssObj.activeObject.shy}>审核人:{this.getOperator(ret.disbursementOptDetails,0)} </div>
							</div>
							<hr className="border" />
							<br />
							<div style={{ lineHeight: '30px' }}>
								<Row span={24} style={lineHeight34}>
									<Col span={3}>打款方式：</Col>
									<Col span={21}>
										<Select
											style={{ width: 120 }}
											onChange={this.handleChange}
											defaultValue="支付宝"
										>
											<Option value="0">支付宝</Option>
										</Select>
									</Col>
								</Row>
								<Row span={24} style={lineHeight34}>
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
					const cssObj=({
						activeObject: {
							position: 'relative',
							shy: {
								position: 'absolute',
								top: -140,
								right: '10px',
								zIndex: 1,
							},
							dky: {
								position: 'absolute',
								bottom: 0,
								right: '10px',
								zIndex: 1,
							}
						}
					});

					//已完成
					//handleType操作类型0-审核,1-打款,2-疑问追踪
					return (<div>
						{html}
						<div style={cssObj.activeObject}>
							<div style={cssObj.activeObject.shy}>审核人:{this.getOperator(ret.disbursementOptDetails,0)} </div>
							<div style={cssObj.activeObject.dky}>打款人:{this.getOperator(ret.disbursementOptDetails,1)}</div>
						</div>
						<hr className="vline" />
						<div style={{ lineHeight: '30px' }}>
							<Row span={24} style={lineHeight34}>
								打款方式：
								<span className="blue">
									{ret && ret.channel==0 ? '支付宝':'未知'}
								</span>
							</Row>
							<Row span={24} style={lineHeight34}>
								打款编号：
								<span className="blue">
									{ret && ret.channelTradeNo}
								</span>
							</Row>
						</div>
					</div>);
				}
			}
		}
	};
	render() {
		const {
			incomeDisbursementDetailsStateData,
			allPaydState,
			finishListShowList,
			allPayListShowList,
			PendingAuditShowList,
			PendingPaymentShowList,
			allPayListTotalCount,
			finishPayListTotalCount,
			PendingAuditTotalCount,
			showDataType,finishCurrentPage,
			allPayListCurrentPage,
			PendingAuditCurrentPage
		} = this.state;

		let ret ={};
		if (incomeDisbursementDetailsStateData) {
			ret={ ...incomeDisbursementDetailsStateData.record };
		}
		//1-收款中,5-已完成,6-失败
		const TabPane = Tabs.TabPane;
		const Option = Select.Option;
		return (<div className="qry-apply-admin" >
			<Modal
				title={
					<div>
						<Row span={24} >
							<Col span={2}>
								{
									ret && ret.state ? ret.state == 1 || ret.state == 3  ? '未知' : ret.state == 5 ? '已完成' : ret.state == 6 ? '失败' : ret.state ==4? '待付款' : ret.state ==2 ? '待审核': '' : ''
								}
							</Col>
							<Col span={20} style={{ textAlign: 'center' }} >
								{ ret && ret.requestorName ? ret.requestorName :' ' }
							</Col>
						</Row>
					</div>
				}
				visible={this.state.visible}
				onOk={this.handleOk}
				onCancel={this.handleCancel}
				okType={((() => {
					let str='primary';
					if (ret && ret.state==4) {
						str=this.state.okType;
					}
					return str;
				})())}
				okText={(( () => {
					let str='';
					if (ret && ret.state ) {
						const num=(ret.state)*1;
						if (num == 1) {
							str='未知';
						} else if (num == 5) {
							str='确定';
						}  else if (num == 2) {
							str='通过审核';
						} else if (num == 4) {
							str='确认己打款';
						}
					}
					return str;
				})())}
				cancelText="取消"
				width={960}
			>
				<div className="incomeDetail">{this.renderModal(allPaydState)}</div>
			</Modal>
			<Row>
				<Col span={24} >
					<h3 style={{ fontSize: '36px', marginBottom: '20px' }} >支付 / Expense</h3>
				</Col>
				<Col span={24} >
					<div className="admin-main" >
						{
							showDataType==1 ?<div className="admin-ctr" >
								<Select
									defaultValue=""
									style={{ width: 120 }}
									onChange={this.statusSelector}
								>
									<Option value="" >全部</Option>
									<Option value="2" >待审核</Option>
									<Option value="4" >待付款</Option>
									<Option value="5" >已完成</Option>
								</Select>
							</div> :''

						}
						<Tabs defaultActiveKey={showDataType} onChange={this.showDataTypeHandler} >

							<TabPane tab="全部" key="1" >
								<Table
									dataSource={allPayListShowList}
									columns={payColumnData.allPayListColumns}
									pagination={false}
								/>
								<div className="pg-ctr" >
									<Pagination
										defaultCurrent={allPayListCurrentPage}
										current={allPayListCurrentPage}
										total={allPayListTotalCount}
										onChange={this.paginationController}
									/>
								</div>
							</TabPane>

							<TabPane tab="待审核" key="2" >
								<Table
									dataSource={PendingAuditShowList}
									columns={payColumnData.pendingListColumns}
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
							<TabPane tab="待付款" key="3" >
								<Table
									dataSource={PendingPaymentShowList}
									columns={payColumnData.pendingListColumns}
									pagination={false}
								/>
								<div className="pg-ctr" >
									<Pagination
										defaultCurrent={PendingAuditCurrentPage}
										current={PendingAuditCurrentPage}
										total={this.state.PendingPaymentTotalCount}
										onChange={this.paginationController}
									/>
								</div>
							</TabPane>


							<TabPane tab="己完成" key="4" >
								<Table
									dataSource={finishListShowList}
									columns={payColumnData.finishListColumns}
									pagination={false}
								/>
								<div className="pg-ctr" >
									<Pagination
										defaultCurrent={finishCurrentPage}
										current={finishCurrentPage}
										total={this.state.finishPayListTotalCount}
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
	const { allPayListData, bsnData,incomeDisbursementDetails,disbursement } = state.get('qryPayReducer').toObject();
	return {
		rspInfo,
		actionType,
		allPayListData,
		bsnData,
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

export default connect(mapStateToProps, mapDispatchToProps)(PayAdmin);
