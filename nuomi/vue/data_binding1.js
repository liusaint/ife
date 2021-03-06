// 请实现这样的一个 Observer，要求如下：

// 传入参数只考虑对象，不考虑数组。
// new Observer返回一个对象，其 data 属性要能够访问到传递进去的对象。
// 通过 data 访问属性和设置属性的时候，均能打印出右侧对应的信息。

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
			}
		})
	}
};

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
// data.c.cc.aaa;
// data.c.cc.aaa = 111.1
// data.a;
// data.a = 1.1;
//删除是不会检测到的。
// delete data.a;
// data.a;
