/* GALLERY */
$(document).ready( function() {

  // Fancybox
  $(".thumb").fancybox();

  // Dynamic titles from figcaption p
  $(".clearing-thumbs a").click(function() {
    $( ".thumb" ).each(function() {
      var caption = $(this).siblings("figcaption").text(),
          final_caption = caption.replace(/More here/g, '');
      $( this ).attr({ title: final_caption});
    });
  });

  // GALLERY HOVER EFFECT
  $( ".clearing-thumbs a" ).bind( "mouseenter", function() {
    $(this).siblings("figcaption").animate({
      height: "80px"
    }, 400 );
  });
  $( ".clearing-thumbs figure" ).bind( "mouseleave", function() {
    $(this).children("figcaption").animate({
      height: "1px"
    }, 400 );
  });

});// end jQuery ready function //
/* end GALLERY */