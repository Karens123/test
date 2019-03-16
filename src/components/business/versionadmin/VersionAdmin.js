'use strict';

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Row, Table } from 'antd';
import * as MsgUtil from 'utils/MsgUtil';
import * as Constant from 'utils/Constant';
import * as businessRoute from 'business/route';
import { DEAL_VERSION, QRY_VERSION_BY_FORM, qryVersion } from 'action';
import VersionSearchForm, { versionSearchFormCacheKey } from './VersionSearchForm';

class VersionAdmin extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		versionInfoList: PropTypes.array,
		currentVersion: PropTypes.object,
		actionType: PropTypes.string.isRequired,
		rspInfo: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		params: PropTypes.object,
	};

	static defaultProps = {
		versionInfoList: [],
		currentVersion: undefined,
		params: {},
	};

	constructor (props) {
		super(props);
		const { currentVersion } = props;
		if (currentVersion) {
			this.state = {
				selectedRowKeys: currentVersion.recId
					? [currentVersion.recId]
					: [],
				currentPage: 1,       //当前选中的分页
			};
		} else {
			this.state = {
				selectedRowKeys: [],
				currentPage: 1,       //当前选中的分页
			};
		}
	};

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
				if (`${QRY_VERSION_BY_FORM}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询版本信息列表失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${DEAL_VERSION}_SUCCESS` === actionType) {
					isRefresh = true;
				}
				if (isRefresh) {
					this.handleQuery();
				}
			}
		}
		const { params } =this.props;
		const { page } =params;
		console.log('current page is: ',page);
	};

	//radio选择变更事件处理
	onRadioSelectChange = (selectedRowKeys) => {
		this.setState({ selectedRowKeys });
	};

	//[查询] 按钮
	handleQuery = (qryVersionFrom) => {
		const { actions } = this.props;
		const { currentPage } = this.state;
		if (!qryVersionFrom) {
			qryVersionFrom = JSON.parse(
				localStorage.getItem(versionSearchFormCacheKey));
		}
		if (!qryVersionFrom) {
			qryVersionFrom = {};
		}
		this.setState({ currentPage: 1 },() => {
			actions.qryVersion(qryVersionFrom);
		});
	};

	//Table行选择事件
	handleRowClk = (selectID) => {
		this.setState({ selectedRowKeys: [selectID.recId] });
	};
	//[新增] 按钮
	handleAdd = () => {
		const { currentPage } =this.state;
		this.context.router.replace(`${businessRoute.VersionEdit}/${currentPage}`);
	};

	//[修改] 按钮
	handleEdit = () => {
		const { currentPage } =this.state;
		const select = this.state.selectedRowKeys;
		if (select && select[0]) {
			this.context.router.replace(
				`${businessRoute.VersionEdit}/${currentPage}/${select[0]}`);
		} else {
			MsgUtil.showwarning('请选择一条需要修改的数据');
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

	remarkRender = (text, record, index) => {
		const firmwareNode = () => {
			if (record.type === 4) {
				let deviceType = record.deviceType;
				if (deviceType == '1') {
					deviceType = '1-戒指';
				} else if (deviceType == '2') {
					deviceType = '2-手串';
				} else if (deviceType == '3') {
					deviceType = '3-项链';
				} else if (deviceType == '4') {
					deviceType = '4-手链';
				} else {
					deviceType = '未知';
				}

				let mboardType = record.mboardType;
				if (mboardType == '1') {
					mboardType = '1-椭圆';
				} else if (mboardType == '2') {
					mboardType = '2-方型';
				} else {
					mboardType = '未知';
				}

				return (
					<Row>
						<Row>app版本：{record.appVersion}</Row>
						<Row>固件厂商：{record.factory}</Row>
						<Row>固件设备类型：{deviceType}</Row>
						<Row>固件主板类型：{mboardType}</Row>
					</Row>

				);
			}
		};
		return (
			<Row>
				<Row>语言：{record.language}</Row>
				<Row>国家：{record.country}</Row>
				{firmwareNode()}
			</Row>
		);
	};

	render () {
		const { versionInfoList } = this.props;
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
				title: '版本编码',
				dataIndex: 'versionCode',
				key: 'versionCode',
				width: '150px',
			}, {
				title: '版本名称',
				dataIndex: 'versionName',
				key: 'versionName',
				width: '150px',
			}, {
				title: '是否强制',
				dataIndex: 'forceUp',
				key: 'forceUp',
				width: '140px',
				render: (text) => {
					if (text == '0') {
						return '0-否';
					} else if (text == '1') {
						return '1-是';
					} else {
						return '未知';
					}
				},
			}, {
				title: '版本类型',
				dataIndex: 'type',
				key: 'type',
				width: '140px',
				render: (text) => {
					if (text === 0) {
						return '0-IOS';
					} else if (text === 1) {
						return '1-Android';
					} else if (text === 2) {
						return '2-WEB';
					} else if (text === 4) {
						return '4-固件';
					} else {
						return '未知';
					}
				},
			}, {
				title: '备注',
				dataIndex: 'language',
				key: 'language',
				width: '250px',
				render: this.remarkRender,
			}, {
				title: '描述',
				dataIndex: 'description',
				key: 'description',
				width: '200px',
			},
		];
		return (
			<div>
				<Row>
					<Col span={18} >
						<VersionSearchForm hasSelected={hasSelected} handleQuery={this.handleQuery} />
					</Col>
					<Col style={{ textAlign: 'right' }} >
						<Button type="primary" icon="edit" onClick={this.handleEdit} disabled={!hasSelected} >修改</Button>&nbsp;&nbsp;
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
							expandedRowRender={record =>
								<p>下载地址：
									<Link href={record.downloadAddr} >{record.downloadAddr}</Link>
								</p>
							}
							columns={columns}
							rowKey={record => record.recId}
							dataSource={versionInfoList}
							pagination={this.pagination(versionInfoList)}
							onRowClick={this.handleRowClk}
						/>
					</Col>
				</Row>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType, } = state.get('RootService').toObject();
	const { versionInfoList, currentVersion } = state.get('versionAdmin').
		toObject();
	return {
		versionInfoList,
		rspInfo,
		actionType,
		currentVersion,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({ qryVersion }, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(VersionAdmin);
