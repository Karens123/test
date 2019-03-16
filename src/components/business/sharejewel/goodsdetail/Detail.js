'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Col, Row, Table, Tabs, Select, Pagination, Modal, Input, Form, Icon } from 'antd';
import { parseDate, parseDateTime } from 'utils/DateUtil';
import * as MsgUtil from 'utils/MsgUtil';
import * as DateUtil from 'src/utils/DateUtil';
import * as WidgetUtil from 'utils/WidgetUtil';
import businessRoute from 'business/route';
import Editor from 'business/sharejewel/widget/editor/Editor';


export default class Detail extends React.Component {
	static propTypes = {
		hook: PropTypes.func.isRequired,
		editingHandler: PropTypes.func.isRequired,
		initData: PropTypes.string.isRequired,
		isEditing: PropTypes.bool.isRequired,
	};
	constructor (props){
		super(props);
		this.state={
			dirty: false,
		};
	}
	componentWillReceiveProps(nextProps){
		if (nextProps.isEditing!==this.props.isEditing){
			this.setState({
				dirty: true,
			});
		}
	}
	render(){
		const { hook,editingHandler,initData,isEditing } = this.props;
		const { dirty } =this.state;
		return (<Row>
			<Col span={2}>
				<p className="text-center">商品详情</p>
				{dirty? <p className="">{isEditing? '编辑中': '已保存' }</p>:null}
				<p style={{ color: 'red' }}><b>批量上传图片时，需要确认图片排序是否正确</b></p>
			</Col>
			<Col span={22}>
				<Editor
					initData={initData}
					getResult={hook}
					editingHandler={editingHandler}
					zIndex={2}
				/>
			</Col>
		</Row>);
	}
}