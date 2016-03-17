/****** Jquery Html setting Class ******/
// Singtone Class
var HtmlHelper = (function(){
	var dom = '';
	var html = '';
	var value = '';
	var tag = '';
	var convertedHtml = '';
	function HtmlHelper_(dom){
		this.setDom(dom);
		this.html = html;
		this.value = value;
		if(!this.html){
			this.setHtml();
		}
	}
	HtmlHelper_.prototype.test = function(){
		console.log('this is test...');
	};
	HtmlHelper_.prototype.log = function(){
		console.log(this.tag + '-dom		: ' + this.dom);
		console.log(this.tag + '-html	: \n' + this.html);
		console.log(this.tag + '-convertedHtml	: \n' + this.convertedHtml);
		console.log(this.tag + '-value	: ');
		console.log(this.value);
	};
	HtmlHelper_.prototype.setTag = function(tag){
		this.tag = tag;
	};
	HtmlHelper_.prototype.setDom = function(dom){
		this.dom = dom;
	};
	HtmlHelper_.prototype.setHtml = function(dom){
		if(!dom){dom = this.dom;}
		if(typeof dom == 'object'){
			this.html = dom.html();
		}else{
			this.html = $(dom).html();
		}
	};
	HtmlHelper_.prototype.setValue = function(value){
		this.value = value;
	};
	HtmlHelper_.prototype.writeHtml = function(value, callback){
		this.value = value;
		this.convertedHtml = this.convertByData(this.html, value, callback);
		$(this.dom).html(this.convertedHtml);
	};
	HtmlHelper_.prototype.appendHtml = function(value, callback){
		this.value = value;
		this.convertedHtml = this.convertByData(this.html, value, callback);
		$(this.dom).append(this.convertedHtml);
	};
	//
	HtmlHelper_.prototype.convertByData = function(html, values, callback){
		var dummyHTML="";
		var dummyHTMLAll="";
		$.each(values,function(i,v){
			dummyHTML=html;
			$.each(v,function(ii,vv){
				if(vv == null){vv = '';}
				dummyHTML = HtmlHelper_.prototype.replaceTag(dummyHTML);
				dummyHTML = HtmlHelper_.prototype.replaceAll(dummyHTML,"{"+ii+"}",vv);
				if(typeof callback == 'function'){
					dummyHTML = callback(dummyHTML);
				}
			})
			dummyHTMLAll+=dummyHTML;
		})
		return dummyHTMLAll;
	};
	HtmlHelper_.prototype.replaceAll = function(html,col,value){
		return html.split(col).join(value);
	};
	HtmlHelper_.prototype.replaceTag = function(dummyHTML){
		return HtmlHelper_.prototype.replaceAll(dummyHTML,"ng-","");
	};

	return HtmlHelper_;
})();
/***************************************/