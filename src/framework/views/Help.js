'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon, Menu } from 'antd';
import { getAllNewsList } from '../action';

const SubMenu = Menu.SubMenu;
class Help extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static propTypes = {
		newlist: PropTypes.array,
		actions: PropTypes.object,
	};

	static defaultProps = {
		title: '',
		newlist: [],
		actions: {},
	};

	constructor (props) {
		super(props);
		this.state = {
			openKeys: [],
			current: '1',
			initNewsCount: 0,
			news: {
				title: '',
				content: '',
			},
		};
	}

	componentWillMount () {
		const { actions } = this.props;
		actions.getAllNewsList();
	}

	componentWillReceiveProps (nextProps) {
		let { newlist } = nextProps;
		if (!newlist) {
			newlist = [];
		}
		this.setState({
			news: {
				title: [newlist[0].child[0].content.mainContent],
				content: [newlist[0].child[0].content.subTitle],
			},
		});
	}

	//移除前执行一次,且一定会执行
	componentWillUnmount () {
		console.log('componentWillUnmount doing');
	}

	onOpenChange = (openKeys) => {
		const state = this.state;
		const latestOpenKey = openKeys.find(
			key => !(state.openKeys.indexOf(key) > -1));
		const latestCloseKey = state.openKeys.find(
			key => !(openKeys.indexOf(key) > -1));
		let nextOpenKeys = [];
		if (latestOpenKey) {
			nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
		}
		if (latestCloseKey) {
			nextOpenKeys = this.getAncestorKeys(latestCloseKey);
		}
		this.setState({ openKeys: nextOpenKeys });
	};

	getAncestorKeys = (key) => {
		const map = {
			sub3: ['sub2'],
		};
		return map[key] || [];
	};
	handleClick = (item, key) => {
		const { newlist } = this.props;
		const { openKeys } = this.state;
		const NewTitle = [];
		const NewContent = [];
		const selectRowKey = parseInt(openKeys.join('').slice(3), 10) + 1;
		newlist.forEach((item) => {
			if (item.key === selectRowKey) {
				NewTitle.length = 0;
				NewContent.length = 0;
				NewContent.push(item.title);
				NewTitle.push(item.child[0].content.mainContent);
			}
		});

		this.setState({
			news: {
				title: NewTitle,
				content: NewContent,
			},
		});
	};

	render () {
		const { newlist } = this.props;
		const initNewsCount = this.state.initNewsCount;
		let { news } = this.state;
		const newListConent = news.content[0];
		const newListTitle = news.title[0];
		if (!news) {
			news = {};
		}
		if (newlist.length !== 0) {
			const ContentArray = newlist[initNewsCount].child;
			let ContentObj = {};
			ContentArray.forEach((item, index) => {
				if (index == initNewsCount) {
					ContentObj = item;
				}
			});

			news = {
				title: newlist[initNewsCount].title,
				content: ContentObj.content.mainContent,
			};
		}

		const openKey = [];
		let helpList = [];
		if (newlist.length !== 0) {
			helpList = newlist.map((item, index) => {
				openKey.push(item.title);
				return (
					<SubMenu
						key={`sub${index}`}
						title={<span>{index + 1}、{item.title} </span>}
					>
						{item.child.map((node, indx) =>
							<Menu.Item key={`key${indx}`} >
								<span className="ContnetStyle" >
									<a href="javascript:void(0)" >
										{node.content.subTitle}
									</a>
								</span>
							</Menu.Item>,
						)}
					</SubMenu>
				);
			});
		}
		return (
			<div>
				<Menu
					mode="inline"
					openKeys={this.state.openKeys}
					selectedKeys={[this.state.current]}
					style={{
						width: 250,
						height: 800,
						marginTop: 0,
						marginBottom: 0,
						float: 'left',
					}}
					onOpenChange={this.onOpenChange}
					onClick={this.handleClick}
					defaultOpenKeys={['sub0']}
				>
					{helpList}
				</Menu>
				<div
					id="mainContent"
					style={{
						marginLeft: 270,
						marginTop: 20,
						marginBottom: -20,
						width: 770,
						height: 800,
					}}
				>
					<p
						id="HelpTitle" ref="HelpTitle"
						style={{ display: 'none' }}
					>{newListConent}</p>
					<div
						id="HelpContent"
						ref="HelpContent"
					>{newListTitle}</div>
				</div>
			</div>
		);
	}
}

//从而可以在组件中直接使用props: user
const mapStateToProps = (state) => {
	const { newlist, news } = state.get('HelpService').toObject();
	return {
		newlist,
		news,
	};
};
/*eslint-disable no-unused-labels */
const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({ getAllNewsList }, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Help);
