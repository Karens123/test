'use strict';

import React, { PropTypes } from 'react';
import { Row, Select, Tabs, Icon } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import 'business/style/index.less';
import { statUserAttrAggregation, } from 'action';
import * as charts from './charts';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

class UserAttrStatAdmin extends React.Component {

	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
		countryStatUserAttrChartsOption: PropTypes.object,

	};

	static defaultProps = {
		countryStatUserAttrChartsOption: undefined,
	};

	constructor (props) {
		super(props);
		this.state = {
			selectStat: 'countryStat',
		};
	}

	componentWillMount () {
		const { actions } = this.props;
		this.statUserAttrAggregation();
	}

	statUserAttrAggregation = () => {
		const statDate = moment(Date.now()).
			subtract(1, 'days').
			toDate().
			getTime();
		this.props.actions.statUserAttrAggregation(statDate);
	};
	handleSelectChange = (value) => {
		this.setState({ selectStat: value });
	};

	renderStat = () => {
		console.log('this.state.selectStat', this.state.selectStat);
		const { countryStatUserAttrChartsOption } = this.props;
		const { selectStat } = this.state;
		let option;
		if (selectStat === 'countryStat' && countryStatUserAttrChartsOption) {
			option = countryStatUserAttrChartsOption;
		}
		return option &&
			<ReactEcharts
				style={{ height: '70%' }}
				option={option}
				notMerge
				lazyUpdate
			/>;
	};

	render () {

		return (
			<div>
				<Tabs defaultActiveKey="1" type="card" >
					<TabPane tab={<span><Icon type="dot-chart" size="large" />`用户属性分析`</span>} key="1" >
						<Row>
							<Select defaultValue="countryStat" style={{ width: 243 }} onChange={this.handleSelectChange} >
								<Option key="countryStat" value="countryStat" >全球统计</Option>
							</Select>
						</Row>
						<Row >
							<div>
								{ this.renderStat() }
							</div>
						</Row>
					</TabPane>
				</Tabs>
			</div>
		);
	}
}
const mapStateToProps = (state) => {

	const { userAttrAggregationRecord } = state.get('UserAttrStat').
		toObject();
	let countryStatUserAttrChartsOption;
	if (userAttrAggregationRecord) {
		const { countryStatUserAttrList } = userAttrAggregationRecord;
		countryStatUserAttrChartsOption = charts.getCountryOption(
			countryStatUserAttrList);
	}

	return {
		countryStatUserAttrChartsOption,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators(
			{
				statUserAttrAggregation,
			}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserAttrStatAdmin);
