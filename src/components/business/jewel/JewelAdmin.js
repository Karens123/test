'use strict';

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Icon, Input, Modal, Row, Select, Table } from 'antd';
import {
	addJewel,
	addJewelimg,
	dealJewelImg,
	DEL_JEWEL_INFOR,
	DEL_JEWEL_PHTO_INFOR,
	delCurrentJewlImg,
	delJewelData,
	getAllJewelImgList,
	getAllJewelList,
	getAllJewelSelectList,
	initCurrentJewel,
	initJewelImg,
	JEWEL_ALL_LIST_INIT_INFO,
} from 'action';
import * as businessRoute from 'business/route';
import * as Constant from 'utils/Constant';
import * as MsgUtil from 'utils/MsgUtil';

const Option = Select.Option;

class JewelAdmin extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		currentPage: PropTypes.number,
		jewelInfoList: PropTypes.array,
		jewelPicList: PropTypes.array,
		currentJewelData: PropTypes.object,
		rspInfo: PropTypes.object.isRequired,
		actionType: PropTypes.string.isRequired,
		actions: PropTypes.object.isRequired,
		params: PropTypes.object,
	};

	static defaultProps = {
		currentPage: 1,
		jewelInfoList: [],
		jewelPicList: [],
		currentJewelData: {},
		params: {},
	};

	constructor (props) {
		super(props);
		const { currentPage, currentJewelData } = this.props;

		if (currentJewelData) {
			this.state = {
				selectedRowKeys: currentJewelData.jewelId
					? [currentJewelData.jewelId]
					: [],
				jewelInfoList: [],
				qryUsername: '',
				options_type: '',
				options_num: '',
				selectedImgRowKeys: [],
				jewelType: '',
				hasQuery: false,
				jewelSelectList: [],
				jewelBrotherInfoList: [],
				Init_jewelId: undefined,
				currentPage,  //当前选中的分页
			};
		} else {
			this.state = {
				selectedRowKeys: [],
				jewelInfoList: [],
				qryUsername: '',
				options_type: '',
				options_num: '',
				selectedImgRowKeys: [],
				jewelType: '',
				hasQuery: false,
				jewelSelectList: [],
				jewelBrotherInfoList: [],
				Init_jewelId: undefined,
				currentPage,  //当前选中的分页
			};
		}

	}

	componentWillMount () {
		this.handleQuery();
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
		const { selectedRowKeys } = this.state;

		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				let isRefresh = false;
				//查询所有珠宝
				if (`${JEWEL_ALL_LIST_INIT_INFO}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询列表失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${DEL_JEWEL_INFOR}_SUCCESS` === actionType) {

					if (rspInfo.resultCode !== Constant.REST_OK) { //Constant.REST_OK==0
						MsgUtil.showwarning(
							`修改失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					} else {
						MsgUtil.showwarning('删除成功');
						isRefresh = true;
					}
				} else if (`${DEL_JEWEL_PHTO_INFOR}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) { //Constant.REST_OK==0
						MsgUtil.showwarning(
							`删除失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					} else {
						MsgUtil.showwarning('删除成功!');
						this.CurrentJewelImgList(selectedRowKeys);
					}
				}
				if (isRefresh) {
					this.handleQuery();
				}
			}
		}
	}

	//每次更新时被调用
	componentDidUpdate () {
		console.log('did update');
	}

	//radio选择变更事件处理
	onRadioSelectChange = (selectedRowKeys) => {
		this.setState({ selectedRowKeys });
		//获取当前选择珠宝项所有图片列表
		this.CurrentJewelImgList(selectedRowKeys);
	};

	//pic选择
	onRadioImgSelectChange = (selectedImgRowKeys) => {
		console.log('onRadioImgSelectChange selectedRow:', selectedImgRowKeys);
		console.log('onRadioImgSelectChange jewelPicList:',
			this.props.jewelPicList);
		console.log('onRadioImgSelectChange state.selectedImgRowKeys :',
			this.state.selectedImgRowKeys);
		this.setState({ selectedImgRowKeys });
	};

	handleImgRowClk = (selectedRow) => {
		console.log('handleImgRowClk selectedRow:', selectedRow);
		console.log('handleImgRowClk jewelPicList:', this.props.jewelPicList);
		console.log('handleImgRowClk state.selectedImgRowKeys :',
			this.state.selectedImgRowKeys);
		this.setState({ selectedImgRowKeys: [selectedRow.jewelPicId] });
	};

	// Table行选择事件
	handleRowClk = (selectedRow) => {
		this.setState({ selectedRowKeys: [selectedRow.jewelId] });
		this.CurrentJewelImgList([selectedRow.jewelId]);
	};

	//应用类型名称变更
	handleInputChange = (e) => {
		this.setState({ qryUsername: e.target.value });
	};

	CurrentJewelImgList = (selectedRowKeys) => {
		const { actions, jewelInfoList } = this.props;

		let currentJewel = [];
		jewelInfoList.forEach((item) => {
			if (item.jewelId == selectedRowKeys) {
				currentJewel = item;
			}
		});

		actions.getAllJewelImgList(currentJewel);
	};
	//新增图片
	newAddJewelPhto = () => {
		const { actions, jewelInfoList } = this.props;
		const { currentPage } =this.state;
		const select = this.state.selectedRowKeys;
		let currentJewel = [];

		jewelInfoList.forEach((item) => {
			if (item.jewelId == select) {
				currentJewel = item;
			}
		});

		if (typeof currentJewel === 'object' && currentJewel) {
			actions.addJewelimg(currentJewel);
			this.context.router.replace(`${businessRoute.JewelEditImg}/add/${currentPage}`);
		} else {
			util.showwarning('请选择一条产品');
			return false;
		}
	};

	//[查询] 按钮
	handleQuery = () => {
		const { actions } = this.props;
		let { qryUsername, jewelType } = this.state;
		const { Init_jewelId } = this.state;

		//当为空时，查询所有
		if (qryUsername == '') {
			qryUsername = null;
		}
		if (jewelType == '' || jewelType == 'All') {
			jewelType = null;
		}

		const jewelIOArguments = {
			jewelName: qryUsername,
			jewelType,
			Init_jewelId,
		};

		this.setState({
			hasQuery: true,
			currentPage: 1,
		},() => {
			actions.getAllJewelList(jewelIOArguments);
		});
	};

	//[修改] 按钮
	handleEdit = () => {
		const { actions, jewelInfoList } = this.props;
		const { currentPage } =this.state;
		const select = this.state.selectedRowKeys;
		let currentJewelData = [];

		jewelInfoList.forEach((itme) => {
			if (itme.jewelId == select) {
				currentJewelData = itme;
			}
		});
		if (currentJewelData) {
			//重新初始化

			// actions.initCurrentJewel(currentJewelData);
			this.context.router.replace(
				`${businessRoute.JewelEdit}/${currentPage}/${currentJewelData.jewelId}`);
		} else {
			util.showwarning('请选择一条珠宝数据');
		}
	};

	//产品图片编辑
	handleImgEdit = () => {
		const { actions, jewelPicList } = this.props;
		const { currentPage } =this.state;
		const select = this.state.selectedImgRowKeys;
		if (select && select.length > 0) {
			//获取当于选中的对象
			let SeletCurrentPic = [];
			jewelPicList.forEach((itme) => {
				if (itme.jewelPicId == select[0]) {
					SeletCurrentPic = itme;
				}
			});

			actions.initJewelImg(SeletCurrentPic);
			this.context.router.replace(
				`${businessRoute.JewelEditImg}/${currentPage}/${SeletCurrentPic.jewelPicId}`);
		}
	};

	//[删除] 按钮
	handleDelete = () => {
		const { selectedRowKeys } = this.state;
		const { actions, jewelInfoList } = this.props; //注：获取所有对象

		let currentObj;
		jewelInfoList.forEach((item) => {
			if (item.jewelId == selectedRowKeys) {
				currentObj = item;
			}
		});

		if (currentObj) {
			Modal.confirm({
				title: `确定要删除珠宝名称为 [${currentObj.jewelName}] 吗?`,
				content: '',
				onOk() {
					actions.delJewelData(util.OPER_TYPE_DELETE, currentObj);
				},
				onCancel() {
				},
			});
		} else {
			util.showwarning('请选择需要删除的应用名称');
		}
	};

	//[删除] img
	handleDeleteImg = () => {
		const { selectedImgRowKeys } = this.state;
		const { actions, jewelPicList } = this.props; //注：获取所有对象

		let currentImgObj;
		jewelPicList.forEach((item) => {
			if (item.jewelPicId == selectedImgRowKeys) {
				currentImgObj = item;
			}
		});

		if (currentImgObj) {
			Modal.confirm({
				title: '确定要删除吗?',
				content: '',
				onOk() {
					actions.delCurrentJewlImg(util.OPER_TYPE_DELETE,
						currentImgObj);
				},
				onCancel() {
				},
			});
		} else {
			util.showwarning('请选择需要删除的应用名称');
		}
	};
	//新增珠宝
	handleAddJewel = (e) => {
		const { currentPage } =this.state;
		this.context.router.replace(`${businessRoute.JewelAdd}/${currentPage}`);
	};

	handleChange_type = (value) => {
		if (value == '') {
			value = null;
		}
		this.setState({ jewelType: value });
	};

	//表格分页
	pagination (data) {
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
	}

	render () {
		const { jewelInfoList } = this.props;
		const { selectedRowKeys, selectedImgRowKeys, jewelType } = this.state;
		let { jewelPicList } = this.props;

		// 通过 rowSelection 对象表明需要行选择
		const rowSelection = {
			type: 'radio',
			onChange: this.onRadioSelectChange,
			selectedRowKeys,
		};
		//初始化图片列
		Object.is(selectedRowKeys[0], undefined)
			? jewelPicList = undefined
			: jewelPicList;

		const hasSelected = selectedRowKeys && selectedRowKeys.length > 0;
		const hasSelectedImg = selectedImgRowKeys &&
			selectedImgRowKeys.length > 0;

		const columns = [
			{
				title: '珠宝名称',
				dataIndex: 'JewelName',
				key: 'JewelName',
				width: '200px',
				render: (
					text,
					jewelInfoList) => `[${jewelInfoList.jewelId}] ${jewelInfoList.jewelName}`,
				onFilter: (value, record) => record.state.indexOf(value) === 0,
				sorter: (a, b) => a.jewelName.length - b.jewelName.length,

			}, {
				title: '珠宝类型',
				dataIndex: 'jewelType',
				key: 'jewelType',
				width: '200px',
				render: (text, jewelInfoList) => {
					let jewelType = jewelInfoList.jewelType;
					switch (jewelType) {
						case 1: {
							jewelType = '宝石';
							break;
						}
						case 2: {
							jewelType = '玉石';
							break;
						}
						case 3: {
							jewelType = '彩石';
							break;
						}
							break;
						default:
							jewelType = '其它';
					}
					return jewelType;
				},
			}, {
				title: '珠宝型号',
				dataIndex: 'jewelModelnum',
				key: 'jewelModelnum',
				width: '200px',
				render: (
					text, jewelInfoList) => `${jewelInfoList.jewelModelnum}`,
			}, {
				title: '备注',
				dataIndex: 'remark',
				key: 'remark',
				width: '200px',
			},
		];

		//图片功能部份
		const ImgRowSelection = {
			type: 'radio',
			onChange: this.onRadioImgSelectChange,
			selectedRowKeys: selectedImgRowKeys,
		};

		const ImgColumns = [
			{
				title: '珠宝图片',
				dataIndex: 'JewelImg',
				key: 'JewelImg',
				width: '200px',
				render: (text, jewelPicList) =>
					<img src={jewelPicList.jewelImage} width="80" alt={jewelPicList.jewelPicId} />,
				onFilter: (value, record) => record.state.indexOf(value) === 0,

			}, {
				title: '备注',
				dataIndex: 'ImgRemark',
				key: 'ImgRemark',
				width: '200px',
				render: (text, jewelPicList) => jewelPicList.remark,
			}];

		return (
			<div>
				<Row>
					<Col span={24} >
						<span style={{ float: 'left' }} >
						珠宝名称:&nbsp;&nbsp;
							<Input
								size="large"
								placeholder="珠宝名称"
								onChange={this.handleInputChange}
								style={{
									width: 150,
									height: 'auto',
								}}
							/> &nbsp;&nbsp;珠宝类型:&nbsp;&nbsp;
							<Select
								filterOption={false}
								onChange={this.handleChange_type}
								placeholder="珠宝类型"
								style={{ width: 150 }}
								defaultValue="全部"
							>
								<Option value="3" >彩石</Option>
								<Option value="2" >玉石</Option>
								<Option value="1" >宝石</Option>
								<Option value="" >其它</Option>
							</Select> &nbsp;&nbsp;&nbsp;
							<Button type="primary" icon="search" onClick={this.handleQuery} >查询</Button>&nbsp;&nbsp;
							<Button type="primary" icon="edit" onClick={this.handleEdit} disabled={!hasSelected} >修改</Button> &nbsp;&nbsp;
							<Button type="primary" icon="delete" onClick={this.handleDelete} disabled={!hasSelected} >删除</Button>
						</span>
						<span style={{ float: 'right' }} >&nbsp;&nbsp;
							<Button type="primary" size="large" onClick={this.handleAddJewel} >
								<Link>
									<Icon type="plus" />
									<span>&nbsp;&nbsp;&nbsp;&nbsp;新增珠宝</span>
								</Link>
							</Button>&nbsp;
						</span>
					</Col>
				</Row>
				<Row>
					<Col span={24} >&nbsp;&nbsp;</Col>
				</Row>
				<Row>
					<Col span={24} >
						<Table
							rowSelection={rowSelection}
							columns={columns}
							rowKey={record => record.jewelId}
							dataSource={jewelInfoList}
							onRowClick={this.handleRowClk}
							pagination={this.pagination(jewelInfoList)}
							// pagination={util.pagination()}
						/>
					</Col>
				</Row>
				<br />
				<br />
				<br />
				<br />
				<Row>
					<Col span={24} className="fr" >
						<Button type="primary" icon="edit" onClick={this.handleImgEdit} disabled={!hasSelectedImg} >修改</Button>&nbsp;&nbsp;
						<Button type="primary" icon="delete" onClick={this.handleDeleteImg} disabled={!hasSelectedImg} >删除</Button>&nbsp;&nbsp;
						<Button type="primary" size="large" onClick={this.newAddJewelPhto} disabled={!hasSelected} >新增图片</Button>
					</Col>
				</Row>
				<Row>
					<Col span={24} >&nbsp;&nbsp;</Col>
				</Row>
				<Row>
					<Col span={24} className="fr" >
						<Table
							rowSelection={ImgRowSelection}
							columns={ImgColumns}
							rowKey={record => record.jewelPicId}
							onRowClick={this.handleImgRowClk}
							dataSource={jewelPicList}
						/>
					</Col>
				</Row>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { refreshData, jewelInfoList, jewelPicList, staticDataList, operType, currentJewelData, SeletCurrentPic } = state.get(
		'jewelInfor').toObject();
	return {
		jewelInfoList: jewelInfoList ? jewelInfoList : [],
		rspInfo,
		refreshData,
		jewelPicList,
		staticDataList,
		operType,
		actionType,
		currentJewelData,
		SeletCurrentPic,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			getAllJewelList,
			initCurrentJewel,
			delJewelData,
			getAllJewelImgList,
			dealJewelImg,
			initJewelImg,
			delCurrentJewlImg,
			addJewelimg,
			getAllJewelSelectList,
			addJewel,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(JewelAdmin);
