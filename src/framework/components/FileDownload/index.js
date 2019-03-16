'use strict';

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class FileDownload extends Component {

	static propTypes = {
		actionPath: PropTypes.string.isRequired,
		method: PropTypes.string,
		onDownloadComplete: PropTypes.func.isRequired,
		queryParams: PropTypes.object,
	};

	static defaultProps = {
		method: 'GET',
		queryParams: {},
	};

	/*eslint-disable react/no-find-dom-node*/
	componentDidMount () {
		ReactDOM.findDOMNode(this).submit();
		this.props.onDownloadComplete();
	}

	getFormInputs = () => {
		const { queryParams } = this.props;

		if (queryParams === undefined) {
			return null;
		}

		return Object.keys(queryParams).map((name, index) => {
			return (
				<input
					key={index}
					name={name}
					type="hidden"
					value={queryParams[name]}
				/>
			);
		});
	};

	render () {
		const { actionPath, method } = this.props;

		return (
			<form
				action={actionPath}
				className="hidden"
				method={method}
			>
				{this.getFormInputs()}
			</form>
		);
	}
}