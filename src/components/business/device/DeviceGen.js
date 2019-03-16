'use strict';

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	Button,
	Col,
	DatePicker,
	Form,
	Icon,
	Input,
	InputNumber,
	Modal,
	Row,
	Select,
	Spin,
} from 'antd';
import moment from 'moment';
import * as businessRoute from 'business/route';
import MySelect from 'framework/components/Select';

import * as Constant from 'utils/Constant';
import * as MsgUtil from 'utils/MsgUtil';

import {
	GEN_DEVICE_SN,
	genDeviceSn,
	qryProdForSelect,
	qryTenantForSelect,
} from 'action';

const FormItem = Form.Item;
const Option = Select.Option;
class DeviceGen extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static propTypes = {
		existDeviceSnList: PropTypes.array,
		rspInfo: PropTypes.object,
		prodInfoList: PropTypes.array,
		tenantList: PropTypes.array,
		form: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		actionType: PropTypes.object.isRequired,
		route: PropTypes.object.isRequired,
	};
	static defaultProps = {
		existDeviceSnList: [],
		prodInfoList: [],
		tenantList: [],
		rspInfo: undefined,
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
		actions.qryProdForSelect();
		actions.qryTenantForSelect();
	}

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType, existDeviceSnList } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (`${GEN_DEVICE_SN}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`操作失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					} else {
						let content = '';
						if (existDeviceSnList.length > 0) {
							content = `已存在的设备序列号[${existDeviceSnList}]`;
						}
						Modal.confirm({
							title: '生成设备信息完成!',
							content,
							onOk() { },
							onCancel() { },
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

	handleSubmit = (e) => {
		e.preventDefault(); //注：防止提交默认表单事件
		const { actions } = this.props;
		this.props.form.validateFields((errors, genParams) => {
			if (!!errors) {
				console.log('表单验证失败!!!', errors);
				return;
			}
			this.setState({ loading: true });
			actions.genDeviceSn(genParams);
		});
	};

	render () {
		//ant-desigen定义的
		const { getFieldDecorator } = this.props.form;

		//ant-desigen中的名称和内容各占多少列
		const formItemLayout = {
			labelCol: { span: 7 },
			wrapperCol: { span: 12 },
		};
		//订单编号
		const OrderSnProps = getFieldDecorator('orderSn', {
			placeholder: '请填写订单编号',
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
		//产品编号
		const ProdIdProps = getFieldDecorator('prodId', {
			placeholder: '请选择产品编号',
			rules: [
				{ required: true },
			],
		});
		//版本协议号
		const VersionCodeProps = getFieldDecorator('versionCode', {
			placeholder: '请选择版本协议号',
			initialValue: '1',
			rules: [
				{ required: true },
			],
		});
		//厂家识别码
		const FactoryCodeProps = getFieldDecorator('factoryCode', {
			placeholder: '请选择厂家识别码',
			initialValue: '101',
			rules: [
				{ required: true },
			],
		});
		//设备类型
		const DeviceTypeProps = getFieldDecorator('deviceType', {
			placeholder: '请选择设备类型',
			initialValue: '01',
			rules: [
				{ required: true },
			],
		});
		//生产日期
		const ProdDateProps = getFieldDecorator('prodDate', {
			placeholder: '请选择生产日期',
			initialValue: moment(new Date()),
			rules: [
				{ required: true },
			],
		});
		//流水号开始
		const SnStartProps = getFieldDecorator('snStart', {
			placeholder: '请选择开始流水号',
			initialValue: 0,
			rules: [
				{ required: true },
			],
		});
		//流水号结束
		const SnEndProps = getFieldDecorator('snEnd', {
			placeholder: '请选择结束流水号',
			initialValue: 1000,
			rules: [
				{ required: true },
			],
		});
		//扩展位
		const ExtCodeProps = getFieldDecorator('extCode', {
			initialValue: '00',
			rules: [
				{ required: true },
			],
		});
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
					</Row><br /><br /><br />
					<Row>
						<Col span={18} >
							<Col span={12} >
								<FormItem {...formItemLayout} label="订单编号：" required >
									{OrderSnProps(
										<Input type="text" size="large" style={{ width: 243 }} />,
									)}
								</FormItem>
							</Col>
							<Col span={12} >
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
							</Col>
							<Col span={12} >
								<FormItem {...formItemLayout} label="产品编号：" >
									{ProdIdProps(
										<MySelect
											filterOption={false}
											style={{ width: 243 }}
											valueKey="prodId"
											descKey="prodName"
											selectOptionDataList={this.props.prodInfoList}
										/>,
									)}
								</FormItem>
							</Col>
							<Col span={12} >
								<FormItem {...formItemLayout} label="生产日期：" required >
									{ProdDateProps(
										<DatePicker type="text" format="YYYYMMDD" size="large" style={{ width: 243 }} />,
									)}
								</FormItem>
							</Col>
							<Col span={12} >
								<FormItem {...formItemLayout} label="版本协议：" required >
									{VersionCodeProps(
										<Select type="text" size="large" style={{ width: 243 }} >
											<Option value="1" >1</Option>
										</Select>,
									)}
								</FormItem>
							</Col>
							<Col span={12} >
								<FormItem {...formItemLayout} label="厂家识别码：" required >
									{FactoryCodeProps(
										<Select type="text" size="large" style={{ width: 243 }} >
											<Option value="101" >101-之石</Option>
											<Option value="102" >102-小木</Option>
										</Select>,
									)}
								</FormItem>
							</Col>
							<Col span={12} >
								<FormItem {...formItemLayout} label="流水号起始：" required >
									{SnStartProps(
										<InputNumber type="text" min={0} max={999999} size="large" style={{ width: 243 }} />,
									)}
								</FormItem>
							</Col>
							<Col span={12} >
								<FormItem {...formItemLayout} label="流水号结束：" required >
									{SnEndProps(
										<InputNumber type="text" min={0} max={999999} size="large" style={{ width: 243 }} />,
									)}
								</FormItem>
							</Col>
							<Col span={12} >
								<FormItem {...formItemLayout} label="设备类型：" required >
									{DeviceTypeProps(
										<Select type="text" size="large" style={{ width: 243 }} >
											<Option value="01" >01-戒指</Option>
											<Option value="02" >02-手串</Option>
											<Option value="03" >03-项链</Option>
											<Option value="04" >04-手链</Option>
										</Select>,
									)}
								</FormItem>
							</Col>
							<Col span={12} >
								<FormItem {...formItemLayout} label="扩展位：" required >
									{ExtCodeProps(
										<Input type="text" disabled size="large" style={{ width: 243 }} />,
									)}
								</FormItem>
							</Col>
						</Col>
					</Row>
					<Row>
						<Col span={24} style={{ textAlign: 'center' }} pull={2} >
							<Button type="primary" onClick={this.handleSubmit} > 生成 </Button>
						</Col>
					</Row>
				</Spin>
			</Form>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { existDeviceSnList, prodInfoList, tenantList } = state.get('DeviceService').toObject();
	return { rspInfo, actionType, existDeviceSnList, prodInfoList, tenantList };
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators(
			{ genDeviceSn, qryProdForSelect, qryTenantForSelect },
			dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	Form.create()(DeviceGen));
