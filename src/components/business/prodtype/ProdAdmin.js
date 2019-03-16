'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Modal, Row, Table } from 'antd';

import * as businessRoute from 'business/route';
import * as MsgUtil from 'utils/MsgUtil';
import * as Constant from 'utils/Constant';

import {
	DEAL_UP_PROD,
	DEAL_UP_PROD_PIC,
	DELETE_UP_PROD,
	DELETE_UP_PROD_PIC,
	deleteUpProd,
	deleteUpProdPic,
	getAllProdMboradTypeSelectList,
	PROD_LIST_INIF,
	QRY_UP_PROD_PIC_BY_PROD_ID,
	qryUpProd,
	qryUpProdImgByProdId,
} from 'action';

import {
	GET_STATIC_DATA_BY_CODE_TYPE,
	getStaticDataByCodeType,
	UP_PROD_TYPE,
} from 'business/common/StaticDataService';
import ProdSearchForm, { ProdSearchFormCacheKey } from './ProdSearchForm';

class ProdAdmin extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		currentProd: PropTypes.object,
		currentProdPic: PropTypes.object,
		prodInfoList: PropTypes.array,
		staticDataList: PropTypes.array,
		mboardTypeList: PropTypes.array,
		prodPicList: PropTypes.array,
		rspInfo: PropTypes.object.isRequired,
		actionType: PropTypes.string.isRequired,
		actions: PropTypes.object.isRequired,
		params: PropTypes.object,
	};

	static defaultProps = {
		currentProd: undefined,
		currentProdPic: undefined,
		prodInfoList: [],
		staticDataList: [],
		mboardTypeList: [],
		prodPicList: [],
		params: {},
	};

	constructor (props) {
		super(props);
		const { currentProd, currentProdPic } = props;

		if (currentProdPic) {
			this.state = {
				selectedRowKeys: [currentProdPic.prodId],
				selectedImgRowKeys: currentProdPic.prodPicId
					? [currentProdPic.prodPicId]
					: [],
				currentPage: 1,       //当前选中的分页
			};
		} else if (currentProd) {

			this.state = {
				selectedRowKeys: currentProd.prodId ? [currentProd.prodId] : [],
				selectedImgRowKeys: [],
				currentPage: 1,       //当前选中的分页
			};
		} else {
			this.state = {
				selectedRowKeys: [],
				selectedImgRowKeys: [],
				currentPage: 1,       //当前选中的分页
			};
		}
	}

	componentWillMount () {
		const { actions, mboardTypeList, staticDataList } = this.props;
		if (!staticDataList || staticDataList.length < 1) {
			actions.getStaticDataByCodeType(UP_PROD_TYPE);
		}
		if (!mboardTypeList || mboardTypeList.length < 1) {
			actions.getAllProdMboradTypeSelectList();
		}

		this.handleQuery();
		if (this.state.selectedRowKeys[0]) {
			//  actions.qryUpProdImgByProdId(this.state.selectedRowKeys[0]);
		}
		const { params } =this.props;
		const { page } = params;
		if (page){
			this.setState({
				currentPage: parseInt(page)
			});
		}
	}

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				let isRefresh = false;
				if (`${PROD_LIST_INIF}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询产品列表失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${QRY_UP_PROD_PIC_BY_PROD_ID}_SUCCESS` ===
					actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询产品图片列表失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${GET_STATIC_DATA_BY_CODE_TYPE}_SUCCESS` ===
					actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询产品类型列表失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${DELETE_UP_PROD}_SUCCESS` === actionType ||
					`${DELETE_UP_PROD_PIC}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`删除产品信息失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					} else {
						isRefresh = true;
					}
				} else if (`${DEAL_UP_PROD}_SUCCESS` === actionType ||
					`${DEAL_UP_PROD_PIC}_SUCCESS` === actionType) {
					isRefresh = true;
				}
				if (isRefresh) {
					this.handleQuery();
					if (this.state.selectedRowKeys[0]) {
						//  actions.qryUpProdImgByProdId(this.state.selectedRowKeys[0]);
					}
				}
			}
		}
	}

	//radio选择变更事件处理
	onRadioSelectChange = (selectedRowKeys) => {
		console.log('onRadioSelectChange', selectedRowKeys);
		this.setState({ selectedRowKeys, selectedImgRowKeys: [] });
		const select = selectedRowKeys;
		if (select && select[0]) {
			const { actions } = this.props;
			actions.qryUpProdImgByProdId(select[0]);
		}
	};

	//pic选择
	onRadioImgSelectChange = (selectedImgRowKeys) => {
		console.log('onRadioImgSelectChange', selectedImgRowKeys);
		this.setState({ selectedImgRowKeys });
	};

	//Table行选择事件
	handleRowClk = (sel) => {
		this.setState(
			{ selectedRowKeys: [sel.prodId], selectedImgRowKeys: [] });
		const select = sel.prodId;
		if (select) {
			const { actions } = this.props;
			actions.qryUpProdImgByProdId(select);
		}
	};

	//Table行选择事件
	handleImgRowClk = (sel) => {
		this.setState({ selectedImgRowKeys: [sel.prodPicId] });
	};
	//[查询] 按钮
	handleQuery = (qryForm) => {
		const { actions } = this.props;
		if (!qryForm) {
			qryForm = JSON.parse(localStorage.getItem(ProdSearchFormCacheKey));
		}
		if (!qryForm) {
			qryForm = {};
		}


		console.log('qryForm_______________________:', qryForm);


		actions.qryUpProd(qryForm);
		this.setState({
			selectedRowKeys: [],
			selectedImgRowKeys: [],
			currentPage: 1,
		});
	};

	//[新增] 按钮
	handleAdd = () => {
		const { currentPage } =this.state;
		this.context.router.replace(`${businessRoute.ProdEdit}/${currentPage}`);
	};

	//[新增] 图片按钮
	handleAddPic = () => {
		const select = this.state.selectedRowKeys[0];
		const { currentPage } =this.state;
		if (select) {
			this.context.router.replace(`${businessRoute.ProdPicAdd}/${currentPage}/${select}`);
		} else {
			MsgUtil.showwarning('请选择一条产品');
			return false;
		}
	};

	//[修改] 按钮
	handleEdit = () => {
		const select = this.state.selectedRowKeys;
		const { currentPage } =this.state;
		if (select) {
			this.context.router.replace(`${businessRoute.ProdEdit}/${currentPage}/${select}`);
		} else {
			MsgUtil.showwarning('请选择一条产品');
		}
	};

	//产品图片
	handleEditPic = () => {
		const select = this.state.selectedImgRowKeys[0];
		const { currentPage } =this.state;
		this.context.router.replace(`${businessRoute.ProdPicEdit}/${currentPage}/${select}`);
	};

	//[删除] 按钮
	handleDelete = () => {
		const { selectedRowKeys } = this.state;
		const { actions } = this.props;//注：获取所有对象
		if (selectedRowKeys) {
			const deleteList = [];
			for (const i in selectedRowKeys) {
				deleteList.push({ prodId: selectedRowKeys[i] });
			}
			Modal.confirm({
				title: `确定要删除产品 [${selectedRowKeys}] 吗?`,
				content: '',
				onOk() {
					actions.deleteUpProd(deleteList);
				},
				onCancel() {
				},
			});
		} else {
			MsgUtil.showwarning('请选择需要删除的产品');
		}
	};

	//[删除] img
	handleDeletePic = () => {
		const { selectedImgRowKeys } = this.state;
		const { actions } = this.props;
		if (selectedImgRowKeys) {
			const deleteUpProdPicList = [];
			for (const i in selectedImgRowKeys) {
				deleteUpProdPicList.push({ prodPicId: selectedImgRowKeys[i] });
			}
			Modal.confirm({
				title: `确定要删除 [${selectedImgRowKeys}] 吗?`,
				content: '',
				onOk() {
					actions.deleteUpProdPic(deleteUpProdPicList);
				},
				onCancel() {
				},
			});
		} else {
			MsgUtil.showwarning('请选择需要删除的产品名称');
		}
	};

	//表格分页
	pagination = (data) => {
		const component = this;
		return {
			total: data.length,
			current: component.state.currentPage,
			showSizeChanger: true,
			onShowSizeChange(current, pageSize) {
				component.setState({ currentPage: 1 });
			},
			onChange(current) {
				component.setState({ currentPage: current });
			},
		};
	};

	render () {
		const { prodInfoList, prodPicList, staticDataList, mboardTypeList } = this.props;
		const { selectedRowKeys, selectedImgRowKeys } = this.state;

		const rowSelection = {
			type: 'radio',
			onChange: this.onRadioSelectChange,
			selectedRowKeys,
		};
		//PIC
		const ImgRowSelection = {
			type: 'radio',
			onChange: this.onRadioImgSelectChange,
			selectedImgRowKeys,
		};

		const hasSelected = selectedRowKeys && selectedRowKeys.length > 0;
		const hasSelectedImg = selectedImgRowKeys &&
			selectedImgRowKeys.length > 0;

		const columns = [
			{
				title: '产品名称',
				dataIndex: 'ProdName',
				key: 'ProdName',
				width: '200px',
				render: (
					text,
					prodInfoList) => `[${prodInfoList.prodId}] ${prodInfoList.prodName}`,
				onFilter: (value, record) => record.state.indexOf(value) === 0,
				sorter: (a, b) => a.prodName.length - b.prodName.length,
			}, {
				title: '产品类型',
				dataIndex: 'prodType',
				key: 'prodType',
				width: '200px',
				render: (prodType) => {
					let retStr = '';
					switch (prodType) {
						case 1: {
							retStr = '1-戒指';
							break;
						}
						case 2: {
							retStr = '2-手串';
							break;
						}
						case 3: {
							retStr = '3-项链';
							break;
						}
						case 4: {
							retStr = '4-手链';
							break;
						}
						default:
							retStr = '其它';
					}
					return retStr;
				},
			}, {
				title: '产品型号',
				dataIndex: 'prodModelnum',
				key: 'prodModelnum',
				width: '200px',
			}, {
				title: '厂商',
				dataIndex: 'factory',
				key: 'factory',
				width: '200px',
			}, {
				title: '主板型号',
				dataIndex: 'mboardType',
				key: 'mboardType',
				width: '200px',
				render(mboardType) {
					let retStr = '';
					switch (Number(mboardType)) {
						case 1: {
							retStr = '1-椭圆';
							break;
						}
						case 2: {
							retStr = '2-方型';
							break;
						}
						default:
							retStr = '其它';
					}
					return retStr;
				},
			}, {
				title: '备注',
				dataIndex: 'remark',
				key: 'remark',
				width: '200px',
			}];

		//PIC
		const ImgColumns = [
			{
				title: '图片',
				dataIndex: 'ProdImg',
				key: 'ProdImg',
				width: '200px',
				render: (text, prodPic) =>
					<img src={prodPic.prodImage} width="50" alt={prodPic.prodId} />,
				onFilter: (value, record) => record.state.indexOf(value) === 0,
				//  sorter: (a, b) => a.ProdImg.prodPicId - b.ProdImg.prodPicId,
			}, {
				title: '备注',
				dataIndex: 'ImgRemark',
				key: 'ImgRemark',
				width: '200px',
				render: (text, prodPic) => prodPic.remark,
			}];

		return (
			<div>
				<Row>
					<Col span={17} >
						<ProdSearchForm staticDataList={staticDataList} mboardTypeList={mboardTypeList} handleQuery={this.handleQuery} />
					</Col>
					<Col style={{ textAlign: 'right' }} >
						<Button type="primary" icon="edit" onClick={this.handleEdit} disabled={!hasSelected} >修改</Button>&nbsp;&nbsp;
						<Button type="primary" icon="delete" onClick={this.handleDelete} disabled={!hasSelected} >删除</Button>&nbsp;&nbsp;
						<Button type="primary" size="large" icon="plus" onClick={this.handleAdd} >新增产品</Button>
					</Col>
				</Row>
				<Row><Col span={24} >&nbsp;&nbsp;</Col></Row>
				<Row>
					<Col span={24} >
						<Table
							rowSelection={rowSelection}
							columns={columns}
							rowKey={record => record.prodId}
							dataSource={prodInfoList}
							onRowClick={this.handleRowClk}
							pagination={this.pagination(prodInfoList)}
						/>
					</Col>
				</Row>
				<br /> <br /> <br /> <br />
				<Row>
					<Col span={24} className="fr" >
						<Button type="primary" icon="edit" onClick={this.handleEditPic} disabled={!hasSelectedImg} >修改</Button> &nbsp;&nbsp;
						<Button type="primary" icon="delete" onClick={this.handleDeletePic} disabled={!hasSelectedImg} >删除</Button> &nbsp;&nbsp;
						<Button type="primary" size="large" onClick={this.handleAddPic} disabled={!hasSelected} >新增图片</Button>
					</Col>
				</Row>
				<Row><Col span={24} > &nbsp;&nbsp;</Col></Row>
				<Row>
					<Col span={28} className="fr" >
						<Table
							rowSelection={ImgRowSelection}
							columns={ImgColumns}
							rowKey={record => record.prodPicId}
							onRowClick={this.handleImgRowClk}
							dataSource={prodPicList}
						/>
					</Col>
				</Row>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { prodInfoList, prodPicList, mboardTypeList, currentProd, currentProdPic } = state.get(
		'prodInfor').toObject();
	const { staticDataList } = state.get('StaticDataService').toObject();
	return {
		prodInfoList,
		rspInfo,
		prodPicList,
		staticDataList,
		mboardTypeList,
		actionType,
		currentProd,
		currentProdPic,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryUpProd,
			deleteUpProd,
			qryUpProdImgByProdId,
			deleteUpProdPic,
			getAllProdMboradTypeSelectList,
			getStaticDataByCodeType,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ProdAdmin);
