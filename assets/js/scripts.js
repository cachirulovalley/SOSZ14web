/*
 * CUSTOM JAVASCRIPT AND JQUERY SCRIPTS
 */


console.log("Ok, scripts loading");

var smoothScrolling = function(t){
    $(t).click(function(event) {
        $("a").removeClass("active");
        $(this).toggleClass("active");

        // Getting the target name and top position
        var target = "#" + this.dataset.scrolling,
            p = $( target ),
            position = p.position(),
            animation_speed = 1000,
            correction_factor = 40;

        // Moving to target position
        $("html, body").animate({ scrollTop: (position.top - correction_factor) }, animation_speed);

        // Removing default link behavior
        return false;
    });
};

smoothScrolling('.header a.logo');
smoothScrolling('.sub-nav-custom a');


