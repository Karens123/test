'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Col, Row, Table, Tabs, Select, Pagination,Modal,Input,Form,Icon,Menu,Button  } from 'antd';
import { parseDate,parseDateTime } from 'utils/DateUtil';
import * as MsgUtil from 'utils/MsgUtil';
import * as Immutable from 'immutable';
import {
	qryGoodsPages,
	disbursementAudit,
	disbursementPaid,
	dealShareJewelGoods,
	DEAL_SHARE_JEWEL_GOODS
} from 'action';
import { Link } from 'react-router';
import * as MappingUtil from 'utils/MappingUtil';
import businessRoute from 'business/route';
import dataConfig from '../dataConfig';
import './index.less';


class DonationUseAdmin extends React.Component {
	//检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
		params: PropTypes.object,
		// allOrderListData: PropTypes.array,
		actionType: PropTypes.string.isRequired,
		rspInfo: PropTypes.object.isRequired,
	};

	static defaultProps = {
		params: {},
		form: {},
		// allOrderListData: []
	};

	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			showDataType: 1,
			pageSize: 10,
			record: {
				productType: ''
			},

			allOrderShowList: [],//全部
			allOrderCurrentPage: 1,
			allOrderListTotalCount: 10,
			goodsId: undefined,
			teststateSave: '',
			OrderStatusUpdate: {
				stateSave: '保存',
				stateSaveIng: '已上架',
				stateSaleDown: '已下架'
			},
			sequence: ''
		};
	}

	componentWillMount() {
		const { allOrderShowList } = this.state;
		const { params } = this.props;
		const { page,fileType,dataType } = params;
		if (page !== undefined || fileType !== undefined || dataType !== undefined) {
			switch (dataType) {
				case 1 : {
					this.setState({
						showDataType: dataType,
						allOrderCurrentPage: parseInt(page),
						hasOrderCurrentPage: 1,
						hasPayoffOrderCurrentPage: 1,
						haslogisticsOrderCurrentPage: 1,
						hasfinishedOrderCurrentPage: 1,

					}, () => {
						this.qryTable();
					});
					break;
				}

				default:
					break;
			}


			this.setState({
				allOrderCurrentPage: parseInt(page),
				record: {
					productType: fileType
				}
			}, () => {
				this.qryTable();
			});
		} else {
			//首次加载读取默认数据加载
			if (!allOrderShowList.length) {
				this.qryTable();
			}
		}
	}

	componentWillReceiveProps(nextProps,nextState) {
		let currentDataType=this.state.record.productType;
		if (currentDataType=='') {
			currentDataType=0;
		}
		const { showDataType, record, allOrderCurrentPage, hasOrderCurrentPage, hasPayoffOrderCurrentPage, haslogisticsOrderCurrentPage } = this.state;
		// const { allOrderListData } = nextProps;

		const allOrderListData=dataConfig.allOrderListData;
		const { productType } = record;
		const showListData = [];
		//列表模型-射数据入数组
		if (allOrderListData && allOrderListData.records) {
			const  ret=allOrderListData.records;
			switch (showDataType) {
				case 1 : {
					if (allOrderListData && allOrderListData.records) {
						for (let i = 0, len = ret.length; i < len; i++) {
							const data = ret[i];
							showListData.push({
								goodsId: data.goodsId,
								productType: MappingUtil.worksTypeNumToText(data.productType),
								goodsName: data.goodsName,
								status: data.status ,
								payType: data.payType,
								action: <Link to={`${businessRoute.purchaseOrderDetail}/${data.goodsId}/${allOrderCurrentPage}/${productType}/${showDataType}`} >查看</Link>,
							});
						}

						this.setState({
							allOrderListTotalCount: allOrderListData && allOrderListData.totalCount,
						}, () => {
						});
					}

					this.setState({
						allOrderShowList: showListData
					}, () => {
					});
					break;

				}
			}

		}
		const { rspInfo, actionType } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				let isRefresh = false;
				if (`${DEAL_SHARE_JEWEL_GOODS}_SUCCESS` === actionType) {
					MsgUtil.showwarning('修改成功');
					isRefresh = true;
				}
				if (isRefresh) {
					this.qryTable();
				}
			}
		}
	};



	showDataTypeHandler = (key) => {
		this.setState({
			showDataType: key,
			allOrderCurrentPage: 1,
		/*	record: {
				state: key
			}*/
		}, () => {
			this.qryTable();
		});
	};


	//控制查询
	qryTable = () => {
		const { actions } = this.props;
		const { pageSize, allOrderCurrentPage, record } = this.state;
		let currentRecord= {};

		//过淲为全部时
		if (record.productType==0) {
			currentRecord={
				productType: ''
			};
		} else {
			currentRecord={
				productType: record.productType
			};
		}


		console.log('allOrderCurrentPage, pageSize, currentRecord____________________________', allOrderCurrentPage, pageSize, currentRecord);

		if (JSON.stringify(record) == '{}') {
			// const record={ };
			actions.qryGoodsPages(allOrderCurrentPage, pageSize, currentRecord);
		} else {
			actions.qryGoodsPages(allOrderCurrentPage, pageSize, currentRecord);
		}
	};



	//下拉select 状态筛选
	statusSelector = (v) => {
		const { record, showDataType } = this.state;
		console.log('record______________________1', record);
		// record.state = v;
		record.productType = v;

		switch (showDataType) {
			case '1': {
				this.setState({
					allOrderCurrentPage: 1,
				});
				break;
			}
		}
		this.setState({
			productType: v ,
		}, () => {
			this.qryTable();
		});
	};


	//分页控制
	paginationController = (num) => {
		const { showDataType } = this.state;
		console.log('showDataType_________________________', showDataType);
		console.log('showDataType_________typeof________________', typeof showDataType);
		console.log('num_________________________', num);
		switch (showDataType) {
			case 1 : {
				this.setState({
					allOrderCurrentPage: num
				}, () => {
					this.qryTable();
				});
				break;
			}

			default:
				break;
		}
	};

	handleChange = (selectChannel) => {
		this.setState({
			selectChannel
		});
	};

	//Table行选择事件
	handleRowClk = (records) => {
		this.setState({
			selectedRowKeys: [records.goodsId],
		});
	};
	query = () => {
		this.setState({
			allOrderCurrentPage: 1,
		},() => {
			this.qryTable();

		});

	};
	renderGoods = (data={}) => {
		return (<div>
			<div className="clearfix">
				<span className="fl"><img src={data.advertisePic} width={60} /> </span>
				<div className="fl m_left10">
					<p>{ data.goodsTitle }</p>
					<p>{ data.goodsSubTitle }</p>
				</div>
			</div>
			<p style={{ display: 'none' }}>{ data.remark }</p>
		</div>);
	};

	renderEvent = (text,record, column) => {
		const { actions } =this.props;
		const { goodsId,status } = record;

		if (record && record.goodsId){
			actions.dealShareJewelGoods({
				operType: record.status==0 ? 12 : record.status==2 ? 13 :record.status==4 ?12  : '' ,
				record: {
					goodsId
				}
			});
		} else {
			MsgUtil.showwarning('当前操作错误');
		}
	};

	renderValue = (value, record, column) => {
		let str='';
		/*商品状态    0-保存 1-审核中 2-已上架 3-审核失败 4-已下架
		 保存-------只能点击上架
		 已上架-----只能点击下架
		 已下架-----只能点击上架
		 目前没有审核，暂不考虑*/
		const nodeTd=document.getElementById(`button_${column}`);
		if (record.status==0) {
			str='上 架';
		} else if (record.status==2) {
			str='下 架';
		} else if (record.status==4) {
			str='上 架';
		}
		nodeTd.innerHTML=str;
	};

	renderOrderFilterFun = () => {
		const cssObj={
			marginRight: 15
		};
		const Option = Select.Option;
		return (
			<div style={{ textAlign: 'right' }}  >
				<div className="goods-filter" >

					<span style={cssObj}>
									设备序列号: &nbsp;
						<Input
							style={{ width: 155 }}
							onChange={(obj) => {
								this.setState({
									sequence: obj.target.value
								});
							}}
						/>
					</span>

					<Button
						type="primary"
						icon="search"
						onClick={this.query}
						style={cssObj}
					>查询</Button>
					&nbsp;&nbsp;
					<Select
						defaultValue={MappingUtil.prayerOrderStateToNumText(this.state.record.productType*1)}
						style={{ width: 120 }}
						onChange={this.statusSelector}
					>
						<Option value="0" >全部</Option>
						<Option value="1" >已下单</Option>
						<Option value="2" >已支付</Option>
						<Option value="3" >已发货</Option>
						<Option value="4" >已完成</Option>
					</Select>
					&nbsp;&nbsp;

				</div>
			</div>
		);
	};

	render () {
		const allPayListColumns = [
			{
				title: '用户名',
				dataIndex: 'userName',
				key: 'userName',
			},
			 {
				title: '分配用户/布施用户	',
				dataIndex: 'distribution',
				key: 'distribution',
				 render: (txt,obj) => {
					 return txt==1 ?`分配[${txt}]`: txt==2 ?`布施[${txt}]`: '';
				 }
			},
			{
				title: '用户状态',
				dataIndex: 'status',
				key: 'status',
				render: (txt,obj) => {
					return txt==='U' ?'正常': txt==='E' ?'异常': '';
				}
			},
			{
				title: '备注',
				dataIndex: 'remark',
				key: 'remark',
				width: 150,
			}
		];
		const { allOrderShowList, allOrderListTotalCount, showDataType, allOrderCurrentPage } = this.state;
		//1-收款中,5-已完成,6-失败
		const TabPane = Tabs.TabPane;



		const renderOrderFilter=this.renderOrderFilterFun();
		return (<div className="buy-order-admin"  >
			<Row>
				<Col span={24} >
					<h3 style={{ fontSize: '36px', marginBottom: '20px' }} >布施用户管理 / Management</h3>
				</Col>
			</Row>
			<Row>
				<Col>
					<div className="admin-main div_relative" >
						{renderOrderFilter}
						<Tabs defaultActiveKey={showDataType}  onChange={this.showDataTypeHandler} >
							<TabPane tab="全部" key="1" >
								<Table
									dataSource={dataConfig.useManage}
									columns={allPayListColumns}
									pagination={false}
									rowKey={record => record.id}
									onRowClick={this.handleRowClk}
								/>
								<div className="pg-ctr" >
									<Pagination
										defaultCurrent={allOrderCurrentPage}
										current={allOrderCurrentPage}
										total={allOrderListTotalCount}
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
	const stateObje = {
		...state.get('RootService').toObject(),
		...state.get('qryPrayOrderReducer').toObject()
	};
	return stateObje;
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryGoodsPages,
			disbursementAudit,
			disbursementPaid,
			dealShareJewelGoods
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DonationUseAdmin);
