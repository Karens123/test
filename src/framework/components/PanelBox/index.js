'use strict';

import React, { PropTypes } from 'react';
import { Collapse, Row } from 'antd';

import './index.less';

const Panel = Collapse.Panel;
export default class PanelBox extends React.Component {
	static propTypes = {
		style: PropTypes.object,
		title: PropTypes.string.isRequired,
		children: PropTypes.node,
	};
	static defaultProps = {
		style: {},
		children: undefined,
	};

	render () {
		return (
			<Collapse className="panel-box" style={this.props.style} defaultActiveKey={['0','1','2']}  >
				<Panel header={this.props.title} key="1" >
					<Row>{this.props.children}</Row>
				</Panel>
			</Collapse>
		);
	}
};
