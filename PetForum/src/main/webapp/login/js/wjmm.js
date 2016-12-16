$(function(){
	 // 在键盘按下并释放及提交后验证提交表单
  var email = getCookieValue("email");
  if(email) {
	$('#email').val(email);
  }
  $("#signinForm").validate({
  	debug:true,
    rules: {
      email:{
      	required: true
      }
    },
    messages: {
      email:{
      	required: "请输入邮箱"
      }
    },
    submitHandler: function(form) {      
	    var data = {};
	    $('#wjmmsub').attr({"disabled":"disabled"});
	    $('#wjmmsub').text("邮件发送中...");
	    var f_time = function(){
				//定时器
				var time = 60;
				var stop = setinterval(
						function(){
							if(time>0){
								time--;
							   $('#wjmmsub').val(time + "秒后重发");
							   $('#wjmmsub').attr({"disabled":"disabled"});
							   //发送验证码的时间内手机号码不允许修改
							   $("input[name='telphone']").attr("disabled",true);
							}else{
								$interval.cancel(stop);
								$('#wjmmsub').val("重新发送");
								$('#wjmmsub').removeAttr("disabled");
							}
						}
		              ,1000);
				
		};
	    data.email = $('#email').val();
	    $.ajax({
			url : '../mails/forgetMm',
			method : 'post',
			data:JSON.stringify(data),
			contentType: 'application/json'
		}).success(function(resp) {
			if(resp.success){
			    alert("您的密码已发至邮箱，请注意查收！");
			    location.href="login.html";
			}else{
				$('#wjmmsub').removeAttr("disabled");
				$('#wjmmsub').text('点击重置');
			    alert(resp.message);
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