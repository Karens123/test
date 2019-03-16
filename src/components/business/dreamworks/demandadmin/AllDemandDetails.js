'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router';
import { Button, Col, Form, Icon, Input, Row,Tabs, Select,Modal,Checkbox,Pagination } from 'antd';
import * as MsgUtil from 'utils/MsgUtil';
import * as businessRoute from 'business/route';
import ProdDeatill from 'business/dreamworks/widget/prodDetails';
import { statusNumToClass,statusNumToText,chipNumToText,worksTypeNumToText,contractTypeNumToClass } from 'utils/MappingUtil';
import DialogBox from 'business/dreamworks/demandadmin/dialogbox';
import ZoomImage from 'business/dreamworks/widget/zoomimage';
import {
	qryEnterpriseDemand,
	qryPendingAudit,
	qryDemandDetail,
	auditDSNWork,
	clearCurrentData,
	contractMsg,
	reMinderBuinessConfirms,
	confirmComplete,
	BUINESS_CONFIRM_COMPLETE,
	RE_MINDER_BUINESS_CONFIRMS
} from 'action';

import './index.less';

const confirm = Modal.confirm;


class AllDemandDetails extends React.Component {
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
		totalCount: PropTypes.number.isRequired,

	};
	static defaultProps = {
		allDemandList: {},
		contractMsgList: {},
		currentPage: '1',
		pageSize: 10,
		total: 20,
		routeParams: ''
	};
	constructor (props) {
		super(props);
		const { route } = props;
		if (!route) {
			this.context.router.replace(businessRoute.EnterExamineAdmin);
		} else {
			this.state = {
				visible: false,
				DemandDetailsId: this.props.routeParams.demandId,
				currentPage: 1,
				total: 10,
				pageSize: 10,
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
				deviceType: this.props.routeParams.dataType,
				zoomImageSrc: '',
				showZoomImage: false,
			};
		}
	}
	componentWillMount () {
		const { DemandDetailsId } = this.state;
		const { actions } = this.props;
		actions.qryDemandDetail(DemandDetailsId);
		// actions.contractMsg(DemandDetailsId);
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
		} else if (`${BUINESS_CONFIRM_COMPLETE}_SUCCESS` === actionType) {
			// const { params } = this.props;
			MsgUtil.showwarning('操作成功');
			// this.context.router.replace(`${businessRoute.alldemandAdmin}${params.page?`/${params.page}`:''}`);
		} else if (`${RE_MINDER_BUINESS_CONFIRMS}_SUCCESS` === actionType) {
			MsgUtil.showwarning('发送成功');
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

	setImgModalVisible = (imgModalVisible) => {
		this.setState({
			imgModalVisible
		});
	};
	qryTable = () => {
		const { actions } = this.props;
		const { currentPage,DemandDetailsId,pageSize } = this.state;
		actions.contractMsg( currentPage,pageSize,DemandDetailsId);
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

	hideZoomImage = () => {
		this.setState({
			showZoomImage: false
		});
	};

	imageClickZoom = (zoomImageSrc) => {
		this.setState({
			zoomImageSrc,
			showZoomImage: true,
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
	reMinderBuinessConfirm = () => {
		const { actions,allDemandList } = this.props;
		const DemandDetailsId = this.props.routeParams.demandId;
		const productName =  allDemandList && allDemandList.record ? allDemandList.record.productName :'';
		if (productName) {
			actions.reMinderBuinessConfirms(DemandDetailsId,productName);
		}
	};

	confirmComplete = () => {
		this.showConfirm();
	};

	 showConfirm = () => {
		 const { actions } = this.props;
		 const DemandDetailsId = this.props.routeParams.demandId;
		 confirm({
			 title: '确定要提交吗?',
			 content: '提交后金额将自动转入设计师账户!',
			 okText: '提交',
			 okType: 'danger',
			 cancelText: '取消',
			 onOk() {
				 actions.confirmComplete(DemandDetailsId);
			 },
			 onCancel() {
				 console.log('Cancel');
			 },
		 });
	};

	handleClearCurrentData = (e) => {
		e.preventDefault();
		const { params } = this.props;
		const { router } = this.context;
		router.push(`${businessRoute.alldemandAdmin}${params.demandId?`/${params.page}/${params.dataType}`:''}`);
	};
	//弹窗内容控制0:不通过，1：通过
	renderModal = () => {
		const { modalType,ifSendSms } = this.state;
		switch (modalType){
			case 0:{
				const checkboxVal =['资料填写错误','内容不符合','有商业推广信息','资料填写违法内容'];
				return (<Modal
					visible={this.state.showModal}
					onCancel={this.hideModal}
					footer={null}
					width={640}
					title={'审批不通过的原因'}
				>
					<div>
						<Checkbox.Group
							onChange={this.failCheckboxHandler}
						>
							<Row>
								{(() => {
									const ret=[];
									for (let i=0,len=checkboxVal.length;i<len;i++){
										ret.push(<Col span={12}><Checkbox value={checkboxVal[i]}>{checkboxVal[i]}</Checkbox></Col>);
									}
									return ret;
								})()}
							</Row>
						</Checkbox.Group>
						<p>其他问题</p>
						<Input type="textarea" onChange={this.failTextareaHandler} />
						<div className="text-center" style={{ textAlign: 'center',marginTop: 10  }}><Checkbox value={ifSendSms} onChange={this.sendSms}>是否发送短信提醒</Checkbox></div>
						<div  style={{ display: 'flex',justifyContent: 'center', marginTop: 10 }}><Button onClick={this.failSubmit}>确定</Button></div>
						{/*<pre>{this.state.test}</pre>*/}
					</div>


				</Modal>);
				break;
			}
			case 1:{
				return (<Modal
					visible={this.state.showModal}
					onCancel={this.hideModal}
					footer={null}
					width={640}
					title={'通过审批'}
				>
					<h3 style={{ textAlign: 'center',margin: '100px 0' }}>确定通过审批？</h3>
					<div className="text-center" style={{ textAlign: 'center' }}><Checkbox value={ifSendSms} onChange={this.sendSms}>是否发送短信提醒</Checkbox></div>
					<div  style={{ display: 'flex',justifyContent: 'center' }}><Button onClick={this.okSubmit}>确定</Button></div>
				</Modal>);
				break;
			}
		}
	};

	renderImgList = () => {
		const { allDemandList } = this.props;
		const item=[];
		for ( const its in allDemandList.picList) {
			if (allDemandList.picList[its].image) {
				item.push(
					<Col span={12}>
						<img
							src={allDemandList.picList[its].image}
							onClick={() => { this.zoomPic(allDemandList.picList[its].image); }}
							width={100}
							height={50}
							className="list-img"
						/>
					</Col>
				);
			}
		}
		return item;
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



 	//进行中，完成商家设计师头像
	renderHead = (defautImg) => {
		const { allDemandList } = this.props;
		const { deviceType } = this.state;
		if (!allDemandList && !allDemandList.record) {
			return;
		}
		const baseInfo={ ...allDemandList.record };
		return (<Row gutter={20}>
			<Col span={10}>
				<div className="item border" style={{ float: 'right',textAlign: 'center' }}>
					{/*<img src={baseInfo && baseInfo.publisher ? baseInfo.publisher.headImage : defautImg} alt="" onClick={() => onImageClick(bsnSrc)} />*/}
					<img
						src={baseInfo && baseInfo.publisher ? baseInfo.publisher.headImage : defautImg}
						alt=""
						width={80}
						style={{ width: '100px',height: '100px',borderRadius: '50%' }}
						onClick={() => this.zoomPic(baseInfo.publisher.headImage)}
					/>
					<br /><span style={{ margin: '0 1em' }}>{baseInfo && baseInfo.publisher ? baseInfo.publisher.nick :' '}</span>
				</div>
			</Col>
			<Col span={4}>
				<div className="item" style={{ textAlign: 'center' }}>
					<img src={require('./images/signsuccessed.png')} alt="" width={60}  /><br />
					{deviceType==3 ? '进行中' : '己完成'}
				</div>
			</Col>
			<Col span={10}>
				<div className="item border" style={{ float: 'left',textAlign: 'center'  }}>
					<img
						src={baseInfo && baseInfo.designer ? baseInfo.designer.headImage : defautImg}
						alt=""
						style={{ width: '100px',height: '100px',borderRadius: '50%' }}
						onClick={() => this.zoomPic(baseInfo.designer.headImage)}
					/>
					<br />
					<span style={{ margin: '0 1em' }}>{baseInfo && baseInfo.designer ? baseInfo.designer.nick :' '}</span>
					{/*<ChatBtn onClick={this.chatBtnHandler} />*/}
				</div>
			</Col>
		</Row>);
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
				{
					deviceType==3 || deviceType==4 ?
					(this.renderHead(baseInfo,defautImg)) :
					(this.renderDesHeader(baseInfo,defautImg))
				}
				<hr />
				<ProdDeatill
					ProdDemandDetails={DemandDetails}
					imageClickZoom={() =>
						{ this.imageClickZoom(DemandDetails.imgSrc); }
					}
				/>
			</Col>
			<Col span={24} style={{ height: '55px' }}>&nbsp;</Col>
			<Col span={24}>
				<Col span={24}>
					<hr />

					{
						deviceType==3 || deviceType==4 ?
						this.renderStartSubmitBtn(contractMsgList,allDemandList,deviceType) : this.renderNoStartSubmitBtn(deviceType)}
				</Col>
			</Col>
			<Col span={24}>
				<hr />
				<pre>{WorksFullInfo.auditResult}</pre>
			</Col>
		</div>
			);
	};

	renderStartSubmitBtn =(contractMsgList,allDemandList,deviceType) => {
		const { totalCount } = this.props;
		return (
			<div>
				<DialogBox
					data={contractMsgList}
					allDemandList={allDemandList}
					onImageClick={this.imageClickZoom}
					pagination={false}
					reMinderBuinessConfirm={this.reMinderBuinessConfirm}
					confirmComplete={this.confirmComplete}
					deviceType={deviceType}
				/>

				{totalCount && totalCount >1 ? <div className="pg-ctr" >
					<Pagination
						defaultCurrent={this.state.currentPage}
						current={this.state.currentPage}
						total={totalCount}
						onChange={this.paginationController}
					/>
				</div>: '' }

			</div>
		);
	} ;

	renderNoStartSubmitBtn =(deviceType) => {
		if (deviceType !=2) {
			return (
				<div className="btn-group" style={{ display: 'flex',justifyContent: 'center', margin: '50px' }}>
					<Button type="danger" size={'large'} onClick={this.failHandler} >不通过</Button>
					<span style={{ display: 'inline-block',width: '30px' }} />
					<Button type="primary" size={'large'} onClick={this.passHandler} >通过</Button>
				</div>
			);
		}
	} ;


	render () {
		const { allDemandList,contractMsgList } = this.props;
		const  WorksFullInfo={ ...allDemandList.record };
		const { zoomSrc,deviceType,zoomImageSrc,showZoomImage } = this.state;

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

				<ZoomImage
					url={zoomImageSrc}
					zooming={showZoomImage}
					hideHandler={this.hideZoomImage}
					fullScreen
				/>

				<div className={this.state.zoomClass} onClick={this.hideModalPic}>
					{this.renderImg(screenWidth,screenHeight,zoomSrc)}
				</div>
				{this.renderModal()}
				<Form>
					<Row gutter={20}>
						<Col span={24} >
							<Link className="ant-btn" style={{ lineHeight: '28px' }} onClick={this.handleClearCurrentData} >
								<Icon type="backward" />
								<span>&nbsp;&nbsp;返回需求管理</span>
							</Link>
						</Col>
						{this.renderForm(deviceType,WorksFullInfo,allDemandList,defautImg,buyLink,contractMsgList)}
					</Row>
				</Form>
			</div>
		);

	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { allDemandList,contractMsgList,totalCount  } = state.get('DemandAdminReducer').toObject();
	return {
		rspInfo,
		actionType,
		allDemandList,
		contractMsgList,
		totalCount
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryEnterpriseDemand,
			qryPendingAudit,
			qryDemandDetail,
			auditDSNWork,
			clearCurrentData,
			contractMsg,
			reMinderBuinessConfirms,
			confirmComplete
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AllDemandDetails));