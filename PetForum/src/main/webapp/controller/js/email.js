//初始化列表页面选择框事件1
var handleSelectAll = function() {
	"use strict";
	$("[data-click=email-select-all]").click(function(e) {
				e.preventDefault();
				if ($(this).closest("tr").hasClass("active")) {
					$(".table-email tr").removeClass("active")
				} else {
					$(".table-email tr").addClass("active")
				}
			})
};
var handleSelectSingle = function() {
	"use strict";
	$("[data-click=email-select-single]").click(function(e) {
				e.preventDefault();
				var t = $(this).closest("tr");
				if ($(t).hasClass("active")) {
					$(t).removeClass("active")
				} else {
					$(t).addClass("active")
				}
			})
};
var handleEmailRemove = function() {
	"use strict";
	$("[data-click=email-remove]").click(function(e) {
				e.preventDefault();
				var t = $(this).closest("tr");
				$(t).fadeOut().remove()
			})
};
var handleEmailHighlight = function() {
	"use strict";
	$("[data-click=email-highlight]").click(function(e) {
				e.preventDefault();
				if ($(this).hasClass("text-danger")) {
					$(this).removeClass("text-danger")
				} else {
					$(this).addClass("text-danger")
				}
			})
};
var Inbox = function() {
	"use strict";
	return {
		init : function() {
			handleSelectAll();
			handleSelectSingle();
			handleEmailRemove();
			handleEmailHighlight()
		}
	}
}();

//初始化列表页面选择框事件2
var handleEmailActionButtonStatus = function() {
	if ($("[data-checked=email-checkbox]:checked").length !== 0) {
		$("[data-email-action]").removeClass("hide")
	} else {
		$("[data-email-action]").addClass("hide")
	}
};
var handleEmailCheckboxChecked = function() {
	$("[data-checked=email-checkbox]").click(function() {
				var e = $(this).closest("label");
				var t = $(this).closest("li");
				if ($(this).prop("checked")) {
					$(e).addClass("active");
					$(t).addClass("selected")
				} else {
					$(e).removeClass("active");
					$(t).removeClass("selected")
				}
				handleEmailActionButtonStatus()
			})
};
var handleEmailAction = function() {
	$("[data-email-action]").click(function() {
				var e = "[data-checked=email-checkbox]:checked";
				if ($(e).length !== 0) {
					$(e).closest("li").slideToggle(function() {
								$(this).remove();
								handleEmailActionButtonStatus()
							})
				}
			})
};
var InboxV2 = function() {
	"use strict";
	return {
		init : function() {
			handleEmailCheckboxChecked();
			handleEmailAction()
		}
	}
}();
//初始化标签输入插件及wysihtml5文本框插件
var handleEmailToInput = function() {
	$("#email-to").tagit({
		availableTags : ["c++", "java", "php", "javascript", "ruby", "python",
				"c"]
	})
};
var handleEmailContent = function() {
	$("#wysihtml5").wysihtml5()
};
var EmailCompose = function() {
	"use strict";
	return {
		init : function() {
			handleEmailToInput();
			handleEmailContent()
		}
	}
}();
//mainCtrl
mainModule.controller('ListOneCtrl', ['$scope','$rootScope','$http','myService', function($scope,$rootScope,$http,myService){
    var token = sessionStorage.getItem('token');
    $scope.userName = sessionStorage.getItem('userName');
}])


