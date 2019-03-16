'use strict';

import * as Immutable from 'immutable';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Form, Icon, Input, Row, Select } from 'antd';

import * as MsgUtil from 'utils/MsgUtil';
import * as Constant from 'utils/Constant';
import * as businessRoute from 'business/route';
import {
	ENTITY_DEAL_ENTITY,
	Edit_DEAL_ENTITY,
	QRY_ENTITY_BY_ID,
	qryEntityById,
	initAEntityForAdd,
	dealEntity,
	EditEntity
} from './action';


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
		currentMenus: PropTypes.object.isRequired,
		sysEntity: PropTypes.array.isRequired,
		params: PropTypes.object.isRequired,
	};

	static defaultProps = {
		currentMenus: {},
	};


	constructor (props, context) {
		super(props, context);
		const { route } = props;

		if (!route) {
			context.router.replace(businessRoute.EntityAdmin);
		}

		const operType = route.path.split(':')[0] === `${businessRoute.EntityEdit}/`
			? Constant.OPER_TYPE_EDIT
			: Constant.OPER_TYPE_ADD;
		const disabled = route.path === businessRoute.EntityEdit  ? true : false;

		this.state = {
			operType,
			currentPage: 1,//当前选中的分页,
			disabled
		};
	}
	componentWillMount(){
		const { actions,params } =this.props;
		actions.qryEntityById(params.entity);
	}

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType } = nextProps;
		const { params } = this.props;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (`${ENTITY_DEAL_ENTITY}_SUCCESS` === actionType) { //处理完成
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
						this.context.router.replace(`${businessRoute.EntityAdmin}${params.prepage?`/${params.prepage}`:''}`);
					} else {
						if (this.state.operType === Constant.OPER_TYPE_ADD) {
							MsgUtil.showerror(
								`新增权限实体失败: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						} else {
							MsgUtil.showerror(
								`修改权限实体失败,错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						}
					}
				}  else if (`${Edit_DEAL_ENTITY}_SUCCESS` === actionType) {

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
						this.context.router.replace(`${businessRoute.EntityAdmin}${params.prepage?`/${params.prepage}`:''}`);
					}


				} else if (`${QRY_ENTITY_BY_ID}_SUCCESS` === actionType) {

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
		const { actions, currentMenus } = this.props;
		const { operType } = this.state;
		this.props.form.validateFields((errors, editForm) => {

			const afterMergeForm = Immutable.Map(currentMenus).merge(editForm).toObject();
			if (!!errors) {
				console.log('表单验证失败!!!');
				return;
			}
			console.log(operType, afterMergeForm);
 			actions.EditEntity(operType, afterMergeForm);
		});
	};


	 handleChange = (value) => {
	 	console.log(`selected ${value}`);

	};
	render () {
		const { getFieldDecorator } = this.props.form;
		const {  operType } = this.state;
		const { params } = this.props;
		const { currentMenus, sysEntity, } = this.props;

		if ( operType == 1 ) {
			// currentMenus={};
			// sysEntity=[];
		}


		const formItemLayout = {
			labelCol: { span: 7 },
			wrapperCol: { span: 14 },
		};
		//menuTitle 菜单标题
		const menuTitleProps = getFieldDecorator('menuTitle', {
			initialValue: currentMenus.menuTitle,
			rules: [
				{
					required: true,
					message: '菜单标题不能为空',
				},
				{
					whitespace: true,
					message: '格式不合法: 支持字母,数字,下划线, 长度(2-20)位',
				},
			],
		});

		//模块名
		const moduleNameProps = getFieldDecorator('moduleName', {
			initialValue: currentMenus.moduleName,
		});

		//menuType 菜单类型
		const menuTypeProps = getFieldDecorator('menuType', {
			initialValue: currentMenus.menuType,
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

		//菜单url
		const menuURLProps = getFieldDecorator('url', {
			initialValue: currentMenus.url,
			rules: [
				{
					required: false,
					message: '菜单url',
				},
				{
					whitespace: true,
				},
			],
		});

		//图片
		const imageUrlProps = getFieldDecorator('imageUrl', {
			initialValue: currentMenus.imageUrl,
		});
		//父菜单Id
		const parentMenuIdProps = getFieldDecorator('parentMenuId', {
			initialValue: currentMenus.parentMenuId,
		});

		const statProps = getFieldDecorator('state', {
			initialValue: currentMenus.state || Constant.STATE_U,
		});

		//排序
		const sortIdProps = getFieldDecorator('sortId', {
			initialValue: currentMenus.sortId,
			rules: [
				{
					required: false,
					message: '排序ID',
				},
			],
		});

		//备注
		const remarkProps = getFieldDecorator('remark', {
			initialValue: currentMenus.remark,
			rules: [
				{ max: 200, whitespace: true, message: '最多 200 个字符' },
			],
		});

		return (
			<div>
				<Row>
					<Col span={16} >
						<Link to={`${businessRoute.EntityAdmin}${params.prepage?`/${params.prepage}`:''}`} className="ant-btn" style={{ lineHeight: '25px' }} >
							<Icon type="backward" />
							<span>&nbsp;&nbsp;返回菜单管理</span>
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
											<Form.Item {...formItemLayout} label="菜单标题" required >
												{menuTitleProps(
													<Input type="text" defaultValue="请输入菜单标题" />
												)}
											</Form.Item>
										</Col>

										<Col span={12} >
											<Form.Item {...formItemLayout} label="模块名"  >
												{moduleNameProps(
													<Input type="text" defaultValue="模块名" />
												)}
											</Form.Item>
										</Col>
									</Form.Item>

									<Form.Item>
										<Col span={12} >
											<Form.Item {...formItemLayout} label="菜单类型"  >
												{menuTypeProps(
													<Input type="text" defaultValue="请输入菜单类型" />
												)}
											</Form.Item>
										</Col>

										<Col span={12} >
											<Form.Item {...formItemLayout} label="菜单URL"  >
												{menuURLProps(
													<Input type="text" defaultValue="请输入菜单URL" />
												)}
											</Form.Item>
										</Col>
									</Form.Item>

									<Form.Item>
										<Col span={12} >
											<Form.Item {...formItemLayout} label="图片"  >
												{imageUrlProps(
													<Input type="text" defaultValue="请输入图片" />
												)}
											</Form.Item>
										</Col>
										<Col span={12} >
											<Form.Item {...formItemLayout} label="父菜单Id"  >
												{parentMenuIdProps(
													<Input type="text" defaultValue="请输入父菜单Id" />
												)}
											</Form.Item>
										</Col>
									</Form.Item>

									<Form.Item>
										<Col span={12} >
											<Form.Item {...formItemLayout} label="状态"  >
												{statProps(
													<Select
														id="entState"
														size="large"
														defaultValue={this.state.currentMenus}
													>
														<Select.Option value="U" >[U] 正常</Select.Option>
														<Select.Option value="E" >[E] 禁用</Select.Option>
													</Select>,
												)}
											</Form.Item>
										</Col>
										<Col span={12} >
											<Form.Item {...formItemLayout} label="排序"  >
												{sortIdProps(
													<Input type="text" defaultValue="排序ID" />
												)}
											</Form.Item>
										</Col>
									</Form.Item>

									<Form.Item>
										<Col span={12} >
											<Form.Item {...formItemLayout} label="备注" >
												{remarkProps(
													<Input  type="textArea"  rows="4" style={{ height: 60 }} />
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
	const { currentEntity,  currentMenus, sysEntity } = state.get('entityadmin').toObject();
	return {
		currentEntity: currentEntity ? currentEntity : {},
		rspInfo,
		actionType,
		currentMenus,
		sysEntity,
 	};
};

const mapDispatchToProps = (dispatch) => {
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(EntityEdit));
