'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Col, Row, Table, Tabs, Select, Pagination,Modal,Input,Form,Icon,Menu,Button  } from 'antd';
import { parseDate,parseDateTime } from 'utils/DateUtil';
import * as MsgUtil from 'utils/MsgUtil';
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


import './index.less';


class PlacingOrderAdmin extends React.Component {
	//检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
		params: PropTypes.object,
		allOrderListData: PropTypes.array,
		actionType: PropTypes.string.isRequired,
		rspInfo: PropTypes.object.isRequired,
	};

	static defaultProps = {
		params: {},
		form: {},
		allOrderListData: []
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
			hasOrderShowList: [], //已下单
			hasPayoffOrderShowList: [],//已付款
			haslogisticsOrderShowList: [], //已发货



			allOrderCurrentPage: 1,
			hasOrderCurrentPage: 1,
			hasPayoffOrderCurrentPage: 1,
			haslogisticsOrderCurrentPage: 1,


			allOrderListTotalCount: 10,
			hasOrderShowListTotalCount: 10,
			hasPayoffOrderShowListTotalCount: 10,
			haslogisticsOrderShowListTotalCount: 10,


			goodsId: undefined,
			teststateSave: '',
			OrderStatusUpdate: {
				stateSave: '保存',
				stateSaveIng: '已上架',
				stateSaleDown: '已下架'
			}

		};
	}

	componentWillMount() {
		const { allOrderShowList } = this.state;
		const { params } = this.props;
		const { page,fileType,dataType } = params;
		console.log('page______________________0:', page);
		console.log('dataType__________________1:', dataType);
		console.log('fileType___________________2:', fileType);

		if (page !== undefined || fileType !== undefined || dataType !== undefined) {
			switch (dataType) {
				case 1 : {
					this.setState({
						showDataType: dataType,
						allOrderCurrentPage: parseInt(page),
						hasOrderCurrentPage: 1,
						hasPayoffOrderCurrentPage: 1,
						haslogisticsOrderCurrentPage: 1,

					}, () => {
						this.qryTable();
					});
					break;
				}

				case 2 : {
					this.setState({
						showDataType: dataType,
						allOrderCurrentPage: 1 ,
						hasOrderCurrentPage: parseInt(page),
						hasPayoffOrderCurrentPage: 1,
						haslogisticsOrderCurrentPage: 1,

					}, () => {
						this.qryTable();
					});
					break;
				}

				case 3 : {
					this.setState({
						showDataType: dataType,
						allOrderCurrentPage: 1 ,
						hasOrderCurrentPage: 1,
						hasPayoffOrderCurrentPage: parseInt(page),
						haslogisticsOrderCurrentPage: 1,

					}, () => {
						this.qryTable();
					});
					break;
				}

				case 4 : {
					this.setState({
						showDataType: dataType,
						allOrderCurrentPage: 1 ,
						hasOrderCurrentPage: 1,
						hasPayoffOrderCurrentPage: 1,
						haslogisticsOrderCurrentPage: parseInt(page),

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

		const { allOrderListData } = nextProps;
		const {
			showDataType,
			record,
			allOrderCurrentPage,
			hasOrderCurrentPage,
			hasPayoffOrderCurrentPage,
			haslogisticsOrderCurrentPage,

		} = this.state;
		const { productType } = record;
		console.log('dataType,showDataType,fileType____________________________:', allOrderCurrentPage,productType,showDataType );
		const showListData = [];
		//列表模型-射数据入数组
		if (allOrderListData && allOrderListData.records) {
			const ret = allOrderListData.records;

			switch (showDataType) {
				case 1 : {
					if (allOrderListData && allOrderListData.records) {
						for (let i = 0, len = ret.length; i < len; i++) {
							const data = ret[i];
							showListData.push({
								goodsId: data.goodsId,
								productType: MappingUtil.worksTypeNumToText(data.productType),
								goodsName: data.goodsTitle,
								status: data.state ,
								payType: '支付寶',
								action: <Link to={`${businessRoute.placingOrderDetail}/${data.goodsId}/${allOrderCurrentPage}/${productType}/${showDataType}`} >查看</Link>,
								// dataType,showDataType
							});
						}

						this.setState({
							allOrderListTotalCount: allOrderListData.totalCount,
						});
					}

					this.setState({
						allOrderShowList: showListData
					}, () => {
					});
					break;

				}
				case 2 : {
					if (allOrderListData && allOrderListData.records) {
						for (let i = 0, len = ret.length; i < len; i++) {
							const data = ret[i];
							showListData.push({
								goodsId: data.goodsId,
								productType: MappingUtil.worksTypeNumToText(data.productType),
								goodsName: this.renderGoods({
									goodsTitle: data.goodsTitle,
									goodsSubTitle: data.goodsSubTitle,
									remark: data.remark,
									advertisePic: data.advertisePic,
								}
								),
								status: data.state ,
								action: <Link to={`${businessRoute.goodsAdminDetailEditBase}/${data.goodsId}/${encodeURIComponent(`${businessRoute.goodsAdmin}/list/${this.state.allOrderCurrentPage}/${data.goodsId}/${currentDataType}`)}`} >编辑</Link>,
							});
						}

						this.setState({
							hasOrderShowListTotalCount: allOrderListData.totalCount,
						});
					}

					this.setState({
						hasOrderShowList: showListData
					}, () => {
					});
					break;

				}
				case 3 : {
					if (allOrderListData && allOrderListData.records) {
						for (let i = 0, len = ret.length; i < len; i++) {
							const data = ret[i];
							showListData.push({
								goodsId: data.goodsId,
								productType: MappingUtil.worksTypeNumToText(data.productType),
								goodsName: this.renderGoods({
									goodsTitle: data.goodsTitle,
									goodsSubTitle: data.goodsSubTitle,
									remark: data.remark,
									advertisePic: data.advertisePic,
								}
								),
								status: data.state ,
								action: <Link to={`${businessRoute.goodsAdminDetailEditBase}/${data.goodsId}/${encodeURIComponent(`${businessRoute.goodsAdmin}/list/${this.state.allOrderCurrentPage}/${data.goodsId}/${currentDataType}`)}`} >编辑</Link>,
							});
						}

						this.setState({
							hasPayoffOrderShowListTotalCount: allOrderListData.totalCount,
						});
					}

					this.setState({
						hasPayoffOrderShowList: showListData
					}, () => {
					});
					break;

				}
				case 4 : {
					if (allOrderListData && allOrderListData.records) {
						for (let i = 0, len = ret.length; i < len; i++) {
							const data = ret[i];
							showListData.push({
								goodsId: data.goodsId,
								productType: MappingUtil.worksTypeNumToText(data.productType),
								goodsName: this.renderGoods({
									goodsTitle: data.goodsTitle,
									goodsSubTitle: data.goodsSubTitle,
									remark: data.remark,
									advertisePic: data.advertisePic,
								}
								),
								status: data.state ,
								action: <Link to={`${businessRoute.goodsAdminDetailEditBase}/${data.goodsId}/${encodeURIComponent(`${businessRoute.goodsAdmin}/list/${this.state.allOrderCurrentPage}/${data.goodsId}/${currentDataType}`)}`} >编辑</Link>,
							});
						}

						this.setState({
							haslogisticsOrderCurrentPage: allOrderListData.totalCount,
						});
					}

					this.setState({
						haslogisticsOrderShowList: showListData
					}, () => {
					});
					break;
				}

			}

		}

/*		this.setState({
			allOrderShowList: showListData
		}, () => {
		});*/
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
			hasOrderCurrentPage: 1,
			hasPayoffOrderCurrentPage: 1,
			haslogisticsOrderCurrentPage: 1,
			hasfinishedOrderCurrentPage: 1,
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
			case '2': {
				this.setState({
					hasOrderCurrentPage: 1,
				});
				break;
			}
			case '3': {
				this.setState({
					hasPayoffOrderCurrentPage: 1,
				});
				break;
			}
			case '4': {
				this.setState({
					haslogisticsOrderCurrentPage: 1,
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
			case 2: {
				this.setState({
					hasOrderCurrentPage: num
				}, () => {
					this.qryTable();
				});
				break;
			}
			case 3: {
				this.setState({
					hasPayoffOrderCurrentPage: num
				}, () => {
					this.qryTable();
				});
				break;
			}

			case 4: {
				this.setState({
					haslogisticsOrderCurrentPage: num
				}, () => {
					this.qryTable();
				});
				break;
			}


			default:
				break;
		}
	};



/*	paginationController = (num) => {
		this.setState({
			allOrderCurrentPage: num
		}, () => {
			this.qryTable();
		});
	};*/


	handleChange = (selectChannel) => {
		this.setState({
			selectChannel
		});
	};

	//Table行选择事件
	handleRowClk = (records) => {
		console.log('records____________________________0:', records.goodsId);
		this.setState({
			selectedRowKeys: [records.goodsId],
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
	renderOrderFilterFun = () => {
		const Option = Select.Option;
		return (
			<div style={{ textAlign: 'right' }}  >
				<div className="goods-filter" >
					<Select
						defaultValue={MappingUtil.prayerOrderStateToNumText(this.state.record.productType*1)}
						style={{ width: 120 }}
						onChange={this.statusSelector}
					>
						<Option value="0" >全部</Option>
						<Option value="1" >已下单</Option>
						<Option value="2" >已支付</Option>
						<Option value="3" >已分配</Option>
					</Select>
					&nbsp;&nbsp;
				</div>
			</div>
		);
	};
	render () {
		const allPayListColumns = [
			{
				title: '订单号',
				dataIndex: 'goodsId',
				key: 'goodsId',
			}, {
				title: '商品名称',
				dataIndex: 'goodsName',
				key: 'goodsName',
			},{
				title: '下单时间	',
				dataIndex: 'productType',
				key: 'productType',
			}, {
				title: '实付',
				dataIndex: 'payType',
				key: 'payType',
			},
			{
				title: '订单状态',
				dataIndex: 'status',
				key: 'status',
			},
			{
				title: '操作',
				dataIndex: 'action',
				key: 'action',
				width: 150,
			}
		];
		const { allOrderShowList, allOrderListTotalCount, showDataType, allOrderCurrentPage } = this.state;
		//1-收款中,5-已完成,6-失败
		const TabPane = Tabs.TabPane;

		console.log('allOrderShowList______________________4____________________', allOrderShowList);

		const renderOrderFilter=this.renderOrderFilterFun();
		return (<div className="buy-order-admin"  >
			<Row>
				<Col span={24} >
					<h3 style={{ fontSize: '36px', marginBottom: '20px' }} >布施订单管理 / Giving</h3>
				</Col>
			</Row>
			<Row>
				<Col>
					<div className="admin-main div_relative" >


						{renderOrderFilter}

						<Tabs defaultActiveKey={showDataType}  onChange={this.showDataTypeHandler} >

							<TabPane tab="全部" key="1" >
								<Table
									dataSource={allOrderShowList}
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

							<TabPane tab="已下单/待付款" key="2" >
								<Table
									dataSource={allOrderShowList}
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

							<TabPane tab="已支付/待分配" key="3" >
								<Table
									dataSource={allOrderShowList}
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
							<TabPane tab="已分配/已完成" key="4" >
								<Table
									dataSource={allOrderShowList}
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

export default connect(mapStateToProps, mapDispatchToProps)(PlacingOrderAdmin);
