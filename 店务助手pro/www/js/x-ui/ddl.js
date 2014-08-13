/*--下拉框--------------------------------------------------*/
$('dropdownlist').each(function(){
	var textBoxId 		= $(this).attr('textBoxId'),
		textBoxClass	= $(this).attr('textBoxClass'),
		valBoxId		= $(this).attr('valBoxId'),
		valBoxClass		= $(this).attr('valBoxClass'),
		input			= $('<input id="'+ textBoxId +'" class="'+ textBoxClass +'" type="text">'),
		hidden			= $('<input id="'+ valBoxId  +'" class="'+ valBoxClass  +'" type="hidden">'),
		element			= $(this),
		html			= $(this).html(),
		itemBox			= $('<itemlist><div>'+ html +'</div></itemlist>'),
		triangle		= $('<div class="dropdownlist-triangle"></div>'),
		triangleBorder	= $('<div class="dropdownlist-triangle-border"></div>');

	//console.log($(this).attr('id') + '---------------' + input.length);

	// 清空原有数据，添加ItemBox
	$(this).html('');
	$(this).append(itemBox);


	// 数据绑定
	var addItem = function(val,text,callback){
		var item = $('<item value="'+ val +'">' + text + '</item>');
		item.on('vclick',function(){
			input.val($(this).text());
			hidden.val($(this).attr('value'));
			triangleBorder.hide();
			triangle.hide();
			element.hide();
			if(typeof callback === 'function'){
				callback(item);
			}
		});
		itemBox.find('div').append(item);
	}

	if(element.attr('dataBind') !== undefined){
		var dataBind = element.attr('dataBind');
		eval(dataBind + "(addItem)");
	}else{
		itemBox.find('item').on('vclick',function(){
			input.val($(this).text());
			hidden.val($(this).attr('value'));
			triangleBorder.hide();
			triangle.hide();
			element.hide();
		});
	}

	// 接受数据input
	input	.attr('placeholder','点击请选择')
			.attr('readonly','true');
	
	// 追加input hidden
	$(this)	.before(hidden)
			.before(input)
			.before(triangle)
			.before(triangleBorder);

	// 定位
	$(this).parent().css({'position':'relative'});
	var position = function(){

		var prev = triangle.prev(),
			top  = prev.position().top + prev.height() + 15,
			left = (element.width() / 2) - 10;

		triangle.css({
			'left' : left + 'px',
			'top'  : top  + 'px'
		});

		triangleBorder.css({
			'left' : left + 'px',
			'top'  : (top - 1) + 'px'
		});

		element.css({
			'top'  : (top + 10) + 'px'
		});
	};


	// 可以滑动
	var srcoll = new iScroll(itemBox[0],{
		onBeforeScrollStart: function (e) {
			e.preventDefault();
			e.stopPropagation();
		}
	});
	// 点击input 显示DropDownList
	input.tap(function(){
		triangleBorder.show();
		triangle.show();
		element.show();
		position();
		srcoll.refresh();
	});

	// 点击其他地方DropDownList隐藏
	$(document).bind('vmouseup',function(e){
		if(!($(e.target).is('dropdownlist')) && !($(e.target).is('itemlist')) && !($(e.target).is('item'))){
			triangleBorder.hide();
			triangle.hide();
			element.hide();
		}
	});
});