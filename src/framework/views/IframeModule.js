'use strict';

import React, { PropTypes } from 'react';
import $ from 'jquery';

class IframeModule extends React.Component {
	static propTypes = {
		params: PropTypes.object.isRequired,
	};

	render () {
		//兼容ff浏览器height为100%
		const windHeight = $(window).height() - 150;
		const { params } = this.props;
		const currentUrl = decodeURIComponent(params.address);
		return (
			<div>
				<iframe
					src={currentUrl}
					frameBorder="0"
					id="mainframe"
					width="100%"
					height={windHeight}
					style={{ border: 'none' }}
				/>
			</div>
		);
	}
}
export default IframeModule;

