'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Modal, Row, Table } from 'antd';
import * as MsgUtil from 'utils/MsgUtil';
import * as Constant from 'utils/Constant';
import * as businessRoute from 'business/route';
import {
	dealStaticData,
	DELETE_STATIC_DATA,
	initAStaticDataForAdd,
	initEditStaticData,
	QRY_STATIC_DATA_BY_FORM,
	qryStaticDataById,
	qryStaticDataLike,
} from 'action';
import StaticDataSearchForm, { StaticDataSearchFormCacheKey } from './StaticDataSearchForm';

class StaticDataAdmin extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		staticDataList: PropTypes.array,
		currentPage: PropTypes.number,
		actionType: PropTypes.string.isRequired,
		rspInfo: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		params: PropTypes.object,
	};

	static defaultProps = {
		staticDataList: [],
		currentPage: 1,
		params: {}
	};

	constructor (props) {
		super(props);
		const { currentPage } = props;
		this.state = {
			selectedRowKeys: [],            // 选择的行记录
			currentPage,       //当前选中的分页
		};
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
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				let isRefresh = false;
				if (`${QRY_STATIC_DATA_BY_FORM}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${DELETE_STATIC_DATA}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`删除失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					} else {
						MsgUtil.showwarning('删除成功!');
						isRefresh = true;
					}
				}
				if (isRefresh) {
					this.handleQuery();
				}
			}
		}
	}


	//radio选择变更事件处理
	onRadioSelectChange = (selectedRowKeys) => {
		console.log('selectedRowKeys', selectedRowKeys);
		this.setState({ selectedRowKeys });
	};

	//Table行选择事件
	handleRowClk = (sel) => {
		this.setState({ selectedRowKeys: [`${sel.codeType}${sel.codeValue}`] });
	};

	//[查询] 按钮
	handleQuery = (qryForm) => {
		const { actions } = this.props;
		if (!qryForm) {
			qryForm = JSON.parse(
				localStorage.getItem(StaticDataSearchFormCacheKey));
		}
		if (!qryForm) {
			qryForm = {};
		}
		actions.qryStaticDataLike(qryForm);
	};

	//[修改] 按钮
	handleEdit = () => {
		const { staticDataList } = this.props;
		const { selectedRowKeys,currentPage } = this.state;

		let currentStaticData;
		staticDataList.forEach((item) => {
			if (item.codeType + item.codeValue == selectedRowKeys) {
				currentStaticData = item;
			}
		});

		if (currentStaticData) {
			this.context.router.replace(
				`${businessRoute.StaticDataEdit}/${currentPage}/${currentStaticData.codeType}`);
		} else {
			MsgUtil.showwarning('请选择需修改的静态数据');
		}
	};

	//[删除] 按钮
	handleDelete = () => {
		const { selectedRowKeys } = this.state;
		const { staticDataList, actions } = this.props;
		let currentStaticData;

		staticDataList.forEach((item) => {
			if (item.codeType + item.codeValue == selectedRowKeys) {
				currentStaticData = item;
			}
		});

		if (currentStaticData) {
			Modal.confirm({
				title: `确定要删除静态数据 [${currentStaticData.codeType}] 吗?`,
				content: '',
				onOk() {
					actions.dealStaticData(Constant.OPER_TYPE_DELETE,
						currentStaticData);
				},
				onCancel() {
				},
			});
		} else {
			MsgUtil.showwarning('请选择需要删除的用户');
		}
	};

	//[新增] 按钮
	handleAdd = () => {
		const { currentPage } = this.state;
		this.context.router.replace(`${businessRoute.StaticDataEdit}/${currentPage}`);
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
		const { staticDataList } = this.props;
		const { selectedRowKeys } = this.state;

		// 通过 rowSelection 对象表明需要行选择
		const rowSelection = {
			type: 'radio',
			onChange: this.onRadioSelectChange,
			selectedRowKeys,
		};

		const hasSelected = selectedRowKeys && selectedRowKeys.length > 0;

		const columns = [
			{
				title: '数据编码',
				dataIndex: 'codeType',
				key: 'codeType',
				width: '250px',
				sorter: (a, b) => a.codeType.length - b.codeType.length,
			}, {
				title: '数据值',
				dataIndex: 'codeValue',
				key: 'codeValue',
				width: '150px',
				sorter: (a, b) => a.codeValue.length - b.codeValue.length,
			}, {
				title: '名称',
				dataIndex: 'codeName',
				key: 'codeName',
				width: '200px',
				sorter: (a, b) => a.codeName.length - b.codeName.length,
			}, {
				title: '描述',
				dataIndex: 'codeDesc',
				key: 'codeDesc',
				width: '250px',
				sorter: (a, b) => a.codeDesc.length - b.codeDesc.length,
			}, {
				title: '状态',
				dataIndex: 'state',
				key: 'state',
				width: '80px',
				render: (text) => {
					if (text == 'U') {
						return '[U] 正常';
					} else if (text == 'E') {
						return '[E] 禁用';
					} else {
						return '未知';
					}
				},
				onFilter: (value, record) => record.state.indexOf(value) === 0,
				filters: [
					{
						text: '[U] 正常',
						value: 'U',
					}, {
						text: '[E] 禁用',
						value: 'E',
					}],
			}, {
				title: '',
				key: 'operation',
			},
		];

		return (
			<div>

				<Row>
					<Col span={16} >
						<StaticDataSearchForm handleQuery={this.handleQuery} />
					</Col>
					<Col style={{ textAlign: 'right' }} >
						<Button type="primary" icon="edit" onClick={this.handleEdit} disabled={!hasSelected} >修改</Button>&nbsp;&nbsp;
						<Button type="primary" icon="delete" onClick={this.handleDelete} disabled={!hasSelected} >删除</Button>&nbsp;&nbsp;
						<Button type="primary" icon="plus" onClick={this.handleAdd} >新增</Button>
					</Col>
				</Row>
				<Row>
					<Col span={24} >&nbsp;</Col>
				</Row>
				<Row>
					<Col span={24} >
						<Table
							rowSelection={rowSelection}
							columns={columns}
							rowKey={record => record.codeType +
							record.codeValue}
							dataSource={staticDataList}
							pagination={this.pagination(staticDataList)}
							onRowClick={this.handleRowClk}
						/>
					</Col>
				</Row>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { actionType, rspInfo } = state.get('RootService').toObject();
	const { staticDataList, refreshData, currentPage } = state.get(
		'StaticDataaAdminService').toObject();

	return {
		staticDataList: staticDataList ? staticDataList : [],
		rspInfo,
		refreshData,
		currentPage,
		actionType,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryStaticDataLike,
			initEditStaticData,
			dealStaticData,
			qryStaticDataById,
			initAStaticDataForAdd,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(StaticDataAdmin);
