'use strict';

export const filter = (list=[],key,filter) => {
	const ret=[];
	list.map((val) => {
		if (val[key]==filter){
			ret.push(val);
		}
	});
	return ret;
};
export const filter2 = (list=[],key,key2,filter) => {
	const ret=[];
	list.map((val) => {
		if (val[key]==filter){
			ret.push(val[key2]);
		}
	});
	return ret;
};
export const setComponentState = (Component,key,val,cb) => {
	Component.setState && Component.setState({
		[key]: val,
	},cb&&cb());
};
export const getTrueCost = (cost) => {
	return (cost/100).toFixed(2);
};