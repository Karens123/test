'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { Row, Col, Select } from 'antd';
import moment from 'moment';
import { getYear } from 'utils/DateUtil';
import businessRoute from 'business/route';
import LineReact from 'business/financialsummary/LineChart';

import { qryDemandDetail,AUDIT_DEMAND,auditDemand,clearDemand } from 'action';

const Option = Select.Option;

class FinancialSummary extends React.Component{
	componentDidMount(){

	}
	getBegin=(now) => {
		return moment(`${getYear(now)}-01-01`);
	};
	genBeginOptions=() => {

	};
	genEndOptions=() => {

	};
	handleChange=(e) => {
		console.log('testing handleChange',e);
	};

	render(){
		const option={
			title: {
				text: '综合数据'
			},
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: ['收入','支出']
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			toolbox: {
				feature: {
					saveAsImage: {}
				}
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: ['1月','2月','3月','4月','5月','6月','7月']
			},
			yAxis: {
				type: 'value'
			},
			color: ['#f70','#14aa14'],
			series: [
				{
					name: '收入',
					type: 'line',
					smooth: true,
					data: [120, 132, 101, 134, 90, 230, 210]
				},
				{
					name: '支出',
					type: 'line',
					smooth: true,
					data: [220, 182, 191, 234, 290, 330, 310]
				}
			]
		};
		const end = new Date();
		const begin=this.getBegin(end);
		console.log('testing begin',begin);
		return (<Row>
			<div>
				<Select defaultValue="lucy" style={{ width: 120 }} onChange={this.handleChange}>
					<Option value="jack">Jack</Option>
					<Option value="lucy">Lucy</Option>
					<Option value="disabled" disabled>Disabled</Option>
					<Option value="Yiminghe">yiminghe</Option>
				</Select>
				至
				<Select defaultValue="lucy" style={{ width: 120 }} onChange={this.handleChange}>
					<Option value="jack">Jack</Option>
					<Option value="lucy">Lucy</Option>
					<Option value="disabled" disabled>Disabled</Option>
					<Option value="Yiminghe">yiminghe</Option>
				</Select>
			</div>
			<Row>
				<LineReact
					option={option}
				/>
			</Row>
			<Row gutter={20}>
				<Col span={12}>
					<div>
						<h3>收入</h3>
						<Link to={businessRoute.a}>详细</Link>
					</div>
					<p>昨日收入/元</p>
					<p className="large">{10000}</p>
				</Col>
				<Col span={12}>
					<div>
						<h3>支出</h3>
						<Link to={businessRoute.a}>详细</Link>
					</div>
					<p>昨日支出/元</p>
					<p className="large">{10000}</p>
				</Col>
			</Row>
		</Row>);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo, actionType } = state.get('RootService').toObject();
	const { demand,auditDemand } = state.get('QryDemandReducer').toObject();
	return {
		rspInfo,
		actionType,
		demand,
		auditDemand
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			qryDemandDetail,
			auditDemand,
			clearDemand
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(FinancialSummary);