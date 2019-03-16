"use strict";

const webpack = require("webpack");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const buildUtils = require('./buildUtils');

const nodeEnv = process.env.NODE_ENV;
const wenwenEnv = process.env.WENWEN_ENV;
const isProduction = nodeEnv === "production";
const isDeveloping = !isProduction;

//根据node_env获取不同的config配置文件
const configFile = "./webpack-" + (wenwenEnv ? wenwenEnv : "dev");
console.log("configFile is", configFile);

const config = require(configFile);

const app = express();

const publicPath = path.resolve(config.output.path);//静态资源目录的绝对地址
const staticVirtualPathe = config.output.publicPath;//静态资源的虚拟路径
console.log("publicPath is ", publicPath);

// Webpack developer
if (isDeveloping) {
	const compiler = webpack(config);
	const devMiddleWare = require("webpack-dev-middleware")(compiler, {
		publicPath: config.output.publicPath,
		quiet: false,
		stats: {
			colors: true,
			modules: false,
			children: false,
			chunks: false,
			chunkModules: false
		}
	});

	app.use(devMiddleWare);
	app.use(require("webpack-hot-middleware")(compiler));

	const mfs = devMiddleWare.fileSystem;
	const file = path.join(publicPath, "index.html");
	app.get('*', function (req, res, next) {
		devMiddleWare.waitUntilValid(function () {
			if (buildUtils.isStaticRes(req.path)) {//如果请求路径以静态虚拟路径为头，则不转发给index
				return next();
			}
			/*if (/dll.js$/.test(req.url)) {
			 res.sendFile(path.join(__dirname, "../", req.url));
			 }*/ else {
				let html;
				try {
					html = mfs.readFileSync(file)
				} catch (err) {
					console.log(err);
					console.log("file", file);
				}
				res.end(html)
			}
		})
	})
} else {
	app.get("*", function (req, res, next) {//转发所有get请求给index的react-router
		console.log('req.url: ' + req.url);
		if (buildUtils.isStaticRes(req.path)) {//静态资源不转发给index
			// if(req.path.indexOf('.gz') === -1) {
			// 	req.url = req.url + '.gz';
			//
			// }
			// res.set('Content-Encoding', 'gzip');
			console.log(req.url + 'is static res');
			return next();
		}
		res.sendFile(path.resolve(publicPath, "index.html"));
	});

}
//设置访问静态资源的虚拟路径与绝对路径
const CACHETIME = 60 * 60 * 1000 * 24 * 365;
app.use(staticVirtualPathe, express.static(publicPath, {maxAge: CACHETIME}));
const frontVendorPath = path.resolve(__dirname, '../front-vendor');
app.use('/front-vendor', express.static(frontVendorPath, {maxAge: CACHETIME}));
let port = process.env.WENWEN_PORT ? process.env.WENWEN_PORT : 3000;
if (Number(port) < 1024) {
	console.log("warnings WENWEN_PORT must greater than 3000, now your process.env.WENWEN_PORT is less than 3000, the port will be set to 3000!  ");
	port = 3000;
}

//  RESTful API
app.use(bodyParser.json({type: "application/json"}));

app.put("/api/login", function (req, res) {
	const credentials = req.body;
	if (credentials.user === "admin" && credentials.password === "123456") {
		res.cookie("uid", "1");
		res.json({"user": credentials.user, "role": "ADMIN", "uid": 1});
	} else {
		res.status("500").send({"message": "Invalid user/password"});
	}
});


app.post("/api/newsList", function (req, res) {
	const newsList = [
		{
			key: 1,
			title: "系统问题",
			child: [
				{
					content: {
						subTitle: "系统登录不上?",
						mainContent: "常见的系统登录不上，可能是由于网络问题，请检查您的网络是否己经是否可用，如果还是不行，请跟页面上的提示进行操作，如果还不行，请联系吻吻科技客户!"

					},
					key: 501,
				},
			]
		},
		{
			key: 2,
			title: "配制问题",
			child: [
				{
					content: {
						subTitle: "免费开通云盾并提供云监控服务",
						mainContent: "丰富的镜像资源，支持公共镜像、自定义镜像、共享镜像和镜像市场，让您免安装，并快速部署操作系统和应用软件"
					},
					key: 502,
				},
			]
		},
		{
			key: 3,
			title: "用户指南",
			child: [
				{
					content: {
						subTitle: "如何 登录 Windows 实例？",
						mainContent: "从某个版本改成另外一个版本（比如从 Windows Server 2008 切换到 Windows Server 2012）。"
					},
					key: 503,

				},
			]
		},
	];

	res.json({
		newsList: newsList
	});
});


//资料设置-基本信息
app.post("/api/sysMsg", function (req, res) {
	const sysMsg = [
		{
			key: 1,
			createTime: "2016-11-17",
			title: "基辛格给奥巴马对华表现打B",
			msgCont: `基辛格给奥巴马对华表现打B+ 称大选令中方震惊`,
		},
		{
			key: 2,
			createTime: "2016-11-16",
			title: "协议将对用户使用本产品的行为产生法律约束力",
			msgCont: `协议将对用户使用本产品的行为产生法律约束力，您已承诺和保证有权利和能力订立本协议。用户开始使用本产品将视为已经接受本协议`,
		},
		{
			key: 3,
			createTime: "2016-11-14",
			title: "广州吻吻科技有限公司及其关联公司",
			msgCont: `广州吻吻科技有限公司及其关联公司（以下简称“吻吻”或“我们”）一向尊重并会严格保护用户在使用本产品时的合法权益（包括用户隐私、用户数据等）不受到任何侵犯`,
		},
		{
			key: 4,
			createTime: "2016-11-12",
			title: "北京八达岭野生动物园的东北虎园",
			msgCont: `7月23日，北京八达岭野生动物园的东北虎园内发生一起老虎伤人事故，32岁女游客赵某中途下车，被老虎拖走，其母周某下车去追遭老虎撕咬。该事件造成周某死亡，赵某受伤。此前网上一直流传一段事发时的视频，但并不是完整版。今天，事发时的完整版首度曝光。`,
		},
	];

	res.json({
		sysMsg: sysMsg
	});
});


//近30日用户走势图
app.post("/api/usersChart", function (req, res) {
	const datasets = [
		{
			label: "My First dataset",
			fillColor: "rgba(253,180,92,0.2)",
			strokeColor: "rgba(253,180,92,1)",
			pointColor: "rgba(220,220,220,1)",
			pointStrokeColor: "#fff",
			pointHighlightFill: "#fff",
			pointHighlightStroke: "rgba(220,220,220,1)",
			data: [65, 59, 80, 81, 56, 55, 40, 30, 90],

		},
		{
			label: "My Second dataset",
			fillColor: "rgba(151,187,205,0.2)",
			strokeColor: "rgba(151,187,205,1)",
			pointColor: "rgba(151,187,205,1)",
			pointStrokeColor: "#fff",
			pointHighlightFill: "#fff",
			pointHighlightStroke: "rgba(151,187,205,1)",
			data: [18, 48, 20, 19, 56, 27, 50, 40, 90],

		},
		{
			label: "My three dataset",
			fillColor: "rgba(70,191,189,0.2)",
			strokeColor: "rgba(70,191,189,1)",
			pointColor: "rgba(70,191,189,1)",
			pointStrokeColor: "#fff",
			pointHighlightFill: "#fff",
			pointHighlightStroke: "rgba(151,187,205,1)",
			data: [60, 59, 10, 91, 46, 55, 50, 80, 60],
		}
	]

	res.json({
		usersChartLastDay: {
			"labels": ["10-13", "10-17", "10-21", "10-25", "10-29", "11-03", "11-07", "11-11", "11-15"],
			"usersChart": datasets,
		}
	});
});

//资料设置-基本信息
app.post("/api/UseBaseInfor", function (req, res) {
	const UseBaseInfor = [
		{
			key: 1,
			name: "test",
			birth: "2016-09-14",
			sex: "male",
			college: "本科学历",
			professional: "工人",
			wechat: "微信账号",
			marriage: "未婚",
			tel: "123456789",
			address: "广东省，广州",
			remark: "备注",
			qq: "1235688",
			msg: {
				number: 1,
				msgTitle: "消息标题",
				msgContent: "消息",
			},
			headerIMG: "http://test-img-server.oss-cn-shenzhen.aliyuncs.com/app-admin/headimg.png",
			bannerBg: "http://test-img-server.oss-cn-shenzhen.aliyuncs.com/app-admin/profile.png"
		},

	];

	res.json({
		UseBaseInfor: UseBaseInfor
	});
});


// 统计分析首页-新增用户tab
app.post("/api/usersPieData", function (req, res) {
	//饼图数据

	const addNewPieData = [];
	addNewPieData.push(
		{
			menus: "新增用户",
			usersNum: 1590,
			pre: "50%",

		}, {
			menus: "活跃用户",
			usersNum: 1560,
			pre: "20%",

		},
		{
			menus: "启动次数",
			usersNum: 1560,
			pre: "10%",

		},
		{
			menus: "累计用户",
			usersNum: 1540,
			pre: "10%",

		},
		{
			menus: "总数",
			usersNum: 1520,
			pre: "10%",

		})
	const usersPieData = [
		{
			value: 90,
			color: "#F7464A",
			highlight: "#FF5A5E",
			label: "Red"
		},
		{
			value: 10,
			color: "#46BFBD",
			highlight: "#5AD3D1",
			label: "Green"
		},
		{
			value: 100,
			color: "#FDB45C",
			highlight: "#FFC870",
			label: "Yellow"
		}
	];

	res.json({
		usersPieData: usersPieData,
		addNewPieData: addNewPieData
	});
});


//系统新用户
app.post("/api/newUsers", function (req, res) {
	const data = [{
		key: "1",
		account: "admin",
		usesname: "wenwen5",
		state: "正常",
	}, {
		key: "2",
		account: "admin2",
		usesname: "wenwen5",
		state: "正常",
	}, {
		key: "3",
		account: "test1",
		usesname: "wenwen5",
		state: "正常",
	}, {
		key: "4",
		account: "test2",
		usesname: 54,
		state: "正常",
	}, {
		key: "5",
		account: "dss",
		usesname: "wenwen5",
		state: "正常",
	}, {
		key: "6",
		account: "test3",
		usesname: "wenwen5",
		state: "正常",
	}, {
		key: "7",
		account: "test3",
		usesname: "wenwen5",
		state: "正常",
	}, {
		key: "8",
		account: "test3",
		usesname: "wenwen5",
		state: "正常",
	}, {
		key: "9",
		account: "test3",
		usesname: "wenwen5",
		state: "正常",
	}, {
		key: "10",
		account: "test3",
		usesname: "wenwen5",
		state: "正常",
	}];

	res.json({
		newUsers: data
	});
});


//5.用户整体统计分析
app.post("/api/useWholeStatistic", function (req, res) {
	const useWholeStatisticData = [
		{
			addUsers: {
				name: "新增用户",
				data: 329,
			},
			activerUsers: {
				name: "活跃用户",
				data: 929,
			},
			startUsers: {
				name: "启动次数",
				data: 529,
			},
			totalUsers: {
				name: "累计用户",
				data: 12329,
			},
		},
	];

	res.json({
		useWholeStatistic: useWholeStatisticData
	});
});


// 新增新用户
app.post("/api/statNewUser", function (req, res) {
	var newUserList = [];
	newUserList.push(
		{
			statDate: "20161214171630",
			newCnt: "10",
		},
		{
			statDate: "20161215171630",
			newCnt: "20"
		},
		{
			statDate: "20161216171630",
			newCnt: "15"
		},
		{
			statDate: "20161217171630",
			newCnt: "40"
		}
	)
	res.json({
		rspInfo: {resultCode: "0", resultDesc: "OK"},
		newUserList: newUserList
	});
});


// 活跃新用户
app.post("/api/statActiveUser", function (req, res) {
	var activeUserList = [];
	activeUserList.push(
		{
			statDate: "20161214171630",
			newCnt: "20",
		},
		{
			statDate: "20161215171630",
			newCnt: "10"
		},
		{
			statDate: "20161216171630",
			newCnt: "15"
		},
		{
			statDate: "20161217171630",
			newCnt: "30"
		}
	)
	res.json({
		rspInfo: {resultCode: "0", resultDesc: "OK"},
		statActiveUser: activeUserList
	});
});


//硬件统计
app.post("/api/HarwareConStaistic", function (req, res) {
	let HarwareConStaistic = [];
	HarwareConStaistic.push(
		{
			Date: "05-02",
			newCnt: "0",
			SuccessData: 65,
			FailData: 18,

		},
		{
			Date: "05-03",
			newCnt: "10",
			SuccessData: 59,
			FailData: 48,

		},
		{
			Date: "05-04",
			newCnt: "20",
			SuccessData: 80,
			FailData: 40,

		},
		{
			Date: "05-05",
			newCnt: "30",
			SuccessData: 10,
			FailData: 19,

		},
		{
			Date: "05-06",
			newCnt: "40",
			SuccessData: 85,
			FailData: 86,

		},
		{
			Date: "05-07",
			newCnt: "50",
			SuccessData: 60,
			FailData: 55,

		},
		{
			SucessTotail: 90,
			FailTotail: 10,
			Totail: 100,

		}
	);
	res.json({
		rspInfo: {resultCode: "0", resultDesc: "OK"},
		HarwareConStaistic: HarwareConStaistic,
	});
});


app.post("/api/my", function (req, res) {
	res.json({"user": "admin", "role": "ADMIN", "uid": 1});
});

const log4js = require("log4js");
log4js.configure("build/m_log4js.json", {reloadSecs: 300});
app.post("/api/option/log", function (req, res) {
	const optionLogger = log4js.getLogger("optionLogger");
	optionLogger.info("userId:[", req.headers.userid, "], requestUrl:[", req.query.path, "], optionData:\n[", JSON.stringify(req.body), "]");
	res.json("");
});

app.listen(port, function (err, result) {
	if (err) {
		console.log(err);
	}
	console.log("Server running on port " + port);
});
