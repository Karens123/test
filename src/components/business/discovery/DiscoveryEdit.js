'use strict';

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Immutable from 'immutable';
import { Badge, Button, Col, Form, Icon, Input, Row, Upload } from 'antd';
import * as businessRoute from 'business/route';
import { handleUploadImage, PubImageUploadProps } from 'utils/UploadUtil';
import * as MsgUtil from 'utils/MsgUtil';
import * as Constant from 'utils/Constant';

import {
	DEAL_DISCOVERY,
	dealDiscovery,
	initADiscoveryForAdd,
	QRY_DISCOVERY_BY_ID,
	qryDiscoveryById,
} from 'action';

const FormItem = Form.Item;
class DiscoveryEdit extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static propTypes = {
		currentDiscovery: PropTypes.object.isRequired,
		actionType: PropTypes.string.isRequired,
		actions: PropTypes.object.isRequired,
		rspInfo: PropTypes.object.isRequired,
		route: PropTypes.object.isRequired,
		params: PropTypes.object.isRequired,
		form: PropTypes.object.isRequired,
	};

	static defaultProps = {
		currentDiscovery: {},
	};

	constructor (props) {
		super(props);
		const { route } = props;
		if (!route) {
			this.context.router.replace(businessRoute.DiscoveryTypeAdmin);
		}
		const operType = route.path === businessRoute.DiscoveryEditById
			? Constant.OPER_TYPE_EDIT
			: Constant.OPER_TYPE_ADD;
		this.state = { operType };
	}

	componentWillMount () {
		const { params, actions } = this.props;
		const { operType } = this.state;
		if (operType == Constant.OPER_TYPE_EDIT) {
			const discoveryId = params.discoveryId;
			actions.qryDiscoveryById(discoveryId);
		} else {
			const discoveryTypeId = params.discoveryTypeId;
			actions.initADiscoveryForAdd(discoveryTypeId);
		}
	}

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (`${DEAL_DISCOVERY}_SUCCESS` === actionType) { //处理完成
					if (rspInfo.resultCode === Constant.REST_OK) {
						let msg = '发现成功';
						if (this.state.operType == Constant.OPER_TYPE_ADD) {
							msg = `新增${msg}`;
						} else if (this.state.operType ==
							Constant.OPER_TYPE_EDIT) {
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
								`新增发现错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						} else {
							MsgUtil.showerror(
								`修改发现错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						}
					}
				} else if (`${QRY_DISCOVERY_BY_ID}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询发现信息失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
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
		const { actions, currentDiscovery } = this.props;
		const { operType } = this.state;

		this.props.form.validateFields((errors, editForm) => {
			if (!!errors) {
				console.log('表单验证失败!!!');
				return;
			}
			const afterMergeForm = Immutable.Map(currentDiscovery).
				merge(editForm).set('image', this.state.UploadPath).toObject();
			actions.dealDiscovery(operType, afterMergeForm);
		});
	};

	handleChange = (info) => {
		let fileList = info.fileList;
		const { FileUploadPath, SrcPath } = handleUploadImage(fileList);
		if (FileUploadPath && fileList.length > 1) {
			fileList = [fileList[fileList.length - 1]];
			const { setFieldsValue } = this.props.form;
			setFieldsValue({ image: FileUploadPath });
		}
		this.setState({
			UploadPath: FileUploadPath,
			hasChangeUpload: true,
			fileList,
			ViewUploadImgSrc: SrcPath,
		});
	};

	handlePicClick = () => {
		const { currentDiscovery } = this.props;
		if (this.state.ViewUploadImgSrc == '') {
			if (currentDiscovery === undefined) {
				MsgUtil.showwarning('暂无图片');
			}
		}
	};

	render () {
		const { getFieldDecorator } = this.props.form;
		const { currentDiscovery } = this.props;

		//没上传
		let { ViewUploadImgSrc } = this.state;
		if (!ViewUploadImgSrc) {
			ViewUploadImgSrc = currentDiscovery.image;
		}
		//ant-desigen中的名称和内容各占多少列
		const formItemLayout = {
			labelCol: { span: 10 },
			wrapperCol: { span: 14 },
		};
		const formItemLayout_2Col = {
			labelCol: { span: 6 },
			wrapperCol: { span: 14 },
		};

		//ant-desigen中的上传按纽
		//文件上传
		const uploadProps = PubImageUploadProps().
			set('onChange', this.handleChange).
			set('fileList', this.state.fileList).
			toObject();

		const discoveryTypeIdProps = getFieldDecorator('discoveryType', {
			initialValue: currentDiscovery.discoveryType,
			rules: [
				{ required: true, message: '缺少发现类型id' },
			],
		});
		const nameProps = getFieldDecorator('name', {
			initialValue: currentDiscovery.name,
			rules: [
				{ required: true, min: 1, message: '请输入发现信息名称' },
			],
		});

		const urlProps = getFieldDecorator('url', {
			initialValue: currentDiscovery.url,
		});

		const sortIdProps = getFieldDecorator('sortId', {
			initialValue: currentDiscovery.sortId,
		});

		const remarkProps = getFieldDecorator('remark', {
			initialValue: currentDiscovery.remark,
		});

		return (
			<Form>
				<Row>
					<Col span={24} >
						<Link to={businessRoute.DiscoveryTypeAdmin} className="ant-btn" style={{ lineHeight: '25px' }} >
							<Icon type="backward" />
							<span>&nbsp;&nbsp;发现配置</span>
						</Link>
					</Col>
				</Row><br /><br /><br />
				<Row>
					<Col span={18} >
						<Col span={12} className="b_1" >
							<FormItem {...formItemLayout} label="图片" required >&nbsp; &nbsp;
								<Upload {...uploadProps} >
									<Button type="ghost" size="large" >
										<Icon type="upload" /> 点击上传
									</Button>
								</Upload>
								<p>
									<a href={ViewUploadImgSrc} onClick={this.handlePicClick} target="_blank" rel="noopener noreferrer" >
										<Badge>
											<img src={ViewUploadImgSrc} className="viewImg" width="35" height="35" alt="" />
										</Badge>&nbsp;
										<Badge dot ><span>点击放大</span></Badge></a>
								</p>
							</FormItem>
						</Col>
						<Col span={10} >
							<FormItem {...formItemLayout_2Col} label="名称" >
								{nameProps(
									<Input type="text" size="large" style={{ width: 243 }} />,
								)}
							</FormItem>
						</Col>
						<br />
						<Col span={6} >
							<FormItem {...formItemLayout} label="URL" >
								{urlProps(
									<Input type="text" size="large" style={{ width: 243 }} />,
								)}
							</FormItem>
						</Col>
						<Col span={12} >
							<FormItem {...formItemLayout} label="排序" >
								{sortIdProps(
									<Input type="text" size="large" style={{ width: 243 }} />,
								)}
							</FormItem>
						</Col>
						<Col span={6} >
							<FormItem {...formItemLayout} label="类型" >
								{discoveryTypeIdProps(
									<Input type="text" size="large" style={{ width: 243 }} disabled />,
								)}
							</FormItem>
						</Col>
						<Col span={24} >
							<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="备注" >
								{remarkProps(
									<Input type="textarea" rows={6} style={{ width: 570 }} />,
								)}
							</FormItem>
						</Col>
					</Col>
				</Row>
				<Row>
					&nbsp;
				</Row>
				<Row>
					<Col span={20} style={{ textAlign: 'center' }} >
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
	const { currentDiscovery } = state.get('DiscoveryTypeService').toObject();
	return { currentDiscovery, rspInfo, actionType };
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators(
			{ qryDiscoveryById, initADiscoveryForAdd, dealDiscovery },
			dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	Form.create()(DiscoveryEdit));
