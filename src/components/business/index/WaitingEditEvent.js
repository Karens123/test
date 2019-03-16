'use strict';

import React, { PropTypes } from 'react';
import { Row, Col, Button, Table, Icon, Input, Modal, Select, Tabs, Card } from 'antd';
import './index.less';

const Option = Select.Option;
const TabPane = Tabs.TabPane;

class ShowWaitingEvent extends React.Component {
	//检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
	};

	static defaultProps = {
	};

	constructor (props) {
		super(props);
		this.state = {
			currentdate: '系统忙！',
		};
	}

	 render () {
		// const { jewelInfoList } = this.props;
		const CssObj = ({

			gobolCSS: {},
			RowHeight: {
				height: '20px'
			},
			RowBg: {
				backgroundColor: '#ddd',
				height: 37,
				lineHeight: '37px',
				padding: '0px 15px',
				fontWeight: 'bold'
			}

		});
		console.log('CssObj', CssObj);
		return (
			<Col>
				<Row style={CssObj.RowHeight}>&nbsp;</Row>
				<Row style={CssObj.RowBg}><Col span={16} >未支付的订单</Col><Col span={8} style={{ textAlign: 'center' }} >10</Col></Row>
				<Row style={CssObj.RowHeight}>&nbsp;</Row>
				<Row style={CssObj.RowBg}><Col span={16} >未完成的操作</Col><Col span={8} style={{ textAlign: 'center' }} >5</Col></Row>
				<Row style={CssObj.RowHeight}>&nbsp;</Row>
				<Row style={CssObj.RowBg}><Col span={16} >过期的事项</Col><Col span={8} style={{ textAlign: 'center' }} >1</Col></Row>
			</Col>
		);
	}
}

export default ShowWaitingEvent;
