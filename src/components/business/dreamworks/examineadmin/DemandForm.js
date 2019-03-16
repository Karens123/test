import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { parseDate } from 'utils/DateUtil';
import { Col, Form, Row, Table, Pagination } from 'antd';
import { getStaticDataByCodeType } from 'business/common/StaticDataService';
import { statusNumToClass,statusNumToText,chipNumToText,worksTypeNumToText } from 'utils/MappingUtil';


class DemandForm extends React.Component {
	static propTypes = {
		deviceType: PropTypes.number.isRequired,
		demandInfoList: PropTypes.array.isRequired,
		demandTotalCount: PropTypes.number.isRequired,
		handleDemandQuery: PropTypes.func.isRequired,
		currentDemand: PropTypes.number,
		handleCheck: PropTypes.func.isRequired,
		pageDemandHandler: PropTypes.func.isRequired,
		selectValue: PropTypes.object.isRequired,
		handDeviceType: PropTypes.func.isRequired,
	};

	static defaultProps = {
		demandInfoList: [],
		currentDemand: 1,
		demandTotalCount: 0

	};

	constructor (props) {
		super(props);
		const { currentDemand } = props;
		this.state = {
			selectedRowKeys: [],
			pageSize: 10,
		};
	}
	componentWillMount () {
		const { deviceType } = this.props;
		this.props.handDeviceType(deviceType);
	}

	//分页器跳转
	onPaginationDemandChange = (currentDemand) => {
		const { selectValue,pageDemandHandler } = this.props;
		this.setState({ currentDemand, }, () => {
			const { currentDemand, pageSize } = this.state;
			if (JSON.stringify(selectValue) == '{}') {
				pageDemandHandler(currentDemand);
				this.props.handleDemandQuery(currentDemand, pageSize );
			} else {
				console.log('selectValue________________________', selectValue);
				pageDemandHandler(currentDemand);
				this.props.handleDemandQuery(currentDemand, pageSize,selectValue );
			}
		});
	};

	render () {
		const { deviceType,demandInfoList,currentDemand,demandTotalCount } = this.props;
		//商家需求审核
		const columnsDemand = [
			{
				title: '需求名',
				dataIndex: 'productName',
				key: 'productName',
				width: '200px',
				render: (text, item) => `${item.productName}`,
			},{
				title: '需求方',
				dataIndex: 'publisher',
				key: 'publisher',
				width: '200px',
				render: (text, item) => `${item.publisher.nick}`,
			}, {
				title: '芯片',
				dataIndex: 'chip',
				key: 'chip',
				width: '200px',
				render: (text, item) => {
					return chipNumToText(item.chip);
				},
			}, {
				title: '类型',
				dataIndex: 'type',
				key: 'type',
				width: '100px',
				render: (text, item) => {
					return worksTypeNumToText(item.type);
				},
			}, {
				title: '工期(天)',
				dataIndex: 'timeLimit',
				key: 'timeLimit',
				width: '100px',
			}, {
				title: '总金额',
				dataIndex: 'reward',
				key: 'reward',
				width: '100px',
				render: (item) => {
					return (item/100).toFixed(2);
				}
			},{
				title: '状态',
				dataIndex: 'state',
				key: 'state',
				width: '200px',
				render: (text,item) => {
					return (<span className={`${statusNumToClass(item.state)} status`}>{statusNumToText(item.state)}</span>);
				},
			},{
				title: '操作',
				dataIndex: 'opr',
				key: 'opr',
				width: '100px',
				render: (text,item) => {
					return (<a
						onClick={() => {
							this.props.handleCheck(item.demandId,1);
						}}
					>查看
					</a>);
				},
			},];




		const renderContent = () => {

			if ( deviceType ==='1' ) {
				return (
					<div>
						<Row>
							<Col span={24} >
								<Table
									columns={columnsDemand}
									rowKey={record => record.worksId}
									dataSource={demandInfoList||10}
									pagination={false}
								/>
								<Pagination
									className="ant-table-pagination"
									onChange={this.onPaginationDemandChange}
									total={demandTotalCount||10}
									current={currentDemand}
								/>
							</Col>
						</Row>
					</div>
				);
			}
		};
		return (
			<div>
				{renderContent()}
			</div>
		);
	}
}



const mapStateToProps = (state) => {
	const { demandInfoList,demandTotalCount,currentPage  } = state.get('EnterExamineReducer').toObject();

	return {
		demandTotalCount,
		currentPage,
		demandInfoList
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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(DemandForm));
