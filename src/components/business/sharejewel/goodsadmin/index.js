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
import { statusNumToClass,statusNumToText,chipNumToText,worksTypeNumToText } from 'utils/MappingUtil';
import businessRoute from 'business/route';

import './index.less';

class GoodsAdmin extends React.Component {
	//检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
		params: PropTypes.object,
		allGoodsListData: PropTypes.array,
		actionType: PropTypes.string.isRequired,
		rspInfo: PropTypes.object.isRequired,
	};

	static defaultProps = {
		params: {},
		form: {},
		allGoodsListData: []
	};

	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			showDataType: '',
			pageSize: 10,
			record: {
				productType: ''
			},
			goodsListShowList: [],
			goodsCurrentPage: 1,
			goodsListTotalCount: 10,
			goodsId: undefined,
			teststateSave: '',
			OrderStatusUpdate: {
				stateSave: '保存',
				stateSaveIng: '已上架',
				stateSaleDown: '已下架'
			},
			goodIdValue: '',
			goodNameValue: ''

		};
	}

	componentWillMount() {
		const { goodsListShowList } = this.state;
		const { params } = this.props;
		const { page,fileType } = params;
		console.log('page__1:', page,'fileType_____2:', fileType);

		if (page !== undefined || fileType !== undefined) {
			this.setState({
				goodsCurrentPage: parseInt(page),
				record: {
					productType: fileType
				}
			}, () => {
				this.qryTable();
			});
		} else {
			//首次加载读取默认数据加载
			if (!goodsListShowList.length) {
				this.qryTable();
			}
		}
	}

	componentWillReceiveProps(nextProps,nextState) {
		let currentDataType=this.state.record.productType;
		if (currentDataType=='') {
			currentDataType=0;
		}
		const { allGoodsListData } = nextProps;
		const showListData = [];
		//列表模型
		if (allGoodsListData && allGoodsListData.records) {
			const ret = allGoodsListData.records;
			for (let i = 0, len = ret.length; i < len; i++) {
				const data = ret[i];
				showListData.push({
					goodsId: data.goodsId,
					productType: worksTypeNumToText(data.productType),
					goodsName: this.renderGoods({
						goodsName: data.goodsName,
						goodsTitle: data.goodsTitle,
						goodsSubTitle: data.goodsSubTitle,
						remark: data.remark,
						advertisePic: data.advertisePic,
					}
						),
					status: data.state ,
					action: <Link to={`${businessRoute.goodsAdminDetailEditBase}/${data.goodsId}/${encodeURIComponent(`${businessRoute.goodsAdmin}/list/${this.state.goodsCurrentPage}/${data.goodsId}/${currentDataType}`)}`} >编辑</Link>,
				});
			}
			this.setState({
				goodsListTotalCount: allGoodsListData.totalCount,
			});
		}

		this.setState({
			goodsListShowList: showListData
		}, () => {
		});
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


	//控制查询
	qryTable = () => {
		const { actions } = this.props;
		const {  record,goodIdValue,goodNameValue } = this.state;
		const { pageSize, goodsCurrentPage } = this.state;
		let currentRecord= {};
		if (record.productType==0) {
			//没有不滤
			if (goodIdValue !=='') {
				currentRecord={
					productType: '',
					goodsId: goodIdValue,
				};

			} else if (goodNameValue !=='') {
				currentRecord={
					productType: '',
					goodsName: goodNameValue,
				};
			}

		} else {
			//有select过淲
			if (goodIdValue && goodNameValue=='') {
				currentRecord={
					productType: record.productType,
					goodsId: goodIdValue,
				};
			} else if (goodNameValue && goodIdValue=='') {
				currentRecord={
					productType: record.productType,
					goodsName: goodNameValue,
				};
			} else if (goodIdValue && goodIdValue){
				currentRecord={
					productType: record.productType,
					goodsName: goodNameValue,
					goodsId: goodIdValue,
				};
			} else {
				currentRecord={
					productType: record.productType,
				};
			}


		}

		if (JSON.stringify(record) == '{}') {
			// const record={ };
			actions.qryGoodsPages(goodsCurrentPage, pageSize, currentRecord);
		} else {
			if (currentRecord.goodsName || currentRecord.goodsId ) {
				actions.qryGoodsPages(goodsCurrentPage, pageSize, currentRecord);
			} else {
				actions.qryGoodsPages(goodsCurrentPage, pageSize, currentRecord);
			}

		}
	};

	//下拉select 状态筛选
	statusSelector = (v) => {
		const { record, showDataType } = this.state;
		// record.productType = v;
		this.setState({
			record: {
				productType: v
			},
			goodsCurrentPage: 1,
		}, () => {
			this.qryTable();
			console.log('v________________', this.state.record.productType);
		});
	};

	//分页控制
	paginationController = (num) => {
		this.setState({
			goodsCurrentPage: num
		}, () => {
			this.qryTable();
		});
	};
	handleChange = (selectChannel) => {
		this.setState({
			selectChannel
		});
	};

	//Table行选择事件
	handleRowClk = (records) => {
		console.log('records______', records);
		this.setState({
			selectedRowKeys: [records.recId],
		});
	};

	renderGoods = (data={}) => {
		return (<div>
			<div className="clearfix">
				<span className="fl"><img src={data.advertisePic} width={60} /> </span>
				<div className="fl m_left10">
					<p>{ data.goodsName }</p>
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

	renderInitValue  = (value) => {
		console.log('defaultValue_______________________', value);
		if (value=='' ||value==0) {
			return '全部';
		} else if (value==1){
			return '戒指';
		} else if (value==2){
			return '手串';
		}  else if (value==3){
			return '项链';
		}  else if (value==4){
			return '手链';
		}  else if (value==5){
			return '手镯';
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


	render() {

		const allPayListColumns = [
			{
				title: '编号',
				dataIndex: 'goodsId',
				key: 'goodsId',
				width: 150,
			}, {
				title: '商品/名称',
				dataIndex: 'goodsName',
				key: 'goodsName',
				width: 150,

			},{
				title: '分类',
				dataIndex: 'productType',
				key: 'productType',
				width: 150,
			}, {
				title: '状态',
				dataIndex: 'status',
				key: 'status',
				width: 150,

				render: (value, record, column) => {
					return (<div className="statusStyle" >
						<span className="normalStyle" >
							<button type="primary"   className="btn" onClick={(text) => { this.renderEvent(text,record, column); }} onMouseOver={() => { this.renderValue(value, record, column); }} id={`button_${column}`}>
								{
									 value==0? '保 存': value==1 ? '审核中':  value==2 ?'已上架':value==3? '审核失败':value==4 ? '已下架': ''
								}

							</button>
							<i>{value==0? '保 存': value==1 ? '审核中':  value==2 ?'已上架':value==3? '审核失败':value==4 ? '已下架': ''}</i>
						</span>
					</div>);
				}
			},{
				title: '操作',
				dataIndex: 'action',
				key: 'action',
				width: 150,
			}
		];

		const cssObj={
			marginRight: 15
		};
		const query = () => {
			this.setState({
				goodsCurrentPage: 1,
				pageSize: 10
			},() => {
				this.qryTable();
			});

		};
		const { goodsListShowList, goodsListTotalCount, showDataType, goodsCurrentPage } = this.state;
		//1-收款中,5-已完成,6-失败
		const TabPane = Tabs.TabPane;
		const Option = Select.Option;
		return (<div className="qry-apply-admin"  >
			<Row>
				<Col span={24} >
					<h3 style={{ fontSize: '36px', marginBottom: '20px' }} >商品管理 / Commodity</h3>
				</Col>
			</Row>
			<Row>
				<Col>
					<div className="admin-main" >
						<div style={{ textAlign: 'right' }} >

							 <div className="goods-filter" >

								  <span style={cssObj}>
									商品编号: &nbsp;
									  <Input
										  style={{ width: 155 }}
										  onChange={(obj) => {
												  this.setState({
													  goodIdValue: obj.target.value
												  });
										  }}

									  />
								</span>
								 <span style={cssObj}>
									商品名称:&nbsp;
									 <Input
										 style={{ width: 155 }}
										 onChange={(obj) => {
											 this.setState({
												 goodNameValue: obj.target.value
											 });
										 }}
									 />
								</span>
								 <span style={cssObj}>
									<Button type="primary" icon="search" onClick={query} >查询</Button>
								</span>
								 <span style={cssObj} className="gray"> | </span>
								 <span style={cssObj}>
									  商品分类: &nbsp;
									 <Select
										 defaultValue={this.renderInitValue(this.state.record.productType)}
										 style={{ width: 120 }}
										 onChange={this.statusSelector}
									 >
										<Option value="" >全部</Option>
										<Option value={1} >戒指</Option>
										<Option value={2} >手串</Option>
										<Option value={3} >项链</Option>
										<Option value={4} >手链</Option>
										<Option value={5} >手镯</Option>
									</Select>
								 </span>

								 <span style={cssObj} className="gray"> | </span>
								 &nbsp;&nbsp;<span> <Link to={`${businessRoute.goodsAdminDetailAddOrigin}/${encodeURIComponent(`${businessRoute.goodsAdmin}/list/${this.state.goodsCurrentPage}/1/0`)}`}><Button type="primary"  >添加商品</Button></Link></span>
							</div>
						</div>
						<Tabs defaultActiveKey={showDataType} >

							<TabPane tab="商品" key="1" >
								<Table
									dataSource={goodsListShowList}
									columns={allPayListColumns}
									pagination={false}
									rowKey={record => record.id}
									onRowClick={this.handleRowClk}
								/>
								<div className="pg-ctr" >
									<Pagination
										defaultCurrent={goodsCurrentPage}
										current={goodsCurrentPage}
										total={goodsListTotalCount}
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
		...state.get('qryGoodsReducer').toObject()
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

export default connect(mapStateToProps, mapDispatchToProps)(GoodsAdmin);
