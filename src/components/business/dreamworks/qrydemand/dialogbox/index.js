'use strict';

import React, { PropTypes } from 'react';
import ZoomImage from 'business/dreamworks/widget/zoomimage';
import DialogboxButton from './dialogboxButton';

export default class DialogBox extends React.Component{

	static propTypes ={
		data: PropTypes.array.isRequired,
		onImageClick: PropTypes.func,
	};
	static defaultProps = {
		onImageClick: () => {},
	};
	remindConfirm = () => {};
	confirmHandler = () => {};
	renderDialog = () => {
		const { data } = this.props;
		const ret =[];
		data.map((val) => {
			ret.push(<div>
				<p style={{ position: 'relative' }}>
					<i className={`${val.type==='0'?'business':'designer'} decoration`} />
					<span  style={val.type==='0'?{ color: '#ffaa00' }:null}>{val.name}</span> {val.date}
				</p>
				<p>备注：{val.text}</p>
				{val.images?<p>
					<div style={{ display: 'flex',flexWrap: 'wrap',justifyContent: 'left',alignItems: 'center',paddingLeft: '20px' }}>
						{this.renderImgList(val.images)}
					</div>
				</p>:null}
			</div>);
		});
		return ret;
	};
	renderImgList = (list=[]) => {
		const ret=[];
		list.map((val) => {
			ret.push(
				<div style={{ width: '200px', height: '200px',margin: '10px', boxSizing: 'border-box',border: '1px solid #eee' }}>
					<ZoomImage width={200} height={200} url={val} zooming coefficient={0.95} onImageClick={this.props.onImageClick} />
				</div>
			);
		});
		return ret;
	};

	render () {
		return (<div className="dialog-box">
			<div style={{ display: 'flex',justifyContent: 'space-between',alignItems: 'center' }}>
				<h3>订单进度</h3>
				<DialogboxButton remindConfirm={this.remindConfirm} confirmHandler={this.confirmHandler} />
			</div>

			<div style={{ borderLeft: '1px solid #eee' }}>
				<div style={{ position: 'relative',textIndent: '2em' }}>
					{this.renderDialog()}
				</div>
			</div>
		</div>);
	}


}