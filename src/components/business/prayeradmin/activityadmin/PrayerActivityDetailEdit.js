'use strict';

import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Immutable from 'immutable';
import {
	Badge,
	Button,
	Col,
	DatePicker,
	Form,
	Icon,
	Input,
	Row,
	Select,
	Upload,
} from 'antd';

import * as Constant from 'utils/Constant';
import * as MsgUtil from 'utils/MsgUtil';
import * as businessRoute from 'business/route';
import MySelect from 'framework/components/Select';
import {
	handleUploadFile,
	handleUploadImage,
	initOssFileUploadProps,
	PubImageUploadProps,
} from 'utils/UploadUtil';
import {
	DEAL_ACTIVITY_DETAIL,
	dealPrayerActivityDetail,
	initAActivityDetailForAdd,
	QRY_ACTIVITY_DETAIL_BY_ID,
	qryActivityDetailById,
} from 'src/components/business/prayeradmin/activityadmin/action';

import SelectData from './SelectData.json';

const FormItem = Form.Item;

class PrayerActivityDetailEdit extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired,
	};
	static propTypes = {
		currentActivityDetail: PropTypes.object.isRequired,
		rspInfo: PropTypes.object,
		actionType: PropTypes.string,
		form: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		route: PropTypes.object.isRequired,
		params: PropTypes.object.isRequired,
	};
	static defaultProps = {
		currentActivityDetail: {},
		rspInfo: undefined,
		actionType: '',
	};

	constructor(props) {
		super(props);
		const {route} = props;
		if (!route) {
			this.context.router.replace(businessRoute.prayerActivityAdmin);
		}
		const operType = route.path ===
		businessRoute.prayerActivityDetailEditById
			? Constant.OPER_TYPE_EDIT
			: Constant.OPER_TYPE_ADD;
		this.state = {operType};
	}

	componentWillMount() {
		const {operType} = this.state;
		const {actions, params} = this.props;
		if (operType == Constant.OPER_TYPE_EDIT) {
			const activityId = params.activityId;
			const locale = params.locale;
			actions.qryActivityDetailById(activityId, locale);
		} else {
			const activityId = params.activityId;
			actions.initAActivityDetailForAdd(activityId);
		}
	}

	componentWillReceiveProps(nextProps) {
		const {rspInfo, actionType} = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (`${DEAL_ACTIVITY_DETAIL}_SUCCESS` === actionType) { //处理完成
					if (rspInfo.resultCode === Constant.REST_OK) {
						let msg = '活动详情';
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
						this.context.router.replace(
							businessRoute.prayerActivityAdmin);
					} else {
						if (this.state.operType == Constant.OPER_TYPE_ADD) {
							MsgUtil.showerror(
								`新增活动详情错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						} else {
							MsgUtil.showerror(
								`修改活动详情错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						}
					}
				} else if (`${QRY_ACTIVITY_DETAIL_BY_ID}_SUCCESS` ===
					actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询活动详情失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
						return;
					}
				}
			}
		}
		const {getFieldValue} = nextProps.form;
		if (getFieldValue('coverUploadType') === 'url') {
			this.setState({
				coverViewUploadFileSrc: getFieldValue('activityCover'),
			});
		}
		if (getFieldValue('voiceUploadType') === 'url') {
			this.setState({
				voiceViewUploadFileSrc: getFieldValue('lectionVoice'),
			});
		}
	}

	getCoverUploader = (uploadProps) => {
		const {currentActivityDetail} = this.props;
		const {getFieldValue, getFieldDecorator} = this.props.form;
		if (getFieldValue('coverUploadType') === 'url') {
			const ActivityCoverProps = getFieldDecorator(
				'activityCover', {
					initialValue: currentActivityDetail.activityCover,
					rules: [
						{required: true, message: '请输入封面图片网络地址'},
					],
				});
			return (
				<span>
					{ActivityCoverProps(
						<Input size="large" style={{width: '75%'}}/>,
					)}
				</span>
			);
		} else {
			return (
				<Upload {...uploadProps}>
					<Button type="ghost" size="large">
						<Icon type="upload"/> 点击上传
					</Button>
				</Upload>
			);
		}
	};

	getCoverUploadPlugin = () => {
		const {currentActivityDetail} = this.props;
		const uploadFileProps = initOssFileUploadProps(
			{onChange: this.handleCoverFileChange},
		);
		let {coverViewUploadFileSrc} = this.state;
		const formItemLayout = {
			labelCol: {span: 5},
			wrapperCol: {span: 19},
		};

		if (!coverViewUploadFileSrc) {
			coverViewUploadFileSrc = currentActivityDetail.activityCover;
		}

		const lable = '活动封面';
		const picTakerNode =
			(
				coverViewUploadFileSrc && <a href={coverViewUploadFileSrc} onClick={this.handlePicClick}
				   target="_blank" rel="noopener noreferrer">
					<img src={coverViewUploadFileSrc} className="viewImg" width="35"
						 height="35" alt=""/>
					<Badge dot><span>点击放大</span></Badge>
				</a>
			);
		return (
			<FormItem {...formItemLayout} label={lable} required>
				{this.getCoverUploader(uploadFileProps)}
				{picTakerNode}
			</FormItem>
		);
	};

	getVoiceUploader = (uploadProps) => {
		const {currentActivityDetail} = this.props;
		const {getFieldValue, getFieldDecorator} = this.props.form;
		if (getFieldValue('voiceUploadType') === 'url') {
			const LectionVoiceProps = getFieldDecorator(
				'lectionVoice', {
					initialValue: currentActivityDetail.lectionVoice,
				});
			return (
				<span>
					{LectionVoiceProps(
						<Input size="large" style={{width: '75%'}}/>,
					)}
				</span>
			);
		} else {
			return (
				<Upload {...uploadProps}>
					<Button type="ghost" size="large">
						<Icon type="upload"/> 点击上传
					</Button>
				</Upload>
			);
		}
	};
	getVoiceUploadPlugin = () => {
		const {currentActivityDetail} = this.props;

		const uploadFileProps = initOssFileUploadProps(
			{onChange: this.handleVoiceFileChange},
		);

		let {voiceViewUploadFileSrc} = this.state;
		const formItemLayout = {
			labelCol: {span: 5},
			wrapperCol: {span: 19},
		};

		if (!voiceViewUploadFileSrc) {
			voiceViewUploadFileSrc = currentActivityDetail.lectionVoice;
		}

		const lable = '经文音频';
		const picTakerNode =
			(
				voiceViewUploadFileSrc && <a href={voiceViewUploadFileSrc} rel="noopener noreferrer">下载</a>
			);
		return (
			<FormItem {...formItemLayout} label={lable} required>
				{this.getVoiceUploader(uploadFileProps)}
				{picTakerNode}
			</FormItem>
		);
	};
	//Form reset
	handleReset = (e) => {
		e.preventDefault();
		this.props.form.resetFields();
	};

	handleSubmit = (e) => {
		e.preventDefault();
		const {actions, currentActivityDetail} = this.props;
		const {operType, coverUploadStatus, coverUploadPath, voiceUploadStatus, voiceUploadPath} = this.state;
		this.props.form.validateFields((errors, editForm) => {
			console.log('PrayerActivityDetailEdit commit formEdit', editForm);
			if (!!errors) {
				console.log('表单验证失败!!!');
				return;
			}
			if (coverUploadStatus && coverUploadStatus !== 'completed') {
				MsgUtil.showwarning('文件上传未完成，请等待文件上传成功后再提交变更!');
				return;
			}
			if (voiceUploadStatus && voiceUploadStatus !== 'completed') {
				MsgUtil.showwarning('文件上传未完成，请等待文件上传成功后再提交变更!');
				return;
			}
			let afterMergeForm = Immutable.Map(currentActivityDetail).
				merge(editForm);
			if (coverUploadStatus && coverUploadPath) {
				afterMergeForm = afterMergeForm.set('activityCover', coverUploadPath);
			}
			if (voiceUploadStatus && voiceUploadPath) {
				afterMergeForm = afterMergeForm.set('lectionVoice', voiceUploadPath);
			}
			actions.dealPrayerActivityDetail(operType,
				afterMergeForm.toObject());
		});
	};

	handleCoverFileChange = (info) => {
		let coverUploadList = info.fileList;
		const {FileUploadPath, SrcPath} = handleUploadFile(coverUploadList);
		if (FileUploadPath && coverUploadList.length > 0) {
			coverUploadList = [coverUploadList[coverUploadList.length - 1]];
			const {setFieldsValue, getFieldValue} = this.props.form;
			setFieldsValue({activityCover: FileUploadPath});
		}
		this.setState({
			coverUploadPath: FileUploadPath,
			coverUploadStatus: FileUploadPath ? 'completed' : 'uploading',
			coverViewUploadFileSrc: SrcPath,
			coverUploadList,
		});
	};
	handleVoiceFileChange = (info) => {
		let voiceUploadList = info.fileList;
		const {FileUploadPath, SrcPath} = handleUploadFile(voiceUploadList);
		if (FileUploadPath && voiceUploadList.length > 0) {
			voiceUploadList = [voiceUploadList[voiceUploadList.length - 1]];
			const {setFieldsValue} = this.props.form;
			setFieldsValue({lectionVoice: FileUploadPath});
		}
		this.setState({
			voiceUploadPath: FileUploadPath,
			voiceUploadStatus: FileUploadPath ? 'completed' : 'uploading',
			voiceViewUploadFileSrc: SrcPath,
			voiceUploadList,
		});
	};

	handlePicClick = () => {
		const {currentActivityDetail} = this.props;
		if (this.state.coverViewUploadFileSrc == '') {
			if (currentActivityDetail === undefined) {
				MsgUtil.showwarning('暂无封面');
			}
		}
	};

	render() {
		const {getFieldDecorator} = this.props.form;
		const {currentActivityDetail} = this.props;
		//ant-design中的名称和内容各占多少列
		const formItemLayout = {
			labelCol: {span: 10},
			wrapperCol: {span: 14},
		};
		const allRowFormItemLayout = {
			labelCol: {span: 5},
			wrapperCol: {span: 19},
		};

		const ActivityIdProps = getFieldDecorator('activityId', {
			initialValue: currentActivityDetail.activityId,
			rules: [
				{required: true, message: '请输入活动id'},
			],
		});
		const LocaleProps = getFieldDecorator('locale', {
			initialValue: currentActivityDetail.locale,
			rules: [
				{required: true, message: '请选择语言'},
			],
		});

		const ActivityTitleProps = getFieldDecorator('activityTitle', {
			initialValue: currentActivityDetail.activityTitle,
			rules: [
				{required: true, min: 1, message: '请输入活动详情标题'},
			],
		});
		const ActivityDescProps = getFieldDecorator('activityDesc', {
			initialValue: currentActivityDetail.activityDesc,
			rules: [
				{required: true, min: 1, message: '请输入活动详情描述'},
			],
		});
		const LectionTitleProps = getFieldDecorator('lectionTitle', {
			initialValue: currentActivityDetail.lectionTitle,
			rules: [
				{required: true, min: 1, message: '请输入经文名称'},
			],
		});
		const BuddhistProps = getFieldDecorator('buddhist', {
			initialValue: currentActivityDetail.buddhist,
			rules: [
				{required: true, min: 1, message: '请输入活动佛号'},
			],
		});
		const LectionContentProps = getFieldDecorator('lectionContent', {
			initialValue: currentActivityDetail.lectionContent,
			rules: [
				{required: true, min: 1, message: '请输入经文内容'},
			],
		});

		const CoverUploadTypeProps = getFieldDecorator('coverUploadType', {
			initialValue: 'localUpload',
			rules: [
				{required: true},
			],
		});
		const VoiceUploadTypeProps = getFieldDecorator('voiceUploadType', {
			initialValue: 'localUpload',
			rules: [
				{required: true},
			],
		});

		return (
			<Form>
				<Row>
					<Col span={24}>
						<Button>
							<Link to={businessRoute.prayerActivityAdmin}>
								<Icon type="backward"/>
								<span>&nbsp;&nbsp;活动管理</span>
							</Link>
						</Button>
					</Col>
				</Row><br/><br/><br/>
				<Row>
					<Col span={18}>
						<FormItem>
							<Col span={12}>
								<FormItem {...formItemLayout} label="活动id">
									{ActivityIdProps(
										<Input disabled/>,
									)}
								</FormItem>
							</Col>
							<Col span={11}>
								<FormItem {...formItemLayout} label="语言">
									{LocaleProps(
										<Select size="large"
												style={{width: 243}}>
											<Select.Option
												value="zh_CN">简体中文</Select.Option>
											<Select.Option
												value="zh_TW">台湾繁体</Select.Option>
											<Select.Option
												value="zh_HK">香港繁体</Select.Option>
										</Select>,
									)}
								</FormItem>
							</Col>
						</FormItem>
						<FormItem {...allRowFormItemLayout} label="活动标题">
							{ActivityTitleProps(
								<Input type="text" size="large"
									   style={{width: '85.5%'}}/>,
							)}
						</FormItem>
						<FormItem {...allRowFormItemLayout} label="活动描述">
							{ActivityDescProps(
								<Input type="textarea" rows={6} style={{width: '85.5%'}}/>,
							)}
						</FormItem>
						<FormItem {...allRowFormItemLayout} label="活动封面上传方式">
							{CoverUploadTypeProps(
								<Select size="large"
										style={{width: 243}}>
									<Select.Option key="localUpload"
												   value="localUpload">本地上传</Select.Option>
									<Select.Option key="url"
												   value="url">网络地址</Select.Option>
								</Select>,
							)}
						</FormItem>
						{this.getCoverUploadPlugin()}
						<FormItem>
							<Col span={12}>
								<FormItem {...formItemLayout} label="经文名称">
									{LectionTitleProps(
										<Input/>,
									)}
								</FormItem>
							</Col>
							<Col span={9}>
								<FormItem {...formItemLayout} label="活动佛号">
									{BuddhistProps(
										<Input/>,
									)}
								</FormItem>
							</Col>
						</FormItem>
						<FormItem {...allRowFormItemLayout} label="经文内容">
							{LectionContentProps(
								<Input type="textarea" rows={6} style={{width: '85.5%'}}/>,
							)}
						</FormItem>
						<FormItem {...allRowFormItemLayout} label="经文音频上传方式">
							{VoiceUploadTypeProps(
								<Select size="large"
										style={{width: 243}}>
									<Select.Option key="localUpload"
												   value="localUpload">本地上传</Select.Option>
									<Select.Option key="url"
												   value="url">网络地址</Select.Option>
								</Select>,
							)}
						</FormItem>
						{this.getVoiceUploadPlugin()}
					</Col>
				</Row>
				<Row>
					<Col span={12} style={{textAlign: 'center'}}>
						<Button type="primary"
								onClick={this.handleSubmit}>提交</Button>&nbsp;&nbsp;
						<Button type="primary"
								onClick={this.handleReset}>重置</Button>&nbsp;&nbsp;
					</Col>
				</Row>
			</Form>
		);
	}
}

const mapStateToProps = (state) => {
	const {rspInfo, actionType} = state.get('RootService').toObject();
	const {currentActivityDetail} = state.get('ActivityService').toObject();
	return {currentActivityDetail, rspInfo, actionType};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryActivityDetailById,
			initAActivityDetailForAdd,
			dealPrayerActivityDetail,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	Form.create()(PrayerActivityDetailEdit));
