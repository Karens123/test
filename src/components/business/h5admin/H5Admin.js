'use strict';

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Row, Table } from 'antd';

import * as MsgUtil from 'utils/MsgUtil';
import * as Constant from 'utils/Constant';
import * as businessRoute from 'business/route';

import {
	dealStaticData,
	initAStaticDataForAdd,
	initEditStaticData,
	QRY_H5_BY_FORM,
	qryStaticDataById,
	qryStaticDataLike,
} from 'action';
import H5SearchForm, { H5SearchFormCacheKey } from './H5SearchForm.js';

class H5Admin extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		staticDataList: PropTypes.array,
		currentPage: PropTypes.number.isRequired,
		actionType: PropTypes.string.isRequired,
		actions: PropTypes.object.isRequired,
		rspInfo: PropTypes.object.isRequired,
	};

	static defaultProps = {
		staticDataList: [],
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
	}

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				const isRefresh = false;
				if (`${QRY_H5_BY_FORM}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
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
			qryForm = JSON.parse(localStorage.getItem(H5SearchFormCacheKey));
		}
		if (!qryForm) {
			qryForm = {};
		}
		if (!qryForm.codeValue) {
			qryForm.codeValue = 'h5';
		}
		actions.qryStaticDataLike(qryForm);
	};

	//[修改] 按钮
	handleEdit = () => {
		const { staticDataList } = this.props;
		const { selectedRowKeys } = this.state;

		let currentStaticData;
		staticDataList.forEach((item) => {
			if (item.codeType + item.codeValue == selectedRowKeys) {
				currentStaticData = item;
			}
		});

		if (currentStaticData) {
			this.context.router.replace(`${businessRoute.H5Edit}/${currentStaticData.codeType}`);
		} else {
			MsgUtil.showwarning('请选择需修改的H5页面配置');
		}
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

	handleLink = (text, argument) => {};

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
				width: 200,
			}, {
				title: '数据值',
				dataIndex: 'codeName',
				key: 'codeName',
				width: 400,
				render: text =>
					<Link to={text} onClick={this.handleLink} > {text} </Link >,
			}, {
				title: '简述',
				dataIndex: 'codeDesc',
				key: 'codeDesc',
				width: 250,
			}, {
				title: '状态',
				dataIndex: 'state',
				key: 'state',
				width: 80,
				render: (text) => {
					if (text == 'U') {
						return '[U] 正常';
					} else if (text == 'E') {
						return '[E] 禁用';
					} else {
						return '未知';
					}
				},
			},
		];

		return (
			<div>

				<Row>
					<Col span={16} >
						<H5SearchForm handleQuery={this.handleQuery} />
					</Col>
					<Col style={{ textAlign: 'right' }} >
						<Button type="primary" icon="edit" onClick={this.handleEdit} disabled={!hasSelected} >修改</Button>
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
		'H5AdminService').toObject();
	return { staticDataList, rspInfo, refreshData, currentPage, actionType };
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

export default connect(mapStateToProps, mapDispatchToProps)(H5Admin);
