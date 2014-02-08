/*
 * CUSTOM JAVASCRIPT AND JQUERY SCRIPTS
 */


console.log("Ok, scripts loading");

$('.sub-nav-custom a').click(function(event) {
    $("a").removeClass("active");
    $(this).toggleClass("active");
    //return false;
});