'use strict';

import * as Immutable from 'immutable';
import moment from 'moment';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, DatePicker, Form, Icon, Input, Row, Select } from 'antd';
import * as Constant from 'utils/Constant';
import * as MsgUtil from 'utils/MsgUtil';
import * as businessRoute from 'business/route';

import {
	DEAL_ERROR_LOG,
	dealErrorLog,
	GET_ERROR_LOG_BY_CREATE_TIME_AND_ID,
	getErrorLogById,
} from 'action';

const Option = Select.Option;
class ErrorLogEdit extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		currentErrorLog: PropTypes.object.isRequired,
		actionType: PropTypes.string.isRequired,
		rspInfo: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		form: PropTypes.object.isRequired,
		route: PropTypes.object.isRequired,
		params: PropTypes.object.isRequired,
	};

	static defaultProps = {
		currentErrorLog: {},
	};

	constructor (props) {
		super(props);
		const { route } = this.props;
		if (!route) {
			this.context.router.replace(businessRoute.ErrorLogAdmin);
		}
		const operType = route.path === businessRoute.ErrorLogEditById
			? Constant.OPER_TYPE_EDIT
			: Constant.OPER_TYPE_ADD;
		this.state = { operType };
	}

	componentWillMount () {
		const { operType } = this.state;
		const { actions } = this.props;
		if (operType == Constant.OPER_TYPE_EDIT) {
			const { params } = this.props;
			const recId = params.recId;
			actions.getErrorLogById(recId);
		}
	}

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (`${DEAL_ERROR_LOG}_SUCCESS` === actionType) { //处理完成
					if (rspInfo.resultCode === Constant.REST_OK) {
						let msg = '错误日志成功';
						if (this.state.operType == Constant.OPER_TYPE_EDIT) {
							msg = `处理${msg}`;
						} else {
							MsgUtil.showwarning('未知操作');
							return;
						}
						MsgUtil.showinfo(msg);
						this.context.router.replace(
							businessRoute.ErrorLogAdmin);
					} else {
						if (this.state.operType == Constant.OPER_TYPE_EDIT) {
							MsgUtil.showerror(
								`处理错误日志错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						}
					}
				} else if (`${GET_ERROR_LOG_BY_CREATE_TIME_AND_ID}_SUCCESS` ===
					actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询错误日志信息失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				}
			}
		}
	}

	handleReset = (e) => {
		e.preventDefault();
		this.props.form.resetFields();
	};

	handleSubmit = (e) => {
		e.preventDefault();
		const { actions, currentErrorLog } = this.props;
		const { operType } = this.state;

		this.props.form.validateFields((errors, editForm) => {
			if (!!errors) {
				console.log('表单验证失败!!!');
				return;
			}
			const afterMergeForm = Immutable.Map(currentErrorLog).
				set('dealSts', editForm.dealSts).
				set('dealPerson', editForm.dealPerson).
				set('dealResult', editForm.dealResult).
				set('dealTime', editForm.dealTime &&
					new Date(editForm.dealTime.format()).getTime()).
				toObject();

			actions.dealErrorLog(operType, [afterMergeForm]);
		});
	};

	render () {
		const { getFieldDecorator } = this.props.form;
		const { currentErrorLog } = this.props;

		const formItemLayout = {
			labelCol: { span: 10 },
			wrapperCol: { span: 14 },
		};

		const CreateTimeProps = getFieldDecorator('createTime', {
			initialValue: currentErrorLog.createTime ? moment(
				currentErrorLog.createTime).format('YYYY-MM-DD hh:mm:ss') : '',
		});
		const ErrorIdProps = getFieldDecorator('recId', {
			initialValue: currentErrorLog.recId,
		});
		const ClientTypeProps = getFieldDecorator('clientType', {
			initialValue: currentErrorLog.clientType,
		});
		const ClientIpProps = getFieldDecorator('clientIp', {
			initialValue: currentErrorLog.clientIp,
		});
		const ClientMacProps = getFieldDecorator('clientMac', {
			initialValue: currentErrorLog.clientMac,
		});
		const ClientImeiProps = getFieldDecorator('clientImei', {
			initialValue: currentErrorLog.clientImei,
		});
		const SystemTypeProps = getFieldDecorator('systemType', {
			initialValue: currentErrorLog.systemType,
		});
		const SysVersionProps = getFieldDecorator('sysVersion', {
			initialValue: currentErrorLog.sysVersion,
		});
		const ManufactorProps = getFieldDecorator('manufactor', {
			initialValue: currentErrorLog.manufactor,
		});
		const ResolutionProps = getFieldDecorator('resolution', {
			initialValue: currentErrorLog.resolution,
		});
		const VersionProps = getFieldDecorator('version', {
			initialValue: currentErrorLog.version,
		});
		const ErrorEndProps = getFieldDecorator('errorEnd', {
			initialValue: currentErrorLog.errorEnd ? String(currentErrorLog.errorEnd): '',
		});
		const ErrorTypeProps = getFieldDecorator('errorType', {
			initialValue: currentErrorLog.errorType,
		});
		const ErrorCodeProps = getFieldDecorator('errorCode', {
			initialValue: currentErrorLog.errorCode,
		});
		const ErrorInfoProps = getFieldDecorator('errorInfo', {
			initialValue: currentErrorLog.errorInfo,
		});
		const RemarkProps = getFieldDecorator('remark', {
			initialValue: currentErrorLog.remark,
		});
		const DealTimeProps = getFieldDecorator('dealTime', {
			initialValue: currentErrorLog.dealTime &&
			moment(currentErrorLog.dealTime),
			rules: [
				{ required: true, message: '处理时间不允许为空' },
			],
		});
		const DealStsProps = getFieldDecorator('dealSts', {
			initialValue: currentErrorLog.dealSts
				? String(currentErrorLog.dealSts)
				: '0',
			rules: [
				{
					required: true,
					min: 1,
					message: '处理状态不允许为空',
					whitespace: true,
				},
			],
		});
		const DealPersonProps = getFieldDecorator('dealPerson', {
			initialValue: currentErrorLog.dealPerson,
			rules: [
				{ required: false, max: 10, whitespace: true },
			],
		});
		const DealResultProps = getFieldDecorator('dealResult', {
			initialValue: currentErrorLog.dealResult,
		});

		return (
			<Form >
				<Row>
					<Col span={8} >
						<Link to={businessRoute.ErrorLogAdmin} className="ant-btn" style={{ lineHeight: '25px' }}>
							<Icon type="backward" />
							<span>&nbsp;&nbsp;错误信息编辑</span>
						</Link>
					</Col>
				</Row><br /><br /><br />
				<Row>
					<Col span={16} >
						<Col span={12} >
							<Form.Item {...formItemLayout} label="错误ID" >
								{ErrorIdProps(
									<Input disabled type="text" size="large" />,
								)}
							</Form.Item>
						</Col>
						<Col span={12} >
							<Form.Item {...formItemLayout} label="错误时间" >
								{CreateTimeProps(
									<Input disabled type="text" size="large" />,
								)}
							</Form.Item>
						</Col>
						<Col span={12} >
							<Form.Item {...formItemLayout} label="客户端MAC" >
								{ClientMacProps(
									<Input disabled type="text" size="large" />,
								)}
							</Form.Item>
						</Col>
						<Col span={12} >
							<Form.Item {...formItemLayout} label="客户端IP" >
								{ClientIpProps(
									<Input disabled type="text" size="large" />,
								)}
							</Form.Item>
						</Col>
						<Col span={12} >
							<Form.Item {...formItemLayout} label="客户端IMEI" >
								{ClientImeiProps(
									<Input disabled type="text" size="large" />,
								)}
							</Form.Item>
						</Col>
						<Col span={12} >
							<Form.Item {...formItemLayout} label="客户端系统类型" >
								{SystemTypeProps(
									<Input disabled type="text" size="large" />,
								)}
							</Form.Item>
						</Col>
						<Col span={12} >
							<Form.Item {...formItemLayout} label="客户端厂商" >
								{ManufactorProps(
									<Input disabled type="text" size="large" />,
								)}
							</Form.Item>
						</Col>
						<Col span={12} >
							<Form.Item {...formItemLayout} label="客户端型号" >
								{ClientTypeProps(
									<Input disabled type="text" size="large" />,
								)}
							</Form.Item>
						</Col>
						<Col span={12} >
							<Form.Item {...formItemLayout} label="客户端分辨率" >
								{ResolutionProps(
									<Input disabled type="text" size="large" />,
								)}
							</Form.Item>
						</Col>
						<Col span={12} >
							<Form.Item {...formItemLayout} label="客户端系统版本" >
								{SysVersionProps(
									<Input disabled type="text" size="large" />,
								)}
							</Form.Item>
						</Col>
						<Col span={12} >
							<Form.Item {...formItemLayout} label="App版本" >
								{VersionProps(
									<Input disabled type="text" size="large" />,
								)}
							</Form.Item>
						</Col>
						<Col span={12} >
							<Form.Item {...formItemLayout} label="错误端类型" >
								{ErrorEndProps(
									<Select disabled >
										<Option key="0" value="0" >客户端</Option>
										<Option key="1" value="1" >服务端</Option>
									</Select>,
								)}
							</Form.Item>
						</Col>
						<Col span={12} >
							<Form.Item {...formItemLayout} label="错误编码" >
								{ErrorCodeProps(
									<Input disabled type="text" size="large" />,
								)}
							</Form.Item>
						</Col>
						<Col span={12} >
							<Form.Item {...formItemLayout} label="错误类别" >
								{ErrorTypeProps(
									<Input disabled type="text" size="large" />,
								)}
							</Form.Item>
						</Col>
						<Col >
							<Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="错误内容" >
								{ErrorInfoProps(
									<Input disabled type="textarea" rows={6} size="large" style={{ width: 673 }} />,
								)}
							</Form.Item>
						</Col>
						<Col span={12} >
							<Form.Item {...formItemLayout} label="处理日期" required >
								{DealTimeProps(
									<DatePicker type="text" size="large" style={{ width: 142 }} />,
								)}
							</Form.Item>
						</Col>
						<Col span={8} style={{ marginLeft: '-110px' }} >
							<Form.Item {...formItemLayout} label="处理人" required >
								{DealPersonProps(
									<Input placeholder="请输入处理人..." type="text" size="large" style={{ width: 142 }} />,
								)}
							</Form.Item>
						</Col>
						<Col span={6} >
							<Form.Item {...formItemLayout} label="处理状态" required >
								{DealStsProps(
									<Select style={{ width: 152 }} >
										<Option key={0} value="0" >待处理</Option>
										<Option key={1} value="1" >已阅</Option>
										<Option key={2} value="2" >已处理</Option>
									</Select>,
								)}
							</Form.Item>
						</Col>

						<Col span={24} >
							<Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="处理结果" required >
								{DealResultProps(
									<Input type="textarea" rows={6} placeholder="请输入处理结果..." size="large" style={{ width: 673 }} />,
								)}
							</Form.Item>
						</Col>
						<Col span={24} >
							<Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="备注" >
								{RemarkProps(
									<Input type="textarea" rows={6} size="large" style={{ width: 673 }} />,
								)}
							</Form.Item>
						</Col>
					</Col>
				</Row>
				<Row>&nbsp;
				</Row>
				<Row>
					<Col span={18} style={{ textAlign: 'center' }} >
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
	const { currentErrorLog } = state.get('ErrorLogService').toObject();
	return { rspInfo, currentErrorLog, actionType };
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({ getErrorLogById, dealErrorLog },
			dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ErrorLogEdit));
