'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Upload } from 'antd';
import { parseDate, parseDateTime } from 'utils/DateUtil';
import * as MsgUtil from 'utils/MsgUtil';
import * as DateUtil from 'src/utils/DateUtil';
import * as WidgetUtil from 'utils/WidgetUtil';
import { PubImageUploadProps,handleUploadImage } from 'utils/UploadUtil';
import './index.less';

export default class ImgUpload extends React.Component {
	static propTypes ={
		initState: PropTypes.object,
		callback: PropTypes.func,
		list: PropTypes.array.isRequired,
		isSingle: PropTypes.bool,
	};
	static defaultProps = {
		initState: {
			defaultValue: 60,
		},
		callback: (nextState) => {
			console.log('callback is not defined',nextState);
		},
		isSingle: false,
	};
	constructor(props){
		super(props);
		const { initState } =this.props;
		this.state={
			...initState,
		};
	}
	componentWillReceiveProps(nextProps){
		const { initState } = nextProps;
		this.setState({
			...initState,
		});
	}
	successHandler = (res,callback) => {
		console.log('successHandler',res);
		if (typeof callback === 'function'){
			callback(res);
		}
	};
	errorHandler = (err) => {
		console.log('errorHandler',err);
	};
	progressHandler = (res) => {
		console.log('progressHandler',res);
	};
	changeHandler = (info) => {
		console.log('changeHandler',info);
		const fileList = info.fileList;
		const { FileUploadPath, SrcPath } = handleUploadImage(fileList);
		this.setState({
			UploadPath: FileUploadPath,
			hasChangeUpload: true,
			fileList,
			ViewUploadImgSrc: SrcPath,
		});
		const { callback } = this.props;
		if (typeof callback === 'function'){
			info&&Array.isArray(info.fileList)&&callback(info);
		}
	};
	renderList = (list) => {
		const ret=[];
		console.log('renderList',list);
		const { isSingle } =this.props;
		Array.isArray(list)&& list.forEach((val) => {
			if (val.state!==-1){
				ret.push(<div className="img-box">
					{isSingle?
						null:
						<span
							className="close-button"
							onClick={(e) => {
								val.state=-1;
								this.setState({
									update: new Date()
								});
							}}
						>X</span>
					}
					<img src={val.url||val.image} alt="" style={{ width: '150px',height: 'auto'  }} />
				</div>);
			}
		});
		return ret;
	};

	render(){
		const { defaultValue,file } = this.state;
		const { list } = this.props;
		const uploadProps = PubImageUploadProps().
		set('onChange', this.changeHandler).
		set('fileList', this.state.fileList).
		toObject();
		return (<div className="img-module">
			<div>
				<Upload {...uploadProps} fileList={this.state.fileList} >
					<span className="ant-btn ant-btn-primary ant-btn-lg">+加图</span>
				</Upload>
			</div>
			<br />
			<div style={{ display: 'flex',flexWrap: 'wrap',alignItems: 'center' }}>
				{this.renderList(list)}
			</div>
		</div>);
	}
}