'use strict';

import React, { PropTypes } from 'react';
import E from 'wangeditor';
import * as WidgetUtil from 'utils/WidgetUtil';
import { initOssFileUploadProps } from 'utils/UploadUtil';

// wangeditor文档 https://www.kancloud.cn/wangfupeng/wangeditor3/332599
export default class Editor extends  React.Component {
	static propTypes = {
		isDevelop: PropTypes.bool,
		getResult: PropTypes.func,
		initData: PropTypes.string,
		editingHandler: PropTypes.func,
		zIndex: PropTypes.number,
	};
	static defaultProps = {
		isDevelop: false,
		getResult: (res) => {
			console.log('Editor "getResult" props is not defined',res);
		},
		initData: '',
		editingHandler: (isEditing) => {
			console.log('isEditing',isEditing);
		},
		zIndex: undefined,
	};
	constructor(props, context) {
		super(props, context);
		this.state = {
			editorContent: ''
		};

	}
	componentDidMount() {

		this.initEditor();
	}
	componentWillReceiveProps(nextProps){
		const { initData } = nextProps;
		const { editor } = this.state;
		if (initData!==this.props.initData){
			editor.txt.html(initData);
		}
	}
	initEditor= () => {
		const elem = this.refs.editorElem;
		const editor = new E(elem);
		//绑定数据到state；
		editor.customConfig.onchange = (html) => {
			this.setState({
				editorContent: html,
			});
			const { editingHandler } =this.props;
			editingHandler(true);
		};
		//自定义上传事件
		editor.customConfig.customUploadImg = (files, insert) => {
			// files 是 input 中选中的文件列表
			// insert 是获取图片 url 后，插入到编辑器的方法
			console.log('customUploadImg',files,insert);
			// 上传代码返回结果之后，将图片插入到编辑器中
			this.handleChange(files,insert);
		};
		const { getResult } =this.props;
		editor.customConfig.onblur = (html) => {
			getResult(html);
			const { editingHandler } =this.props;
			editingHandler(false);
		};
		const { zIndex } = this.props;
		zIndex?editor.customConfig.zIndex = zIndex:null;
		editor.create();
		const { initData } =this.props;
		editor.txt.html(initData);
		this.setState({
			editor
		});
	};
	successHandler = (res,insert) => {
		console.log('successHandler',res);
		insert(`${res.url}?target=new`);

	};
	errorHandler = (err) => {
		console.log('errorHandler',err);
	};
	progressHandler = (res) => {
		console.log('progressHandler',res);
	};
	handleChange = (fileList,insert) => {
		const handlerProps=initOssFileUploadProps();
		const customHandler=handlerProps.customRequest;
		for (let i=0,len=fileList.length;i<len;i++){
			customHandler({
				onProgress: this.progressHandler,
				onError: this.errorHandler,
				onSuccess: (res) => {
					this.successHandler(res,insert);
					console.trace('mark',res);
				},
				file: fileList[i],
			});
		}

	};
	clickHandle = () => {
		const { editorContent } = this.state;
		console.log(editorContent);
	};
	render(){
		const { isDevelop } = this.props;
		return (<div>
			<div ref="editorElem" style={{ textAlign: 'left' }} />
			{ isDevelop?<button onClick={this.clickHandle}>获取内容</button>: null }

		</div>);
	}
}