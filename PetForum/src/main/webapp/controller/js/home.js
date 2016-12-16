//模块化
var mainModule = angular.module('mainModule', ['ui.router',
				'ngResource', 'ngSanitize','ngWebSocket']);
				
mainModule.factory('myWebsocket', ['$rootScope','$websocket',function($rootScope,$websocket) {
  // Open a WebSocket connection 
  var dataStream = $websocket(rain.config.web_socket_server+'/PetForum/websocket/'+sessionStorage.getItem('userId'));
 
  var collection = [];
 
  dataStream.onMessage(function(message) {
  	$rootScope.message = message.data;
    collection.push(message);
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
          var toStateUrl = toState.name,
              $item = $('.nav-item');
          $item.removeClass('active');
          switch(toStateUrl){
            case 'list1':
                 $("[data-name=list1]").addClass('active');
                 break;
            case 'list2':
                 $("[data-name=list2]").addClass('active');
                 break;
     		case 'send':
                 $("[data-name=send]").addClass('active');
                 break;
            case 'emaildetail':
                 $("[data-name=emaildetail]").addClass('active');
                 break;
            default: break;
          }
		});
});

///路由配置
mainModule.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider) {
	$stateProvider.state('index',{
		url : '/index',               //home
		templateUrl : 'index/index.html'
	}).state('list1',{
		url : '/list1',               //home
		templateUrl : 'email/list1.html'
	}).state('list2',{
		url : '/list2',               //home
		templateUrl : 'email/list2.html'
	}).state('send',{
		url : '/send',               //home
		templateUrl : 'email/send.html'
	}).state('emaildetail',{
		url : '/emaildetail',               //home
		templateUrl : 'email/detail.html'
	})
	$urlRouterProvider.otherwise('/index');   //默认home
}]);

//mainCtrl
mainModule.controller('mainCtrl', ['$scope','$rootScope','$http','myService', function($scope,$rootScope,$http,myService){
    var token = sessionStorage.getItem('token');
    $scope.userName = sessionStorage.getItem('userName');
}]);

//左边菜单样式控制
mainModule.directive('menu', ['$state',function($state){
  return {
    link: function($scope, iElm, iAttrs) {
      iElm.bind('click', function(event) {
      	var $menu_body = $('.viewFramework-body');
      	if($menu_body.hasClass('viewFramework-sidebar-full')){
      		//目录已展开的情况下点击收缩 
      	    $menu_body.removeClass('viewFramework-sidebar-full');
      	    $menu_body.addClass('viewFramework-sidebar-mini');
    		$(".nav-icon[data-toggle='tooltip']").tooltip({
    			html : true,
    			container:$('body')
   			}); 
      	}else{
      	    $menu_body.removeClass('viewFramework-sidebar-mini');
      	    $menu_body.addClass('viewFramework-sidebar-full');
      	    $(".nav-icon[data-toggle='tooltip']").tooltip('destroy')
      	}
      });
    }
  };
}]);

//左边菜单箭头控制
mainModule.directive('faClick', ['$state',function($state){
  return {
    link: function($scope, iElm, iAttrs) {
      iElm.bind('click', function(event) {
      	var $this = $(this),
      	    $fa = $this.find('.menu-fa'),
      	    $ul = $this.next('.sidebar-trans');
      	if($fa.hasClass('fa-caret-down')){
      		//目录已展开的情况下点击收缩 
      	    $fa.removeClass('fa-caret-down');
      	    $fa.addClass('fa-caret-up');
      	    $ul.addClass('sidebar-nav-fold');
      	}else{
      	    $fa.removeClass('fa-caret-up');
      	    $fa.addClass('fa-caret-down');
      	    $ul.removeClass('sidebar-nav-fold');
      	}
      });
    }
  };
}]);

//左边菜单点击选中样式控制
/********
    E - 元素名称： <my-directive></my-directive>
    A - 属性：  <div my-directive="exp"> </div>
    C - 类名： <div class="my-directive: exp;"></div>
    M - 注释：  <!-- directive: my-directive exp -->
*************/
mainModule.directive('navItemClick', ['$state',function($state){
  return {
  	restrict:'C',
    link: function($scope, iElm, iAttrs) {
      iElm.bind('click', function(event) {
      	var $this = $(this),
      	    $item = $('.nav-item');
      	$item.removeClass('active');
  	    $this.addClass('active');
      });
    }
  };
}]);