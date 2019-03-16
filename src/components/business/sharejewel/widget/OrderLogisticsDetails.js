'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Col, Row, Table, Tabs, Select, Pagination, Modal, Input, Form, Icon } from 'antd';
import { parseDate, parseDateTime } from 'utils/DateUtil';

const { TextArea } = Input;
class ExpressDetailPage extends React.Component {
	static propTypes = {
		params: PropTypes.string
	};
	static defaultProps = {
		init: undefined,
		params: undefined
	};

	constructor (props) {
		super(props);

		const stateObj = {
			bussinessName: props.params.buinessName,
			logisticsTradeNo: props.params.logisticsTradeNo,
			orderId: props.params.orderId,
		};
		this.state = stateObj;
		console.log('props________',props);
	}


	maskHandler = (e) => {
		window.history.back(-1);
		// window.location.replace(this.state.backurl);
	};

	render () {
		const img = 'http://via.placeholder.com/350x350';
		return (
			<div className="page page-express-detail transportation-detail" >
				{this.state.bussinessName && this.state.logisticsTradeNo && this.state.orderId ?
					<div className="default-relative" >
						<div className="mask default-absolute" onClick={this.maskHandler} > &nbsp;</div>
						<iframe
							src={`https://m.kuaidi100.com/index_all.html?type=${this.state.bussinessName}&postid=${this.state.logisticsTradeNo}&callbackurl=${this.state.orderId}`}
							frameBorder="0"
							scrolling="no"
							id="myiframe"
							width={'100%'}
							style={{ height: document.documentElement.clientHeight + document.body.scrollTop  }}
						>&nbsp;
						</iframe>
					</div> : <div className="text-center" style={{ padding: 20 }} >
						<p>暂无物流记录</p>
						<p  className="default-absolute"><a href={window.history.back(-1)} >返回</a></p>
					</div>   }
			</div>
		);
	}
}


const mapStateToProps = (state) => {
	const stateObje = {
		...state.get('RootService').toObject(),
		...state.get('OrderDetailReducer').toObject()
	};
	return stateObje;
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpressDetailPage);
