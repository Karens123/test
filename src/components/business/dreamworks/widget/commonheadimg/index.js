'use strict';

import React, { PropTypes } from 'react';

export default class CommonHeadImg extends React.Component{
	static propTypes = {
		src: PropTypes.string.isRequired,
		onImageClick: PropTypes.func,
		desc: PropTypes.string,
	};
	static defaultProps = {
		onImageClick: () => {},
		desc: ''
	};
	render(){
		const { src,onImageClick,desc } = this.props;
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<img
					style={{ width: '100px', height: '100px', borderRadius: '50%' }}
					src={src}
					alt=""
					onClick={() => onImageClick(src)}
				/>
				{desc.length?<p>{desc}</p>:null}
			</div>
		);
	}
}
