
// Sky navigation
var sky_level_height = 504,
    sky_levels = ($(".sky-level").length),
    sky_start_point = -((sky_levels * sky_level_height) - 1370), // 4130,
    sky_next_button = ".sky .next";

$(".sky").css("top", sky_start_point);
$(".sky-level.top .next").css("opacity", "0");



//$(".sky-level").addClass("out");
//$('.out .plane').animo( { animation: 'bounceInRight', duration: 4 } );

//$(".sky-level").eq(sky_levels - 1).css("border", "5px solid red");
//$(".sky-level").eq(sky_levels - 1).(".plane").animo( { animation: 'bounceInRight', duration: 4 } );
$(".begenings .plane").animo( { animation: 'bounceInLeft', duration: 4 } );

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

  event.preventDefault();
  $(this).css("opacity", "0").css("cursor", "default");
  if (sky_start_point < sky_level_height) {
    sky_start_point = sky_start_point + sky_level_height;
    $(".sky").animate({top:sky_start_point}, "slow", "swing");
    $(this).parent().parent().parent().removeClass("out");
    //$(".sky-level").eq(level).css("border", "5px solid red");
    $(".sky-level").eq(level).addClass('level-' + counter);
    $('.level-' + counter + ' .plane').animo( { animation: direction, duration: 4 } );
  } else {
    ////console.log("Next clicked " + sky_start_point + " THIS IS THE END");
  }

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
  event.preventDefault();
  $(this).animo( { animation: 'pulse', duration: 1 } );
});

$(".plane a").click( function() {
  //$(".scm-history").addClass("bg-blur-on");
  //console.log("TA-DAAA!");
});
$(".close-reveal-modal").click( function() {
  //$(".scm-history").removeClass("bg-blur-on");
});
$(".reveal-modal-bg").click( function() {
  //alert("hola");
  //$(".scm-history").removeClass("bg-blur-on");
});
$(".pds-answer-group label").click( function() {
  console.log("checked");
  $(this).toggleClass("checked");
});


console.log("Javascript scm-history.js runs ok!");