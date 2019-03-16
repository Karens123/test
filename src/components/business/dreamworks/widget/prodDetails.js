import React, { PropTypes } from 'react';
import  '../common.less';

export default class ProdDeatill extends React.Component{
	static propTypes = {
		ProdDemandDetails: PropTypes.object.isRequired,
		imageClickZoom: PropTypes.func.isRequired,
	};

	static defaultProps = {
		ProdDemandDetails: {},
		imageClickZoom: () => {
		},

	};
	constructor (props) {
		super(props);
		this.state = {
		};
	}
	render(){
		const { ProdDemandDetails,imageClickZoom } = this.props;


		console.log('imageClickZoom___________www_________', imageClickZoom);

		return (<div className="ProdDeatill">
			<p><span className="title">需求详情：</span></p>
			<table cellSpacing={0} cellPadding={0} border="0" className="demandDeatil" width="100%">
				<tr>
					<td>
						<div className="title">芯片:</div>
						<div className="name">{ProdDemandDetails && ProdDemandDetails.Details.shape} <span className="smallfont">({ProdDemandDetails && ProdDemandDetails.Details.size})</span></div>
					</td>
					<td>
						<div className="title">类型:</div>
						<div className="name">{ProdDemandDetails && ProdDemandDetails.Details.type}  </div>
					</td>
					<td>
						<div className="title">工期:</div>
						<div className="name">{ProdDemandDetails && ProdDemandDetails.Details.longTime}  </div>
					</td>
					<td>
						<div className="title">名称:</div>
						<div className="name">{ProdDemandDetails && ProdDemandDetails.Details.name} </div>
					</td>
					<td>
						<div className="title">总金额:</div>
						<div className="name">{`¥${ProdDemandDetails && ProdDemandDetails.Details.totailPrice}`}  </div>
					</td>
				</tr>
			</table>
			<p><span className="title">设计说明：</span></p>
			<div className="desigerIntro">{ ProdDemandDetails && ProdDemandDetails.ProdInfr }</div>

			<p><span className="title">设计手稿/参考：</span></p>
			<div className="desigerPic">
				<img
					src={ProdDemandDetails && ProdDemandDetails.imgSrc}
					onClick={this.props.imageClickZoom}
				/>
			</div>

		</div>);
	}
}
