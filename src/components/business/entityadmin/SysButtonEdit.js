'use strict';

import * as Immutable from 'immutable';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Form, Icon, Input, Row, Select } from 'antd';
import * as actions from 'action';

import * as MsgUtil from 'utils/MsgUtil';
import * as Constant from 'utils/Constant';
import * as businessRoute from 'business/route';

class EntityEdit extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static propTypes = {
		actionType: PropTypes.string.isRequired,
		actions: PropTypes.object.isRequired,
		rspInfo: PropTypes.object.isRequired,
		route: PropTypes.object.isRequired,
		form: PropTypes.object.isRequired,
		currentSysbutton: PropTypes.object.isRequired,
	};

	static defaultProps = {
		currentSysbutton: {}
	};


	constructor (props, context) {
		super(props, context);
		const { route } = props;

		if (!route) {
			context.router.replace(businessRoute.buttonAdmin);
		}

		const operType = route.path === businessRoute.SysbuttonEdit
			? Constant.OPER_TYPE_EDIT
			: Constant.OPER_TYPE_ADD;
		this.state = {
			operType,
			currentPage: 1,//当前选中的分页,
		};
	}

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType } = nextProps;
		const { Edit_DEAL_SYS_BUTTON } = actions;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (`${Edit_DEAL_SYS_BUTTON}_SUCCESS` === actionType) { //处理完成
					if (rspInfo.resultCode === Constant.REST_OK) {
						let msg = '功能管理成功';
						if (this.state.operType === Constant.OPER_TYPE_ADD) {
							msg = `新增${msg}`;
						} else if (this.state.operType === Constant.OPER_TYPE_EDIT) {
							msg = `修改${msg}`;
						} else {
							MsgUtil.showwarning('未知操作');
							return;
						}
						MsgUtil.showinfo(msg);
						this.context.router.replace(businessRoute.buttonAdmin);
					} else {
						if (this.state.operType === Constant.OPER_TYPE_ADD) {
							MsgUtil.showerror(
								`新增权限实体失败: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						} else {
							MsgUtil.showerror(
								`修改权限实体失败,错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						}
					}
				}  else if (`${actions.Edit_DEAL_ENTITY}_SUCCESS` === actionType) {

					if (rspInfo.resultCode === Constant.REST_OK) {
						let msg = '权限实体成功';
						if (this.state.operType === Constant.OPER_TYPE_ADD) {
							msg = `新增${msg}`;
						} else if (this.state.operType === Constant.OPER_TYPE_EDIT) {
							msg = `修改${msg}`;
						} else {
							MsgUtil.showwarning('未知操作');
							return;
						}
						MsgUtil.showinfo(msg);
						this.context.router.replace(businessRoute.EntityAdmin);
					}


				} else if (`${actions.QRY_ENTITY_BY_ID}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询权限实体数据失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
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
		const { actions,    currentSysbutton } = this.props;
		const { operType } = this.state;

		console.log('currentSysbutton', currentSysbutton);

		this.props.form.validateFields((errors, editForm) => {
			const afterMergeForm = Immutable.Map(currentSysbutton).merge(editForm).toObject();
			if (!!errors) {
				console.log('表单验证失败!!!');
				return;
			}
 			actions.dealSysButton(operType, afterMergeForm);
		});
	};


	 handleChange = (value) => {
	 	// console.log(`selected ${value}`);

	};
	render () {
		const { getFieldDecorator } = this.props.form;
		const {  operType } = this.state;
		let { currentSysbutton } = this.props;

		let BealoonValue = {
			buttonNameRequired: '',
			menusIdRequired: '',
			buttonIDRequired: '',

		};

		const  initValue = () => {
			if ( operType == Constant.OPER_TYPE_ADD ) {
				currentSysbutton = {};
				BealoonValue = {
					buttonNameRequired: true,
					menusIdRequired: true,
					buttonIDRequired: false,
				};
			} else if (operType == Constant.OPER_TYPE_EDIT || operType == Constant.OPER_TYPE_DELETE) {
				BealoonValue = {
					buttonNameRequired: false,
					menusIdRequired: false,
					buttonIDRequired: true,
				};
			}
			return BealoonValue;
		};

		const formItemLayout = {
			labelCol: { span: 7 },
			wrapperCol: { span: 14 },
		};
		//buttonId 功能

		const buttonIdProps = getFieldDecorator('buttonId', {
			initialValue: currentSysbutton.buttonId,
			rules: [
				{
					required: initValue().buttonIDRequired,
					message: 'buttonId不能为空',
				},
			],
		});

		//功能名称
		const buttonNameProps = getFieldDecorator('buttonName', {
			initialValue: currentSysbutton.buttonName,
			rules: [
				{
					required: initValue().buttonNameRequired,
					message: '菜单类型不能为空',
				},
			],
		});

		//菜单ID
		const menuIdProps = getFieldDecorator('menuId', {
			initialValue: currentSysbutton.menuId,
			rules: [
				{
					required: initValue().menusIdRequired,
					message: '菜单ID不能为空',
				},
			],
		});

		//buttonCode 功能代码
		const buttonCodeProps = getFieldDecorator('buttonCode', {
			initialValue: currentSysbutton.buttonCode,
			rules: [
				{
					required: false,
					message: '菜单类型不能为空',
				},
				{
					whitespace: true,
					message: '格式不合法: 支持字母,数字,下划线, 长度(2-20)位',
				},
			],
		});

		//url
		const urlProps = getFieldDecorator('url', {
			initialValue: currentSysbutton.url,
		});


		const statProps = getFieldDecorator('state', {
			initialValue: currentSysbutton.state || Constant.STATE_U,
		});

		//备注
		const remarkProps = getFieldDecorator('remark', {
			initialValue: currentSysbutton.remark,
			rules: [
				{ max: 200, whitespace: true, message: '最多 200 个字符' },
			],
		});

		return (
			<div>
				<Row>
					<Col span={16} >
						<Link to={businessRoute.buttonAdmin} className="ant-btn" style={{ lineHeight: '25px' }}>
							<Icon type="backward" />
							<span>&nbsp;&nbsp;返回功能管理</span>
						</Link>
					</Col>
				</Row>
				<br /><br /><br />
				<Row>
					<Form>
						<Row>
							<Col span={18} offset={2} >

								<Col>
									<Form.Item>
										<Col span={12} >
											<Form.Item {...formItemLayout} label="菜单ID"  >
												{menuIdProps(
													<Input type="text" defaultValue="请输入菜单ID" />
												)}
											</Form.Item>
										</Col>

										<Col span={12} >
											<Form.Item {...formItemLayout} label="功能名"  >
												{buttonNameProps(
													<Input type="text" defaultValue="功能名" />
												)}
											</Form.Item>
										</Col>
									</Form.Item>

									<Form.Item>
										<Col span={12} >
											<Form.Item {...formItemLayout} label="功能代码"  >
												{buttonCodeProps(
													<Input type="text" defaultValue="功能代码" />
												)}
											</Form.Item>
										</Col>
										<Col span={12} >
											<Form.Item {...formItemLayout} label="功能ID" >
												{buttonIdProps(
													<Input type="text" defaultValue="请输入功能ID" />
												)}
											</Form.Item>
										</Col>

									</Form.Item>

									<Form.Item>
										<Col span={12} >
											<Form.Item {...formItemLayout} label="URL"  >
												{urlProps(
													<Input type="text" defaultValue="请输入urlProps" />
												)}
											</Form.Item>
										</Col>
										<Col span={12} >
											<Form.Item {...formItemLayout} label="状态"  >
												{statProps(
													<Select
														id="entState"
														size="large"
														defaultValue={this.state.currentSysbutton}
													>
														<Select.Option value="U" >[U] 正常</Select.Option>
														<Select.Option value="E" >[E] 禁用</Select.Option>
													</Select>,
												)}
											</Form.Item>
										</Col>
									</Form.Item>

									<Form.Item>

										<Col span={12} >
											<Form.Item {...formItemLayout} label="备注" >
												{remarkProps(
													<Input   type="textArea"  rows="4" style={{ height: 60 }} />
												)}
											</Form.Item>
										</Col>
									</Form.Item>


								</Col>
							</Col>
						</Row>
						<Row style={{ height: 40 }} />&nbsp;
						<Row>
							<Col span={18} offset={2} style={{ textAlign: 'center' }} >
								<Button type="primary" onClick={this.handleSubmit} >提交</Button>&nbsp;&nbsp;
								<Button type="primary" onClick={this.handleReset} >重置</Button>&nbsp;&nbsp;
							</Col>
						</Row>
						<br /> <br />
					</Form>
				</Row>
				<br /><br /><br />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { currentSysbutton, refreshData } = state.get('entityadmin').toObject();
	return {
		rspInfo,
		refreshData,
		currentSysbutton,
		actionType,
 	};
};

const mapDispatchToProps = (dispatch) => {
	const { qryEntityById, initAEntityForAdd,initEditSysButton, dealEntity,EditEntity,dealSysButton,initSysEntityButton } = actions;
	return {
		actions: bindActionCreators(
			{
				initEditSysButton,
				qryEntityById,
				initAEntityForAdd,
				dealEntity,
				EditEntity,
				dealSysButton,
				initSysEntityButton,
			}, dispatch),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(EntityEdit));
