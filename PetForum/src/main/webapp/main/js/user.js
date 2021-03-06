//模块化
var mainModule = angular.module('mainModule', ['ui.router',
				'ngResource', 'ngSanitize','ngWebSocket']);
				
mainModule.factory('myWebsocket', ['$rootScope','$websocket',function($rootScope,$websocket) {
  // Open a WebSocket connection 
  var dataStream = $websocket(rain.config.web_socket_server+'/PetForum/websocket/'+sessionStorage.getItem('userId'));
 
  var collection = [];
 
  dataStream.onMessage(function(message) {
  	console.log(message);
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
mainModule.run(function($rootScope, $state, $http, $stateParams,myWebsocket) {
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
	// 路由调整完成后根据state添加标志
	$rootScope.$on('$stateChangeSuccess', 
		function(event, toState, toParams, fromState){
          var toStateUrl = toState.url;
          
		});
	});

///路由配置
mainModule.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider) {
	$stateProvider.state('mySend',{
		url : '/mySend',               //home
		templateUrl : 'mySend.html'
	}).state('myReplay',{
		url : '/myReplay',               //关于我
		templateUrl : 'myReplayAct.html'
	}).state('myInfo',{
		url : '/myInfo',               //关于我
		templateUrl : 'myInfo.html'
	})
	$urlRouterProvider.otherwise('/mySend');   //默认home
}]);


//mainCtrl
mainModule.controller('mainCtrl', ['$scope','$rootScope','myService', function($scope,$rootScope,myService){
	$rootScope.userName = sessionStorage.getItem('userName');
    $scope.token = sessionStorage.getItem('token');
    $scope.hotActDatas = [];
    //未登录
    if(!$scope.token || $scope.token=='null'){
    	location.href="login/login.html";
    }else{
        $('.dl-li').hide();
    	$('.gr-li').show();
    }
    /**意见反馈弹出框**/
    $scope.yjfkClick = function(){
    	$('body').removeClass('m-nav-show');
        $("#yjfkModal").modal('show');
	}
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
		  }else{
				  		if(res.code=="0101"){
    						alert("您未登录或登录超时，请重新登录");
    					}else{
    					    alert(res.message);
    					}
				  	}
		});
	}
    
}]);
//意见反馈controller 
mainModule.controller('yjfkCtrl', ['$scope','myService', '$http',function($scope,myService,$http){
  $("#editYjfkForm").validate({
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
		  	$("#yjfkModal").modal('hide');
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
}]);
//我发布的文章
mainModule.controller('actCtrl', ['$scope','myService', '$http',function($scope,myService,$http){
	var token = sessionStorage.getItem('token'),
	    userId = sessionStorage.getItem('userId');
	 // 默认显示页面为3条
	var pageSize = 10;
	 // 当前页为第一页
	var currentPage = 1;
	 // 结果集
	$scope.send_actDatas = [];
	var _data = {userId:userId};
	//先调用一次获取第一页的数据
	getSendList(1,_data);
 	function sendInitPage(pages){
	 	$('#pagination_send').twbsPagination({
			 totalPages: pages,
			 visiblePages: 10,
			 first: '首页',
			 prev: '上一页',
			 next: '下一页',
			 last: '末页',
			 onPageClick: function (event, page) {
				 getSendList(page,_data);
			 }
		 });
	 }
	 $('#act-search-btn').click(function(){
	     _data.searchText = $('#searchText').val();
	     getActList(1,_data);
	 })
	 /**
	  * 获取我发发布的文章
	  */
  	function getSendList(currentPage,_data){
 		var _url = 'PetForum/actical/getMySendActList/paging/'+currentPage + '/' + pageSize;
 		myService.setUrl(_url);  //方法设置路径
 		myService.setData(_data);
 		myService.setToken(token);
 		//call请求回调
		myService.requestTokenAndData().then(function(res){
		  if(res.success){
		  	$scope.send_actDatas = res.data.list;
		  	$scope.counts = res.data.recordCount;//总共的条数
			$scope.pageCount = res.data.pageCount;//总共的页数
			if($scope.send_actDatas.length > 0){
				 sendInitPage($scope.pageCount);
			 }
		  }else{
				  		if(res.code=="0101"){
    						alert("您未登录或登录超时，请重新登录");
    					}else{
    					    alert(res.message);
    					}
				  	}
		});
	 }
	 //删除文章
	 $scope.del = function(id,aId,index){
	 	if(!token || token=='null'){
		     alert('您没有权限这样操作喔！');
	 	}else{
	 	    if(confirm("确定要删除吗？")){
		     	var _url = 'PetForum/actical/delAct/'+aId
		 		myService.setUrl(_url);  //方法设置路径
		 		myService.setToken(token);
		 		//call请求回调
				myService.requestToken().then(function(res){
				  if(res.success){
				  		$scope.send_actDatas.splice(index,1);
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
}]);

//我回复的列表
mainModule.controller('replayActCtrl', ['$scope','myService', '$http',function($scope,myService,$http){
	var token = sessionStorage.getItem('token');
	 // 默认显示页面为3条
	var pageSize =10;
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
			 visiblePages: 10,
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
	     _data.searchText = $('#searchText').val();
	     getActList(1,_data);
	 })
	 /**
	  * 获取我回复的文章
	  */
 	function getActList(currentPage,_data){
 		var _url = 'PetForum/actical/getMyActList/paging/'+currentPage + '/' + pageSize;
 		myService.setUrl(_url);  //方法设置路径
 		myService.setData(_data);
 		myService.setToken(token);
 		//call请求回调
		myService.requestTokenAndData().then(function(res){
		  if(res.success){
		  	$scope.actDatas = res.data.list;
		  	$scope.counts = res.data.recordCount;//总共的条数
			$scope.pageCount = res.data.pageCount;//总共的页数
			if($scope.actDatas.length > 0){
				 initPage($scope.pageCount);
			 }
		  }else{
				  		if(res.code=="0101"){
    						alert("您未登录或登录超时，请重新登录");
    					}else{
    					    alert(res.message);
    					}
				  	}
		});
	 }
}]);

//我的消息列表
mainModule.controller('infoCtrl', ['$scope','myService', '$http',function($scope,myService,$http){
	var token = sessionStorage.getItem('token');
	//默认显示未读消息
	$scope.readFlag = "未读";
	$scope.delTitle = "标记为已读";
	$scope.delEle = 0;
	 // 默认显示页面为3条
	var pageSize =10;
	 // 当前页为第一页
	var currentPage = 1;
	 // 结果集
	$scope.actDatas = [];
	var _data = {
	    isRead:0
	};
	//先调用一次获取第一页的数据
	getActList(1,_data);
	function initPage(pages){
	 	$('#pagination').twbsPagination({
			 totalPages: pages,
			 visiblePages: 10,
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
	     _data.searchText = $('#searchText').val();
	     getActList(1,_data);
	 })
	 /**
	  * 获取我回复的文章
	  */
 	function getActList(currentPage,_data){
 		var _url = 'PetForum/actical/getInfoList/paging/'+currentPage + '/' + pageSize;
 		myService.setUrl(_url);  //方法设置路径
 		myService.setData(_data);
 		myService.setToken(token);
 		//call请求回调
		myService.requestTokenAndData().then(function(res){
		  if(res.success){
		  	$scope.actDatas = [];
		  	angular.forEach(res.data.list, function(value, key) {
			  $scope.actDatas.push(value);
			});
		  	$scope.counts = res.data.recordCount;//总共的条数
			$scope.pageCount = res.data.pageCount;//总共的页数
			if($scope.actDatas.length > 0){
				console.log($scope.pageCount);
				 initPage($scope.pageCount);
			 }
		  }else{
				  		if(res.code=="0101"){
    						alert("您未登录或登录超时，请重新登录");
    					}else{
    					    alert(res.message);
    					}
				  	}
		});
	 }
	 //标记为已读 或者删除
	 $scope.read = function(index,id,invitationId,delEle){
	     var _finalUrl = delEle?'../PetForum/actical/delInfo?id='+id:'../PetForum/actical/readInfo?id='+id;
	     if(confirm("确定要这样操作吗？")){
	         $http({
			     method: 'post', url: _finalUrl,headers : {'token' : token}
			 }).success(function(res){
			     if(res.success){
			     	 $scope.actDatas.splice(index,1);
			     }else{
				  		if(res.code=="0101"){
    						alert("您未登录或登录超时，请重新登录");
    					}else{
    					    alert(res.message);
    					}
				  	}
			 }) 
	     }
	 }
	 //点击更改状态
	 $scope.readBtn = function(flag){
	     $scope.readFlag = flag?'已读':'未读';
	     flag?isReadyTrue():isReadyFalse();
	 }
	 //点击跳转
 	 $scope.readR = function(index,id,invitationId){
 	 	var _finalUrl = '../PetForum/actical/readInfo?id='+id;
 	 	 $http({
		     method: 'post', url: _finalUrl,headers : {'token' : token}
		 }).success(function(res){
		     if(res.success){
		     	 location.href = '/PetForum/#/detail/'+invitationId;
		     }else{
		         alert(res.message);
		     }
		 }) 
	 }
	 
	 function isReadyTrue(){
	 	_data = {
		    isRead:1
		};
		$scope.delTitle = "点击删除"
		$scope.delEle = 1; 
		$scope.readFlag = "已读";
	    getActList(1,_data);
	 }
	 
	 function isReadyFalse(){
	    _data = {
		    isRead:0
		};
		$scope.delTitle = "标记为已读"
		$scope.delEle = 0; 
		$scope.readFlag = "未读";
	    getActList(1,_data);
	 }
}]);

//个人资料
mainModule.controller('userCtrl',['$scope','$http','$rootScope','myService',function($scope,$http,$rootScope,myService) {
	var token = sessionStorage.getItem('token');
	// 路由调整完成后根据state添加标志
	$scope.isNone=false;
	$scope.isLarge=false;
	
	//获取个人资料
	getUserDataDetail();
	 //上传成功的注册事件
	 $(".file-preview-thumbnails").on('fileChange',function(){//注册事件
		 var imageUrls = $("#grzytx").data('fileinput').getUploadSucFile();
		 $http({
		     method: 'post', 
		     url: './login/updatePic',
		     data:{id:$scope.userInfo.id,headUrl:imageUrls[0]},
		     headers : {'token' : token}
	     }).success(function(res){
	     	if(res.success){
	     	     $('.edit').removeClass('xgtx-gray');
		 		 $(".yhtx-waiting").hide();
		 		 $rootScope.myHeadStyle = {
				        "background-image" : "url("+imageUrls[0]+")"
				    }
	     	}else{
	     	    if(res.code=="0101"){
					alert("您未登录或登录超时，请重新登录");
				}
     		}
		  })
	 });
	 
	 //上传失败的注册事件
	 $(".file-preview-thumbnails").on('fileError',function(event,msg){//注册事件
		 $('.edit').removeClass('xgtx-gray');
		 $(".yhtx-waiting").hide();
		 $('#errorModal').modal('show');
		 $('#errorModal .my-modal-body').text(msg);
	 });
	
	 /***********************修改密码弹框*********************************/
	 
	 $scope.updatePwd = function(){
		 $("#xgmmModal").modal('show');
	 };
	 
	 $scope.pdName=function(){
		 if ($scope.userName=="") {
			 $scope.isNone=true;
			 $scope.isLarge=false;
		}else if($scope.userName.length>30){
			$scope.isLarge=true;
			$scope.isNone=false;
		}else{
			$scope.isNone=false;
			$scope.isLarge=false;
		}
	 };
	 
	 $scope.cancel=function(){
	 	 $scope.userInfo.userName = sessionStorage.getItem('userName')
		 $scope.isNone=false;
		 $scope.isLarge=false;
	 };
	 
	   $("#editUserForm").validate({
		  	debug:true,
		    rules: {
		      userName: {
		        required: true,
		     	maxlength:7
		      },
		      telephone: {
		        required: false,
		     	digits:true,
		     	rangelength:[11,11]
		      }
		    },
		    messages: {
		      userName: {
		        required: "请输入用户名",
		        maxlength:'用户名长度不能多于7个字符'
		      },
		      telephone: {
		        digits:'请输入正确的手机号',
		        rangelength:'请输入正确的手机号'
		      }
		    },
		    submitHandler: function(form) {
			    var data={
					userName:$scope.userInfo.userName,
			        tel:$scope.userInfo.tel
		        }
    	        var _url = 'PetForum/login/updateUser';
		        myService.setData(data);
		 		myService.setUrl(_url);  //方法设置路径
		 		myService.setToken(token);
		 		//call请求回调
				myService.requestTokenAndData().then(function(res){
				  if(res.success){
				  	$('.info-sz-dyn').show();
					$('.sz-dyn').empty();
					var _html ='<strong>个人资料修改成功</strong>';
			    	$('.sz-dyn').append(_html);
			    	$('.info-sz-dyn').fadeOut(4000, function () {
			    		//修改右上角用户信息
			  			$rootScope.$apply(function(){
			  				$rootScope.userName = $scope.userInfo.userName;
			  			});
			  			sessionStorage.setItem("userName",$scope.userName);
			  		});
	  				//隐藏修改框
	  				$('.other-input,.after-bj').hide();
	  			    $('.help-details,.before-bj').show();
				  }else{
					  		if(res.code=="0101"){
	    						alert("您未登录或登录超时，请重新登录");
	    					}else{
	    					    alert(res.message);
	    					}
					  	}
				});
	        }  
		  })
	 
	 //修改用户信息
	 $scope.updUserInfo=function(){
	     $('#infoSubmit').trigger("click");
	 };
	 
	 /**
	  * 获取个人资料
	  */
	 function getUserDataDetail(){
 		var _url = 'PetForum/login/getUserDetail';
 		myService.setUrl(_url);  //方法设置路径
 		myService.setToken(token);
 		//call请求回调
		myService.requestToken().then(function(res){
		  if(res.success){
		  	$rootScope.myHeadStyle = {
		        "background-image" : "url("+res.data.headUrl+")"
		    }
		  	$scope.userInfo = res.data;
			$scope.replyNum = res.replyNum;
			$scope.infoNum = res.infoNum;
			$scope.sendNum = res.sendNum;
		  }else{
		  		if(res.code=="0101"){
					alert("您未登录或登录超时，请重新登录");
				}else{
				    alert(res.message);
				}
		  	}
		});
	 }
}]);
mainModule.filter('imgfilter',function() {
  return function(url){
    if(url){
      return rain.config.web_server+url;
    }
  }
});

mainModule.directive('moduleClick', ['$state','myService',function($state,myService){
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
/***取消修改***/
mainModule.directive('btnqx',function(){//菜单的样式切换
	return{
		link:function(scope, iElement){
		  $(iElement).click(function(){
		    $('.other-input,.after-bj').hide();
		    $('.help-details,.before-bj').show();
		  })
		}
	};
});
/***保存***/
mainModule.directive('bcbtn',function(){//菜单的样式切换
	return{
		link:function(scope, iElement){
		  $(iElement).click(function(){
		    $http({
		      method:'post',
		      url:''
		    }).success(function(res){
		      $('.other-input,.after-bj').hide();
		      $('.help-details,.before-bj').show();
		    })
		  })
		}
	};
});
/***点击编辑个人资料的指令***/
mainModule.directive('beforebj',function(){//菜单的样式切换
	return{
		link:function(scope, iElement){
		  $(iElement).click(function(){
		    $('.help-details').hide();
		    $('.other-input,.after-bj').show();
		    $(this).hide();
		  })
		}
	};
});
//修改密码
mainModule.controller('updatePassController', ['$scope','$rootScope','myService',function($scope,$rootScope,myService) {
  $("#editPassForm").validate({
  	debug:true,
    rules: {
      up_oldPassword: {
        required: true,
        minlength: 6,
     	maxlength:14
      },
      up_password: {
        required: true,
        minlength: 6,
        maxlength:14
      },
      up_repeatPassword: {
        required: true,
        minlength: 6,
        maxlength:14,
        equalTo: "#up_password"
      }
    },
    messages: {
      up_oldPassword: {
        required: "请输入密码",
        minlength: "密码长度不能小于 6个字符",
        maxlength:"密码长度不能多于14个字符"
      },
      up_password: {
        required: "请输入密码",
        minlength: "密码长度不能小于 6个字符",
        maxlength:"密码长度不能多于14个字符"
      },
      up_repeatPassword: {
        required: "请输入密码",
        minlength: "密码长度不能小于 6 个字母",
        maxlength: "密码长度不能多于14个字符",
        equalTo: "两次密码输入不一致"
      }
    },
    submitHandler: function(form) {      
	    var data = {};
	    data.password = MD5Util.setMD5($('#up_oldPassword').val());
	    data.newPassword = MD5Util.setMD5($('#up_password').val());
		var _url = 'PetForum/login/updatePassWord';
 		myService.setUrl(_url);  //方法设置路径
 		myService.setToken(token);
 		myService.setData(data);
 		//call请求回调
		myService.requestTokenAndData().then(function(res){
		  if(res.success){
		  	$("#xgmmModal").modal('hide');
			$('.info-sz-dyn').show();
			$('.sz-dyn').empty();
			var _html ='<strong>密码修改成功</strong>';
	    	$('.sz-dyn').append(_html);
	    	$('.info-sz-dyn').fadeOut(4000, function () {
	  		});
		  }else{
				  		if(res.code=="0101"){
    						alert("您未登录或登录超时，请重新登录");
    					}else{
    					    alert(res.message);
    					}
				  	}
		});
	}  
  })
  	
}]);
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