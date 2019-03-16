## wenwen-app-admin. React Ant.Design Admin UI

## 前台框架集成所涉及知识点
- [NodeJS](https://nodejs.org/enlish/) 基础Javascript平台,需要熟悉NPM
- [React](https://facebook.github.io/react/): FaceBook的组件库
- [Redux](https://github.com/reactjs/redux): 数据流转向
- [React-Router](https://github.com/reactjs/react-router): URL路由
- [Ant.Design](http://ant.design/): 使用的组件库
- [Babel](https://babeljs.io/): 转换Javascript
- [webpack](https://webpack.github.io/): 打包工具
- [mocha](https://mochajs.org/): 测试工具
- [enzyme](https://github.com/airbnb/enzyme)
- [js编码规范](https://github.com/airbnb/javascript)
- [react编码规范](https://github.com/airbnb/javascript/tree/master/react)
- [eslint](https://github.com/eslint/eslint): 语言规范检查

## 其它第三方框架
- [super]
- [Immutable.js]

## 入门

从仓库中clone, 并且按照必需的node modules:


若是第一次按照,npm install需要等待一段时间

```shell
$ git clone git@192.168.31.31:wenwen-html/wenwen-app-admin.git
$ cd wenwen-app-admin
$ npm install
$ npm start
```

## 环境变量配置
- [WENWEN_ENV] 系统环境 dev, test, stage, prod, 默认dev, test与stage暂时未支持!
- [WENWEN_API_BASE_URL] api服务器地址, 默认为测试服务器地址:http://debug.wenwen8.com:8881
- [WENWEN_PORT]         应用监听端口,端口配置必须大于3000,否则将置为默认配置,默认为3000,(原因linux系统下node要监听1024以下的端口需要root权限)
- [WENWEN_OSS_URL]      oss服务器地址, 默认为测试环境oss地址:http://test-img-server.oss-cn-shenzhen.aliyuncs.com/
- [OSS_BUCKET]          oss服务bucket默认:test-img-server

```shell
注: 每次修改环境变量后，
  windows开发用户应该关闭cmd窗口后再重新启动应用
  生产环境应该调用以下命令重启应用
    npm run fstop
    npm run fstart
```
## Run test spec

```shell
$ npm run test
```

## 编码规范
1、代码块间统一使用一个Tab
2、代码的变量命名统一使用驼峰命名原则，常量统一使用大写
3、文件命名，模块文件夹命名统一小写，Component统一首字母大写驼峰命名
4、字符串的定义统一使用'',字符运算统一使用js template方式
4、定义变量时禁止使用var，统一使用let或者const  
5、react component 统一使用 React.Component进行创建;  
6、state直接在constuctor中定义, 页面初始化的请求统一在constuctor中执行  
7、组件内的函数统一以箭头函数定义，这样子就不用再constructor中使用bind绑定上下文  
8、页面的处理信息的提示及相关操作建议在componentWillReceiveProps中执行  
9、reducer中的state应统一使用Immutable.Map(state)转为Map对象后使用set，toObject等函数进行处理  
10、后期建议把action文件与reducer合并为ReduxDuck.js
11、文件中的换行统一使用(Unix os)LF符号
12、文件命名和组件命名一致(单个组件，没涉及到action与reducer文件)，
13、为了保持风格统一和查找文件名方便，文件命名和组件命名相同(不支持用文件夹包index.js结构)

### React Component
```js
const RSP_OK = 0;
const RSP_FAIL = 1;
const DISCOVERY_TYPE_STYLE = 'xxx';

import {QRY_LIST_BY_FROM, DELETE_OBJECT, DEAL_OBJECT} from 'action';
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        const { actions } = props;
        this.handleQuery();
        actions.getStaticDataByCodeType(DISCOVERY_TYPE_STYLE);
    };
    handleQuery = () => {
        console.log(this.props);
    };
    componentWillReceiveProps(nextProps) {
        const { actions, rspInfo, refreshData, staticDataList } = nextProps;
        console.log('Demo admin next rspInfo !== old rspInfo', rspInfo !== this.props.rspInfo)
        console.log('Demo admin old rspInfo', this.props.rspInfo)
        console.log('Demo admin next rspInfo', rspInfo )
        if(rspInfo !== this.props.rspInfo) {
            if(rspInfo) {
                let isRefresh = false;
                if(`${QRY_LIST_BY_FROM}_SUCCESS` === actionType) {
                    if (rspInfo.resultCode !== Constant.REST_OK) {
                        util.showwarning(`查询信息列表失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
                    }
                } else if(`${DEAL_OBJECT}_SUCCESS` === actionType) {
                    isRefresh = true;
                } else if(`${DELETE_OBJECT}_SUCCESS` === actionType) {
                    if (rspInfo.resultCode !== Constant.REST_OK) {
                        util.showwarning(`删除信息失败,错误信息 ${rspInfo.resultCode} ${rspInfo.resultDesc}`);
                    } else {
                        isRefresh = true;
                    }
                }
                if(isRefresh) {
                    this.handleQuery();
                }
            }
        }
    }
    .
    .
    .
    render() {
        return (<div><div>);
    }
}
```
### reducer
``` js
export default function DiscoveryTypeService(state = {}, action = {}) {
    // console.log('prodInfor------ prevState: ', state, 'action=====', action);
    const ret = action.payload;
    const ret = action.payload;
    state = Immutable.Map(state).set('actionType', action.type);
    if(ret && ret.rspInfo) {
        state = state.set('rspInfo', ret.rspInfo);
    }
    switch (action.type) {
        //1. 根据条件查询发现列表
        case `${actions.QRY_DISCOVERY_TYPE_BY_FORM}_SUCCESS`://执行查询操作后，清空发现信息列表
            return state.set('discoveryTypeInfoList', ret.records).toObject();
        default:
            return state.toObject();
    }
}
```
