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

class ButtonAdmin extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static propTypes = {
		actionType: PropTypes.string.isRequired,
		actions: PropTypes.object.isRequired,
		rspInfo: PropTypes.object.isRequired,
		route: PropTypes.object.isRequired,
		form: PropTypes.object.isRequired,
		currentSelctEntity: PropTypes.object.isRequired,
		sysEntity: PropTypes.array.isRequired,
	};

	static defaultProps = {
		currentSelctEntity: {},
	};


	constructor (props, context) {
		super(props, context);
		const { route } = props;

		if (!route) {
			context.router.replace(businessRoute.EntityAdmin);
		}
		const operType = route.path === businessRoute.EntityEdit
			? Constant.OPER_TYPE_EDIT
			: Constant.OPER_TYPE_ADD;
		const disabled = route.path === businessRoute.EntityEdit  ? true : false;

		this.state = {
			operType,
			currentPage: 1,//当前选中的分页,
			toggleColMenus: true,
			disabled
		};
	}

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (`${actions.ENTITY_DEAL_ENTITY}_SUCCESS` === actionType) { //处理完成
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
		const { actions, currentSelctEntity, sysEntity } = this.props;
		const { operType } = this.state;
		let item = [];
		this.props.form.validateFields((errors, editForm) => {
			if (currentSelctEntity.length==0){
				item = sysEntity;
			} else {
				item = currentSelctEntity;
			}

			const afterMergeForm = Immutable.Map(item).merge(editForm).toObject();
			if (!!errors) {
				console.log('表单验证失败!!!');
				return;
			}
			console.log('afterMergeForm:', afterMergeForm);
 			actions.EditEntity(operType, afterMergeForm);
		});
	};


	 handleChange = (value) => {
	 	console.log(`selected ${value}`);
	 	if ( value && value === 1) {
	 		this.setState({
				toggleColMenus: true
			});
		} else {
			this.setState({
				toggleColMenus: false
			});
		}
	};
	render () {
		const {  getFieldDecorator } = this.props.form;
		const {  operType } = this.state;
		let { currentSelctEntity, sysEntity } = this.props;
		if ( operType == 1 ) {
			currentSelctEntity={};
			sysEntity=[];
		}
		const formItemLayout = {
			labelCol: { span: 7 },
			wrapperCol: { span: 14 },
		};

		//buttonName 功能名称
		const buttonNameProps = getFieldDecorator('buttonName', {
			initialValue: sysEntity.buttonName,
			rules: [
				{
					required: true,
					message: '功能编码不能为空',
				},
				{
					whitespace: true,
				},
			],
		});

		//菜单ID
		const menuIdProps = getFieldDecorator('menuId', {
			initialValue: sysEntity.menuId,
		});

		//state
		const sysEntityStatProps = getFieldDecorator('state', {
			initialValue: sysEntity.state,
		});

		//sortId
		const sysEntitySortIdProps = getFieldDecorator('sortId', {
			initialValue: sysEntity.sortId,
		});

		//sortId
		const sysEntityRemarkProps = getFieldDecorator('remark', {
			initialValue: sysEntity.remark,
		});

		//buttonCode 功能编码
		const buttonCodeProps = getFieldDecorator('buttonCode', {
			initialValue: sysEntity.buttonCode,
			rules: [
				{
					required: false,
					message: '功能编码不能为空',
				},
				{
					whitespace: true,
				},
			],
		});

		return (
			<div>
				<Row>
					<Col span={16} >
						<Button>
							<Link to="/admin/entityadmin" >
								<Icon type="backward" />
								<span>&nbsp;&nbsp;返回权限实体管理</span>
							</Link>
						</Button>
					</Col>
				</Row>
				<br /><br /><br />
				<Row>
					<Form>
						<Row>
							<Col span={18} offset={2} >
								<Col>
									<Col>
										<Form.Item>
											<Col span={12} >
												<Form.Item {...formItemLayout} label="功能名称"  >
													{buttonNameProps(
														<Input type="text" defaultValue="功能名称" />
													)}
												</Form.Item>
											</Col>

											<Col span={12} >
												<Form.Item {...formItemLayout} label="功能编码" >
													{buttonCodeProps(
														<Input type="text" defaultValue="功能编码" />
													)}
												</Form.Item>
											</Col>
										</Form.Item>

										<Form.Item>
											<Col span={12} >
												<Form.Item {...formItemLayout} label="菜单ID"  >
													{menuIdProps(
														<Input type="text" defaultValue="菜单ID" />
													)}
												</Form.Item>
											</Col>
										</Form.Item>

										<Form.Item>
											<Col span={12} >
												<Form.Item {...formItemLayout} label="状态"  >
													{sysEntityStatProps(
														<Select
															id="entState"
															size="large"
															defaultValue={this.state.currentSelctEntity}
														>
															<Select.Option value="U" >[U] 正常</Select.Option>
															<Select.Option value="E" >[E] 禁用</Select.Option>
														</Select>,
													)}
												</Form.Item>
											</Col>
											<Col span={12} >
												<Form.Item {...formItemLayout} label="排序"  >
													{sysEntitySortIdProps(
														<Input type="text" defaultValue="排序ID" />
													)}
												</Form.Item>
											</Col>
										</Form.Item>

										<Form.Item>
											<Col span={12} >
												<Form.Item {...formItemLayout} label="备注" >
													{sysEntityRemarkProps(
														<Input type="textArea"  rows="4" style={{ height: 60 }} />
													)}
												</Form.Item>
											</Col>
										</Form.Item>
									</Col>

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
	const { entities, currentEntity, refreshData, currentSelctEntity, sysEntity } = state.get('entityadmin').toObject();
	return {
		currentEntity: currentEntity ? currentEntity : {},
		rspInfo,
		refreshData,
		entities,
		actionType,
		currentSelctEntity,
		sysEntity,
 	};
};

const mapDispatchToProps = (dispatch) => {
	const { qryEntityById, initAEntityForAdd, dealEntity,EditEntity } = actions;
	return {
		actions: bindActionCreators(
			{
				qryEntityById,
				initAEntityForAdd,
				dealEntity,
				EditEntity
			}, dispatch),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ButtonAdmin));
