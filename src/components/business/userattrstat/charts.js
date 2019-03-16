import moment from 'moment';
import echarts from 'echarts';
import chinaJson from 'framework/data/china.json';

echarts.registerMap('china', chinaJson);

export const getCountryOption = (countryStatUserAttrList = []) => {
	if (!countryStatUserAttrList) {
		countryStatUserAttrList = [];
	}
	return {
		title: {
			text: '用户国家属性统计',
			x: 'center',
		},
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b} : {c} ({d}%)',
		},
		legend: {
			x: 'center',
			y: 'bottom',
			data: ['用户数'],
			height: '100%'
		},
		toolbox: {
			show: true,
			feature: {
				dataView: { show: true, readOnly: false },
				saveAsImage: { show: true },
			},
		},
		calculable: true,
		series: [
			{
				name: '用户数',
				type: 'pie',
				radius: '75%',
				center: ['50%', '50%'],
				roseType: 'area',
				data: countryStatUserAttrList.map((item) => {
					const { cnt, attrValue } = item;
					return {
						value: cnt,
						name: !attrValue || attrValue.length < 1
							? '未知'
							: attrValue,
					};
				}),
			},
		],
	};
};
export const nofunc = () => {

};