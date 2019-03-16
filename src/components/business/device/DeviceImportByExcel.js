'use strict';

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Form, Icon, Input, Modal, Row, Spin, Upload } from 'antd';
import * as businessRoute from 'business/route';

import * as Constant from 'utils/Constant';
import * as MsgUtil from 'utils/MsgUtil';
import * as HttpUtil from 'utils/HttpUtil';
import { handleUploadExcel, PubFileUploadProps } from 'utils/UploadUtil';
import MySelect from 'framework/components/Select';

import {
	IMPORT_DEVICE_SN_BY_EXCEL,
	importDeviceByExcel,
	qryTenantForSelect,
} from 'action';

const FormItem = Form.Item;
class DeviceImportByExcel extends React.Component {
	//检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		existDeviceSnList: PropTypes.array,
		tenantList: PropTypes.array,
		illegalDeviceSnList: PropTypes.array,
		rspInfo: PropTypes.object.isRequired,
		actionType: PropTypes.string.isRequired,
		actions: PropTypes.object.isRequired,
		route: PropTypes.object.isRequired,
		form: PropTypes.object.isRequired,
	};

	static defaultProps = {
		existDeviceSnList: [],
		illegalDeviceSnList: [],
		tenantList: [],
	};

	constructor (props) {
		super(props);
		this.state = { loading: false };
		const { route } = this.props;
		if (!route) {
			this.context.router.replace(businessRoute.DeviceAdmin);
		}
	}

	componentWillMount () {
		const { actions } = this.props;
		actions.qryTenantForSelect();
	}

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType, existDeviceSnList, illegalDeviceSnList } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (`${IMPORT_DEVICE_SN_BY_EXCEL}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`操作失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					} else {
						let content = '';
						if (existDeviceSnList.length > 0) {
							content = `已存在的设备序列号[${existDeviceSnList}]`;
						}
						if (illegalDeviceSnList.length > 0) {
							content = `非法的设备序列号[${illegalDeviceSnList}]`;
						}
						Modal.confirm({
							title: '生成设备信息完成!',
							content,
							onOk() {},
							onCancel() {},
						});
					}
					this.setState({ loading: false });
				}
			}
		}
	}

	//Form reset
	handleReset = (e) => {
		e.preventDefault();
		this.props.form.resetFields();
	};

	handleChange = (info) => {
		const fileList = info.fileList;
		const { FileUploadPath } = handleUploadExcel(fileList);
		console.log('FileUploadPath', FileUploadPath);
		this.setState({ fileList, FileUploadPath });
	};

	handleSubmit = (e) => {
		e.preventDefault(); //注：防止提交默认表单事件
		const { actions } = this.props;
		this.props.form.validateFields((errors, importParams) => {
			if (!!errors) {
				console.log('表单验证失败!!!', errors);
				return;
			}
			//开启加载条
			this.setState({ loading: true });
			importParams.storePath = this.state.FileUploadPath;
			actions.importDeviceByExcel(importParams);
		});
	};

	render () {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 5 },

		};
		const uploadFormItemLayout = {
			labelCol: { span: 5 },
			wrapperCol: { span: 19 },
		};

		const uploadProps = PubFileUploadProps().
			set('onChange', this.handleChange).
			set('fileList', this.state.fileList).
			toObject();
		//构件编号
		const OrderSnProps = getFieldDecorator('orderSn', {
			rules: [
				{ required: true, min: 1 },
			],
		});
		//租户id
		const TenantIdProps = getFieldDecorator('tenantId', {
			placeholder: '请选择租户/商家',
			rules: [
				{ required: true, min: 1 },
			],
		});
		this.props.form.resetFields(['storePath']);
		return (
			<Form >
				<Spin size="large" spinning={this.state.loading} tip="数据处理中" >
					<Row>
						<Col span={24} >
							<Button>
								<Link to={businessRoute.DeviceAdmin} >
									<Icon type="backward" />
									<span>&nbsp;&nbsp;设备配置</span>
								</Link>
							</Button>
						</Col>
					</Row>
					<br /><br /><br />
					<Row>
						<FormItem {...formItemLayout} label="订单编号" required hasFeedback >
							{OrderSnProps(
								<Input type="text" size="large" style={{ width: 253 }} />,
							)}
						</FormItem>
						<FormItem {...formItemLayout} label="租户/商家：" required >
							{TenantIdProps(
								<MySelect
									filterOption={false}
									style={{ width: 243 }}
									valueKey="tenantId"
									descKey="name"
									selectOptionDataList={this.props.tenantList}
								/>,
							)}
						</FormItem>

						<FormItem {...uploadFormItemLayout} label="文件" required > &nbsp; &nbsp;
							<Upload {...uploadProps} fileList={this.state.fileList} >
								<Button type="ghost" size="large" icon="upload" >选择Excel文件</Button>
							</Upload> &nbsp; &nbsp;
							<a
								target="_blank"
								rel="noopener noreferrer"
								href={
									HttpUtil.getOssFileDownloadUrl(
										'tpl/device-import-tpl.xls')
								}
							>下载模板</a>
						</FormItem>
					</Row>
					<Row>
						<Col offset={5} >
							<Button type="primary" size="large" onClick={this.handleSubmit} >点击导入</Button>
						</Col>
					</Row>
				</Spin>
			</Form>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { existDeviceSnList, illegalDeviceSnList, tenantList } = state.get(
		'DeviceService').toObject();
	return {
		rspInfo,
		existDeviceSnList,
		illegalDeviceSnList,
		actionType,
		tenantList,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({ importDeviceByExcel, qryTenantForSelect },
			dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	Form.create()(DeviceImportByExcel));
