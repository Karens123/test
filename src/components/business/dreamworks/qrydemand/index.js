'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Modal, Row, Table,Icon,Tabs,Input,Pagination } from 'antd';
import { Link } from 'react-router';
import * as businessRoute from 'business/route';
import * as MsgUtil from 'utils/MsgUtil';
import ZoomImage from 'business/dreamworks/widget/zoomimage';
import AuditModal from 'business/dreamworks/widget/auditmodal';
import PassButtonGroup from 'business/dreamworks/widget/passbuttongroup';
import BackButton from 'business/dreamworks/widget/backbutton';
import { qryDemandDetail,AUDIT_DEMAND,auditDemand,clearDemand } from 'action';
import { statusNumToText,chipNumToText,worksTypeNumToText,demandTypeNumToText,chipNumToSizeText,statusNumToClass } from 'utils/MappingUtil';
import DemandDetail from './demanddetail';
import DialogBox from './dialogbox';
import DemandHead from './demandhead';


class QryDemand extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired,
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
		params: PropTypes.object,
		actionType: PropTypes.string.isRequired,
		demand: PropTypes.object,
	};

	static defaultProps = {
		params: {},
		demand: {},

	};

	constructor(props) {
		super(props);
		this.state = {
			zoomImageSrc: undefined,
			showZoomImage: false,
			showModal: false,
			showData: {},
			showDataType: undefined,
			modalType: undefined,
			failTextarea: undefined,
			failReason: [],
			ifSendSms: 0,
			operType: undefined,
			entityType: 0,
			head: {},
			common: {},
			control: {},
			sign: {},
			msg: {},
		};

	}
	componentWillMount(){
		const { params,actionType,actions } = this.props;
		actions.qryDemandDetail(params.cid);
	}
	componentWillReceiveProps(nextProps) {
		const { demand,actionType } = nextProps;
		const data = demand.record;
		console.log(demand,data);
		if (data){
			console.log('testing',data.picList);
			this.setState({
				head: {
					bsnName: (data&&data.publisher)?data.publisher.nick:'',
					bsnImg: (data&&data.publisher)?data.publisher.headImage:'',
					dsnName: (data&&data.designer)?data.designer.nick:'',
					dsnImg: (data&&data.designer)?data.designer.headImage:'',
				},
				common: {
					shape: chipNumToText(data.chip),
					type: worksTypeNumToText(data.type),
					timeLimit: `${data.timeLimit}天`,
					name: data.productName,
					size: chipNumToSizeText(data.chip),
					price: `${(data.reward/100).toFixed(2)}`,
					desc: data.designerDesc,
					images: ((list) => {
						const ret =[];
						for (let i=0,len=list.length;i<len;i++){
							ret.push(list[i].image);
						}
						return ret;
					})(data.picList),
				},
				sign: {
					assign: data.designer?data.designer.nick:'',
					applyList: data.applyList?data.applyList:['无'],
				},
				auditResult: data.auditResult,
				control: {
					type: data.state,
					text: (<span className={`${statusNumToClass(data.state)} status`}>{statusNumToText(data.state)}</span>)
				},
				msg: [{
					name: '广州宝品汇',
					type: '0',
					date: '2017.6.18',
					text: '已标注文件，请查收',
					images: [
						'http://via.placeholder.com/200x150',
						'http://via.placeholder.com/160x90'
					],
				}],

			},() => {
				console.log(this.state);
			});
		}
		if (actionType===`${AUDIT_DEMAND}_SUCCESS`){
			const { params } = this.props;
			MsgUtil.showwarning('操作成功');
			this.context.router.replace(`${businessRoute.EnterExamineAdmin}${params.page?`/${params.page}/${1}`:''}`);
		}
	};
	componentWillUnmount(){
		const { actions } = this.props;
		console.log('page is to unmount');
		actions.clearDemand();
	}

	imageClickHandler = (zoomImageSrc) => {
		this.setState({
			zoomImageSrc,
			showZoomImage: true,
		});
	};
	hideZoomImage = () => {
		this.setState({
			showZoomImage: false
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
	//图片弹出相关功能
	picHandler = (src) => {
		this.setState({
			zoomClass: 'hasZomm',
			src
		}, () => {
		});
	};
	hideModalPic = () => {
		this.setState({
			zoomClass: 'hidden',
			zoomSrc: ''
		});
	};
	//加载奖项图
	loadSomeImg = (list = []) => {
		const ret = [];
		for (let i = 0, len = list.length; i < len; i++) {
			ret.push(<Col span={8}>
				<img className="list-img" src={list[i]} alt="" onClick={() => this.picHandler(list[i])} />
			</Col>);
		}
		return ret;
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
		console.log(e,e.target.value);
	};
	failSubmit = (e) => {
		const { actions } = this.props;
		const { failTextarea,failReason } = this.state;
		const auditResult =(failTextarea && failTextarea.length)?this.failResultHelper([ ...failReason, failTextarea]):this.failResultHelper(failReason);
		if (auditResult && auditResult.length){
			this.setState({
				auditResult
			},() => {
				const { operType,entityType,auditResult,ifSendSms, } = this.state;
				const { params } =this.props;
				actions.auditDemand({ operType,entityType,entityId: params.cid,auditResult,ifSendSms });
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
	okSubmit = (e) => {
		const { actions } = this.props;
		this.setState({
			auditResult: ''
		},() => {
			const { operType,entityType,auditResult,ifSendSms } = this.state;
			const { params } =this.props;
			actions.auditDemand({ operType,entityType,entityId: params.cid,auditResult,ifSendSms });
		});
		this.hideModal();
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
	renderHead = () => {
		const { head,control } = this.state;
		return (<DemandHead
			bsnDesc={head.bsnName} bsnSrc={head.bsnImg||'http://via.placeholder.com/160x160'}
			dsnDesc={head.dsnName} dsnSrc={head.dsnImg||'http://via.placeholder.com/160x160'}
			onImageClick={this.imageClickHandler}
			type={control.type}
		/>);
	};

	render () {
		const dialogBoxData=[
			{
				name: '广州宝品汇',
				type: '0',
				date: '2017.6.18',
				text: '已标注文件，请查收',
				images: [
					'http://via.placeholder.com/200x150',
					'http://via.placeholder.com/160x90'
				],
			},{
				name: '黄嘉怡',
				type: '1',
				date: '2017.6.18',
				text: '已标注文件，请查收',
				images: [
					'http://via.placeholder.com/200x150',
					'http://via.placeholder.com/160x90',
					'http://via.placeholder.com/200x150',
					'http://via.placeholder.com/160x90',
					'http://via.placeholder.com/200x150',
					'http://via.placeholder.com/160x90',
					'http://via.placeholder.com/200x150',
					'http://via.placeholder.com/160x90',
					'http://via.placeholder.com/200x150',
					'http://via.placeholder.com/200x150',
					'http://via.placeholder.com/160x90',
					'http://via.placeholder.com/200x1500',
					'http://via.placeholder.com/1600x90',
					'http://via.placeholder.com/200x150',
					'http://via.placeholder.com/160x90',
					'http://via.placeholder.com/200x150',
					'http://via.placeholder.com/160x90',
					'http://via.placeholder.com/200x150',
					'http://via.placeholder.com/160x90'
				],
			},{
				name: '广州宝品汇',
				type: '0',
				date: '2017.6.18',
				text: '看图',
				images: [
					'http://via.placeholder.com/200x150',
					'http://via.placeholder.com/160x90'
				],
			},{
				name: '黄嘉怡',
				type: '1',
				date: '2017.6.17',
				text: '怎么改',
				images: [
					'http://via.placeholder.com/200x150',
					'http://via.placeholder.com/160x90'
				],
			},{
				name: '广州宝品汇',
				type: '0',
				date: '2017.6.16',
				text: '改一下',
				images: [
					'http://via.placeholder.com/200x150',
					'http://via.placeholder.com/160x90'
				],
			}
		];
		const { zoomImageSrc,showZoomImage } = this.state;
		const { modalType, ifSendSms, showModal } = this.state;
		const { head,common,control, sign,msg,auditResult } =this.state;
		const { params } = this.props;
		return (<div className="detail">
			{(params.page&&params.dataType)?<div>
				<BackButton
					to={`${businessRoute.EnterExamineAdmin}/${params.page}/${params.dataType}`}
					text={'返回需求审核列表'}
				/><br />
			</div>:null}
			<br />
			{this.renderHead()}
			<br />
			<p style={{ textAlign: 'center' }}>{control.text}</p>
			<br />
			<hr />
			{control.type===1?(<AuditModal
				modalType={modalType}
				ifSendSms={ifSendSms}
				failReasonList={['资料填写错误','内容不符合','有商业推广信息','资料填写违法内容']}
				visible={showModal}
				onCancel={this.hideModal}
				failTitle="审批不通过的原因"
				passTitle="通过审批"
				sendMsgHandler={this.sendSms}
				okHandler={this.okSubmit}
				failHandler={this.failSubmit}
				failTextareaHandler={this.failTextareaHandler}
				failCheckboxHandler={this.failCheckboxHandler}
			/>):null}
			<ZoomImage
				url={zoomImageSrc}
				zooming={showZoomImage}
				hideHandler={this.hideZoomImage}
				fullScreen
			/>
			<DemandDetail data={common} onImageClick={this.imageClickHandler} />
			<hr />
			{(control.type===4||control.type===5)?(
				<DialogBox data={dialogBoxData} onImageClick={this.imageClickHandler} />
			):null}
			{control.type===2?
				(<Row span={24}>
					<pre>{auditResult}</pre>
				</Row>):null}
			{(control.type===1&&params.page)?(<PassButtonGroup
				passHandler={this.passHandler}
				failHandler={this.failHandler}
			/>):null}
		</div>);
	}
}


const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { demand,auditDemand } = state.get('QryDemandReducer').toObject();
	return {
		rspInfo,
		actionType,
		demand,
		auditDemand
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryDemandDetail,
			auditDemand,
			clearDemand
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(QryDemand);