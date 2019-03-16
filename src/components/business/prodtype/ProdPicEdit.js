'use strict';

import * as Immutable from 'immutable';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	Badge,
	Button,
	Col,
	Form,
	Icon,
	Input,
	Row,
	SButton,
	Upload,
} from 'antd';
import * as businessRoute from 'business/route';
import * as MsgUtil from 'utils/MsgUtil';
import * as Constant from 'utils/Constant';
import { handleUploadImage, PubImageUploadProps } from 'utils/UploadUtil';

import {
	DEAL_UP_PROD_PIC,
	dealUpProdPic,
	initAUpProdPicForAdd,
	QRY_UP_PROD_PIC_BY_PROD_PIC_ID,
	qryUpProdPicByProdPicId,
} from 'action';

const FormItem = Form.Item;
class ProdPicEdit extends React.Component {

	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		currentProdPic: PropTypes.object,
		actionType: PropTypes.string.isRequired,
		rspInfo: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		form: PropTypes.object.isRequired,
		route: PropTypes.object.isRequired,
		params: PropTypes.object.isRequired,
	};

	static defaultProps = {
		currentProdPic: {},
	};

	constructor (props) {
		super(props);
		const { route } = this.props;
		if (!route) {
			this.context.router.replace(businessRoute.ProdAdmin);
		}
		const operType = route.path === businessRoute.ProdPicEditById
			? Constant.OPER_TYPE_EDIT
			: Constant.OPER_TYPE_ADD;

		this.state = { operType };
	}

	componentWillMount () {
		const { actions, params } = this.props;
		const { operType } = this.state;
		if (operType === Constant.OPER_TYPE_EDIT) {
			actions.qryUpProdPicByProdPicId(params.prodPicId);
		} else {
			actions.initAUpProdPicForAdd(params.prodId);
		}
	}

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType } = nextProps;
		const { params } = this.props;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (`${DEAL_UP_PROD_PIC}_SUCCESS` === actionType) { //处理完成
					if (rspInfo.resultCode === Constant.REST_OK) {
						let msg = '产品图片成功';
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
						this.context.router.replace(`${businessRoute.ProdAdmin}${params.prepage?`/${params.prepage}`:''}`);
					} else {
						if (this.state.operType == Constant.OPER_TYPE_ADD) {
							MsgUtil.showerror(
								`新增产品图片.错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						} else {
							MsgUtil.showerror(
								`修改产品图片.错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						}
					}
				} else if (`${QRY_UP_PROD_PIC_BY_PROD_PIC_ID}_SUCCESS` ===
					actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询产品图片信息失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
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
		const { actions, currentProdPic } = this.props;
		const { operType,UploadPath } = this.state;

		this.props.form.validateFields((errors, editForm) => {
			console.log('ProdPicEdit commit formEdit', editForm);
			if (!!errors) {
				console.log('表单验证失败!!!');
				return;
			}
			const afterMergeForm = Immutable.Map(currentProdPic).
				merge(editForm).
				merge({ prodImage: UploadPath }).
				toObject();
			actions.dealUpProdPic(operType, [afterMergeForm]);
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
		const { currentProdPic } = this.props;
		if (this.state.ViewUploadImgSrc == '') {
			if (currentProdPic === undefined) {
				MsgUtil.showwarning('暂无图片');
			}
		}
	};

	render () {
		const { getFieldDecorator } = this.props.form;
		const { currentProdPic,params } = this.props;

		//没上传
		let ViewUploadImgSrc = this.state.ViewUploadImgSrc;
		if (!ViewUploadImgSrc) {
			ViewUploadImgSrc = currentProdPic.prodImage;
		}
		let { UploadPath } = this.state;
		if (!UploadPath) {
			UploadPath = currentProdPic.prodImage;
		}
		//ant-desigen中的名称和内容各占多少列
		const formItemLayout = {
			labelCol: { span: 2 },
			wrapperCol: { span: 18 },

		};
		//ant-desigen中的上传按纽
		//文件上传
		const uploadProps = PubImageUploadProps().
			set('onChange', this.handleChange).
			set('fileList', this.state.fileList).
			toObject();

		const ProdSortProps = getFieldDecorator('sortId', {
			initialValue: currentProdPic.sortId,
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
		const ProdRemakProps = getFieldDecorator('remark', {
			initialValue: currentProdPic.remark,
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
			<Form >
				<Row >
					<Col >
						<Button>
							<Link to={`${businessRoute.ProdAdmin}${params.prepage?`/${params.prepage}`:''}`} >
								<Icon type="backward" />
								<span>&nbsp;&nbsp;产品配置</span>
							</Link>
						</Button>
					</Col>
				</Row>
				<br /><br /><br /><br />
				<Col offset={0} >
					<Row >
						<Col className="p_uploadBtn" >
							<FormItem {...formItemLayout} label="图片" >
								&nbsp; &nbsp;
								<Upload {...uploadProps} >
									<Button type="ghost" size="large" >
										<Icon type="upload" /> 点击上传
									</Button>
								</Upload>
								<p>
									<a href={ViewUploadImgSrc} onClick={this.handlePicClick} target="_blank" rel="noopener noreferrer"  >
										<Badge>
											<img src={ViewUploadImgSrc} className="viewImg" width="35" height="35" alt="" />
										</Badge>    &nbsp;
										<Badge dot ><span>点击放大</span></Badge>
									</a>
								</p>
							</FormItem>
						</Col>
						<Col>
							<FormItem {...formItemLayout} label="排序" >
								{ProdSortProps(
									<Input type="text" size="large" style={{ width: 380 }} />,
								)}
							</FormItem>
						</Col>
						<Col>
							<FormItem {...formItemLayout} label="备注" >
								{ProdRemakProps(
									<Input type="textarea" rows={8} style={{ width: 380 }} />,
								)}
							</FormItem>
						</Col>
					</Row>
					<Row> &nbsp; </Row>
					<Row> &nbsp; </Row>
					<Row>
						<Col offset={5} >
							<Button type="primary" onClick={this.handleSubmit} >提交</Button>&nbsp;&nbsp;
							<Button type="primary" onClick={this.handleReset} >重置</Button>&nbsp;&nbsp;
						</Col>
					</Row>
				</Col>
			</Form>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { currentProdPic } = state.get('prodInfor').toObject();
	return {
		rspInfo,
		actionType,
		currentProdPic,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators(
			{ qryUpProdPicByProdPicId, initAUpProdPicForAdd, dealUpProdPic },
			dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ProdPicEdit));
