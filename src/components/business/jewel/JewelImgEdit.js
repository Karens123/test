import * as Immutable from 'immutable';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Badge, Button, Col, Form, Icon, Input, Row, Upload } from 'antd';
import $ from 'jquery';
import { handleUploadImage, PubImageUploadProps } from 'utils/UploadUtil';
import * as Constant from 'utils/Constant';
import * as MsgUtil from 'utils/MsgUtil';
import * as actions from 'action';
import * as businessRoute from 'business/route';

const FormItem = Form.Item;

class JewelImgEdit extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static propTypes = {
		SeletCurrentPic: PropTypes.object.isRequired,
		currentJewel: PropTypes.object.isRequired,
		actionType: PropTypes.string.isRequired,
		rspInfo: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		form: PropTypes.object.isRequired,
		route: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		params: PropTypes.object.isRequired,
	};

	constructor (props) {
		super(props);
		const { SeletCurrentPic, route } = this.props;
		const pathName = /add/.test(this.props.route.path);
		const operType = pathName && pathName === true
			? Constant.OPER_TYPE_ADD
			: Constant.OPER_TYPE_EDIT;

		if (!route) {
			this.context.route.replace(businessRoute.JewelAdmin);
		}

		this.state = {
			SeletCurrentPic: '',
			UploadPath: '',
			hasChangeUpload: 'false',
			operType,
			ViewUploadImgSrc: '',
			fileList: [
				{
					uid: -1,
					name: SeletCurrentPic ? SeletCurrentPic.jewelImage : '文件名',
					status: 'done',
					url: '',
				}],
		};

		if (operType === Constant.OPER_TYPE_ADD) {
			this.state.fileList[0].name = '';
		}
	}

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType } = nextProps;
		const { operType } = this.state;
		const { params } = this.props;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (`${actions.EDIT_JEWEL_PHTO_INFOR}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`修改失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					} else {
						if (operType == Constant.OPER_TYPE_ADD) {
							MsgUtil.showwarning('新增图片成功');
						} else if (operType == Constant.OPER_TYPE_EDIT) {
							MsgUtil.showwarning('修改图片成功');
						}
						this.context.router.replace(`${businessRoute.JewelAdmin}${params.prepage?`/${params.prepage}`:''}`);
					}
				}
			}
		}
	}

	componentDidUpdate () {
	}

	//Form reset
	handleReset = (e) => {
		e.preventDefault();
		this.props.form.resetFields();
	};

	handleSubmit = (e) => {};

	handleSubmitImg = (e) => {
		e.preventDefault();
		const { actions } = this.props;
		const { operType } = this.state;
		const formEditUser = this.props.form.getFieldsValue();
		const { currentJewel } = this.props;
		let { SeletCurrentPic } = this.props;

		let filePath = $.trim(this.state.UploadPath);
		//新增
		if (SeletCurrentPic == undefined) {
			SeletCurrentPic = {};
			SeletCurrentPic.jewelId = currentJewel.jewelId;
		}

		const hasChangeUpload = this.state.hasChangeUpload;

		//默认
		if (hasChangeUpload == 'false') {
			filePath = SeletCurrentPic.jewelImage;
		} else {
			//输入删掉图
			if (filePath == '') {
				MsgUtil.showwarning('图片不能为空');
				return false;
			}
		}

		const afterJewel = Immutable.Map(SeletCurrentPic).
			merge(formEditUser).
			toObject();
		actions.editJewelImg(operType, afterJewel, filePath);
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

	handPicClick () {
		const { SeletCurrentPic } = this.props;
		if (this.state.ViewUploadImgSrc == '') {
			if (SeletCurrentPic == undefined) {
				MsgUtil.showwarning('暂无图片');
			}
		}
	}

	render () {
		//ant-desigen定义
		const { getFieldDecorator } = this.props.form;
		let { SeletCurrentPic } = this.props;
		const { params } = this.props;
		const pathName = this.props.location.pathname.endsWith('/');

		let ViewUploadImgSrc = this.state.ViewUploadImgSrc;

		//新增对象不存在
		if (SeletCurrentPic == undefined || pathName == true) {
			SeletCurrentPic = {};
		}

		//没上传
		if (ViewUploadImgSrc == '') {
			ViewUploadImgSrc = SeletCurrentPic.jewelImage;
		}

		//ant-desigen中的名称和内容各占多少列
		const formItemLayout = {
			labelCol: { span: 7 },
			wrapperCol: { span: 12 },
		};

		//文件上传
		const uploadProps = PubImageUploadProps().
			set('onChange', this.handleChange).
			set('fileList', this.state.fileList).
			toObject();

		// ant-desigen中教验表单
		const ProdSort = getFieldDecorator('sortId', {
			initialValue: SeletCurrentPic.sortId,
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
		const Prodremak = getFieldDecorator('remark', {
			initialValue: SeletCurrentPic.remark,
			rules: [
				{
					required: false,
					max: 255,
					whitespace: true,
					message: '最多 255 个字符',
				},
			],
		});

		return (
			<div>
				<Row>
					<Col span={16} >
						<Button>
							<Link to={`${businessRoute.JewelAdmin}${params.prepage?`/${params.prepage}`:''}`} >
								<Icon type="backward" />
								<span>&nbsp;&nbsp;珠宝配置</span>
							</Link>
						</Button>
					</Col>
				</Row>
				<br />
				<br />
				<br />
				<Row>
					<Col>
						<Form layout="horizontal" >
							<Col className="jewel_upload" >
								<FormItem {...formItemLayout} label="图片" labelCol={{ span: 2 }} wrapperCol={{ span: 12 }} required >
									&nbsp; &nbsp;
									<Upload {...uploadProps} fileList={this.state.fileList} >
										<Button type="ghost" size="large" >
											<Icon type="upload" />点击上传
										</Button>
									</Upload>
									<p>
										<a href={ViewUploadImgSrc} onClick={this.handPicClick} target="_blank" rel="noopener noreferrer" >
											<Badge>
												<img src={ViewUploadImgSrc} className="viewImg" width="35" height="35" alt="" />
											</Badge> &nbsp;
											<Badge dot ><span>点击放大</span></Badge>
										</a>
									</p>
								</FormItem>
							</Col>

							<FormItem {...formItemLayout} label="排序" labelCol={{ span: 2 }} wrapperCol={{ span: 12 }} >
								{ProdSort(
									<Input type="text" size="large" style={{ width: 380 }} />,
								)}
							</FormItem>
							<FormItem {...formItemLayout} label="备注" labelCol={{ span: 2 }} wrapperCol={{ span: 12 }} style={{ verticalAlign: 'top' }} >
								{Prodremak(
									<Input
										type="textarea" rows={4}
										style={{
											width: 380,
											height: 150,
										}}
									/>,
								)}
							</FormItem>
							<br /><br />
							<FormItem>
								<div
									style={{
										textAlign: 'center',
										display: 'block',
										width: 520,
									}}
								>
									<Button type="primary" onClick={this.handleSubmitImg} >提交</Button>&nbsp;&nbsp;
									<Button type="primary" onClick={this.handleReset} >重置</Button>&nbsp;&nbsp;
								</div>
							</FormItem>
						</Form>
					</Col>
				</Row>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { refreshData, SeletCurrentPic, currentJewel } = state.get(
		'jewelInfor').toObject();
	return {
		rspInfo,
		refreshData,
		SeletCurrentPic,
		currentJewel,
		actionType,
	};
};

const mapDispatchToProps = (dispatch) => {
	const { getAllProdList, editPordImg, editJewelImg } = actions;
	return {
		actions: bindActionCreators(
			{ getAllProdList, editPordImg, editJewelImg }, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	Form.create()(JewelImgEdit));
