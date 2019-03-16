'use strict';

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Button, Table, Icon, Input, Modal, Select, Tabs, Card, notification } from 'antd';

import * as businessRoute from 'business/route';
import * as Constant from 'utils/Constant';
import * as MsgUtil from 'utils/MsgUtil';
import ShowWaitingEvent from  './WaitingEditEvent';
import './index.less';

const Option = Select.Option;
const TabPane = Tabs.TabPane;

class Index extends React.Component {
	//检验类型
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		// jewelInfoList: PropTypes.array,
	};

	static defaultProps = {
	};

	constructor (props) {
		super(props);

		this.state = {
			toggle: true,
			currentTime: ''
		};
	}

	componentWillMount () {
		const date = new Date();
		const seperator1 = '-';
		const seperator2 = ':';
		let month = date.getMonth() + 1;
		let strDate = date.getDate();
		if (month >= 1 && month <= 9) {
			month = `0${month}`;
		}
		if (strDate >= 0 && strDate <= 9) {
			strDate = `0${strDate}`;
		}
		const currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
		this.setState({
			currentdate
		});
	}

	//每次更新时被调用
	componentDidUpdate () {
	}

	callback = (key) => {
		console.log(key);
	};
	handleClose = () => {
		this.setState({
			toggle: !this.state.toggle
		});
	};

	handleAert = (type) => {
		notification[type]({
			message: '温馨提醒',
			description: '功能开发中！',
		});
	};

	render () {
		const { toggle, currentdate } = this.state;
		notification.config({
			placement: 'bottomRight ',
			top: 420,
			duration: 3,
		});

		const inLineGlobalCss = ({
			gapHeight: {
				height: '10px'
			},
			waitEvent: {
				padding: '15px'
			},
			close: {
				cursor: 'pointer'
			},
			lastUsePord: {
				padding: '30px 15px 0px'
			}

		});

		const waitingEvent = (
			<div style={inLineGlobalCss.waitEvent}>
				<img src={require('framework/views/images/main_07.png')} width="100%" />
				<ShowWaitingEvent />
			</div>
		);
		const banner = (toggle) => {
			if (toggle) {
				return (
					<Col className="banner" >
						<p className="editBtn" >
							<Icon type="close" style={inLineGlobalCss.close} onClick={this.handleClose} /><br />
							今天是：{this.state.currentdate} &nbsp;&nbsp;&nbsp; &nbsp;
						</p>
						<header className="title" >【吻吻后台】 —— 数据运维、分析、统计专业平台</header>
						<article>
							全球最新技术开发、安全稳定平台。通过平台全面掌握APP的各项各数据，随时查询设备健康运作情况。秉承为用户创造价值，与行业共赢目标，为商家提供全业务链数据和解决方案，其主要功能包括统计分析、运营分析、数据配置、消息管理，设备管理、产品配置等等实现对APP配制管理和大数据分析于合为一体的系统。
						</article>
					</Col>
				);
			}
		};

		const LastUseProdHeader = () => {
			return (
				<header><span className="operLog" onClick={() => this.handleAert('info')} ><i className="CloseFontStyle" ><Icon type="clock-circle-o" /> 操作日志</i></span> 最近使用的产品</header>
			);
		};

		const LastUseProdList = (
			<div style={inLineGlobalCss.lastUsePord} >
				<Col span={7} className="ProdList">1</Col><Col span={1}>&nbsp;</Col>
				<Col span={7} className="ProdList">2</Col><Col span={1}>&nbsp;</Col>
				<Col span={7} className="ProdList">3</Col><Col span={1}>&nbsp;</Col>
			</div>
		);

		return (
			<div>
				<Row className="home" >
					{banner(toggle)}
				</Row>
				<Row style={inLineGlobalCss.gapHeight} >&nbsp;</Row>

				<Row>
					<Col className="leftStatic" >
						<div className="TabPane" style={{ height: '340px' }} >
							<Tabs defaultActiveKey="1" onChange={this.callback} >
								<TabPane tab="新增用户" key="1" >
									<div className="tabCont" >
										<img
											src={require('framework/views/images/temp.png')}

										/>
									</div>
								</TabPane>
								<TabPane tab="在线用户" key="2" >
									<div className="tabCont" >2</div>
								</TabPane>
								<TabPane tab="模块统计" key="3" >
									<div className="tabCont" >3</div>
								</TabPane>
							</Tabs>
						</div>
					</Col>

					<Col className="gap">&nbsp;</Col>

					<Col className="RightStatic" >
						<div className="TabPane blk" style={{ height: '340px' }} >
							<div className="title" >待办事项</div>
							{waitingEvent}
						</div>
					</Col>

				</Row>

				<Row style={{ height: 20 }} >&nbsp;</Row>
				<Row>
					<Col className="leftStatic" >
						<div className="TabPane LastUseProd" style={{ height: '200px' }} >
							{LastUseProdHeader()}
							{LastUseProdList}
						</div>
					</Col>
					<Col className="gap" >&nbsp;</Col>
					<Col className="RightStatic">
						<div className="TabPane msg" style={{ height: '200px' }}>
							<Tabs defaultActiveKey="1" onChange={this.callback}>
								<TabPane tab="全部公告" key="1">
									<div className="tabCont" >0</div>
								</TabPane>
								<TabPane tab="系统公告" key="2" >
									<div className="tabCont" >2</div>
								</TabPane>
								<TabPane tab="商家通知" key="3" >
									<div className="tabCont" >3</div>
								</TabPane>
							</Tabs>
						</div>
					</Col>
				</Row>
			</div>

		);
	}
}

export default Index;
