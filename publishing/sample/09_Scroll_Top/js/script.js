var $scroll = document.scrollingElement || document.body || document.documentElement;
var $a = document.querySelector("#btn-top");
$a.addEventListener("click", function(e) {
    e.preventDefault();
    anime({
        targets: $scroll,
        scrollTop: 0,
        duration: 500,
        easing: 'easeInOutQuad'
    });
    // TweenMax.to(window, 0.5, {scrollTo:{y:0}});
});