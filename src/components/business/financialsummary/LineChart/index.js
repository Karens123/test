import React, { PropTypes } from 'react';
import echarts from 'echarts/lib/echarts'; //必须
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/grid';
import 'echarts/lib/chart/line';

export default class LineReact extends React.Component {

	static propTypes={
		option: PropTypes.object,
		width: PropTypes.string,
		height: PropTypes.height,
	}
	static defaultProps={
		option: {},
		width: '100%',
		height: '300px'
	}

	constructor(props) {
		super(props);
		this.initPie = this.initPie.bind(this);
	}


	componentDidMount() {
		this.initPie();
	}

	componentDidUpdate() {
		this.initPie();
	}
	initPie() {
		const { option }  = this.props;//外部传入的data数据
		const myChart = echarts.init(this.ID);//初始化echarts

		//设置options
		myChart.setOption(option);
		window.onresize = function() {
			myChart.resize();
		};
	}

	render() {
		const { width, height } = this.props;
		return (<div ref={ID => this.ID = ID} style={{ width, height }} />);
	}
}