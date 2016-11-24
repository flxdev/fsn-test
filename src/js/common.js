function burgerMenu(){
	var _this = this;

	_this.eventHandler = function(){
		_this.trigger.addEventListener("click", _this.openMenu, false);
		_this.menu.addEventListener("click",_this.closeMenu, false);

		_this.menuChild.addEventListener("click", function(event){
			event.stopPropagation();
		})
		_this.circle.addEventListener("click", function(event){
			event.stopPropagation();
		})
	}

	 _this.openMenu = function() {
	 	if(!_this.trigger.classList.contains("open")) {
	 		_this.perspective.classList.add("perspective-action");
			_this.menu.classList.add("navigation-open");
			_this.trigger.classList.add("open");
	 	} else {
	 		_this.closeMenu();
		}
	 }

	 _this.closeMenu = function(){
		_this.menu.classList.remove("navigation-open");
		_this.perspective.classList.remove("perspective-action");
		_this.trigger.classList.remove("open");
	 }

	 _this.init = function(){
	 	_this.trigger = document.querySelector(".burger");
		_this.perspective = document.querySelector(".perspective");
		_this.menu = document.querySelector(".navigation-site");
		_this.menuChild = document.querySelector(".navigation-container");
		_this.circle = document.querySelector(".overlay-circle");
		_this.eventHandler();

	}
}

window.onload = function() {
	var b = new burgerMenu();
	b.init();
}

function extend( a, b ) {
	for( var key in b ) { 
		if( b.hasOwnProperty( key ) ) {
			a[key] = b[key];
		}
	}
	return a;
}

function FullSlider(el, config) {
	this.el = el;

	this.options = extend( {}, this.config );
	extend( this.options, config );

	this.conf = {
		classes: {
			next: "next",
			prev: "prev",
			prevClass: "slideOut",
			nextClass: "slideIn",
			activeCLass: "current"
		},
		animationEvents: "mozAnimationEnd MSAnimationEnd oAnimationEnd animationend"
	}

	this.initDefault()
};

FullSlider.prototype.initDefault = function(){
	$(this.options.slide).first().addClass("current");
	$(this.options.innerSlider).children().first().addClass("active");
	$(this.options.paginBar).children().first().addClass("current");
	this.currentColor = $(this.options.slide).parent().find(".current img").data("color");
	$(this.options.colorContainer).css("background-color", this.currentColor)
	this.slides = $(this.options.slide);

	this.init();
};

FullSlider.prototype.init = function(){
	this.paginTrigger = $(this.options.paginBar).children();
	this.colorContainer = $(this.el).find(".color-container");

	this.action = false;

	this.handlerEvents();
};

FullSlider.prototype.handlerEvents = function(){
	var self = this;
	this.paginTrigger.on("click", function(){

		if($(this).hasClass("current")) return false;

		if(self.action) {
			return false;
		}

		self.action = true;

		this.curr = $(self.options.paginBar).find(".current").data("index-pagin");
		this.next = $(this).data("index-pagin");


		self.triggerBullets($(this).data("index-pagin"))
		self.show(this.curr, this.next);
		
	});
};

FullSlider.prototype.triggerBullets = function(index){
	this.paginTrigger.eq(index).addClass("current").siblings().removeClass("current");
};

FullSlider.prototype.show = function(curr, next) {

	this.curr_slide = this.slides[curr];
	this.next_slide = this.slides[next];

	if(!$(this.next_slide).find(".full-slider-inserted")) {
		this.next_slideColor = $(this.next_slide).find(".active img").data("color");
	} else {
		this.next_slideColor = $(this.next_slide).find("img").data("color");
	}

	$(this.options.colorContainer).css("background-color", this.next_slideColor);

	$(this.next_slide).addClass(this.conf.classes.activeCLass + " " + this.conf.classes.nextClass).siblings().removeClass(this.conf.classes.activeCLass + " " + this.conf.classes.nextClass);
	$(this.curr_slide).addClass(this.conf.classes.prevClass).siblings().removeClass(this.conf.classes.prevClass);

	this.animationEnd($(this.next_slide))
	
};

FullSlider.prototype.animationEnd = function(elem){
	var self = this;
	$(elem).one("mozAnimationEnd MSAnimationEnd oAnimationEnd animationend", function(){
		self.action = false;
		self.slides.removeClass(self.conf.classes.prevClass + " " + self.conf.classes.nextClass)
	});
};