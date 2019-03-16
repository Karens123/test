'use strict';

import * as Immutable from 'immutable';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Form, Icon, Input, Row, Select } from 'antd';
import * as Constant from 'utils/Constant';
import * as MsgUtil from 'utils/MsgUtil';
import * as HttpUtil from 'utils/HttpUtil';
import * as businessRoute from 'business/route';
import {
	DEAL_SYS_USER,
	dealTenant,
	DEAL_TENANT,
	GET_USER_ROLES_BY_USER_ID,
	getUserRolesBySysUserId,
	initASysUserForAdd,
	QRY_SYS_USER_BY_ID,
	qrySysUserById,
	qryTenantByForm
} from 'action';
import { QRY_SYS_ROLE } from 'business/common/SysRoleService';

const Option = Select.Option;

class TenantEdit extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static propTypes = {
		actionType: PropTypes.string.isRequired,
		rspInfo: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		form: PropTypes.object.isRequired,
		route: PropTypes.object.isRequired,
		params: PropTypes.object.isRequired,
	 	 currentSelectTenant: PropTypes.object.isRequired,


	};
	static defaultProps = {
		currentSelectTenant: {},
	};

	constructor (props, context) {
		super(props, context);
		const { route } = props;
		if (!route) {
			this.context.router.replace(businessRoute.Tenantadmin);
		}
		const operType = route.path === businessRoute.TenantEdit
			? Constant.OPER_TYPE_EDIT
			: Constant.OPER_TYPE_ADD;
		this.state = { operType };
	}

	componentWillMount () {
		const { actions } = this.props;
		const { operType } = this.state;


		if (operType == Constant.OPER_TYPE_EDIT) {
			const { params } = this.props;
			const userId = params.userId;
			actions.qryTenantByForm();
			// actions.getUserRolesBySysUserId(userId);
		} else {
			// actions.initASysUserForAdd();
		}

	}

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (`${DEAL_TENANT}_SUCCESS` === actionType) { //处理完成
					if (rspInfo.resultCode === Constant.REST_OK) {
						let msg = '系统用户成功';
						if (this.state.operType == Constant.OPER_TYPE_ADD) {
							msg = `新增${msg}`;
						} else if (this.state.operType == Constant.OPER_TYPE_EDIT) {
							msg = `修改${msg}`;
						} else {
							MsgUtil.showwarning('未知操作');
							return;
						}
						MsgUtil.showinfo(msg);
						this.context.router.replace(businessRoute.Tenantadmin);
					} else {
						if (this.state.operType == Constant.OPER_TYPE_ADD) {
							MsgUtil.showerror(
								`新增系统用户错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						} else {
							MsgUtil.showerror(
								`修改系统用户错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
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
		e.preventDefault();
		const { actions, currentSelectTenant } = this.props;
		const { operType } = this.state;

		this.props.form.validateFields((errors, editForm) => {
			const afterMergeForm = Immutable.Map(currentSelectTenant).merge(editForm).toObject();


			if (!!errors) {
				console.log('表单验证失败!!!');
				return;
			}

			actions.dealTenant(operType, afterMergeForm);
		});
	};

	render () {
		const { getFieldDecorator } = this.props.form;
		let {  currentSelectTenant } = this.props;
		const {  operType } = this.state;

		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 14 },
		};

		let BealoonValue = {
			tenantIdRequired: '',
			nameequired: '',
			phoneRequired: '',
			regionCodeRequired: '',
			addressRequired: '',
			emailRequired: '',
			contactManRequired: '',
			contactPhoneRequired: '',
			stateRequired: '',
			homePageRequired: '',
			logoUrlRequired: '',
			backgroundImageRequired: '',
			introductionRequired: '',
		};

		const  initValue = () => {
			if ( operType == Constant.OPER_TYPE_ADD ) {

				BealoonValue = {
					tenantIdRequired: false,
					nameequired: true,
					phoneRequired: true,
					regionCodeRequired: true,
					addressRequired: true,
					emailRequired: true,
					contactManRequired: true,
					contactPhoneRequired: true,
					stateRequired: true,
					homePageRequired: true,
					logoUrlRequired: true,
					backgroundImageRequired: true,
					introductionRequired: true,

				};
			} else if (operType == Constant.OPER_TYPE_EDIT || operType == Constant.OPER_TYPE_DELETE) {
				BealoonValue = {
					tenantIdRequired: true,
					nameequired: false,
					phoneRequired: false,
					regionCodeRequired: false,
					addressRequired: false,
					emailRequired: false,
					contactManRequired: false,
					contactPhoneRequired: false,
					stateRequired: false,
					homePageRequired: false,
					logoUrlRequired: false,
					backgroundImageRequired: false,
					introductionRequired: false,
				};
			}
			return BealoonValue;
		};


		if ( operType == Constant.OPER_TYPE_ADD) {
			currentSelectTenant={};
		}
		//租户ID
		const tenantIdProps = getFieldDecorator('tenantId', {
			initialValue: currentSelectTenant.tenantId,
			rules: [
				{
					required: initValue().tenantIdRequired,
					message: '租户ID不能为空',
				},
			],
		});

		//租户姓名
		const NameProps = getFieldDecorator('name', {
			initialValue: currentSelectTenant.name,
			rules: [
				{
					required: initValue().nameequired,
					message: '租户姓名不能为空',
				},
			],
		});

		//租户地址
		const addressProps = getFieldDecorator('address', {
			initialValue: currentSelectTenant.address,
			rules: [
				{
					required: initValue().addressRequired,
					message: '租户地址不能为空',
				},
			],
		});





		//状态
		const StateProps = getFieldDecorator('state', {
			initialValue: currentSelectTenant.state,
		});

		//联系人
		const contactManProps = getFieldDecorator('contactMan', {
			initialValue: currentSelectTenant.contactMan,
			rules: [
				{
					required: initValue().contactManRequired,
					message: '联系人不能为空',
				},
			],
		});

		//背景图片
		const backgroundImageProps = getFieldDecorator('backgroundImage', {
			initialValue: currentSelectTenant.backgroundImage,
			rules: [
				{
					required: initValue().backgroundImageRequired,
					message: '背景图片不能为空',
				},
			],
		});

		//手机
		const phoneProps = getFieldDecorator('phone', {
			initialValue: currentSelectTenant.phone,
			rules: [
				{
					required: initValue().phoneRequired,
					message: '手机不能为空',
				},
			],
		});

		//地区
		const regionCodeProps = getFieldDecorator('regionCode', {
			initialValue: currentSelectTenant.regionCode,
			rules: [
				{
					required: initValue().regionCodeRequired,
					message: '地区不能为空',
				},
			],
		});

		//联系电话
		const contactPhoneProps = getFieldDecorator('contactPhone', {
			initialValue: currentSelectTenant.contactPhone,
			rules: [
				{
					required: initValue().contactPhoneRequired,
					message: '联系电话不能为空',
				},
			],
		});

		//logo
		const logoUrlProps = getFieldDecorator('logoUrl', {
			initialValue: currentSelectTenant.logoUrl,
			rules: [
				{
					required: initValue().logoUrlRequired,
					message: 'logo不能为空',
				},
			],
		});

		//主页
		const homePageProps = getFieldDecorator('homePage', {
			initialValue: currentSelectTenant.homePage,
			rules: [
				{
					required: initValue().homePageRequired,
					message: 'logo不能为空',
				},
			],
		});

		//介绍
		const introductionProps = getFieldDecorator('introduction', {
			initialValue: currentSelectTenant.introduction,
			rules: [
				{
					required: initValue().introductionRequired,
					message: '介绍不能为空',
				},
			],
		});


		//备注
		const RemarkProps = getFieldDecorator('remark', {
			initialValue: currentSelectTenant.remark,
			rules: [
				{ max: 200, whitespace: true, message: '最多 200 个字符' },
			],
		});




		return (
			<Form>
				<Row>
					<Col span={24} >
						<Link to={businessRoute.Tenantadmin} className="ant-btn" style={{ lineHeight: '25px' }} >
							<Icon type="backward" />
							<span>&nbsp;&nbsp;返回租户管理</span>
						</Link>
					</Col>
				</Row>
				<br /> <br /> <br />
				<Row>
					<Col span={18} offset={2} >

						<Form.Item>
							<Col span={12} >
								<Form.Item {...formItemLayout} label="租户ID" >
									{tenantIdProps(
										<Input placeholder="请输入租户ID" disabled="true" />,
									)}
								</Form.Item>
							</Col>
							<Col span={12} >
								<Form.Item {...formItemLayout} label="商家" >
									{NameProps(
										<Input placeholder="请输入商家名..." />,
									)}
								</Form.Item>
							</Col>
						</Form.Item>

						<Form.Item>
							<Col span={12} >
								<Form.Item {...formItemLayout} label="地址"  >
									{addressProps(
										<Input placeholder="请输入地址..."   />,
									)}
								</Form.Item>
							</Col>
							<Col span={12} >
								<Form.Item {...formItemLayout} label="联系人	" >
									{contactManProps(
										<Input placeholder="请输入联系人	..." />,
									)}
								</Form.Item>
							</Col>
						</Form.Item>



						<Form.Item>
							<Col span={12} >
								<Form.Item {...formItemLayout} label="头像"  >
									{backgroundImageProps(
										<Input placeholder="头像..."   />,
									)}
								</Form.Item>
							</Col>
							<Col span={12} >
								<Form.Item {...formItemLayout} label="手机	" >
									{phoneProps(
										<Input placeholder="手机	..." />,
									)}
								</Form.Item>
							</Col>
						</Form.Item>

						<Form.Item>
							<Col span={12} >
								<Form.Item {...formItemLayout} label="地区"  >
									{regionCodeProps(
										<Input placeholder="头像..."   />,
									)}
								</Form.Item>
							</Col>
							<Col span={12} >
								<Form.Item {...formItemLayout} label="联系人电话	" >
									{contactPhoneProps(
										<Input placeholder="联系人电话	..." />,
									)}
								</Form.Item>
							</Col>
						</Form.Item>



						<Form.Item>
							<Col span={12} >
								<Form.Item {...formItemLayout} label="主页"  >
									{homePageProps(
										<Input placeholder="主页..."   />,
									)}
								</Form.Item>
							</Col>
							<Col span={12} >
								<Form.Item {...formItemLayout} label="logo	" >
									{logoUrlProps(
										<Input placeholder="logo	..." />,
									)}
								</Form.Item>
							</Col>
						</Form.Item>

						<Form.Item>
							<Col span={12} >
								<Form.Item {...formItemLayout} label="简介"  >
									{introductionProps(
										<Input placeholder="简介..."   />,
									)}
								</Form.Item>
							</Col>
							<Col span={12} >
								<Form.Item {...formItemLayout} label="租户状态" >
									{StateProps(
										<Select size="large" style={{ width: 240 }} >
											<Select.Option value="U" >[U] 正常</Select.Option>
											<Select.Option value="E" >[E] 禁用</Select.Option>
										</Select>,
									)}
								</Form.Item>
							</Col>
						</Form.Item>



						<Col span={12} >
							<Form.Item {...formItemLayout} label="备注" >
								{RemarkProps(
									<Input type="textarea" rows="4" />,
								)}
							</Form.Item>
						</Col>

					</Col>
				</Row>
				<Row style={{ height: 40 }} />
				<Row>
					<Col span={18} offset={2} style={{ textAlign: 'center' }} >
						<Button type="primary" onClick={this.handleSubmit} >提交</Button>&nbsp;&nbsp;
						<Button type="primary" onClick={this.handleReset} >重置</Button>&nbsp;&nbsp;
					</Col>
				</Row>
				<br /> <br />
			</Form>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { records, currentSelectTenant } = state.get('TenantService').toObject();

	return {
		rspInfo,
		actionType,
		records,
		currentSelectTenant,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryTenantByForm,
			dealTenant,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(TenantEdit));
