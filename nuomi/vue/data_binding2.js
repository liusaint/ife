// 任务二
// 1.如果传入的是比较深的对象怎么办？如何维持它的响应。
// 2.如何传入回调事件。


function Observer(data) {
	this.data = data;
	this.walk(data);
	this.eventBus = new Event();
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
		var self = this;
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

				self.eventBus.emit(key,val,newVal);
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
		this.eventBus.on(path,callBack);
	},
	//取消绑定事件。
	$unWatch:function(path){
		this.eventBus.off(path);
	},
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
		var args = slice.call(arguments,1);

		var len = callBackArr.length;
		var i = 0;
		for (; i < len; i++) {
			typeof callBackArr[i] === 'function' && callBackArr[i].apply('',args);
		}
	}
}
//测试事件处理
// var event = new Event();
// event.on('aa',function(a) {	
// 	console.log('aa1'+a);
// });
// event.on('aa',function(a) {	
// 	console.log('aa2'+a);
// });

// event.emit('aa','test1');
// event.off('aa');
// event.emit('aa','test1');


//测试
// let app = new Observer({  
//     age: 25
// })
// //测试回调。
// app.$watch('age', function(oldVal, newVal){
//     console.log(`我的年龄变了，原来是: ${oldVal}岁，现在是：${newVal}岁了`)
// })

// app.data.age = 20;
// app.$unWatch('age');
// app.data.age = 44;

// // 测试点一
// app.data.age = {a:1}
// app.data.age.a = 2;











//未解决的问题。　如何给  data.a.b这样的加watch。