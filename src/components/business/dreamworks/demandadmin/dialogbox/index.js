'use strict';

import React, { PropTypes } from 'react';
import ZoomImage from 'business/dreamworks/widget/zoomimage';
import { Col, Row, Table, Tabs, Select, Pagination } from 'antd';
import * as DateUtil from 'src/utils/DateUtil';

import DialogboxButton from './dialogboxButton';

export default class DialogBox extends React.Component{

	static propTypes ={
		data: PropTypes.array.isRequired,
		allDemandList: PropTypes.array.isRequired,
		onImageClick: PropTypes.func,
		reMinderBuinessConfirm: PropTypes.func,
		confirmComplete: PropTypes.func,
		deviceType: PropTypes.number,

	};
	static defaultProps = {
		onImageClick: () => {},
		reMinderBuinessConfirm: () => {
		},
		confirmComplete: () => {
		},
		deviceType: ''
	};
	constructor(props) {
		super(props);
		this.state = {
			CurrentPage: '1',
			pageSize: 10,
			total: ''
		};
	}

	remindConfirm = () => {
		this.props.reMinderBuinessConfirm();
	};
	confirmHandler = () => {
		this.props.confirmComplete();
	};
	renderDialog = () => {
		const { data,allDemandList } = this.props;
		const designerWenwenId=allDemandList && allDemandList.record ? allDemandList.record.designer.wenwenId : '';

		let Identity='business';
		const CurrentData=[];
		CurrentData.push(...data);
		const ret =[];
		CurrentData.map((val) => {
			if (val.sender.wenwenId == designerWenwenId ) {
				Identity='designer';
			}
			ret.push(<div>
				<p style={{ position: 'relative' }}>
					<i className={`${Identity==='designer'?'designer':'business'} decoration`} />
					<span  style={val.type==='0'?{ color: '#ffaa00' }:null}>{val.sender.nick}</span> {DateUtil.parseDateTime(val.createTime)}
				</p>
				<p>备注：{val.content}</p>
				{val.attachmentList?<p>
					<div style={{ display: 'flex',flexWrap: 'wrap',justifyContent: 'left',alignItems: 'center',paddingLeft: '20px' }}>
						{this.renderImgList(val.attachmentList)}
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
					<ZoomImage width={200} height={200} url={val.attachment} zooming coefficient={0.95} onImageClick={this.props.onImageClick} />
				</div>
			);
		});
		return ret;
	};

	render () {
		const { data,allDemandList,reMinderBuinessConfirm } = this.props;
		const { CurrentPage } = this.state;
		return (<div className="dialog-box">
			<div style={{ display: 'flex',justifyContent: 'space-between',alignItems: 'center' }}>
				<h3>订单进度</h3>
				<DialogboxButton
					remindConfirm={this.remindConfirm}
					confirmHandler={this.confirmHandler}
					deviceType={this.props.deviceType}
				/>
			</div>
			<div style={{ borderLeft: '1px solid #eee' }}>
				<div style={{ position: 'relative',textIndent: '2em' }}>
					{this.renderDialog()}
				</div>
			</div>
		</div>
		);
	}
}