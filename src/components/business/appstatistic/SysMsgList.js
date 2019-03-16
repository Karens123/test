'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from 'action';
import * as MsgUtil from 'utils/MsgUtil';

class SysMsgList extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static propTypes = {
		sysMsg: PropTypes.object,
		rspInfo: PropTypes.object,
		refreshData: PropTypes.object,
		actions: PropTypes.object.isRequired,
	}
	static defaultProps = {
		sysMsg: undefined,
		rspInfo: undefined,
		refreshData: undefined,
	}

	constructor (props, context) {
		super(props, context);
		this.state = {
			ApptionType: '',
		};
	}

	//只是第一次render之后被调用
	componentDidMount () {
		const { actions, rspInfo, refreshData } = this.props;
		actions.sysMsg();
	}

	//每次更新时被调用
	componentDidUpdate () {
		const { actions, rspInfo, refreshData } = this.props;
		if (rspInfo && rspInfo.resultCode != 0) {
			MsgUtil.showwarning(
				`查询失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
		}
	}

	render () {
		const { sysMsg } = this.props;
		const MegList = sysMsg.map(item =>
			<div className="msglist" >
				<p className="msgtitle" >{`${item.key} 、${item.title}`}</p>
				<p>{item.msgCont}</p>
			</div>,
		);
		return (
			<div>
				{MegList}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { rspInfo } = state.get('RootService').toObject();
	const { sysMsg, refreshData } = state.get('appStatistic').toObject();
	return {
		rspInfo,
		refreshData,
		sysMsg,
	};
};

const mapDispatchToProps = (dispatch) => {
	const { sysMsg } = actions;
	return {
		actions: bindActionCreators({ sysMsg }, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(SysMsgList);
