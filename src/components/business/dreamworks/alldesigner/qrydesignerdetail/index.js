'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Modal, Row, Table,Icon,Tabs,Input,Pagination } from 'antd';
import { Link } from 'react-router';
import BackButton from 'business/dreamworks/widget/backbutton';
import * as businessRoute from 'business/route';
import { parseDate } from 'utils/DateUtil';
import ZoomImage from 'business/dreamworks/widget/zoomimage';
import { statusNumToText,chipNumToText,worksTypeNumToText,demandTypeNumToText,statusNumToClass } from 'utils/MappingUtil';


import { qryAllDesigner,qryDesignerDemand,getDsnerAggregation } from '../action';
import PendingSignForm from  './pendingSignForm';
import PendingAdultForm from  './pendingAdultForm';
import FinishmandForm from './finishmandForm';


class QryDesignerDetail extends React.Component {

	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
		params: PropTypes.object,
		routeParams: PropTypes.string.isRequired,
		data: PropTypes.object,
		route: PropTypes.object.isRequired,
		desDemandInfro: PropTypes.object.isRequired,
		desnerInfo: PropTypes.object.isRequired,

	};

	static defaultProps = {
		params: {},
		data: {},
		pageSize: 10,
		defaultProp: {},

		// demandState: 0 //	0-待支付, 1-待审核,2-未通过, 3-待签约, 4-进行中, 5-已完成

	};

	constructor(props) {
		super(props);
		const { route } = this.props;
		this.state = {
			designerId: this.props.routeParams.cid,
			record: {},
			showData: {},
			aType: undefined,
			showDataType: undefined,
			currentPage: 1,
			showDemandModal: false,
			bsnShowList: [],
			worksCnt: '',
			pendingAdult: {
				showData: {},
				currentPage: 1,
				totalCount: 10,
			},
			base: {
			},
			idAuth: {
			},
			userInfo: {
			},
			dsnPicList: [],
			demandStatInfo: {
			},
			zoomImageSrc: undefined,
			showZoomImage: false,
			pendingSign: {
				records: [],
				currentPage: '',
				totalCount: '',
			},
			doingData: {
				records: [],
				currentPage: '',
				totalCount: '',
			},
			finishedData: {
				records: [],
				currentPage: '',
				totalCount: '',
			}
		};
	}

	componentWillMount() {
		this.qryTable();
		this.qrydesnerDetail();
	}

	componentWillReceiveProps(nextProps) {
		const { showDataType,designerId, } = this.state;
		const { data,desDemandInfro,desnerInfo } = nextProps;

		switch (showDataType) {
			case 3: {
				if (desDemandInfro) {
					const pendingContractData=[];
					desDemandInfro.records.map((item,index) => {
						pendingContractData.push({
							productName: item.productName,
							designerDesc: item.designerDesc,
							publisher: (item.publisher ? item.publisher.nick : '无'),
							chip: chipNumToText(item.chip),
							type: worksTypeNumToText(item.type),
							timeLimit: `${item.timeLimit}天`,
							reward: (parseInt(item.reward)/100).toFixed(2),
							state: (<span className={`${statusNumToClass(item.state)} status`}>{statusNumToText(item.state)}</span> ),
							demandContractBean: (<span>{item.demandContractBean ? demandTypeNumToText(item.demandContractBean.type):'无'}</span>),
							action: (<a href={`${businessRoute.QryDemand}/${item.demandId}`}  target="_blank"  rel="noopener noreferrer">查看</a>)
						});
					});


					this.setState({
						pendingSign: {
							records: pendingContractData,
							currentPage: desDemandInfro.currentPage,
							totalCount: desDemandInfro.totalCount,
						}
					});
				}
				break;
			}

			case 4: {
				if (desDemandInfro) {
					const Data=[];
					desDemandInfro.records.map((item,index) => {
						Data.push({
							productName: item.productName,
							designerDesc: item.designerDesc,
							publisher: (item.publisher ? item.publisher.nick : '无'),
							chip: chipNumToText(item.chip),
							type: worksTypeNumToText(item.type),
							timeLimit: `${item.timeLimit}天`,
							reward: (parseInt(item.reward)/100).toFixed(2),
							demandContractBean: (<span>{item.demandContractBean ? demandTypeNumToText(item.demandContractBean.type):'无'}</span>),
							state: (<span className={`${statusNumToClass(item.state)} status`}>{statusNumToText(item.state)}</span> ),
							action: (<a href={`${businessRoute.QryDemand}/${item.demandId}`}  target="_blank"  rel="noopener noreferrer">查看</a>)
						});
					});


					this.setState({
						doingData: {
							records: Data,
							currentPage: desDemandInfro.currentPage,
							totalCount: desDemandInfro.totalCount,
						}
					});
				}
				break;
			}

			case 5: {
				if (desDemandInfro) {
					const Data=[];
					desDemandInfro.records.map((item,index) => {
						Data.push({
							productName: item.productName,
							designerDesc: item.designerDesc,
							publisher: (item.publisher ? item.publisher.nick : '无'),
							chip: chipNumToText(item.chip),
							type: worksTypeNumToText(item.type),
							timeLimit: `${item.timeLimit}天`,
							payed: (<span>{item.demandContractBean ? (parseInt(item.demandContractBean.depositRate)/100).toFixed(2) :'无'}</span>),
							demandContractBean: (<span>{item.demandContractBean ? demandTypeNumToText(item.demandContractBean.type):'无'}</span>),
							reward: (parseInt(item.reward)/100).toFixed(2),
							state: (<span className={`${statusNumToClass(item.state)} status`}>{statusNumToText(item.state)}</span> ),
							action: (<a href={`${businessRoute.QryDemand}/${item.demandId}`}  target="_blank"  rel="noopener noreferrer">查看</a>)
						});
					});
					this.setState({
						finishedData: {
							records: Data,
							currentPage: desDemandInfro.currentPage,
							totalCount: desDemandInfro.totalCount,
						}
					});
				}
				break;
			}

		}

		if (desnerInfo && desnerInfo.record) {
			const showListData=desnerInfo.record;
			this.setState({ worksCnt: showListData.worksCnt });
			if (showListData) {
				this.setState({
					base: showListData.dsnerInfo,//设计师信息
					demandStatInfo: showListData.demandStatInfo,//需求统计信息
					userInfo: showListData.userInfo, //用户信息
					dsnPicList: showListData.dsnPicList, //设计师获奖图片列表
				}, () => {
				});

				this.setState({
					bsnTotalCount: data.totalCount,
				});
				this.setState({
					bsnShowList: showListData
				}, () => {
				});
			}
		}
	};
	setDemandListCurrentPage = (num) => {
		const { showDataType } = this.state;
		const { pendingSign,doingData,finishedData } = this.state;
		switch (showDataType) {

			case 3: {
				pendingSign.currentPage=num;
				this.setState({ pendingSign });
				break;
			}
			case 4: {
				doingData.currentPage=num;
				this.setState({ doingData });
				break;
			}
			case 5: {
				finishedData.currentPage=num;
				this.setState({ finishedData });
				break;
			}

		}
	};
	qrydesnerDetail = () => {
		const { showDataType,designerId, } = this.state;
		const { actions } = this.props;
	/*
		const { currentPage, record } = this.state;*/
		const qryForm= {
			designerId
		};
		actions.getDsnerAggregation(qryForm);
	};

	qryTable = () => {
		const { actions } = this.props;
		const { currentPage, record } = this.state;
		actions.qryAllDesigner({ currentPage, record });
	};


	qryDsnerDemand = () => {
		const { actions } =  this.props;
		const { designerId,currentPage,pageSize,showDataType } = this.state;
		const qryForm={
			designerId,
			state: showDataType
		};
		actions.qryDesignerDemand(currentPage,pageSize,qryForm);
	};



//切换page的控制
	paginationController = (num) => {
		this.setDemandListCurrentPage(num);
		this.qryDsnerDemand();
	};


	//切换tap的控制
	showDataTypeHandler = (key) => {
		this.setState({
			showDataType: key*1,
		}, () => {
			this.qryTable();
			this.qryDsnerDemand();
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
	jumpHref = () => {
		const domain = document.domain;
		const { designerId } = this.state;
		if (domain=='dream') {
			window.open(`http://${domain}.${businessRoute.designerDetailOutLink}/${designerId}`);
		} else {
			window.open(`http://debug.${businessRoute.designerDetailOutLink}/${designerId}`);
		}
	};
	renderOtherImageList = ( span=5) => {
		const { dsnPicList } = this.state;
		let dsnPicListArray=[];
		dsnPicListArray=dsnPicList.map((val) => {
			return (
				<Col span={5}>
					<ZoomImage
						width={180}
						height={180}
						url={val.image}
						zooming
						coefficient={0.95}
						onImageClick={this.imageClickHandler}
					/>
				</Col>
			);
		});

		return dsnPicListArray;
	};
	renderIDAuth = () => {
		const { base } = this.state;
		return (<div className="id-auth-admin">
			<Row gutter={20}>
				<Col span={20}>
					<Row>
						<Col span={7}>
							<p className="line-one">身份证姓名</p>
							<p className="line-two">{base && base.realName ? base.realName : ''}</p>
						</Col>
						<Col span={7}>
							<p className="line-one">身份证号码</p>
							<p className="line-two">{base && base.citizenId ? base.citizenId : ''}</p>
						</Col>
						<Col span={6}>
							<p className="line-one">学校名字</p>
							<p className="line-two">{base && base.school ? base.school : ''}&nbsp;</p>
						</Col>
					</Row>


					<Row>

						<Col span={7}>
							<p style={{ margin: 0 }}> 证件照片</p>
							<ZoomImage
								width={260}
								height={260}
								url={base.citizenFrontPic}
								zooming
								coefficient={0.95}
								onImageClick={this.imageClickHandler}
							/>
							{/*<img src={base && base.citizenFrontPic ? base.citizenFrontPic : ''} alt="" width={200} />*/}

							<p className="center" style={{ width: 260,  }}>证件照片正面</p>
						</Col>
						<Col span={7}>
							<p style={{ margin: 0 }}> &nbsp; </p>
							<ZoomImage
								width={260}
								height={260}
								url={base.citizenBackPic}
								zooming
								coefficient={0.95}
								onImageClick={this.imageClickHandler}
							/>
							{/*<img src={base && base.citizenBackPic ? base.citizenBackPic : ''} alt="" width={200} />*/}
							<p className="center" style={{ width: 260,  }}>证件照片背面</p>
						</Col>


					</Row>
					<Row>
						<p className="line-one">认证/奖项</p>
						<Col>
							{this.renderOtherImageList()}
						</Col>
					</Row>

				</Col>
			</Row>
		</div>);
	};


	renderBase = () => {
		const { base,userInfo,zoomImageSrc,showZoomImage, } = this.state;
		return (<div className="base">
			<ZoomImage
				url={zoomImageSrc}
				zooming={showZoomImage}
				hideHandler={this.hideZoomImage}
				fullScreen
			/>
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
						<p style={{ fontSize: '30px' }} className="red">{base && base.money ? base.money :'暂无'}</p>
						<Link>收支明细</Link>
					</div>

				</Col>
				<Col span={18}>
					<Row>
						<Col span={6}>
							<p className="line-one">姓名</p>
							<p className="line-two">{base && base.realName ? base.realName : ''}</p>
						</Col>
						<Col span={6}>
							<p className="line-one">设计领域</p>
							<p className="line-two">{base && base.designField ? base.designField : ''}</p>
						</Col>
						<Col span={6}>
							<p className="line-one">所在城市</p>
							<p className="line-two">{base && base.city ? base.city : ' '}</p>
						</Col>
						<Col span={6}>
							<p className="line-one">性别</p>
							<p className="line-two">{userInfo && userInfo.sex ? ((() => {
								let sex='男';
								userInfo.sex==1 ? sex : sex='女';
								return sex;
							})()) : ' '}&nbsp;</p>
						</Col>
						<Col span={6}>
							<p className="line-one">用户ID</p>
							<p className="line-two">{ userInfo && userInfo.wenwenId ? userInfo.wenwenId : ''}</p>
						</Col>
						<Col span={6}>
							<p className="line-one">联系方式</p>
							<p className="line-two">{userInfo && userInfo.phoneId ? userInfo.phoneId : ''}</p>
						</Col>
						<Col span={6}>
							<p className="line-one">加入时间</p>
							<p className="line-two">{base && base.createTime ? parseDate(base.createTime) : ''}</p>
						</Col>
						<Col span={6}>
							<p className="line-one">收货地址</p>
							<p className="line-two">{base && base.address ? base.address : ''}</p>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row gutter={20}>
				<Col span={6}>
					<p>形象照片</p>
					<ZoomImage
						width={260}
						height={260}
						url={base.mainPubPic}
						zooming
						coefficient={0.95}
						onImageClick={this.imageClickHandler}
					/>
					{/*<p><img src={base && base.mainPubPic ? base.mainPubPic : ''} alt="" width={200} /></p>*/}

					<p>展示照</p>

					<ZoomImage
						width={260}
						height={260}
						url={base.vicePubPic}
						zooming
						coefficient={0.95}
						onImageClick={this.imageClickHandler}
					/>
					{/*<p><img src={base && base.vicePubPic ? base.vicePubPic : ''} alt="" width={200} /></p>*/}
				</Col>
				<Col span={18}>
					<p>个人介绍</p>
					<p className="desc">{base && base.dsnIntroduction ? base.dsnIntroduction : '' }</p>
				</Col>
			</Row>
		</div>);
	};


	render () {
		const { params } = this.props;
		const TabPane = Tabs.TabPane;
		const Search = Input.Search;
		const currentID=2;
		const currentPendingID=1;
		const { base,dsnPicList,userInfo,demandStatInfo,designerId,pendingSign,zoomImageSrc,showZoomImage,worksCnt } = this.state;
		const defautImg=require('../images/headpic.png');
		const headImageStyle=({
			borderRadius: '50%',
			width: '100px',
			height: '100px',
		});
		return (<div className="">
			<ZoomImage
				url={zoomImageSrc}
				zooming={showZoomImage}
				hideHandler={this.hideZoomImage}
				fullScreen
			/>
			<Row>
				<Col span={24} >
					<BackButton

						to={`${businessRoute.AllDesignerAdmin}/${params.page}`}
						text={'返回'}
					/>
					<br />	<br />
					<h3 style={{ fontSize: '36px', lineHeight: '100px', marginBottom: '20px',display: 'flex' }} >
						<img src={userInfo && userInfo.headImage ? userInfo.headImage : defautImg} style={headImageStyle} />
						&nbsp;{base && base.realName ? base.realName : ' '}
					</h3>
				</Col>

				<Col span={24} >
					<div className="admin-main" >
						<Tabs defaultActiveKey="1" onChange={this.showDataTypeHandler}>

							<TabPane tab={'基本资料'} key="1" >
								<div className="thickbox">
									{this.renderBase()}
								</div>

							</TabPane>
							<TabPane tab={'身份认证'} key="2" >
								<div className="thickbox">
									{this.renderIDAuth()}
								</div>
							</TabPane>

							<TabPane tab={`${'待签约'}(${this.state.demandStatInfo.pendingContractNum})`} key="3" >
								<PendingSignForm
									data={this.state.pendingSign}
									pageChangeHandler={this.paginationController}
								/>
							</TabPane>
							<TabPane tab={`${'进行中'}(${this.state.demandStatInfo.handlingNum})`} key="4" >
								<PendingAdultForm
									data={this.state.doingData}
									pageChangeHandler={this.paginationController}
								/>
							</TabPane>
							<TabPane tab={`${'已完成'}(${this.state.demandStatInfo.completedNum})`} key="5" >
								<FinishmandForm
									data={this.state.finishedData}
									pageChangeHandler={this.paginationController}
								/>
							</TabPane>
							<TabPane tab={<a onClick={this.jumpHref} target="_blank" rel="noopener noreferrer">个人创作({this.state.worksCnt})</a>}  key="6" >
								&nbsp;
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
	const { data,desDemandInfro,desnerInfo } = state.get('QryAllDesignerReducer').toObject();

	return {
		rspInfo,
		actionType,
		data,
		desDemandInfro,
		desnerInfo
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryAllDesigner,
			qryDesignerDemand,
			getDsnerAggregation
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(QryDesignerDetail);