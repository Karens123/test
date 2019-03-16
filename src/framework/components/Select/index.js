'use strict';

import React, { PropTypes } from 'react';
import { Select } from 'antd';

const Option = Select.Option;

export default class MySelect extends React.Component {
	static propTypes = {
		valueKey: PropTypes.string.isRequired,
		descKey: PropTypes.string.isRequired,
		selectOptionDataList: PropTypes.array.isRequired,
		children: PropTypes.node,
	};
	static defaultProps = {
		children: undefined,
	};

	render () {
		const { valueKey, descKey, selectOptionDataList } = this.props;
		const children = [];
		React.Children.forEach(this.props.children,
			child => children.push(child),
		);

		// console.log('children________________', children);

		const SelectOption = selectOptionDataList && selectOptionDataList.map(

				data => <Option key={String(data[valueKey])} >{data[descKey]}</Option>);


		// console.log('SelectOption________________', SelectOption);
		return (
			<Select {...this.props} >
				{children}
				{SelectOption}
			</Select>
		);
	}
};
