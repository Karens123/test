'use strict';

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Immutable from 'immutable';
import {
	Form,
	Input,
	Select,
	Button,
	Row,
	Col,
	Icon,
	Upload,
	Badge,
} from 'antd';

import * as MsgUtil from 'utils/MsgUtil';
import * as businessRoute from 'business/route';
import * as Constant from 'utils/Constant';
import { handleUploadImage, PubImageUploadProps } from 'utils/UploadUtil';

import {
	DEAL_APP_TYPE,
	QRY_APP_TYPE_BY_ID,
	qryAppTypeById,
	initAAppTypeForAdd,
	dealAppType,
} from 'action';

const FormItem = Form.Item;
class AppTypeEdit extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static propTypes = {
		currentAppType: PropTypes.object,
		rspInfo: PropTypes.object.isRequired,
		actionType: PropTypes.string.isRequired,
		actions: PropTypes.object.isRequired,
		form: PropTypes.object.isRequired,
		params: PropTypes.object.isRequired,
		route: PropTypes.object.isRequired,
		currentDiscivery: PropTypes.object.isRequired,
	};

	static defaultProps = {
		currentAppType: {}
	};

	constructor (props) {
		super(props);
		const { route } = this.props;
		if (!route) {
			this.context.router.replace(businessRoute.AppTypeAdmin);
		}
		const operType = route.path === businessRoute.AppTypeEditByAppType
			? Constant.OPER_TYPE_EDIT
			: Constant.OPER_TYPE_ADD;
		this.state = { operType };
	}

	componentWillMount () {
		const { operType } = this.state;
		const { actions, params } = this.props;
		if (operType === Constant.OPER_TYPE_EDIT) {
			actions.qryAppTypeById(params.appType);
		} else {
			actions.initAAppTypeForAdd();
		}
	}

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType } = nextProps;
		const { params } = this.props;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (`${DEAL_APP_TYPE}_SUCCESS` === actionType) { //处理完成
					if (rspInfo.resultCode === Constant.REST_OK) {
						let msg = '应用类型成功';
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
						this.context.router.replace(`${businessRoute.AppTypeAdmin}${params.prepage?`/${params.prepage}`:''}`);
					} else {
						if (this.state.operType == Constant.OPER_TYPE_ADD) {
							MsgUtil.showerror(
								`新增应用类型.错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						} else {
							MsgUtil.showerror(
								`修改应用类型.错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						}
					}
				} else if (`${QRY_APP_TYPE_BY_ID}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询应用类型信息失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
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
		const { actions, currentAppType } = this.props;
		const { operType,UploadPath } = this.state;

		this.props.form.validateFields((errors, editForm) => {
			if (!!errors) {
				console.log('表单验证失败!!!');
				return;
			}
			console.log('editForm',editForm);
			const afterMergeForm = Immutable.Map(currentAppType).
				merge(editForm).merge(UploadPath?{ image: UploadPath }:{}).
				toObject();

			console.log('operType', operType);
			console.log('afterMergeForm', afterMergeForm);
			actions.dealAppType(operType, afterMergeForm);
		});
	};

	handleChange = (info) => {
		const fileList = info.fileList;
		const { FileUploadPath, SrcPath } = handleUploadImage(fileList);
		this.setState({
			UploadPath: FileUploadPath,
			hasChangeUpload: true,
			fileList,
			ViewUploadImgSrc: SrcPath,
		});
	};

	handlePicClick = () => {
		const { currentDiscivery } = this.props;
		if (this.state.ViewUploadImgSrc == '') {
			if (currentDiscivery === undefined) {
				MsgUtil.showwarning('暂无图片');
			}
		}
	};

	render () {
		const { getFieldDecorator } = this.props.form;
		const { route,params } = this.props;
		let { currentAppType } = this.props;

		if (route.path === businessRoute.AppTypeEdit) {
			currentAppType = {};
		}

		//没上传
		let ViewUploadImgSrc = this.state.ViewUploadImgSrc;
		if (!ViewUploadImgSrc) {
			ViewUploadImgSrc = currentAppType.image;
		}

		//ant-desigen中的名称和内容各占多少列
		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};
		const uploadFormItemLayout = {
			labelCol: { span: 8 },

		};


		const PFormItemLayout = {
			// paddingLeft: '140px',
			// left: '268px',
			right: '0',
			position: 'absolute',
			top: '-12px',
			// width: '280px',
			lineHeight: '32px'
		};

		const textareaFormItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 },
		};
		//ant-desigen中的上传按纽
		//文件上传
		const uploadProps = PubImageUploadProps().
			set('onChange', this.handleChange).
			set('fileList', this.state.fileList).
			toObject();

		//以下ant-desigen中教验表单
		//类型ID
		const AppTypeProps = getFieldDecorator('appType', {
			initialValue: currentAppType.appType,
			rules: [
				{
					required: true,
					min: 1,
					message: '最多3个数字',
					pattern: /^[0-9]{0,3}$/,
				},
			],
		});

		//类型名称
		const AppNameProps = getFieldDecorator('appName', {
			initialValue: currentAppType.appName,
			rules: [
				{ required: true, min: 1, message: '类型名称为必填项' },
				{ max: 20, whitespace: true, message: '最多 20个字符' },
			],
		});

		const StateProps = getFieldDecorator('state', {
			initialValue: currentAppType.state
				? String(currentAppType.state)
				: 'U',
			rules: [
				{ required: false, min: 1, whitespace: true, message: '请填写状态' },
			],
		});

		const packageNameProps = getFieldDecorator('packageName', {
			initialValue: currentAppType.packageName,
			rules: [
				{ required: false, min: 1, message: '请填写包名称' },
				{ max: 20, whitespace: true, message: '最多 20个字符' },
			],
		});
		const urlSchemeProps = getFieldDecorator('urlScheme', {
			initialValue: currentAppType.urlScheme,
			rules: [
				{ required: false, min: 1, message: '请填写url头称' },
				{ max: 20, whitespace: true, message: '最多 20个字符' },
			],
		});


		const bundleIdProps = getFieldDecorator('bundleId', {
			initialValue: currentAppType.bundleId,
			rules: [
				{ required: false, min: 1, message: '请填写应用标志名称' },
				{ max: 20, whitespace: true, message: '最多 20个字符' },
			],
		});

		const imageProps = getFieldDecorator('image',{
			initialValue: currentAppType.image,
			rule: [
				{ required: true,message: '请上传图片！' }
			]
		});

		//排序
		const SortIdProps = getFieldDecorator('sortId', {
			initialValue: currentAppType.sortId,
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
		const RemarkProps = getFieldDecorator('remark', {
			initialValue: currentAppType.remark,
			rules: [
				{ max: 50, whitespace: true, message: '最多 50 个字符' },
			],
		});

		return (
			<Form >
				<Row>
					<Col span={24} >
						<Link to={`${businessRoute.AppTypeAdmin}${params.prepage?`/${params.prepage}`:''}`} className="ant-btn" style={{ lineHeight: '25px' }} >
							<Icon type="backward" />
							<span>&nbsp;&nbsp;App类型配置</span>
						</Link>
					</Col>
				</Row><br /><br /><br />

				<Row>
					<Col span={15} offset={1} >
						<FormItem >
							<Col span={12} >
								<FormItem {...formItemLayout} label="类型ID" >
									{ AppTypeProps(
										<Input type="text" placeholder="输入类型ID" />,
									) }
								</FormItem>
							</Col>
							<Col span={12} >
								<FormItem {...formItemLayout} label="类型名称" >
									{AppNameProps(
										<Input type="text" placeholder="输入类型名称" />,
									)}
								</FormItem>
							</Col>
						</FormItem>
						<FormItem >
							<Col span={12} >
								<FormItem {...formItemLayout} label="排序" >
									{SortIdProps(
										<Input type="text" placeholder="排序" />,
									)}
								</FormItem>
							</Col>
							<Col span={12} >
								<FormItem {...formItemLayout} label="状态" >
									{StateProps(
										<Select >
											<Select.Option value="U" >[U] 正常</Select.Option>
											<Select.Option value="E" >[E] 禁用</Select.Option>
										</Select>,
									)}
								</FormItem>
							</Col>
						</FormItem>


						<FormItem >
							<Col span={12} >
								<FormItem {...formItemLayout} label="包名" >
									{packageNameProps(
										<Input type="text" placeholder="包名" />,
									)}
								</FormItem>
							</Col>
							<Col span={12} >
								<FormItem {...formItemLayout} label="Url头" >
									{urlSchemeProps(
										<Input type="text" placeholder="Url头" />,
									)}
								</FormItem>
							</Col>
						</FormItem>


						<FormItem >
							<Col span={12} >
								<FormItem {...formItemLayout} label="应用标志" >
									{bundleIdProps(
										<Input type="text" placeholder="应用标志" />,
									)}
								</FormItem>
							</Col>
							<Col span={12} >
								<div className="apptypeUpload" >
									<FormItem {...uploadFormItemLayout} label="图片" >
										<Col span={16} >
											<Upload {...uploadProps}>
												&nbsp;
												<Button type="ghost" size="large" >
													<Icon type="upload" /> 点击上传
												</Button>
											</Upload>
											<p style={PFormItemLayout}>
												<a href={ViewUploadImgSrc} onClick={this.handlePicClick} target="_blank" rel="noopener noreferrer" >
													<Badge>
														<img src={ViewUploadImgSrc} className="viewImg" width="35" height="35" alt="" />
													</Badge>&nbsp;
													<Badge dot ><p>点击放大</p></Badge>
												</a>
											</p>
										</Col>
									</FormItem>
								</div>
							</Col>
						</FormItem>






						<FormItem {...textareaFormItemLayout} label="备注" >
							{RemarkProps(
								<Input type="textarea" rows={6} />,
							)}
						</FormItem>

					</Col>
				</Row>

				<Row>
					<Col span={12} style={{ textAlign: 'center' }} >
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
	const { currentAppType } = state.get('AppTypeService').toObject() ;
	return { rspInfo, actionType, currentAppType };
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators(
			{ qryAppTypeById, initAAppTypeForAdd, dealAppType }, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	Form.create()(AppTypeEdit));
