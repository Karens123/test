'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Button, Col, Form, Icon, Input, Row,Tabs, Select,Modal,Checkbox,Pagination } from 'antd';
import * as MsgUtil from 'utils/MsgUtil';
import * as businessRoute from 'business/route';
import ProdDeatill from 'business/dreamworks/widget/prodDetails';
import { statusNumToClass,statusNumToText,chipNumToText,worksTypeNumToText,contractTypeNumToClass } from 'utils/MappingUtil';
import DialogBox from 'business/dreamworks/demandadmin/dialogbox';
import {
	qryDemandDetail
} from 'action';

import './index.less';

class IncomeDemandDetails extends React.Component {
	//检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		allDemandList: PropTypes.object.isRequired,
		contractMsgList: PropTypes.object.isRequired,
		route: PropTypes.object.isRequired,
		routeParams: PropTypes.string,
		actions: PropTypes.object.isRequired,
		params: PropTypes.object.isRequired,
		actionType: PropTypes.string.isRequired,
		demandDetail: PropTypes.object.isRequired,
	};
	static defaultProps = {
		allDemandList: {},
		contractMsgList: {},
		currentPage: '1',
		routeParams: ''
	};
	constructor (props) {
		super(props);
		const { route } = props;
		if (!route) {
			this.context.router.replace(businessRoute.income);
		} else {
			this.state = {
				visible: false,
				DemandDetailsId: this.props.routeParams.entityId,
				currentPage: 1,
				showModal: false,
				showData: {},
				modalType: undefined,
				failTextarea: undefined,
				failReason: [],
				ifSendSms: 0,
				operType: undefined,
				entityId: undefined,
				auditResult: undefined,
				entityType: 3,
				currentItme: '',
				zoomSrc: '',
				zoomClass: 'hidden',
				imgModalVisible: false,
				deviceType: this.props.routeParams.dataType
			};
		}
	}
	componentWillMount () {
		this.qryTable();
	}


	componentDidMount () {
	}
	componentWillReceiveProps (nextProps) {
		const { actionType } = nextProps;
		const { params } = this.props;
		if (actionType==='AUDIT_DSN_WORK_SUCCESS'){
			const { params } = this.props;
			MsgUtil.showwarning('操作成功');
			this.context.router.replace(`${businessRoute.alldemandAdmin}${params.page?`/${params.page}`:''}`);
		}
	};

	shouldComponentUpdate (nextProps, nextState) {
		const isRender =  nextState.showModal !== this.state.showModal
			|| nextState.currentItme !== this.props.allDemandList
			|| nextState.showModal !== this.state.showModal;
		return isRender;
	}


	componentWillUnmount(){
		const { actions } = this.props;
		actions.clearCurrentData();
	}


	qryTable = () => {
		const { DemandDetailsId } = this.state;
		const { actions } = this.props;
		actions.qryDemandDetail(DemandDetailsId);
	};

	paginationController = (num) => {
		this.setState({
			currentPage: num
		}, () => {
			this.qryTable();
		});
	};
	showModal = () => {
		this.setState({
			showModal: true,
		});
	};
	hideModal = () => {
		this.setState({
			showModal: false,
		});
	};
	//通过，不通过按钮
	passHandler = () => {
		this.setState({
			modalType: 1,
			operType: 6,
			ifSendSms: 0,
		},() => {
			this.showModal();
		});

	};
	failHandler = () => {
		this.setState({
			modalType: 0,
			operType: 7,
			ifSendSms: 0,
		},() => {
			this.showModal();
		});
	};
	//失败原因控制器
	failCheckboxHandler = (e) => {
		this.setState({
			failReason: e
		});
	};
	failTextareaHandler = (e) => {
		this.setState({
			failTextarea: e.target.value
		});
	};
	//短信发送按钮
	sendSms = (e) => {
		const { ifSendSms } = this.state;
		this.setState({
			ifSendSms: ifSendSms===0?1:0
		});
	};

	failSubmit = (e) => {
		const { actions } = this.props;
		const { failTextarea,failReason,ifSendSms } = this.state;
		const auditResult =(failTextarea && failTextarea.length)?this.failResultHelper([ ...failReason, failTextarea]):this.failResultHelper(failReason);

		if (auditResult && auditResult.length){
			this.setState({
				auditResult: (failTextarea && failTextarea.length)?this.failResultHelper([ ...failReason, failTextarea]):this.failResultHelper(failReason)
			},() => {
				const { operType,entityType,auditResult,ifSendSms } = this.state;
				const { allDemandList } = this.props;
				const entityId=allDemandList.record.demandId;
				actions.auditDSNWork({ operType,entityType,entityId,auditResult,ifSendSms });
			});
			this.hideModal();
		} else {
			MsgUtil.showwarning('需要选择/填写不通过原因');
		}
	};
	//用换行符和序号链接错误提示信息
	failResultHelper = (arr) => {
		let ret='';
		for (let i=1,len=arr.length;i<=len;i++){
			ret += `${i}. ${arr[i-1]}`;
			if (i<len){
				ret+='\n';
			}
		}
		return ret;
	};

	zoomPic = (src) => {
		this.setState({
			zoomClass: 'hasZomm',
			zoomSrc: src
		}, () => {
		});
	};
	okSubmit = (e) => {
		const { actions } = this.props;
		this.setState({
			auditResult: ''
		},() => {
			const { operType,entityType,auditResult,ifSendSms } = this.state;
			const { allDemandList } = this.props;
			const entityId=allDemandList.record.demandId;
			actions.auditDSNWork({ operType,entityType,entityId,auditResult,ifSendSms });
		});
		this.hideModal();
	};
	hideModalPic = () => {
		this.setState({
			zoomClass: 'hidden',
			zoomSrc: ' '
		});
	};

	worksType = (num) => {
		switch (num){
			case 1:{
				return '戒指';
			}
			case 2:{
				return '手串';
			}
			case 3:{
				return '项链';
			}
			case 4:{
				return '手链';
			}
			case 5:{
				return '手镯';
			}

		}
	};

	handleClearCurrentData = (e) => {
		e.preventDefault();
		const { router } = this.context;
		router.push(`${businessRoute.income}`);
	};

	renderImg = (width, height,src,coefficient  = 0.7) => {
		// const ks = width / height;
		const img = new Image();
		img.src=src;
		const wi = img.naturalWidth,
			hi = img.naturalHeight;
		const kw = wi / width,
			kh = hi / height;
		let afterHeight;
		let afterWidth;
		if (coefficient > 1) {
			coefficient = 1;
		} else if (coefficient < 0) {
			coefficient = 1;
		}
		if (kh < kw) {
			afterHeight = (height * coefficient * kh) / kw;
			afterWidth = width * coefficient;
		} else {
			afterHeight = height * coefficient;
			afterWidth = (width * coefficient * kw) / kh;
		}

		return (
			<div
				style={{
					width: afterWidth,
					height: afterHeight,
					top: (height - afterHeight) / 2,
					left: (width - afterWidth) / 2,
					position: 'absolute',
				}}
			>
				<img src={src} alt="" style={{ width: '100%',height: 'auto' }} />
			</div>
		);
	};


	renderDesHeader = (baseInfo,defautImg) => {
		return (
			<div style={{ display: 'flex',flexDirection: 'column',justifyContent: 'center',alignItems: 'center' }}>
				<img
					style={{ width: '100px',height: '100px',borderRadius: '50%' }}
					src={defautImg}
					alt=""
					onClick={() => this.zoomPic(defautImg)}
				/>
				<p>{baseInfo && baseInfo.publisher ? baseInfo.publisher.nick : ''}</p>
			</div>
		);
	};

	renderForm = (deviceType,WorksFullInfo,allDemandList,defautImg,buyLink,contractMsgList) => {
		if (!allDemandList && !allDemandList.record) {
			return;
		}
		const baseInfo={ ...allDemandList.record };
		if (baseInfo.publisher) {
			defautImg=baseInfo.publisher.headImage;
		}

		const defaultHeadImg= 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png';
		const DemandDetails={
			Details: {
				shape: baseInfo && baseInfo.chip ? chipNumToText(baseInfo.chip): '',
				type: baseInfo && baseInfo.type ? worksTypeNumToText(baseInfo.type): '',
				longTime: baseInfo && baseInfo.timeLimit ? baseInfo.timeLimit: '',
				name: baseInfo && baseInfo.productName ? baseInfo.productName: '' ,
				totailPrice: baseInfo && baseInfo.reward ? (baseInfo.reward/100).toFixed(2): '' ,
				size: '15*15'
			},
			ProdInfr: baseInfo && baseInfo.designerDesc ? baseInfo.designerDesc: '' ,
			imgSrc: (( () => {
				let strImg='';
				if (baseInfo && baseInfo.picList ) {
					if (baseInfo.picList >1 ){
						strImg=baseInfo.picList.map((item) => {
							return (
								<p>{item.image}</p>
							);
						});
					} else {
						strImg=baseInfo.picList[0] && baseInfo.picList[0].image ? baseInfo.picList[0].image : defaultHeadImg;
					}
				}
				return strImg;
			})())
		};
		 	return (<div className="demandForm">
			<br /><br />
			<Col span={24}>
				{this.renderDesHeader(baseInfo,defautImg)}
				<hr />
				<ProdDeatill ProdDemandDetails={DemandDetails} />
			</Col>
			<Col span={24} style={{ height: '55px' }}>&nbsp;</Col>

		</div>
			);
	};

	render () {
		const { allDemandList,contractMsgList,demandDetail } = this.props;
		const  WorksFullInfo={ ...allDemandList.record };
		const { zoomSrc,deviceType } = this.state;
		let buyLink='';
		if (!WorksFullInfo.buyLinks){
			buyLink='暂无链接';
		} else {
			buyLink=WorksFullInfo.buyLinks;
		}
		// console.log('testing',params.prepage?`/${params.prepage}`:'');
		const defautImg='http://test-img-server.oss-cn-shenzhen.aliyuncs.com/default/headpic.png';
		const screenWidth = document.body.offsetWidth,
			  screenHeight = document.body.offsetHeight;
		return (
			<div className="workDetails">

				<div className={this.state.zoomClass} onClick={this.hideModalPic}>
					{this.renderImg(screenWidth,screenHeight,zoomSrc)}
				</div>
				<Form>
					<Row gutter={20}>
						{this.renderForm(deviceType,WorksFullInfo,allDemandList,defautImg,buyLink,contractMsgList)}
					</Row>
				</Form>
			</div>
		);

	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { allDemandList,contractMsgList,demandDetail  } = state.get('DemandAdminReducer').toObject();
	console.log('allDemandList_______________3',demandDetail);

	return {
		rspInfo,
		actionType,
		allDemandList,
		contractMsgList,
		demandDetail
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryDemandDetail,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(IncomeDemandDetails));