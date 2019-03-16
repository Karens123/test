'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Modal, Row, Table,Icon,Tabs,Input,Pagination } from 'antd';
import { Link } from 'react-router';
import { parseDate } from 'utils/DateUtil';
import { statusNumToText,chipNumToText,worksTypeNumToText,demandTypeNumToText,statusNumToClass } from 'utils/MappingUtil';
import BackButton from 'business/dreamworks/widget/backbutton';
import * as businessRoute from 'business/route';
import ZoomImage from 'business/dreamworks/widget/zoomimage';
import { qryBusinessDetail,qryDemandList,qryDemandInAuditing } from 'action';
import PendingAdultForm from  './pendingAdultForm';
import PendingSignForm from  './pendingSignForm';
import AllDemandForm from './allDemandForm';


class QryBusinessDetail extends React.Component {

	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
		params: PropTypes.object,
		// actionType: PropTypes.string.isRequired,
		bsnDetail: PropTypes.object,
		demandList: PropTypes.object,
	};

	static defaultProps = {
		params: {},
		bsnDetail: {},
		demandList: {},
	};

	constructor(props) {
		super(props);
		this.state = {
			showData: {},
			aType: undefined,
			showDataType: undefined,
			//0待支付,1待审核用单独接口，2未通过，3待签约，4进行中，5已完成，-1不传但查全部
			showDemandModal: false,
			pendingAdult: {
				showData: [],
				currentPage: 1,
				totalCount: 10,
			},
			pendingSign: {
				showData: [],
				currentPage: 1,
				totalCount: 10,
			},
			onGoingDemand: {
				showData: [],
				currentPage: 1,
				totalCount: 10,
			},
			finishedDemand: {
				showData: [],
				currentPage: 1,
				totalCount: 10,
			},
			allDemand: {
				showData: [],
				currentPage: 1,
				totalCount: 10,
			},
			head: {
				img: 'http://via.placeholder.com/260x260?text=querying'
			},
			base: {},
			idAuth: {},
			countingObj: {},
			zoomImageSrc: undefined,
			showZoomImage: false,

		};

	}
	componentWillMount() {
		const { params,actions } = this.props;
		const wenwenId = params.cid;
		console.log('wenwenId____________',wenwenId);
		actions.qryBusinessDetail({
			enterpriseId: wenwenId,
		});

	}

	componentWillReceiveProps(nextProps) {
		const { showDataType } = this.state;
		const { bsnDetail,demandList } = nextProps;
		const data=bsnDetail.record;
		const showListData = [];
		if (data){
			const head={
				name: data.entInfo.name,
				img: data.userInfo.headImage
			};
			const base={
				name: data.entInfo.name,
				img: `${data.entInfo.logoPic}`,
				industry: data.entInfo.industry,
				scale: data.entInfo.scale,
				address: data.entInfo.city,
				wenwenId: data.userInfo.wenwenId,
				phoneId: data.userInfo.phoneId,
				createTime: parseDate(data.entInfo.createTime),
				realAddress: data.entInfo.address,
				desc: data.entInfo.entIntroduction,
			};
			const idAuth={
				legalPerson: data.entInfo.legalPerson,
				licenseCode: data.entInfo.licenseCode,
				businessScope: data.entInfo.businessScope,
				licensePic: data.entInfo.licensePic ,
				entPicList: (((list) => {
					const ret=[];
					for (let i=0,len=list.length;i<len;i++){
						ret.push(list[i].image);
					}
					return ret;
				}))(data.entPicList),
			};
			const countingObj={
				inAuditingNum: data.demandStatInfo.inAuditingNum||0,
				applyingNum: data.demandStatInfo.applyingNum||0,
				pendingContractNum: data.demandStatInfo.pendingContractNum||0,
				handlingNum: data.demandStatInfo.handlingNum||0,
				totalCount: data.demandStatInfo.totalCount||0,
				finish: data.demandStatInfo.finish||0
			};
			this.setState({
				head,
				base,
				idAuth,
				countingObj,
			});
		}
		if (demandList.records){
			const { showDataType } = this.state;
			const showData=[];
			switch (showDataType){
				case 1:{
					console.log('maping data pending audit',demandList);
					demandList.records.map((val) => {
						showData.push({
							name: val.productName,
							desc: val.designerDesc&&val.designerDesc.length>10?val.designerDesc.slice(0,10).concat('...'):val.designerDesc,
							chip: chipNumToText(val.chip),
							type: worksTypeNumToText(val.type),
							timeLimit: `${val.timeLimit}天`,
							money: (parseInt(val.reward)/100).toFixed(2),
							status: (<span className={`${statusNumToClass(val.state)} status`}>{statusNumToText(val.state)}</span> ),
							action: (<a
								href={`${businessRoute.QryDemand}/${val.demandId}`}
								rel="noopener noreferrer"
								target="_blank"
							>查看</a>),
						});
					});
					this.setState({
						pendingAdult: {
							record: showData,
							currentPage: demandList.currentPage,
							totalCount: demandList.totalCount||10,
						},
					},() => {
						console.log('showdata',showData);
					});
					break;
				}
				case 3:{
					demandList.records.map((val) => {
						showData.push({
							name: val.productName,
							chip: chipNumToText(val.chip),
							type: worksTypeNumToText(val.type),
							timeLimit: `${val.timeLimit}天`,
							money: (val.reward/100).toFixed(2),
							payed: val.demandContractBean ? ( (val.reward * val.demandContractBean.depositRate) / 100/100).toFixed(2):(0).toFixed(2),
							delegatType: (<span>{val.demandContractBean ? demandTypeNumToText(val.demandContractBean.type):'无'}</span>),
							designer: val.demandContractBean ? val.demandContractBean.designer.nick:'无',
							status: (<span className={`${statusNumToClass(val.state)} status`}>{statusNumToText(val.state)}</span> ),
							action: (<a
								href={`${businessRoute.QryDemand}/${val.demandId}`}
								rel="noopener noreferrer"
								target="_blank"
							>查看</a>),
						});
					});
					this.setState({
						pendingSign: {
							record: showData,
							currentPage: demandList.currentPage,
							totalCount: demandList.totalCount||10,
						},
					});
					break;
				}
				case 4:{
					demandList.records.map((val) => {
						showData.push({
							name: val.productName,
							chip: chipNumToText(val.chip),
							type: worksTypeNumToText(val.type),
							timeLimit: `${val.timeLimit}天`,
							payed: val.demandContractBean ? ( (val.reward * val.demandContractBean.depositRate) / 100/100).toFixed(2):(0).toFixed(2),
							delegatType: (<span>{val.demandContractBean ? demandTypeNumToText(val.demandContractBean.type):'无'}</span>),
							designer: ((val.demandContractBean &&val.demandContractBean.designer)&& val.demandContractBean.designer.nick)||'无',
							money: (val.reward/100).toFixed(2),
							status: (<span className={`${statusNumToClass(val.state)} status`}>{statusNumToText(val.state)}</span> ),
							action: (<a
								href={`${businessRoute.QryDemand}/${val.demandId}`}
								rel="noopener noreferrer"
								target="_blank"
							>查看</a>),
						});
						console.log( val.demandContractBean ? demandTypeNumToText(val.demandContractBean.type):'无');
					});
					this.setState({
						onGoingDemand: {
							record: showData,
							currentPage: demandList.currentPage,
							totalCount: demandList.totalCount||10,
						},
					});
					break;
				}
				case 5:{
					demandList.records.map((val) => {
						showData.push({
							name: val.productName,
							chip: chipNumToText(val.chip),
							type: worksTypeNumToText(val.type),
							timeLimit: `${val.timeLimit}天`,
							money: (val.reward/100).toFixed(2),
							payed: val.demandContractBean ? ( (val.reward * val.demandContractBean.depositRate) / 100/100).toFixed(2):(0).toFixed(2),
							delegatType: (<span>{val.demandContractBean ? demandTypeNumToText(val.demandContractBean.type):'无'}</span>),
							designer: ((val.demandContractBean &&val.demandContractBean.designer)&& val.demandContractBean.designer.nick)||'无',
							status: (<span className={`${statusNumToClass(val.state)} status`}>{statusNumToText(val.state)}</span> ),
							action: (<a
								href={`${businessRoute.QryDemand}/${val.demandId}`}
								rel="noopener noreferrer"
								target="_blank"
							>查看</a>),
						});
					});
					this.setState({
						finishedDemand: {
							record: showData,
							currentPage: demandList.currentPage,
							totalCount: demandList.totalCount||10,
						},
					});
					break;
				}
				case -1:{
					demandList.records.map((val) => {
						showData.push({
							name: val.productName,
							chip: chipNumToText(val.chip),
							type: worksTypeNumToText(val.type),
							timeLimit: `${val.timeLimit}天`,
							money: (val.reward/100).toFixed(2),
							payed: val.demandContractBean ? ( (val.reward * val.demandContractBean.depositRate) / 100/100).toFixed(2):(0).toFixed(2),
							delegatType: (<span>{val.demandContractBean ? demandTypeNumToText(val.demandContractBean.type):'无'}</span>),
							designer: ((val.demandContractBean &&val.demandContractBean.designer)&& val.demandContractBean.designer.nick)||'无',
							status: (<span className={`${statusNumToClass(val.state)} status`}>{statusNumToText(val.state)}</span> ),
							action: (<a
								href={`${businessRoute.QryDemand}/${val.demandId}`}
								rel="noopener noreferrer"
								target="_blank"
							>查看</a>),
						});
					});
					this.setState({
						allDemand: {
							record: showData,
							currentPage: demandList.currentPage,
							totalCount: demandList.totalCount||10,
						},
					});
					break;
				}
			}
		} else {
			console.log('something wrong',demandList,demandList.length);
		}

	};

	setDemandListCurrentPage = (num) => {
		const { showDataType } = this.state;
		const { pendingAdult,pendingSign,finishedDemand,allDemand,onGoingDemand } = this.state;
		switch (showDataType) {
			case 1: {
				pendingAdult.currentPage=num;
				this.setState({ pendingAdult });
				break;
			}
			case 3: {
				pendingSign.currentPage=num;
				this.setState({ pendingSign });
				break;
			}
			case 4: {
				finishedDemand.currentPage=num;
				this.setState({ finishedDemand });
				break;
			}
			case 5: {
				onGoingDemand.currentPage=num;
				this.setState({ onGoingDemand });
				break;
			}
			case -1: {
				allDemand.currentPage=num;
				this.setState({ allDemand });
				break;
			}
		}
	};

	qryDemandList = () => {
		const { actions } = this.props;
		const { pendingAdult,pendingSign,finishedDemand,allDemand,onGoingDemand } = this.state;
		const { showDataType } = this.state;
		console.log('showDataType',showDataType);
		switch (showDataType){
			case 1:{
				actions.qryDemandInAuditing({
					currentPage: pendingAdult.currentPage,
					record: {
						publisherId: this.state.base.wenwenId
					}
				});
				break;
			}
			case 3:{
				actions.qryDemandList({
					currentPage: pendingSign.currentPage,
					record: {
						publisherId: this.state.base.wenwenId,
						state: showDataType
					}
				});
				break;
			}
			case 4:{
				actions.qryDemandList({
					currentPage: onGoingDemand.currentPage,
					record: {
						publisherId: this.state.base.wenwenId,
						state: showDataType
					}
				});
				break;
			}
			case 5:{
				actions.qryDemandList({
					currentPage: finishedDemand.currentPage,
					record: {
						publisherId: this.state.base.wenwenId,
						state: showDataType
					}
				});
				break;
			}
			case -1: {
				actions.qryDemandList({
					currentPage: allDemand.currentPage,
					record: {
						publisherId: this.state.base.wenwenId,
					}
				});
			}
		}
	};

	//切换page的控制
	paginationController = (num) => {
		this.setDemandListCurrentPage(num);
		this.qryDemandList();
	};

	tapToType = (tapKey) => {
		switch (tapKey){
			case '3':{ return 1; }
			case '4':{ return 3; }
			case '5':{ return 4; }
			case '6':{ return 5; }
			case '7':{ return -1; }
		}
	};

	//切换tap的控制
	showDataTypeHandler = (key) => {
		this.setState({
			showDataType: this.tapToType(key),
		}, () => {
			console.log('data type has changed to', key);
			this.qryDemandList();
		});
	};

	hideZoomImage = () => {
		this.setState({
			showZoomImage: false
		});
	};

	imageClickHandler = (zoomImageSrc) => {
		this.setState({
			zoomImageSrc,
			showZoomImage: true,
		});
	};

	renderIDAuth = () => {
		const { idAuth } = this.state;
		return (<div className="id-auth-admin thickbox">
			<Row>
				<Col span={6}>
					<p className="line-one">主体类型</p>
					<p className="line-two">{idAuth.type||'企业'}</p>
				</Col>
				<Col span={6}>
					<p className="line-one">法定代表人/企业负责人姓名</p>
					<p className="line-two">{idAuth.legalPerson||'未填写'}</p>
				</Col>
				<Col span={6}>
					<p className="line-one">工商执照注册号</p>
					<p className="line-two">{idAuth.licenseCode||'未填写'}</p>
				</Col>
			</Row>
			<br />
			<Row>
				<p className="line-one">经营范围</p>
				<p className="desc">{idAuth.businessScope}</p>
			</Row>
			<br />
			<Row gutter={20}>
				{idAuth.licensePic?<p className="line-one">证件照片</p>:null}
				{idAuth.licensePic?<Col span={5}>
					<ZoomImage width={210} height={210} url={idAuth.licensePic} zooming coefficient={0.95} onImageClick={this.imageClickHandler} />
					<p style={{ textAlign: 'center' }}>企业工商营业执照</p>
				</Col>:null}
				{this.renderOtherImageList(idAuth.entPicList)}
			</Row>
		</div>);
	};

	renderOtherImageList = (list=[],span=5) => {
		const ret =[];
		list.map((val) => {
			ret.push(<Col span={span}>
				<ZoomImage width={210} height={210} url={val} zooming coefficient={0.95} onImageClick={this.imageClickHandler} />
				<p style={{ textAlign: 'center' }}>其他证明材料</p>
			</Col>);
		});
		return ret;
	};

	renderBase = () => {
		const { base } = this.state;
		return (<div className="base thickbox">
			<Row gutter={20}>
				<Col span={6}>
					<div
						style={{
							width: '100%',
							boxSizing: 'border-box',
							padding: '40px',
							border: '1px solid #ccc',
							textAlign: 'center',
						}}
					>
						<p>账户余额</p>
						<p style={{ fontSize: '30px' }} className="red">￥{base.money||'0.00'}</p>
						<Link>收支明细</Link>
					</div>

				</Col>
				<Col span={18}>
					<Row>
						<Col span={6}>
							<p className="line-one">企业名称</p>
							<p className="line-two">{base.name}</p>
						</Col>
						<Col span={6}>
							<p className="line-one">所属行业</p>
							<p className="line-two">{base.industry}</p>
						</Col>
						<Col span={6}>
							<p className="line-one">企业规模</p>
							<p className="line-two">{base.scale}</p>
						</Col>
						<Col span={6}>
							<p className="line-one">地址</p>
							<p className="line-two">{base.address}</p>
						</Col>

					</Row>
					<br />
					<Row>
						<Col span={6}>
							<p className="line-one">商家ID</p>
							<p className="line-two">{base.wenwenId}</p>
						</Col>
						<Col span={6}>
							<p className="line-one">联系方式</p>
							<p className="line-two">{base.phoneId}</p>
						</Col>
						<Col span={6}>
							<p className="line-one">加入时间</p>
							<p className="line-two">{base.createTime}</p>
						</Col>
						<Col span={6}>
							<p className="line-one">收货地址</p>
							<p className="line-two">{base.realAddress}</p>
						</Col>
					</Row>
				</Col>
			</Row>
			<br />
			<Row gutter={20}>
				<Col span={6}>
					<p>形象照片</p>
					<ZoomImage width={260} height={260} url={base.img} zooming coefficient={0.95} onImageClick={this.imageClickHandler} />
					<p style={{ textAlign: 'center' }}>展示照</p>
				</Col>
				<Col span={18}>
					<p>企业介绍</p>
					<p className="desc">{base.desc}</p>
				</Col>
			</Row>
		</div>);
	};

	render () {
		const TabPane = Tabs.TabPane;
		const Search = Input.Search;
		const { countingObj } = this.state;
		// const countingObj =1;
		const { zoomImageSrc,showZoomImage,pendingAdult,pendingSign,finishedDemand,allDemand,onGoingDemand,head } = this.state;
		const { params } = this.props;
		return (<div>

			<ZoomImage
				url={zoomImageSrc}
				zooming={showZoomImage}
				hideHandler={this.hideZoomImage}
				fullScreen
			/>
			<Row>
				<Col span={24} >
					<BackButton
						to={`${businessRoute.AllBusinessAdmin}/${params.prepage}`}
						text={'返回全部商家'}
					/>
					<br />
					<h3 style={{ fontSize: '36px', margin: '20px 0',display: 'flex' }} >
						<img src={head.img} alt="" style={{ width: '60px',height: '60px', borderRadius: '50%' }} />&nbsp;
						{head.name}
					</h3>
				</Col>
				<Col span={24} >
					{/*<div className="admin-main" >*/}
					<div>
						<Tabs defaultActiveKey="1" onChange={this.showDataTypeHandler}>
							<TabPane tab={'基本资料'} key="1" >
								{this.renderBase()}
							</TabPane>
							<TabPane tab={'身份认证'} key="2" >
								{this.renderIDAuth()}
							</TabPane>
							<TabPane tab={`${'待审核'}(${countingObj.inAuditingNum})`} key="3" >
								<PendingAdultForm
									data={pendingAdult}
									pageChangeHandler={this.paginationController}
								/>
							</TabPane>
							<TabPane tab={`${'待签约'}(${countingObj.pendingContractNum})`} key="4" >
								<PendingSignForm
									data={pendingSign}
									pageChangeHandler={this.paginationController}
								/>
							</TabPane>
							<TabPane tab={`${'进行中'}(${countingObj.handlingNum})`} key="5" >
								<AllDemandForm
									data={onGoingDemand}
									pageChangeHandler={this.paginationController}
								/>
							</TabPane>
							<TabPane tab={`${'已完成'}(${countingObj.finish})`} key="6" >
								<AllDemandForm
									data={finishedDemand}
									pageChangeHandler={this.paginationController}
								/>
							</TabPane>
							<TabPane tab={`${'全部需求'}(${countingObj.totalCount})`} key="7" >
								<AllDemandForm
									data={allDemand}
									pageChangeHandler={this.paginationController}
								/>
							</TabPane>
						</Tabs>
					</div>
				</Col>
			</Row>
		</div>);
	}
}


const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { bsnDetail,demandList } = state.get('QryBusinessDetail').toObject();
	return {
		rspInfo,
		actionType,
		bsnDetail,
		demandList
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryBusinessDetail,
			qryDemandList,
			qryDemandInAuditing
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(QryBusinessDetail);