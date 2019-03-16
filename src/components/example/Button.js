'use strict';

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Button } from 'antd';
import 'antd/dist/antd.less';

export default class MyButton extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	test = (name, age) => {
		console.log('name', name);
		console.log('age', age);
		console.log('this.context', this.context);
	};

	render () {
		return (
			<div>
				<ul>
					<h1><Link to="/admin/example" ><span>例子目录</span></Link></h1>
					<Button type="primary" >Primary</Button>
					<Button>Default</Button>
					<Button type="ghost" >Ghost</Button>
					<Button type="dashed" >Dashed</Button>
					<span
						onClick={this.test('test', '100')}
						style={{ color: '#fff' }}
					>  test</span>
				</ul>
			</div>
		);
	}
}