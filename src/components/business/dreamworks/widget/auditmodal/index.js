import React, { PropTypes } from 'react';
import { Button,Checkbox,Modal,Row,Col,Input } from 'antd';

export default class AuditModal extends React.Component{

	static propTypes = {
		modalType: PropTypes.number.isRequired,
		ifSendSms: PropTypes.number.isRequired,
		failReasonList: PropTypes.array.isRequired,
		visible: PropTypes.bool.isRequired,
		onCancel: PropTypes.func.isRequired,
		width: PropTypes.number,
		failTitle: PropTypes.string.isRequired,
		passTitle: PropTypes.string.isRequired,
		sendMsgHandler: PropTypes.func.isRequired,
		okHandler: PropTypes.func.isRequired,
		failHandler: PropTypes.func.isRequired,
		failTextareaHandler: PropTypes.func.isRequired,
		failCheckboxHandler: PropTypes.func.isRequired,
	};

	static defaultProps = {
		width: 640,
	};
	renderModalContent = () => {
		//弹窗内容控制0:不通过，1：通过
		const { modalType,ifSendSms,failReasonList,sendMsgHandler,okHandler,failHandler,failTextareaHandler,failCheckboxHandler } = this.props;
		switch (modalType){
			case 0:{
				const checkboxVal =failReasonList;
				return (
					<div>
						<Checkbox.Group
							onChange={failCheckboxHandler}
						>
							<Row>
								{(() => {
									const ret=[];
									for (let i=0,len=checkboxVal.length;i<len;i++){
										ret.push(<Col span={12}><Checkbox value={checkboxVal[i]}>{checkboxVal[i]}</Checkbox></Col>);
									}
									return ret;
								})()}
							</Row>
						</Checkbox.Group>
						<p>其他问题</p>
						<Input type="textarea" onChange={failTextareaHandler} />
						<div className="m-center">
							<Checkbox value={ifSendSms} onChange={sendMsgHandler}>是否发送短信提醒</Checkbox>
						</div>

						<div  style={{ display: 'flex',justifyContent: 'center' }}><Button onClick={failHandler}>确定</Button></div>
					</div>);
				break;
			}
			case 1:{
				return (<div>
					<h3 style={{ textAlign: 'center',margin: '100px 0' }}>确定通过审批？</h3>
					<div className="m-center">
						<Checkbox value={ifSendSms} onChange={sendMsgHandler}>是否发送短信提醒</Checkbox>
					</div>
					<div  style={{ display: 'flex',justifyContent: 'center' }}><Button onClick={okHandler}>确定</Button></div>
				</div>);
				break;
			}
		}

	};

	render(){
		const { modalType,visible,onCancel,width,failTitle,passTitle } = this.props;
		return (<Modal
			visible={visible}
			onCancel={onCancel}
			footer={null}
			width={width}
			title={modalType===0?failTitle:passTitle}
		>
			{this.renderModalContent()}
		</Modal>);
	}
}
