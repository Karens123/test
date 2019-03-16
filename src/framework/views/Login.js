import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import MySelect from 'framework/components/Select';
import { Button, Col, Form, Input, Layout, Row, Select } from 'antd';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import frameworkRoute from 'framework/views/route';
import * as Constant from 'utils/Constant';
import * as CookieUtil from 'utils/CookieUtil';
import * as MsgUtil from 'utils/MsgUtil';
import * as HttpUtil from 'utils/HttpUtil';

import {
	FRAMEWORK_LOGIN,
	genCaptcha,
	GET_GITLAB_AUTHORIZE_CONFIG,
	getGitlabAuthorizeConfig,
	login,
	LOGIN_BY_GITLAB,
	loginByGitlab,
	qryTenantForSelect,
} from 'framework/action';

import messages from './Login-intel';

import './index.less';

const { Content, Footer } = Layout;
const FormItem = Form.Item;

const Option = Select.Option;

class Login extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		currentUser: PropTypes.object,
		rspInfo: PropTypes.object,
		form: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		actionType: PropTypes.object.isRequired,
		captcha: PropTypes.object,
		tenantList: PropTypes.array,
		authorizeConfig: PropTypes.object,
		route: PropTypes.object.isRequired,
		params: PropTypes.object.isRequired,
		userToken: PropTypes.string,
		location: PropTypes.string.isRequired,
		intl: PropTypes.object.isRequired,
	};
	static defaultProps = {
		currentUser: undefined,
		rspInfo: undefined,
		userToken: undefined,
		authorizeConfig: undefined,
		captcha: undefined,
		tenantList: [],
	};

	constructor (props) {
		super(props);
		const { route, params, location, actions } = props;
		console.log('login route.path ', route.path);
		if (route.path === frameworkRoute.LoginOauthWithProvider) {
			if (params.provider == Constant.OAUTH_PROVIDER_GITLAB) {
				if (location && location.query) {
					const { code, state } = location.query;
					actions.loginByGitlab(code, state);
				} else {
					this.reload();
				}
			}
			this.state = { loginType: 'oauth' };
		} else {
			this.state = { loginType: 'admin' };
		}
	}

	componentWillMount () {
		if (this.state.loginType === 'admin') {
			this.reloadCaptcha();
			const { actions } = this.props;
			actions.qryTenantForSelect();
		}
	}

	componentWillReceiveProps (nextProps) {
		const { actionType, rspInfo, currentUser, userToken } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			this.isShouldUpdate = true;
			if (rspInfo) {
				if (`${GET_GITLAB_AUTHORIZE_CONFIG}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`${this.props.intl.formatMessage(
								messages.gitlabConfigError)} ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
						return;
					}
					return this.gitlabLogin(nextProps);
				} else if (`${LOGIN_BY_GITLAB}_SUCCESS` === actionType ||
					`${FRAMEWORK_LOGIN}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						if (rspInfo.resultCode ===
							Constant.REST_ERR_USER_AUTH_STATE) {
							MsgUtil.showwarning(this.props.intl.formatMessage(
								messages.loginFailAccountException));
							this.isLoggedIn = false;
							CookieUtil.clearUserCookie();
							this.context.router.replace(frameworkRoute.Logout);
						} else {
							MsgUtil.showwarning(
								`${this.props.intl.formatMessage(
									messages.loginFailOther)} ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
						}
					} else {
						const { username, userId, tenantId } = currentUser;
						CookieUtil.setCookie('uid', username);
						CookieUtil.setCookie('userId', userId);
						CookieUtil.setCookie('tenantId', tenantId);
						CookieUtil.setCookie('userToken', userToken);
						this.context.router.replace('/home');
						this.isShouldUpdate = false;
					}
				}
			}
		} else if (nextProps !== this.props) {
			this.isShouldUpdate = true;
		} else {
			this.isShouldUpdate = false;
		}
	}

	shouldComponentUpdate () {
		return !!this.isShouldUpdate;
	}

	reload = () => {
		this.context.router.replace(frameworkRoute.Login);
	};
	reloadCaptcha = () => {
		const { actions } = this.props;
		console.log('props', this.props);
		actions.genCaptcha();
	};

	checkCaptcha = (rule, value, callback) => {
		const { captcha } = this.props;
		const { getFieldValue } = this.props.form;
		if (!captcha) {
			callback();
		} else {
			HttpUtil.WenwenApi.post('/admin/user/captcha/check', {
				data: {
					pubInfo: HttpUtil.getPubInfo(),
					captcha: getFieldValue('captcha'),
					captchaMd5: captcha.captchaMd5,
				},
			}).then((ret) => {
				if (ret && ret.rspInfo.resultCode !== Constant.REST_OK) {
					callback([
						new Error(this.props.intl.formatMessage(
							messages.loginCaptchaValid))]);
				} else {
					callback();
				}
			});
		}
	};
	//Form submit
	handleSubmit = (e) => {
		e.preventDefault();
		const { captcha } = this.props;
		this.props.form.validateFields((errors, data) => {
			if (!!errors) {
				return;
			}
			const { actions } = this.props;
			actions.login(data.tenantId, data.username, data.password, data.captcha,
				captcha.captchaMd5);
		});
	};

	//Form reset
	handleReset = (e) => {
		e.preventDefault();
		this.props.form.resetFields();
	};

	gitlabLogin = (props) => {
		const { authorizeConfig, actions } = props;
		if (!authorizeConfig) {
			actions.getGitlabAuthorizeConfig();
		} else {
			window.location.href = authorizeConfig.requestAuthorizeCodeUrl;
		}
	};

	render () {
		const { captcha, actionType } = this.props;
		const { getFieldDecorator } = this.props.form;
		const usernameProps = getFieldDecorator('username', {
			initialValue: '',
			rules: [
				{
					required: true,
					min: 2,
					message: this.props.intl.formatMessage(
						messages.loginUserNameValid),
					autofocus: true,
				},
			],

		});

		const passwordProps = getFieldDecorator('password', {
			initialValue: '',
			rules: [
				{
					required: true,
					min: 6,
					max: 20,
					message: this.props.intl.formatMessage(
						messages.loginPasswordValid),
				},
			],
		});

		const captchaProps = getFieldDecorator('captcha', {
			initialValue: '',
			rules: [
				{
					required: true,
					min: 1,
					message: this.props.intl.formatMessage(
						messages.loginCaptchaEmpty),
				},
				{ validator: this.checkCaptcha },
			],
		});

		const shopProps = getFieldDecorator('tenantId', {
			initialValue: '',
			rules: [
				{
					required: true,
					message: this.props.intl.formatMessage(
						messages.loginBusinessPlaceholder),
				},
			],
		});

		const formItemLayoutVerCode = {
			labelCol: { span: 4 },
			wrapperCol: { span: 18 },
		};

		const formItemLayoutInputStyle = {
			labelCol: { span: 4 },
			wrapperCol: { span: 18 },
		};

		const formItemLayout = {
			wrapperCol: { span: 24 },
		};

		if (`${GET_GITLAB_AUTHORIZE_CONFIG}_PENDING` === actionType) {
			return (
				<Layout className="wenwen-app" >
					<Content className="wenwen-app-right" >
						<Content
							style={{
								textAlign: 'center',
								height: '50%',
								lineHeight: '25px',
								marginTop: '10%',
							}}
						>
							<h1>{this.props.intl.formatMessage(
								messages.loginGitlabLoading)}</h1>
						</Content>
						<Footer >{this.props.intl.formatMessage(
							messages.loginLicense)} © 2017
							<a
								href="http://www.wenwen-tech.com"
								target="_blank"
								rel="noopener noreferrer"
							>http://www.wenwen-tech.com</a>
						</Footer>
					</Content>
				</Layout>
			);
		} else if (`${LOGIN_BY_GITLAB}_PENDING` === actionType) {
			return (
				<Layout className="wenwen-app" >
					<Content className="wenwen-app-right" >
						<Content
							style={{
								textAlign: 'center',
								height: '50%',
								lineHeight: '25px',
								marginTop: '10%',
							}}
						>
							<h1>{this.props.intl.formatMessage(
								messages.loginLoading)}</h1>
						</Content>
						<Footer >{this.props.intl.formatMessage(
							messages.loginLicense)} © 2017
							<a
								href="https://www.wenwen-tech.com"
								target="_blank"
								rel="noopener noreferrer"
							>
								http://www.wenwen-tech.com
							</a>
						</Footer>
					</Content>
				</Layout>
			);
		} else {
			return (
				<Row className="login-bg" >
					<Row>
						<Col span={24} className="topbar" >
							<span className="logo" >
								<img
									src={require(
										'framework/views/images/logo.png')}
								/>
							</span>
							<span className="go-regedit" >
								<a
									onClick={() => {
										this.gitlabLogin(this.props);
									}}
								>{this.props.intl.formatMessage(
									messages.gitlabLoginLabel) }</a>
							</span>
						</Col>
					</Row>
					<Row
						className="login-row" type="flex"
						justify="space-around" align="middle"
					>
						<Col span={7} >
							<div >
								<Form
									layout="horizontal"
									onSubmit={e => this.handleSubmit(e)}
									className="login-form"
									style={{ height: 360 }}
								>
									<h3>{this.props.intl.formatMessage(
										messages.loginTitle) }</h3>

									<FormItem
										{...formItemLayoutInputStyle}
										label={this.props.intl.formatMessage(
											messages.loginUserLabel)}
									>
										{usernameProps(
											<Input
												style={{ width: '100%' }}
												placeholder={this.props.intl.formatMessage(
													messages.loginUserLabel)}
											/>,
										)}
									</FormItem>

									<FormItem
										{...formItemLayoutInputStyle}
										label={this.props.intl.formatMessage(
											messages.loginPasswordLabel)}
									>
										{passwordProps(
											<Input
												type="password"
												style={{ width: '100%' }}
												placeholder={this.props.intl.formatMessage(
													messages.loginPasswordLabel)}
											/>,
										)}
									</FormItem>

									<FormItem
										{...formItemLayoutInputStyle}
										label={this.props.intl.formatMessage(
											messages.loginBusinessLabel)}
									>
										{shopProps(
											<MySelect
												showSearch
												placeholder={this.props.intl.formatMessage(
													messages.loginBusinessPlaceholder)}
												style={{ width: '100%', }}
												optionFilterProp="children"
												filterOption={(
													input,
													option) => option.props.value.toLowerCase().
													indexOf(
														input.toLowerCase()) >=
												0}
												valueKey="tenantId"
												descKey="name"
												selectOptionDataList={this.props.tenantList}
											/>,
										)}
									</FormItem>

									<FormItem
										{...formItemLayoutVerCode}
										label={this.props.intl.formatMessage(
											messages.loginCaptchaLabel)}
									>
										{captchaProps(
											<span>
												<Input
													type="text"
													style={{
														width: 120,
														height: 30,
													}}
												/>&nbsp;
												<img
													className="verification"
													src={captcha
														? `data:image/png;base64,${captcha.captchaImgBase64}`
														: require(
															'framework/views/images/timg.gif')}
													width="65"
													height="30"
													onClick={this.reloadCaptcha}
												/>
												<a
													style={{ marginLeft: 8 }}
													onClick={this.reloadCaptcha}
												>{this.props.intl.formatMessage(
													messages.loginCaptchaUnknow)}</a>
											</span>,
										)}
									</FormItem>

									<div className="submitBox" >
										<Row >
											<Button
												type="primary"
												htmlType="submit"
												className="SubBtn"
											>{this.props.intl.formatMessage(
												messages.loginButton)}</Button>
										</Row>
										<Row>&nbsp;</Row>
									</div>
								</Form>
								<Row>
									<Col span={24} className="footerStyle" >
										{this.props.intl.formatMessage(
											messages.loginLicense)} © 2017
										<a
											href="http://www.wenwen-tech.com"
											target="_blank"
											rel="noopener noreferrer"
										>http://www.wenwen-tech.com</a>
									</Col>
								</Row>
							</div>
						</Col>
					</Row>
				</Row>

			);
		}
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { currentUser, userToken, authorizeConfig, captcha, tenantList } = state.get(
		'AuthService').toObject();
	return {
		currentUser,
		rspInfo,
		userToken,
		authorizeConfig,
		actionType,
		captcha,
		tenantList,
	};
};

/*eslint-disable no-unused-labels */
const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators(
			{
				login,
				getGitlabAuthorizeConfig,
				loginByGitlab,
				genCaptcha,
				qryTenantForSelect,
			},
			dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(injectIntl(Login)));
