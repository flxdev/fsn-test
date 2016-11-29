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
		current: {
			slide: 0,
			slideInner: 0
		},
		classes: {
			next: "next",
			prev: "prev",
			prevClass: "slideOut",
			nextClass: "slideIn",
			activeCLass: "current",
			activeCLassTransform: "active",
			prevClassTransform: "transform-out",
			nextClassTransform: "transform-in"
		},
		animationEvents: "mozAnimationEnd MSAnimationEnd oAnimationEnd animationend"
	}

	this.tw = new TimelineLite();

	this.initDefault()
};

FullSlider.prototype.initDefault = function(){
	var self = this;
	$(this.options.slide).first().addClass("current");
	$(this.options.paginBar).children().first().addClass("current");
	this.currentColor = $(this.options.slide).parent().find(".current img").data("color");
	$(this.options.colorContainer).css("background-color", this.currentColor)
	this.slides = $(this.options.slide);
	// this.slidesInner = $(this.options.innerSlider).find(".slide-inserted");

	$(this.options.slide).find("img").each(function(){
		this.color = $(this).data("color");

		$(this).parent().find("img").parent().css("background-color", this.color);
	})

	$(this.options.innerSlider).each(function(){
		$(this).find(".slide-inserted").first().addClass("active");
		$(this).find(".slide-inserted").first().next().addClass("slideNext");
		this.lengthSlide = $(this).find(".slide-inserted").length;
		self.generateBullets($(this), this.lengthSlide);
	});

	this.init();
};

FullSlider.prototype.generateBullets = function(container, length){
	var self = this;

	for(var i = 0; i < length; i++) {
		container.find(this.options.innerBullets).append("<span class='bullet' data-bullet-index='" + i + "'></span>")
	}

	container.find(".bullet").first().addClass("active");
}

FullSlider.prototype.init = function(){
	this.paginTrigger = $(this.options.paginBar).children();
	this.colorContainer = $(this.el).find(".color-container");
	this.arrowBtn = $(this.options.arrowNext);

	this.bulletItem = $(this.options.innerBullets).find(".bullet");

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

		this.curr = $(self.options.paginBar).find(".current").data("index-pagin");
		this.next = $(this).data("index-pagin");

		self.triggerNavBullets($(this).data("index-pagin"))
		self.show(this.curr, this.next, self.slides);
		self.conf.current.slideInner = $(self.options.slide).eq(this.next).find(".active").index();
	});

	this.bulletItem.on("click", function(){
		if($(this).hasClass("active")) return false;

		if(self.action) {
			return false;
		}

		this.curr = $(this).parents(self.options.innerBullets).find(".active").data("bullet-index");
		this.next = $(this).data("bullet-index");


		this.slidesInserted = $(this).parents(self.options.innerSlider).find(".slide-inserted");

		self.triggerBullets($(this))
		self.show(this.curr, this.next, this.slidesInserted);
	});

	document.addEventListener("keyup", function(event){
		if(self.action) {
			return false;
		}
		if( event.keyCode === 38 ) self.prev();
		if( event.keyCode === 40 ) self.next();
	});

	this.arrowBtn.on("mouseenter", function() {
		$(this).parents(self.options.innerSlider).addClass("hovered");
	});
	this.arrowBtn.on("mouseleave", function() {
		if($(this).parents(self.options.innerSlider).hasClass("animation")) return false;
		$(this).parents(self.options.innerSlider).removeClass("hovered");
	});

	this.arrowBtn.on("click", function(){
		$(this).parents(self.options.innerSlider).addClass("animation");

		self.triggerNext($(this).parents(self.options.innerSlider).find(".slide-inserted"))
	})

};

FullSlider.prototype.triggerNext = function(slides){
	this.cur_slide = this.conf.current.slideInner;
	this.next_slide = this.cur_slide + 1;
	this._next_slide = slides[this.next_slide];


	if(typeof this._next_slide == "undefined")
		this.next_slide = 0

	this.show(this.cur_slide, this.next_slide, slides);	
	this.triggerBullets($(this.next_slide).parents(this.options.innerSlider).find("[data-bullet-index=" + $(this.next_slide).index() + "]"))

}

FullSlider.prototype.prev = function(){
	this.cur_slide = this.conf.current.slide;
	this.next_slide = this.cur_slide - 1;
	this._next_slide = this.slides[this.next_slide];

	if(typeof this._next_slide == "undefined")
		return false;

	this.show(this.cur_slide, this.next_slide, this.slides);
	this.triggerNavBullets($(this.next_slide).index());

	this.conf.current.slideInner = $(this.next_slide).find(".active").index();
}

FullSlider.prototype.next = function(){
	this.cur_slide = this.conf.current.slide;
	this.next_slide = this.cur_slide + 1;
	this._next_slide = this.slides[this.next_slide];

	if(typeof this._next_slide == "undefined")
		return false;

	this.show(this.cur_slide, this.next_slide, this.slides)
	this.triggerNavBullets($(this.next_slide).index());

	this.conf.current.slideInner = $(this.next_slide).find(".active").index();
}

FullSlider.prototype.triggerBullets = function(item){
	item.addClass("active").siblings().removeClass("active");
};

FullSlider.prototype.triggerNavBullets = function(index){
	this.paginTrigger.eq(index).addClass("current").siblings().removeClass("current");
};

FullSlider.prototype.show = function(curr, next, slides) {

	this.action = true;

	this.curr_slide = slides[curr];
	this.next_slide = slides[next];

	if($(this.next_slide).parents(".full-slider-inserted").length) {
		
		if(next + 1 >= slides.length) {
			this.next_rotator_slide = slides[0]
		} else {
			this.next_rotator_slide = slides[next + 1];
		}

		$(this.next_rotator_slide).addClass("slideNext").siblings().removeClass("slideNext");

		this.next_slideColor = $(this.next_slide).find("img").data("color");

		$(this.next_slide).addClass(this.conf.classes.activeCLassTransform + " " + this.conf.classes.nextClassTransform).siblings().removeClass(this.conf.classes.activeCLassTransform + " " + this.conf.classes.nextClassTransform);
		
		$(this.curr_slide).addClass(this.conf.classes.prevClassTransform).siblings().removeClass(this.conf.classes.prevClassTransform);

		$(this.options.colorContainer).css("background-color", this.next_slideColor);

		this.conf.current.slideInner = next;

	} else {
		this.next_slideColor = $(this.next_slide).find(".active img").data("color") || $(this.next_slide).find("img").data("color");

		$(this.next_slide).addClass(this.conf.classes.activeCLass + " " + this.conf.classes.nextClass).siblings().removeClass(this.conf.classes.activeCLass + " " + this.conf.classes.nextClass);
		$(this.curr_slide).addClass(this.conf.classes.prevClass).siblings().removeClass(this.conf.classes.prevClass);

		$(this.options.colorContainer).css("background-color", this.next_slideColor);
		this.conf.current.slide = next
	}

	this.animationEnd(this.next_slide );

	
};

FullSlider.prototype.animationEnd = function(elem){

	var self = this;

	$(elem).one("mozAnimationEnd MSAnimationEnd oAnimationEnd animationend", function(){
		self.action = false;
		if($(this).parents(".full-slider-inserted").length) {
			$(elem).removeClass(self.conf.classes.prevClassTransform + " " + self.conf.classes.nextClassTransform).siblings().removeClass(self.conf.classes.prevClassTransform + " " + self.conf.classes.nextClassTransform)
			$(self.options.innerSlider).removeClass("animation hovered");
			this.isHover = $(elem).parents(self.options.innerSlider).find(self.arrowBtn);
			if($(this.isHover).filter(":hover").length){
				$(self.arrowBtn).trigger("mouseenter");
			}
		} else {
			$(elem).removeClass(self.conf.classes.prevClass + " " + self.conf.classes.nextClass).siblings().removeClass(self.conf.classes.prevClass + " " + self.conf.classes.nextClass);
		}

	});
};

function lazy(){
	$(".lazy").Lazy({
		effect: 'fadeIn',
		effectTime: "150"
	})
}

function GallerySlider(el) {
	var _this = this;

	_this.el = el;

	_this.f = {};
	_this.c = {};

	_this.options = {
		slideIn: "slideIn",
		slideOut: "slideOut",
		animNext: "animateNext",
		animPrev: "animatePrev"
	}

	_this.action = false;

	_this.f.initColor = function(){
		_this.slideRight = _this.el.find("#slideRight").data("color");
		_this.slideLeft = _this.el.find("#slideLeft").data("color");

		_this.c.topColor.css("background-color", _this.slideRight);
		_this.c.bottomColor.css("background-color", _this.slideLeft);
	};

	_this.f.initPagination = function(){
		
	};

	_this.f.nextPage = function(){
		if(!_this.c.nextPageContainer.children().first().length) return false;

		_this.page = _this.c.nextPageContainer.children().first().detach();
		_this.c.currentPageContainer.append(_this.page);

		_this.f.animation(_this.options.animNext);
	}

	_this.f.prevPage = function(){
		
	}

	_this.f.animation = function(direction){
		_this.child = _this.c.currentPageContainer.children();
		_this.c.currentPageContainer.addClass("animate " + direction);
		_this.child.first().addClass(_this.options.slideOut);
		_this.child.last().addClass(_this.options.slideIn);

		_this.f.animationEnd(_this.child.first(), direction, _this.child.last())
	}

	_this.f.animationEnd = function(elem, direction, curr_el) {
		$(elem).one("mozAnimationEnd MSAnimationEnd oAnimationEnd animationend", function(){
			_this.detached = $(this).detach();
			_this.c.currentPageContainer.removeClass(direction + " animate");
			curr_el.removeAttr("class")

			if(direction == _this.options.animNext) {
				_this.c.prevPageContainer.empty();
				_this.c.prevPageContainer.append(_this.detached);
				_this.c.prevPageContainer.children().removeAttr("class")
			}
		});
	}

	_this.initHanders = function(){
		document.addEventListener("keyup", function(event){
		if(self.action) {
			return false;
		}
		if( event.keyCode === 40 ) _this.f.nextPage()
		if( event.keyCode === 38 ) _this.f.prevPage()
	});
	}

	_this.init = function(){
		
		_this.c.topColor = $("#topline");
		_this.c.bottomColor = $("#bottomline");

		_this.c.prevPageContainer = $("#prev-page");
		_this.c.nextPageContainer = $("#next-page");
		_this.c.currentPageContainer = $("#current-page");

		_this.f.initColor();
		_this.initHanders();

	};
}

