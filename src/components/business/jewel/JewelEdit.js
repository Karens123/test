'use strict';

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import $ from 'jquery';
import { Button, Col, Form, Icon, Input, Row, Select } from 'antd';
import * as Constant from 'utils/Constant';
import * as MsgUtil from 'utils/MsgUtil';
import * as actions from 'action';
import * as businessRoute from '../route';


const FormItem = Form.Item;
const Option = Select.Option;

class JewelEdit extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		actionType: PropTypes.string.isRequired,
		rspInfo: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		form: PropTypes.object.isRequired,
		route: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		routeParams: PropTypes.string.isRequired,
		jewelInfoList: PropTypes.array.isRequired,
		params: PropTypes.object.isRequired,
	};

	static defaultProps = {
	};

	constructor (props) {
		super(props);
		const {  route } = this.props;
		const pathName = /add/.test(this.props.location.pathname);
		const jewelId = this.props.routeParams.edit;

		const operType = pathName === true
			? Constant.OPER_TYPE_ADD
			: Constant.OPER_TYPE_EDIT;

		if (!route) {
			this.context.router.replace(businessRoute.JewelAdmin);
		}
		this.state = {
			SelectValueJewelType: '',
			jewelType: '',
			operType,
			jewelId,
		};
	}

	componentWillMount () {
		const { operType } = this.state;
		const { actions } = this.props;
		//actions.getAllJewelSelectList();
		const jewelInfo={
			jewelInfo: {
				jewelId: this.state.jewelId, }
		};
		if (operType === Constant.OPER_TYPE_EDIT) {
			actions.getAllJewelList(jewelInfo);
		}
	}

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType } = nextProps;
		const { params } = this.props;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (`${actions.EDIT_JEWEL_INFOR}_SUCCESS` === actionType) {
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
						this.context.router.replace(`${businessRoute.JewelAdmin}${params.prepage?`/${params.prepage}`:''}`);
					} else {
						if (this.state.operType == Constant.OPER_TYPE_ADD) {
							MsgUtil.showerror(
								`新增珠宝信息.错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						} else {
							MsgUtil.showerror(
								`修改珠宝信息.错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						}
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
		const { actions,jewelInfoList } = this.props;
		let currentJewelData={};
		for (const ist  in jewelInfoList) {
			if (jewelInfoList[ist].jewelId == this.state.jewelId ) {
				currentJewelData=jewelInfoList[ist];
			}
		}

		if (currentJewelData == undefined) {
			currentJewelData = {};
		}
		const { operType } = this.state;
		const formEditPord = this.props.form.getFieldsValue();

		let jewelType = $.trim(formEditPord.jewelType);
		const jewelId = $.trim(formEditPord.jewelId);

		//编辑与新增共用，新增时获取的字符
		if (jewelId == '珠宝ID') {
			formEditPord.jewelId = null;
		}
		switch (jewelType) {
			case '宝石': {
				jewelType = 1;
				break;
			}
			case '玉石': {
				jewelType = 2;
				break;
			}
			case '彩石': {
				jewelType = 3;
				break;
			}
				break;
			default:
		}

		formEditPord.jewelType = jewelType;
		let newPordData = [];
		newPordData = Object.assign(currentJewelData, formEditPord);
		this.props.form.validateFields((errors) => {
			if (!!errors) {
				console.log('表单验证失败!!!');
				return;
			}
			console.log(newPordData);
			actions.editJewel(newPordData, operType);
		});
	};

	//珠宝类型
	handleChange_JewelType = (value) => {
		this.setState({
			SelectValueJewelType: value,
		});
	};

	render () {
		//ant-desigen定义的
		const { getFieldDecorator } = this.props.form;
		const { jewelId } = this.state;
		const NewAddJewel = this.props.location.pathname.includes('/add');

		const { jewelInfoList,params } = this.props;
		console.log('jewelInfoList', jewelInfoList);
		let currentJewelData={};
		for (const ist  in jewelInfoList) {
			 if (jewelInfoList[ist].jewelId == jewelId ) {
				 currentJewelData=jewelInfoList[ist];
			 }
		 }


		let jewelType = currentJewelData.jewelType;
		switch (jewelType) {
			case 1: {
				jewelType = '宝石';
				break;
			}
			case 2: {
				jewelType = '玉石';
				break;
			}
			case 3: {
				jewelType = '彩石';
				break;
			}
		}

		//ant-desigen中的名称和内容各占多少列
		const formItemLayout = {
			labelCol: { span: 30 },
			wrapperCol: { span: 64 },
		};

		//ant-desigen中教验表单

		//珠宝类型
		const jeweltypenumber = getFieldDecorator('jewelType', {
			initialValue: jewelType,
		});

		//珠宝长度
		const ProdLen = getFieldDecorator('length', {
			initialValue: currentJewelData.length,
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

		//产品名称
		const jewelName = getFieldDecorator('jewelName', {
			initialValue: currentJewelData.jewelName,
			rules: [
				{ required: true, min: 1, message: '请填写产品型号' },
				{ whitespace: true, max: 20, message: '最多20个字' },
			],
		});

		//产品宽度
		const ProdWidth = getFieldDecorator('width', {
			initialValue: currentJewelData.width,
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

		//珠宝型号
		const ProdName = getFieldDecorator('jewelModelnum', {
			initialValue: currentJewelData.jewelModelnum,
			rules: [
				{
					required: true,
					min: 1,
					message: '请填写珠宝型号',
				},
				{
					whitespace: true,
					pattern: /^[a-zA-Z\d]\w{0,18}[a-zA-Z\d]$/,
					message: '格式不合法: 支持字母,数字,下划线, 长度(2-20)位',
				},
			],
		});

		//珠宝高度
		const ProdHeight = getFieldDecorator('height', {
			initialValue: currentJewelData.height,
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

		//珠宝重量
		const PordWegiht = getFieldDecorator('weight', {
			initialValue: currentJewelData.weight,
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
		const Prodremak = getFieldDecorator('remark', {
			initialValue: currentJewelData.remark,
			rules: [
				{ max: 2000, whitespace: true, message: '最多 2000 个字符' },
			],
		});

		//珠宝 jewelId
		let jewelIdValue = '';
		this.state.operType == Constant.OPER_TYPE_ADD
			? jewelIdValue = '珠宝ID'
			: jewelIdValue = currentJewelData.jewelId;
		const Pordid = getFieldDecorator('jewelId', {
			initialValue: jewelIdValue,
			rules: [
				{ required: false, },
			],
		});

		return (
			<div>
				<Row>
					<Col span={16} >
						<Link to={`${businessRoute.JewelAdmin}${params.prepage?`/${params.prepage}`:''}`} className="ant-btn" style={{ lineHeight: '25px' }} >
							<Icon type="backward" />
							<span>&nbsp;&nbsp;珠宝配置</span>
						</Link>
					</Col>
				</Row>

				<br />
				<br />
				<br />
				<Row>
					<Col offset={3} >
						<Form inline >
							<FormItem {...formItemLayout} label="珠宝名称" >
								{jewelName(
									<Input type="text" size="large" style={{ width: 225 }} placeholder="珠宝名称" />,
								)}
							</FormItem>

							<FormItem {...formItemLayout} label="长度(mm)" >
								{ProdLen(
									<Input type="text" size="large" style={{ width: 225 }} placeholder="长度(输入数字)" />,
								)}
							</FormItem>
							<br />
							<br />
							<FormItem {...formItemLayout} label="珠宝型号" >
								{ProdName(
									<Input type="text" size="large" style={{ width: 225 }} placeholder="材质" />)}
							</FormItem>

							<FormItem {...formItemLayout} label="宽度(mm)" >
								{ProdWidth(
									<Input type="text" size="large" style={{ width: 225 }} placeholder="宽度(输入数字)" />,
								)}
							</FormItem>
							<br /> <br /> &nbsp;&nbsp;&nbsp;
							<FormItem {...formItemLayout} label="珠宝类型" >
								{jeweltypenumber(
									<Select filterOption={false} placeholder="请选择" onChange={this.handleChange_JewelType} style={{ width: 225 }} >
										<Option value="0" >请选择</Option>
										<Option value="1" >宝石</Option>
										<Option value="2" >玉石</Option>
										<Option value="3" >彩石</Option>
									</Select>)}
							</FormItem>

							<FormItem {...formItemLayout} label="高度(mm)" >
								{ProdHeight(
									<Input type="text" size="large" style={{ width: 225 }} placeholder="高度(输入数字)" />,
								)}
							</FormItem>
							<br />
							<br />
							&nbsp;&nbsp;&nbsp;
							<FormItem {...formItemLayout} label="&nbsp;&nbsp;重量(g)" >
								{PordWegiht(
									<Input type="text" size="large" style={{ width: 225 }} placeholder="重量(输入数字)" />,
								)
								}
							</FormItem>

							<FormItem {...formItemLayout} label="&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;珠宝id" >
								{Pordid(
									<Input type="text" size="large" style={{ width: 225 }} disabled placeholder="珠宝id" />)
								}
							</FormItem>
							<br />
							<br />
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<FormItem {...formItemLayout} label="备注" style={{ verticalAlign: 'top' }} >
								{Prodremak(
									<Input type="textarea" rows={6} style={{ width: 522 }} />)}
							</FormItem>
							<br />
							<br />
							<FormItem>
								<div
									style={{
										textAlign: 'center',
										display: 'block',
										width: 630,
									}}
								>
									<Button type="primary" onClick={this.handleSubmit} >提交</Button>&nbsp;&nbsp;
									<Button type="primary" onClick={this.handleReset} >重置</Button>&nbsp;&nbsp;
								</div>
							</FormItem>
						</Form>
					</Col>
				</Row>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { refreshData, jewelInfoList, staticDataList } = state.get(
		'jewelInfor').toObject();

	return {
		rspInfo,
		refreshData,
		jewelInfoList,
		staticDataList,
		actionType,
	};
};

const mapDispatchToProps = (dispatch) => {
	const { getAllProdList, initProdList, editJewel, getAllJewelSelectList, initCurrentJewel,getAllJewelList } = actions;
	return {
		actions: bindActionCreators({
			getAllProdList,
			initProdList,
			editJewel,
			getAllJewelSelectList,
			initCurrentJewel,
			getAllJewelList,

		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	Form.create()(JewelEdit));
