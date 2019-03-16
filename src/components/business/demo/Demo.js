'use strict';

import React from 'react';
import { Row, Col, Collapse, Alert, BackTop } from 'antd';
import PanelBox from 'framework/components/PanelBox';
import { Line, Pie, Doughnut, Bar, Radar, PolarArea } from 'react-chartjs';
//Doughnut环形图  ,PolarArea极地图 ,Radar雷达图 ,Bar柱状
import './index.less';

const chartOption = {
	responsive: true//调整大小时，其容器还是图表画布 布尔值
};

//曲线数据
const item = [18, 48, 40, 19, 86, 27, 90, 30, 90];
const lineData = {
	labels: [
		'10-13',
		'10-17',
		'10-21',
		'10-25',
		'10-29',
		'11-03',
		'11-07',
		'11-11',
		'11-15'],
	height: 350,
	datasets: [
		{
			label: 'My First dataset',
			fillColor: 'rgba(253,180,92,0.2)',
			strokeColor: 'rgba(253,180,92,1)',
			pointColor: 'rgba(220,220,220,1)',
			pointStrokeColor: '#fff',
			pointHighlightFill: '#fff',
			pointHighlightStroke: 'rgba(220,220,220,1)',
			data: [65, 59, 80, 81, 56, 55, 40, 30, 90],

		},
		{
			label: 'My Second dataset',
			fillColor: 'rgba(151,187,205,0.2)',
			strokeColor: 'rgba(151,187,205,1)',
			pointColor: 'rgba(151,187,205,1)',
			pointStrokeColor: '#fff',
			pointHighlightFill: '#fff',
			pointHighlightStroke: 'rgba(151,187,205,1)',
			data: item,

		},
		{
			label: 'My three dataset',
			fillColor: 'rgba(70,191,189,0.2)',
			strokeColor: 'rgba(70,191,189,1)',
			pointColor: 'rgba(70,191,189,1)',
			pointStrokeColor: '#fff',
			pointHighlightFill: '#fff',
			pointHighlightStroke: 'rgba(151,187,205,1)',
			data: [60, 59, 10, 91, 46, 55, 50, 80, 60],

		},
	],
};

//饼图数据
const pieData = [
	{
		value: 90,
		color: '#F7464A',
		highlight: '#FF5A5E',
		label: 'Red',
	},
	{
		value: 10,
		color: '#46BFBD',
		highlight: '#5AD3D1',
		label: 'Green',
	},
	{
		value: 100,
		color: '#FDB45C',
		highlight: '#FFC870',
		label: 'Yellow',
	},
];

//柱状图数据
const BarData = {
	labels: ['1', '2', '3', '4', '5', '6', '7'],
	datasets: [
		{
			fillColor: 'rgba(220,220,220,0.5)',
			strokeColor: 'rgba(220,220,220,1)',
			data: [65, 59, 90, 81, 56, 55, 40],
		},
		{
			fillColor: 'rgba(151,187,205,0.5)',
			strokeColor: 'rgba(151,187,205,1)',
			data: [28, 48, 40, 19, 96, 27, 100],
		},
	],
};

//极地图数据
const PolarAreaData = [
	{
		value: 30,
		color: '#D97041',
	},
	{
		value: 90,
		color: '#C7604C',
	},
	{
		value: 24,
		color: '#21323D',
	},
	{
		value: 58,
		color: '#9D9B7F',
	},
	{
		value: 82,
		color: '#7D4F6D',
	},
	{
		value: 8,
		color: '#584A5E',
	},
];

const PolarAreaData_other = [
	{
		value: 150,
		color: 'red',
	},
	{
		value: 60,
		color: 'blue',
	},
	{
		value: 224,
		color: 'gray',
	},
	{
		value: 128,
		color: '#9D9B7F',
	},
	{
		value: 82,
		color: '#666',
	},
	{
		value: 18,
		color: '#584A5E',
	},
];

//柱状图动态数据配制
Bar.defaults = {
	//Boolean - If we show the scale above the chart data
	scaleOverlay: false,

	//Boolean - If we want to override with a hard coded scale
	scaleOverride: false,

	//** Required if scaleOverride is true **
	//Number - The number of steps in a hard coded scale
	scaleSteps: null,
	//Number - The value jump in the hard coded scale
	scaleStepWidth: null,
	//Number - The scale starting value
	scaleStartValue: null,

	//String - Colour of the scale line
	scaleLineColor: 'rgba(0,0,0,.1)',

	//Number - Pixel width of the scale line
	scaleLineWidth: 1,

	//Boolean - Whether to show labels on the scale
	scaleShowLabels: false,

	//Interpolated JS string - can access value
	scaleLabel: '<%=value%>',

	//String - Scale label font declaration for the scale label
	scaleFontFamily: '\'Arial\'',

	//Number - Scale label font size in pixels
	scaleFontSize: 12,

	//String - Scale label font weight style
	scaleFontStyle: 'normal',

	//String - Scale label font colour
	scaleFontColor: '#666',

	///Boolean - Whether grid lines are shown across the chart
	scaleShowGridLines: true,

	//String - Colour of the grid lines
	scaleGridLineColor: 'rgba(0,0,0,.05)',

	//Number - Width of the grid lines
	scaleGridLineWidth: 1,

	//Boolean - If there is a stroke on each bar
	barShowStroke: true,

	//Number - Pixel width of the bar stroke
	barStrokeWidth: 2,

	//Number - Spacing between each of the X value sets
	barValueSpacing: 5,

	//Number - Spacing between data sets within X values
	barDatasetSpacing: 1,

	//Boolean - Whether to animate the chart
	animation: true,

	//Number - Number of animation steps
	animationSteps: 60,

	//String - Animation easing effect
	animationEasing: 'easeOutQuart',

	//Function - Fires when the animation is complete
	onAnimationComplete: null,
};

//雷达图
const RadarData = {
	labels: [
		'Eating',
		'Drinking',
		'Sleeping',
		'Designing',
		'Coding',
		'Partying',
		'Running'],
	datasets: [
		{
			fillColor: 'rgba(220,220,220,0.5)',
			strokeColor: 'rgba(220,220,220,1)',
			pointColor: 'rgba(220,220,220,1)',
			pointStrokeColor: '#fff',
			data: [65, 59, 90, 81, 56, 55, 40],
		},
		{
			fillColor: 'rgba(151,187,205,0.5)',
			strokeColor: 'rgba(151,187,205,1)',
			pointColor: 'rgba(151,187,205,1)',
			pointStrokeColor: '#fff',
			data: [28, 48, 40, 19, 96, 27, 100],
		},
	],
};

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

class Demo extends React.Component {
	render () {
		const detail = (
			<Collapse
				onChange={this.callback}
				defaultActiveKey={[
					'1',
					'2',
					'3']}
			>
				<Collapse.Panel header="This is panel header 1" key="1" >
					<p>{text}</p>
				</Collapse.Panel>

				<Collapse.Panel header="This is panel header 2" key="2" >
					<p>{text}</p>
				</Collapse.Panel>
				<Collapse.Panel header="This is panel header 3" key="3" >
					<p>{text}</p>
				</Collapse.Panel>
			</Collapse>
		);

		return (
			<div>
				<Alert
					message="消息提示"
					description="消息提示的辅助性文字介绍消息提示的辅助性文，字介绍消息提示的辅助性文字介绍"
					type="info"
					showIcon
				/>
				<PanelBox title="最近的数据" >
					<Line data={lineData} options={chartOption} />
				</PanelBox>

				<PanelBox title="最近的数据" >
					<Row className="home-row" type="flex" justify="space-between" >
						<Col span="12" >
							<Pie data={pieData} options={chartOption} />
							<h3 className="home-title-x" >测试数据1</h3>
						</Col>
						<Col span="12" >
							<Doughnut data={pieData} options={chartOption} />
							<h3 className="home-title-x" >测试数据2</h3>
						</Col>
					</Row>
				</PanelBox>
				<PanelBox title="柱状图表" >
					<Bar data={BarData} options={chartOption} />
				</PanelBox>
				<PanelBox title="雷达图" >
					<Row className="home-row" type="flex" justify="space-between" >
						<Col span="12" >
							<Radar data={RadarData} options={chartOption} />

						</Col>
						<Col span="12" >
							<Radar data={RadarData} options={chartOption} />

						</Col>
					</Row>
				</PanelBox>
				<PanelBox title="极地图" >
					<Row className="home-row" type="flex" justify="space-between" >
						<Col span="8" >
							<PolarArea data={PolarAreaData} options={chartOption} />

						</Col>
						<Col span="8" >
							<PolarArea data={PolarAreaData_other} options={chartOption} />

						</Col>
					</Row>
				</PanelBox>
				<Row className="home-row" type="flex" justify="space-between" >
					<Col span="11" >
						{detail}
					</Col>
					<Col span="2" />
					<Col span="11" >
						{detail}
					</Col>
				</Row>
				<BackTop />
			</div>
		);
	}
}

export  default Demo;
