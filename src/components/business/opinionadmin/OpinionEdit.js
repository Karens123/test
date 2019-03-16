'use strict';

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Immutable from 'immutable';
import moment from 'moment';
import { Button, Col, DatePicker, Form, Icon, Input, Row, Select } from 'antd';
import * as MsgUtil from 'utils/MsgUtil';
import * as businessRoute from 'business/route';
import * as Constant from 'utils/Constant';

import {
	DEAL_OPINION,
	dealAdviceInfo,
	QRY_OPINION_BY_ID,
	qryOpinionById,
} from 'action';

const FormItem = Form.Item;
const Option = Select.Option;

class OpinionEdit extends React.Component {
	//检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static propTypes = {
		currentAdviceInfo: PropTypes.object,
		actionType: PropTypes.string.isRequired,
		rspInfo: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		form: PropTypes.object.isRequired,
		params: PropTypes.object.isRequired,
		route: PropTypes.object.isRequired,
	};
	static defaultProps = {
		currentAdviceInfo: {},
	};

	constructor (props) {
		super(props);
		const { adviceRecId } = this.props.params;
		const { route } = this.props;
		if (!route || !adviceRecId) {
			this.context.router.replace(businessRoute.OpinionAdmin);
		}
		this.state = {
			operType: Constant.OPER_TYPE_EDIT,
		};

	}

	componentWillMount () {
		const { actions } = this.props;
		const { adviceRecId } = this.props.params;
		actions.qryOpinionById(adviceRecId);
	}

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType } = nextProps;
		const { params } = this.props;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (`${DEAL_OPINION}_SUCCESS` === actionType) { //处理完成
					if (rspInfo.resultCode === Constant.REST_OK) {
						let msg = '意见成功';
						if (this.state.operType == Constant.OPER_TYPE_EDIT) {
							msg = `处理${msg}`;
						} else {
							MsgUtil.showwarning('未知操作');
							return;
						}
						MsgUtil.showinfo(msg);
						this.context.router.replace(`${businessRoute.OpinionAdmin}${params.prepage?`/${params.prepage}`:''}`);
					} else {
						MsgUtil.showerror(
							`修改产品信息.错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
					}
				} else if (`${QRY_OPINION_BY_ID}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询意见信息失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
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
		const { actions, currentAdviceInfo } = this.props;
		const { operType } = this.state;

		this.props.form.validateFields((errors, editForm) => {
			if (!!errors) {
				console.log('表单验证失败!!!');
				return;
			}
			const afterMergeForm = Immutable.Map(currentAdviceInfo).
				set('dealSts', editForm.dealSts).
				set('dealPerson', editForm.dealPerson).
				set('dealTime', editForm.dealTime &&
					new Date(editForm.dealTime.format()).getTime()).
				set('dealResult', editForm.dealResult).
				set('dealRemark', editForm.dealRemark).
				toObject();

			console.log('operType', operType);
			console.log('afterMergeForm', afterMergeForm);
			// return;
			actions.dealAdviceInfo(operType, afterMergeForm);
		});
	};

	render () {
		//ant-desigen定义的
		const { getFieldDecorator } = this.props.form;
		const { currentAdviceInfo,params } = this.props;

		//ant-desigen中的名称和内容各占多少列
		const formItemLayout = {
			labelCol: { span: 45 },
			wrapperCol: { span: 68 },
		};

		//意见记录id
		const AdviceInfoRecIdProps = getFieldDecorator('recId', {
			initialValue: currentAdviceInfo.recId,

		});

		//反馈用户wenwenId
		const WenwenIdProps = getFieldDecorator('wenwenId', {
			initialValue: currentAdviceInfo.wenwenId,
		});

		//客户端类型
		const ClientTypeProps = getFieldDecorator('clientType', {
			initialValue: currentAdviceInfo.clientType,
		});

		//反馈时间
		const AdviceInfoProps = getFieldDecorator('adviceInfo', {
			initialValue: currentAdviceInfo.adviceInfo,
		});

		//反馈时间
		const AdviceTimeProps = getFieldDecorator('adviceTime', {
			initialValue: currentAdviceInfo.adviceTime &&
			moment(currentAdviceInfo.adviceTime),
		});

		//处理状态
		const DealStsProps = getFieldDecorator('dealSts', {
			initialValue: currentAdviceInfo.dealSts
				? String(currentAdviceInfo.dealSts)
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

		//处理人
		const DealPersonProps = getFieldDecorator('dealPerson', {
			initialValue: currentAdviceInfo.dealPerson,
			rules: [
				{ required: false, max: 10, whitespace: true },
			],
		});
		const DealResultProps = getFieldDecorator('dealResult', {
			initialValue: currentAdviceInfo.dealResult,
			rules: [
				{ required: false, min: 1, message: '处理结果', whitespace: true },
				{ whitespace: true, max: 400, message: '最多输入400个字符' },
			],
		});

		//处理时间
		const DealTimeProps = getFieldDecorator('dealTime', {
			initialValue: currentAdviceInfo.dealTime &&
			moment(currentAdviceInfo.dealTime),
			rules: [
				{ required: true, message: '处理时间不允许为空' },
			],
		});

		//备注
		const RemarkProps = getFieldDecorator('remark', {
			initialValue: currentAdviceInfo.remark,
			rules: [
				{ required: false, min: 1, message: '备注', whitespace: true },
				{ whitespace: true, max: 400, message: '最多输入400个字符' },
			],
		});
		return (
			<div>
				<Row>
					<Col span={16} >
						<Link to={`${businessRoute.OpinionAdmin}${params.prepage?`/${params.prepage}`:''}`}  className="ant-btn" style={{ lineHeight: '25px' }}>
							<Icon type="backward" />
							<span>&nbsp;&nbsp;用户意见管理</span>
						</Link>
					</Col>
				</Row>

				<br />
				<br />
				<br />
				<Row>
					<Col offset={3} >

						<Form layout="inline" >


							<FormItem {...formItemLayout} label="意见记录ID" >
								{AdviceInfoRecIdProps(
									<Input type="text" size="large" style={{ width: 243 }} />,
								)}
							</FormItem>


							<FormItem {...formItemLayout} label="用户吻吻ID" >
								{WenwenIdProps(
									<Input type="text" size="large" style={{ width: 243 }} placeholder="反馈用户吻吻ID" />,
								)}
							</FormItem>

							<br />
							<br />
							<FormItem {...formItemLayout} label="客户端类型" >
								{ClientTypeProps(
									<Input type="text" size="large" style={{ width: 243 }} />,
								)}
							</FormItem>


							<FormItem {...formItemLayout} label="&nbsp;&nbsp;&nbsp;反馈时间" >
								{AdviceTimeProps(
									<DatePicker style={{ width: 243 }} />,
								)}
							</FormItem>
							<br />
							<br />
							<FormItem {...formItemLayout} label="&nbsp;&nbsp;&nbsp;反馈内容" >
								{AdviceInfoProps(
									<Input
										type="textarea"
										style={{
											width: 243,
											height: 32,
										}} size="large"
										disabled
									/>,
								)}
							</FormItem>

							<FormItem {...formItemLayout} label="处理时间" >
								{DealTimeProps(
									<DatePicker placeholder="请输入处理时间" style={{ width: 245 }} />,
								)}
							</FormItem>

							<br />
							<br />

							<FormItem {...formItemLayout} label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;处理人" >
								{DealPersonProps(
									<Input type="text" size="large" placeholder="请输入处理人" style={{ width: 243 }} />,
								)}
							</FormItem>
							<FormItem {...formItemLayout} label="处理状态" >
								{DealStsProps(
									<Select filterOption={false} style={{ width: 245 }} >
										<Option value="0" >待处理</Option>
										<Option value="1" >已阅</Option>
										<Option value="2" >已处理</Option>
									</Select>,
								)}
							</FormItem>

							<br />
							<br />

							<FormItem {...formItemLayout} label="&nbsp;&nbsp;处理结果" >
								{DealResultProps(
									<Input
										type="textarea" size="large" placeholder="请输入处理结果"
										style={{
											width: 243,
											height: 32,
										}}
									/>,
								)}
							</FormItem>
							<br /><br />
							<FormItem {...formItemLayout} label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;备注" >
								{RemarkProps(
									<Input type="textarea" rows={6} size="large" style={{ width: 572 }} />,
								)}
							</FormItem>
							<Row>
								&nbsp;   &nbsp;
							</Row>
							<Row>
								&nbsp;   &nbsp;
							</Row>
							<Row>
								<Col span={16} style={{ textAlign: 'center' }} >
									<Button type="primary" onClick={this.handleSubmit} >提交</Button>&nbsp;&nbsp;
									<Button type="primary" onClick={this.handleReset} >重置</Button>&nbsp;&nbsp;
								</Col>
							</Row>

						</Form>
					</Col>
				</Row>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { adviceInfoList, currentAdviceInfo } = state.get('OpinionService').
		toObject();
	return { actionType, rspInfo, adviceInfoList, currentAdviceInfo };
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({ qryOpinionById, dealAdviceInfo },
			dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	Form.create()(OpinionEdit));
