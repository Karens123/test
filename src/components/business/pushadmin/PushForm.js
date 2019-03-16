'use strict';

import * as Immutable from 'immutable';
import moment from 'moment';
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	Button,
	Card,
	Col,
	Collapse,
	DatePicker,
	Form,
	Input,
	InputNumber,
	Radio,
	Row,
	Select,
	TimePicker,
} from 'antd';
import * as actions from 'action';
import PanelBox from 'framework/components/PanelBox';
import { getStaticDataByCodeType } from 'business/common/StaticDataService';
import MySelect from 'framework/components/Select';
import * as MsgUtil from 'utils/MsgUtil';
import * as Constant from 'utils/Constant';
import AfterOnClickOptPlus from './plus/AfterOnClickOptPlus';

import FormField from './FormField';
import IosEnvPlus from './plus/IosEnvPlus';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const Panel = Collapse.Panel;

const {
	titleFN, bodyFN, pushBigTypeFN, pushTypeFN, androidOpenTypeFN, androidActivityFN,
	androidOpenUrlFN, customExtParamsItemsFN, isCustomExtParamsFN, notifyTypeFN,
	targetFN, targetValueFN, isSetPushTimeFN, pushTimeDatePickerFN, pushTimeTimePickerFN,
	isStoreOfflineFn, expireTimeFN, apnsEnvFN, remindFN, isIosAddOpenUrlFN,androidNotificationChannelFN
} = FormField;

const pushBigType = [// 1-系统 2-活动/推荐 3-吻吻服务 4-资讯
	{ key: '1', value: '系统' },
	{ key: '2', value: '活动/推荐' },
	{ key: '3', value: '吻吻服务' },
	{ key: '4', value: '资讯' },
];
const pushType = {

	// 大类1-系统：1-系统信息，1001-强制退出消息，后续从1002开始定义；
	// 大类2-活动/推荐：2-活动信息，后续从2001开始定义；
	// 大类3-吻吻服务：3-发起绑定 4-绑定回应 6-吻吻蜜语
	// 8-情侣等级提升 9-背景图片更新，后续从3001开始定义；
	// 大类4-资讯：4001-普通资讯
	1: [{ key: '1001', value: '强制退出' }],
	2: [{ key: '2', value: '活动信息' }],
	3: [
		// {key:"3", value:"发起绑定"},
		// {key:"4", value:"绑定回应"},
		{ key: '6', value: '吻吻蜜语' },
		{ key: '8', value: '情侣等级提升' },
		{ key: '9', value: '背景图片更新' },
		{ key: '3009', value: '今日睡眠报告' },
		{ key: '3100', value: '运动计步晚上9点10点提醒' },
	],
	4: [{ key: '4001', value: '普通资讯' }],
};

const titleMaxSize = 20;
const bodyMaxSize = 60;
const extParamsItemUuid = 0;

class PushForm extends React.Component {

	static propTypes = {
		actions: PropTypes.object.isRequired,
		form: PropTypes.object.isRequired,
		type: PropTypes.number.isRequired,
		deviceType: PropTypes.number.isRequired,
		countryList: PropTypes.array.isRequired,
	};
	static defaultProp = {
		countryList: []
	}
	componentWillMount() {
		const { actions, countryList } = this.props;
		if (!countryList || countryList.length < 1) {
			actions.getStaticDataByCodeType(Constant.USER_COUNTRY_ATTR_CODE);
		}
	}
	onPushBigTypeChange = (evt) => {
		const { getFieldValue, setFieldsValue } = this.props.form;
		setFieldsValue(pushTypeFN,
			pushType[getFieldValue(pushBigTypeFN)][0].key);
	};

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((errors, values) => {
			if (!!errors) {
				return;
			}
			let data = Immutable.Map(values).
				set('type', this.props.type === undefined ? 0 : Number(
					this.props.type))//0:表示消息(默认为0), 1:表示通知
				.set('deviceType', this.props.deviceType);  //设备类型，取值范围为：0：iOS设备 1：Andriod设备 3：全部类型设备

			if (data.get('deviceType') === '1') { //android设备推送不需要上传ios apns环境变量
				data = data.delete(apnsEnvFN);
			}
			if (data.get('type') === 1) { //通知类型才有打开方式选项
				if (data.get(androidOpenTypeFN) === 'ACTIVITY') { //打开指定页面
					if (!data.get(androidActivityFN)) {
						MsgUtil.showwarning('指定打开的页面不允许为空');
						return;
					}
					data.set('xiaomiActivity', data.get(androidActivityFN)); //xiaomiActivity与androidActivity赋值一直，由服务端判断怎么推
				}
				if (data.get(androidOpenTypeFN) === 'URL' &&
					!data.get(androidOpenUrlFN)) { //打开指定网页
					MsgUtil.showwarning('指定打开的网页不允许为空');
					return;
				}
				//删除无效字段
				if (data.get(androidOpenTypeFN) === 'APPLICATION' ||
					data.get(androidOpenTypeFN) === 'NONE') { //打开应用或者无逻辑
					data = data.delete(androidActivityFN).
						delete(androidOpenUrlFN);
				}
			} else {
				data = data.delete(androidActivityFN).delete(androidOpenUrlFN);
			}

			//填充自定义扩展参数
			if (data.get(isCustomExtParamsFN) || data.get(isIosAddOpenUrlFN)) {

				const extParameters = {};
				data.get(customExtParamsItemsFN).map((item) => {
					const key = `extParamsKey_${item}`;
					if (data.get(key)) {
						extParameters[data.get(key)] = data.get(
							`extParamsValue_${item}`);
					}
				});
				data = data.set('extParameters', Immutable.Map(extParameters).merge(data.get('extParameters')));
			}

			data = data.delete(isCustomExtParamsFN).
				delete(customExtParamsItemsFN);

			if (data.get(targetFN) === 'DEVICE' && !data.get(targetValueFN)) {
				MsgUtil.showwarning('指定设备信息不正确');
				return;
			}
			if (data.get(targetFN) === 'ACCOUNT' && !data.get(targetValueFN)) {
				MsgUtil.showwarning('指定wenwenId信息不正确');
				return;
			}
			if (data.get(targetFN) === 'ALL') {
				data.set(targetValueFN, 'ALL');
			}
			//设置推送时间
			if (data.get(isSetPushTimeFN) === 'true') {
				if (!data.get(pushTimeDatePickerFN) || !data.get(pushTimeTimePickerFN)) {
					MsgUtil.showwarning('推送日期不允许为空');
					return;
				} else {
					console.log('需要精确到分钟____________', moment(data.get(pushTimeDatePickerFN)).format('YYYYMMDD') + moment(data.get(pushTimeTimePickerFN)).format('HHmm'));
					data.set('pushTime', moment(data.get(pushTimeDatePickerFN)).format('YYYYMMDD') + moment(data.get(pushTimeTimePickerFN)).format('HHmmss'));
					const pushTimeFormNowLengthSplit = moment(data.get('pushTime'), 'YYYYMMDDHHmmss').fromNow().split(' ');

					if (pushTimeFormNowLengthSplit[1] === '天前') {
						MsgUtil.showwarning(`推送日期不允许选择${moment(data.get('pushTime'), 'YYYYMMDDHHmmss').fromNow()}`);
						return;
					}
					if (Number(pushTimeFormNowLengthSplit[0]) > 7) {
						MsgUtil.showwarning('推送日期不允许大于7天');
						return;
					}
				}
			}
			data = data.delete(isSetPushTimeFN).
				delete(pushTimeDatePickerFN).
				delete(pushTimeTimePickerFN);

			if (data.get(isStoreOfflineFn) === 'true') {
				const expireTime = Number(data.get(expireTimeFN));
				if (expireTime < 1 || expireTime > 72) {
					MsgUtil.showwarning('离线保存时间最短1小时，最长72小时');
					return;
				}
			} else {
				data = data.delete(expireTimeFN);
			}
			//当设备类型为1-android或者3-所有设备时，填充Android提醒方式
			if (data.get('deviceType') === '1' ||
				data.get('deviceType') === '3') {
				const extParameters = {};
				extParameters['_NOTIFY_TYPE_'] = data.get(notifyTypeFN);
				data.set('extParameters', Immutable.Map(extParameters).merge(data.get('extParameters')));
			}
			if (data.get('extParameters')) {
				data = data.set('extParameters', JSON.stringify(data.get('extParameters').toJS()));
			}
			data = data.delete(notifyTypeFN);

			//target targetValue处理
			if (data.get(targetFN) === 'COUNTRY') {
				console.log('data.get(targetValueFN)', data.get(targetValueFN));
				if ( data.get(targetValueFN) && data.get(targetValueFN) !== 'ALL' ) {
					data = data.set(targetFN, 'tag');
				} else {
					data = data.set(targetFN, 'ALL').set(targetValueFN, 'ALL');
				}
			}
			data = data.set(androidNotificationChannelFN, 1);
			if (data.get('type') === 1) {
				this.props.actions.pushNotification(data);
			} else {
				this.props.actions.pushMessage(data);
			}
		});
	};

	render () {
		const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form;

		//通知大类
		const PushBigTypeProp = getFieldDecorator(pushBigTypeFN, {
			initialValue: pushBigType[0].key,
			onChange: this.onPushBigTypeChange,
		});

		const pushBigTypeOptions = pushBigType.map(
			bigType =>
				<Option key={bigType.key} >{bigType.key}-{bigType.value}</Option>);

		//通知小类
		const PushTypeProp = getFieldDecorator(pushTypeFN,
			{ initialValue: pushType[getFieldValue(pushBigTypeFN)][0].key });
		const pushTypeOptions = () => {
			return pushType[getFieldValue(pushBigTypeFN)].map(
				pushType =>
					<Option key={pushType.key} >{pushType.key}-{pushType.value}</Option>);
		};

		//获取标题实际长度
		const titleFactSize = () => {
			const value = getFieldValue(titleFN);
			return String(value ? value.length : 0);
		};

		const titleNode = (contentLabel) => {
			if (this.props.type === '1' && this.props.deviceType === '0') { //通知且ios设备
				getFieldDecorator(titleFN, { initialValue: '' });
				return undefined;
			} else {
				const TitleProp = getFieldDecorator(titleFN, {
					initialValue: '',
					rules: [
						{ required: true, max: 20 },
					],
					validateTrigger: 'onBlur',
				});
				const titleLabel = `${contentLabel}标题`;
				return (
					<Row>
						<Row style={{ height: 25 }} >{titleLabel}:
							<span style={{ float: 'right' }} >
								{titleFactSize()}/{String(titleMaxSize)}
							</span>
						</Row>
						<FormItem  {...formItemLayout}>
							{TitleProp(
								<Input style={{ width: '100%' }} />,
							)}
						</FormItem>
					</Row>
				);
			}
		};

		const BodyProp = getFieldDecorator(bodyFN, {
			initialValue: '',
			rules: [{ required: true, max: 60 }],
			validateTrigger: 'onBlur',
		});

		//获取内容实际长度
		const bodyFactSize = () => {
			const value = getFieldValue(bodyFN);
			return String(value ? value.length : 0);
		};

		//ios推送环境
		const ApnsEnvProp = getFieldDecorator(apnsEnvFN,
			{ initialValue: 'DEV' });


		//点击后操作的字段
		const IsCustomExtParamsProp = getFieldDecorator(isCustomExtParamsFN,
			{ initialValue: false });
		const isCustomExtParams = getFieldValue(isCustomExtParamsFN);
		const AndroidOpenTypeProp = getFieldDecorator(androidOpenTypeFN,
			{ initialValue: 'APPLICATION' });
		const androidOpenTypeValue = getFieldValue(androidOpenTypeFN);
		const AndroidActivityProp = getFieldDecorator(androidActivityFN,
			{ initialValue: undefined });
		const AndroidOpenUrlProp = getFieldDecorator(androidOpenUrlFN,
			{ initialValue: undefined });
		getFieldDecorator(customExtParamsItemsFN, {
			initialValue: [extParamsItemUuid],
		});
		const customExtParamsItems = getFieldValue(customExtParamsItemsFN);

		//推送目标
		const TargetProp = getFieldDecorator(targetFN, { initialValue: 'ALL' });
		const TargetValueProp = getFieldDecorator(targetValueFN, { initialValue: 'ALL' });

		const targetValueNode = () => {
			switch (getFieldValue(targetFN)) {
				case 'ALL':
					return undefined;
				case 'DEVICE':
					return (
						<Row>
							{TargetValueProp(
								<Input placeholder="请输入deviceId,多个终端用逗号分隔" />,
							)}
						</Row>
					);
				case 'ACCOUNT':
					return (
						<Row>
							{TargetValueProp(
								<Input placeholder="请输入wenwenId,多个wenwenId用逗号分隔" />,
							)}
						</Row>
					);
				case 'COUNTRY': {
					getFieldDecorator(targetValueFN, { initialValue: '' });
					const { countryList } = this.props;
					return (
						<Row>
							{TargetValueProp(
								<MySelect defaultValue="" selectOptionDataList={countryList} descKey="codeName" valueKey="codeValue" />
							)}
						</Row>
					);
				}

			}
		};
		//推送时间
		const IsSetPushTimeProp = getFieldDecorator(isSetPushTimeFN,
			{ initialValue: 'false' });
		const currentDate = moment(new Date());
		const PushTimeDatePickerProp = getFieldDecorator(pushTimeDatePickerFN, {
			initialValue: currentDate,
			format: 'YYYY-MM-DD',
		});
		const PushTimeTimePickerProp = getFieldDecorator(pushTimeTimePickerFN, {
			initialValue: currentDate,
			format: 'HH:mm:ss',
		});
		const pushTimeNode = () => {
			switch (getFieldValue(isSetPushTimeFN)) {
				case 'true':
					return (
						<Row>
							{PushTimeDatePickerProp(<DatePicker />)}
							{PushTimeTimePickerProp(<TimePicker />)}
						</Row>
					);
				default:
					return undefined;
			}
		};

		//离线保存
		const IsStoreOfflineProp = getFieldDecorator(isStoreOfflineFn,
			{ initialValue: 'true' });
		const ExpireTimeProp = getFieldDecorator(expireTimeFN,
			{ initialValue: 72 });
		const expireTimeNode = () => {
			if (getFieldValue(isStoreOfflineFn) === 'true') {
				return (<Row>保存 {ExpireTimeProp(
					<InputNumber min={1} max={72} />)}小时，该时段之后再上线的用户将收不到推送</Row>);
			}
			return undefined;
		};

		const formItemLayout = {
			style: { width: '100%' },
			wrapperCol: { span: 24 },
		};

		let contentPanelBoxLabel;
		if (this.props.type === '1') {
			contentPanelBoxLabel = '通知';
		} else {
			contentPanelBoxLabel = '消息';
		}
		return (
			<Row>
				<Col span={15} >
					<Form layout="inline" >
						<Row>&nbsp;</Row>
						<Row style={{ width: 1045 }} >
							推送大类 &nbsp; &nbsp;
							{PushBigTypeProp(
								<Select style={{ width: 250 }} >
									{pushBigTypeOptions}
								</Select>,
							)}&nbsp; &nbsp;
							推送小类 &nbsp; &nbsp;
							{PushTypeProp(
								<Select style={{ width: 265 }} >
									{pushTypeOptions()}
								</Select>,
							)}
						</Row>
						<Row />
						<PanelBox
							title={`${contentPanelBoxLabel}内容(必填)`}
							style={{ marginTop: '10px', width: 650 }}
						>
							{titleNode(contentPanelBoxLabel)}
							<Row />
							<Row style={{ height: 25 }} >
								{contentPanelBoxLabel}内容:
								<span style={{ float: 'right' }} >{bodyFactSize()}/{String(
									bodyMaxSize)}</span>
							</Row>
							<FormItem  {...formItemLayout}>
								{BodyProp(
									<Input type="textarea" />,
								)}
							</FormItem>
						</PanelBox>

						<IosEnvPlus deviceType={this.props.deviceType} ApnsEnvProp={ApnsEnvProp} style={{ width: 650 }} />

						<Collapse style={{ marginTop: '25px', width: 650 }} >
							<Panel header="高级设置(选填)" >

								<Card
									title="发送对象及时间:"
									style={{
										marginTop: '5px',
										lineHeight: '28px',
										width: 650,
									}}
								>
									<AfterOnClickOptPlus
										deviceType={this.props.deviceType}
										AndroidOpenTypeProp={AndroidOpenTypeProp}
										androidOpenTypeValue={androidOpenTypeValue}
										IsCustomExtParamsProp={IsCustomExtParamsProp}
										isCustomExtParams={isCustomExtParams}
										customExtParamsItems={customExtParamsItems}
										AndroidActivityProp={AndroidActivityProp}
										AndroidOpenUrlProp={AndroidOpenUrlProp}
										getFieldDecoratorFn={getFieldDecorator}
										setFieldsValueFn={setFieldsValue}
									/>
									<Row>发送对象：&nbsp;&nbsp;
										{TargetProp(
											<RadioGroup  >
												<Radio value="ALL" >所有</Radio>
												<Radio value="DEVICE" >指定终端</Radio>
												<Radio value="ACCOUNT" >指定wenwenId</Radio>
												<Radio value="COUNTRY" >指定国家</Radio>
											</RadioGroup>,
										)}
									</Row>
									<Row>{targetValueNode()}</Row>
									<Row >发送时间：&nbsp;&nbsp;
										{IsSetPushTimeProp(
											<RadioGroup  >
												<Radio value="false" >立即发送</Radio>
												<Radio value="true" >定时发送</Radio>
											</RadioGroup>,
										)}
									</Row>
									<Row>{pushTimeNode()}</Row>
									<Row >离线保存：&nbsp;&nbsp;
										{IsStoreOfflineProp(
											<RadioGroup  >
												<Radio value="false" >不保存</Radio>
												<Radio value="true" >保存</Radio>
											</RadioGroup>,
										)}
									</Row>
									<Row>{expireTimeNode()}</Row>
								</Card>
							</Panel>
						</Collapse>
						<br />
						<Button type="primary" onClick={this.handleSubmit} style={{ marginTop: '10px' }} >确定</Button>
					</Form>
				</Col>
			</Row>
		);
	}
}

const mapStateToProps = (state) => {
	const StaticDataService = state.get('StaticDataService');
	const countryList = StaticDataService.get('staticDataList');
	return { countryList };
};

const mapDispatchToProps = (dispatch) => {
	const actionCreators = {
		pushNotification: actions.pushNotification,
		pushMessage: actions.pushMessage,
		getStaticDataByCodeType
	};
	return {
		actions: bindActionCreators(actionCreators, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	Form.create()(PushForm));
