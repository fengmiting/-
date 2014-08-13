if(window.jQuery === undefined){
	throw new Error('加载本插件之前必须先加载jQuery库');
}

if(iScroll === undefined){
	throw new Error('加载本插件之间必须先加载iScroll库');
}

(function($){

	/*--判断:当前元素是否是被筛选元素的子元素或者本身 --------------------*/
	jQuery.fn.isChildAndSelfOf = function(b){
		return (this.closest(b).length > 0); 
	};

	/*--控件基类--------------------------------------------------------*/
	var baseCtr = {

		// 设置滚动条
		setScroll: function(){
			var content 	= $('<content></content'),			// 内容容器
				scroll 		= $('<scroll></scroll>'),			// 可以滚动的容器
				scrollBox 	= $('<scrollBox></scrollBox>');		// 滚动容器的内容容器

			// 添加必须元素
			scroll.append(scrollBox);
			content.append(scroll);
			scrollBox.append(this.element.children('*'));
			this.element.append(content);
			this.scrollBox = scrollBox;

			return new iScroll(scroll[0],{
				onBeforeScrollStart: function (e) {
					e.preventDefault();
					e.stopPropagation();
				}
			});
		},

		// 控件定位
		// el = jQuery element 通过指定元素进行定位
		position: function(el){
			//console.log(el);
			var top 	= el.offset().top + el.outerHeight(true),
				left	= el.offset().left;

			this.element.css({
				'left'	: left + 'px',
				'top' 	: top  + 'px'
			});
		}
	};

	/*--动画效果--------------------------------------------------------*/
	var animate = (function(){

		function animate(element,options){
			this.element = element;
			this.options = options;
		}

		animate.prototype = {

			// 从下往上移动
			slideup: function(){
				var s = (this.options.smiller / 10000) + 's',
					e = this.element;

				e.css({
					'-webkit-transform': 'translate3d(0px, 100%, 0px)',
					'-webkit-transition':'0s'
				});

				e.show(0,function(){
					e.css({
						'-webkit-transform': 'translate3d(0px, 0px, 0px)',
						'-webkit-transition':s
					});
				});
			},

			// 从下往上移动
			slidedown: function(){

			},

			// 从左往右移动
			slideleft: function(){

			},

			// 从右忘左移动
			slideright: function(){

			}
		}

		return animate;
	})();

	/*--Box类控件基类---------------------------------------------------*/
	var baseBox = {

		// 初始化
		init: function(element,options){
			var self		= this;

			// 设置属性
			this.element = element;
			this.options = $.extend(this.defaults,options);

			// 设置内容触摸滚动
			var scroll = this.setScroll();

			// 设置触发器
			if(this.options.trigger !== false){
				this.options.trigger.tap(function(){
					self.show();
					scroll.refresh();
				});
			}

			// 隐藏
			this.hide();
		},

		// 显示
		show: function(position){
			if(this.animate === undefined)
				this.animate = new animate(this.element,this.options);
			if(position !== undefined)
				this.position(position);
			
			var fun = this.options.animate;
			this.animate[fun]();
		},

		// 隐藏
		hide: function(){
			var element = this.element;
			$(document).bind('vmouseup',function(event){
				if(!$(event.target).isChildAndSelfOf(element)){
					element.hide();
				}
			});
		},
	};

	// Box类控件默认参数
	baseBox.defaults  = {
		smiller: 3000,			// 时间
		animate: 'slideup',		// 显示动画
		trigger: false,			// 显示触发元素
	};

	// 继承控件基类
	baseBox.__proto__ = baseCtr;

	/*--POPBox 弹出框---------------------------------------------------*/
	var POPBox = (function(){
		function POPBox(element,options){
			// 初始化
			this.init(element,$.extend(this.defaults,options));
		}

		// 加载基类
		POPBox.prototype = baseBox;
		return POPBox;
	})();

	/*--BubbleBox 弹出框------------------------------------------------*/
	var BubbleBox = (function(){
		function BubbleBox(element,options){
			// 初始化
			this.init(element,$.extend(this.defaults,options));
		}

		BubbleBox.prototype = baseBox;
		return BubbleBox;
	})();

	/*--list 控件-------------------------------------------------------*/
	var List = (function(){

		/**
		 * options.data    						// 数据集合
		 * options.bindCallFun(item,data)		// 绑定数据时的回调函数
		 * options.selectCallFun(item)			// 选中后的回调函数 返回true表示不隐藏列表
		 * options.parent						// 父元素
		 */
		function List(options){
			var self 		= this,
				element		= $('<List></List>');

			this.element 	= element;
			
			if(typeof options.data !== 'object') return;

			for(var i in options.data){
				var item = $('<item></item>');
				options.bindCallFun(item,options.data[i]);
				item.bind('click',function(){
					options.selectCallFun($(this));
				});
				this.element.prepend(item);
			}
			options.parent.append(this.element);
		}

		$.fn.list = function(options){
			new List(options);
		}
		return List;
	})();

	/*--BubbleList 列表控件---------------------------------------------*/
	var BubbleList = (function(){

		/**
		 * options.data    						// 数据集合
		 * options.bindCallFun(item,data)		// 绑定数据时的回调函数
		 * options.selectCallFun(item)			// 选中后的回调函数 返回true表示不隐藏列表
		 * options.parent						// 父元素
		 * options.trigger						// 触发元素
		 */
		function BubbleList(options){
			var self 		= this,
				element 	= $('<bubblebox></bubblebox>');

			this.element 	= element;
			options.parent.append(element);
			
			this.scroll 	= this.setScroll();
			options.parent  = this.scrollBox;

			this.list 		= new List(options);

			// 重写show
			this.show		= function(el){
				self.list.container = el;
				self.position(el);
				self.element.show();
				this.scroll.refresh();
			}

			// 隐藏
			$(document).bind('vmouseup',function(event){
				if(!$(event.target).isChildAndSelfOf(self.element)){
					self.element.hide();
				}
			});
		}
		BubbleList.prototype 		= baseCtr;
		return BubbleList;
	})();

	/*--alert-----------------------------------------------------------*/
	var Alert = (function(){
		function Alert(a,b){
			var box 		= $('<div class="alert-box"></div>'),
				title		= $('<p class="alert-title"></p>'),
				content 	= $('<div class="alert-content"></div>'),
				buttonBox   = $('<div class="alert-buttonBox"></div>'),
				button 		= $('<a class="alert-button">确定</a>');

			title.text(a);
			content.html(b);
			buttonBox.append(button);
			box.append(title).append(content).append(buttonBox);
			$('body').append(box);

			var left = ($(window).width()  / 2) - (box.width()  / 2),
				top  = ($(window).height() / 2) - (box.height() / 2);

			box.css({
				'left': left + 'px',
				'top' : top  + 'px'
			});

			button.tap(function(){
				box.remove();
			});
		}
		window.alert = Alert;
	})();

	/*--SmartTips自能提示框----------------------------------------------*/
	var SmartTips = (function(){

		function SmartTips(){

			// 生成元素
			this.element = $('<SmartTips></SmartTips>');
			this.list 	 = $('<List></List>');
			this.element.append(this.list);
			$('body').append(this.element);

			// 初始化滚动条
			this.scroll 	= this.setScroll();
		}

		SmartTips.options 			= {};
		SmartTips.prototype 		= baseCtr;
		SmartTips.prototype.show	= function(options){
			var self = this;

			// 定位，显示
			this.position(options.trigger);
			this.element.show();

			// 隐藏
			$(document).bind('vmouseup',function(event){
				if(!$(event.target).isChildAndSelfOf(self.element)){
					self.element.hide();
				}
			});

			// 数据绑定
			self.list.html('');
			for(var i in options.data){
				var item = $('<item></item>');
				var text = '';
				for(var j in options.field){
					text += options.data[i][options.field[j]] + '/';
				}
				for(var s in options.attr){
					item.attr(options.attr[s],options.data[i][options.attr[s]]);
				}
				item.text(text);
				item.attr('key',text);

				// 选中
				item.click(function(){
					options.trigger.val($(this).text());
					self.element.hide();
					options.callback(options.trigger,$(this));
				});

				self.list.append(item);
			}
			self.scroll.refresh();

			// 智能排序,着色
			options.trigger.bind('input propertychange',function(){
				var str = $(this).val();
				self.list.find('item').each(function(){
					var key = $(this).attr('key');
					str = str.toUpperCase();
					if(key.indexOf(str) >= 0 && str.length > 0){
						var txt = $(this).text().replace(str,'<span>'+ str +'</span>');
						$(this).html(txt);
						self.list.prepend($(this));
					}else{
						var txt = $(this).text().replace(/<[^>].*?>/g,'');
						$(this).html(txt);
					}
					if(str == ''){
						var txt = $(this).text().replace(/<[^>].*?>/g,'');
						$(this).html(txt);
					}
				});
			});

		}

		$(document).ready(function(){
			$.smartTips = new SmartTips();
		});
	})();

	$.fn.popBox = function(options){
		// 新建POPBOX
		new POPBox($(this),options);
	}

	$.fn.bubbleBox = function(options){
		// 新建BubbleBox
		new BubbleBox($(this),options);
	}

	$.fn.glbBubbleBox = function(options){
		return new BubbleBox($(this),options);
	}

	$.bubbleList = function(options){
		// 
		return new BubbleList(options);
	}

})(window.jQuery);