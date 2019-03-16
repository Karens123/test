'use strict';

import React, { PropTypes } from 'react';
import { Button, Form, Input } from 'antd';
import classNames from 'classnames';

const createForm = Form.create;
const InputGroup = Input.Group;

function noop () {
	return false;
}

class MyForm extends React.Component {
	static propTypes = {
		onSearch: PropTypes.func.isRequired,
		style: PropTypes.object.isRequired,
		size: PropTypes.number.isRequired,
	};

	constructor (props, context) {
		super(props, context);
		this.state = {
			value: '',
			focus: false,
		};
	}

	handleInputChange = (e) => {
		this.setState({
			value: e.target.value,
		});
	};
	handleFocusBlur = (e) => {
		this.setState({
			focus: e.target === document.activeElement,
		});
	};
	handleSearch = () => {
		if (this.props.onSearch) {
			this.props.onSearch(this.state.value);
		}
	};

	render () {
		const { style, size } = this.props;

		const btnCls = classNames({
			'ant-search-btn': true,
			'ant-search-btn-noempty': !!this.state.value.trim(),
		});
		const searchCls = classNames({
			'ant-search-input': true,
			'ant-search-input-focus': this.state.focus,
		});
		return (
			<div className="ant-search-input-wrapper" style={style} >

				<InputGroup className={searchCls} >
					<Input
						value={this.state.value}
						onChange={this.handleInputChange}
						onFocus={this.handleFocusBlur}
						onBlur={this.handleFocusBlur}
						onPressEnter={this.handleSearch}
					/>
					<div className="ant-input-group-wrap" >
						<Button
							icon="search" className={btnCls} size={size}
							onClick={this.handleSearch}
						/>
					</div>
				</InputGroup>
			</div>
		);
	}
}

export default createForm()(MyForm);
