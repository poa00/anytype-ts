const BORDER = 100;

class ScrollOnMove {
	
	timeout: number = 0;
	
	onMouseDown (e: any) {
	};
	
	onMouseMove (e: any) {
		let viewportX = e.clientX;
		let viewportY = e.clientY;
		let viewportWidth = document.documentElement.clientWidth;
		let viewportHeight = document.documentElement.clientHeight;
	
		let edgeTop = BORDER;
		let edgeLeft = BORDER;
		let edgeBottom = ( viewportHeight - BORDER );
		let edgeRight = ( viewportWidth - BORDER );
	
		let isInLeftEdge = ( viewportX < edgeLeft );
		let isInRightEdge = ( viewportX > edgeRight );
		let isInTopEdge = ( viewportY < edgeTop );
		let isInBottomEdge = ( viewportY > edgeBottom );
	
		if (!(isInLeftEdge || isInRightEdge || isInTopEdge || isInBottomEdge)) {
			window.clearTimeout(this.timeout);
			return;
		};
	
		let documentWidth = Math.max(
			document.body.scrollWidth,
			document.body.offsetWidth,
			document.body.clientWidth,
			document.documentElement.scrollWidth,
			document.documentElement.offsetWidth,
			document.documentElement.clientWidth
		);
		
		let documentHeight = Math.max(
			document.body.scrollHeight,
			document.body.offsetHeight,
			document.body.clientHeight,
			document.documentElement.scrollHeight,
			document.documentElement.offsetHeight,
			document.documentElement.clientHeight
		);
	
		let maxScrollX = (documentWidth - viewportWidth);
		let maxScrollY = (documentHeight - viewportHeight);
		
		let checkForWindowScroll = () => {
			window.clearTimeout(this.timeout);
	
			if (adjustWindowScroll()) {
				this.timeout = window.setTimeout(checkForWindowScroll, 30);
			};
		};
		checkForWindowScroll();
	
		function adjustWindowScroll () {
			let currentScrollX = window.pageXOffset;
			let currentScrollY = window.pageYOffset;
			let canScrollUp = (currentScrollY > 0);
			let canScrollDown = (currentScrollY < maxScrollY);
			let canScrollLeft = (currentScrollX > 0 );
			let canScrollRight = (currentScrollX < maxScrollX);
			let nextScrollX = currentScrollX;
			let nextScrollY = currentScrollY;
			let maxStep = 10;
	
			if (isInLeftEdge && canScrollLeft) {
				let intensity = (edgeLeft - viewportX) / BORDER;
				nextScrollX = nextScrollX - maxStep * intensity;
			} else 
			if (isInRightEdge && canScrollRight) {
				let intensity = (viewportX - edgeRight) / BORDER;
				nextScrollX = nextScrollX + maxStep * intensity;
			};
	
			if (isInTopEdge && canScrollUp) {
				let intensity = (edgeTop - viewportY) / BORDER;
				nextScrollY = nextScrollY - maxStep * intensity;
			} else 
			if (isInBottomEdge && canScrollDown) {
				let intensity = (viewportY - edgeBottom) / BORDER;
				nextScrollY = nextScrollY + maxStep * intensity;
			};
	
			nextScrollX = Math.max(0, Math.min(maxScrollX, nextScrollX));
			nextScrollY = Math.max(0, Math.min(maxScrollY, nextScrollY));
	
			// Disable move on X
			nextScrollX = currentScrollX;

			if (
				(nextScrollX !== currentScrollX) ||
				(nextScrollY !== currentScrollY)
			) {
				window.scrollTo(nextScrollX, nextScrollY);
				return true;
			} else {
				return false;
			};
		};
	};
	
	onMouseUp (e: any) {
		window.clearTimeout(this.timeout);
	};
	
};

export let scrollOnMove: ScrollOnMove = new ScrollOnMove();