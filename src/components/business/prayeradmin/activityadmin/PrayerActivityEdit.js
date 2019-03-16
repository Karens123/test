import * as Immutable from 'immutable';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
	Card,
	Button,
	Col,
	Form,
	Icon,
	Input,
	Row,
	Select,
	DatePicker,
	InputNumber,
} from 'antd';
import * as Constant from 'utils/Constant';
import * as MsgUtil from 'utils/MsgUtil';
import * as businessRoute from 'business/route';
import {
	DEAL_ACTIVITY,
	dealPrayerActivity,
	initAActivityForAdd,
	QRY_PRAYER_ACTIVITY_BY_ID,
	qryActivityById,
	SEND_ACTIVITY_REWARD,
	sendRewardForActivity,
} from 'src/components/business/prayeradmin/activityadmin/action';
import moment from 'moment/moment';

const FormItem = Form.Item;
const {RangePicker} = DatePicker;

class PrayerActivityEdit extends React.Component {
	//检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired,
	};
	static propTypes = {
		rspInfo: PropTypes.object,
		currentActivity: PropTypes.object.isRequired,
		actionType: PropTypes.string,
		actions: PropTypes.object.isRequired,
		form: PropTypes.object.isRequired,
		params: PropTypes.object.isRequired,
		route: PropTypes.object.isRequired,
	};

	static defaultProps = {
		rspInfo: undefined,
		currentActivity: {},
		actionType: '',
	};

	constructor(props) {
		super(props);
		const {route} = props;
		if (!route) {
			this.context.router.replace(businessRoute.prayerActivityAdmin);
		}
		const operType = route.path === businessRoute.prayerActivityEditById
			? Constant.OPER_TYPE_EDIT
			: Constant.OPER_TYPE_ADD;
		this.state = {operType};
	}

	componentWillMount() {
		const {operType} = this.state;
		const {actions, params} = this.props;
		if (operType == Constant.OPER_TYPE_EDIT) {
			const activityId = params.activityId;
			actions.qryActivityById(activityId);
		} else {
			actions.initAActivityForAdd();
		}

	}

	componentWillReceiveProps(nextProps) {
		const {rspInfo, actionType} = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (`${DEAL_ACTIVITY}_SUCCESS` === actionType) { //处理完成
					if (rspInfo.resultCode === Constant.REST_OK) {
						let msg = '活动主体成功';

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
								`新增活动主体.错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						} else {
							MsgUtil.showerror(
								`修改活动主体.错误原因: [${rspInfo.resultCode}: ${rspInfo.resultDesc}]`);
						}
					}
				} else if (`${QRY_PRAYER_ACTIVITY_BY_ID}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`查询活动主体信息失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${SEND_ACTIVITY_REWARD}_SUCCESS` === actionType) {
					// 发放大奉诵奖励的回调
					if (rspInfo.resultCode === Constant.REST_OK) {
						MsgUtil.showinfo('发放成功');
					} else {
						MsgUtil.showwarning(`发放失败 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
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
		const {actions, currentActivity} = this.props;
		const {operType} = this.state;

		this.props.form.validateFields((errors, editForm) => {
			console.log('PrayerActivityEdit commit formEdit', editForm);
			if (!!errors) {
				console.log('表单验证失败!!!');
				return;
			}
			const {betweenTime} = editForm;
			const startTime = moment(betweenTime[0]).toDate().getTime();
			const endTime = moment(betweenTime[1]).toDate().getTime();
			if (endTime !== currentActivity.endTime && endTime <= Date.now()) {
				alert('活动结束时间不允许早于当前时间');
				return;
			}
			if (editForm.doneNum >= currentActivity.targetNum ||
				currentActivity.endTime <= Date.now()) {
				alert('活动已完成, 请不要修改活动资料');
				return;
			}
			const afterMergeForm = Immutable.Map(currentActivity).
				merge(editForm).merge({startTime, endTime}).
				toObject();
			actions.dealPrayerActivity(operType, afterMergeForm);
		});
	};

	/***
	 * 发放奖励
	 * */
	sendReward = () => {
		const {actions, currentActivity} = this.props;
		const {ifSendReward} = currentActivity;

		if (ifSendReward !== undefined && ifSendReward === 0) {
			// 发放奖励
			actions.sendRewardForActivity(currentActivity.activityId);
		} else {
			MsgUtil.showerror('奖励已发放');
		}
	};

	render() {
		const {getFieldDecorator, getFieldValue} = this.props.form;
		const {currentActivity} = this.props;
		//ant-design中的名称和内容各占多少列
		const formItemLayout = {
			labelCol: {span: 10},
			wrapperCol: {span: 14},
		};

		//活动id
		const ActivityIdProps = getFieldDecorator('activityId', {
			initialValue: currentActivity.activityId,
			rules: [
				{
					required: this.state.operType === Constant.OPER_TYPE_EDIT,
					message: '缺少活动id',
				},
			],
		});
		//活动来源
		const ActivitySourceProps = getFieldDecorator('activitySource', {
			initialValue: currentActivity.activitySource,
			rules: [
				{required: true, message: '缺少活动来源',},
			],
		});
		//备注
		const RemarkProps = getFieldDecorator('remark', {
			initialValue: currentActivity.remark,
			rules: [
				{required: true, message: '活动业务备注'},
			],
		});
		//活动奖励数数
		const ActivityRewardProps = getFieldDecorator('activityReward', {
			initialValue: currentActivity.activityReward || 0,
			rules: [
				{required: true, message: '请输入活动奖励菩提子数'},
			],
		});
		const RewardRatioProps = getFieldDecorator('rewardRatio', {
			initialValue: currentActivity.rewardRatio || '',
			rules: [
				{required: this.state.operType === Constant.OPER_TYPE_EDIT, message: '系统会在新建活动时使用默认模板'},
			],
		});
		const IfSendRewardProps = getFieldDecorator('ifSendReward', {
			initialValue: currentActivity.ifSendReward || 0,
			rules: [
				{required: true},
			],
		});
		//活动目标数
		const TargetNumProps = getFieldDecorator('targetNum', {
			initialValue: currentActivity.targetNum || 1,
			rules: [
				{required: true, message: '请输入活动目标数'},
			],
		});
		//活动参与人数
		const PeopleCountProps = getFieldDecorator('peopleCount', {
			initialValue: currentActivity.peopleCount || 0,
		});
		//活动已完成数
		const DoneNumProps = getFieldDecorator('doneNum', {
			initialValue: currentActivity.doneNum || 0,
		});
		const betweenInitArr = [];
		if (currentActivity.startTime) {
			betweenInitArr.push(moment(currentActivity.startTime));
		}
		if (currentActivity.endTime) {
			betweenInitArr.push(moment(currentActivity.endTime));
		}
		//活动开始时间
		const BetweenProps = getFieldDecorator('betweenTime', {
			initialValue: betweenInitArr,
			rules: [
				{type: 'array', required: true, message: '请选择活动时间'},
			],
		});

		//状态
		const StateProps = getFieldDecorator('state', {
			initialValue: currentActivity.state,
			rules: [
				{required: true, message: '请选择状态'},
			],
		});
		//活动进度
		const ActivityProgressProps = getFieldDecorator('activityProgress', {
			initialValue: currentActivity.activityProgress,
		});

		const renderRanking = () => {
			const rankingList = currentActivity.rankingList;
			const renderRanking = [];
			renderRanking.push(
				<Row>
					<Col span={4}>头像</Col>
					<Col span={4}>wenwenId</Col>
					<Col span={4}>法号</Col>
					<Col span={4}>完成数</Col>
					<Col span={4}>奖励菩提子数(单位个)</Col>
				</Row>,
			);
			for (const key in rankingList) {
				const rank = rankingList[key];
				renderRanking.push(
					<Row>
						<Col span={4}><img src={rank.headImage} width={40} height={40}/></Col>
						<Col span={4}>{rank.wenwenId}</Col>
						<Col span={4}>{rank.fohao}</Col>
						<Col span={4}>{rank.doneNum}</Col>
						<Col span={4}>{rank.award}</Col>
					</Row>,
				);
			}
			return renderRanking;
		};

		const {ifSendReward, activityProgress} = currentActivity;
		const rankingExtra = () => {
			if (activityProgress === 2) {//活动已结束
				if (ifSendReward !== undefined) {
					if (ifSendReward === 0) {
						return <Button type="primary"
									   onClick={this.sendReward}>发放奖励</Button>;
					} else {
						return <Button type="primary" disable>奖励已发放</Button>;
					}
				}
			}
			return null;
		};
		const calReward = (reward) => {
			const base = 1000000;
			const baseLen = String(base).length;
			let num = Math.floor(reward/base);
			let point = String(reward%base);
			const pointLen = point.length;
			const needLen = baseLen-point;
			for(let i = 0; i < needLen; i++) {
				point = `0${point}`;
			}
			num = String(num);
			return `${num}.${point}`;
		};
		return (
			<Form>
				<Row>
					<Col span={24}>
						<Link to={businessRoute.prayerActivityAdmin}
							  className="ant-btn" style={{lineHeight: '25px'}}>
							<Icon type="backward"/><span>&nbsp;&nbsp;
							活动主体管理</span>
						</Link>
					</Col>
				</Row><br/><br/><br/>
				<Row>
					<Col span={18}>
						<Col span={12} style={{height: 54}}>
							<FormItem {...formItemLayout} label="活动id">
								{ActivityIdProps(
									<Input disabled/>,
								)}
							</FormItem>
						</Col>

						<Col span={9} style={{height: 54}}>
							<FormItem {...formItemLayout} label="活动来源">
								{ActivitySourceProps(
									<Select disabled={this.state.operType ===
									Constant.OPER_TYPE_EDIT}>
										<Select.Option
											value={1}>后台</Select.Option>
										<Select.Option
											value={0}>用户</Select.Option>
									</Select>,
								)}
							</FormItem>
						</Col>
						<Col span={12} style={{height: 54}}>
							<FormItem {...formItemLayout} label="业务说明">
								{RemarkProps(
									<Input/>,
								)}
							</FormItem>
						</Col>

						<Col span={9} style={{height: 54}}>
							<FormItem {...formItemLayout} label="活动目标数">
								{TargetNumProps(
									<InputNumber/>,
								)}
							</FormItem>
						</Col>
						<Col span={12} style={{height: 54}}>
							<FormItem {...formItemLayout} label="活动时间">
								{BetweenProps(
									<RangePicker showTime
												 format={'YYYY-MM-DD HH:mm:ss'}/>,
								)}
							</FormItem>
						</Col>
						<Col span={9}>
							<FormItem {...formItemLayout} label="状态">
								{StateProps(
									<Select>
										<Select.Option
											value={0}>草稿</Select.Option>
										<Select.Option
											value={1}>待审核</Select.Option>
										<Select.Option
											value={2}>已审核</Select.Option>
									</Select>,
								)}
							</FormItem>
						</Col>

					</Col>
				</Row>
				<Row>
					<Col span={18}>
						<Col span={12} style={{height: 54}}>
							<FormItem {...formItemLayout} label="活动奖励数">
								{ActivityRewardProps(
									<InputNumber />,
								)}*0.000001 = {calReward(getFieldValue('activityReward'))}个
							</FormItem>
						</Col>
						<Col span={9} style={{height: 54}}>
							<FormItem {...formItemLayout} label="活动奖励比例">
								{RewardRatioProps(
									<Input placeholder="系统会在新建活动时使用默认模板" disabled/>,
								)}
							</FormItem>
						</Col>
						<Col span={12} style={{height: 54}}>
							<FormItem {...formItemLayout} label="奖励发放情况">
								{
									IfSendRewardProps(
										<Select disabled>
											<Select.Option
												value={0}>未发放</Select.Option>
											<Select.Option
												value={1}>已发放</Select.Option>
										</Select>,
									)
								}
							</FormItem>
						</Col>
					</Col>
				</Row>
				<Row>
					<Col span={18}>
						<Col span={12} style={{height: 54}}>
							<FormItem {...formItemLayout} label="活动参与人数">
								{PeopleCountProps(
									<Input disabled/>,
								)}
							</FormItem>
						</Col>
						<Col span={9} style={{height: 54}}>
							<FormItem {...formItemLayout} label="活动参与人数">
								{PeopleCountProps(
									<Input disabled/>,
								)}
							</FormItem>
						</Col>
						<Col span={12} style={{height: 54}}>
							<FormItem {...formItemLayout} label="活动进度">
								{
									ActivityProgressProps(
										<Select disabled>
											<Select.Option
												value={-1}>未审核</Select.Option>
											<Select.Option
												value={0}>准备中</Select.Option>
											<Select.Option
												value={1}>进行中</Select.Option>
											<Select.Option
												value={2}>已结束</Select.Option>
										</Select>,
									)
								}
							</FormItem>
						</Col>
					</Col>
				</Row>
				<Row>
					&nbsp;
				</Row>
				<Row>
					<Col span={19} style={{textAlign: 'center'}}>
						<Button type="primary" onClick={this.handleSubmit}>
							提交
						</Button>&nbsp;&nbsp;
						<Button type="primary" onClick={this.handleReset}>
							重置
						</Button>&nbsp;&nbsp;
					</Col>
				</Row>
				<Row>
					&nbsp;
				</Row>
				{
					activityProgress !== undefined && activityProgress > 0 &&
					<Row>
						<Col span={18}>
							<Card title="活动排行榜" bordered={false}
								  style={{width: '80%', marginLeft: 130}}
								  extra={rankingExtra()}>
								{renderRanking()}
							</Card>
						</Col>
					</Row>
				}

			</Form>
		);
	}
}

const mapStateToProps = (state) => {
	const {rspInfo, actionType} = state.get('RootService').toObject();
	const {currentActivity} = state.get('ActivityService').toObject();
	return {rspInfo, currentActivity, actionType};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryActivityById,
			initAActivityForAdd,
			dealPrayerActivity,
			sendRewardForActivity,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	Form.create()(PrayerActivityEdit));
