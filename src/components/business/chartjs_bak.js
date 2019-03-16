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



	UseStatisticChartData: ( tabValue, chartArray,increCntArray=[],unbindCntArray=[],netIncreCntArray=[],totalCntArray=[], dayLabel ) => {
		let increCntData=[];
		let unbindCntData=[];
		let netIncreCntData=[];
		let totalCntData=[];

		if ( tabValue ==='increCnt' ) {
			increCntData=[...chartArray];
			unbindCntData=0;
			netIncreCntData=0;
			totalCntData=0;

		 } else if ( tabValue ==='unbindCnt' ) {
			unbindCntData=[...chartArray];
			increCntData=0;
			netIncreCntData=0;
			totalCntData=0;
		 } else if ( tabValue ==='netIncreCnt' ) {
			 netIncreCntData=[...chartArray];
			increCntData=[];
			unbindCntData=[];
			totalCntData=[];
		 } else if ( tabValue ==='totalCnt' ) {
			totalCntData=[...chartArray];
			increCntData =[];
			unbindCntData =[];
			netIncreCntData=[];
		 } else if ( tabValue ==='' ) {
		}

		return {
			increCnt_UseStatisticChart: {
				dataset: [
					{
						label: '每日新增数',
						fillColor: 'rgba(253,180,92,0.2)',
						strokeColor: 'rgba(253,180,92,1)',
						pointColor: 'rgba(220,220,220,1)',
						pointStrokeColor: '#fff',
						pointHighlightFill: '#fff',
						pointHighlightStroke: 'rgba(220,220,220,1)',
						data: increCntData,
					}
				],
				dayLabel
			},
			unbindCnt_UseStatisticChart: {
				dataset: [
					{
						label: '每日解绑数',
						fillColor: 'rgba(151,187,205,0.2)',
						strokeColor: 'rgba(151,187,205,1)',
						pointColor: 'rgba(151,187,205,1)',
						pointStrokeColor: '#fff',
						pointHighlightFill: '#fff',
						pointHighlightStroke: 'rgba(151,187,205,1)',
						data: unbindCntData,
					}
				],
				dayLabel
			},
			netIncreCnt_UseStatisticChart: {
				dataset: [
					{
						label: '每日净增数',
						fillColor: 'rgba(70,191,189,0.2)',
						strokeColor: 'rgba(70,191,189,1)',
						pointColor: 'rgba(70,191,189,1)',
						pointStrokeColor: '#fff',
						pointHighlightFill: '#fff',
						pointHighlightStroke: 'rgba(151,187,205,1)',
						data: netIncreCntData,
					}
				],
				dayLabel
			},
			totalCnt_UseStatisticChart: {
				dataset: [
					{
						label: '每日累计数',
						fillColor: 'rgba(70,191,189,0.2)',
						strokeColor: 'rgba(70,191,189,1)',
						pointColor: 'rgba(70,191,189,1)',
						pointStrokeColor: '#fff',
						pointHighlightFill: '#fff',
						pointHighlightStroke: 'rgba(151,187,205,1)',
						data: totalCntData,
					}
				],
				dayLabel
			},
			all_UseStatisticChart: {
				dataset: [
					{
						label: '每日新增数',
						fillColor: 'rgba(253,180,92,0.2)',
						strokeColor: 'rgba(253,180,92,1)',
						pointColor: 'rgba(220,220,220,1)',
						pointStrokeColor: '#fff',
						pointHighlightFill: '#fff',
						pointHighlightStroke: 'rgba(220,220,220,1)',
						data: increCntArray,
					},
					{
						label: '每日解绑数',
						fillColor: 'rgba(151,187,205,0.2)',
						strokeColor: 'rgba(151,187,205,1)',
						pointColor: 'rgba(151,187,205,1)',
						pointStrokeColor: '#fff',
						pointHighlightFill: '#fff',
						pointHighlightStroke: 'rgba(151,187,205,1)',
						data: unbindCntArray,
					},
					{
						label: '每日净增数',
						fillColor: 'rgba(70,191,189,0.2)',
						strokeColor: 'rgba(70,191,189,1)',
						pointColor: 'rgba(70,191,189,1)',
						pointStrokeColor: '#fff',
						pointHighlightFill: '#fff',
						pointHighlightStroke: 'rgba(151,187,205,1)',
						data: netIncreCntArray,
					},
					{
						label: '每日累计数',
						fillColor: 'rgba(70,191,189,0.2)',
						strokeColor: 'rgba(70,191,189,1)',
						pointColor: 'rgba(70,191,189,1)',
						pointStrokeColor: '#fff',
						pointHighlightFill: '#fff',
						pointHighlightStroke: 'rgba(151,187,205,1)',
						data: totalCntArray,
					}
				],
			}

		};
	}


};
