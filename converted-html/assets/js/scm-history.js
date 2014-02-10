// Sky navigation
var sky_level_top = 1370;
var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
     sky_level_top = sky_level_top - 120;
}

var sky_level_height = 504,
    sky_levels = ($(".sky-level").length),
    sky_start_point = -((sky_levels * sky_level_height) - sky_level_top),
    sky_next_button = ".sky .next";



$(".sky").css("top", sky_start_point);
$(".sky-level.top .next").css("opacity", "0");

var counter = 1;

$(sky_next_button).click( function() {
  counter++;
  var direction = "bounceInRight";
  var level = sky_levels - counter;

  if(counter == 2 || counter == 4 || counter == 6){
    direction = "bounceInLeft";
  }else{
    direction = "bounceInLeft";
  }
  $(this).css("opacity", "0").css("cursor", "default");
  if (sky_start_point < sky_level_height) {
    sky_start_point = sky_start_point + sky_level_height;
    $(".sky").animate({top:sky_start_point}, "slow", "swing");
    $(this).parent().parent().parent().removeClass("out");
    $(".sky-level").eq(level).addClass('level-' + counter);
    $('.level-' + counter + ' .plane').animo( { animation: direction, duration: 4 } );
    //$(".sky-level").eq(level).css("border", "5px solid red");
  } else {
    console.log("Next clicked " + sky_start_point + " THIS IS THE END");
  }
  return false;
});

var removeActive = function(){
  $('.tab-button').removeClass('active');
};

$(".next").hide();
$(".next").fadeIn("slow");

// REVEAL MODAL CARDS
$(".reveal-modal").append("<a class='close-reveal-modal'>&#215;</a>");

// NEXT GENERATION BUTTON
$(".next").animo( { animation: 'bounce', duration: 1, iterate: "infinite" } );

$(".plane a").hover( function() {
  $(this).animo( { animation: 'pulse', duration: 1 } );
  return false;
});
$(".pds-answer-group label").click( function() {
  console.log("checked");
  $(this).toggleClass("checked");
});



console.log("sky_start_point: " + sky_start_point);
console.log("Javascript scm-history.js runs ok!");

