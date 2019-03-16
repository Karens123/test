
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { parseDate } from 'utils/DateUtil';
import {
	Col,
	Form,
	Row,
	Table,
	Pagination
} from 'antd';
import { getStaticDataByCodeType } from 'business/common/StaticDataService';

class PushForm extends React.Component {
	static propTypes = {
		deviceType: PropTypes.number.isRequired,
		WorksInfoList: PropTypes.array.isRequired,
		totalCount: PropTypes.number.isRequired,
		handleQuery: PropTypes.func.isRequired,
		current: PropTypes.number,
		handleCheck: PropTypes.func.isRequired,
		pageHandler: PropTypes.func.isRequired,
		selectValue: PropTypes.object.isRequired,
		handDeviceType: PropTypes.func.isRequired,
	};

	static defaultProps = {
		WorksInfoList: [],
		totalCount: 0,
		current: 1

	};

	constructor (props) {
		super(props);
		const { WorksInfoList,current } = props;
		this.state = {
			selectedRowKeys: [],
			pageSize: 10,
			currentPage: current

		};
	}
	componentWillMount () {
		const { deviceType } = this.props;
		this.props.handDeviceType(deviceType);
	}
	//分页器页面大小变更
	onPaginationShowSizeChange = (currentPage, pageSize) => {
		this.setState({
			pageSize }, () => {
			const { pageSize } = this.state;
			const { current } = this.props;
			this.props.handleQuery(current, pageSize );
		});
	};

	//分页器跳转
	onPaginationChange = (currentPage) => {
		const { selectValue,pageHandler } = this.props;

		this.setState({ currentPage, }, () => {
			const { currentPage, pageSize } = this.state;
			if (JSON.stringify(selectValue) == '{}') {
				pageHandler(currentPage);
				this.props.handleQuery(currentPage, pageSize );
			} else {
				pageHandler(currentPage);
				this.props.handleQuery(currentPage, pageSize,selectValue );
			}
		});
	};

	render () {
		const { deviceType,WorksInfoList,current } = this.props;
		//作品审核
		const columns = [
			{
				title: '设计师',
				dataIndex: 'realName',
				key: 'realName',
				width: '200px',
				render: (text, item) => `${item.realName}`,
			},{
				title: '作品标题',
				dataIndex: 'worksName',
				key: 'worksName',
				width: '200px',
				render: (text, item) => {
					return (item.worksName);
				}
			}, {
				title: '作品副标题',
				dataIndex: 'viceTitle',
				key: 'viceTitle',
				width: '200px',
			}, {
				title: '购买连接',
				dataIndex: 'buyLinks',
				key: 'buyLinks',
				width: '100px',
				render: (text, item) => {
					const str='无';
					if (!item.buyLinks) {
						return  str;
					} else {
						return (<a href={item.buyLinks} target="_blank" rel="noopener noreferrer">打开链接</a>);
					}
				},
			}, {
				title: '状态',
				dataIndex: 'state',
				key: 'state',
				width: '200px',
				render: (text,item) => {
					if (item.state == '1') {
						return '审核中';
					} else if (item.state == '3') {
						return (<span className="red">未通过</span>);
					} {
						return '未知';
					}
				},
			}, {
				title: '创建日期',
				dataIndex: 'createTime',
				key: 'createTime',
				width: '200px',
				render: (text,item) => parseDate(item.createTime),
			},{
				title: '操作',
				dataIndex: 'opr',
				key: 'opr',
				width: '100px',
				render: (text,item) => {
					return (<a
						onClick={() => {
							this.props.handleCheck(item.worksId);
							   }}
					>查看
							</a>);
				},
			},];

		//需求审核
		const columnsDemand = [
			{
				title: '需求名',
				dataIndex: 'realName',
				key: 'realName',
				width: '200px',
				render: (text, item) => `${item.realName}`,
			},{
				title: '需求方',
				dataIndex: 'worksName',
				key: 'worksName',
				width: '200px',
				render: (text, item) => {
					return (item.worksName);
				}
			}, {
				title: '芯片',
				dataIndex: 'viceTitle',
				key: 'viceTitle',
				width: '200px',
			}, {
				title: '类型',
				dataIndex: 'buyLinks',
				key: 'buyLinks',
				width: '100px',
				render: (text, item) => {
					const str='无';
					if (!item.buyLinks) {
						return  str;
					} else {
						return (<a href={item.buyLinks} target="_blank" rel="noopener noreferrer">打开链接</a>);
					}
				},
			}, {
				title: '工期',
				dataIndex: 'buyLink3s',
				key: 'buyLink3s',
				width: '100px',
				render: (text, item) => {
					const str='无';
					if (!item.buyLinks) {
						return  str;
					} else {
						return (<a href={item.buyLinks} target="_blank" rel="noopener noreferrer">打开链接</a>);
					}
				},
			}, {
				title: '总金额',
				dataIndex: 'money',
				key: 'money',
				width: '100px',
				render: (text, item) => {
					const str='无';
					if (!item.buyLinks) {
						return  str;
					} else {
						return (<a href={item.buyLinks} target="_blank" rel="noopener noreferrer">打开链接</a>);
					}
				},
			},{
				title: '状态',
				dataIndex: 'state',
				key: 'state',
				width: '200px',
				render: (text,item) => {
					if (item.state == '1') {
						return '审核中';
					} else if (item.state == '3') {
						return (<span className="red">未通过</span>);
					} {
						return '未知';
					}
				},
			},{
				title: '操作',
				dataIndex: 'opr',
				key: 'opr',
				width: '100px',
				render: (text,item) => {
					return (<a
						onClick={() => {
							this.props.handleCheck(item.worksId,1);
						}}
					>ss查看
					</a>);
				},
			},];




		const renderContent = () => {
			return (
				<div>
					<Row>
						<Col span={24} >
							<Table
								columns={columns}
								rowKey={record => record.worksId}
								dataSource={WorksInfoList}
								pagination={false}
							/>
							<Pagination
								className="ant-table-pagination"
								onShowSizeChange={this.onPaginationShowSizeChange}
								onChange={this.onPaginationChange}
								total={this.props.totalCount}
								current={current}
							/>
						</Col>
					</Row>
				</div>
			);
		};
		return (
			<div>
				{renderContent()}
			</div>
		);
	}
	}



const mapStateToProps = (state) => {
	const { WorksInfoList,totalCount,currentPage  } = state.get('EnterExamineReducer').toObject();
	return {
		WorksInfoList,
		totalCount,
		currentPage
	};
};

const mapDispatchToProps = (dispatch) => {
	const actionCreators = {
	};
	return {
		actions: bindActionCreators({
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(PushForm));
