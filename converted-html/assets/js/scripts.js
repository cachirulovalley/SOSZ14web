// Function for main menu
toggleClassOnClick = function(target){
  $(target + ' a').click( function() {
    //console.log("click!");
    $(target).find('.current').removeClass('current');
    $(this).addClass('current');
  });
};

$(document).ready( function() {

  // Tabs constructor
  var tabs_count = $(".tab-button").size();
  for (var i=0; i<tabs_count; i++) {
    var tabs_html_links = $(".tab-button");
  }
  $(".tabs-nav").append(tabs_html_links);
  var initial_url = window.location.href;
  $(".tabs-nav a:first-child").addClass("active");
  // End tabs constructor


  // Dynamic tabs
  $(".tabs-nav a").click( function() {
    //event.preventDefault();
    console.log("TABS");
    $(".tabs-nav a").removeClass("active");
    $(this).addClass("active");
    var target_url = $(this).attr("href");
    $(".tab").hide();
    $(target_url).toggle();
    return false;
  });
  // end Dynamic tabs


  // Function for make linkable url anchors
  var makeLinkableURL = function(target){
    if (initial_url.match("#" + target)){
    $(".tab").hide();
    $("#" + target).toggle();
    $(".tabs-nav a").removeClass('active');
    $(".tabs-nav ." + target).addClass("active");
    //console.log(target);
    }
  };

  makeLinkableURL("intro");
  makeLinkableURL("create-repo");
  makeLinkableURL("pulling-some-code");
  makeLinkableURL("distributed-brex");
  makeLinkableURL("distributed");
  makeLinkableURL("merge");
  makeLinkableURL("submit");
  makeLinkableURL("learn-more");
  makeLinkableURL("webinars");
  makeLinkableURL("demos");


  // Dynamic breadcrumbs in base to URL function
  var dyanmicBreadcrumb = function(target){
     // Carga la url completa en la variable path
      var path = window.location.href;
      var home_path = "http://www.plasticscm.com";
      var prefix = ".html";

      // Quitale la cadena "http://"/#.*/
      var string_to_remove = "http://";
      re = new RegExp(string_to_remove);
      path = path.replace(re, "");


      // Declara el array segmentos cargando como valor path spliteado en segmentos por "/"
      var segmentos = path.split("/");
      //console.log("Segmentos: " + segmentos);

      // Recorre segmentos en segmento y

      $("." + target).append('<li><a href="' + home_path + '">Home</a></li>');

      if (target == "breadcrumbs-no-plain") {
        for (var i=1; i<(segmentos.length - 1); i++) {
          var segmento = segmentos[i].replace("-", " ");
          // Pinta un li con a dentro con el segmento como url
          $("." + target).append('<li><a href="/' + segmento + '/' + prefix + '">' + segmento + '</a></li>');
        }

        if (segmentos.length > 2) {
          $("." + target + " li:last-child").addClass("current");
        }

      }
      else{
        for (var i=1; i<(segmentos.length - 1); i++) {
          var segmento = segmentos[i].replace("-", " ");
          $("." + target).append('<li><a href="/' + segmento + '/' + '">' + segmento + '</a></li>');
        }
        $("." + target).append('<li><a href="' + segmentos[segmentos.length - 1] + prefix + '">' + segmentos[segmentos.length - 1] + '</a></li>');

        if (segmentos.length > 1) {
          $("." + target + " li:last-child").addClass("current");
        }
      }
   };// End of Dynamic breadcrumbs function

  dyanmicBreadcrumb("breadcrumbs-no-plain");
  dyanmicBreadcrumb("breadcrumbs-plain");


  // Filter function
  var filter = function(dom_target){
    //console.log("I'm the filter: " + dom_target);
    $(".archived").hide();

    $(dom_target + ' dd').click( function() {
      ////console.log("click on target!");
      $(dom_target).find('.active').removeClass('active');
      $(this).addClass('active');
    });

    $(dom_target + ' a').click( function() {

      var target_url = $(this).attr("href");
      //console.log("target_url in filter: " + target_url);
      $(".record").hide();
      $(".filter-title").hide();

      if(target_url == "#upcoming"){
        $(".upcoming").toggle();
      }
      else if(target_url == "#archived"){
        $(".archived").toggle();
      }
      else{
        $(".record").toggle();
        $(".filter-title").toggle();
      }
    });


  };// end Filter function

    filter(".filter-webinars");

    $(".webinars li").toggle();
    $(".webinars li:eq(0)").toggle();
    $(".webinars li:eq(1)").toggle();
    $(".webinars li:eq(2)").toggle();

    var goToSection = function(section){
      $("." + section).click(function() {
        //event.preventDefault();
        $('.tab').hide();
        $('#' + section).show();
        removeActive();
        $('.tab-button.' + section).addClass('active');
        console.log("Go to section: " + section);
      });
    };
    goToSection("intro");
    goToSection("repo-and-wk");
    goToSection("pulling-some-code");
    goToSection("distributed");
    goToSection("merge");
    goToSection("submit");
    goToSection("learn-more");


    $(".tabs-nav-static .active").click(function() {
      return false;
    });

});// end jQuery ready function //