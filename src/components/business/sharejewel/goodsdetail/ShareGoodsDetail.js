'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Col, Row, Table, Tabs, Select, Pagination, Modal, Input, Form, Button } from 'antd';
import { parseDate, parseDateTime } from 'utils/DateUtil';
import * as MsgUtil from 'utils/MsgUtil';
import * as DateUtil from 'src/utils/DateUtil';
import * as WidgetUtil from 'utils/WidgetUtil';
import businessRoute from 'business/route';
import { initOssBufferUploadProps,OSS_UPLOAD_SERVER,OSS_DEFAULT_UPLOAD_FILE_DIR_PATH } from 'utils/UploadUtil';
import * as HttpUtil from 'utils/HttpUtil';
import * as Immutable from 'immutable';
import BackButton from 'business/dreamworks/widget/backbutton';

import BaseInfo from './BaseInfo';
import ButtonGrop from './ButtonGroup';
import Detail from './Detail';
import SkuForm from './SkuForm';
import SkuAddModal from './SkuAddModal';
import './index.less';


import {
	qryShareJewelSkuGroup,
	dealShareJewelGoods,
	qryShareJewelSkuPropDef,
	dealShareJewelSkuPropValue,
	dealShareJewelSku,
	qryShareJewelSku,
	qryShareJewelGoodsDetail,
	dealGoodsNote,
	clear
} from './action';


class ShareGoodsDetail extends React.Component {
	static propTypes = {
		params: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		skuGroup: PropTypes.object.isRequired,
		skuPropDef: PropTypes.object.isRequired,
		goodsInfo: PropTypes.object.isRequired,
		skuList: PropTypes.object.isRequired,
		history: PropTypes.object.isRequired,
		goodsDetail: PropTypes.object.isRequired,
		goodsNoteUrl: PropTypes.object.isRequired,
	};
	constructor (props) {
		super(props);
		const { params } = this.props;
		const { goodsId } = params;
		this.state = {
			goodsNotes: '',
			isEditing: false,
			showModal: false,
			isAdd: !goodsId,
			goodsId,
			skuPropValAddModalVisibility: false,
			propTitle: undefined,
			skuPropValue: undefined,
			skuPropId: undefined,
			skuGroupId: undefined,
			hasQrySkuDef: false,
			ifLoadGoodsInitState: false,
			advertisePicList: [],
		};
	}
	componentDidMount(){
		const { actions } = this.props;
		actions.qryShareJewelSkuGroup();
		const { isAdd } = this.state;
		const { params } = this.props;
		const { goodsId } = params;
		if (goodsId){
		//	qry data;
			console.log('edit mode, qry sku list');
			actions.qryShareJewelSku({
				record: {
					goodsId
				}
			});
			new Promise((resolve,reject) => {
				resolve((() => {
					return actions.qryShareJewelGoodsDetail(goodsId);
				})());
			}).then((res) => {
				return res.payload.promise;
			}).then((res) => {
				if (res.type ==='QRY_SHARE_JEWEL_GOODS_DETAIL_SUCCESS'){
					console.log('qryShareJewelGoodsDetail',res);
					if (res.payload.record){
						actions.qryShareJewelSkuPropDef(res.payload.record.skuGroupId);
						this.updateEditor(res.payload.record.goodsNotes);
					} else {
						MsgUtil.showwarning('网络错误！稍后刷新重试！');
					}
				}
			});
		} else {
			console.warn('did mount warning');
			actions.clear();
		}
	}
	componentWillReceiveProps(nextProps){
		const { params } = nextProps;
		const { goodsId } = params;
		if (goodsId){
			if (!this.props.params.goodsId){
				this.setState({
					isAdd: false,
				},() => {
					const { hasQrySkuDef,isAdd } = this.state;
					const { goodsInfo,actions  } = nextProps;
					console.log('goodsInfo',goodsInfo);
					actions.qryShareJewelSku({
						record: {
							goodsId
						}
					});
					actions.qryShareJewelGoodsDetail(goodsId);
				});
			}
		}
		if (nextProps.goodsDetail){
			const { goodsDetail } = nextProps;
			if (goodsDetail&&goodsDetail.record){
				const { goodsTitle,
					goodsSubTitle,
					goodsNotes,
					dailyRents,
					discountRents,
					salePrice,
					discountPrice,
					skuGroupId,
					goodsPicBeanList,
					productType,
					goodsName,
					goodsNo,
					skuGroupName,
					advertisePic,
					state,
					goodsId,
				} = goodsDetail.record;
				if (!this.props.goodsDetail||this.props.goodsDetail.record.goodsId!==goodsId||goodsId){
					this.setState({
						goodsTitle,
						goodsSubTitle,
						goodsNoteUrl: goodsNotes,
						dailyRents,
						discountRents,
						salePrice,
						discountPrice,
						advertisePicList: this.getAdvertisePicList(advertisePic),
						skuGroupId,
						goodsPicBeanList,
						productType,
						goodsName,
						goodsNo,
						skuGroupName,
						goodsState: state,
					},() => {
						const { goodsNoteUrl } =this.state;
						this.updateEditor(goodsNoteUrl);
					});
				}
			} else {
				MsgUtil.showwarning('网络错误！稍后刷新重试！');
			}
		}
		const { goodsNoteUrl } = nextProps;
		if (goodsNoteUrl){
			this.setState({
				goodsNoteUrl: goodsNoteUrl.goodsNoteUrl
			},() => {
				const { goodsNoteUrl } =this.state;
				this.updateEditor(goodsNoteUrl);
			});
		}
	}
	componentWillUnmount(){
		this.setState({

		});
	}
	getAdvertisePic= (goodsPicBeanList) => {
		let ret='';
		let ifFound=false;
		console.log('getAdvertisePic',goodsPicBeanList);
		Array.isArray(goodsPicBeanList)&&goodsPicBeanList.forEach((val) => {
			if (!ifFound && val.state!==-1){
				ifFound=true;
				ret=val.image||val.url;
			}
		});
		console.log('getAdvertisePic',ret);
		return ret;
	};
	getAdvertisePicList= (advertisePic) => {
		const ret=[];
		ret.push({
			url: advertisePic,
		});
		return ret;
	};
	getSkuPropForm = (list) => {
		const ret=[];
		list&&list.map((val) => {
			ret.push({
				key: val.propTitle,
				val: val.propName.split('|'),
				id: val.skuPropId,
				remark: val.remark,
			});
		});
		return ret;
	};
	goodsNotesHandler = (html) => {
		this.setState({
			goodsNotes: html,
			goodsNotesCopy: this.notesCopy(html)
		},() => {
			const { goodsNotesCopy } = this.state;
			const { actions } = this.props;
			// actions.dealGoodsNote(goodsNotesCopy);
		});

	};
	initState=() => {
		const { params } = this.props;
		const { goodsId } = params;
		this.setState({
			advertisePicList: [],
			dailyRents: undefined,
			discountPrice: undefined,
			discountRents: undefined,
			goodsName: undefined,
			goodsNo: undefined,
			goodsNoteUrl: undefined,
			goodsNotes: undefined,
			goodsPicBeanList: [],
			goodsSubTitle: undefined,
			goodsTitle: undefined,
			salePrice: undefined,
			skuGroupId: undefined,
			skuGroupName: undefined,
		});
	};
	updateEditor = (url) => {
		console.log('updateEditor',url);
		HttpUtil.ThirdPartApi.get(url,{},(body) => {
			console.log('res.payload.record.goodsNote body',body);
			if (body && body.text){
				this.setState({
					goodsNotes: body.text
				},() => {
					console.log('updateEditor done');
				});
			} else {
				MsgUtil.showwarning('????');
			}
		});
	};
	notesCopy=(html) => {
		console.log('notesCopy',html,OSS_UPLOAD_SERVER );
		let ret=html.replace(new RegExp(`${OSS_UPLOAD_SERVER}${OSS_DEFAULT_UPLOAD_FILE_DIR_PATH}/`,'g'),'');
		ret = ret.replace(/\?target=new"/g,'" state="new"');
		console.log('notesCopy',ret);
		return ret;
	};
	editingHandler = (isEditing) => {
		this.setState({ isEditing });
		// console.log('isEditing',isEditing);
	};
	tempHandler = () => {
		const { goodsNotes } = this.state;
		const handlerProps=initOssBufferUploadProps();
		console.log('initOssBufferUploadProps',handlerProps);
		const customHandler=handlerProps.customRequest;
		customHandler({ onError: this.logHandler, onSuccess: this.successHandler, buffer: goodsNotes });
	};
	logHandler = (log,msg) => {
		console.log(msg?msg:'logHandler',log);
	};
	successHandler = (res) => {
		this.logHandler(res,'successHandler');
		console.log(res.url);
		HttpUtil.ThirdPartApi.get(res.url,{},this.logHandler);
	};
	toggleModal = () => {
		const { showModal } = this.state;
		this.setState({
			showModal: !showModal,
		});
	};
	skuChangeHandler =(e) => {
		const skuGroupId = e.target.value;
		const { actions } = this.props;
		this.setState({
			skuGroupId
		},() => {
			actions.qryShareJewelSkuPropDef(skuGroupId);
		});
	};
	skuPropValAddModalVisibilityHandler = (skuPropValAddModalVisibility) => {
		this.setState({
			skuPropValAddModalVisibility
		});
	};
	skuPropValueAddShowModalHandler= (propTitle,id) => {
		this.setState({
			propTitle,
			skuPropId: id,
		},() => {
			this.skuPropValAddModalVisibilityHandler(true);
		});
	};
	skuPropValueAddHandler= () => {
		const { skuPropValue,skuPropId,skuGroupId  } = this.state;
		const { actions } = this.props;
		new Promise((resolve,reject) => {
			resolve((() => {
				return actions.dealShareJewelSkuPropValue({
					newPropValue: skuPropValue,
					skuPropId
				});
			})());
		}).then((res) => {
			return res.payload.promise;
		}).then((res) => {
			if (res.type ==='DEAL_SHARE_JEWEL_SKU_PROP_VALUE_SUCCESS'){
				actions.qryShareJewelSkuPropDef(skuGroupId);
			}
		});

		this.skuPropValAddModalVisibilityHandler(false);
	};
	skuPropValueChangeHandler = (e) => {
		console.log(e.target.value);
		this.setState({
			skuPropValue: e.target.value
		});
	};
	addSkuHandler=(record) => {
		const { actions } = this.props;
		new Promise((resolve,reject) => {
			resolve((() => {
				return actions.dealShareJewelSku({
					record,
					operType: 1,
				});
			})());
		}).then((res) => {
			console.log(res);
			return res.payload.promise;
		}).then((res) => {
			const { params } = this.props;
			const { goodsId } = params;
			if (res.type ==='DEAL_SHARE_JEWEL_SKU_SUCCESS'){
				actions.qryShareJewelSku({
					record: {
						goodsId
					}
				});
			}
		});
	};
	modifySkuHandler=(record) => {
		const { actions } = this.props;
		new Promise((resolve,reject) => {
			resolve((() => {
				return actions.dealShareJewelSku({
					record,
					operType: 2,
				});
			})());
		}).then((res) => {
			console.log(res);
			return res.payload.promise;
		}).then((res) => {
			const { params } = this.props;
			const { goodsId } = params;
			if (res.type ==='DEAL_SHARE_JEWEL_SKU_SUCCESS'){
				actions.qryShareJewelSku({
					record: {
						goodsId
					}
				});
			}
		});
	};
	removeSkuHandler=(skuId) => {
		const { actions } = this.props;
		new Promise((resolve,reject) => {
			resolve((() => {
				return actions.dealShareJewelSku({
					record: {
						skuId,
					},
					operType: 3,
				});
			})());
		}).then((res) => {
			console.log(res);
			return res.payload.promise;
		}).then((res) => {
			const { params } = this.props;
			const { goodsId } = params;
			if (res.type ==='DEAL_SHARE_JEWEL_SKU_SUCCESS'){
				actions.qryShareJewelSku({
					record: {
						goodsId,
					}
				});
			}
		});
	};
	formatImgList=(list) => {
		const ret = [];
		Array.isArray(list)&&list.forEach((val) => {
			ret.push({
				image: val.image,
				state: val.state,
				goodsId: val.goodsId,
				goodsPicId: val.goodsPicId
			});
		});
		return ret;
	};
	addGoodsHandler = () => {
		console.log('addGoodsHandler');
		const { actions,goodsNoteUrl } = this.props;
		const { isAdd,isEditing } = this.state;
		if (isEditing){
			return setTimeout(() => {
				this.editingHandler(false);
				this.addGoodsHandler();
			},100);
		}
		const { goodsTitle,
			goodsSubTitle,
			goodsNotes,
			dailyRents,
			discountRents,
			salePrice,
			discountPrice,
			advertisePic,
			skuGroupId,
			goodsPicBeanList,
			productType,
			goodsName,
			goodsNo,
			advertisePicList,
		} =this.state;
		console.log('skuGroupId',skuGroupId);
		const { params } =this.props;
		const { goodsId } = params;
		const record={
			goodsTitle,
			goodsSubTitle,
			goodsNotes: (goodsNoteUrl&&goodsNoteUrl.goodsNoteUrl)||this.state.goodsNoteUrl,
			dailyRents,
			discountRents,
			salePrice,
			discountPrice,
			advertisePic: this.getAdvertisePic(advertisePicList),
			skuGroupId,
			goodsPicBeanList: this.formatImgList(goodsPicBeanList),
			productType,
			goodsName,
			goodsNo,
		};
		if (goodsId){
			record.goodsId=goodsId;
		}
		console.log('record',record);
		const { goodsNotesCopy } = this.state;
		new Promise((resolve,reject) => {
			resolve(actions.dealGoodsNote(goodsNotesCopy));
		}).then((res) => {
			console.log('testing promise',res);
			return res.payload.promise;
		}).then((res) => {
			console.log('testing promise 2',res);
			return res.payload.goodsNoteUrl;
		}).then((res) => {
			record.goodsNotes=res;
			return actions.dealShareJewelGoods({
				operType: isAdd?1:2,
				record,
			});
		})
		.then((res) => {
			console.log('mark',res);
			if (res.type==='DEAL_SHARE_JEWEL_GOODS'){
				MsgUtil.showwarning('保存成功！');
			} else {
				MsgUtil.showwarning('网络错误！');
			}
			return res.payload.promise;
		})
		.then((res) => {
			console.log(res);
			if (res.type ==='DEAL_SHARE_JEWEL_GOODS_SUCCESS'){
				const { history } = this.props;
				const { params } = this.props;
				const { callbackUrl } = params;
				if (res.payload.record){
					history.push(`${businessRoute.goodsAdminDetailEditBase}/${res.payload.record.goodsId}/${encodeURIComponent(callbackUrl)}`);
				} else {
					MsgUtil.showwarning('网络错误！');
				}
			}
		});
		// new Promise((resolve,reject) => {
		// 	resolve((() => {
		// 		return actions.dealShareJewelGoods({
		// 			operType: isAdd?1:2,
		// 			record,
		// 		});
		// 	})());
		//
		// }).then((res) => {
		// 	console.log('mark',res);
		// 	if (res.type==='DEAL_SHARE_JEWEL_GOODS'){
		// 		MsgUtil.showwarning('保存成功！');
		// 	} else {
		// 		MsgUtil.showwarning('网络错误！');
		// 	}
		// 	return res.payload.promise;
		// }).then((res) => {
		// 	console.log(res);
		// 	if (res.type ==='DEAL_SHARE_JEWEL_GOODS_SUCCESS'){
		// 		const { history } = this.props;
		// 		const { params } = this.props;
		// 		const { callbackUrl } = params;
		// 		if (res.payload.record){
		// 			history.push(`${businessRoute.goodsAdminDetailEditBase}/${res.payload.record.goodsId}/${encodeURIComponent(callbackUrl)}`);
		// 		} else {
		// 			MsgUtil.showwarning('网络错误！');
		// 		}
		// 	}
		// });
	};
	baseInfoCallback= (info) => {
		console.log('baseInfoCallback',info);
		const {
			goodsTitle,
			goodsSubTitle,
			goodsNotes,
			dailyRents,
			discountRents,
			salePrice,
			discountPrice,
			advertisePic,
			skuGroupId,
			goodsPicBeanList,
			productType,
			goodsName,
			goodsNo,
			advertisePicList,
		} = info;
		this.setState({
			goodsTitle,
			goodsSubTitle,
			goodsNotes,
			dailyRents,
			discountRents,
			salePrice,
			discountPrice,
			advertisePic,
			skuGroupId,
			goodsPicBeanList,
			productType,
			goodsName,
			goodsNo,
			advertisePicList,
		});
	};
	removeGoodsHandler= () => {
		const { actions } =this.props;
		MsgUtil.showwarning('暂不支持删除商品，下架商品能达到预期效果！');
	};
	backendGoodsHandler= () => {
		const { actions } =this.props;
		const { params } =this.props;
		const { goodsId } = params;
		const { goodsDetail } = this.props;
		if (goodsDetail&&goodsDetail.record){
			const { state } = goodsDetail.record;
			if ([2].includes(state)){
				new Promise((resolve,reject) => {
					resolve(actions.dealShareJewelGoods({
						operType: 13,
						record: {
							goodsId
						}
					}));
				}).then((res) => {
					console.log('mark',res);
					if (res.type==='DEAL_SHARE_JEWEL_GOODS'){
						MsgUtil.showwarning('下架成功！');
					} else {
						MsgUtil.showwarning('网络错误！');
					}
				});
			} else {
				MsgUtil.showwarning('当前状态下商品不能下架');
			}
		}

	};
	frontendGoodsHandler= () => {
		const { actions } =this.props;
		const { params } =this.props;
		const { goodsId } = params;
		const { goodsDetail } = this.props;
		const { skuList  } = this.props;
		if (skuList&&skuList.records&&!skuList.records.length){
			return MsgUtil.showwarning('没有sku的商品不可上架');
		}
		if (goodsDetail&&goodsDetail.record){
			const { state } = goodsDetail.record;
			if ([0,4].includes(state)){
				new Promise((resolve,reject) => {
					resolve(actions.dealShareJewelGoods({
						operType: 12,
						record: {
							goodsId
						}
					}));
				}).then((res) => {
					console.log('mark',res);
					if (res.type==='DEAL_SHARE_JEWEL_GOODS'){
						MsgUtil.showwarning('上架成功！');
					} else {
						MsgUtil.showwarning('网络错误！');
					}
				});
			} else {
				MsgUtil.showwarning('当前状态下商品不能上架');
			}
		}

	};
	render(){
		const { isEditing,showModal,isAdd,skuPropValAddModalVisibility,propTitle } =this.state;
		const { skuGroup,skuPropDef,skuList  } = this.props;
		const skuListData = (skuList&&[...skuList.records])||[];
		const skuPropForm=this.getSkuPropForm(skuPropDef&&skuPropDef.record);
		const { params } = this.props;
		const { goodsId } = params;
		const {
			goodsTitle,
			goodsSubTitle,
			goodsNotes,
			dailyRents,
			discountRents,
			salePrice,
			discountPrice,
			advertisePic,
			skuGroupId,
			goodsPicBeanList,
			productType,
			goodsName,
			goodsNo,
			skuGroupName,
			advertisePicList
		} = this.state;
		const baseInfoInitState={
			goodsTitle,
			goodsSubTitle,
			goodsNotes,
			dailyRents,
			discountRents,
			salePrice,
			discountPrice,
			advertisePic,
			skuGroupId,
			goodsPicBeanList,
			productType,
			goodsName,
			goodsNo,
			skuGroupName,
			advertisePicList
		};
		const { callbackUrl } = params;

		return (<div className="share-goods-detail-page">
			{/*<div>{JSON.stringify(this.state)}</div>*/}
			{/*<span onClick={this.tempHandler}>test and click</span>*/}
			{
				callbackUrl?
					<div>
						<div>
							<BackButton
								to={`${decodeURIComponent(callbackUrl)}`}
								text={'返回'}
							/>
						</div>
						<br />
					</div>:
					null
			}
			<Modal
				visible={skuPropValAddModalVisibility}
				onCancel={() => {
					this.skuPropValAddModalVisibilityHandler(false);
				}}
				onOk={this.skuPropValueAddHandler}
			>
				<div className="text-center">
					即将为<b>{propTitle}</b>添加属性
				</div>
				<Input
					onChange={this.skuPropValueChangeHandler}
				/>
			</Modal>
			<SkuAddModal
				isShow={showModal}
				toggleShow={this.toggleModal}
				form={skuPropForm}
				addCb={this.addSkuHandler}
				goodsId={goodsId}

			/>
			<BaseInfo
				skuGroupData={(skuGroup&&skuGroup.records)||[]}
				skuChangeHandler={this.skuChangeHandler}
				isAdd={isAdd}
				goodsId={goodsId}
				callback={this.baseInfoCallback}
				initState={baseInfoInitState}
				skuPropForm={skuPropForm}
				addHandler={this.skuPropValueAddShowModalHandler}
			/>
			<Detail
				hook={this.goodsNotesHandler}
				editingHandler={this.editingHandler}
				initData={goodsNotes||'<p>请输入详情</p>'}
				isEditing={isEditing}
			/>
			<br />
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<button onClick={this.addGoodsHandler} className="ant-btn ant-btn-primary ant-btn-lg">保存商品</button>
			</div>
			<br />
			{isAdd?null
				:(<div>
					<SkuForm
						toggleShow={this.toggleModal}
						form={skuPropForm}
						detailData={skuListData}
						add={this.skuPropValueAddShowModalHandler}
						modifySkuHandler={this.modifySkuHandler}
						removeSkuHandler={this.removeSkuHandler}
					/>
					<br />
					<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
						<Button
							type="dashed"
							onClick={this.removeGoodsHandler}
							className="ant-btn ant-btn-primary ant-btn-lg"
						>删除商品</Button>
						{1?'':null}
						<Button
							onClick={this.backendGoodsHandler}
							className="ant-btn ant-btn-primary ant-btn-lg"
							type="primary"
						>下架商品</Button>
						{1?'':null}
						<Button
							onClick={this.frontendGoodsHandler}
							className="ant-btn ant-btn-primary ant-btn-lg"
							type="danger"
						>上架商品</Button>
					</div>
				</div>)
			}

		</div>);
	}
}
const mapStateToProps = (state) => {
	const {
		skuGroup,
		dealJewelGoodsInfo,
		skuPropDef,
		skuList,
		dealJewelSkuInfo,
		dealJewelSkuPropInfo,
		goodsInfo,
		goodsDetail,
		goodsNoteUrl,
	} = state.get('ShareJewelGoodsDetailReducer').toObject();
	const stateObje = {
		skuGroup,
		dealJewelGoodsInfo,
		skuPropDef,
		skuList,
		dealJewelSkuInfo,
		dealJewelSkuPropInfo,
		goodsInfo,
		goodsDetail,
		goodsNoteUrl,
	};
	return stateObje;
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryShareJewelSkuGroup,
			dealShareJewelGoods,
			qryShareJewelSkuPropDef,
			dealShareJewelSkuPropValue,
			dealShareJewelSku,
			qryShareJewelSku,
			qryShareJewelGoodsDetail,
			dealGoodsNote,
			clear
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ShareGoodsDetail);