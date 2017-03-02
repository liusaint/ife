// 任务二
// 1.如果传入的是比较深的对象怎么办？如何维持它的响应。
// 2.如何传入回调事件。


function Observer(data) {
	this.data = data;
	this.walk(data);
}

Observer.prototype = {
	construtor: Observer,
	walk: function(data) {
		var key, val;
		for (key in data) {
			if (!data.hasOwnProperty(key)) continue;
			val = data[key];
			//如果是属性是对象的话，递归调用
			if (Object.prototype.toString.call(val) === '[object Object]') {
				new Observer(val);			
			}
			this.defineData(key, val);
		}
	},
	defineData: function(key, val) {

		//其实这里是用了一个闭包来保存了key和val。
		//每次调用这个函数就会重新定义原来的属性。原来的val值要从这个闭包中读取。		
		Object.defineProperty(this.data, key, {
			enumerable: true,
			configurable: true,
			get: function() {
				console.log('你访问了' + key);
				return val;
			},
			set: function(newVal) {
				console.log('你设置了' + key + '，新的值为' + newVal);
				if (val === newVal) return;
				val = newVal;
				//第一个问题的解决。
				if(typeof newVal === 'object'){
					new Observer(newVal);
				}
				
			}
		})
	},
	//绑定事件，观测者模式
	$watch:function(path,callBack){


	},
	runCallBacks:function(path){

	}
};


//用于事件处理
function Event(){
	this.eventObj = {};
}
Event.prototype = {
	construtor:Event,
	//绑定事件
	on:function(key,callBack){
		if(!this.eventObj[key]){
			this.eventObj[key] = [];
		}
		this.eventObj[key].push(callBack);
	},
	//解绑事件
	off:function(key){
		if(this.eventObj[key]){
			delete this.eventObj[key];
		}
	},
	// 触发事件
	emit:function(key){
		var callBackArr = this.eventObj[key]||[];
		var slice = Array.prototype.slice;
		var args = slice.call(arguments,1)
		var len = callBackArr.length;
		var i = 0;
		for (; i < len; i++) {
			typeof callBackArr[i] === 'function' && callBackArr[i].apply('',args);
		}
	}
}

var event = new Event();
event.on('aa',function(a) {	
	console.log('aa1'+a);
});
event.on('bb',function(b) {	
	console.log('bb1'+b);
});
event.on('aa',function(a) {	
	console.log('aa2'+a);
});

event.emit('aa','test1');
event.off('aa');
event.emit('aa','test1');
//测试
var data = {
	a:1,
	b:2,
	c:{
		aa:11,
		bb:22,
		cc:{
			aaa:111,
			bbb:222,
		}
	}
}
//测试
// new Observer(data);
// data.c;
// data.c = {
// 	a:{
// 		b:1
// 	}
// }

// data.c.a.b