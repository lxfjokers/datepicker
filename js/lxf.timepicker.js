/*
 * 年月日范围验证，年月超过范围则隐藏箭头，日超过范围则在日历中隐藏
 * */

var lxfTimePicker = function( ele, toele, options ){
	//默认参数
	var defaults = {
		format: 'yyyy-mm-dd',
		beginYear: '1990',//开始年份
		beginMonth: '01',//开始月份
		beginDay: '01',//开始日期
		endYear: '2100',//结束年份
		endMonth: '01',//结束月份
		endDay: '01',//结束日期
		nowYear: '2000',//结束年份
		nowMonth: '01',//结束月份
		nowDay: '29',//结束日期
		showNowDate: true,//是否标注当前日期
	};
	
	self.ele = ele;
	self.toele = toele || ele;
	
	//声明空配置项
	self.options = {}
	//写入配置项
	self.options.format = options.format || defaults.format;
	self.options.beginYear = options.beginYear || defaults.beginYear;
	self.options.beginMonth = options.beginMonth || defaults.beginMonth;
	self.options.beginDay = options.beginDay || defaults.beginDay;
	self.options.endYear = options.endYear || defaults.endYear;
	self.options.endMonth = options.endMonth || defaults.endMonth;
	self.options.endDay = options.endDay || defaults.endDay;
	self.options.nowYear = options.nowYear || defaults.nowYear;
	self.options.nowMonth = options.nowMonth || defaults.nowMonth;
	self.options.nowDay = options.nowDay || defaults.nowDay;
	self.options.showNowDate = options.showNowDate || defaults.showNowDate;
	
	this.fun = self.fun = new lxfTimeFunction();
	this.fun.init();//初始化类
	this.fun.template();//初始化模板
	this.fun.addElement();//给元素添加值
	this.fun.addListener();//添加监听事件
	
	document.body.addEventListener('touchstart', function(){});
}

var lxfTimeFunction = (function(){
	var extras = {                                                
		init: function(){//初始化参数
			//生成随机数
			self.random = this.getRandom();
			//获取头部列表
			this.getHeadTemplate();
			//获取日期列表
			this.getDateTemplate();
			//获取年份列表
			this.getYearTemplate();
		},
		template: function(){//生成模板
			str = '<div class="lxf-time-shadow lxf-time-shadow-'+self.random+'"></div>'+
					'<div class="lxf-time-box lxf-time-box-'+self.random+'">'+
						'<div class="lxf-time-container">'+
							this.headTemplate+
							'<div class="lxf-time-content">'+
								this.dateTemplate+
								this.yearTemplate+
							'</div>'+
							this.footTemplate+
						'</div>'+
						'<input type="hidden" class="lxf-input-date" value="'+self.options.nowYear+'-'+self.options.nowMonth+'-'+self.options.nowDay+'"/>'+
						'<input type="hidden" class="lxf-input-hidden-date" value="'+self.options.nowYear+'-'+self.options.nowMonth+'-'+self.options.nowDay+'"/>'+
					'</div>';
			$(document.body).append(str);
		},
		getHeadTemplate: function(){//获取头部模板
			
			var w = this.getWeekName( this.getWeek(self.options.nowYear,self.options.nowMonth,self.options.nowDay) );
			
			str = '<div class="lxf-time-title">'+
							'<a class="lxf-time-year">'+self.options.nowYear+'</a>'+
							'<a class="lxf-time-date active">'+self.options.nowMonth+'月'+self.options.nowDay+'日 周'+w+'</a>'+
						'</div>',
			this.headTemplate = str;//写入头部模板
		},
		getDateTemplate: function(){//获取年份列表
			str = '<div class="lxf-time-list-date">'+
						'<div class="lxf-time-list-date-select">'+
							'<a class="lxf-time-list-date-select-prev" data-type="prev">‹</a><span>'+self.options.nowYear+'年'+self.options.nowMonth+'月</span><a class="lxf-time-list-date-select-next" data-type="next">›</a>'+
						'</div>'+
						'<div class="lxf-time-list-date-title">'+
							'<ul>'+
								'<li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li>'+
							'</ul>'+
						'</div>'+
						'<div class="lxf-time-list-date-content">'+
							'<ul>';
			//获取初始化的日期列表
			str +=	this.getDateList(self.options.nowYear,self.options.nowMonth,self.options.nowDay);
								
			str += 			'</ul>'+
						'</div>'+
					'</div>';
			this.dateTemplate = str;//写入年份模板
		},
		getYearTemplate: function(){//获取年份列表
			str = '<div class="lxf-time-list-year">'+
						'<ul>';
			//根据开始时间,结束时间循环年份列表
			for( i = self.options.beginYear; i <= self.options.endYear; i ++ ){
				if( self.options.nowYear == i ){
					str += '<li class="active">'+i+'</li>';
				}else{
					str += '<li>'+i+'</li>';
				}
			}
			str += 	'</ul>'+
					'</div>';
			this.yearTemplate = str;//写入年份模板
		},
		getDateList: function( year, month, day ){//获取当月日期选择器
			var num = this.getDayNum( year, month );
			//判断是否是初始化选择器，为0就不是
			if( day == 0 ){
				old_date = $(".lxf-time-box-"+self.random).find(".lxf-input-date").val();
				old_dt = old_date.split("-");
			}
			//获取本月第一天是周几
			var week = this.getWeek( year, month, 1 );
			//初始化
			var str = '';
			//循环出空位置
			for( i = 0; i < week; i++ ){
				str += '<li></li>';
			}
			for( i = 1; i <= num; i++ ){
				if( i == day && self.options.showNowDate ){
					str += '<li class="active">'+i+'</li>';
				}else if( day == 0 && old_dt[0] == year && old_dt[1] == month && old_dt[2] == i ){
					str += '<li class="active">'+i+'</li>';
				}else{
					str += '<li>'+i+'</li>';
				}
			}
			return str;
		},
		changeDateList: function( year, month, day ){
			list = this.getDateList( year, month, day );
			$(".lxf-time-box-"+self.random).find(".lxf-time-list-date-content ul").html(list);
			this.addDateListener();
		},
		footTemplate: '<div class="lxf-time-footer">'+
							'<a class="lxf-time-cancal">取消</a>'+
							'<a class="lxf-time-confirm">确定</a>'+
						'</div>',
		addElement: function(){//给元素添加值
			$(self.ele).attr("data-lxf-time",self.random);
		},
		scrollYear: function(){//年份选中滚动
			var s_box = $(".lxf-time-box-"+self.random).find(".lxf-time-list-year");
			var s_top = $(s_box).find(".active").offset().top;
			$(s_box).scrollTop( s_top - $(s_box).height() - 290 );
		},
		initScrollYear: function(){
			var s_box = $(".lxf-time-box-"+self.random).find(".lxf-time-list-year");
			$(s_box).scrollTop(0);
		},
		addYearActive: function( year ){
			var li = $(".lxf-time-box-"+self.random).find(".lxf-time-list-year li");
			$(li).removeClass("active");
			$(li).each(function(){
				if( $(this).html() == year ){
					$(this).addClass("active");
				}
			})
		},
		addListener: function(){
			//添加年份选择的监听事件
			$(".lxf-time-box-"+self.random).find(".lxf-time-year").on("click",function(){
				$(".lxf-time-box-"+self.random).find(".lxf-time-list-year").fadeIn(300);
				$(".lxf-time-box-"+self.random).find(".lxf-time-list-date").fadeOut(300);
				$(".lxf-time-box-"+self.random).find(".lxf-time-year").addClass("active");
				$(".lxf-time-box-"+self.random).find(".lxf-time-date").removeClass("active");
				self.fun.scrollYear();
			});
			//添加日期选择的监听事件
			$(".lxf-time-box-"+self.random).find(".lxf-time-date").on("click",function(){
				$(".lxf-time-box-"+self.random).find(".lxf-time-list-date").fadeIn(300);
				$(".lxf-time-box-"+self.random).find(".lxf-time-list-year").fadeOut(300);
				$(".lxf-time-box-"+self.random).find(".lxf-time-date").addClass("active");
				$(".lxf-time-box-"+self.random).find(".lxf-time-year").removeClass("active");
				self.fun.initScrollYear();
			});
			//添加取消按钮呼唤的监听事件
			$(".lxf-time-box-"+self.random).find(".lxf-time-cancal").on("click",function(){
				//隐藏元素
				$(".lxf-time-box-"+self.random).hide();
				$(".lxf-time-shadow-"+self.random).hide();
				//重置当前日期项状态
				$(".lxf-time-box-"+self.random).find(".lxf-time-list-date").show();
				$(".lxf-time-box-"+self.random).find(".lxf-time-list-year").hide();
				$(".lxf-time-box-"+self.random).find(".lxf-time-date").addClass("active");
				$(".lxf-time-box-"+self.random).find(".lxf-time-year").removeClass("active");
			});
			//添加确认按钮呼唤的监听事件
			$(".lxf-time-box-"+self.random).find(".lxf-time-confirm").on("click",function(){
				//获取当前选择的值
				var val = $(".lxf-time-box-"+self.random).find(".lxf-input-date").val();
				var val_arr = val.split("-");
				//格式化日期
				val = self.fun.dateFormat(val_arr[0],val_arr[1],val_arr[2]);
				//判断当前对象的类型，如果是input则赋值val，否则赋值html
				obj_type = $(self.toele)[0].tagName;
				if( obj_type == "INPUT" ){
					$(self.toele).val(val);
				}else{
					$(self.toele).html(val);
				}
				
				//隐藏元素
				$(".lxf-time-box-"+self.random).hide();
				$(".lxf-time-shadow-"+self.random).hide();
				//重置当前日期项状态
				$(".lxf-time-box-"+self.random).find(".lxf-time-list-date").show();
				$(".lxf-time-box-"+self.random).find(".lxf-time-list-year").hide();
				$(".lxf-time-box-"+self.random).find(".lxf-time-date").addClass("active");
				$(".lxf-time-box-"+self.random).find(".lxf-time-year").removeClass("active");
			});
			//添加查看前一个月或下一个月份事件
			$(".lxf-time-box-"+self.random).find(".lxf-time-list-date-select-prev,.lxf-time-list-date-select-next").on("click",function(){
				type = $(this).attr("data-type");//获取操作是向前还是向后
				dt = $(".lxf-time-box-"+self.random).find(".lxf-input-hidden-date");//获取当前展示的时间
				d = new Date( $(dt).val() );//实例化日期
				year = d.getFullYear();//当前年份
				month = d.getMonth() + 1;//当前月份
				day = d.getDate();//当前日期
				if( type == "prev" ){
					//月份-1
					if( month - 1 == 0 ){
						month = 12;
						year = year - 1;
					}else{
						month = month - 1;
					}
				}else if( type == "next" ){
					//月份+1
					if( month == 12 ){
						month = 1;
						year = year + 1;
					}else{
						month = month + 1;
					}
				}
				//获取当前年月的日期数量，如果当前day大于日期数量则day等于日期数量
				num = self.fun.getDayNum(year,month);
				day = day > num ? num : day; 
				
				//补零
				if( month < 10 ){
					month = "0"+month;
				}
				//补零
				if( day < 10 ){
					day = "0"+day;
				}
				new_date = year+"-"+month+"-"+day;
				self.fun.changeDateList(year,month,0);//写入新的日期列表
				$(dt).val(new_date);//写入日期隐藏值
				self.fun.addSelectDate(year,month);//写入顶部日期
			});
			//添加修改日期事件
			this.addDateListener();
			this.addYearListener();
			//添加触发控件元素的监听事件
			$(self.ele).on( "click",function(){
				//重新定义当前的监听元素值
				self.random = $(this).attr("data-lxf-time");
				//元素展示
				$(".lxf-time-box-"+self.random).show();
				$(".lxf-time-shadow-"+self.random).show();
			});
		},
		addDateListener: function(){
			//添加修改日期事件
			$(".lxf-time-box-"+self.random).find(".lxf-time-list-date-content li").on("click",function(){
				hd = $(".lxf-time-box-"+self.random).find(".lxf-input-hidden-date");
				d = $(hd).val().split("-");
				day = $(this).html();
				//补零
				if( day < 10 ){
					day = "0"+day;
				}
				//写入顶部title
				self.fun.addTitleDate(d[0],d[1],day);
				//写入值和隐藏值
				$(hd).val(d[0]+"-"+d[1]+"-"+day);
				$(".lxf-time-box-"+self.random).find(".lxf-input-date").val(d[0]+"-"+d[1]+"-"+day);
				//修改渲染样式
				$(".lxf-time-box-"+self.random).find(".lxf-time-list-date-content li").removeClass("active");
				$(".lxf-time-box-"+self.random).find(".lxf-time-year").html(d[0]);
				self.fun.addYearActive(d[0]);
				$(this).addClass("active");
			});
		},
		addYearListener: function(){
			//添加修改年份日期事件
			$(".lxf-time-box-"+self.random).find(".lxf-time-list-year li").on("click",function(){
				$(".lxf-time-box-"+self.random).find(".lxf-time-list-year li").removeClass("active");
				$(this).addClass("active");
				var val = $(this).html();//获取当前年份值
				$(".lxf-time-box-"+self.random).find(".lxf-time-year").html( val );
				//重新构建日期列表
				dt = $(".lxf-time-box-"+self.random).find(".lxf-input-date").val();
				d = dt.split("-");
				
				//获取当前年月的日期数量，如果当前day大于日期数量则day等于日期数量
				num = self.fun.getDayNum(d[0],d[1]);
				d[2] = d[2] > num ? num : d[2]; 
				
				//写入日期选择列表
				self.fun.changeDateList( val,d[1],d[2] );
				//写入顶部日期
				self.fun.addTitleDate( val,d[1],d[2] );
				self.fun.addSelectDate(val,d[1]);
				self.fun.initScrollYear();//初始化滚动
				//写入隐藏值
				$(".lxf-time-box-"+self.random).find(".lxf-input-date").val( val+"-"+d[1]+"-"+d[2] );
				$(".lxf-time-box-"+self.random).find(".lxf-input-hidden-date").val( val+"-"+d[1]+"-"+d[2] );
				//切换对象
				$(".lxf-time-box-"+self.random).find(".lxf-time-list-date").fadeIn(300);
				$(".lxf-time-box-"+self.random).find(".lxf-time-list-year").fadeOut(300);
				$(".lxf-time-box-"+self.random).find(".lxf-time-date").addClass("active");
				$(".lxf-time-box-"+self.random).find(".lxf-time-year").removeClass("active");
			});
		},
		addTitleDate: function( year,month,day ){
			w = this.getWeekName( this.getWeek( year,month,day ) );
			$(".lxf-time-box-"+self.random).find(".lxf-time-date").html(month+'月'+day+'日 周'+w);
		},
		addSelectDate: function( year,month ){
			//写入顶部的日期中
			$(".lxf-time-box-"+self.random).find(".lxf-time-list-date-select span").html( year+"年"+month+"月" );	
		},
		getDayNum: function(year, month) {//获取当前日期
			month = parseInt(month);
			if (this.isInArray([1, 3, 5, 7, 8, 10, 12], month)) {
				return 31;
			} else if (this.isInArray([4, 6, 9, 11], month)) {
				return 30;
			} else if (this.isLeapYear(year)) {
				return 29;
			} else {
				return 28;
			}
		},
		getWeek: function(year, month, day){//获取当前周几
			return new Date(year+"-"+month+"-"+day).getDay();
		},
		getWeekName: function( week ){
			var w = ["日","一","二","三","四","五","六"];
			return w[week];
		},
		dateFormat: function( year,month,day ){//格式化输出日期
			str = self.options.format;
			
			//年份判断
			if( str.indexOf("yyyy") == 0 ){
				str = str.replace(/yyyy/, year);
			}else if( str.indexOf("yy") == 0 ){
				str = str.replace(/yy/, year.substr(2, 2));
			}
			//月份判断
			if( str.indexOf("mm") > 0 ){
				str = str.replace(/mm/, month);
			}else if( str.indexOf("m") > 0 ){
				str = str.replace(/m/, month.replace(/\b(0+)/gi,""));
			}
			//日期判断
			if( str.indexOf("dd") > 0 ){
				str = str.replace(/dd/, day);
			}else if( str.indexOf("d") > 0 ){
				str = str.replace(/d/, day.replace(/\b(0+)/gi,""));
			}
			return str;
		},
		isLeapYear: function(year) {//判断是否是闰月
			return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
		},
		isInArray: function(array, item) {//判断是否在数组中
			for (var index in array) {
				var str = array[index];
				if (str === item) return true;
			}
			return false;
		},
		getRandom: function(){//获取随机字符串
		　　len = 10;
		　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
		　　var maxPos = chars.length;
		　　var str = '';
		　　for (i = 0; i < len; i++) {
		　　　　str += chars.charAt(Math.floor(Math.random() * maxPos));
		　　}
		　　return str;
		},
	};
	
	return function(){
		var a = [];
		a.push.apply(a, arguments);
		$.extend(a, extras);
		return a;
	};
	
})();
