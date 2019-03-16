'use strict';

import * as Immutable from 'immutable';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Form, Icon, Input, Row, Select } from 'antd';

import * as businessRoute from 'business/route';
import * as Constant from 'utils/Constant';
import * as MsgUtil from 'utils/MsgUtil';

import {
	DEAL_STATIC_DATA,
	dealStaticData,
	initAStaticDataForAdd,
	QRY_STATIC_DATA_BY_ID,
	qryStaticDataById,
} from 'action';

class StaticDataEdit extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static propTypes = {
		currentStaticData: PropTypes.object,
		actionType: PropTypes.string.isRequired,
		rspInfo: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		form: PropTypes.object.isRequired,
		route: PropTypes.object.isRequired,
		params: PropTypes.object.isRequired,
	};
	static defaultProps = {
		currentStaticData: {},
	};

	constructor (props, context) {
		super(props, context);
		const { route } = props;
		if (!route) {
			context.router.replace(businessRoute.StaticData);
		}
		const operType = route.path === businessRoute.StaticDataEditById
			? Constant.OPER_TYPE_EDIT
			: Constant.OPER_TYPE_ADD;
		this.state = { operType };
	}

	componentWillMount () {
		const { actions } = this.props;
		const { operType } = this.state;
		if (operType == Constant.OPER_TYPE_EDIT) {
			const { params } = this.props;
			const codeType = params.codeType;
			actions.qryStaticDataById(codeType);
		} else {
			actions.initAStaticDataForAdd();
		}
	}

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType } = nextProps;
		const { params } = this.props;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (`${DEAL_STATIC_DATA}_SUCCESS` === actionType) { //处理完成
					if (rspInfo.resultCode === Constant.REST_OK) {
						let msg = '静态配置成功';
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
						this.context.router.replace(`${businessRoute.StaticData}${params.prepage?`/${params.prepage}`:''}`);
					} else {
						if (this.state.operType == Constant.OPER_TYPE_ADD) {
							MsgUtil.showerror(
								`新增静态配置错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						} else {
							MsgUtil.showerror(
								`修改静态配置错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						}
					}
				} else if (`${QRY_STATIC_DATA_BY_ID}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询静态配置数据失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
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
		const { actions, currentStaticData } = this.props;
		const { operType } = this.state;

		this.props.form.validateFields((errors, editForm) => {
			const afterMergeForm = Immutable.Map(currentStaticData).
				merge(editForm).
				toObject();
			console.log('StaticDataEdit commit formEdit', afterMergeForm);
			if (!!errors) {
				console.log('表单验证失败!!!');
				return;
			}

			actions.dealStaticData(operType, afterMergeForm);
		});
	};

	render () {
		const { getFieldDecorator } = this.props.form;
		const { currentStaticData,params } = this.props;

		const formItemLayout = {
			labelCol: { span: 7 },
			wrapperCol: { span: 14 },
		};

		//codeType: 输入长度, 是否存在
		const CodeTypeProps = getFieldDecorator('codeType', {
			initialValue: currentStaticData.codeType,
			rules: [
				{
					required: true,
					message: '数据编码不能为空',
				},
				{
					whitespace: true,
					pattern: /^[a-zA-Z\d]\w{0,18}[a-zA-Z\d]$/,
					message: '格式不合法: 支持字母,数字,下划线, 长度(2-20)位',
				},
			],
		});

		//数据值
		const CodeValueProps = getFieldDecorator('codeValue', {
			initialValue: currentStaticData.codeValue,
			rules: [
				{ required: true, message: '数据值不能为空' },
				{ max: 150, whitespace: true, message: '最多 150 个字符' },
			],
		});

		//名称
		const CodeNameProps = getFieldDecorator('codeName', {
			initialValue: currentStaticData.codeName,
			rules: [
				{ required: true, message: '名称不能为空' },
				{ max: 255, whitespace: true, message: '最多 255 个字符' },
			],
		});

		//描述
		const CodeDescProps = getFieldDecorator('codeDesc', {
			initialValue: currentStaticData.codeDesc,
			rules: [
				{ max: 255, whitespace: true, message: '最多 255 个字符' },
			],
		});

		//编码别名
		const CodeTypeAliasProps = getFieldDecorator('codeTypeAlias', {
			initialValue: currentStaticData.codeTypeAlias,
			rules: [
				{ max: 255, whitespace: true, message: '最多 255 个字符' },
			],
		});

		//排序
		const SortIdProps = getFieldDecorator('sortId', {
			initialValue: currentStaticData.sortId,
			rules: [
				{
					required: false,
					whitespace: true,
					pattern: /^[0-9]{0,3}$/,
					max: 3,
					message: '格式不合法: 只支持数字, 长度(1-3)位',
				},
			],
		});

		//扩展编码
		const ExternCodeTypeProps = getFieldDecorator('externCodeType', {
			initialValue: currentStaticData.externCodeType,
			rules: [
				{ max: 2000, whitespace: true, message: '最多 2000 个字符' },
			],
		});
		//状态
		const StateProps = getFieldDecorator('state', {
			initialValue: currentStaticData.state
				? currentStaticData.state
				: Constant.STATE_U,
		});

		return (
			<Form >
				<Row>
					<Col span={24} >
						<Link to={`${businessRoute.StaticData}${params.prepage?`/${params.prepage}`:''}`} className="ant-btn" style={{ lineHeight: '25px' }} >
							<Icon type="backward" />
							<span>&nbsp;&nbsp;静态数据配置</span>
						</Link>
					</Col>
				</Row>
				<br /><br /><br /><br />
				<Row>
					<Col span={16} offset={2} >
						<Col span={12} >
							<Form.Item {...formItemLayout} label="数据编码" required hasFeedback >
								{CodeTypeProps(
									<Input
										placeholder="请输入数据编码..."
										disabled={currentStaticData.codeType !=
										null}
									/>,
								)}
							</Form.Item>
						</Col>
						<Col span={12} >
							<Form.Item {...formItemLayout} label="数据值" required hasFeedback >
								{CodeValueProps(
									<Input
										placeholder="请输入数据值..."
										disabled={currentStaticData.codeValue !=
										null}
									/>,
								)}
							</Form.Item>
						</Col>
						<Col span={12} >
							<Form.Item {...formItemLayout} label="名称" required hasFeedback >
								{CodeNameProps(
									<Input placeholder="请输入数据名称" />,
								)}
							</Form.Item>
						</Col>
						<Col span={12} >
							<Form.Item {...formItemLayout} label="描述" >
								{CodeDescProps(
									<Input placeholder="请输入数据描述..." />,
								)}
							</Form.Item>
						</Col>
						<Col span={12} >
							<Form.Item {...formItemLayout} label="编码别名" >
								{CodeTypeAliasProps(
									<Input placeholder="请输入编码别名..." />,
								)}
							</Form.Item>
						</Col>
						<Col span={12} >
							<Form.Item {...formItemLayout} label="排序" >
								{SortIdProps(
									<Input placeholder="请输入排序..." />,
								)}
							</Form.Item>
						</Col>
						<Col span={12} >
							<Form.Item {...formItemLayout} label="状态" required >
								{StateProps(
									<Select >
										<Select.Option value={Constant.STATE_U} >[{Constant.STATE_U}] 正常</Select.Option>
										<Select.Option value={Constant.STATE_E} >[{Constant.STATE_E}] 禁用</Select.Option>
									</Select>,
								)}
							</Form.Item>
						</Col>
						<Col span={12} >
							<Form.Item {...formItemLayout} label="扩展编码" >
								{ExternCodeTypeProps(
									<Input placeholder="扩展编码..." />,
								)}
							</Form.Item>

						</Col>
					</Col>
				</Row>
				<Row style={{ height: 40 }} />
				<Row>
					<Col span={16} offset={2} style={{ textAlign: 'center' }} >
						<Button type="primary" onClick={this.handleSubmit} >提交</Button>&nbsp;&nbsp;
						<Button type="primary" onClick={this.handleReset} >重置</Button>&nbsp;&nbsp;
					</Col>
				</Row>
			</Form>
		);
	}
}

const mapStateToProps = (state) => {
	const { actionType, rspInfo } = state.get('RootService').toObject();
	const { currentStaticData } = state.get('StaticDataaAdminService').
		toObject();
	return { currentStaticData, rspInfo, actionType };
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators(
			{ qryStaticDataById, dealStaticData, initAStaticDataForAdd },
			dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(StaticDataEdit));
