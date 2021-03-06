$(function(){
	 // 在键盘按下并释放及提交后验证提交表单
  var email = getCookieValue("email");
  if(email) {
	$('#email').val(email);
  }
  $("#signinForm").validate({
  	debug:true,
    rules: {
      userName: {
        required: true,
     	maxlength:7
      },
      name:{
      	required: true,
      	minlength: 2,
      	maxlength:10
      },
      email:{
      	required: true
      },
      password: {
        required: true,
        minlength: 6
      },
      quePassword: {
        required: true,
        minlength: 6,
        equalTo: "#password"
      }
    },
    messages: {
      userName: {
        required: "请输入用户名",
        maxlength:'用户名长度不能多于7个字符'
      },
      name: {
        required: "请输入真实姓名",
        minlength: "真实姓名长度不能小于2个字符",
        maxlength:'真实姓名长度不能多于10个字符'
      },
      email:{
      	required: "请输入邮箱"
      },
      password: {
        required: "请输入密码",
        minlength: "密码长度不能小于 6个字符"
      },
      quePassword: {
        required: "请输入密码",
        minlength: "密码长度不能小于 6 个字母",
        equalTo: "两次密码输入不一致"
      }
    },
    submitHandler: function(form) {      
	    var data = {};
	    data.email = $('#email').val();
	    data.password = MD5Util.setMD5($('#password').val());
	    $.ajax({
			url : '../login/doLogin',
			method : 'post',
			data:JSON.stringify(data),
			contentType: 'application/json'
		}).success(function(resp) {
			if(resp.success){
				//token信息
				var token = resp.data.token,
				    userName = resp.data.userName,
				    userId = resp.data.id;
			    if(window.localStorage){   
			    	sessionStorage.removeItem("token");
					sessionStorage.removeItem("userName");
					sessionStorage.removeItem("userId");
					sessionStorage.setItem("token",token);
					sessionStorage.setItem("userName" , userName);
					sessionStorage.setItem("userId" , userId);
		    	}else{    alert("浏览暂不支持localStorage") } 
				
			    //先清除原有的cookie
				deleteCookie("email",'/PetForum');
				//保存 
				setCookie('email',resp.data.email,24,'/PetForum');
			    window.location.href="/PetForum";
			}else{
			    alert("用户名或密码错误");
			}
		})
	}  
  })
})
//新建cookie。  
//hours为空字符串时,cookie的生存期至浏览器会话结束。hours为数字0时,建立的是一个失效的cookie,这个cookie会覆盖已经建立过的同名、同path的cookie（如果这个cookie存在）。  
function setCookie(name,value,hours,path){  
  name = escape(name);  
  value = escape(value);  
  var expires = new Date();
  // 10天有效期（以15分钟为900推算，10天即为24*36000）
  expires.setTime(expires.getTime() + hours*3600*1000);  
  path = path == "" ? "" : ";path=" + path;  
  _expires = (typeof hours) == "string" ? "" : ";expires=" + expires.toUTCString();  
  document.cookie = name + "=" + value + _expires + path;  
};

//获取cookie值  
function getCookieValue(name){  
  name = escape(name);  
  //读cookie属性，这将返回文档的所有cookie  
  var allcookies = document.cookie;         
  //查找名为name的cookie的开始位置  
  name += "=";  
  var pos = allcookies.indexOf(name);      
  //如果找到了具有该名字的cookie，那么提取并使用它的值  
  if (pos != -1){                                             //如果pos值为-1则说明搜索"version="失败  
      var start = pos + name.length;                  //cookie值开始的位置  
      var end = allcookies.indexOf(";",start);        //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置  
      if (end == -1) end = allcookies.length;        //如果end值为-1说明cookie列表里只有一个cookie  
      var value = allcookies.substring(start,end);  //提取cookie的值  
      return unescape(value);                           //对它解码        
      }     
  else return "";                                             //搜索失败，返回空字符串  
};  

//删除cookie  
function deleteCookie(name,path){  
  name = escape(name);  
  var expires = new Date(0);  
  path = path == "" ? "" : ";path=" + path;  
  document.cookie = name + "="+ ";expires=" + expires.toUTCString() + path;  
};  