'use strict';

module.exports = {
	linechartPropType: [
		{
			addUsersPropTypeValue: {
				label: 'My First dataset', //label
				fillColor: 'rgba(253,180,92,0.2)',//线条包围的填充区域色
				strokeColor: 'rgba(253,180,92,1)',//线条色
				pointColor: 'rgba(220,220,220,1)',//线条低谷和峰值的点色
				pointStrokeColor: '#fff',//线条低谷和峰值的点圆环色
				pointHighlightFill: '#fff',//鼠标移上线条低谷和峰值的点圆挂起（hover）色
				pointHighlightStroke: 'rgba(220,220,220,1)',//鼠标移上线条低谷和峰值的点圆挂起（hover）点圆环色
			},

		},
	],
	HardwareStatisticChartData: (successData = [], errorData = [], labels = [] ) => {
		return {
			HardwareStatisticChart: [
				{
					label: '失败数',
					fillColor: 'rgba(253,180,92,0.2)',
					strokeColor: 'rgba(253,180,92,1)',
					pointColor: 'rgba(220,220,220,1)',
					pointStrokeColor: '#fff',
					pointHighlightFill: '#fff',
					pointHighlightStroke: 'rgba(220,220,220,1)',
					data: errorData,

				},
				{
					label: '成功数',
					fillColor: 'rgba(151,187,205,0.2)',
					strokeColor: 'rgba(151,187,205,1)',
					pointColor: 'rgba(151,187,205,1)',
					pointStrokeColor: '#fff',
					pointHighlightFill: '#fff',
					pointHighlightStroke: 'rgba(151,187,205,1)',
					data: successData,

				},
			],
			labels
		};
	},

};
