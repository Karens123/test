import React, { PropTypes } from 'react';

export default class LazyLoad extends React.Component{

	static propTypes = {
		src: PropTypes.string.isRequired
	};

	constructor (props) {
		super(props);
		this.state = {
			ready: false,
			defaultImg: 'http://via.placeholder.com/50x50?text= + ',
			img: new Image(),
		};
	}



	componentDidMount(){
		const { img } = this.state;
		const { src } = this.props;
		img.src = src;
		console.log('img.src is',img,src);
		if ( src!==undefined ){
			if (img.complete){
				console.log('img is ready');
			} else {
				console.log('img is not ready',img);
			}
			img.onload=this.imgOnLoadHandler;
		}
	}
	// componentWillReciveProps(nextProps){
	// 	const { img } = this.state;
	// 	const { src } = nextProps;
	// 	img.src = src;
	// 	console.log('img.src is',img,src);
	// 	if ( src ){
	// 		if (img.complete){
	// 			console.log('img is ready');
	// 		} else {
	// 			console.log('img is not ready',img);
	// 		}
	// 		img.onload=this.imgOnLoadHandler;
	// 	}
	// }

	// shouldComponentUpdate( nextProps,nextState){
	// 	const isRender = nextState.ready !== this.state.ready||
	// 			nextProps.src!==this.props.src;
	// 	return isRender;
	// }



	imgOnLoadHandler = (e) => {
		this.setState({
			ready: true
		});
	};

	render(){
		const { src,...rest } = this.props;
		const { ready,defaultImg } = this.state;
		return (<img src={ready?src:defaultImg} {...rest} />);
	}
}
