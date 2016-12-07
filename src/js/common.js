'use strict'
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

	// this.tw = new TimelineLite();

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
				$(this.isHover).trigger("mouseenter");
			}
		} else {
			$(elem).removeClass(self.conf.classes.prevClass + " " + self.conf.classes.nextClass).siblings().removeClass(self.conf.classes.prevClass + " " + self.conf.classes.nextClass);
		}

	});
};

function lazy(parameter){

	var defaultParams = {
		effect: 'fadeIn',
		effectTime: "150"
	};

	var modifyParams = {
		effect: 'fadeIn',
		effectTime: "150",
		appendScroll: $(parameter)
	};

	if(parameter == undefined || typeof parameter == "function") {
		$(".lazy").Lazy(defaultParams)
	} else {
		$(".lazy").Lazy(modifyParams)
	};
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
		_this.slideRight = _this.el.find("#current-page .slideRight").data("color");
		_this.slideLeft = _this.el.find("#current-page .slideLeft").data("color");

		_this.c.topColor.css("background-color", _this.slideRight);
		_this.c.bottomColor.css("background-color", _this.slideLeft);
	};

	_this.f.initPagination = function(){
		
	};

	_this.f.nextPage = function(){

		if(_this.action) {
			return false;
		}

		if(!_this.c.nextPageContainer.children().first().length) return false;

		_this.page = _this.c.nextPageContainer.children().first().detach();
		_this.c.currentPageContainer.append(_this.page);

		var link_value = $('#next-link').attr("href");

		if(link_value === "#" || link_value === "undefined") return false;

		_this.f.ajaxPage(link_value);
		_this.f.animation(_this.options.animNext);
	}

	_this.f.prevPage = function(){

		if(_this.action) {
			return false;
		}

		if(!_this.c.prevPageContainer.children().first().length) return false;

		_this.page = _this.c.prevPageContainer.children().first().detach();
		_this.c.currentPageContainer.append(_this.page);

		var link_value = $('#prev-link').attr("href");

		if(link_value === "#" || link_value === "undefined") return false;

		_this.f.ajaxPage(link_value);
		_this.f.animation(_this.options.animPrev);
	}

	_this.f.ajaxPage = function(link) {
		$.ajax({
			url: link,
			dataType: "html",
			beforeSend: function(){

			},
			success: function(content) {
				var prevContent = $(content).find("#prev-page").html();
				var nextContent = $(content).find("#next-page").html();
				var naviContent = $(content).find(".navigation-container").html();
				var currentPage = $(content).find(".pagination-container .current").text();

				_this.c.prevPageContainer
					.empty()
					.append(prevContent)

				_this.c.nextPageContainer
					.empty()
					.append(nextContent)

				_this.c.navi
					.empty()
					.append(naviContent)
				lazy();

				setTimeout(function(){
					_this.c.currentPage.text(currentPage);
				}, 500)
			}
		})
	}

	_this.f.animation = function(direction){
		_this.action = true;
		_this.child = _this.c.currentPageContainer.children();
		_this.c.currentPageContainer.addClass("animate " + direction);
		_this.child.first().addClass(_this.options.slideOut);
		_this.child.last().addClass(_this.options.slideIn);

		_this.f.animationEnd(_this.child.first(), direction, _this.child.last())
		_this.f.setColor(_this.child.last())
	}

	_this.f.setColor = function (nextContainer) {
		color_top = nextContainer.find(".slideLeft").data("color");
		color_bottom = nextContainer.find(".slideRight").data("color");

		_this.c.topColor.css("background-color", color_bottom);
		_this.c.bottomColor.css("background-color", color_top);
	}

	_this.f.animationEnd = function(elem, direction, curr_el) {
		$(elem).one("mozAnimationEnd MSAnimationEnd oAnimationEnd animationend", function(){
			_this.detached = $(this).detach();
			_this.c.currentPageContainer.removeClass(direction + " animate");
			curr_el.removeAttr("class")
			_this.action = false;

			// if(direction == _this.options.animNext) {
			// 	_this.c.prevPageContainer.empty();
			// 	_this.c.prevPageContainer.append(_this.detached);
			// 	_this.c.prevPageContainer.children().removeAttr("class")
			// }
		});
	}

	_this.initHandlers = function(){
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

		_this.c.navi = $(".navigation-container");
		_this.c.naviNext = _this.c.navi.find('#next-link');
		_this.c.naviPrev = _this.c.navi.find('#prev-link');

		_this.c.currentPage = $(".pagination-container").find(".current");

		_this.f.initColor();
		_this.initHandlers();

	};
}

function flipCard() {
	var element = $(".flip-card"),
		openClass = "flip-card_flipped";
	element.each(function(){
		var _ = $(this),
			triggerOpen = _.find(".slide-link"),
			triggerClose = _.find(".slide-link_close");

		triggerOpen.on("click", function(){
			_.addClass(openClass);
		});

		triggerClose.on("click", function(){
			_.removeClass(openClass);
		});
	});
}

function FlipGallery(el) {
	this.el = el;

	this.options = {
		speed: 1200,
		transform: 'transform',
		transition: "transition",
		ease: "cubic-bezier(0.25, 0.1, 0.25, 1)"
	}

	this.init();
}

FlipGallery.prototype.init = function() {

	var self = this;

	this.action = false;

	this.card = this.el.find(".card-item");
	this.thumbnails = this.el.find(".thumbnails-items");
	this.thumbnailsLength = this.thumbnails.length;

	this.setIndex();

	this.scroller = this.el.find(".thumbnails-scroller");
	this.scrollerCard = this.el.find(".card-container");

	this.scroller.attr("style", this.options.transform + ": translate(0,0);" + this.options.transition + ": " + this.options.speed + "ms " + this.options.ease + " " + this.options.transform + ";")
	this.scrollerCard.attr("style", this.options.transform + ": translate(0,0);" + this.options.transition + ": " + this.options.speed + "ms " + this.options.ease + " " + this.options.transform + ";")

	this.eventHandlers();

	this.img = this.el.find(".lazy");

	this.paginContainer = $(".pagination-container");
	if(this.thumbnailsLength < 10) {
		this.paginContainer.find(".pagination-all").text("0" + this.thumbnailsLength);
	} else {
		this.paginContainer.find(".pagination-all").text(this.thumbnailsLength);
	}

	$(window).resize(function(){
		this.timer;
		clearTimeout(this.timer);
		this.timer = setTimeout(function(){
			self.update();
		},300);
	})
}

FlipGallery.prototype.setIndex = function(){
	var self = this;
	this.cardLength = this.card.length;
	this.thumbnailsLength = this.thumbnails.length;

	for(var i = 0; i < this.cardLength; i++) {
		self.card.eq(i).attr("data-flip-card", i);
	}

	for(var k = 0; k < this.thumbnailsLength; k++) {
		self.thumbnails.eq(k).attr("data-flip-item", k);
	}

	this.card.first().addClass("active");
	this.thumbnails.first().addClass("active");
};

FlipGallery.prototype.generatePagination = function(next){
	var self = this;
	this.nextIndex = next + 1;

	setTimeout(function(){	
		if(self.nextIndex < 10) {
			self.paginContainer.find(".current").text('0' + self.nextIndex);
		} else {
			self.paginContainer.find(".current").text(self.nextIndex);
		}
	},300);
}

FlipGallery.prototype.eventHandlers = function () {
	var self = this;

	document.addEventListener("keyup", function(event){
		if( event.keyCode === 40 ) self.nextElements();
		if( event.keyCode === 38 ) self.prevElements();
	});

	this.thumbnails.on("click", function(){
		if($(this).hasClass("active")) return false;
		self.nextElements()
	})
};



FlipGallery.prototype.nextElements = function(){

	this.curr = this.scroller.find(".active").data("flip-item");
	this.next = this.curr + 1

	if(this.next >= this.thumbnailsLength)
		return false;

	this.slide(this.curr, this.next, "next");
};

FlipGallery.prototype.prevElements = function(){
	
	this.curr = this.scroller.find(".active").data("flip-item");
	this.next = this.curr - 1

	if(this.next < 0)
		return false;

	this.slide(this.curr, this.next, "prev");

};

FlipGallery.prototype.setTransform = function(valueThumb, valueCard) {
	this.scroller.attr("style", this.options.transform + ": translate(0," + valueThumb + "px);" + this.options.transition + ": " + this.options.speed + "ms " + this.options.ease + " " + this.options.transform + ";")
	this.scrollerCard.attr("style", this.options.transform + ": translate(0," + valueCard + "px);" + this.options.transition + ": " + this.options.speed + "ms " + this.options.ease + " " + this.options.transform + ";")
	this.img.lazy({
		bind: "event"
	});
};

FlipGallery.prototype.slide = function(curr, next, direction) {
	var self = this;

	if(this.action) {
		return false;
	}

	this.action = true;

	this.generatePagination(this.next);

	this.thumbnails.eq(curr).addClass("hidden").removeClass("active");
	this.thumbnails.eq(next).addClass("active").removeClass("hidden");

	this.offtopCard = next * $(window).height();
	this.offtop = this.thumbnails.eq(next).position().top;

	this.setTransform(-this.offtop, -this.offtopCard)

	if(direction == "prev") {
		this.thumbnails.eq(curr).removeClass("active hidden");
		this.thumbnails.eq(next).addClass("active").removeClass("hidden");
	} else {
		this.thumbnails.eq(curr).addClass("hidden").removeClass("active");
		this.thumbnails.eq(next).addClass("active").removeClass("hidden");
	}

	this.card.eq(next).addClass("active").siblings().removeClass("active");

	this.offtopCard = null;
	this.offtop = null;


	this.animationEnd(curr);

};

FlipGallery.prototype.animationEnd = function(current){
	var self = this;

	setTimeout(function(){
		self.action = false;
	}, self.options.speed);

	setTimeout(function(){
		if(self.card.eq(current).find(".flip-card").is(".flip-card_flipped"))
			self.card.eq(current).find(".flip-card").removeClass("flip-card_flipped");
	}, self.options.speed / 1.5);
};

FlipGallery.prototype.update = function(){
	this.index = this.card.parent().find(".active").index();

	this.offtopCardResize = -(this.index * $(window).height());
	this.offtopResize = -(this.thumbnails.eq(this.index).position().top);

	this.scroller.attr("style", this.options.transform + ": translate(0," + this.offtopResize + "px);" + this.options.transition + ": " + this.options.speed + "ms " + this.options.ease + " " + this.options.transform + ";")
	this.scrollerCard.attr("style", this.options.transform + ": translate(0," + this.offtopCardResize + "px);" + this.options.transition + ": " + this.options.speed/2 + "ms " + this.options.ease + " " + this.options.transform + ";")
};