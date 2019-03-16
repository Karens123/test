import React, { PropTypes } from 'react';
import { Button } from 'antd';

export default class PassButtonGroup extends React.Component{

	static propTypes = {
		passHandler: PropTypes.func.isRequired,
		failHandler: PropTypes.func.isRequired,

	};

	render(){
		const { passHandler,failHandler } = this.props;
		return (<div className="btn-group" style={{ display: 'flex',justifyContent: 'center', margin: '50px' }}>
			<Button type="danger" size={'large'} onClick={failHandler} >不通过</Button>
			<span style={{ display: 'inline-block',width: '30px' }} />
			<Button type="primary" size={'large'} onClick={passHandler} >通过</Button>
		</div>);
	}
}
