'use strict';

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Col, Icon, Layout, Menu, Modal, Row } from 'antd';
import NavPath from 'framework/components/NavPath';
import * as frameworkRoute from 'framework/views/route';
import './index.less';

const { Header } = Layout;
const SubMenu = Menu.SubMenu;

export default class WenwenHeader extends React.Component {
	static propTypes = {
		currentUser: PropTypes.object,
		navpath: PropTypes.array,
		sysMenuList: PropTypes.array,
		menuClickHandle: PropTypes.func,
		logoutClickHandle: PropTypes.func,
	};

	static defaultProps = {
		currentUser: undefined,
		navpath: undefined,
		sysMenuList: undefined,
		menuClickHandle: undefined,
		logoutClickHandle: undefined,
	};

	constructor (props, context) {
		super(props, context);
		this.state = {
			documentWidth: document.body.clientWidth,
		};
	}

	handleLogout = (e) => {
		e.preventDefault();
		if (this.props.logoutClickHandle) {
			this.props.logoutClickHandle();
		}
	};

	render () {
		const cssWidthStyle = ({
			width: this.state.documentWidth - 200,
		});

		const { currentUser, menuClickHandle, navpath, sysMenuList } = this.props;
		if (currentUser) {
			return (
				<Header>
					<Row >
						<Col span={18} style={{ float: 'none' }} >
							<Menu
								className="header-menu"
								mode="horizontal"
								style={cssWidthStyle}
								defaultOpenKeys={[]}
								onClick={menuClickHandle}
							>
								<SubMenu
									title={
										<span>
											<Icon type="user" />
											{currentUser.username}
										</span>
									}
								>
									<Menu.Item key="setting" >
										<Link to={frameworkRoute.ModiInfor} >
											<span>资料设置</span>
										</Link>
									</Menu.Item>
									<Menu.Item key="ChangePassword" >
										<Link to={frameworkRoute.Setting} >
											<span>修改密码</span>
										</Link>
									</Menu.Item>
									<Menu.Divider />
									<Menu.Item key="logout" >
										<Link
											to={frameworkRoute.Logout}
											onClick={this.handleLogout}
										>
											<span>注销</span>
										</Link>
									</Menu.Item>
								</SubMenu>
								<Menu.Item key="Help" >
									<Link to={frameworkRoute.Help} >
										<span>帮助</span>
									</Link>
								</Menu.Item>
								<Menu.Item key="shop" >
									{/*<span className="shopStyle" >众星珠宝</span>*/}
								</Menu.Item>
							</Menu>
						</Col>
						<Col span={6} style={{ float: 'left' }} ><NavPath navpath={navpath} sysMenuList={sysMenuList} /></Col>
					</Row>

				</Header>
			);
		}
		return null;
	}
};
