import { defineMessages } from 'react-intl';

export default defineMessages({
	gitlabLoginLabel: {
		id: 'login.gitlabLoginLabel',
		defaultMessage: 'Gitlab 登录',
	},
	gitlabConfigError: {
		id: 'login.gitlab.config.error',
		defaultMessage: '获取gitlab配置信息失败,错误信息',
	},
	loginTitle: {
		id: 'login.title',
		defaultMessage: '登录',
	},
	loginFailAccountException: {
		id: 'login.fail.accountException',
		defaultMessage: '该用户已被冻结，请联系管理人员！',
	},
	loginFailOther: {
		id: 'login.fail.other',
		defaultMessage: '登录失败,错误信息',
	},
	loginButton: {
		id: 'login.button',
		defaultMessage: '登录',
	},
	loginUserLabel: {
		id: 'login.user.label',
		defaultMessage: '用户名：',
	},
	loginUserNameValid: {
		id: 'login.username.valid',
		defaultMessage: '用户名至少为 2 个字符',
	},
	loginPasswordLabel: {
		id: 'login.password.label',
		defaultMessage: '密码：',
	},
	loginPasswordValid: {
		id: 'login.password.valid',
		defaultMessage: '密码至少为6位,最多20位',
	},
	loginBusinessLabel: {
		id: 'login.business.label',
		defaultMessage: '商家：',
	},
	loginBusinessPlaceholder: {
		id: 'login.business.placeholder',
		defaultMessage: '商家不允许为空：',
	},
	loginBusinessWenwen: {
		id: 'login.business.wenwen',
		defaultMessage: '吻吻',
	},
	loginCaptchaLabel: {
		id: 'login.captcha.label',
		defaultMessage: '验证码',
	},
	loginCaptchaEmpty: {
		id: 'login.captcha.empty',
		defaultMessage: '请输入验证码',
	},
	loginCaptchaValid: {
		id: 'login.captcha.valid',
		defaultMessage: '抱歉，验证码错误。',
	},
	loginCaptchaUnknow: {
		id: 'login.captcha.unknow',
		defaultMessage: '看不清，换一张',
	},
	loginLicense: {
		id: 'login.license',
		defaultMessage: '吻吻科技 版权所有',
	},
	loginLoading: {
		id: 'login.loading',
		defineMessages: '正在为您登录后台管理系统，请稍后。。。'
	},
	loginGitlabLoading: {
		id: 'login.gitlab.loading',
		defineMessages: '正在为您跳转，请稍后。。。'
	}
});