'use strict';

import React from 'react';
import { Upload, Button, Icon } from 'antd';

export default class MyUpload extends React.Component {
	constructor (props, context) {
		super(props, context);
		this.state = {
			fileList: [
				{
					uid: -1,
					name: 'xxx.png',
					status: 'done',
					url: 'http://www.baidu.com/xxx.png',
				}],
		};
	}

	handleChange = (info) => {
		let fileList = info.fileList;
		// 1. 上传列表数量的限制
		//    只显示最近上传的一个，旧的会被新的顶掉
		fileList = fileList.slice(-2);
		console.log('fileList=', fileList);

		// 2. 读取远程路径并显示链接
		fileList = fileList.map((file) => {

			if (file.response) {
				// 组件会将 file.url 作为链接进行展示
				file.url = file.response.url;
				file.uid = file.response.uid;
				file.name = file.response.name;
			}
			return file;
		});

		// 3. 按照服务器返回信息筛选成功上传的文件
		fileList = fileList.filter((file) => {
			if (file.response) {
				//return file.response.status === 'success';
				return true;
			}
			return true;
		});

		this.setState({ fileList });
	};

	render () {
		const props = {
			action: 'http://120.25.196.51:8081/admin/base/uploadImage',
			onChange: this.handleChange,
			multiple: true,

		};
		return (
			<Upload {...props} fileList={this.state.fileList} >
				<Button type="ghost" >
					<Icon type="upload" /> 点击上传
				</Button>
			</Upload>
		);
	}
}