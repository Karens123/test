'use strict';

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
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
	DEAL_APP_STATIC_RES_ITEM,
	dealAppStaticResItem,
	initAResItemForAdd,
	QRY_RES_ITEM_BY_ID,
	qryAppStaticResItemById,
} from 'action';

import SelectData from './SelectData.json';

const FormItem = Form.Item;
class AppStaticResItemEdit extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static propTypes = {
		currentAppStaticResItem: PropTypes.object.isRequired,
		rspInfo: PropTypes.object,
		actionType: PropTypes.string,
		form: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		route: PropTypes.object.isRequired,
		params: PropTypes.object.isRequired,
	};
	static defaultProps = {
		currentAppStaticResItem: {},
		rspInfo: undefined,
		actionType: '',
	};

	constructor (props) {
		super(props);
		const { route } = props;
		if (!route) {
			this.context.router.replace(businessRoute.AppStaticResAdmin);
		}
		const operType = route.path === businessRoute.AppStaticResItemEditById
			? Constant.OPER_TYPE_EDIT
			: Constant.OPER_TYPE_ADD;
		this.state = { operType };
	}

	componentWillMount () {

		const { operType } = this.state;
		const { actions, params } = this.props;
		if (operType == Constant.OPER_TYPE_EDIT) {
			const id = params.id;
			actions.qryAppStaticResItemById(id);
		} else {
			const appResourceId = params.appResourceId;
			actions.initAResItemForAdd(appResourceId);
		}
	}

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (`${DEAL_APP_STATIC_RES_ITEM}_SUCCESS` === actionType) { //处理完成
					if (rspInfo.resultCode === Constant.REST_OK) {
						let msg = '应用静态资源明细';
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
							businessRoute.AppStaticResAdmin);
					} else {
						if (this.state.operType == Constant.OPER_TYPE_ADD) {
							MsgUtil.showerror(
								`新增应用静态资源明细错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						} else {
							MsgUtil.showerror(
								`修改应用静态资源明细错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						}
					}
				} else if (`${QRY_RES_ITEM_BY_ID}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询应用静态资源明细失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
						return;
					}
				}
			}
		}
		const { getFieldValue } = nextProps.form;
		if (getFieldValue('uploadMode') === 'url') {
			this.setState({
				ViewUploadFileSrc: getFieldValue('resourceStorePath'),
			});
		}
	}

	getUploader = (uploadProps) => {
		const { currentAppStaticResItem } = this.props;
		const { getFieldValue, getFieldDecorator } = this.props.form;
		if (getFieldValue('uploadMode') === 'url') {
			const ResourceStorePathProps = getFieldDecorator(
				'resourceStorePath', {
					initialValue: currentAppStaticResItem.resourceUrl,
					rules: [
						{ required: true, message: '请输入资源网络地址' },
					],
				});
			return (
				<span>
					{ResourceStorePathProps(
						<Input size="large" style={{ width: '100%' }} />,
					)}
				</span>
			);
		} else {
			return (
				<Upload {...uploadProps}>
					<Button type="ghost" size="large" >
						<Icon type="upload" /> 点击上传
					</Button>
				</Upload>
			);
		}
	};

	getUploadPlugin = () => {
		const { getFieldValue, getFieldDecorator } = this.props.form;
		const { currentAppStaticResItem } = this.props;

		const uploadFileProps = initOssFileUploadProps(
			{ onChange: this.handleFileChange },
		);

		const resourceType = getFieldValue('resourceType');
		const { fileList } = this.state;
		let { ViewUploadFileSrc } = this.state;
		if (Constant.RESOURCE_TYPE_IMAGE === resourceType ||
			Constant.RESOURCE_TYPE_TYPEFACE === resourceType) {
			const formItemLayout = {
				labelCol: { span: 5 },
				wrapperCol: { span: 19 },
			};

			if (!ViewUploadFileSrc) {
				ViewUploadFileSrc = currentAppStaticResItem.resourceUrl;
			}

			const lable = Constant.RESOURCE_TYPE_IMAGE === resourceType
				? '图片'
				: '字体';
			const picTakerNode = (Constant.RESOURCE_TYPE_IMAGE ===
				resourceType) &&
				<a href={ViewUploadFileSrc} onClick={this.handlePicClick} target="_blank" rel="noopener noreferrer" >
					<img src={ViewUploadFileSrc} className="viewImg" width="35" height="35" alt="" />
					<Badge dot ><span>点击放大</span></Badge>
				</a>;
			return (
				<FormItem {...formItemLayout} label={lable} required >
					{this.getUploader(uploadFileProps)}
					{picTakerNode}
				</FormItem>
			);
		} else if (Constant.RESOURCE_TYPE_MEDIA === resourceType) {
			const ResourceSubtypeProps = getFieldDecorator('resourceSubtype', {
				initialValue: currentAppStaticResItem.resourceSubtype
					? currentAppStaticResItem.resourceSubtype
					: '',
				rules: [
					{ required: true, message: '请输入媒体类型' },
				],
			});
			const ResourceLengthProps = getFieldDecorator('resourceLength', {
				initialValue: currentAppStaticResItem.resourceLength
					? currentAppStaticResItem.resourceLength
					: '0',
				rules: [
					{ required: true, message: '请输入媒体时长' },
				],
			});

			const uploadFormItemLayout = {
				labelCol: { span: 10 },
				wrapperCol: { span: 14 },
			};

			const subtypeFormItemLayout = {
				labelCol: { span: 10 },
				wrapperCol: { span: 14 },
			};
			const lengthFormItemLayout = {
				labelCol: { span: 5 },
				wrapperCol: { span: 19 },
			};
			return (
				<FormItem>
					<Col span={12} >
						<FormItem {...uploadFormItemLayout} label="媒体" required >
							{this.getUploader(uploadFileProps)}
						</FormItem>
					</Col>
					<Col span={4} >
						<FormItem {...subtypeFormItemLayout} label="媒体类型" required >
							{ResourceSubtypeProps(
								<Input type="text" size="large" style={{ width: 100 }} />,
							)}
						</FormItem>
					</Col>
					<Col span={8} style={{ marginLeft: '-1.5rem' }} >
						<FormItem {...lengthFormItemLayout} label="媒体时长" required >
							{ResourceLengthProps(
								<Input type="text" size="large" style={{ width: 243 }} />,
							)}
						</FormItem>
					</Col>
				</FormItem>

			);
		}
	};
	//Form reset
	handleReset = (e) => {
		e.preventDefault();
		this.props.form.resetFields();
	};

	handleSubmit = (e) => {
		e.preventDefault();
		const { actions, currentAppStaticResItem } = this.props;
		const { operType, uploadStatus, UploadPath } = this.state;

		this.props.form.validateFields((errors, editForm) => {
			console.log('AppStaticResItemEdit commit formEdit', editForm);
			if (!!errors) {
				console.log('表单验证失败!!!');
				return;
			}
			if (uploadStatus && uploadStatus !== 'completed') {
				MsgUtil.showwarning('文件上传未完成，请等待文件上传成功后再提交变更!');
				return;
			}
			let afterMergeForm = Immutable.Map(currentAppStaticResItem).
				merge(editForm);
			if (uploadStatus && !afterMergeForm.get('resourceStorePath')) {
				afterMergeForm = afterMergeForm.set('resourceStorePath',
					UploadPath);
			}
			actions.dealAppStaticResItem(operType, afterMergeForm.toObject());
		});
	};

	handleFileChange = (info) => {
		let fileList = info.fileList;
		const { FileUploadPath, SrcPath } = handleUploadFile(fileList);
		if (FileUploadPath && fileList.length > 1) {
			fileList = [fileList[fileList.length - 1]];
			const { setFieldsValue } = this.props.form;
			setFieldsValue({ resourceStorePath: FileUploadPath });
		}
		this.setState({
			UploadPath: FileUploadPath,
			uploadStatus: FileUploadPath ? 'completed' : 'uploading',
			ViewUploadFileSrc: SrcPath,
			fileList,
		});
	};

	handlePicClick = () => {
		const { currentAppStaticResItem } = this.props;
		if (this.state.ViewUploadFileSrc == '') {
			if (currentAppStaticResItem === undefined) {
				MsgUtil.showwarning('暂无图片');
			}
		}
	};

	render () {
		const { getFieldDecorator } = this.props.form;
		const { currentAppStaticResItem } = this.props;
		console.log('ViewUploadFileSrc', this.state.ViewUploadFileSrc);
		//ant-design中的名称和内容各占多少列
		const formItemLayout = {
			labelCol: { span: 10 },
			wrapperCol: { span: 14 },
		};
		const allRowFormItemLayout = {
			labelCol: { span: 5 },
			wrapperCol: { span: 19 },
		};

		const ResourceTypeProps = getFieldDecorator('resourceType', {
			initialValue: currentAppStaticResItem.resourceType
				? String(currentAppStaticResItem.resourceType)
				: String(Constant.RESOURCE_TYPE_IMAGE),
			rules: [
				{ required: true, message: '请选择资源类型' },
			],
		});

		const TitleProps = getFieldDecorator('title', {
			initialValue: currentAppStaticResItem.title,
			rules: [
				{ required: true, min: 1, message: '请输入应用静态资源明细标题' },
			],
		});
		const StateProps = getFieldDecorator('state', {
			initialValue: currentAppStaticResItem.state
				? currentAppStaticResItem.state
				: Constant.STATE_U,
		});

		const HeightProps = getFieldDecorator('height', {
			initialValue: currentAppStaticResItem.height,
			rules: [
				{
					whitespace: false,
					pattern: /^[0-9]{0,3}$/,
					message: '格式不合法: 只支持数字, 长度(1-3)位',
				},
			],
		});
		const WidthProps = getFieldDecorator('width', {
			initialValue: currentAppStaticResItem.width,
			rules: [
				{
					whitespace: false,
					pattern: /^[0-9]{0,3}$/,
					message: '格式不合法: 只支持数字, 长度(1-3)位',
				},
			],
		});
		const ContentProps = getFieldDecorator('content', {
			initialValue: currentAppStaticResItem.content,
		});
		const SortProps = getFieldDecorator('sort', {
			initialValue: currentAppStaticResItem.sort,
			rules: [
				{
					whitespace: false,
					pattern: /^[0-9]{0,3}$/,
					message: '格式不合法: 只支持数字, 长度(1-3)位',
				},
			],
		});
		const BeginTimeProps = getFieldDecorator('beginTime', {
			initialValue: currentAppStaticResItem.beginTime,
			rules: [
				{ required: true, message: '请输入开始时间' },
			],
			
		});
		const EndTimeProps = getFieldDecorator('endTime', {
			initialValue: currentAppStaticResItem.endTime,
			rules: [
				{ required: true, message: '请输入结束时间' },
			],
		});

		const UrlProps = getFieldDecorator('url', {
			initialValue: currentAppStaticResItem.url,
		});
		const RemarkProps = getFieldDecorator('remark', {
			initialValue: currentAppStaticResItem.remark,
		});

		const UploadModeProps = getFieldDecorator('uploadMode', {
			initialValue: 'localUpload',
			rules: [
				{ required: true },
			],
		});

		return (
			<Form>
				<Row>
					<Col span={24} >
						<Button>
							<Link to={businessRoute.AppStaticResAdmin} >
								<Icon type="backward" />
								<span>&nbsp;&nbsp;应用静态资源管理</span>
							</Link>
						</Button>
					</Col>
				</Row><br /><br /><br />
				<Row>
					<Col span={18} >
						<FormItem >
							<Col span={12} >
								<FormItem {...formItemLayout} label="资源类型" >
									{ResourceTypeProps(
										<Select style={{ width: 243 }} >
											<Select.Option value={Constant.RESOURCE_TYPE_IMAGE} >
												[{Constant.RESOURCE_TYPE_IMAGE}]
												图片</Select.Option>
											<Select.Option value={Constant.RESOURCE_TYPE_MEDIA} >
												[{Constant.RESOURCE_TYPE_MEDIA}]
												媒体
											</Select.Option>
											<Select.Option value={Constant.RESOURCE_TYPE_TYPEFACE} >
												[{Constant.RESOURCE_TYPE_TYPEFACE}]
												字体
											</Select.Option>
										</Select>,
									)}
								</FormItem>
							</Col>
							<Col span={12} >
								<FormItem {...formItemLayout} label="上传方式" >
									{UploadModeProps(
										<Select size="large" style={{ width: 243 }} >
											<Select.Option key="localUpload" value="localUpload" >本地上传</Select.Option>
											<Select.Option key="url" value="url" >网络地址</Select.Option>
										</Select>,
									)}
								</FormItem>
							</Col>
						</FormItem>
						{this.getUploadPlugin()}
						<FormItem {...allRowFormItemLayout} label="资源标题" >
							{TitleProps(
								<Input type="text" size="large" style={{ width: '85.5%' }} />,
							)}
						</FormItem>
						<FormItem {...allRowFormItemLayout} label="触发url" >
							{UrlProps(
								<Input type="text" size="large" style={{ width: '85.5%' }} />,
							)}
						</FormItem>
						<FormItem {...allRowFormItemLayout} label="资源内容" >
							{ContentProps(
								<Input type="textarea" rows={6} style={{ width: '85.5%' }} />,
							)}
						</FormItem>
						<FormItem>
							<Col span={12} >
								<FormItem {...formItemLayout} label="序号" >
									{SortProps(
										<Input type="text" size="large" placeholder="1代表主图 2代表logo" style={{ width: 243 }} />,
									)}
								</FormItem>
							</Col>
							<Col span={12} >
								<FormItem {...formItemLayout} label="状态" >
									{StateProps(
										<MySelect
											filterOption={false}
											style={{ width: 150 }}
											valueKey="key"
											descKey="desc"
											selectOptionDataList={SelectData.stateDataList}
										/>,
									)}
								</FormItem>
							</Col>
						</FormItem>
						<FormItem>
							<Col span={12} >
								<FormItem {...formItemLayout} label="高度" >
									{HeightProps(
										<Input type="text" size="large" style={{ width: 243 }} />,
									)}
								</FormItem>
							</Col>
							<Col span={12} >
								<FormItem {...formItemLayout} label="宽度" >
									{WidthProps(
										<Input type="text" size="large" style={{ width: 243 }} />,
									)}
								</FormItem>
							</Col>
						</FormItem>
						<FormItem>
							<Col span={12} >
								<FormItem {...formItemLayout} label="开始时间" >
									{BeginTimeProps(
										<DatePicker size="large" dateFormat="yy-mm-dd" style={{ width: 243 }} />,
									)}
								</FormItem>
							</Col>

							<Col span={12} >
								<FormItem {...formItemLayout} label="结束时间" >
									{EndTimeProps(
										<DatePicker size="large" dateFormat="yy-mm-dd" style={{ width: 243 }} />,
									)}
								</FormItem>
							</Col>
						</FormItem>
						<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="备注" >
							{RemarkProps(
								<Input type="textarea" rows={6} style={{ width: '85.5%' }} />,
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
	const { currentAppStaticResItem } = state.get('AppStaticResService').
		toObject();

	return { currentAppStaticResItem, rspInfo, actionType };
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryAppStaticResItemById,
			initAResItemForAdd,
			dealAppStaticResItem,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AppStaticResItemEdit));
