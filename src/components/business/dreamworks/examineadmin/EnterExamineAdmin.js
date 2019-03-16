'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Button, Col, Modal, Row, Table,Tabs } from 'antd';
import * as MsgUtil from 'utils/MsgUtil';
import * as businessRoute from 'business/route';
import { qryAllBusinessesForm,qryDemandForm } from 'action';
import WorksForm from './WorksForm';
import DemandForm from './DemandForm';
import AllBusinessesSearchForm, { AllBusinessesSearchFormCacheKey }  from './AllBusinessesSearchForm';

const TabPane = Tabs.TabPane;

class EnterExamineAdmin extends React.Component {
	//检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
		WorksInfoList: PropTypes.array.isRequired,
		totalCount: PropTypes.number.isRequired,
		params: PropTypes.object,
	};

	static defaultProps = {
		WorksInfoList: [],
		params: {},
	};
	constructor (props) {
		super(props);
		const { WorksInfoList } = props;
		this.state = {
			selectedRowKeys: (WorksInfoList && WorksInfoList.worksId) ? [WorksInfoList.worksId] : [],
			currentPage: 1,
			currentDemandPage: 1,
			selectValue: '',
			DeviceType: '',
			showDataType: '1',
		};
	}
	componentWillMount () {
		// this.handleQuery();
		// this.handleDemandQuery();
		const { params,actions } =this.props;
		const { page,dataType } = params;

		if (page){
			switch (dataType){
				case '1':{
					this.setState({
						currentPage: 1,
						currentDemandPage: parseInt(page),
						showDataType: dataType,
					}, () => {
						this.qryTable();
					});
					break;
				}
				case '2':{
					this.setState({
						currentPage: parseInt(page),
						currentDemandPage: 1,
						showDataType: dataType,
					},() => {
						this.qryTable();
					});
					break;
				}
			}
		} else {
			this.qryTable();
		}

	}
	shouldComponentUpdate (nextProps, nextState) {
		const isRender = nextProps.selectedRowKeys !== this.state.selectedRowKeys;
		return isRender;
	}

	//查询新作品
	handleQuery = (currentPage, pageSize,qryForm={}) => {

		const { actions } = this.props;
		this.setState({
			selectValue: qryForm
		});

		if (currentPage>1) {
			this.setState({
				currentPage
			});
		} else {
			this.setState({
				currentPage: 1,
			});
		}
		actions.qryAllBusinessesForm(currentPage, pageSize,qryForm);
	};


//查询新新需求
	handleDemandQuery = (currentDemandPage, pageSize,qryForm={}) => {
		const { actions } = this.props;
		this.setState({
			selectValue: qryForm
		});

		if (currentDemandPage>1) {
			this.setState({
				currentDemandPage
			});
		} else {
			this.setState({
				currentDemandPage: 1,
			});
		}

		console.log('qryForm_____www________________', qryForm);

		//设计师需求列表
		actions.qryDemandForm(currentDemandPage, pageSize,qryForm);
	};

	showDataTypeHandler = (key) => {
		this.setState({
			showDataType: key,
		}, () => {
			console.log('going to qry');
			this.qryTable();
		});
	};

	//控制查询
	qryTable = () => {
		const { params,actions } =this.props;
		// const { page,dataType } = params;
		const { showDataType,selectValue } =this.state;
		const { currentPage,currentDemandPage } = this.state;
		if (selectValue =='') {
			switch (showDataType){
				case '1':{
					actions.qryDemandForm(currentDemandPage);
					break;
				}
				case '2':{
					actions.qryAllBusinessesForm(currentPage);
					break;
				}
				default: {
					console.log('showDataType',showDataType);
				}
			}
		}
	};

	//查看详细
	handleCheck = (selectID,deviceType) => {
		const { router } = this.context;
		const { currentPage,currentDemandPage } =this.state;
		if (deviceType == 1) {
			if (selectID) {
				router.replace(`${businessRoute.QryDemand}/${selectID}/${currentDemandPage}/1`);
			}
		} else {
			if (selectID) {
				router.replace(`${businessRoute.WorksDetails}/${selectID}/${currentPage}/2`);
			}
		}

	};

	pageChangeHandler = (key) => {
		return (val) => {
			console.log(key,val);
			this.setState({
				[key]: val
			},() => {
				this.qryTable();
			});

		};
	};

	pageChangeDemandHandler = (key) => {
		return (val) => {
			this.setState({
				[key]: val
			},() => {
				this.qryTable();
			});

		};
	};

	handDeviceType = (DeviceType) => {
		this.setState({
			DeviceType
		});
	};
	tabIndex = (DeviceType) => {
		this.setState({
			DeviceType
		});
	};
	render () {
		const { selectedRowKeys,currentPage,currentDemandPage,selectValue } = this.state;
		const { totalCount,params } = this.props;
		const hasSelected = selectedRowKeys && selectedRowKeys.length > 0;
		return (
			<div className="admin-main">
				<h3 style={{ fontSize: '36px', marginBottom: '20px' }}>工作台审核 / Workbench</h3>
				<Row>
					<div className="filter">

						{this.state.DeviceType==1 ? (<AllBusinessesSearchForm
							handleDemandQuery={this.handleDemandQuery}
							DeviceType={this.state.DeviceType}
						/>) :(<AllBusinessesSearchForm
							handleQuery={this.handleQuery}
							DeviceType={this.state.DeviceType}
						/>) }

					</div>
				</Row>
				<Tabs  defaultActiveKey={params.dataType?params.dataType:'1'} onTabClick={this.tabIndex}  onChange={this.showDataTypeHandler}>
					<TabPane tab="新需求审核" key="1"  >
						<DemandForm
							deviceType="1"
							type="1"
							handleDemandQuery={this.handleDemandQuery}
							currentDemand={currentDemandPage}
							selectValue={this.state.selectValue}
							pageDemandHandler={this.pageChangeDemandHandler('currentDemandPage')}
							handleCheck={this.handleCheck}
							handDeviceType={this.handDeviceType}

						/>
					</TabPane>
					<TabPane tab="新作品审核" key="2" >
						<WorksForm
							deviceType="2"
							type="1"
							handleQuery={this.handleQuery}
							current={currentPage}
							selectValue={this.state.selectValue}
							pageHandler={this.pageChangeHandler('currentPage')}
							handleCheck={this.handleCheck}
							handDeviceType={this.handDeviceType}
						/>
					</TabPane>
				</Tabs>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { WorksInfoList,totalCount  } = state.get('EnterExamineReducer').toObject();
	return {
		rspInfo,
		actionType,
		WorksInfoList,
		totalCount
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({ qryAllBusinessesForm,qryDemandForm }, dispatch),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(EnterExamineAdmin);
