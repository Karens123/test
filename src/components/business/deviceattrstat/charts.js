import moment from 'moment';
import echarts from 'echarts';
import chinaJson from 'framework/data/china.json';

echarts.registerMap('china', chinaJson);

export const getCountryOption = (countryStatDeviceAttrList = {}) => {
	let { statDeviceActivationNumList } = countryStatDeviceAttrList;
	if (!statDeviceActivationNumList) {
		statDeviceActivationNumList = [];
	}
	return {
		title: {
			text: '设备国家属性统计',
			x: 'center',
		},
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b} : {c} ({d}%)',
		},
		legend: {
			x: 'center',
			y: 'bottom',
			data: ['激活数'],
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
				name: '激活数',
				type: 'pie',
				radius: '75%',
				center: ['50%', '50%'],
				roseType: 'area',
				data: statDeviceActivationNumList.map((item) => {
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

export const getCnProvinceOption = (statDeviceCnProvinceAttr = {}) => {
	let { statDeviceActivationNumList } = statDeviceCnProvinceAttr;
	if (!statDeviceActivationNumList) {
		statDeviceActivationNumList = [];
	}
	const dataMap = {};
	statDeviceActivationNumList.map((item) => {
		const { attrValue, cnt } = item;
		let province;
		if (attrValue) {
			let index = attrValue.indexOf('省');

			if (index === -1) {
				index = attrValue.indexOf('市');
			}
			if (index > -1) {
				province = attrValue.substring(0, index);
			} else {
				province = attrValue;
			}
		} else {
			province = '未知';
		}
		if (dataMap[province] === undefined) {
			dataMap[province] = Number(cnt);
		} else {
			dataMap[province] = dataMap[province] + Number(cnt);
		}
	});

	const activationNumData = [];
	let maxCnt = 0;
	for (const province in dataMap) {
		activationNumData.push({ name: province, value: dataMap[province] });
		if (dataMap[province] > maxCnt) {
			maxCnt = dataMap[province];
		}
	}
	return {
		title: {
			text: '国内省份属性统计',
			left: 'center',
		},
		tooltip: {
			trigger: 'item',
		},
		legend: {
			orient: 'vertical',
			top: 50,
			right: 'right',
			data: ['激活数'],
		},
		visualMap: {
			min: 0,
			max: (maxCnt + (maxCnt * 0.2)),
			left: 'left',
			top: 'bottom',
			text: ['高', '低'],           // 文本，默认为数值文本
			calculable: true,
		},
		toolbox: {
			show: true,
			feature: {
				dataView: { show: true, readOnly: false },
				saveAsImage: { show: true },
			},
		},
		series: [
			{
				name: '激活数',
				type: 'map',
				mapType: 'china',
				label: {
					normal: {
						show: true,
					},
					emphasis: {
						show: true,
					},
				},
				data: activationNumData,
			},
		],
	};
};
export const getCnCityOption = (statDeviceCnCityAttr = {}) => {
	let { statDeviceActivationNumList } = statDeviceCnCityAttr;
	if (!statDeviceActivationNumList) {
		statDeviceActivationNumList = [];
	}
	const dataMap = {};
	statDeviceActivationNumList.map((item) => {
		const { attrValue, cnt } = item;
		let city;
		if (attrValue) {
			const index = attrValue.indexOf('市');
			if (index > -1) {
				city = attrValue.substring(0, index);
			} else {
				city = attrValue;
			}
		} else {
			city = '未知';
		}
		if (dataMap[city] === undefined) {
			dataMap[city] = Number(cnt);
		} else {
			dataMap[city] = dataMap[city] + Number(cnt);
		}
	});

	const yAxisData = [];
	const activationNumData = [];
	for (const city in dataMap) {
		if (yAxisData.indexOf(city) === -1) {
			yAxisData.push(city);
		}
		activationNumData.push([dataMap[city], city]);
		// activationNumData.push({ value: dataMap[city], name: city });
	}
	return {
		title: {
			text: '国内城市属性统计',
			left: 'center',
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {            // 坐标轴指示器，坐标轴触发有效
				type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			},
			formatter: (params) => {
				return params[0].value[0];
			},
		},
		legend: {
			orient: 'vertical',
			top: 40,
			right: true,
			data: ['激活数'],
		},
		toolbox: {
			show: true,
			feature: {
				dataView: { show: true, readOnly: false },
				saveAsImage: { show: true },
			},
		},
		grid: {
			left: '3%',
			right: '10%',
			bottom: '3%',
			containLabel: true,
		},
		xAxis: {
			type: 'value',
		},
		yAxis: {
			type: 'category',
			data: yAxisData.reverse(),
		},
		series: [
			{
				name: '激活数',
				type: 'bar',
				label: {
					normal: {
						show: true,
						position: 'insideRight',
						formatter: (params) => {
							return params.value[0];
						},
					},
				},
				data: activationNumData,
			},
		],
	};
};
