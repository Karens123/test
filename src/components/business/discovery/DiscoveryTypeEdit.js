'use strict';

import * as Immutable from 'immutable';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Form, Icon, Input, Row, Select } from 'antd';
import * as Constant from 'utils/Constant';
import * as MsgUtil from 'utils/MsgUtil';
import * as businessRoute from 'business/route';

import {
	DEAL_DISCOVERY_TYPE,
	dealDiscoveryType,
	initADiscoveryTypeForAdd,
	QRY_DISCOVERY_TYPE_BY_ID,
	qryDiscoveryTypeById,
} from 'action';

const FormItem = Form.Item;
const Option = Select.Option;

class DiscoveryTypeEdit extends React.Component {
    //检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static propTypes = {
		currentDiscoveryType: PropTypes.object.isRequired,
		actionType: PropTypes.string.isRequired,
		actions: PropTypes.object.isRequired,
		rspInfo: PropTypes.object.isRequired,
		route: PropTypes.object.isRequired,
		params: PropTypes.object.isRequired,
		form: PropTypes.object.isRequired,
	};

	constructor (props) {
		super(props);
		const { route, actions, params } = props;
		if (!route) {
			this.context.router.replace(businessRoute.DiscoveryTypeAdmin);
		}
		const operType = route.path === businessRoute.DiscoveryTypeEditById
			? Constant.OPER_TYPE_EDIT
			: Constant.OPER_TYPE_ADD;
		this.state = { operType };

		if (operType == Constant.OPER_TYPE_EDIT) {
			const discoveryTypeId = params.discoveryTypeId;
			actions.qryDiscoveryTypeById(discoveryTypeId);
		} else {
			actions.initADiscoveryTypeForAdd();
		}
	}

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (`${DEAL_DISCOVERY_TYPE}_SUCCESS` === actionType) { //处理完成
					if (rspInfo.resultCode === Constant.REST_OK) {
						let msg = '发现类型成功';
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
						this.context.router.replace(
							businessRoute.DiscoveryTypeAdmin);
					} else {
						if (this.state.operType == Constant.OPER_TYPE_ADD) {
							MsgUtil.showerror(
								`新增发现类型.错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						} else {
							MsgUtil.showerror(
								`修改发现类型.错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						}
					}
				} else if (`${QRY_DISCOVERY_TYPE_BY_ID}_SUCCESS` ===
					actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询发现类型信息失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
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
		const { actions, currentDiscoveryType } = this.props;
		const { operType } = this.state;

		this.props.form.validateFields((errors, editForm) => {
			if (!!errors) {
				console.log('表单验证失败!!!');
				return;
			}
			const afterMergeForm = Immutable.Map(currentDiscoveryType).
				merge(editForm).
				toObject();
			actions.dealDiscoveryType(operType, afterMergeForm);
		});
	};

	render () {
		const { getFieldDecorator } = this.props.form;
		let { currentDiscoveryType } = this.props;
		if (!currentDiscoveryType) {
			currentDiscoveryType={};
		}

		//ant-desigen中的名称和内容各占多少列
		const formItemLayout = {
			labelCol: { span: 10 },
			wrapperCol: { span: 14 },
		};

		//发现类型id
		getFieldDecorator('discoveryTypeId', {
			initialValue: currentDiscoveryType.discoveryTypeId,
			rules: [
				{
					required: this.state === Constant.OPER_TYPE_EDIT,
					message: '发现类型id',
				},
			],
		});

		//发现名称
		const nameProps = getFieldDecorator('name', {
			initialValue: currentDiscoveryType.name,
			rules: [
				{ required: true, min: 1, message: '发现名称' },
				{ whitespace: true, max: 50, message: '最多输入50个字符' },
			],
		});

		//发现分辨率
		const resolutionProps = getFieldDecorator('resolution', {
			initialValue: currentDiscoveryType.resolution,
			rules: [
				{ whitespace: false, message: '请输入分辨率（字符）' },
			],
		});

		//发现样式
		const styleProps = getFieldDecorator('style', {
			initialValue: currentDiscoveryType.style,
			rules: [
				{
					whitespace: false,
					pattern: /^[0-9]{0,3}$/,
					message: '格式不合法: 只支持数字, 长度(1-3)位',
				},
			],
		});

		//发现宽度
		const widthProps = getFieldDecorator('width', {
			initialValue: currentDiscoveryType.width,
			rules: [
				{
					whitespace: false,
					pattern: /^[0-9]{0,3}$/,
					message: '格式不合法: 只支持数字, 长度(1-3)位',
				},
			],
		});

		//发现排序
		const sortIdProps = getFieldDecorator('sortId', {
			initialValue: currentDiscoveryType.sortId,
			rules: [
				{
					whitespace: false,
					pattern: /^[0-9]{0,3}$/,
					message: '格式不合法: 只支持数字, 长度(1-3)位',
				},
			],
		});

		//发现高度
		const heightProps = getFieldDecorator('height', {
			initialValue: currentDiscoveryType.height,
			rules: [
				{
					whitespace: false,
					pattern: /^[0-9]{0,3}$/,
					message: '格式不合法: 只支持数字, 长度(1-3)位',
				},
			],
		});

		const stateProps = getFieldDecorator('state', {
			initialValue: currentDiscoveryType.state
				? currentDiscoveryType.state
				: Constant.STATE_U,
			rules: [
				{ required: true, min: 1, message: '发现状态' },
			],
		});

		//备注
		const remarkProps = getFieldDecorator('remark', {
			initialValue: currentDiscoveryType.remark,
			rules: [{ max: 2000, whitespace: true, message: '最多 2000 个字符' },],
		});

		return (
			<Form>
				<Row>
					<Col span={24} >
						<Link to={businessRoute.DiscoveryTypeAdmin} className="ant-btn" style={{ lineHeight: '25px' }}>
							<Icon type="backward" />
							<span>&nbsp;&nbsp;发现配置</span>
						</Link>
					</Col>
				</Row><br /><br /><br />
				<Row>
					<Col span={16} offset={1} >
						<Col span={12} style={{ height: 54 }} >
							<FormItem {...formItemLayout} label="发现名称" >
								{nameProps(
									<Input type="text" size="large" placeholder="输入发现名称" />,
								)}
							</FormItem>
						</Col>
						<Col span={12} style={{ height: 54 }} >
							<FormItem {...formItemLayout} label="发现分辨率" >
								{resolutionProps(
									<Input type="text" size="large" placeholder="输入发现分辨率" />,
								)}
							</FormItem>
						</Col>
						<Col span={12} style={{ height: 54 }} >
							<FormItem {...formItemLayout} label="&nbsp;&nbsp;发现样式" >
								{styleProps(
									<Input type="text" size="large" placeholder="样式(输入1到5一个数字)" />,
								)}
							</FormItem>
						</Col>
						<Col span={12} style={{ height: 54 }} >
							<FormItem {...formItemLayout} label="宽度(mm)" >
								{widthProps(
									<Input type="text" size="large" placeholder="宽度(输入数字)" />,
								)}
							</FormItem>
						</Col>
						<Col span={12} style={{ height: 54 }} >
							<FormItem {...formItemLayout} label="排序" >
								{sortIdProps(
									<Input type="text" size="large" placeholder="高度(输入数字)" />,
								)}
							</FormItem>
						</Col>
						<Col span={12} style={{ height: 54 }} >
							<FormItem {...formItemLayout} label="高度(mm)" >
								{heightProps(
									<Input type="text" size="large" placeholder="高度(输入数字)" />,
								)}
							</FormItem>
						</Col>
						<Col span={12} >
							<FormItem {...formItemLayout} label="状态" >
								{stateProps(
									<Select style={{ width: '100%' }} >
										<Option value="U" >[U] 正常</Option>
										<Option value="E" >[E] 禁用</Option>
									</Select>,
								)}
							</FormItem>
						</Col>
						<Col span={24} >
							<FormItem {...formItemLayout} label="备注" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} >
								{remarkProps(
									<Input type="textarea" rows={6} style={{ width: '100%' }} />,
								)}
							</FormItem>
						</Col>
					</Col>
				</Row>
				<Row>
					<Col span={16} offset={1} style={{ textAlign: 'center' }} >
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
	const { currentDiscoveryType } = state.get('DiscoveryTypeService').
		toObject();
	return { rspInfo, currentDiscoveryType, actionType };
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators(
			{
				qryDiscoveryTypeById,
				initADiscoveryTypeForAdd,
				dealDiscoveryType,
			},
			dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(DiscoveryTypeEdit));
