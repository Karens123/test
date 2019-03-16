import moment from 'moment';

export const createStatDeviceIncreChat = (
	beginTime, endTime, dailyStatDeviceIncreList) => {
	const labels = [];
	const increCntList = [];
	const totalCntList = [];
	const beginDayMoment = moment(beginTime);
	const endDayMoment = moment(endTime);
	for (let dayMoment = beginDayMoment; dayMoment.dayOfYear() <=
	endDayMoment.dayOfYear(); dayMoment.add(1, 'days')) {
		const beginDayStr = dayMoment.format('YYYYMMDD');
		let isFind = false;
		let increCnt = 0;
		let totalCnt = 0;
		if (dailyStatDeviceIncreList) {
			for (const index in dailyStatDeviceIncreList) {

				const record = dailyStatDeviceIncreList[index];
				if (moment(record.statDate).format('YYYYMMDD') ===
					beginDayStr) {
					isFind = true;
					increCnt = record.increCnt;
					totalCnt = record.totalCnt;
					break;
				}
			}

		}
		labels.push(beginDayStr);
		increCntList.push(increCnt);
		totalCntList.push(totalCnt);
	}
	return {
		increCntStat: {
			labels,
			datasets: [
				{
					fill: true,
					lineTension: 0.1,
					pointRadius: 1,
					pointHitRadius: 10,
					spanGaps: false,
					fillColor: 'rgba(151,187,205,0.2)',
					strokeColor: 'rgba(151,187,205,1)',
					pointColor: 'rgba(151,187,205,1)',
					data: increCntList,
				}],
		},
		totalCntStat: {
			labels,
			datasets: [
				{
					fill: true,
					lineTension: 0.1,
					pointRadius: 1,
					pointHitRadius: 10,
					spanGaps: false,
					fillColor: 'rgba(0, 0, 0, 0)',
					strokeColor: 'rgba(151,187,205,1)',
					pointColor: 'rgba(151,187,205,1)',
					data: totalCntList,
				}],
		},

	};
};

export const limit = () => {
	console.log(',,,');
};