'use strict';

import React, { PropTypes } from 'react';
import { Radio, Row } from 'antd';
import PanelBox from 'framework/components/PanelBox';

const RadioGroup = Radio.Group;

class IosEnvPlus extends React.Component {
	static propTypes = {
		deviceType: PropTypes.string.isRequired,
		ApnsEnvProp: PropTypes.object.isRequired,
		style: PropTypes.object.isRequired,
	};

	render () {
		const { deviceType, ApnsEnvProp, style } = this.props;
		const customStyle = Object.assign({}, style, { marginTop: '10px' });
		if (deviceType !== '1') {
			return (
				<PanelBox title="IOS推送环境(必填)" style={customStyle} >
					<Row >
						{ApnsEnvProp(
							<RadioGroup >
								<Radio value="DEV" >开发环境</Radio>
								<Radio value="PRODUCT" >生产环境（访问81只能选择这个）</Radio>
							</RadioGroup>,
						)}
					</Row>
				</PanelBox>
			);
		}
		return <div />;
	}
}

export default IosEnvPlus;
