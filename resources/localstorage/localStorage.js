define(function(require, exports, module) {
	//window.localSorage.key(num)返回指定位置的键名
	var LocalS = {
		'isSupport': function() {
			return "object" === typeof window.localStorage;
		},
		'getLength': function (){
			var that = this;
			var _result = false;
			if (!that.isSupport()) {
				console.log('不支持LocalStorage');
			} else {
				_result = window.localStorage.length;
			}
			return _result;
		},
		'setVal': function(name, arrVal) {
			var that = this;
			var _result = false;
			if (!that.isSupport()) {
				console.log('不支持LocalStorage');
			} else {
				var strVal = JSON.stringify(arrVal);
				window.localStorage.setItem(name, strVal);
				_result = true;
			}
			return _result;
		},
		'getVal': function(name) {
			var that=this,val = undefined;
			if (that.getLength()) {
				var _val = window.localStorage.getItem(name);
				if (_val !=null && _val !='null') {
					val = JSON.parse(_val);
				}
			}
			return val;
		},
		'deleteVal': function(name) {
			var that =this;
			var _result = false;
			if (!that.isSupport()) {
				console.log('不支持LocalStorage');
			} else {
				window.localStorage.removeItem(name);
				_result = true;
			}
			return _result;
		},
		'clearAll': function() {
			var that =this;
			var _result = false;
			if (!that.isSupport()) {
				console.log('不支持LocalStorage');
			} else {
				window.localStorage.clear();
				_result = true;
			}
			return _result;
		},
	}
	module.exports = LocalS;
});