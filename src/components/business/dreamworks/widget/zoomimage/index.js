'use strict';

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Icon } from 'antd';

export default class ZoomImage extends React.Component{
	static propTypes = {
		url: PropTypes.string.isRequired,
		zooming: PropTypes.bool.isRequired,
		fullScreen: PropTypes.bool,
		width: PropTypes.number,
		height: PropTypes.number,
		coefficient: PropTypes.number,
		hideHandler: PropTypes.function,
		onImageClick: PropTypes.func,
	};


	static defaultProps = {
		fullScreen: false,
		width: 800,
		height: 600,
		coefficient: 0.7,
		hideHandler: () => {},
		onImageClick: () => {},
	};
	constructor(props){
		super(props);
		this.state={
			complete: false
		};

	}

	setComplete = () => {
		this.setState({
			complete: true
		});
	};

	errHandler = (e) => {
		console.log('img error',e.target);
		// e.target.src='http://via.placeholder.com/260x260?text=error-url';
	};

	renderImg = (width, height,src,coefficient) => {
		// const ks = width / height;
		const { complete } = this.state;
		const img = new Image();
		img.src=src;
		if (!complete){
			img.onload= (e) => {
				// console.log(e.target,' is loaded');
				this.setComplete();
			};
		}
		// const { img } = this.state;
		const wi = img.naturalWidth,
			hi = img.naturalHeight;
		const kw = wi / width,
			kh = hi / height;
		let afterHeight;
		let afterWidth;
		if (coefficient > 1) {
			coefficient = 1;
		} else if (coefficient < 0) {
			coefficient = 1;
		}
		if (kh < kw) {
			afterHeight = (height * coefficient * kh) / kw;
			afterWidth = width * coefficient;
		} else {
			afterHeight = height * coefficient;
			afterWidth = (width * coefficient * kw) / kh;
		}
		const { zooming,fullScreen,onImageClick } = this.props;
		return (
			<div
				style={{
					width: afterWidth,
					height: afterHeight,
					top: (height - afterHeight) / 2,
					left: (width - afterWidth) / 2,
					position: 'absolute',
					display: `${zooming?'block':'none'}`
				}}
			>
				<img
					src={src} alt="" style={{ width: '100%',height: 'auto',position: 'absolute', top: 0, left: 0 }}
					onError={this.errHandler}
					onClick={() => {
						fullScreen?null:onImageClick(src);
					}}
				/>
			</div>
		);
	};

	render(){
		const { fullScreen,url,coefficient,zooming,hideHandler } = this.props;
		let { width, height } = this.props;
		if (fullScreen){
			width=document.body.offsetWidth;
			height=document.body.offsetHeight;
		}
		// this.setState({
		// 	show: zooming
		// });
		// const { show } = this.state;
		return ( <div
			onClick={hideHandler}
			style={
				fullScreen?
				{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					height: '100%',
					backgroundColor: 'rgba(0,0,0,0.5)',
					zIndex: 9 ,
					display: `${zooming?'block':'none'}`
				}:
				{ position: 'relative',width: `${width}px`,height: `${height}px` }
			}
		>
			{this.renderImg(width, height,url,coefficient)}
		</div>);
	}
}
