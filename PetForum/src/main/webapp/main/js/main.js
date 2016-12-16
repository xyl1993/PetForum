//模块化
var mainModule = angular.module('mainModule', ['ui.router',
				'ngResource', 'ngSanitize','ngWebSocket']);

/**
 * websocket连接
 */
mainModule.factory('websocket',function($http){
	var wb = {};
	var ws;//WebSocket对象
	
	wb.connection = function(userId){
		var wsUrl = rain.config.web_socket_server+"/PetForum/websocket/"+userId;//支持WebSocket协议的服务器端地址
        ws = new WebSocket(wsUrl);
		//注册各类回调
        ws.onopen = function () {
        	//尝试向服务端发送消息
            ws.send("web端登陆");
//            ws.onmessage = function (receiveMsg) {
            	//关闭连接
//				ws.close();
//				//清掉数据
////				alert('您在其他地方已登录，请重新登陆，若非本人操作，建议您修改密码');
//				$('#noticeModal').modal('show');
//				$('#noticeModal').on('hide.bs.modal', function () {
//					window.location.href= KQTJ.config.login_url;
//				})
//				sessionStorage.removeItem("token");
//            };
        };
        ws.onclose = function () {
    		console.log('连接被关闭.');
		};
		ws.onmessage = function(message) {
	        listener(JSON.parse(message.data));
	    };
	};
	wb.sendMessage = function(message){
	    if(ws&&ws!=null){
	        ws.send(JSON.stringify(message));
	    }
	}
	return wb;
});
mainModule.factory('myWebsocket', ['$rootScope','$websocket',function($rootScope,$websocket) {
  // Open a WebSocket connection 
  var dataStream = $websocket(rain.config.web_socket_server+'/PetForum/websocket/'+sessionStorage.getItem('userId'));
 
  var collection = [];
 
  dataStream.onMessage(function(message) {
  	$rootScope.message = message.data;
    collection.push(message);
    $('#info-alert').show();
  });
 
  var methods = {
    collection: collection,
    get: function() {
      dataStream.send(JSON.stringify({ action: 'get' }));
    },
    send:function(message){
       dataStream.send(JSON.stringify(message));
    }
  };
 
  return methods;
}]);
//全局配置
mainModule.run(function($rootScope, $state, $http, $stateParams, $location,$timeout,$window,myWebsocket) {
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
	$rootScope.message = "";
	$rootScope.token = sessionStorage.getItem('token');
	// 路由调整完成后根据state添加标志
	$rootScope.$on('$stateChangeSuccess', 
		function(event, toState, toParams, fromState){
          var toStateUrl = toState.url;
          
		});
});

///路由配置
mainModule.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider) {
	$stateProvider.state('home',{
		url : '/home',               //home
		templateUrl : 'index.html'
	}).state('list',{
		url : '/list',               //关于我
		templateUrl : 'wz.html'
	}).state('detail',{
		url : '/detail/:id',               //经验
		templateUrl : 'wzxq.html'
	}).state('miner',{
		url : '/miner',               //技能
		templateUrl : '/miner'
	});
	$urlRouterProvider.otherwise('/list');   //默认home
}]);
//mainCtrl
mainModule.controller('mainCtrl', ['$scope','$rootScope','$http','myService', function($scope,$rootScope,$http,myService){
    var token = sessionStorage.getItem('token');
    $scope.userName = sessionStorage.getItem('userName');
    $scope.hotActDatas = [];
    var loginStatus = false;
    //未登录
    if(!token || token=='null'){
    	$('.dl-li').show();
    	$('.menu-item-login').show();
    	$('.menu-item-info').hide();
    	$('.gr-li').hide();
    	$('.my-head-li').hide();
    	loginStatus = false;
    }else{
    	var _url = 'PetForum/login/getUserDetail';
 		myService.setUrl(_url);  //方法设置路径
 		myService.setToken(token);
 		//call请求回调
		myService.requestToken().then(function(res){
		  if(res.success){
		  	$rootScope.userInfoDetail = res.data;
		  	$rootScope.myHeadStyle = {
		        "background-image" : "url("+res.data.headUrl+")"
		    }
		  }
		});
        $('.dl-li').hide();
    	$('.gr-li').hide();
    	$('.menu-item-login').hide();
    	$('.my-head-li').show();
    	$('.menu-item-info').show();
    	loginStatus = true;
    }
    getHotAct();
    getNewAct();
    getInfoNotRead();
    $('.responsive-nav').find('option').each(function(){
        var $this = $(this);
        if(loginStatus){
            //登录
        	if($this.val()=='login'){
        	    $this.remove();
        	}
        }else{
            //未登录
        	if($this.val()=='me' || $this.val()=='zx'){
        	    $this.remove();
        	}
        }
    })
    
    /****注销******/
	$scope.loginout = function(){
		var _url = 'PetForum/login/userLogout';
 		myService.setUrl(_url);  //方法设置路径
 		myService.setToken(token);
 		//call请求回调
		myService.requestToken().then(function(res){
		  if(res.success){
		  	sessionStorage.removeItem("token");
			sessionStorage.removeItem("userName");
			sessionStorage.removeItem("userId");
			window.location.href= "/PetForum";
		  }
		});
	}
    
    /**获取热门文章**/
    function getHotAct(){
 		var _url = 'PetForum/actical/getHotActList';
 		myService.setUrl(_url);  //方法设置路径
 		//call请求回调
		myService.requestData().then(function(res){
		  if(res.success){
		  	$scope.hotActDatas = res.data;
		  }
		});
    }
    
    /**获取最新文章**/
    function getNewAct(){
 		var _url = 'PetForum/actical/getNewActList';
 		myService.setUrl(_url);  //方法设置路径
 		//call请求回调
		myService.requestData().then(function(res){
		  if(res.success){
		  	$scope.newActDatas = res.data;
		  }
		});
    }
    /**意见反馈弹出框**/
    $scope.yjfkClick = function(){
    	$('body').removeClass('m-nav-show');
        $("#xgmmModal").modal('show');
	}
	/******获取未读消息树********/
	function getInfoNotRead(){
	  $http({
	     method: 'post', url: './actical/getInfoNotRead',headers : {'token' : token}
	  }).success(function(res){
	       if(res.success){
	           $scope.notReadCount = res.data;
	           if(res.data>0){
	               $('.info-count').show();
	               $('.not-info-count').show();
	           }
	       }
	  }) 
	}
}])

//意见反馈controller 
mainModule.controller('yjfkCtrl', ['$scope','myService', '$http',function($scope,myService,$http){
  $("#editPassForm").validate({
  	debug:true,
    rules: {
      up_title: {
        required: true,
        minlength: 2,
     	maxlength:14
      },
      up_email: {
        required: true
      },
      up_text: {
        required: true,
        minlength: 5,
        maxlength:500
      }
    },
    messages: {
      up_title: {
        required: "请输入标题",
        minlength: "标题长度不能小于 2个字符",
        maxlength:"标题长度不能多于14个字符"
      },
      up_email: {
        required: "请输入邮箱"
      },
      up_text: {
        required: "请输入建议",
        minlength: "建议长度不能小于 6个字母",
        maxlength: "建议长度不能多于500个字符"
      }
    },
    submitHandler: function(form) {
	    var data = {
	        title:$scope.up_title,
	        email:$scope.up_email,
	        text:$scope.up_text
	    };
		var _url = 'PetForum/mails/sendMail';
 		myService.setUrl(_url);  //方法设置路径
 		myService.setData(data);
 		$('#yj-subtn').attr({"disabled":"disabled"});
 		//call请求回调
		myService.requestData().then(function(res){
		  if(res.success){
		  	$('#yj-subtn').removeAttr("disabled");
		  	$("#xgmmModal").modal('hide');
			$('.info-sz-dyn').show();
			$('.sz-dyn').empty();
			var _html ='<strong>发送成功</strong>';
	    	$('.sz-dyn').append(_html);
	    	$('.info-sz-dyn').fadeOut(4000, function () {
	  		});
		  }else{
		      alert(res.message);
		  }
		});
	}  
  })
}])

//文章列表
mainModule.controller('actCtrl', ['$scope','myService', '$http',function($scope,myService,$http){
	var token = sessionStorage.getItem('token');
	 // 默认显示页面为3条
	var pageSize =3;
	 // 当前页为第一页
	var currentPage = 1;
	 // 结果集
	$scope.actDatas = [];
	var _data = {};
	//先调用一次获取第一页的数据
	getActList(1,_data);
	
	function initPage(pages){
	 	$('#pagination').twbsPagination({
			 totalPages: pages,
			 visiblePages: 5,
			 first: '首页',
			 prev: '上一页',
			 next: '下一页',
			 last: '末页',
			 onPageClick: function (event, page) {
				 getActList(page,_data);
			 }
		 });
	 }
	 $('#act-search-btn').click(function(){
	     _data = {searchText:$('#searchText').val()};
	     getActList(1,_data);
//	 	open_exe("file:///D:/Program%20Files%20(x86)/江苏如云信息科技股份有限公司/获取网页Cookie/WebBrowser/bin/Debug/WebBrowser.exe");
	 })
 	function getActList(currentPage,_data){
 		var _url = 'PetForum/actical/getActList/paging/'+currentPage + '/' + pageSize;
 		myService.setUrl(_url);  //方法设置路径
 		myService.setData(_data);
 		//call请求回调
		myService.requestData().then(function(res){
		  if(res.success){
		  	$scope.actDatas = res.data.list;
		  	$scope.counts = res.data.recordCount;//总共的条数
			$scope.pageCount = res.data.pageCount;//总共的页数
			for(var i=0,len=$scope.actDatas.length;i<len;i++){
		  	    $scope.actDatas[i].titleImgArr =  $scope.actDatas[i].titleImg?$scope.actDatas[i].titleImg.split(","):[];
		  	}
			if($scope.actDatas.length > 0){
				 initPage($scope.pageCount);
			 }
		  }
		});
	 }
	 //删除文章
	 $scope.del = function(id,aId,index){
 	    if(confirm("确定要删除吗？")){
	     	var _url = 'PetForum/actical/delAct/'+aId
	 		myService.setUrl(_url);  //方法设置路径
	 		myService.setToken(token);
	 		//call请求回调
			myService.requestToken().then(function(res){
			  if(res.success){
				  	$("#xgmmModal").modal('hide');
					$('.info-sz-dyn').show();
					$('.sz-dyn').empty();
					var _html ='<strong>删除成功</strong>';
			    	$('.sz-dyn').append(_html);
			    	$('.info-sz-dyn').fadeOut(4000, function () {
			  		});
			  		$scope.actDatas.splice(index,1);
			  	}else{
			  		if(res.code=="0101"){
						alert("您未登录或登录超时，请重新登录");
					}else{
					    alert(res.message);
					}
			  	}
			});
	     }
	 };
	 
	 /*************调用外部程序************/
	 //打开工具-》选项-》安全，首先把含有这个脚本的网页加入到本地站点
//编辑自定义级别，将按将对没有标记为安全的ActiveX进行初始化。。设为启用
	 function open_exe(command){    
	    window.oldOnError = window.onerror;
	    window._command = command;
	    window.onerror = function (err) {
            if (err.indexOf('utomation') != -1) 
            {
                alert('命令' + window._command + ' 已经被用户禁止！'); 
                return true;
            }
            else 
                return false;
        };
	    //-----------
	    var wsh = new ActiveXObject('wscript.shell');
	    if (wsh){
	    	try{
	    		wsh.run(command);
	    	}catch(e){
	    	    alert('找不到文件"'+shellp+'"(或它的组件之一)。请确定路径和文件名是否正确.');
	    	}
	    	
	    }
	    wsh = null;
	    window.onerror = window.oldOnError;
	}
}]);

//文章详情
mainModule.controller('wzxqCtrl', ['$scope','$stateParams','$http','myWebsocket','myService',
function($scope,$stateParams,$http,myWebsocket,myService){
	var token = sessionStorage.getItem('token');
	$scope.commentFlag = false;          //回复引用框判断标志
	$scope.commentInContent = "";        //引用的评论内容
	$scope.plData = {};
	//获取文章详情
    getActDetail();
	
	if(!token || token=='null'){//为登录
	    $('.pl-content').hide();
	}else{
	    $('.ts-dl').hide();
	}
	
	 // 默认显示页面为3条
	var pageSize =10;
	 // 当前页为第一页
	var currentPage = 1;
	//获取评论列表
	$scope.plListDatas = [];//评论list的对象
	//先调用一次获取评论第一页的数据
	getPlList(1);
	
	function initPage(pages){
	 	$('#pagination').twbsPagination({
			 totalPages: pages,
			 visiblePages: 5,
			 first: '首页',
			 prev: '上一页',
			 next: '下一页',
			 last: '末页',
			 onPageClick: function (event, page) {
				 getPlList(page);
			 }
		 });
	 }
	//提交评论
	$scope.submit = function(){
		
		if(!token || token=='null'){
		    alert('评论前请先登录');
		    $('.ts-dl').show();
		    $('.pl-content').hide();
		}else{
			var _url = 'PetForum/actical/saveReplay',
        	_data = $scope.plData;
	        _data.invitationId = $stateParams.id;
	        myService.setUrl(_url);  //方法设置路径
			myService.setData(_data);
			myService.setToken(token);
			//call请求回调
			myService.requestTokenAndData().then(function(res){
			  if(res.success){
			  	$scope.plData.content = "";
			  	$("#xgmmModal").modal('hide');
				$('.info-sz-dyn').show();
				$('.sz-dyn').empty();
				var _html ='<strong>评论成功</strong>';
		    	$('.sz-dyn').append(_html);
		    	$('.info-sz-dyn').fadeOut(4000, function () {
		  		});
		  	    getPlList(1);
		  	    if($scope.plData.replayUserId !=null && $scope.plData.replayUserId !='undefined' ){
		  	        sendWebsocket(sessionStorage.getItem('userId'),$scope.plData.replayUserId);
		  	    }
		  	    sendWebsocket(sessionStorage.getItem('userId'),$scope.actData.userInfo.id);
			  }else{
			  		if(res.code=="0101"){
						alert("您未登录或登录超时，请重新登录");
					}else{
					    alert(res.message);
					}
			  	}
			});
		}
	}
	
	function sendWebsocket(form,to){
	    var message = {form:form,to:to,text:rain.config.alert_message};
		myWebsocket.send(message);
	}
	
	/**
	 * 点击回复按钮响应事件
	 */
	$scope.comment = function(id,userId,content){
		if(!token){
		    alert('评论前请先登录');
		    return
		}
	    $scope.plData.replayId = id;          //回复引用的id
	    $scope.plData.replayUserId = userId;          //回复引用人的id
	    $scope.plData.fpUserId = $scope.actData.userInfo.id; //文章发布人的id
	    $scope.commentFlag = true;
	    $scope.commentInContent = content;
	    $('.commentBlock').removeClass('ng-hide');
	    $('.commentBlock').addClass('ng-show');
	    $('#comment').focus();
	}
	
	/**
	 * 取消引用
	 */
	$scope.cancelComment = function(){
		$('.commentBlock').removeClass('ng-show');
		$('.commentBlock').addClass('ng-hide');
	    delete($scope.plData.replayId);         
	    delete($scope.plData.replayUserId);         
	    delete($scope.plData.fpUserId);         
	}
	
	/**
	 * 删除评论
	 */
	$scope.delcomment = function(replayId){
		
	 	if(!token || token=='null'){
		     alert('您没有权限这样操作喔！');
	 	}else{
	 	    if(confirm("确定要删除吗？")){
		     	var _url = 'PetForum/actical/delReplay/'+replayId;
				myService.setUrl(_url);  //方法设置路径
				myService.setToken(token);
				//call请求回调
				myService.requestToken().then(function(res){
				  if(res.success){
					$('.info-sz-dyn').show();
					$('.sz-dyn').empty();
					var _html ='<strong>删除成功</strong>';
			    	$('.sz-dyn').append(_html);
			    	$('.info-sz-dyn').fadeOut(4000, function () {
			  		});
				  	getPlList(1);
				  }else{
				  		if(res.code=="0101"){
    						alert("您未登录或登录超时，请重新登录");
    					}else{
    					    alert(res.message);
    					}
				  	}
				});
		     }
	 	}
	}
	
	/**
	 * 获取文章详情
	 */
	function getActDetail(){
	    var _url = 'PetForum/actical/getActDetail',
        _data={id:$stateParams.id};
		myService.setUrl(_url);  //方法设置路径
		myService.setData(_data);
		//call请求回调
		myService.requestData().then(function(res){
		  if(res.success){
		  	$scope.actData = res.data[0];
		  	$scope.plData.fpUserId = $scope.actData.userInfo.id;
		  }
		});
	}
	
	/**
	 *  获取评论列表
	 */
	function getPlList(currentPage){
	    $http({
		   method: 'post',
		   url: './actical/getplList/paging/'+currentPage+'/'+pageSize+'/'+$stateParams.id
		}).success(function(res){
		  	if(res.success){
		  		$scope.plListDatas = res.data.list;
		  		$scope.counts = res.data.recordCount;//总共的条数
				$scope.pageCount = res.data.pageCount;//总共的页数
				if($scope.plListDatas.length > 0){
					 initPage($scope.pageCount);
				 }
		  	}
		}) 
	}
}]);
//图片添加服务器名
mainModule.filter('imgfilter',function() {
  return function(url){
    if(url){
      return rain.config.web_server+url;
    }
  }
});
//删除按钮是否可见
mainModule.filter('delfilter',['$rootScope',function($rootScope) {
  return function(userId){
  	var userInfo = $rootScope.userInfoDetail
	if(!userInfo || userInfo=='null'){
	    return false
	}
    if(userInfo.id==1 || userId==userInfo.id){
      return true
    }else{
      return false
    }
  }
}]);
//angularjs变量text文件需要做特殊处理
mainModule.filter('to_trusted', ['$sce', function ($sce) {
	return function (text) {
	    return $sce.trustAsHtml(text);
	};
}]);
//点击个人资料弹窗（旧）
mainModule.directive('moduleClick', ['$state',function($state){
  return {
    link: function($scope, iElm, iAttrs) {
      iElm.bind('click', function(event) {
      	if($('.menu-me-container').is(":hidden")){
      	    $('.menu-me-container').show();
      	}else{
      	    $('.menu-me-container').hide();
      	}
      });
    }
  };
}]);
//点击个人头像弹窗（新）
mainModule.directive('moduleNewClick', ['$state',function($state){
  return {
    link: function($scope, iElm, iAttrs) {
      iElm.bind('click', function(event) {
      	if($('.user-info-dropdown').is(":hidden")){
      	    $('.user-info-dropdown').show();
      	}else{
      	    $('.user-info-dropdown').hide();
      	}
      });
    }
  };
}]);
//消息通知弹出框关闭
mainModule.directive('closeAlert', ['$state',function($state){
  return {
    link: function($scope, iElm, iAttrs) {
      iElm.bind('click', function(event) {
      	$('#info-alert').hide();
      });
    }
  };
}]);
//调整到个人信息
mainModule.directive('returnInfo', ['$state',function($state){
  return {
    link: function($scope, iElm, iAttrs) {
      iElm.bind('click', function(event) {
      	location.href='../PetForum/user.html#/myInfo';
      });
    }
  };
}]);
//点击遮罩层指令
mainModule.directive('maskClick', ['$state',function($state){
  return {
    link: function($scope, iElm, iAttrs) {
      iElm.bind('click', function(event) {
      	$('body').removeClass("m-nav-show");
      });
    }
  };
}]);
//点击目录指令
mainModule.directive('menuClick', ['$state',function($state){
  return {
    link: function($scope, iElm, iAttrs) {
      iElm.bind('click', function(event) {
      	$('body').addClass("m-nav-show");
      });
    }
  };
}]);
//显示个人信息列表
mainModule.directive('showInfoDetail', ['$state',function($state){
  return {
    link: function($scope, iElm, iAttrs) {
      iElm.bind('click', function(event) {
      	$('.menu-info-detail').show();
      });
    }
  };
}]);
//判断文章是否存在公共服务
mainModule.factory('exitfxService', ['$http','$rootScope',function ($http,$rootScope) {  
	  return {  
		    query : function(id) { 
	    		return $http({method: 'post', url: './actical/findHasById/'+id});
		    } 
		  };  
		}]);
//分享到第三方
mainModule.directive('spareFriderQ',['$http','exitfxService',function($http,exitfxService){
	return{
		link:function(scope,iElement,attrs){
			$(iElement).click(function(){
				//分享的动态跟发布的动态分开判断
				var id,url,dynamicId;
				id = scope.actData.id;
				var nm;
				//分享的详情
				//分享类型
				var fxtype = iElement.attr('name');
				var title = scope.actData.title;
				var picUrl = rain.config.url_share+"/PetForum/images/favicon.png";
				url =   rain.config.url_share+"/PetForum/#/detail/"+id;
				
				//根据资讯id，判断资讯是否存在
				exitfxService.query(id).success(function(res){
					if(res.success){
						fxzxMethod(url,fxtype,picUrl,title);
					}else{
						alert(res.message);
						window.location.href= rain.config.web_server+"/PetForum";
					}
				})
			});
		}
	};
}]);

//分享到第三方
function fxzxMethod(url,fxtype,picUrl,title){
	if(fxtype==='qq'){
		// qq好友
		window.open("http://connect.qq.com/widget/shareqq/index.html?url="+encodeURIComponent(url)+"&summary="+encodeURIComponent(url));
	}else if(fxtype==='sina'){
		//新浪微博
		window.open("http://service.weibo.com/share/share.php?pic=" +encodeURIComponent(picUrl) +"&title=" +   
				encodeURIComponent(title.replace(/&nbsp;/g, " ").replace(/<br \/>/g, " "))+ "&url=" + encodeURIComponent(url));  
	}else if(fxtype==='tx'){
		//腾讯微博
		window.open('http://v.t.qq.com/share/share.php?url='+encodeURIComponent(url)+  
				'&title='+encodeURI(title)+'&appkey='+encodeURI("aa"));       
	}else{
		//朋友圈
		$("div#friend").html("<div id='qrcode'></div>");
		$('#qrcode').qrcode({width: 164,height:164,text: url});
		$('#shareModal').on('hidden.bs.modal', function (e) {
		  $('#qrcode').remove();
		});
		$('#shareModal').modal('show');
	}
}
/**
  *普通ajax请求公共服务
  */
 mainModule.factory('myService',['$http','$q',function($http,$q){
    var service = {},
        baseUrl /*:String*/= '../',
        _url /*:String*/= '',
        _finalUrl /*:String*/= '',
        _token /*:String*/= '',
        _deviceSystem /*:Boolean*/=0,
        _data  /*:Object*/= {};
    
    /**
     * 处理请求路径
     */
    var makeUrl = function(){
      _url = _url.split(' ').join('+');
      _finalUrl = baseUrl +_url;
      return _finalUrl
    }
    
    /**
     * 设置请求路径
     */
    service.setUrl = function(url){
      _url = url;
    }
    
    service.setToken = function(token){
      _token = token;
    }
    
    service.setData = function(data){
      _data = data;
    }
    
    service.setDeviceSystem = function(deviceSystem){
      _deviceSystem = deviceSystem;
    }
    /**
     * 获取请求路径
     */
    service.getUrl = function(){
      return _url;
    }
    
    service.getToken = function(){
      return _token;
    }
    
    service.getData = function(){
      return _data;
    }
    
    /**
     *  $q.defer() 构建的 deffered 实例的几个方法的作用。
     *  如果异步操作成功，则用resolve方法将Promise对象的状态变为“成功”（即从pending变为resolved）；如果异步操作失败，
     *  则用reject方法将状态变为“失败”（即从pending变为rejected）。最后返回 deferred.promise ，我们就可以链式调用then方法。
     */
    service.callItuns = function(){
      makeUrl();
      //通过 调用 $q.defferd 返回deffered对象以链式调用
      /**
       * deffered 对象的方法
       * 1.resolve(value)：在声明resolve()处，表明promise对象由pending状态转变为resolve。 成功状态
       * 2.reject(reason)：在声明resolve()处，表明promise对象由pending状态转变为rejected。失败状态
       * 3.notify(value) ：在声明notify()处，表明promise对象unfulfilled状态，在resolve或reject之前可以被多次调用。
       */
      var defrred = $q.defer();
      $http({
	     method: 'post', url: _finalUrl
	  }).success(function(res){
	       defrred.resolve(res);
	  }) 
	  /**
	   * 返回promise对象
	   * 1.then(errorHandler, fulfilledHandler, progressHandler)：
	   * then方法用来监听一个Promise的不同状态。errorHandler监听failed状态，
	   * fulfilledHandler监听fulfilled状态，progressHandler监听unfulfilled（未完成）状态。
	   * 此外,notify 回调可能被调用 0到多次，提供一个进度指示在解决或拒绝（resolve和rejected）之前。
	   * 2.catch(errorCallback) —— promise.then(null, errorCallback) 的快捷方式
	   * 3.finally(callback) ——让你可以观察到一个 promise 是被执行还是被拒绝, 但这样做不用修改最后的 value值。
	   *  这可以用来做一些释放资源或者清理无用对象的工作,不管promise 被拒绝还是解决。 更多的信息请参阅 完整文档规范.
	   */
	  return defrred.promise;
    }
    /**
     * 请求中带data参数
     */
    service.requestData = function(){
      makeUrl();
      //通过 调用 $q.defferd 返回deffered对象以链式调用
      var defrred = $q.defer();
      $http({
	     method: 'post', url: _finalUrl,data:_data
	  }).success(function(res){
	       defrred.resolve(res);
	  }) 
	  return defrred.promise;
    }
    /**
     * 请求带token
     */
    service.requestToken = function(){
      makeUrl();
      //通过 调用 $q.defferd 返回deffered对象以链式调用
      var defrred = $q.defer();
      $http({
	     method: 'post', url: _finalUrl,headers : {'token' : _token}
	  }).success(function(res){
	       defrred.resolve(res);
	  }) 
	  return defrred.promise;
    }
    /**
     * 请求带token and data
     */
    service.requestTokenAndData = function(){
      makeUrl();
      //通过 调用 $q.defferd 返回deffered对象以链式调用
      var defrred = $q.defer();
      $http({
	     method: 'post', url: _finalUrl,data:_data,headers : {'token' : _token}
	  }).success(function(res){
	       defrred.resolve(res);
	  }) 
	  return defrred.promise;
    }
    /**
     * 请求带token and data and deviceSystem
     */
    service.requestTokenAndDataDev = function(){
      makeUrl();
      //通过 调用 $q.defferd 返回deffered对象以链式调用
      var defrred = $q.defer();
      $http({
	     method: 'post', url: _finalUrl,data:_data,headers : {'token' : _token,'deviceSystem' : _deviceSystem}
	  }).success(function(res){
	       defrred.resolve(res);
	  }) 
	  return defrred.promise;
    }
    return service;
 }]);
 
 
 /** 
     * 遍历表格内容返回数组
     * @param  Int   id 表格id
     * @return Array
     */
function getTableContent(id){
    var mytable = document.getElementById(id);
    var data = [],_obj = {},paramsData = [];
    for(var i=0,rows=mytable.rows.length; i<rows; i++){
        for(var j=0,cells=mytable.rows[i].cells.length; j<cells; j++){
        	switch(j){
        	    case 0:_obj.a = mytable.rows[i].cells[0].innerHTML;
        	    	break;
        	    case 1 :_obj.b = mytable.rows[i].cells[1].innerHTML;
        	        break;
        	}
            if(j==cells){
                paramsData.push(_obj);
            }
        }
    }
    return paramsData;
}