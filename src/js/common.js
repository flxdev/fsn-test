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
	 	if(_this.trigger.classList.contains("modal")) return false;
	 	if(!_this.trigger.classList.contains("open")) {
	 		_this.perspective.classList.add("perspective-action");
			_this.menu.classList.add("navigation-open");
			_this.trigger.classList.add("open", "open_burger");
	 	} else {
	 		_this.closeMenu();
		}
	 }

	 _this.closeMenu = function(){
		_this.menu.classList.remove("navigation-open");
		_this.perspective.classList.remove("perspective-action");
		_this.trigger.classList.remove("open", "open_burger");
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
var b;
window.onload = function() {
	b = new burgerMenu();
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
	});

	$(window).on("DOMMouseScroll mousewheel", function(e){
			
		this.direction = bScroll.scrollEvents(e, self.action);

		if(this.direction == "up") {
			if(self.action) {
				return false;
			}
			self.prev();
		}
		if(this.direction == "down") {
			if(self.action) {
				return false;
			}
			self.next();
		}
	});

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
		$(window).on("DOMMouseScroll mousewheel", function(e){
			
			this.direction = bScroll.scrollEvents(e, self.action);

			if(this.direction == "up") {
				if(self.action) {
					return false;
				}
				_this.f.prevPage()
			}
			if(this.direction == "down") {
				if(self.action) {
					return false;
				}
				_this.f.nextPage()
			}
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

	$(window).on("DOMMouseScroll mousewheel", function(e){
			
		this.direction = bScroll.scrollEvents(e, self.action);

		if(this.direction == "up") {
			if(self.action) {
				return false;
			}
			self.prevElements();
		}
		if(this.direction == "down") {
			if(self.action) {
				return false;
			}
			self.nextElements();
		}
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

function BrandModal(el){
	this.el = el;
	this.init()
}
BrandModal.prototype = {
	init: function(){
		this.modalContainer = $(".brand-modal");
		this.brandContainer = $(".brand-modal_container");
		this.burger = this.modalContainer.parent().find(".burger");

		this.eventHandlers();
	},
	eventHandlers: function() {
		var self = this;
		this.el.on("click", function(){
			this.index = $(this).data("brand-index");
			self.openWindow(this.index)
		});
		this.brandContainer.on("click", function(event){
			event.stopPropagation();
		});
		this.modalContainer.on("click", function(){
			self.closeWindow();
		});
		this.burger.on("click", function(){
			self.closeWindow();
		});
	},
	openWindow: function(el) {
		this.modal = this.modalContainer.find("[data-modal-index=" + el + "]");

		this.modalContainer.addClass("mobal-open modal-animate");
		this.modal.addClass("open");
		this.burger.addClass("modal open_burger");
	},
	closeWindow: function(){
		var self = this;
		this.brandContainer.removeClass("open");
		this.modalContainer.removeClass("modal-animate");
		this.burger.removeClass("open_burger");
		setTimeout(function(){
			self.modalContainer.removeClass("mobal-open");
			self.burger.removeClass("modal");
		}, 500);
	}
}

function VerticalGallery(el){
	this.el = el;

	this.init();
}
VerticalGallery.prototype = {
	init: function(){
		var self = this;

		this.video = this.el.find("video");

		this.el.slick({
			infinite: false,
			slidesToShow: 1,
			swipeToSlide: 1,
			slidesToScroll: 1,
			centerMode: true,
			vertical: true,
			arrows: false,
			touchMove: false,
			swipe: false,
			speed: 800
		});

		this.slideLength = this.el.find(".slider-item").length;

		this.dur = 900;

		this.action = false;

		this.paginAll = this.el.next().find(".pagination-all");
		this.paginCurrent = this.el.next().find(".current");

		if(this.slideLength < 10) {
			this.paginAll.text("0" + this.slideLength);
		}
	
		this.slideItem = this.el.find(".slider-item");


		this.eventHandlers();
		this.resizeVideo();
		this.resizeEvent();

	},
	eventHandlers: function(){
		var self = this;

		this.slideItem.on("mouseenter", function(){
			if($(this).find("video").length){
				$(this).find("video")[0].play();
			}
		});

		this.slideItem.on("mouseleave", function(){
			if($(this).find("video").length){
				$(this).find("video")[0].pause();
			}
		})

		document.addEventListener("keyup", function(event){

			if( event.keyCode === 40 ) self.nextSlide();
			if( event.keyCode === 38 ) self.prevSlide();
		});

		$(window).on("DOMMouseScroll mousewheel", function(e){
			
			this.direction = bScroll.scrollEvents(e, self.action);

			if(this.direction == "up") {
				self.prevSlide();
			}
			if(this.direction == "down") {
				self.nextSlide();
			}
		});

		this.el.on("afterChange", function(event, slick, currentSlide, nextSlide){

			this.currSlide = $(this).slick("slickCurrentSlide") + 1;

			if(self.slideLength < 10) {
				self.paginCurrent.text("0" + this.currSlide);
			}

		})

	},
	nextSlide: function(){
		if(this.action) {
			return false;
		}
		this.action = true;

		this.el.slick("slickNext");
		this.endAnimate();
	},
	prevSlide: function(){
		if(this.action) {
			return false;
		}
		this.action = true;

		this.el.slick("slickPrev");
		this.endAnimate();
	},
	endAnimate: function(){
		var self = this;
		setTimeout(function(){
			self.action = false;
		},self.dur);
	},
	resizeVideo: function(){
		var self = this;

		this.clientContainerHeight = this.video.parent().height();
		this.clientContainerWidth = this.video.parent().width();
		
		this.video.each(function(){
			$(this).css({
				"height": self.clientContainerHeight,
				"width": "auto"
			});
		});
	},
	resizeEvent: function(){
		var self = this;
		$(window).on("resize", function(){
			this.time;
			clearTimeout(this.time);
			this.time = setTimeout(function(){
				self.resizeVideo();
			}, 300);
		})
	}
};

function bindScrollEvents() {
	this.config = {
		curCount: 0,
		lastTime: 0,
		minCount: 8,
		minTime: 500,
		lasDir: false
	}
}

bindScrollEvents.prototype = {
	scrollEvents: function(e, action){

		var self = this;
		this.curTime = e.timeStamp;
		this.curDirection = e.originalEvent.deltaY;		

		if(((this.curTime - this.config.lastTime) < this.config.minTime) || !this.config.lastTime) {
			if(!this.config.lasDir || this.curDirection * this.config.lasDir > 0) {
				this.config.lasDir = this.curDirection;
				this.config.lastTime = this.curTime;
				this.config.curCount++;
			} else {
				this.config.curCount = 1;
				this.config.lastTime = this.curTime;
				this.config.lasDir = this.curDirection
			}
		} else {
			this.config.curCount = 0;
			this.config.lastTime = 0;
		}

		if(this.config.curCount >= this.config.minCount) {
			if(this.curDirection > 0) {
				return "down"
			} else {
				return "up"
			}
			this.resetScroll();
		}
	},
	resetScroll: function(){
		this.config.curCount = 0;
		this.config.lastTime = 0;
		this.config.lasDir = false;
	}
}

var bScroll = new bindScrollEvents();

function ModalVideo(el){
	this.el = el;

	this.videoOBJ = [];

	this.opt = {
		timeout: 500
	}

	this.init();
	// this.initVideo();
}
ModalVideo.prototype = {
	init: function(){
		this.content = $(".perspective");
		this.modalWindow = this.content.parent().find(".modal-video");
		this.modalFrame = this.modalWindow.find(".modal-video-frame");
		this.burger = $(".burger");
		this.mainCover = $(".out");

		this.eventHandlers();
	},
	eventHandlers: function(){
		var self = this;
		this.el.on("click", function(){
			this.videoID = $(this).data("id");
			this.templateFrame = self.templateVideo(this.videoID);

			self.openModal(this.templateFrame);
		});
		this.burger.on("click", function(){
			self.closeModal();
		});
		this.modalWindow.on("click", function(){
			self.closeModal();
		});
		this.modalFrame.on("click", function(event){
			event.stopPropagation();
		})
	},
	templateVideo: function(id) {
		var self = this;
		this.iframeImg = document.createElement("img");
		this.iframeImgURL = "http://i.ytimg.com/vi/" + id + "/maxresdefault.jpg" ;

		this.iframeImg.setAttribute("src", this.iframeImgURL);

		this.iframeVideo = document.createElement("iframe");
		this.iframeVideoURL = "https://www.youtube.com/embed/" + id;
		
		this.iframeVideo.setAttribute("src", this.iframeVideoURL);

		this.videoOBJ.push(this.iframeImg, this.iframeVideo);
		console.log(this.videoOBJ)
		return this.videoOBJ;
	},
	initVideo: function () {
		this.dataInit = this.el.first().data("id");
		this.videoInit = this.templateVideo(this.dataInit);
		this.modalFrame.find("iframe").attr("src", this.videoInit);
	},
	openModal: function(link){

		var self = this;

		this.content.addClass("open-modal");
		this.modalWindow.addClass("modal-video-open modal-video-overlay");

		this.modalFrame.addClass("animate").append(link[0]);

		this.burger.addClass("open_burger modal");

		setTimeout(function(){
			self.mainCover.addClass("openModal");
			self.modalFrame.append(link[1]);
			self.loadFrame();
		}, this.opt.timeout*1.5);
	},
	loadFrame: function(){
		this.modalFrame.find("iframe").on("load", function(){
			$(this).addClass("load");
		});
	},
	closeModal: function(){
		var self = this;
		this.modalFrame.removeClass("animate");
		this.burger.removeClass("open_burger");
		setTimeout(function(){
			self.content.removeClass("open-modal");
			self.modalWindow.removeClass("modal-video-overlay");
			self.modalFrame.empty();
			self.content.removeClass("open-modal");
			self.burger.removeClass("modal");
			self.videoOBJ = [];
		}, this.opt.timeout);
		setTimeout(function() {
			self.modalWindow.removeClass("modal-video-open");
			self.mainCover.removeClass("openModal");
		}, this.opt.timeout*1.5);
	}
}

function maps(){
	if(typeof (google) != "object") {
		var tag = document.createElement("script");

		tag.setAttribute("type", "text/javascript");
		tag.setAttribute("src", "https://maps.googleapis.com/maps/api/js?key=AIzaSyCcDrkEbKdrAWUT7ZorYyn-NwTj9YD6DN4&callback=initMap");
		document.querySelector(".map-modal").appendChild(tag);
	} else {
		$(initialize);
	}
}
function initMap(){
	$(window).bind(initialize());
}
function initialize() {
	var stylez = [{"featureType":"all","elementType":"geometry","stylers":[{"color":"#262c33"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"gamma":0.01},{"lightness":20},{"color":"#949aa6"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"saturation":-31},{"lightness":-33},{"weight":2},{"gamma":"0.00"},{"visibility":"off"}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative.locality","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative.neighborhood","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative.land_parcel","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"lightness":30},{"saturation":30},{"color":"#353c44"},{"visibility":"on"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"saturation":"0"},{"lightness":"0"},{"gamma":"0.30"},{"weight":"0.01"},{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"lightness":"100"},{"saturation":-20},{"visibility":"simplified"},{"color":"#31383f"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":10},{"saturation":-30},{"color":"#2a3037"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"saturation":"-100"},{"lightness":"-100"},{"gamma":"0.00"},{"color":"#2a3037"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"visibility":"on"},{"color":"#575e6b"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#4c5561"},{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.airport","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"lightness":-20},{"color":"#2a3037"}]}];
	var mapOptions = {
		zoom: 16,
		disableDefaultUI: true,
		scrollwheel: false,
		panControl: false,
		zoomControl: false,
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.SMALL,
			position: google.maps.ControlPosition.RIGHT_CENTER
		},
		scaleControl: true,
		center: new google.maps.LatLng(53.940313, 27.596937),
	};

	map = new google.maps.Map(document.getElementById('map'),mapOptions);
	var mapType = new google.maps.StyledMapType(stylez, { name:"Grayscale" });
	map.mapTypes.set('tehgrayz', mapType);
	map.setMapTypeId('tehgrayz');
	var image = 'img/icons/baloon.png';
	var myLatLng = new google.maps.LatLng(53.940313, 27.596937);
	var beachMarker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		icon: image,
		title:""
	});

	google.maps.event.addDomListener(window, "resize", function() {
		var center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setCenter(center); 
	});

	// var zoomControlDiv = document.createElement('div');
 //  	var zoomControl = new ZoomControl(zoomControlDiv, map);

 //  	zoomControlDiv.index = 1;
	// map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(zoomControlDiv);
};
function ZoomControl(controlDiv, map) {
	controlDiv.style.padding = "30px";

	var controlWrapper = document.createElement('div');
		controlWrapper.style.cursor = 'pointer';
		controlWrapper.style.textAlign = 'center';
		controlWrapper.style.width = '30px'; 
		controlWrapper.style.height = '60px';
		controlDiv.appendChild(controlWrapper);

	var zoomInButton = document.createElement('div');
		zoomInButton.classList.add("zoomIn");
		zoomInButton.style.width = '30px'; 
		zoomInButton.style.height = '30px';
		controlWrapper.appendChild(zoomInButton);

	var zoomOutButton = document.createElement('div');
		zoomOutButton.classList.add("zoomOut");
		zoomOutButton.style.width = '30px'; 
		zoomOutButton.style.height = '30px';
		controlWrapper.appendChild(zoomOutButton);

	google.maps.event.addDomListener(zoomInButton, 'click', function() {
		map.setZoom(map.getZoom() + 1);
	});

	google.maps.event.addDomListener(zoomOutButton, 'click', function() {
		map.setZoom(map.getZoom() - 1);
	});
}

function mapModal() {
	var _this = this;

	_this.opt = {
		timeout: 500
	}

	_this.eventHandlers = function(){
		_this.trigger.on("click", function(e){

			_this.openModal();

			e.preventDefault();
		});

		_this.mapCloseBtn.on("click", function(){
			_this.closeModal();
		});

		_this.modalContainer.on("click", function(){
			_this.closeModal()
		});

		_this.mapContainer.on("click", function(e){
			e.stopPropagation();
		});
	};

	_this.openModal = function(){
		_this.modalContainer.addClass("map-open map-overlay");
		_this.mapContainer.addClass("open-map");
	};

	_this.closeModal = function(){
		_this.mapContainer.removeClass("open-map");
		_this.modalContainer.removeClass("map-overlay");

		setTimeout(function(){
			_this.modalContainer.removeClass("map-open");
		}, _this.opt.timeout);
	}

	_this.init = function(){
		_this.trigger = $(".js-modal-map");
		_this.modalContainer = $(".map-modal");
		_this.mapContainer = _this.modalContainer.find(".map-container");
		_this.mapCloseBtn = _this.modalContainer.find(".map-modal-close");
		_this.eventHandlers();
	}
}

var transitionsEvents = {
	'WebkitTransition': 'webkitTransitionEnd',
	'MozTransition': 'transitionend',
	'OTransition': 'oTransitionEnd',
	'msTransition': 'MSTransitionEnd',
	'transition': 'transitionend'
},
transitionsEvent = transitionsEvents[Modernizr.prefixed("transition")],
support = { transitions : Modernizr.csstransitons };

function extend( a, b ) {
	for( var key in b ) { 
		if( b.hasOwnProperty( key ) ) {
			a[key] = b[key];
		}
	}
	return a;
}

function stepForm(el, options) {
	this.el = el
	this.options = extend( {}, this.options );
  	extend( this.options, options );
	this._init();
};

stepForm.prototype.options = {
	onSubmit : function() {
		return false;
	}
}

stepForm.prototype._init = function () {
	this.current = 0

	this.quest = [].slice.call($(this.el).find("ol.form-area > li"));
	this.questCount = this.quest.length

	$(this.quest[0]).addClass("current");

	this.btnNext = $(this.el).find(".next");

	this.progress = $(this.el).find(".progress");

	this.questStatus = $(this.el).find(".pagin");
	this.currentNum = $(this.el).find(".pagin-current");
	$(this.currentNum).text("0" + (this.current + 1));

	this.totalNum = $(this.el).find(".pagin-total");
	$(this.totalNum).text("0" + this.questCount);

	this.error = $(this.el).find(".error-message");

	this.crossClose = $(".burger");
	this.close = $(this.el).find(".message-close");
 
	this._initEvents();

};

stepForm.prototype._initEvents = function(){
	var self = this,
		firstEL = $(this.quest[this.current]).find("input");



	focusStartFn = function(){
		// firstEL.unbind("focus", focusStartFn);
		$(self.btnNext).addClass("show");
	};

	firstEL.on("focus", focusStartFn);

	this.btnNext.on("click", function(ev){
		ev.preventDefault();
		self._nextStep();
	});

	this.crossClose.add(this.close).on("click", function(ev){
		ev.preventDefault()
		setTimeout(function(){
			self._close();
		}, 300);
	});

	document.addEventListener("keydown", function(ev){
		var codeKey = ev.keyCode;

		if(codeKey === 13) {
			ev.preventDefault();
			self._nextStep();
		}
	});

	$(this.el).on("keydown", function(ev){
		var codeKey = ev.keyCode;

		if(codeKey === 9) {
			ev.preventDefault();
		}
	});
};

stepForm.prototype._nextStep = function(){

	if(!this._validate()) {
		return false;
	}

	if(this.current === this.questCount - 1) {
		this.isFilled = true;
	}

	this._clearError();

	var currentQuest = this.quest[this.current];

	++this.current;

	this._progress();

	if(!this.isFilled){

		this._updateNumbers();

		$(this.el).find(".form-container__inner").addClass("show-next");

		var nextQuest = this.quest[this.current];

		$(currentQuest).removeClass("current");
		$(nextQuest).addClass("current");
	};


	var self = this,
		onTransitionsEventFn = function(ev){
			if( support.transitions ) {
				$(this).unbind(transitionsEvent, onTransitionsEventFn);
			}
		
			if(self.isFilled) {
				self._submit()
			} else {
				$(self.el).find(".form-container__inner").removeClass("show-next");

				$(self.currentNum).text($(self.nextQuestNum).text());

				$(self.questStatus).find(self.nextQuestNum).remove();
				$(nextQuest).find("input").focus();
			}
		};
	if(support.transition) {
		$(this.progress).on(transitionsEvent, onTransitionsEventFn);
	} else {
		onTransitionsEventFn();
	}
};

stepForm.prototype._progress = function(){
	$(this.progress).css("width", this.current * (100 / this.questCount) + "%")
};

stepForm.prototype._updateNumbers = function(){
	this.nextQuestNum = document.createElement("span");
	$(this.nextQuestNum).addClass("pagin-next");
	$(this.nextQuestNum).text("0" + (this.current + 1));

	$(this.questStatus).append(this.nextQuestNum);
};

stepForm.prototype._submit = function(){
	this.options.onSubmit(this.el);
};

stepForm.prototype._validate = function(){
	var input = $(this.quest[ this.current ]).find("input").val();
	if(input === "") {
		this._showError("EMPTYSTR");
		return false;
	}

	return true;
};

stepForm.prototype._showError = function(err){
	var message = "";
	switch(err) {
		case "EMPTYSTR" :
			message = "Please fill the field before continuing";
			break;
	};
	$(this.error).text(message);
	$(this.error).addClass("show");
};

stepForm.prototype._clearError = function(){
	$(this.error).removeClass("show");
}

stepForm.prototype._close = function(){
	this.current = 0;
	$(this.el).trigger("reset");
	$(".form-container__inner").removeClass("hide");
	$(".final-message").removeClass("show");
	$(this.quest[0]).addClass("current").siblings().removeClass("current");
	this.progress.css("width", "0");
	this.currentNum.text("0" + (this.current + 1));
	this.isFilled = false;
	this.btnNext.removeClass("show");
}

window.stepForm = stepForm;

function Form(){
	var _this = this;

	_this.initEvents = function(){
		_this.trigger.on("click", function(){
			var _ = $(this),
				_data = _.data("modal");

			_this.openModal(_data);
		});

		_this.burger.on("click", function(){
			_this.closeModal();
		});
		_this.messageClose.on("click", function(){
			_this.closeModal();
		});
		_this.modal.on("click", function(){
			_this.closeModal();
			_this.burger.trigger("click");
		});
		_this.modal.find(".modal-window_container").on("click", function(e){
			e.stopPropagation();
		});
	};

	_this.openModal = function(data) {
		var modal = $("[data-modal-window='" + data + "']");

		modal.addClass("open modal-animate");
		_this.burger.addClass("modal open_burger");
		setTimeout(function(){
			modal.find("li.current input").trigger("focus")
		}, 700);
	};

	_this.closeModal = function(){
		_this.modal.removeClass("modal-animate");
		_this.burger.removeClass("open_burger");
		setTimeout(function(){
			_this.modal.removeClass("open");
			_this.burger.removeClass("modal");
		}, 500);
	}

	_this.init = function(){
		_this.trigger = $("[data-modal]");
		_this.burger = $(".burger");
		_this.modal = $(".modal-window");
		_this.messageClose = $('.message-close');

		_this.initEvents();
	}
}


function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function Revealer(el){
	var _this = this;

	_this.el = el;

	_this.transformNames = { 'WebkitTransform' : 'webkitTransform', 'OTransform' : 'oTransform', 'msTransform' : 'MSTransform', 'transform' : 'transform' },
	_this.transformName = _this.transformNames[Modernizr.prefixed( 'transform' )];

	_this.setVariables = function(){
		_this.width = window.innerWidth;
		_this.height = window.innerHeight;

		_this.pageDiagonal = Math.sqrt(Math.pow(_this.width, 2) + Math.pow(_this.height, 2));

		_this.widthVal = _this.heightVal = _this.pageDiagonal + "px";

		_this.transform = 'translate3d(-50%,-50%,0) rotate3d(0,0,1,135deg) translate3d(0,' + _this.pageDiagonal + 'px,0)';

		_this.el.css(_this.transformName, _this.transform);
		_this.el.css("width", _this.widthVal);
		_this.el.css("height", _this.heightVal);
	};

	_this.resizeVariables = function(){
		var timeout;
		$(window).on("resize", function(){
			clearTimeout(timeout);
			timeout = setTimeout(function(){
				_this.setVariables();
			}, 200);
		});
	};

	_this.init = function(){
		_this.setVariables();
		_this.resizeVariables();
	};
}

function AjaxLoading(el){
	var _this = this;

	_this.ajaxLink = el;
	_this.burger = $(".burger");
	_this.revealContainer = $(".revealer");
	_this.appendMain = $(".perspective-container");

	_this.params = {
		animIn: "animation-layer-in",
		animOut: "animation-layer-out"
	}


	_this.isAnimate = false;

	_this.initEvents = function(){
		_this.ajaxLink.on("click", function(e){

			if(_this.isAnimate) {
				return false;
			}

			_this.isAnimate = true;

			var link = $(this).attr("href");

			if(_this.burger.hasClass("open")){
				b.closeMenu.apply(_this);
				setTimeout(function(){
					_this.action(link)
				}, 500);
			}

			e.preventDefault();
			return false;
		});
	};

	_this.action = function(link) {
		$.ajax({
			url: link,
			dataType: "html",
			async: true,
			beforeSend: function(){
				_this.initAnimate();
			},
			success: function(content) {
				_this.history(link);
				var mainContent = $(content).find(".perspective-container");
				setTimeout(function(){
					_this.appendMain.html(mainContent).promise().done(function(){
						_this.endAnimate();	
					});
				},1000);
			}
		})
	};

	_this.initAnimate = function(){
		_this.revealContainer.addClass(_this.params.animIn);
	};
	_this.history = function(url) {
		window.history.pushState("page" + url, url, url);
		window.history.replaceState("page" + url, url, url);
	};

	_this.endAnimate = function(){
		_this.revealContainer.addClass(_this.params.animOut);
		_this.revealContainer.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oAnimationEnd animationend", function(){
			$(this).removeClass(_this.params.animIn);
			$(this).removeClass(_this.params.animOut);
			_this.isAnimate = false;
		})
	}
	_this.initEvents();
}