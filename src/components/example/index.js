'use strict';

import React from 'react';
import { Link } from 'react-router';
import 'antd/dist/antd.less';

export default class MyExample extends React.Component {
	render () {
		return (
			<div>
				<ul>
					<li>
						<Link to="/admin/example/alert" >
							<span>Alert: 警告提示</span>
						</Link>
					</li>
					<li>
						<Link to="/admin/example/badge" >
							<span>Badge: 徽标数</span>
						</Link>
					</li>
					<li>
						<Link to="/admin/example/button" >
							<span>Button: 按钮</span>
						</Link>
					</li>
					<li>
						<Link to="/admin/example/form" >
							<span>Form: 表单</span>
						</Link>
					</li>
					<li>
						<Link to="/admin/example/upload" >
							<span>Upload: 文件上传</span>
						</Link>
					</li>
				</ul>
			</div>
		);
	}
}