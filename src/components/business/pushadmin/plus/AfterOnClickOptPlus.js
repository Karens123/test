'use strict';

import React, { PropTypes } from 'react';
import { Form, Input, Card, Icon, Cascader, Radio, Row, Col, Checkbox, Button, AutoComplete  } from 'antd';
import * as Immutable from 'immutable';

const RadioGroup = Radio.Group;
/**
 调用方式
 <AfterOnClickOptPlus
 deviceType={this.props.deviceType}
 AndroidOpenTypeProp={AndroidOpenTypeProp}
 androidOpenTypeValue={androidOpenTypeValue}
 IsCustomExtParamsProp={IsCustomExtParamsProp}
 isCustomExtParams={isCustomExtParams}
 customExtParamsItems={customExtParamsItems}
 AndroidActivityProp={AndroidActivityProp}
 AndroidOpenUrlProp={AndroidOpenUrlProp}
 getFieldDecoratorFn={getFieldDecorator}
 setFieldsValueFn={setFieldsValue}/>


 **/

const addKeyValue = (customExtParamsItems, setFieldsValueFn) => {
	if (customExtParamsItems && setFieldsValueFn) {
		customExtParamsItems = customExtParamsItems.concat(
			customExtParamsItems[customExtParamsItems.length - 1] + 1);
		setFieldsValueFn({ customExtParamsItems });
	}
};

const deleteKeyValue = (customExtParamsItems, delItem, setFieldsValueFn) => {
	if (customExtParamsItems && delItem, setFieldsValueFn) {
		customExtParamsItems = customExtParamsItems.filter((item) => {
			return item !== delItem;
		});
		setFieldsValueFn({ customExtParamsItems });
	}
};

class AfterOnClickOptPlus extends React.Component {
	static propTypes = {
		deviceType: PropTypes.number.isRequired,
		IsCustomExtParamsProp: PropTypes.object.isRequired,
		AndroidOpenTypeProp: PropTypes.object.isRequired,
		androidOpenTypeValue: PropTypes.string.isRequired,
		AndroidActivityProp: PropTypes.object.isRequired,
		AndroidOpenUrlProp: PropTypes.object.isRequired,
		isCustomExtParams: PropTypes.bool.isRequired,
		customExtParamsItems: PropTypes.object.isRequired,
		getFieldDecoratorFn: PropTypes.func.isRequired,
		setFieldsValueFn: PropTypes.func.isRequired,

	};

	constructor (props) {
		super(props);
		this.state = {
			iosOpenType: 'APPLICATION',
			value: '',
		};
	}


	onValueChange = (value) => {
		console.log('value_______________wl:', Immutable.Map(value).toJS());
		// console.log('Immutable.Map(value)', Immutable.Map(value));
		/*for (const itme in value){
			console.log('itme', itme);
			console.log('value', value);
		}*/
		this.setState({ value });
	};


	iosOpenTypeChange = (e) => {
		const iosOpenType = e.target.value;
		this.setState({ iosOpenType });
		const { getFieldDecoratorFn, setFieldsValueFn } = this.props;
		getFieldDecoratorFn('isIosAddOpenUrl',
			{ initialValue: false }

			);
		if (iosOpenType == 'URL') {
			getFieldDecoratorFn('extParamsKey_1', { initialValue: 'g_openUrl' });
			setFieldsValueFn({ isIosAddOpenUrl: true });
			setFieldsValueFn({ customExtParamsItems: [1] });
		} else {
			setFieldsValueFn({ isIosAddOpenUrl: false });
			setFieldsValueFn({ customExtParamsItems: [0] });
		}
	};

/*	const styleProps = getFieldDecorator('style', {
	initialValue: currentDiscoveryType.style,
	rules: [
		{
			whitespace: false,
			pattern: /^[0-9]{0,3}$/,
			message: '格式不合法: 只支持数字, 长度(1-3)位',
		},
	],
});*/

	renderIosOpenNode = () => {
		const { deviceType, getFieldDecoratorFn, customExtParamsItems, setFieldsValueFn, } = this.props;
		if (deviceType === '1') return;
		const activityItem = () => {
			const type = this.state.iosOpenType;
			switch (type) {
				case 'URL': {
					return (
						<Row>
							{getFieldDecoratorFn('extParamsValue_1')(
								<Input placeholder="请输入URL	" />,
							)},
						</Row>
					);
				}
				default:
					return null;
			}
		};
		return (
			<Row >{deviceType === '3' ? 'IOS' : ''}后续操作：&nbsp;&nbsp;
				<Row style={{ lineHeight: '32px' }} >
					<RadioGroup defaultValue="APPLICATION" onChange={this.iosOpenTypeChange} >
						<Radio value="APPLICATION" >打开应用</Radio>
						<Radio value="URL" >打开指定网页</Radio>
					</RadioGroup>
				</Row>
				<Row
					style={{
						lineHeight: '32px',
						height: '32px',
					}}
				>{activityItem()}</Row>
			</Row>
		);
	};

	renderAndroidOpenNode = () => {
		const { deviceType, androidOpenTypeValue, AndroidActivityProp, AndroidOpenUrlProp, AndroidOpenTypeProp } = this.props;
		if (deviceType === '0') return;
		const androidActivityItem = () => {
			const type = androidOpenTypeValue;
			switch (type) {
				case 'APPLICATION':
					return this.renderCustomExtParamsCb();
				case 'ACTIVITY':
					return (
						<Row>
							{AndroidActivityProp(
								<Input placeholder="请输入native" />,
							)}
						</Row>
					);
				case 'URL':
					return (
						<Row>
							{AndroidOpenUrlProp(
								<Input placeholder="请输入URL" />,
							)}
						</Row>
					);
				case 'NONE':
					return this.renderCustomExtParamsCb();
			}
		};
		return (
			<Row>
				<Row style={{ lineHeight: '32px' }} >{deviceType === '3'
					? 'Android'
					: ''}后续操作：&nbsp;&nbsp;
					{AndroidOpenTypeProp(
						<RadioGroup  >
							<Radio value="APPLICATION" >打开应用</Radio>
							<Radio value="ACTIVITY" >打开指定页面</Radio>
							<Radio value="URL" >打开指定网页</Radio>
							<Radio value="NONE" >无跳转逻辑</Radio>
						</RadioGroup>,
					)}
				</Row>
				<Row>{androidActivityItem()}</Row>
			</Row>
		);
	};

	renderCustomExtParamsCb = () => {
		const { IsCustomExtParamsProp } = this.props;
		if (IsCustomExtParamsProp) {
			return (
				<Row>自定义参数：&nbsp;&nbsp;
					{IsCustomExtParamsProp(
						<Checkbox />,
					)}
					<Row >{this.renderExtParamsItem()}</Row>
				</Row>
			);
		}
	};



	renderExtParamsItem = () => {
		const {
			isCustomExtParams, customExtParamsItems, setFieldsValueFn, getFieldDecoratorFn,
		} = this.props;

		if (isCustomExtParams && customExtParamsItems && setFieldsValueFn) {
			const customExtParamsItem = customExtParamsItems.map(
				(item) => {
					return (
						<Row key={item} >
							<Col span={10} >
								{
									getFieldDecoratorFn(`extParamsKey_${item}`, { maxLength: 2, })(<Input onChange={this.onValueChange} maxLength="50"  />,)
								}
							</Col>
							<Col span={1} >
								 &nbsp;
							</Col>
							<Col span={10} >
								{getFieldDecoratorFn(
									`extParamsValue_${item}`)(<Input maxLength="50"  />,)}
							</Col>
							<Col span={3} >
								{item ? <Button
									onClick={
										() => deleteKeyValue(
											customExtParamsItems,
											item,
											setFieldsValueFn)}
								>
									删除</Button> : ''
								}
							</Col>
						</Row>
					);
				},
			);

			return (
				<Row>
					<Row><Col span={12} >Key</Col><Col span={12} >Value</Col></Row>
					{customExtParamsItem}
					<Row>&nbsp;</Row>
					<Row>
						<Button
							onClick={() => {
								addKeyValue(customExtParamsItems,
									setFieldsValueFn);
							}}
						>
							<Icon type="plus" />添加Key-Value
						</Button>
					</Row>
				</Row>
			);
		}
	};

	render () {
		return (
			<Card title="点击通知后操作:" bordered={false} style={{ marginTop: '5px' }} >
				{this.renderIosOpenNode()}
				{this.renderAndroidOpenNode()}
			</Card>
		);
	}
}

export default AfterOnClickOptPlus;
