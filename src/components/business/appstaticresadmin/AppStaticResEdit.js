import * as Immutable from 'immutable';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Form, Icon, Input, Row, Select } from 'antd';

import * as Constant from 'utils/Constant';
import * as MsgUtil from 'utils/MsgUtil';
import * as businessRoute from 'business/route';
import MySelect from 'framework/components/Select';
import {
	DEAL_APP_STATIC_RES,
	dealAppStaticRes,
	initAAppStaticResForAdd,
	QRY_APP_STATIC_RES_BY_ID,
	qryAppStaticResById,
} from 'action';
import SelectData from './SelectData.json';

const FormItem = Form.Item;
class AppStaticResEdit extends React.Component {
    //检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static propTypes = {
		rspInfo: PropTypes.object,
		currentAppStaticRes: PropTypes.object.isRequired,
		actionType: PropTypes.string,
		actions: PropTypes.object.isRequired,
		form: PropTypes.object.isRequired,
		params: PropTypes.object.isRequired,
		route: PropTypes.object.isRequired,
	};

	static defaultProps = {
		rspInfo: undefined,
		currentAppStaticRes: {},
		actionType: '',
	};

	constructor (props) {
		super(props);
		const { route } = props;
		if (!route) {
			this.context.router.replace(businessRoute.AppStaticResAdmin);
		}
		const operType = route.path === businessRoute.AppStaticResEditById
			? Constant.OPER_TYPE_EDIT
			: Constant.OPER_TYPE_ADD;
		this.state = { operType };
	}

	componentWillMount () {
		const { operType } = this.state;
		const { actions, params } = this.props;
		if (operType == Constant.OPER_TYPE_EDIT) {
			const id = params.id;
			actions.qryAppStaticResById(id);
		} else {
			actions.initAAppStaticResForAdd();
		}

	}

	componentWillReceiveProps (nextProps) {
		const { rspInfo, actionType } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (`${DEAL_APP_STATIC_RES}_SUCCESS` === actionType) { //处理完成
					if (rspInfo.resultCode === Constant.REST_OK) {
						let msg = '应用静态资源成功';
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
								`新增应用静态资源.错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						} else {
							MsgUtil.showerror(
								`修改应用静态资源.错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						}
					}
				} else if (`${QRY_APP_STATIC_RES_BY_ID}_SUCCESS` ===
					actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询应用静态资源信息失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
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
		const { actions, currentAppStaticRes } = this.props;
		const { operType } = this.state;

		this.props.form.validateFields((errors, editForm) => {
			console.log('AppStaticResEdit commit formEdit', editForm);
			if (!!errors) {
				console.log('表单验证失败!!!');
				return;
			}
			const afterMergeForm = Immutable.Map(currentAppStaticRes).
				merge(editForm).
				toObject();
			actions.dealAppStaticRes(operType, afterMergeForm);
		});
	};

	render () {
		const { getFieldDecorator } = this.props.form;
		const { currentAppStaticRes } = this.props;
		//ant-design中的名称和内容各占多少列
		const formItemLayout = {
			labelCol: { span: 10 },
			wrapperCol: { span: 14 },
		};

		//应用静态资源id
		getFieldDecorator('id', {
			initialValue: currentAppStaticRes.id,
			rules: [
				{
					required: this.state === Constant.OPER_TYPE_EDIT,
					message: '缺少应用静态资源id',
				},
			],
		});
		//语言
		const LanguageProps = getFieldDecorator('language', {
			initialValue: currentAppStaticRes.language
				? String(currentAppStaticRes.language)
				: 'zh',
			rules: [
				{ required: true, message: '请选择语言' },
			],
		});
		//分辨率
		const ResolutionProps = getFieldDecorator('resolution', {
			initialValue: currentAppStaticRes.resolution
				? currentAppStaticRes.resolution
				: 'default',
			rules: [
				{ required: true, message: '请选择分辨率' },
			],
		});
		//模块
		const ModuleKeyProps = getFieldDecorator('moduleKey', {
			initialValue: currentAppStaticRes.moduleKey,
			rules: [
				{ required: true, message: '请选择模块' },
			],
		});

		//状态
		const StateProps = getFieldDecorator('state', {
			initialValue: currentAppStaticRes.state
				? currentAppStaticRes.state
				: Constant.STATE_U,
			rules: [
				{ required: true, message: '请选择状态' },
			],
		});

		//描述
		const ResourceDescribeProps = getFieldDecorator('resourceDescribe', {
			initialValue: currentAppStaticRes.resourceDescribe,
			rules: [
				{ required: true, whitespace: true, message: '请输入描述' },
			],
		});

		//发现高度
		const RemarkProps = getFieldDecorator('remark', {
			initialValue: currentAppStaticRes.remark,
			rules: [
				{ whitespace: true, max: 255, message: '最多支持255个字符' },
			],
		});

		return (
			<Form>
				<Row>
					<Col span={24} >
						<Link to={businessRoute.AppStaticResAdmin} className="ant-btn" style={{ lineHeight: '25px' }} >
							<Icon type="backward" /><span>&nbsp;&nbsp;
							应用静态资源管理</span>
						</Link>
					</Col>
				</Row><br /><br /><br />
				<Row>
					<Col span={18} >

						<Col span={12} style={{ height: 54 }} >
							<FormItem {...formItemLayout} label="语言" >
								{LanguageProps(
									<Select
										style={{ width: 200 }}
									>
										<Select.Option value="zh" >zh-中文</Select.Option>
										<Select.Option value="en" >en-英文</Select.Option>
									</Select>,
								)}
							</FormItem>
						</Col>

						<Col span={9} style={{ height: 54 }} >
							<FormItem {...formItemLayout} label="分辨率" >
								{ResolutionProps(
									<MySelect
										filterOption={false}
										style={{ width: 185 }}
										valueKey="key"
										descKey="desc"
										selectOptionDataList={SelectData.resolutionDataList}
									/>,
								)}
							</FormItem>
						</Col>
						<Col span={12} style={{ height: 54 }} >
							<FormItem {...formItemLayout} label="模块" >
								{ModuleKeyProps(
									<MySelect
										filterOption={false}
										style={{ width: 200 }}
										valueKey="key"
										descKey="desc"
										selectOptionDataList={SelectData.moduleKeyDataList}
									/>,
								)}
							</FormItem>
						</Col>
						<Col span={9} >
							<FormItem {...formItemLayout} label="状态" >
								{StateProps(
									<MySelect
										filterOption={false}
										style={{ width: 186 }}
										valueKey="key"
										descKey="desc"
										selectOptionDataList={SelectData.stateDataList}
									/>,
								)}
							</FormItem>
						</Col>
						<Col span={24} >
							<FormItem
								{...formItemLayout} label="资源描述"
								labelCol={{ span: 5 }}
								wrapperCol={{ span: 19 }}
							>
								{ResourceDescribeProps(
									<Input
										type="textarea" rows={6}
										style={{ width: '85.5%' }}
									/>,
								)}
							</FormItem>
						</Col>
						<Col span={24} >
							<FormItem
								{...formItemLayout}
								label="备注"
								labelCol={{ span: 5 }}
								wrapperCol={{ span: 19 }}
							>
								{RemarkProps(
									<Input
										type="textarea" rows={6}
										style={{ width: '85.5%' }}
									/>,
								)}
							</FormItem>
						</Col>
					</Col>
				</Row>
				<Row>
					&nbsp;
				</Row>
				<Row>
					<Col span={19} style={{ textAlign: 'center' }} >
						<Button type="primary" onClick={this.handleSubmit} >
							提交
						</Button>&nbsp;&nbsp;
						<Button type="primary" onClick={this.handleReset} >
							重置
						</Button>&nbsp;&nbsp;
					</Col>
				</Row>
				<Row>
					&nbsp;
				</Row>
			</Form>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { currentAppStaticRes } = state.get('AppStaticResService').toObject();
	return { rspInfo, currentAppStaticRes, actionType };
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryAppStaticResById,
			initAAppStaticResForAdd,
			dealAppStaticRes,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AppStaticResEdit));
