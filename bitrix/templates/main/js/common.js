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