'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Modal, Row, Icon, Checkbox,Input, } from 'antd';
import { parseDateTime } from 'utils/DateUtil';
import { Link } from 'react-router';
import { qryDsnDetail,auditDesigner,clearDSNDetail } from 'action';
import * as businessRoute from 'business/route';
import * as MsgUtil from 'utils/MsgUtil';
import PassButtonGroup from 'business/dreamworks/widget/passbuttongroup';
import AuditModal from 'business/dreamworks/widget/auditmodal';
import './index.less';

class qryApplyDesigner extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
		dsnDetail: PropTypes.object,
		params: PropTypes.object,
		actionType: PropTypes.string.isRequired,
	};

	static defaultProps = {
		dsnDetail: {},
		params: {},
	};

	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			showData: {},
			modalType: undefined,
			failTextarea: undefined,
			failReason: [],
			ifSendSms: 0,
			operType: undefined,
			entityType: 0,
			entityId: undefined,
			auditResult: undefined,
			src: undefined,
			zoomClass: 'hidden',
		};

	}

	componentWillMount() {

		const { params,actions } = this.props;
		const wenwenId = params.wenwenId;
		actions.qryDsnDetail({
			designerId: wenwenId,
		});
		this.setState({
			entityId: wenwenId,
		});
	}
	componentWillReceiveProps(nextProps) {
		const { dsnDetail,actionType } = nextProps;
		//详情模型
		if (dsnDetail && dsnDetail.record){
			const ret = dsnDetail.record;
			console.log('dsnDetail.record_______',dsnDetail.record);
			const { userInfo,dsnerInfo,dsnPicList } = ret;
			const newShowData={
				auditState: dsnerInfo.state,
				auditResult: dsnerInfo.auditResult,
				avatar: userInfo.headImage,
				userName: userInfo.nick,
				id: dsnerInfo.designerId,
				field: dsnerInfo.designField,
				address: dsnerInfo.city,
				contact: userInfo.phoneId ,
				img: dsnerInfo.vicePubPic,
				realName: dsnerInfo.realName,
				cid: dsnerInfo.citizenId,
				selfIntro: dsnerInfo.dsnIntroduction,
				cidFront: dsnerInfo.citizenFrontPic,
				cidBack: dsnerInfo.citizenBackPic,
				imgList: (((list) => {
					const ret=[];
					for (let i=0,len=list.length;i<len;i++){
						ret.push(list[i].image);
					}
					return ret;
				}))(dsnPicList)
			};
			this.setState({
				showData: newShowData
			},() => {
				console.log('showData____',newShowData);
			});
		}
		if (actionType==='AUDIT_DSN_SUCCESS'){
			const { params,actions } = this.props;
			MsgUtil.showwarning('操作成功');

			this.context.router.replace(`${businessRoute.qryApplicationAdmin}${params.page?`/${params.page}/${1}`:''}`);


		}
	}
	componentWillUnmount(){
		const { actions } = this.props;
		console.log('page is to unmount');
		actions.clearDSNDetail({});
	}


	hideModalPic = () => {
		this.setState({
			zoomClass: 'hidden',
			zoomSrc: ''
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

	picHandler = (src) => {
		this.setState({
			zoomClass: 'hasZomm',
			src
		}, () => {
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
		const { failTextarea,failReason,ifSendSms } = this.state;
		const auditResult =(failTextarea && failTextarea.length)?this.failResultHelper([ ...failReason, failTextarea]):this.failResultHelper(failReason);
		if (auditResult && auditResult.length){
			this.setState({
				auditResult
			},() => {
				const { operType,entityType,entityId,auditResult,ifSendSms } = this.state;
				actions.auditDesigner({ operType,entityType,entityId,auditResult,ifSendSms });
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
			const { operType,entityType,entityId,auditResult,ifSendSms } = this.state;
			actions.auditDesigner({ operType,entityType,entityId,auditResult,ifSendSms });
			console.log('___________form is submit,data is: ',{ operType,entityType,entityId,auditResult,ifSendSms });
		});
		this.hideModal();

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

	render() {
		const { params,actions } = this.props;
		const { showData,src,modalType,ifSendSms,showModal } = this.state;
		const screenWidth = document.body.offsetWidth,
			screenHeight = document.body.offsetHeight;
		return (
			<div className="dsn-detail">
				<div className={this.state.zoomClass} onClick={this.hideModalPic}>
					{this.renderImg(screenWidth,screenHeight,src)}
				</div>
				<AuditModal
					modalType={modalType}
					ifSendSms={ifSendSms}
					failReasonList={['资料填写错误','证件照内容不符合','证件内容与填写资料不符合','资料填写违法内容']}
					visible={showModal}
					onCancel={this.hideModal}
					failTitle="审批不通过的原因"
					passTitle="通过审批"
					sendMsgHandler={this.sendSms}
					okHandler={this.okSubmit}
					failHandler={this.failSubmit}
					failTextareaHandler={this.failTextareaHandler}
					failCheckboxHandler={this.failCheckboxHandler}
				/>
				<Link
					to={`${businessRoute.qryApplicationAdmin}/${params.page}/${params.dataType}`}
					className="ant-btn"
					style={{ lineHeight: '28px' }}

				>
					<Icon type="backward" />
					<span>&nbsp;&nbsp;入驻申请列表</span>
				</Link>
				<Row gutter={20}>
					<Col span={24}>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center'
							}}
						>
							<img
								style={{ width: '100px', height: '100px', borderRadius: '50%' }}
								src={showData.avatar}
								alt=""
								onClick={() => this.picHandler(showData.avatar)}
							/>
							<p>{showData.userName}</p>
						</div>

					</Col>
					<Col span={12}>
						<h3>基本资料</h3>
						<hr />
						<Row gutter={18}>
							<Col span={16} gutter={16}>
								<p>用户ID：{showData.id}</p>
								<p>设计领域：{showData.field}</p>
								<p>所在城市：{showData.address}</p>
								<p>联系方式：{showData.contact}</p>

							</Col>
							<Col span={6}>
								<p>
									<img
										style={{ width: '120px', height: '160px',textAlign: 'center' }}
										src={showData.img}
										alt=""
										onClick={() => this.picHandler(showData.img)}
									/>
								</p>
								<p style={{ textAlign: 'center' }}>形象照</p>
							</Col>
						</Row>
					</Col>
					<Col span={12}>
						<h3>详细资料</h3>
						<hr />
						<p>真实姓名：{showData.realName}</p>
						<p>身份证号码：{showData.cid}</p>
					</Col>
					<Col span={24}>
						<p>个人介绍：</p>
						<p className="desc">{showData.selfIntro}</p>
					</Col>
					<Col span={24}>
						<p>证件照片：</p>
						<Row gutter={32}>
							<Col span={12}>
								<p>身份证正面：</p>
								<img className="cid-img" src={showData.cidFront} alt="" onClick={() => this.picHandler(showData.cidFront)} />
							</Col>
							<Col span={12}>
								<p>身份证背面：</p>
								<img className="cid-img" src={showData.cidBack} alt="" onClick={() => this.picHandler(showData.cidBack)} />
							</Col>
						</Row>
						{
							showData.imgList && showData.imgList.length>0 && (<Row gutter={16}>
								<p>认证/奖项：</p>
								{this.loadSomeImg(showData.imgList)}
							</Row>)
						}
					</Col>
					{ showData.auditState != 3 ?
						(<Col span={24}>
							<hr />
							<PassButtonGroup
								passHandler={this.passHandler}
								failHandler={this.failHandler}
							/>
						</Col>):
						(<Col span={24}>
							<hr />
							<pre>{showData.auditResult}</pre>
						</Col>)
					}

				</Row>
			</div>
		);
	}
}
const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { dsnDetail } = state.get('QryApplyReducer').toObject();
	return {
		rspInfo,
		actionType,
		dsnDetail,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryDsnDetail,
			auditDesigner,
			clearDSNDetail,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(qryApplyDesigner);