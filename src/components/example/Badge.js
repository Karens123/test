'use strict';

import React from 'react';
import { Link } from 'react-router';
import { Badge } from 'antd';
import 'antd/dist/antd.less';

/*eslint-disable jsx-a11y/href-no-hash*/
/*eslint-disable jsx-a11y/anchor-has-content*/
export default class MyBadge extends React.Component {
	render () {
		return (
			<div>
				<h1><Link to="/admin/example" ><span>例子目录</span></Link></h1>
				<Badge count={99} >
					<a href="#" className="head-example" />
				</Badge>
				<Badge count={200} >
					<a href="#" className="head-example" />
				</Badge>
			</div>
		);
	}
}