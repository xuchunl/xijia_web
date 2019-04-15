/**
 * Common modules
 */
define(function(require, exports, module) {
	var jsSHA = require('sha');
	var common = {

		/**
		 * 引入JS
		 * @param {Object} paths
		 */
		import : function(paths) {
			if(paths && paths.length) {
				for(var i=0; i<paths.length; i++) {
					var path = paths[i];
					var a = document.createElement("script");
				    a.type = "text/javascript"; 
				    a.src=path; 
				    var head=document.getElementsByTagName("head")[0];
				    head.appendChild(a);
				}
			}
		},
		
		
		loadScript: function(url, callBack){
			var script = document.createElement("script") 
			script.type = "text/javascript"; 
			if (script.readyState){ //IE 
				script.onreadystatechange = function(){ 
					if (script.readyState == "loaded" || script.readyState == "complete"){ 
						script.onreadystatechange = null; 
						if(callBack) callBack(); 
					} 
				}; 
			} else { //Others: Firefox, Safari, Chrome, and Opera 
				script.onload = function(){ 
					if(callBack) callBack(); 
				}; 
			} 
			script.src = url; 
			document.body.appendChild(script); 
		},
		
		
		/**
		 * 取当前页面名称(带后缀名)
		 */
    	currPage : function() {
	        var strUrl=location.href;
	        var arrUrl=strUrl.split("/");
	        var strPage=arrUrl[arrUrl.length-1].split("?")[0];
	        return {name : strPage, url : strUrl };
	    },
		
		/**
		 * 随机字符串(a-zA-Z0-9 默认32位)
		 * @param {Object} len 指定长度
		 */
		randomString: function(len) {
			len = len || 32;
			var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
			var maxPos = $chars.length;
			var str = '';
			for(i = 0; i < len; i++) {
				str += $chars.charAt(Math.floor(Math.random() * maxPos));
			}
			return str;
		},
		randomNumber: function(len) {
			len = len || 10;
			var $chars = '1234567890';
			var maxPos = $chars.length;
			var str = '';
			for(i = 0; i < len; i++) {
				var ch = $chars.charAt(Math.floor(Math.random() * maxPos));
				if(i==0 && ch == '0') {
					i = i-1;
				} else {
					str += ch;
				}
			}
			return Number(str);
		},
		
		/**
		 * 时间戳
		 */
		timestamp : function() {
			return new Date().getTime();
		},
	
		/**
		 * 字符串转SHA-1
		 * @param {Object} str
		 */
		hashSHA1: function(str) {
			var hashObj = new jsSHA('SHA-1', 'TEXT', {
				numRounds: 1
			});
			hashObj.update(str);
			var shaStr = hashObj.getHash('HEX');
			return shaStr;
		},
		
		/**
		 * 获取地址栏参数
		 * @param {Object} key
		 */
		getParam : function(key) {
			var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r) {
				return unescape(r[2]);
			}
			return null;
		},
		
		/**
		 * 构造链接地址
		 * @param {Object} src
		 * @param {Object} base_path
		 */
		canonicalURL : function(src, base_path) {
			var root_page = /^[^?#]*\//.exec(location.href)[0], 
			root_domain = /^\w+\:\/\/\/?[^\/]+/.exec(root_page)[0], 
			absolute_regex = /^\w+\:\/\//; 
			
			// is `src` is protocol-relative (begins with // or ///), prepend protocol 
			if (/^\/\/\/?/.test(src)) 
			{ 
			src = location.protocol + src; 
			} 
			// is `src` page-relative? (not an absolute URL, and not a domain-relative path, beginning with /) 
			else if (!absolute_regex.test(src) && src.charAt(0) != "/") 
			{ 
			// prepend `base_path`, if any 
			src = (base_path || "") + src; 
			} 
			
			// make sure to return `src` as absolute 
			return absolute_regex.test(src) ? src : ((src.charAt(0) == "/" ? root_domain : root_page) + src); 
		},
		
		canonicalPath : function(src, base_path) {
			var root_page = /^[^?#]*\//.exec(location.href)[0], 
			root_domain = /^\w+\:\/\/\/?[^\/]+/.exec(root_page)[0], 
			absolute_regex = /^\w+\:\/\//; 
			
			// is `src` is protocol-relative (begins with // or ///), prepend protocol 
			if (/^\/\/\/?/.test(src)) 
			{ 
			src = location.protocol + src; 
			} 
			// is `src` page-relative? (not an absolute URL, and not a domain-relative path, beginning with /) 
			else if (!absolute_regex.test(src) && src.charAt(0) != "/") 
			{ 
			// prepend `base_path`, if any 
			src = (base_path || "") + src; 
			} 
			
			// make sure to return `src` as absolute 
			var temp = absolute_regex.test(src) ? src : ((src.charAt(0) == "/" ? root_domain : root_page) + src); 
			return temp.replace(root_domain,"");
		},
		
		/**
		 * Ajax	调用
		 * 数据格式: {url : url, type : type, data : data, error : function(){}, success : function(){}}
		 */
		doAjax: function(jsonData) {
			jsonData.type = jsonData.type || 'get';
			jsonData.data = jsonData.data || {};
			jsonData.dataType = jsonData.dataType || 'json';
			$.ajax({
				type: jsonData.type,
				url: jsonData.url,
				dataType: jsonData.dataType,
				contentType : jsonData.contentType ? jsonData.contentType :'application/x-www-form-urlencoded' ,
				//headers : jsonData.headers,
				//processData : jsonData.processData,
				data: jsonData.data,
				timeout:jsonData.timeout ? jsonData.timeout : 0, //超时时间：0默认不启用超时
				success: function(data) {
					// 成功执行回调处理
					if(!data) {
						data = {
							status : data.status ? true : false,
							errorMsg : data.errorMsg ? data.errorMsg : "server did not return a result" 
						};
						
					}
					if(jsonData.success) jsonData.success(data);
				},
				error: function(errData) {
					var errmsg = "server does not respond";
					if(errData && errData.status==0 && errData.statusText && errData.statusText=='error'){
						errmsg="网络状况不佳,请检查你的网络!";
					}else if(errData && errData.status==0 && errData.statusText && errData.statusText=='timeout'){
						errmsg="服务请求超时,请刷新重试!";
					}else if(errData && errData.status==404){
						errmsg="没有发现文件、查询或URl!";
					} 
					if(jsonData.error) jsonData.error(errmsg);
				}
			});
		},
		/**
		 * 加载参数模板数据
		 */
		loadSysSysinit: function(jsonData) {
			common.doAjax({
				url: App.context.SERVER_URL + "wechatCommomData/loadSysSysinit",
				type: "POST",
				data:{},
				success: function(res) {
					if(res.status && res.data){
						App.context.commonData.sysSysInitParams = res.data;
					}
				},
				error: function(res) {}
			});
		},
		/**
		 * 获取openid
		 */
		getOpenId:function (code,appid) {
			var data = {
				"code": code,
				"appid":appid
			};

			if(!data.code||!data.appid){
				return;
			}

			var dataString = JSON.stringify(data);
			var url = App.context.SERVER_URL + "wechat/accessOAuth2Token";
			common.doAjax({
				type : "POST",
				url : url,
				contentType : 'application/json',
				data :dataString,
				success : function(result) {
					if(result.status) {
						App.context.commonData.wxinfo.pay_appid = result.data.appid;
						App.context.commonData.wxinfo.pay_openid = result.data.openid;
						App.context.commonData.wxinfo.pay_map[result.data.appid] = result.data.openid;
						App.cacheCommonData();
					}
				},
				error: function(result) {
					mui.toast(result.errorMsg || "查询openid失败！");
				}
			})
		},
		toPageWsjctIndex : function() {
			if(App.context.commonData.wxinfo.pay_appid == "wx6334abe652adb0c0" || App.context.commonData.wxinfo.appid == "wx6334abe652adb0c0"){
				window.location.href = "https://mobile.baiyunairport.com.cn/#/index";
			}else{
				App.Go({target : "../common/index.html"}); 
			}
		
		}
	};
	module.exports = common;
});