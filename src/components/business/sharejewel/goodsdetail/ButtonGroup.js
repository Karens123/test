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


export default class ButtonGroup extends React.Component {
	render(){
		return (<div>a</div>);
	}
}