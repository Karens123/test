'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Col, Row, Table, Tabs, Select, Pagination, Modal, Input, Form, Icon } from 'antd';
import { parseDate, parseDateTime } from 'utils/DateUtil';

const Option = Select.Option;
const { TextArea } = Input;

export default class OrderRemark extends React.Component {
	//检验类型
	static contextTypes = {
		getTextareaValue: PropTypes.fun,
	};

	static propTypes = {
		getTextareaValue: PropTypes.fun,
	};

	static defaultProps = {
		getTextareaValue: () => {
			console.log('test');
		},
	};

	constructor (props) {
		super(props);
		this.state = {
			value: '',
		};
	}

	changeValue = (txt) => {
		this.props.getTextareaValue(txt);

	};

	//分页控制
	render () {
		return (<div>
			<Row >
				<Col span={24} >

					<TextArea
						placeholder="请添加备注"
						autosize={{ minRows: 4, maxRows: 6 }}
						onChange={(e) => {
							this.setState({
								value: e.target.value
							},() => {
								this.changeValue(this.state.value);
							});
						}}

					/>
				</Col>
			</Row>
			<Row >
				&nbsp;
			</Row>

		</div>);
	}
};


