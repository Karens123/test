'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { Badge, Button, Col, Modal, Row, Table } from 'antd';

import * as MsgUtil from 'utils/MsgUtil';
import * as Constant from 'utils/Constant';
import * as businessRoute from 'business/route';

import {
	DEAL_OPINION,
	DELETE_OPINION,
	deleteAdviceInfo,
	QRY_OPINION_BY_FORM,
	QRY_USER_ADVICE_PIC_BY_ADVICE_REC_ID,
	qryOpinionByForm,
	qryOpinionImgByAdviceRecId,
} from 'action';
import OpinionSearchForm from './OpinionSearchForm';

class OpinionAdmin extends React.Component {
    //检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static propTypes = {
		currentAdviceInfo: PropTypes.object,
		currentAdviceInfoPic: PropTypes.object,
		adviceInfoList: PropTypes.array,
		adviceInfoPicList: PropTypes.array,
		actionType: PropTypes.string.isRequired,
		rspInfo: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		params: PropTypes.object,
	};
	static defaultProps = {
		adviceInfoList: [],
		adviceInfoPicList: [],
		currentAdviceInfo: undefined,
		currentAdviceInfoPic: undefined,
		params: {},
	};

	constructor (props) {
		super(props);
		const { currentAdviceInfo, currentAdviceInfoPic } = props;

		console.log('currentAdviceInfoPic_____________________', currentAdviceInfoPic);
		console.log('currentAdviceInfo_____________________', currentAdviceInfo);


		if (currentAdviceInfoPic) {
			this.state = {
				selectedRowKeys: [currentAdviceInfoPic.adviceRecId],
				selectedImgRowKeys: currentAdviceInfoPic.picRecId
					? [currentAdviceInfoPic.picRecId]
					: [],
				currentPage: 1,       //当前选中的分页
			};
		} else if (currentAdviceInfo) {
			this.state = {
				selectedRowKeys: currentAdviceInfo.recId
					? [currentAdviceInfo.recId]
					: [],
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
		const { actions } = this.props;
		this.handleQuery();
		if (this.state.selectedRowKeys[0]) {
			actions.qryOpinionImgByAdviceRecId(this.state.selectedRowKeys[0]);
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
				if (`${QRY_OPINION_BY_FORM}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询意见列表失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${QRY_USER_ADVICE_PIC_BY_ADVICE_REC_ID}_SUCCESS` ===
					actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询意见图片列表失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${DELETE_OPINION}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`删除意见失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					} else {
						isRefresh = true;
					}
				} else if (`${DEAL_OPINION}_SUCCESS` === actionType) {
					isRefresh = true;
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
		const select = selectedRowKeys;
		if (select && select[0]) {
			const { actions } = this.props;
			actions.qryOpinionImgByAdviceRecId(select[0]);
		}
	};

	//pic选择
	onRadioImgSelectChange = (selectedImgRowKeys) => {
		this.setState({ selectedImgRowKeys });
	};

	//Table行选择事件
	handleRowClk = (records) => {
		console.log('records', records);
		this.setState({
			selectedRowKeys: [records.recId],
		});
	};

	//[查询] 按钮
	handleQuery = (qryForm) => {
		const { actions } = this.props;
		// if (!qryForm) {
		//     qryForm = JSON.parse(localStorage.getItem(OpinionSearchFormCacheKey));
		// }
		if (!qryForm) {
			const currentDate = new Date();
			const currentDateTime = moment(
				`${moment(currentDate).format('YYYYMMDD')}235959`,
				'YYYYMMDDhhmmss').toDate().getTime();
			const last7DayTime = moment(
				moment(currentDate).subtract(7, 'days').format('YYYYMMDD'),
				'YYYYMMDDhhmmss').toDate().getTime();
			qryForm = {
				beginTime: last7DayTime,
				endTime: currentDateTime,
				qryBean: {},
			};
		}
		this.setState({
			currentPage: 1
		},() => {
			actions.qryOpinionByForm(qryForm);
		});

	};

	//[修改] 按钮
	handleEdit = () => {
		const select = this.state.selectedRowKeys;
		const { currentPage } = this.state;
		if (select) {
			this.context.router.replace(
				`${businessRoute.OpinionAdminEdit}/${currentPage}/${select}`);
		} else {
			MsgUtil.showwarning('请选择一条意见记录!');
		}
	};

	//[删除] 按钮
	handleDelete = () => {
		const { selectedRowKeys } = this.state;
		const { actions } = this.props;//注：获取所有对象
		if (selectedRowKeys) {
			for (const i in selectedRowKeys) {
				adviceInfoList.push({ recId: selectedRowKeys[i] });
			}
			Modal.confirm({
				title: `确定要删除意见记录[${selectedRowKeys}] 吗?`,
				content: '',
				onOk() {
					actions.deleteAdviceInfo(adviceInfoList);
				},
				onCancel() {
				},
			});
		} else {
			MsgUtil.showwarning('请选择需要删除的意见记录');
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
		const { adviceInfoList, adviceInfoPicList } = this.props;

		const { selectedRowKeys } = this.state;
		const rowSelection = {
			type: 'radio',
			onChange: this.onRadioSelectChange,
			selectedRowKeys,
		};

		const hasSelected = selectedRowKeys && selectedRowKeys.length > 0;

		const columns = [
			{
				title: '意见记录ID',
				dataIndex: 'recId',
				key: 'recId',
				width: 260,
			}, {
				title: '意见信息',
				dataIndex: 'adviceInfo',
				key: 'adviceInfo',
				width: 150,
			}, {
				title: '反馈日志',
				dataIndex: 'logfile',
				key: 'logfile',
				width: 150,
				render: text => text &&
				<a href={text} rel="noopener noreferrer" >下载</a>,
			}, {
				title: '反馈时间',
				dataIndex: 'adviceTime',
				key: 'adviceTime',
				width: 260,
				render: (text) => {
					if (text) {
						return moment(text).format('YYYY-MM-DD HH:mm:ss');
					}
				},
				sorter: (a, b) => {
					return a.adviceTime - b.adviceTime;
				},
			}, {
				title: '处理状态',
				dataIndex: 'dealSts',
				key: 'dealSts',
				width: 150,
				render: (text) => {
					switch (text) {
						case 0: {
							return '待处理';
						}
						case 1: {
							return '已阅';
						}
						case 2: {
							return '已处理';
						}
						default: {
							return '';
						}
					}
				},
			}, {
				title: '处理人',
				dataIndex: 'dealPerson',
				key: 'dealPerson',
				width: 150,
			}, {
				title: '处理时间',
				dataIndex: 'dealTime',
				key: 'dealTime',
				width: 240,
				render: (text) => {
					if (text) {
						return moment(text).format('YYYY-MM-DD hh:mm:ss');
					}
				},
			}, {
				title: '处理结果',
				dataIndex: 'dealResult',
				key: 'dealResult',
				width: 200,
			}];

		const ImgColumns = [
			{
				title: '图片记录ID',
				dataIndex: 'picRecId',
				key: 'picRecId',
				width: 260,
			}, {
				title: '图片',
				dataIndex: 'image',
				key: 'image',
				render: (text, advicePicInfo) => (
					<a href={advicePicInfo.image} target="_blank" rel="noopener noreferrer" >
						<Badge><img src={advicePicInfo.image} width="70" alt={advicePicInfo.picRecId} /></Badge>
						<Badge dot ><span>点击放大</span></Badge>
					</a>),
			}];

		return (
			<div>
				<Row>
					<Col span={14} >
						<OpinionSearchForm handleQuery={this.handleQuery} />
					</Col>
					<Col style={{ textAlign: 'right' }} >
						<Button type="primary" icon="edit" onClick={this.handleEdit} disabled={!hasSelected} >修改</Button>
					</Col>
				</Row>
				<Row
					style={{
						color: '#2db7f5',
						display: 'none',
					}}
				>注：默认为7天的统计(如：2016/11/07~2016/11/17),最长查询周期为90天</Row>
				<Row>&nbsp;
				</Row>
				<Row>
					<Col>
						<Table
							expandedRowRender={
								record => <p>反馈内容：{record.adviceInfo}</p>
							}
							rowSelection={rowSelection}
							columns={columns}
							rowKey={record => record.recId}
							dataSource={adviceInfoList}
							onRowClick={this.handleRowClk}
							pagination={this.pagination(adviceInfoList)}
						/>
					</Col>
				</Row>
				<Row>
					<Col span={24} > &nbsp;&nbsp;</Col>
				</Row> <br /> <br /> <br /> <br />
				<Row>
					<Col span={24} >&nbsp;&nbsp; </Col>
				</Row>
				<Row>
					<Col span={28} className="fr" >
						<Table
							columns={ImgColumns}
							rowKey={record => record.picRecId}
							dataSource={adviceInfoPicList}
							pagination={this.pagination(adviceInfoPicList)}
						/>
					</Col>
				</Row>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { adviceInfoList, adviceInfoPicList, currentAdviceInfo, currentAdviceInfoPic } = state.get(
		'OpinionService').toObject();
	return {
		adviceInfoList,
		rspInfo,
		adviceInfoPicList,
		actionType,
		currentAdviceInfo,
		currentAdviceInfoPic,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators(
			{ qryOpinionByForm, deleteAdviceInfo, qryOpinionImgByAdviceRecId },
			dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(OpinionAdmin);
