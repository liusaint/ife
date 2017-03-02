//任务四。静态渲染



function Vue(option) {
	this.el = option.el;
	this.data = option.data;
	this.init();
}

Vue.prototype.init = function() {
	//实际中vue的选择器可以查出多个结果吗
	var elObj = document.querySelector(this.el);
	var innerHTML = elObj.innerHTML;
	var matcher = /{{([\s\S]+?)}}|$/g;
	var resHTML = '';
	var data = this.data;

	var resHTML = innerHTML.replace(matcher, function(match, matchVue, offset) {

		if(matchVue){
			return eval('data.'+matchVue);
		}
		return match;
	});

	elObj.innerHTML = resHTML;

};

new Vue({
	el:'#wrap',
	data:{
		user:{
			age:11,
			name:'ls'
		}
	}
})