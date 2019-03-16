'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Col, Row, Table, Tabs, Select, Pagination, Modal, Input, Form, Icon } from 'antd';
import { parseDate, parseDateTime } from 'utils/DateUtil';
import * as MappingUtil from 'utils/MappingUtil';
// import './index.less';

const Option = Select.Option;
const { TextArea } = Input;

export default class OrderReturn extends React.Component {
	//检验类型
	static contextTypes = {
		leaseWorkerInfo: PropTypes.object.isRequired
	};

	static propTypes = {
		leaseWorkerInfo: PropTypes.object.isRequired
	};

	static defaultProps = {
		leaseWorkerInfo: {}
	};

	constructor (props) {
		super(props);
		this.state = {
			showModal: false,
		};
	}

	//分页控制
	render () {
		const { leaseWorkerInfo } = this.props;
		return (<div>
			<Row >
				<Col span={24} >
					开始/结束：{leaseWorkerInfo.receiveTime ? parseDateTime(leaseWorkerInfo.receiveTime): '0'} 至 {leaseWorkerInfo.returnTime ? parseDateTime(leaseWorkerInfo.returnTime): '0'}
				</Col>
			</Row>
			<Row >
				&nbsp;
			</Row>
			<Row >
				<Col span={24} >
					剩于天数：{leaseWorkerInfo.remainDay  ? `${leaseWorkerInfo.remainDay}天`: '暂无'}  &nbsp;&nbsp;
					<a
						rel="noopener noreferrer"
						style={{ color: 'green' }}
					>
						{leaseWorkerInfo.remainDay=='0天' ?'己归还': ''}</a>
				</Col>
			</Row>
		</div>);
	}
};

