'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router';
import { Button, Col, Form, Icon, Input, Row,Tabs, Select,Modal,Checkbox } from 'antd';
import * as MsgUtil from 'utils/MsgUtil';
import * as businessRoute from 'business/route';
import ProdDeatill from 'business/dreamworks/widget/prodDetails';
import {
	QRY_ALLBUSINESSES_FORM,
	QRY_WORK_DETAIL_ID_FORM,
	QRY_ENTER_EXAMINE_STATUS,
	qryWorksDetailId,
	qryAllBusinessesForm,
	auditDSNWork,
	clearCurrentData
} from 'action';

import './index.less';

class WorksDetails extends React.Component {
	//检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		WorksInfoList: PropTypes.array.isRequired,
		currentWorksDetail: PropTypes.object.isRequired,
		route: PropTypes.object.isRequired,
		routeParams: PropTypes.string,
		actions: PropTypes.object.isRequired,
		params: PropTypes.object.isRequired,
		actionType: PropTypes.string.isRequired,
	};
	static defaultProps = {
		WorksInfoList: [],
		currentWorksDetail: {},
		routeParams: ''
	};
	constructor (props) {
		super(props);
		const { route } = props;
		if (!route) {
			this.context.router.replace(businessRoute.EnterExamineAdmin);
		} else {
			console.log('this.props.routeParams.worksId', this.props.routeParams.worksId.split('&&')[0]);
			this.state = {
				visible: false,
				WorksDetailsId: ((() => {
					const path=this.props.routeParams.worksId;
					if (path.includes('&&')) {
						return (this.props.routeParams.worksId.split('&&')[0]);
					} else {
						return (this.props.routeParams.worksId);
					}
				}))(),
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
				entityType: 2,
				currentItme: '',
				zoomSrc: '',
				zoomClass: 'hidden',
				imgModalVisible: false,
				deviceType: this.props.routeParams.worksId.split('=')[1]
			};
		}
	}
	componentWillMount () {
		const { WorksDetailsId } = this.state;
		const { actions } = this.props;
		actions.qryWorksDetailId(WorksDetailsId);
	}
	componentDidMount () {
	}
	componentWillReceiveProps (nextProps) {
		const { actionType } = nextProps;
		const { params } = this.props;
		if (actionType==='AUDIT_DSN_WORK_SUCCESS'){
			const { params } = this.props;
			MsgUtil.showwarning('操作成功');
			this.context.router.replace(`${businessRoute.EnterExamineAdmin}${params.prepage?`/${params.prepage}`:''}`);
		}
	};

	shouldComponentUpdate (nextProps, nextState) {
		const isRender = nextProps.WorksInfoList !== this.props.WorksInfoList
			|| nextState.showModal !== this.state.showModal
			|| nextState.currentItme !== this.props.currentWorksDetail
			|| nextState.showModal !== this.state.showModal;
		return isRender;
	}

	componentDidUpdate () {
	}

	componentWillUnmount(){
		const { actions } = this.props;
		console.log('page is to unmount');
		actions.clearCurrentData();

	}
	setImgModalVisible = (imgModalVisible) => {
		this.setState({
			imgModalVisible
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
				const { currentWorksDetail } = this.props;
				const entityId=currentWorksDetail.worksInfo.worksId;
				console.log('___________form is submit,data is: ',{ operType,entityType,entityId,auditResult,ifSendSms });
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
			const { currentWorksDetail } = this.props;
			const entityId=currentWorksDetail.worksInfo.worksId;
			console.log('___________form is submit,data is: ',{ operType,entityType,entityId,auditResult,ifSendSms });
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
		const { WorksDetailsId } = this.state;
		const { actions,params } = this.props;
		const { router } = this.context;
		router.push(`${businessRoute.EnterExamineAdmin}${params.page?`/${params.page}/${params.dataType}`:''}`);
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
		const { currentWorksDetail } = this.props;
		const item=[];
		for ( const its in currentWorksDetail.worksPicList) {
			if (currentWorksDetail.worksPicList[its].image) {
				item.push(
					<Col span={12}>
						<img
							src={currentWorksDetail.worksPicList[its].image}
							onClick={() => { this.zoomPic(currentWorksDetail.worksPicList[its].image); }}
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
	renderForm = (deviceType,WorksFullInfo,currentWorksDetail,defautImg,buyLink) => {

		//模拟数据
		const DemandDetails={
			Details: {
				shape: 'egg' , type: 'jewewly',longTime: '15 Day', name: 'mldf' ,totailPrice: 100000,size: '15*15'
			},
			ProdInfr: 'abc',
			imgSrc: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png'
		};


			//需求审核
		 if (deviceType==1) {
		 	return (<div className="demandForm">
			<br /><br />
			<Col span={24}>

				<div style={{ display: 'flex',flexDirection: 'column',justifyContent: 'center',alignItems: 'center' }}>
					<img
						style={{ width: '100px',height: '100px',borderRadius: '50%' }}
						src={defautImg}
						alt=""
						onClick={() => this.zoomPic(defautImg)}
					/>
					<p>{123}</p>
				</div>
				<hr />
				<ProdDeatill ProdDemandDetails={DemandDetails} />

			</Col>
			<Col span={24} style={{ height: '55px' }}>&nbsp;</Col>
			<Col span={24}>
				{
					WorksFullInfo.state !=3?
						(<Col span={24}>
							<hr />
							<div className="btn-group" style={{ display: 'flex',justifyContent: 'center', margin: '50px' }}>
								<Button type="danger" size={'large'} onClick={this.failHandler} >不通过</Button>
								<span style={{ display: 'inline-block',width: '30px' }} />
								<Button type="primary" size={'large'} onClick={this.passHandler} >通过</Button>
							</div>
						</Col>):
						(<Col span={24}>
							<hr />
							<pre>{WorksFullInfo.auditResult}</pre>
						</Col>)
				}
			</Col>
		</div>
			);
		 } else {
			 //作品审核
		 	return (
			<div>
				<Col span={24}>
					<div style={{ display: 'flex',flexDirection: 'column',justifyContent: 'center',alignItems: 'center' }}>
						<img
							style={{ width: '100px',height: '100px',borderRadius: '50%' }}
							src={currentWorksDetail.userInfo && currentWorksDetail.userInfo.headImage ? currentWorksDetail.userInfo.headImage : defautImg}
							alt=""
							onClick={() => this.zoomPic(currentWorksDetail.userInfo && currentWorksDetail.userInfo.headImage ? currentWorksDetail.userInfo.headImage : defautImg)}
						/>
						<p>{currentWorksDetail.userInfo && currentWorksDetail.userInfo.nick ? currentWorksDetail.userInfo.nick : ''}</p>
					</div>
				</Col>

				<Col span={12}>
					<hr />
					<p><span className="title">作品标题：</span> {WorksFullInfo.worksName}</p>
					<p><span className="title">副标题：</span> {WorksFullInfo.viceTitle}</p>
				</Col>
				<Col span={12}>
					<hr />
					<p><span className="title">类型：</span> {this.worksType(WorksFullInfo.worksType)}</p>
					{/*<p><span className="title">芯片：</span> ？</p>*/}
					<p><span className="title">购买连接：</span>{buyLink=='暂无链接'
						? '无'
						:<a
							className="link-style"
							href={buyLink}
							target="_blank"
							rel="noopener noreferrer"
						>
							{buyLink}
						</a>}</p>
				</Col>
				<Col span={24}>
					<p><span className="title">作品介绍：</span></p>
					<p className="desc">{WorksFullInfo.designNotes} </p>
				</Col>
				<Col span={10}>
					<p>PC封面：</p>
					<img
						src={WorksFullInfo.image}
						width={100}
						height={50}
						onClick={() => { this.zoomPic(WorksFullInfo.image); }}
						className="imgCover"
					/>
				</Col>
				<Col span={14}>
					<p>APP封面：</p>
					<img
						src={WorksFullInfo.rectImage}
						width={100}
						height={50}
						onClick={() => { this.zoomPic(WorksFullInfo.rectImage); }}
						className="imgCover"
					/>
				</Col>
				<Col span={24}>
					<p>作品图片：</p>
					<Row gutter={20}>
						{this.renderImgList()}
					</Row>
				</Col>
				{
					WorksFullInfo.state !=3?
						(<Col span={24}>
							<hr />
							<div className="btn-group" style={{ display: 'flex',justifyContent: 'center', margin: '50px' }}>
								<Button type="danger" size={'large'} onClick={this.failHandler} >不通过</Button>
								<span style={{ display: 'inline-block',width: '30px' }} />
								<Button type="primary" size={'large'} onClick={this.passHandler} >通过</Button>
							</div>
						</Col>):
						(<Col span={24}>
							<hr />
							<pre>{WorksFullInfo.auditResult}</pre>
						</Col>)
				}
			</div>
			);
		 }
	};

	render () {
		const { WorksInfoList,currentWorksDetail,params } = this.props;
		const  WorksFullInfo={ ...currentWorksDetail.worksInfo };
		const  WorksPicBean={ ...currentWorksDetail.worksPicList };
		const { zoomSrc,deviceType } = this.state;
		let buyLink='';
		if (!WorksFullInfo.buyLinks){
			buyLink='暂无链接';
		} else {
			buyLink=WorksFullInfo.buyLinks;
		}
		console.log('testing',params.prepage?`/${params.prepage}`:'');
		const defautImg='http://test-img-server.oss-cn-shenzhen.aliyuncs.com/default/headpic.png';
		const screenWidth = document.body.offsetWidth,
			screenHeight = document.body.offsetHeight;
		return (
			<div className="workDetails">
				<div className={this.state.zoomClass} onClick={this.hideModalPic}>
					{this.renderImg(screenWidth,screenHeight,zoomSrc)}
				</div>
				{this.renderModal()}
				<Form>
					<Row gutter={20}>
						<Col span={24} >
							<Link className="ant-btn" style={{ lineHeight: '28px' }} onClick={this.handleClearCurrentData} >
								<Icon type="backward" />
								<span>&nbsp;&nbsp;返回工作台审核</span>
							</Link>
						</Col>
						{this.renderForm(deviceType,WorksFullInfo,currentWorksDetail,defautImg,buyLink)}
					</Row>
				</Form>
			</div>
		);

	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { WorksInfoList,currentWorksDetail  } = state.get('EnterExamineReducer').toObject();
	return {
		rspInfo,
		actionType,
		WorksInfoList,
		currentWorksDetail
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryAllBusinessesForm,
			qryWorksDetailId,
			auditDSNWork,
			clearCurrentData
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(WorksDetails));