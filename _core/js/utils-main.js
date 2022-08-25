// -- Back to top functions --
function backToTop() {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
}

function scrollFunction(toTopBtn) {
	if (document.body.scrollTop > 20 ||
	document.documentElement.scrollTop > 20) {
		toTopBtn.style.display = "block";
	}
	else {
		toTopBtn.style.display = "none";
	}
	toTopBtn.addEventListener("click", backToTop);
}

function activateBackToTop() {
	let toTopBtn = document.getElementById("backToTop");
	window.onscroll = function() {
		scrollFunction(toTopBtn);
	};
}

activateBackToTop();