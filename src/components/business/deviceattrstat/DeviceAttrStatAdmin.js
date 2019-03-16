'use strict';

import React, { PropTypes } from 'react';
import { Row, Select, Tabs, Icon } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import 'business/style/index.less';
import { statDeviceAttrAggregation, } from 'action';
import * as charts from './charts';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

class DeviceAttrStatAdmin extends React.Component {

	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
		countryStatDeviceAttrChartsOption: PropTypes.object,
		cnProvinceStatDeviceAttrChartsOption: PropTypes.object,
		cnCityStatDeviceAttrChartsOption: PropTypes.object,

	};

	static defaultProps = {
		countryStatDeviceAttrChartsOption: undefined,
		cnProvinceStatDeviceAttrChartsOption: undefined,
		cnCityStatDeviceAttrChartsOption: undefined,
	};

	constructor (props) {
		super(props);
		this.state = {
			selectStat: 'countryStat',
		};
	}

	componentWillMount () {
		const { actions } = this.props;
		this.statDeviceAttrAggregation();
	}

	statDeviceAttrAggregation = () => {
		const statDate = moment(Date.now()).
			subtract(1, 'days').
			toDate().
			getTime();
		this.props.actions.statDeviceAttrAggregation(statDate);
	};
	handleSelectChange = (value) => {
		this.setState({ selectStat: value });
	};

	renderStat = () => {
		console.log('this.state.selectStat', this.state.selectStat);
		const { countryStatDeviceAttrChartsOption, cnProvinceStatDeviceAttrChartsOption, cnCityStatDeviceAttrChartsOption } = this.props;
		const { selectStat } = this.state;
		let option;
		if (selectStat === 'countryStat' && countryStatDeviceAttrChartsOption) {
			option = countryStatDeviceAttrChartsOption;
		} else if (selectStat === 'cnProvinceStat' &&
			cnProvinceStatDeviceAttrChartsOption) {
			option = cnProvinceStatDeviceAttrChartsOption;
		} else if (selectStat === 'cnCityStat' &&
			cnCityStatDeviceAttrChartsOption) {
			option = cnCityStatDeviceAttrChartsOption;
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
					<TabPane tab={<span><Icon type="dot-chart" size="large" />`设备属性分析`</span>} key="1" >
						<Row>
							<Select defaultValue="countryStat" style={{ width: 243 }} onChange={this.handleSelectChange} >
								<Option key="countryStat" value="countryStat" >全球统计</Option>
								<Option key="cnProvinceStat" value="cnProvinceStat" >国内各省统计</Option>
								<Option key="cnCityStat" value="cnCityStat" >国内各市统计</Option>
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

	const { deviceAttrAggregationRecord } = state.get('DeviceAttrStat').
		toObject();
	let countryStatDeviceAttrChartsOption;
	let cnProvinceStatDeviceAttrChartsOption;
	let cnCityStatDeviceAttrChartsOption;
	if (deviceAttrAggregationRecord) {
		const { statDeviceCountryAttr, statDeviceCnProvinceAttr, statDeviceCnCityAttr } = deviceAttrAggregationRecord;
		countryStatDeviceAttrChartsOption = charts.getCountryOption(statDeviceCountryAttr);
		cnProvinceStatDeviceAttrChartsOption = charts.getCnProvinceOption(statDeviceCnProvinceAttr);
		cnCityStatDeviceAttrChartsOption = charts.getCnCityOption(statDeviceCnCityAttr);
	}

	return {
		countryStatDeviceAttrChartsOption,
		cnProvinceStatDeviceAttrChartsOption,
		cnCityStatDeviceAttrChartsOption
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators(
			{
				statDeviceAttrAggregation,
			}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	DeviceAttrStatAdmin);
