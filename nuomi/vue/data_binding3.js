// 任务三
// 实现事件的传播


//用于事件处理
function Event() {
	this.eventObj = {};
}
Event.prototype = {
	construtor: Event,
	//绑定事件
	on: function(key, callBack) {
		if (!this.eventObj[key]) {
			this.eventObj[key] = [];
		}
		this.eventObj[key].push(callBack);
	},
	//解绑事件
	off: function(key) {
		if (this.eventObj[key]) {
			delete this.eventObj[key];
		}
	},
	trigger: function(key) {
		var callBackArr = this.eventObj[key] || [];
		var slice = Array.prototype.slice;
		var args = slice.call(arguments, 1);

		var len = callBackArr.length;
		var i = 0;
		for (; i < len; i++) {
			typeof callBackArr[i] === 'function' && callBackArr[i].apply('', args);
		}
		this.emit(key)
	},
	// 触发事件
	emit: function(key) {
		//触发上一层。向上传播
		var keyArr = key.split('.');
		var keyLen = keyArr.length;
		if (keyLen < 2) return;
		keyArr.pop();
		var keyString = keyArr.join('.');
		this.trigger(keyString);
	}
}



/**
 * 观察者
 * @param {[type]} data       [传入的对象]
 * @param {[type]} enentBus   [事件对象，一个观察者只维护一个事件对象，递归的传入已生成的对象]
 * @param {[type]} pathString [路径。绑定事件的格式为　eventBus.on('a.b.c',fn)]
 */
function Observer(data, eventBus, pathString) {
	this.data = data;
	this.eventBus = eventBus || new Event();
	this.pathString = pathString || '';
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
				var eventKey = this.pathString ? this.pathString + '.' + key : key;
				new Observer(val, this.eventBus, eventKey);
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
				var eventKey = self.pathString ? self.pathString + '.' + key : key;
				//绑定一个
				self.eventBus.on(eventKey);
				//触发
				self.eventBus.trigger(eventKey, val, newVal);

				val = newVal;
				//第一个问题的解决。
				if (typeof newVal === 'object') {
					new Observer(newVal, self.eventBus, eventKey);
				}

			}
		})
	},
	//绑定事件，观测者模式
	$watch: function(path, callBack) {
		this.eventBus.on(path, callBack);
	},
	//取消绑定事件。
	$unWatch: function(path) {
		this.eventBus.off(path);
	},
};



//测试
let app = new Observer({
		name: {
			name1: 'name1',
			name2: 'name2',
			nameObj: {
				name11: 'aa',
				name22: 'bb'
			}
		}
	})
	//测试回调。
app.$watch('name', function() {
	console.log(`名字修改了`);
})
app.$watch('name.nameObj', function() {
	console.log(`name.nameObj名字修改了`);
})
// app.data.name.name1 = 1;
app.data.name.nameObj.name11 = 2;
app.data.name.nameObj.name22 = 2;