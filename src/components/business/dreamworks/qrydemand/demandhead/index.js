'use strict';

import React, { PropTypes } from 'react';
import { Button, Col, Modal, Row, Table,Icon,Tabs,Input,Pagination } from 'antd';
import CommonHeadImg from 'business/dreamworks/widget/commonheadimg';
import ChatBtn from 'business/dreamworks/widget/ChatBtn';

export default class DemandHead extends React.Component{
	static propTypes = {
		type: PropTypes.number,
		bsnSrc: PropTypes.string.isRequired,
		dsnSrc: PropTypes.string,
		onImageClick: PropTypes.func,
		bsnDesc: PropTypes.string,
		dsnDesc: PropTypes.string,
		contactSrc: PropTypes.string,

	};
	static defaultProps = {
		type: 0,
		onImageClick: () => {},
		bsnDesc: '',
		dsnSrc: '',
		dsnDesc: '',
		contactSrc: ''
	};

	chatBtnHandler = (e) => {
		console.log(e,'功能未实现');
		alert('功能未实现在此版本中');
	};
	renderHead = () => {
		const { bsnSrc, dsnSrc, onImageClick,bsnDesc, dsnDesc,contactSrc } = this.props;
		return (<Row gutter={20}>
			<Col span={10}>
				<div className="item border">
					<img src={bsnSrc} alt="" onClick={() => onImageClick(bsnSrc)} />
					<span style={{ margin: '0 1em' }}>{bsnDesc}</span>
				</div>
			</Col>
			<Col span={4}>
				<div className="item">
					<img src={require('./signsuccessed.png')} alt=""  />
					{contactSrc.length?<a href={contactSrc}>签约合同</a>:null}
				</div>
			</Col>
			<Col span={10}>
				<div className="item border">
					<img src={dsnSrc} alt="" onClick={() => onImageClick(dsnSrc)} />
					<span style={{ margin: '0 1em' }}>{dsnDesc}</span>
					<ChatBtn onClick={this.chatBtnHandler} />
				</div>
			</Col>
		</Row>);
	};
	render(){
		const { bsnSrc, dsnSrc, onImageClick,bsnDesc, dsnDesc,type } = this.props;
		let content;
		switch (type){
			case 0:
			case 1:
			case 2:
			case 3:{
				content=(<CommonHeadImg src={bsnSrc} onImageClick={onImageClick} desc={bsnDesc} />);
				break;
			}
			case 4:
			case 5: {
				content= this.renderHead();
				break;
			}
		}
		return (
			<div className="demand-head">
				{content}
			</div>
		);
	}
}
