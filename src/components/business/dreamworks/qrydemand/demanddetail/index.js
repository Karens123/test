import React, { PropTypes } from 'react';
import { Row } from 'antd';
import 'business/dreamworks/common.less';

export default class DemandDetail extends React.Component{
	static propTypes = {
		data: PropTypes.object.isRequired,
		onImageClick: PropTypes.func,
	};

	static defaultProps = {
		data: {},
		onImageClick: (val) => {}
	};
	renderPicList = (list=[],className='') => {
		const ret=[];
		list.map((val) => {
			ret.push(<img src={val} alt="" className={className} onClick={(e) => { this.props.onImageClick(val); }} />);
		});
		return ret;
	};
	render(){
		const { data } = this.props;

		return (
			<div className="ProdDeatill">

				<Row>
					<h3 className="title">需求详情：</h3>
				</Row>
				<Row>
					<div className="line">
						<div className="item">
							<h3 className="title">芯片</h3>
							<p className="name">
								{data && data.shape}
								<span className="smallfont">({data && data.size})</span>
							</p>
						</div>
						<div className="item">
							<h3 className="title">类型</h3>
							<p className="name">{data && data.type}  </p>
						</div>
						<div className="item">
							<h3 className="title">工期</h3>
							<p className="name">{data && data.timeLimit}  </p>
						</div>
						<div className="item">
							<h3 className="title">名称</h3>
							<p className="name">{data && data.name} </p>
						</div>
						<div className="item">
							<h3 className="title">总金额</h3>
							<p className="name">{`¥${data && data.price}`}  </p>
						</div>
					</div>
				</Row>
				<Row>
					<h3 className="title">设计说明：</h3>
				</Row>
				<Row>
					<p className="desigerIntro">{ data && data.desc }</p>
				</Row>

				{data.images&&data.images.length? (<Row>
					<Row>
						<h3 className="title">设计手稿/参考：</h3>
					</Row>
					<div className="demand-image-list">
						{this.renderPicList(data.images,'w100 mb20')}
						{/*<img*/}
						{/*src={data && data.imgSrc}*/}
						{/*/>*/}
					</div>
				</Row>):null}
			</div>
		);
	}
}
