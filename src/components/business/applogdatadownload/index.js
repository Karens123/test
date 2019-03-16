'use strict';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Input } from 'antd';
import FileDownload from 'framework/components/FileDownload';

import * as Constant from 'utils/Constant';

class AppStaticResAdmin extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		rspInfo: PropTypes.object,
		actionType: PropTypes.string,
	};

	static defaultProps = {
		rspInfo: undefined,
		actionType: '',
	};

	constructor (props) {
		super(props);
		this.state = { isDownload: false };
	};

	componentWillMount () {
	}

	componentWillReceiveProps (nextProps) {
	};

	wenwenIdChange = (e) => {
		this.setState({ wenwenId: e.target.value });
	};

	download = () => {
		this.setState({ isDownload: true });
	};

	downloadComplete = () => {
		this.setState({ isDownload: false });
	};

	renderForm = () => {
		const { isDownload, wenwenId } = this.state;
		console.log('isDownload', isDownload);
		console.log('wenwenId', wenwenId);
		const baseApiUrl = Constant.WENWEN_BASE_API;
		console.log('baseApiUrl', baseApiUrl);
		return (
			isDownload && <FileDownload
				actionPath={`${baseApiUrl}/admin/data/downloadAppLogData`}
				method="POST"
				queryParams={{ wenwenId }}
				onDownloadComplete={this.downloadComplete}
			/>
		);
	};

	render () {
		return (
			<div>
				<Row>
					<Col span={6} >
						<Input
							placeholder="请输入wenwenId"
							onChange={this.wenwenIdChange}
						/>
					</Col>
					<Col span={12} >
						<Button onClick={this.download} >
							download
						</Button>
					</Col>
				</Row>
				{this.renderForm()}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AppStaticResAdmin);
