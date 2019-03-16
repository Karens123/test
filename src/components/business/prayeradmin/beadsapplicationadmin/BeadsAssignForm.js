'use strict';

import React from 'react';
import {Button, Modal, Form, Input, Radio, Row, Col, Select} from 'antd';
import * as DateUtil from 'utils/DateUtil';
import LogisticsConfig from 'res/LogisticsConfig';

const FormItem = Form.Item;
const Option = Select.Option;

export default Form.create()(
	class extends React.Component {
		renderSelect = () => {
			const currentItem = [];
			for (const value in LogisticsConfig) {
				const config = LogisticsConfig[value];
				currentItem.push(<Option value={value}>{config.label}</Option>);
			}
			return currentItem;
		};

		render() {
			const {application, visible, onCancel, onSubmit, form} = this.props;
			if (!visible) {
				return null;
			}
			const currentApplication = application || {};
			const {getFieldDecorator, getFieldValue} = form;
			const logisticsModeDecorator = getFieldDecorator('logisticsMode', {
				initialValue: 1,
			});
			const logisticsMode = getFieldValue('logisticsMode');
			const ifShowLogisticsOption = logisticsMode === 1;

			const bussinessName = getFieldValue('bussinessName');
			if (!!bussinessName) {
				getFieldDecorator('logisticsBussiness',
					{initialValue: LogisticsConfig[bussinessName].logisticsBussiness});
			}
			return (
				<Modal
					visible={visible}
					title="佛珠分配"
					onCancel={onCancel}
					footer={[
						<Button
							key="back"
							onClick={onCancel}
						>取消
						</Button>,
						<Button key="submit" type="primary"
								onClick={onSubmit}>提交</Button>,
					]}
				>
					<Form>

						<Row gutter={24}>
							<Col span={12}>
								<FormItem label="申请id">
									{getFieldDecorator('applicationId', {
										initialValue: currentApplication.applicationId,
										rules: [
											{
												required: true,
											}],
									})(
										<Input disabled/>,
									)}
								</FormItem>
							</Col>
							<Col span={12}>
								<FormItem label="申请时间">
									{getFieldDecorator('createTime', {
										initialValue: DateUtil.parseDateTime(
											currentApplication.createTime),
										rules: [
											{
												required: true,
											}],
									})(
										<Input disabled/>,
									)}
								</FormItem>
							</Col>
						</Row>
						<Row gutter={24}>
							<Col span={12}>
								<FormItem label="申请人">
									{getFieldDecorator('wenwenId', {
										initialValue: currentApplication.wenwenId,
										rules: [
											{
												required: true,
											}],
									})(
										<Input disabled/>,
									)}
								</FormItem>
							</Col>
							<Col span={12}>
								<FormItem label="订单id">
									{getFieldDecorator('orderId', {
										initialValue: currentApplication.orderId,
										rules: [
											{
												required: true,
											}],
									})(
										<Input disabled/>,
									)}
								</FormItem>
							</Col>
						</Row>
						<FormItem label="分配的吻吻序列号">
							{getFieldDecorator('wenwenSn', {
								initialValue: '',
								rules: [
									{
										required: true,
										message: '请输入分配的吻吻序列号',
									}],
							})(
								<Input/>,
							)}
						</FormItem>
						<FormItem label="物流方式"
								  className="collection-create-form_last-form-item">
							{logisticsModeDecorator(
								<Radio.Group>
									<Radio value={0}>不配送</Radio>
									<Radio value={1}>快递运输</Radio>
									<Radio value={2}>上门自提</Radio>
								</Radio.Group>,
							)}
						</FormItem>
						{
							ifShowLogisticsOption && [
								<FormItem label="物流商"
										  className="collection-create-form_last-form-item">
									{getFieldDecorator('bussinessName', {
										initialValue: 'wenwenLogisitics',
										rules: [
											{
												required: ifShowLogisticsOption,
												message: '请选择物流商',
											}],
									})(
										<Select>
											{this.renderSelect()}
										</Select>,
									)}
								</FormItem>,
								<FormItem label="物流单号">
									{getFieldDecorator('logisticsTradeNo', {
										initialValue: '',
										rules: [
											{
												required: ifShowLogisticsOption,
												message: '请输入物流单号',
											}],
									})(
										<Input/>,
									)}
								</FormItem>,
							]
						}
					</Form>
				</Modal>
			);
		}
	},
);