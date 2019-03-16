'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect, Link, route } from 'react-redux';
import { Layout, Modal } from 'antd';
import * as HttpUtil from 'utils/HttpUtil';
import * as Constant from 'utils/Constant';
import * as CookieUtil from 'utils/CookieUtil';
import * as MsgUtil from 'utils/MsgUtil';
import WenwenHeader from 'framework/components/WenwenHeader';
import WenwenMenu from 'framework/components/WenwenMenu';
import frameworkRoute from 'framework/views/route';
import {
	FRAMEWORK_GET_ALL_MENUS, FRAMEWORK_GET_TEST_USER, FRAMEWORK_GET_USER, getAllMenu, getUser,
	updateNavPath
} from 'framework/action';

import './index.less';
import IndexHomepage from '../../components/business/index/index';

const { Sider, Content, Footer } = Layout;

class App extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static propTypes = {
		currentUser: PropTypes.object.isRequired,
		sysMenuList: PropTypes.array.isRequired,
		navpath: PropTypes.array.isRequired,
		children: PropTypes.node.isRequired,
		actions: PropTypes.object.isRequired,
		rspInfo: PropTypes.object.isRequired,
		actionType: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,

	};

	constructor(props, context) {
		super(props, context);
		this.state = {
			collapsed: false,
			mode: 'inline',
			LeftValue: '',
			documentWidth: document.body.clientWidth,
		};
		this.refresh(props);

	}

	componentWillMount() {
		if (!this.isLoggedIn) {
			this.context.router.replace(frameworkRoute.Login);
		}
	}

	componentDidMount() {
		window.addEventListener('unhandledrejection', (event) => {
			console.error('Unhandled rejection (promise: ', event.promise,
				', reason: ', event.reason, ').');
		});
	}

	componentWillReceiveProps(nextProps) {
		const { actionType, rspInfo } = nextProps;
		if (rspInfo !== this.props.rspInfo) {
			if (rspInfo) {
				if (rspInfo.resultCode === Constant.REST_ERR_AUTHENTICATION) {
					MsgUtil.showwarning('用户令牌校验失败，请重新登录!');
					this.isLoggedIn = false;
					CookieUtil.clearUserCookie();
					this.context.router.replace(frameworkRoute.Logout);
					this.isShouldUpdate = false;
					return;
				}
				if (`${FRAMEWORK_GET_ALL_MENUS}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`获取菜单列表失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
					const { sysMenuList } = nextProps;
					if (!sysMenuList || sysMenuList.length < 1) {
						MsgUtil.showwarning('用户令牌校验失败，请重新登录!');
						this.isLoggedIn = false;
						CookieUtil.clearUserCookie();
						this.context.router.replace(frameworkRoute.Logout);
						this.isShouldUpdate = false;
						return;
					}
					return this.refresh(nextProps);
				} else if (`${FRAMEWORK_GET_USER}_SUCCESS` === actionType) {
					if (rspInfo.resultCode !== Constant.REST_OK) {
						MsgUtil.showwarning(
							`获取用户数据失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
					}
				} else if (`${FRAMEWORK_GET_TEST_USER}_SUCCESS` ===
					actionType) {
					return this.refresh(nextProps);
				}
			}
		}
		this.isShouldUpdate = true;
	}

	shouldComponentUpdate() {
		return !!this.isShouldUpdate;
	}

	onCollapse = (collapsed, type) => {
		this.setState({
			collapsed,
			mode: collapsed ? 'vertical' : 'inline',
		});
		if (collapsed === true) {
			this.state.LeftValue = 64;
			document.getElementsByClassName(
				'header-menu')[0].style.width = this.state.documentWidth - 64;
		} else {
			this.state.LeftValue = 200;
			document.getElementsByClassName(
				'header-menu')[0].style.width = this.state.documentWidth - 200;
		}
	};

	leftMenuClickHandle = (item) => {
		//更新面包导航
		this.props.actions.updateNavPath(item.keyPath, item.key);
		HttpUtil.clearUnderline();
	};

	headerMenuClickHandle = (item) => {
		const BreadNavStr = {
			name: '',
		};
		if (item.key == 'Help') {
			BreadNavStr.name = '帮助';
		} else if (item.key == 'seting') {
			BreadNavStr.name = '资料设置';
		} else if (item.key == 'ChangePassword') {
			BreadNavStr.name = '修改密码';
		}
		this.props.actions.updateNavPath('', BreadNavStr.name);
	};
	headerLogoutClickHandle = () => {
		Modal.confirm({
			title: '您确定要退出登录吗?',
			content: '',
			onOk: () => {
				this.context.router.replace(frameworkRoute.Logout);
			},
			onCancel: () => {
			},
		});
	};

	refresh = (props) => {
		const { currentUser, sysMenuList, actions } = props;
		let userId = undefined;
		if (!currentUser) {
			userId = CookieUtil.getCookie('userId');
			if (userId) {
				this.isLoggedIn = true;
			}
		} else {
			userId = currentUser.userId;
			this.isLoggedIn = true;
		}

		if (!this.isLoggedIn) {
			this.isShouldUpdate = false;
		} else {
			if (!sysMenuList || sysMenuList.length < 1) {
				if (userId) {
					actions.getAllMenu(userId);
				}
				this.isShouldUpdate = false;
				return;
			}
			if (!currentUser) {
				if (userId) {
					actions.getUser(userId);
				}
				this.isShouldUpdate = false;
				return;
			}
			this.isShouldUpdate = true;
		}
	};

	render() {
		const { currentUser, sysMenuList, navpath } = this.props;
		const CSSMarginLeft = ({
			marginLeft: this.state.LeftValue,
		});

		const location = this.props.location.pathname;

		const page = {
			pageHome: '',
		};
		if (location === '/home') {
			page.pageHome =
				<div className="outlayout"><IndexHomepage /></div>;
		} else {
			page.pageHome = <Content> {this.props.children} </Content>;
		}

		if (currentUser && sysMenuList) {
			return (

				<Layout className="wenwen-app">
					<Sider
						className="wenwen-app-sider"
						collapsible
						collapsed={this.state.collapsed}
						onCollapse={this.onCollapse}
						width={200}
					>
						<div className="menu-logo" />
						<WenwenMenu
							sysMenuList={sysMenuList}
							mode={this.state.mode}
							buildIFrameModuleFn={frameworkRoute.IframeModule}
							menuClickHandle={this.leftMenuClickHandle}
						/>
					</Sider>
					<Content
						className="wenwen-app-right"
						style={CSSMarginLeft}
					>
						<WenwenHeader
							currentUser={currentUser}
							sysMenuList={sysMenuList}
							navpath={navpath}
							menuClickHandle={this.headerMenuClickHandle}
							logoutClickHandle={this.headerLogoutClickHandle}
						/>
						{page.pageHome}
						<Footer>吻吻科技 版权所有 © 2016
							<a
								href="http://www.wenwen-tech.com"
								target="_blank"
								rel="noopener noreferrer"
							>http://www.wenwen-tech.com</a>
						</Footer>
					</Content>
				</Layout>

			);
		} else {
			return (
				<div style={{ textAlign: 'center', marginTop: 150 }}>
					<p><img src={require('framework/views/images/timg.gif')} />
					</p>

				</div>);
		}
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { currentUser } = state.get('AuthService').toObject();
	const { sysMenuList, navpath, } = state.get('MenuService').toObject();
	return {
		rspInfo,
		actionType,
		currentUser,
		sysMenuList,
		navpath,
	};
};

/*eslint-disable no-unused-labels */
const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({ getUser, updateNavPath, getAllMenu },
			dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
