'use strict';

import React, { PropTypes } from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router';
import 'antd/dist/antd.less';

import * as CookieUtil from 'utils/CookieUtil';
import './index.less';

export default class WenwenMenu extends React.Component {
	static propTypes = {
		sysMenuList: PropTypes.array,
		menuClickHandle: PropTypes.func,
		buildIFrameModuleFn: PropTypes.func.isRequired,
		mode: PropTypes.string.isRequired,
	};

	static defaultProps = {
		sysMenuList: null,
		menuClickHandle: undefined,
	};

	constructor (props) {
		super(props);
		this.state = {
			current: '1',
			openKeys: [],
		};

		let openKeys;
		try {
			openKeys = JSON.parse(CookieUtil.getCookie('menu-openKeys'));
		} catch (e) {
		}

		if (!Array.isArray(openKeys)) {
			openKeys = [];
		}
		this.state.openKeys = openKeys;

		let selectedKeys;
		try {
			selectedKeys = JSON.parse(
				CookieUtil.getCookie('menu-selectedKeys'));
		} catch (e) {
		}
		if (!Array.isArray(selectedKeys)) {
			selectedKeys = [];
		}
		this.state.selectedKeys = selectedKeys;
	}

	onOpenChange = (openKeys) => {

		console.log('openKeys______________', openKeys);

		const state = this.state;
		const latestOpenKey = openKeys.find(
			key => !(state.openKeys.indexOf(key) > -1));
		const latestCloseKey = state.openKeys.find(
			key => !(openKeys.indexOf(key) > -1));

		let nextOpenKeys = [];
		if (latestOpenKey) {
			nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
		}
		if (latestCloseKey) {
			nextOpenKeys = this.getAncestorKeys(latestCloseKey);
		}

		this.setState({ openKeys: nextOpenKeys }, () => {

			console.log('openKeys____________:',openKeys);
			console.log('JSON.stringify(openKeys)____________:',JSON.stringify(openKeys));


			CookieUtil.setCookie('menu-openKeys', JSON.stringify(openKeys));


		});
	};

	onSelect = (data) => {
		const { selectedKeys } = data;
		this.setState({ selectedKeys }, () => {
			CookieUtil.setCookie('menu-selectedKeys',
				JSON.stringify(selectedKeys));
		});
	};

	getAncestorKeys = (key) => {
		console.log('key', key);
		const map = {
			// sub3: ['sub2'],//多层子菜单，sub2包括sub3菜单
		};
		return map[key] || [];
	};

	menuClickHandle = (item, e) => {
		if (this.props.menuClickHandle) {
			this.props.menuClickHandle(item);
		}
	};

	render () {
		const { sysMenuList } = this.props;
		//获取用于构建IFrame模块的函数
		const buildIFrameModuleFn = this.props.buildIFrameModuleFn;
		if (!sysMenuList || !sysMenuList[0]) {
			return null;
		}

		const { openKeys, selectedKeys } = this.state;
		const menu = sysMenuList.map((item) => {
			return (
				<Menu.SubMenu
					key={`sub${item.menuId}`}
					title={
						<span >
							<Icon type={item.imageUrl} />
							<span className="nav-text" >
								{item.menuTitle}
							</span>
						</span>
					}
				>
					{item.childList.map((node) => {
						let url = node.url;
						if (!url || !url[0]) {
							url = '/dash/examle/:type';
						} else if (url[0] !== '/') {
							url = buildIFrameModuleFn(encodeURIComponent(url));
						}
						return (
							<Menu.Item key={`menu${node.menuId}`} >
								<Link to={url} >
									<span>{node.menuTitle}</span>
								</Link>
							</Menu.Item>
						);
					})}
				</Menu.SubMenu>
			);
		});

		return (
			<Menu
				mode={this.props.mode}
				theme="dark"
				defaultSelectedKeys={[]}
				defaultOpenKeys={[]} openKeys={openKeys}
				selectedKeys={selectedKeys}
				onOpenChange={this.onOpenChange} onSelect={this.onSelect}
				onClick={this.menuClickHandle}
			>
				{menu}
			</Menu>
		);
	}
};

