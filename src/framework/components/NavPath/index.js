'use strict';

import React, { PropTypes } from 'react';
import { Breadcrumb } from 'antd';

import * as CookieUtil from 'utils/CookieUtil';

import './index.less';

export default class NavPath extends React.Component {
	static propTypes = {
		navpath: PropTypes.array,
		sysMenuList: PropTypes.array,
	};
	static defaultProps = {
		navpath: [],
		sysMenuList: [],
	};

	render () {
		let { navpath, } = this.props;
		const { sysMenuList, } = this.props;
		if (!navpath || navpath.length < 1) {
			try {
				navpath = JSON.parse(CookieUtil.getCookie('navpath'));
			} catch (e) {
			}
			if (!Array.isArray(navpath)) {
				navpath = [];
			}
		} else {
			CookieUtil.setCookie('navpath', JSON.stringify(navpath));
		}

		//第一次加载外网，navpath数据清掉，重新定义
		let currentAddress = [
			{
				key: '',
				name: '',
			},
			{
				key: '',
				name: '',
			}];
		sysMenuList.forEach((obj) => {
			if (obj.menuId === '4') {
				obj.childList.map((childItem) => {
					const item = [
						{
							key: '1',
							name: obj.menuTitle,
						},
						{
							key: '2',
							name: childItem.menuTitle,
						},
					];
					currentAddress = { ...item };
				});
			}
		});

		if (navpath.length == 0) {
			navpath = [{ ...currentAddress }];
		}
		const bread = navpath.map((item) => {
			return (
				<Breadcrumb.Item
					key={`bc-${item.key}`}
				>{item.name}</Breadcrumb.Item>
			);
		});

		return (
			<Breadcrumb>
				<Breadcrumb.Item key="bc-0" >首页</Breadcrumb.Item>
				{bread}
			</Breadcrumb>
		);
	}
};
