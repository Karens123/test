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
	DEAL_H5,
	dealStaticData,
	initAStaticDataForAdd,
	QRY_H5_BY_ID,
	qryStaticDataById,
} from 'action';

class H5Edit extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static propTypes = {
		currentStaticData: PropTypes.object.isRequired,
		actionType: PropTypes.string.isRequired,
		actions: PropTypes.object.isRequired,
		rspInfo: PropTypes.object.isRequired,
		route: PropTypes.object.isRequired,
		params: PropTypes.object.isRequired,
		form: PropTypes.object.isRequired,
	};

	static defaultProps = {
		currentStaticData: {},
	};

	constructor (props, context) {
		super(props, context);
		console.log('props==',props);
		const { route } = props;
		if (!route) {
			context.router.replace(businessRoute.H5Admin);
		}
		const operType = route.path === businessRoute.H5EditById
			? Constant.OPER_TYPE_EDIT
			: Constant.OPER_TYPE_ADD;

		this.state = { operType };
	}

	componentWillMount () {
		const { actions, params } = this.props;
		const { operType } = this.state;
		if (operType == Constant.OPER_TYPE_EDIT) {
			actions.qryStaticDataById(params.codeType);
		} else {
			actions.initAStaticDataForAdd();
		}
	}

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (`${DEAL_H5}_SUCCESS` === actionType) { //处理完成
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
						this.context.router.replace(businessRoute.H5Admin);
					} else {
						if (this.state.operType == Constant.OPER_TYPE_ADD) {
							MsgUtil.showerror(
								`新增静态配置错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						} else {
							MsgUtil.showerror(
								`修改H5页面配置错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						}
					}
				} else if (`${QRY_H5_BY_ID}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询H5页面配置数据失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
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
			if (!!errors) {
				console.log('表单验证失败!!!');
				return;
			}

			actions.dealStaticData(operType, afterMergeForm);
		});
	};

	render () {
		const { getFieldDecorator } = this.props.form;
		const { currentStaticData } = this.props;

		const formItemLayout = {
			labelCol: { span: 7 },
			wrapperCol: { span: 12 },
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
			initialValue: 'h5',
		});

		//名称
		const CodeNameProps = getFieldDecorator('codeName', {
			initialValue: currentStaticData.codeName,
			rules: [
				{ required: true, message: '数据值不能为空' },
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
						<Link to={businessRoute.H5Admin} className="ant-btn" style={{ lineHeight: '25px' }} >
							<Icon type="backward" />
							<span>&nbsp;&nbsp;H5页面配置</span>
						</Link>
					</Col>
				</Row>
				<br /><br /><br /><br />
				<Row>
					<Col span={18} offset={2} >
						<Col span={12} >
							<Form.Item {...formItemLayout} label="数据编码" >
								{CodeTypeProps(
									<Input disabled />,
								)}
							</Form.Item>
						</Col>
						<Col span={12} >
							<Form.Item {...formItemLayout} label="数据类型" >
								{CodeValueProps(
									<Input disabled />,
								)}
							</Form.Item>
						</Col>
						<Col span={12} >
							<Form.Item {...formItemLayout} label="数据值" required hasFeedback >
								{CodeNameProps(
									<Input placeholder="请输入数据值" />,
								)}
							</Form.Item>
						</Col>
						<Col span={12} >
							<Form.Item {...formItemLayout} label="简述" >
								{CodeDescProps(
									<Input placeholder="请输入数据简述..." />,
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
					</Col>
				</Row>
				<Row style={{ height: 40 }} />
				<Row>
					<Col offset={9} >
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
	const { currentStaticData } = state.get('H5AdminService').toObject();

	return { currentStaticData, rspInfo, actionType };
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators(
			{ qryStaticDataById, dealStaticData, initAStaticDataForAdd },
			dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	Form.create()(H5Edit));
