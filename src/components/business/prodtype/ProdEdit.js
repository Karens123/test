'use strict';

import * as Immutable from 'immutable';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Form, Icon, Input, Row } from 'antd';
import * as businessRoute from 'business/route';
import * as MsgUtil from 'utils/MsgUtil';
import * as Constant from 'utils/Constant';
import MySelect from 'framework/components/Select';

import {
	DEAL_UP_PROD,
	dealUpProd,
	getAllProdMboradTypeSelectList,
	initAUpProdForAdd,
	QRY_UP_PROD_BY_PROD_ID,
	qryUpProdByProdId,
} from 'action';
import {
	getStaticDataByCodeType,
	StaticDataService,
	UP_PROD_TYPE,
} from 'business/common/StaticDataService';

const FormItem = Form.Item;
class ProdEdit extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		currentProd: PropTypes.object,
		staticDataList: PropTypes.array,
		mboardTypeList: PropTypes.array,
		actionType: PropTypes.string.isRequired,
		rspInfo: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		form: PropTypes.object.isRequired,
		route: PropTypes.object.isRequired,
		params: PropTypes.object.isRequired,
	};

	static defaultProps = {
		currentProd: {},
		staticDataList: [],
		mboardTypeList: [],
	};

	constructor (props) {
		super(props);
		const { route } = this.props;
		if (!route) {
			this.context.router.replace(businessRoute.ProdAdmin);
		}
		const operType = route.path === businessRoute.ProdEditById
			? Constant.OPER_TYPE_EDIT
			: Constant.OPER_TYPE_ADD;
		this.state = { operType };
	}

	componentWillMount () {
		const { actions, params } = this.props;
		const { operType } = this.state;

		if (operType === Constant.OPER_TYPE_EDIT) {
			const prodId = params.prodId;
			actions.qryUpProdByProdId(prodId);
		} else {
			actions.initAUpProdForAdd();
		}

		if (!this.props.mboardTypeList ||
			this.props.mboardTypeList.length < 1) {
			actions.getAllProdMboradTypeSelectList();
		}
		if (!this.props.staticDataList ||
			this.props.staticDataList.length < 1) {
			actions.getStaticDataByCodeType(UP_PROD_TYPE);
		}
	}

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType } = nextProps;
		const { params } = this.props;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (`${DEAL_UP_PROD}_SUCCESS` === actionType) { //处理完成
					if (rspInfo.resultCode === Constant.REST_OK) {
						let msg = '产品成功';
						if (this.state.operType == Constant.OPER_TYPE_ADD) {
							msg = `新增${msg}`;
						} else if (this.state.operType ==
							Constant.OPER_TYPE_EDIT) {
							msg = `修改${msg}`;
						} else {
							MsgUtil.showwarning('未知操作');
							return;
						}
						MsgUtil.showinfo(msg);
						this.context.router.replace(`${businessRoute.ProdAdmin}${params.prepage?`/${params.prepage}`:''}`);
					} else {
						if (this.state.operType == Constant.OPER_TYPE_ADD) {
							MsgUtil.showerror(
								`新增产品信息.错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						} else {
							MsgUtil.showerror(
								`修改产品信息.错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						}
					}
				} else if (`${QRY_UP_PROD_BY_PROD_ID}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询产品信息失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				}
			}
		}
	}

	//Form reset
	handleReset = (e) => {
		e.preventDefault();
		this.props.form.resetFields();
	};

	handleSubmit = (e) => {
		e.preventDefault();
		const { actions, currentProd } = this.props;
		const { operType } = this.state;
		this.props.form.validateFields((errors, editForm) => {
			if (!!errors) {
				console.log('表单验证失败!!!');
				return;
			}
			const afterMergeForm = Immutable.Map(currentProd).
				merge(editForm).
				toObject();
			actions.dealUpProd(operType, [afterMergeForm]);
		});
	};

	render () {
		//ant-desigen定义的
		const { getFieldDecorator } = this.props.form;
		const { staticDataList, mboardTypeList, currentProd,params } = this.props;

		//ant-desigen中的名称和内容各占多少列
		const formItemLayout = {
			labelCol: { span: 10 },
			wrapperCol: { span: 14 },
		};

		//产品类型
		const ProdTypeProp = getFieldDecorator('prodType', {
			initialValue: currentProd.prodType && String(currentProd.prodType),
			placeholder: '请选择产品类型',
			rules: [
				{ required: true, message: '请选择产品类型' },
			],
		});

		//产品长度
		const ProdLenProp = getFieldDecorator('length', {
			initialValue: currentProd.length,
			rules: [
				//必需要同一个大括号里面（一个对象）
				{
					required: false,
					whitespace: true,
					pattern: /^[0-9]{0,3}$/,
					min: 1,
					max: 3,
					message: '格式不合法: 只支持数字, 长度(1-3)位',
				},
			],
		});

		//产品型号
		const ProdModelnumPorp = getFieldDecorator('prodModelnum', {
			initialValue: currentProd.prodModelnum,
			rules: [
				{
					required: true,
					min: 1,
					whitespace: true,
					message: '至少 1 个字符',
				},
				{
					max: 50,
					whitespace: true,
					message: '最多 50 个字符',
				},
			],
		});

		//产品宽度
		const ProdWidthProp = getFieldDecorator('width', {
			initialValue: currentProd.width,
			rules: [
				{
					required: false,
					whitespace: true,
					pattern: /^[0-9]{0,3}$/,
					min: 1,
					max: 3,
					message: '格式不合法: 只支持数字, 长度(1-3)位',
				},
			],
		});

		//厂商
		const FactoryProp = getFieldDecorator('factory', {
			initialValue: currentProd.factory,
			placeholder: '请填写厂商',
			rules: [
				{
					required: true,
					min: 1,
					whitespace: true,
					message: '至少 1 个字符',
				},
				{
					max: 50,
					whitespace: true,
					message: '最多 50 个字符',
				},
			],
		});

		//主板型号
		const MboardTypeProp = getFieldDecorator('mboardType', {
			initialValue: currentProd.mboardType,
			placeholder: '请选择主板型号',
			filterOption: false,
			rules: [
				{ required: true, message: '请选择主板型号' },
			],
		});

		//产品名称
		const ProdNameProp = getFieldDecorator('prodName', {
			initialValue: currentProd.prodName,
			rules: [
				{
					required: true,
					min: 1,
					whitespace: true,
					message: '至少 1 个字符',
				},
				{
					max: 50,
					whitespace: true,
					message: '最多 50 个字符',
				},
			],
		});

		//产品高度
		const ProdHeighteProp = getFieldDecorator('height', {
			initialValue: currentProd.height,
			rules: [
				{
					required: false,
					whitespace: true,
					pattern: /^[0-9]{0,3}$/,
					min: 1,
					max: 3,
					message: '格式不合法: 只支持数字, 长度(1-3)位',
				},
			],
		});

		//产品重量
		const PordWegihtProp = getFieldDecorator('weight', {
			initialValue: currentProd.weight,
			rules: [
				{
					required: false,
					whitespace: true,
					pattern: /^[0-9]{0,3}$/,
					min: 1,
					max: 3,
					message: '格式不合法: 只支持数字, 长度(1-3)位',
				},
			],
		});

		//备注
		const ProdRemarkProp = getFieldDecorator('remark', {
			initialValue: currentProd.remark,
			rules: [
				{ required: false, message: '真的不打算写点什么吗？' },
				{ max: 2000, whitespace: true, message: '最多 2000 个字符' },
			],
		});

		return (
			<Form>
				<Row>
					<Col span={24} >
						<Link to={`${businessRoute.ProdAdmin}${params.prepage?`/${params.prepage}`:''}`} className="ant-btn" style={{ lineHeight: '25px' }} >
							<Icon type="backward" />
							<span>&nbsp;&nbsp;产品配置</span>
						</Link>
					</Col>
				</Row><br /><br /><br />
				<Row>

					<Col span={15} offset={1} >
						<Col span={12} style={{ height: 54 }} >
							<FormItem {...formItemLayout} label="厂商" >
								{FactoryProp(
									<Input type="text" size="large" placeholder="厂商" />,
								)}
							</FormItem>
						</Col>
						<Col span={11} style={{ height: 54 }} >
							<FormItem {...formItemLayout} label="主板型号" >
								{MboardTypeProp(
									<MySelect selectOptionDataList={mboardTypeList} valueKey="value" placeholder="请选择主板型号" descKey="desc" />,
								)}
							</FormItem>
						</Col>
						<Col span={12} style={{ height: 54 }} >
							<FormItem {...formItemLayout} label="产品名称" >
								{ProdNameProp(
									<Input type="text" size="large" placeholder="产品名称" />,
								)}
							</FormItem>
						</Col>
						<Col span={11} style={{ height: 54 }} >
							<FormItem {...formItemLayout} label="长度(mm)" >
								{ProdLenProp(
									<Input type="text" size="large" placeholder="长度" />,
								)}
							</FormItem>
						</Col>
						<Col span={12} style={{ height: 54 }} >
							<FormItem {...formItemLayout} label="产品型号" >
								{ProdModelnumPorp(
									<Input type="text" size="large" placeholder="产品型号" />,
								)}
							</FormItem>
						</Col>
						<Col span={11} style={{ height: 54 }} >
							<FormItem {...formItemLayout} label="宽度(mm)" >
								{ProdWidthProp(
									<Input type="text" size="large" placeholder="排序..." />,
								)}
							</FormItem>
						</Col>
						<Col span={12} style={{ height: 54 }} >
							<FormItem {...formItemLayout} label="产品类型" >
								{ProdTypeProp(
									<MySelect selectOptionDataList={staticDataList} placeholder="请选择产品类型" valueKey="codeValue" descKey="codeName" />,
								)}
							</FormItem>
						</Col>
						<Col span={11} style={{ height: 54 }} >
							<FormItem {...formItemLayout} label="高度(mm)" >
								{ProdHeighteProp(
									<Input type="text" size="large" placeholder="高度" />,
								)}
							</FormItem>
						</Col>
						<Col span={12} style={{ height: 54 }} >
							<FormItem {...formItemLayout} label="重量(g)" >
								{PordWegihtProp(
									<Input type="text" size="large" placeholder="重量" />,
								)}
							</FormItem>
						</Col>
						<Col span={24} >
							<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="备注" >
								{ProdRemarkProp(
									<Input type="textarea" rows={6} size="large" style={{ width: '100%' }} />,
								)}
							</FormItem>
						</Col>
					</Col>
				</Row>

				<Row>
					<Col span={15} offset={1} style={{ textAlign: 'center' }} >
						<Button type="primary" onClick={this.handleSubmit} >提交</Button>&nbsp;&nbsp;
						<Button type="primary" onClick={this.handleReset} >重置</Button>&nbsp;&nbsp;
					</Col>
				</Row>
			</Form>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { currentProd, mboardTypeList, } = state.get('prodInfor').toObject();
	const { staticDataList } = state.get('StaticDataService').toObject();

	return {
		rspInfo,
		currentProd,
		staticDataList,
		mboardTypeList,
		actionType,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryUpProdByProdId,
			dealUpProd,
			getAllProdMboradTypeSelectList,
			initAUpProdForAdd,
			getStaticDataByCodeType,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	Form.create()(ProdEdit));
