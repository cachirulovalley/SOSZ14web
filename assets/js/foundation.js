/*
 * Foundation Responsive Library
 * http://foundation.zurb.com
 * Copyright 2013, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/

(function ($, window, document, undefined) {
  'use strict';

  // Used to retrieve Foundation media queries from CSS.
  if($('head').has('.foundation-mq-small').length === 0) {
    $('head').append('<meta class="foundation-mq-small">');
  }

  if($('head').has('.foundation-mq-medium').length === 0) {
    $('head').append('<meta class="foundation-mq-medium">');
  }

  if($('head').has('.foundation-mq-large').length === 0) {
    $('head').append('<meta class="foundation-mq-large">');
  }

  if($('head').has('.foundation-mq-xlarge').length === 0) {
    $('head').append('<meta class="foundation-mq-xlarge">');
  }

  if($('head').has('.foundation-mq-xxlarge').length === 0) {
    $('head').append('<meta class="foundation-mq-xxlarge">');
  }

  // Enable FastClick if present

  $(function() {
    if(typeof FastClick !== 'undefined') {
      // Don't attach to body if undefined
      if (typeof document.body !== 'undefined') {
        FastClick.attach(document.body);
      }
    }
  });

  // private Fast Selector wrapper,
  // returns jQuery object. Only use where
  // getElementById is not available.
  var S = function (selector, context) {
    if (typeof selector === 'string') {
      if (context) {
        return $(context.querySelectorAll(selector));
      }

      return $(document.querySelectorAll(selector));
    }

    return $(selector, context);
  };

  /*
    https://github.com/paulirish/matchMedia.js
  */

  window.matchMedia = window.matchMedia || (function( doc, undefined ) {

    "use strict";

    var bool,
        docElem = doc.documentElement,
        refNode = docElem.firstElementChild || docElem.firstChild,
        // fakeBody required for <FF4 when executed in <head>
        fakeBody = doc.createElement( "body" ),
        div = doc.createElement( "div" );

    div.id = "mq-test-1";
    div.style.cssText = "position:absolute;top:-100em";
    fakeBody.style.background = "none";
    fakeBody.appendChild(div);

    return function(q){

      div.innerHTML = "&shy;<style media=\"" + q + "\"> #mq-test-1 { width: 42px; }</style>";

      docElem.insertBefore( fakeBody, refNode );
      bool = div.offsetWidth === 42;
      docElem.removeChild( fakeBody );

      return {
        matches: bool,
        media: q
      };

    };

  }( document ));

  /*
   * jquery.requestAnimationFrame
   * https://github.com/gnarf37/jquery-requestAnimationFrame
   * Requires jQuery 1.8+
   *
   * Copyright (c) 2012 Corey Frang
   * Licensed under the MIT license.
   */

  (function( $ ) {

  // requestAnimationFrame polyfill adapted from Erik Möller
  // fixes from Paul Irish and Tino Zijdel
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating


  var animating,
    lastTime = 0,
    vendors = ['webkit', 'moz'],
    requestAnimationFrame = window.requestAnimationFrame,
    cancelAnimationFrame = window.cancelAnimationFrame;

  for(; lastTime < vendors.length && !requestAnimationFrame; lastTime++) {
    requestAnimationFrame = window[ vendors[lastTime] + "RequestAnimationFrame" ];
    cancelAnimationFrame = cancelAnimationFrame ||
      window[ vendors[lastTime] + "CancelAnimationFrame" ] || 
      window[ vendors[lastTime] + "CancelRequestAnimationFrame" ];
  }

  function raf() {
    if ( animating ) {
      requestAnimationFrame( raf );
      jQuery.fx.tick();
    }
  }

  if ( requestAnimationFrame ) {
    // use rAF
    window.requestAnimationFrame = requestAnimationFrame;
    window.cancelAnimationFrame = cancelAnimationFrame;
    jQuery.fx.timer = function( timer ) {
      if ( timer() && jQuery.timers.push( timer ) && !animating ) {
        animating = true;
        raf();
      }
    };

    jQuery.fx.stop = function() {
      animating = false;
    };
  } else {
    // polyfill
    window.requestAnimationFrame = function( callback, element ) {
      var currTime = new Date().getTime(),
        timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) ),
        id = window.setTimeout( function() {
          callback( currTime + timeToCall );
        }, timeToCall );
      lastTime = currTime + timeToCall;
      return id;
    };

    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
      
  }

  }( jQuery ));


  function removeQuotes (string) {
    if (typeof string === 'string' || string instanceof String) {
      string = string.replace(/^[\\/'"]+|(;\s?})+|[\\/'"]+$/g, '');
    }

    return string;
  }

  window.Foundation = {
    name : 'Foundation',

    version : '5.0.3',

    media_queries : {
      small : S('.foundation-mq-small').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      medium : S('.foundation-mq-medium').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      large : S('.foundation-mq-large').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      xlarge: S('.foundation-mq-xlarge').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      xxlarge: S('.foundation-mq-xxlarge').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, '')
    },

    stylesheet : $('<style></style>').appendTo('head')[0].sheet,

    init : function (scope, libraries, method, options, response) {
      var library_arr,
          args = [scope, method, options, response],
          responses = [];

      // check RTL
      this.rtl = /rtl/i.test(S('html').attr('dir'));

      // set foundation global scope
      this.scope = scope || this.scope;

      if (libraries && typeof libraries === 'string' && !/reflow/i.test(libraries)) {
        if (this.libs.hasOwnProperty(libraries)) {
          responses.push(this.init_lib(libraries, args));
        }
      } else {
        for (var lib in this.libs) {
          responses.push(this.init_lib(lib, libraries));
        }
      }

      return scope;
    },

    init_lib : function (lib, args) {
      if (this.libs.hasOwnProperty(lib)) {
        this.patch(this.libs[lib]);

        if (args && args.hasOwnProperty(lib)) {
          return this.libs[lib].init.apply(this.libs[lib], [this.scope, args[lib]]);
        }

        args = args instanceof Array ? args : Array(args);    // PATCH: added this line
        return this.libs[lib].init.apply(this.libs[lib], args);
      }

      return function () {};
    },

    patch : function (lib) {
      lib.scope = this.scope;
      lib['data_options'] = this.lib_methods.data_options;
      lib['bindings'] = this.lib_methods.bindings;
      lib['S'] = S;
      lib.rtl = this.rtl;
    },

    inherit : function (scope, methods) {
      var methods_arr = methods.split(' ');

      for (var i = methods_arr.length - 1; i >= 0; i--) {
        if (this.lib_methods.hasOwnProperty(methods_arr[i])) {
          this.libs[scope.name][methods_arr[i]] = this.lib_methods[methods_arr[i]];
        }
      }
    },

    random_str : function (length) {
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

      if (!length) {
        length = Math.floor(Math.random() * chars.length);
      }

      var str = '';
      for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
      }
      return str;
    },

    libs : {},

    // methods that can be inherited in libraries
    lib_methods : {
      throttle : function(fun, delay) {
        var timer = null;

        return function () {
          var context = this, args = arguments;

          clearTimeout(timer);
          timer = setTimeout(function () {
            fun.apply(context, args);
          }, delay);
        };
      },

      // parses data-options attribute
      data_options : function (el) {
        var opts = {}, ii, p, opts_arr, opts_len,
            data_options = el.data('options');

        if (typeof data_options === 'object') {
          return data_options;
        }

        opts_arr = (data_options || ':').split(';'),
        opts_len = opts_arr.length;

        function isNumber (o) {
          return ! isNaN (o-0) && o !== null && o !== "" && o !== false && o !== true;
        }

        function trim(str) {
          if (typeof str === 'string') return $.trim(str);
          return str;
        }

        // parse options
        for (ii = opts_len - 1; ii >= 0; ii--) {
          p = opts_arr[ii].split(':');

          if (/true/i.test(p[1])) p[1] = true;
          if (/false/i.test(p[1])) p[1] = false;
          if (isNumber(p[1])) p[1] = parseInt(p[1], 10);

          if (p.length === 2 && p[0].length > 0) {
            opts[trim(p[0])] = trim(p[1]);
          }
        }

        return opts;
      },

      delay : function (fun, delay) {
        return setTimeout(fun, delay);
      },

      // test for empty object or array
      empty : function (obj) {
        if (obj.length && obj.length > 0)    return false;
        if (obj.length && obj.length === 0)  return true;

        for (var key in obj) {
          if (hasOwnProperty.call(obj, key))    return false;
        }

        return true;
      },

      register_media : function(media, media_class) {
        if(Foundation.media_queries[media] === undefined) {
          $('head').append('<meta class="' + media_class + '">');
          Foundation.media_queries[media] = removeQuotes($('.' + media_class).css('font-family'));
        }
      },

      addCustomRule : function(rule, media) {
        if(media === undefined) {
          Foundation.stylesheet.insertRule(rule, Foundation.stylesheet.cssRules.length);
        } else {
          var query = Foundation.media_queries[media];
          if(query !== undefined) {
            Foundation.stylesheet.insertRule('@media ' + 
              Foundation.media_queries[media] + '{ ' + rule + ' }');
          }
        }
      },

      loaded : function (image, callback) {
        function loaded () {
          callback(image[0]);
        }

        function bindLoad () {
          this.one('load', loaded);

          if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
            var src = this.attr( 'src' ),
                param = src.match( /\?/ ) ? '&' : '?';

            param += 'random=' + (new Date()).getTime();
            this.attr('src', src + param);
          }
        }

        if (!image.attr('src')) {
          loaded();
          return;
        }

        if (image[0].complete || image[0].readyState === 4) {
          loaded();
        } else {
          bindLoad.call(image);
        }
      },

      bindings : function (method, options) {
        var self = this,
            should_bind_events = !S(this).data(this.name + '-init');

        if (typeof method === 'string') {
          return this[method].call(this, options);
        }

        if (S(this.scope).is('[data-' + this.name +']')) {
          S(this.scope).data(this.name + '-init', $.extend({}, this.settings, (options || method), this.data_options(S(this.scope))));

          if (should_bind_events) {
            this.events(this.scope);
          }

        } else {
          S('[data-' + this.name + ']', this.scope).each(function () {
            var should_bind_events = !S(this).data(self.name + '-init');

            S(this).data(self.name + '-init', $.extend({}, self.settings, (options || method), self.data_options(S(this))));

            if (should_bind_events) {
              self.events(this);
            }
          });
        }
      }
    }
  };

  $.fn.foundation = function () {
    var args = Array.prototype.slice.call(arguments, 0);

    return this.each(function () {
      Foundation.init.apply(Foundation, [this].concat(args));
      return this;
    });
  };

}(jQuery, this, this.document));


/*
 * You should really comment out any of the following not being used
 * Mixture will then output a new combined and minified file
 */
;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.alert = {
    name : 'alert',

    version : '5.0.0',

    settings : {
      animation: 'fadeOut',
      speed: 300, // fade out speed
      callback: function (){}
    },

    init : function (scope, method, options) {
      this.bindings(method, options);
    },

    events : function () {
      $(this.scope).off('.alert').on('click.fndtn.alert', '[data-alert] a.close', function (e) {
          var alertBox = $(this).closest("[data-alert]"),
              settings = alertBox.data('alert-init') || Foundation.libs.alert.settings;

        e.preventDefault();
        alertBox[settings.animation](settings.speed, function () {
          $(this).trigger('closed').remove();
          settings.callback();
        });
      });
    },

    reflow : function () {}
  };
}(jQuery, this, this.document));


;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.clearing = {
    name : 'clearing',

    version: '5.0.3',

    settings : {
      templates : {
        viewing : '<a href="#" class="clearing-close">&times;</a>' +
          '<div class="visible-img" style="display: none"><img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" alt="" />' +
          '<p class="clearing-caption"></p><a href="#" class="clearing-main-prev"><span></span></a>' +
          '<a href="#" class="clearing-main-next"><span></span></a></div>'
      },

      // comma delimited list of selectors that, on click, will close clearing,
      // add 'div.clearing-blackout, div.visible-img' to close on background click
      close_selectors : '.clearing-close',

      // event initializers and locks
      init : false,
      locked : false
    },

    init : function (scope, method, options) {
      var self = this;
      Foundation.inherit(this, 'throttle loaded');

      this.bindings(method, options);

      if ($(this.scope).is('[data-clearing]')) {
        this.assemble($('li', this.scope));
      } else {
        $('[data-clearing]', this.scope).each(function () {
          self.assemble($('li', this));
        });
      }
    },

    events : function (scope) {
      var self = this;

      $(this.scope)
        .off('.clearing')
        .on('click.fndtn.clearing', 'ul[data-clearing] li',
          function (e, current, target) {
            var current = current || $(this),
                target = target || current,
                next = current.next('li'),
                settings = current.closest('[data-clearing]').data('clearing-init'),
                image = $(e.target);

            e.preventDefault();

            if (!settings) {
              self.init();
              settings = current.closest('[data-clearing]').data('clearing-init');
            }

            // if clearing is open and the current image is
            // clicked, go to the next image in sequence
            if (target.hasClass('visible') && 
              current[0] === target[0] && 
              next.length > 0 && self.is_open(current)) {
              target = next;
              image = $('img', target);
            }

            // set current and target to the clicked li if not otherwise defined.
            self.open(image, current, target);
            self.update_paddles(target);
          })

        .on('click.fndtn.clearing', '.clearing-main-next',
          function (e) { self.nav(e, 'next') })
        .on('click.fndtn.clearing', '.clearing-main-prev',
          function (e) { self.nav(e, 'prev') })
        .on('click.fndtn.clearing', this.settings.close_selectors,
          function (e) { Foundation.libs.clearing.close(e, this) })
        .on('keydown.fndtn.clearing',
          function (e) { self.keydown(e) });

      $(window).off('.clearing').on('resize.fndtn.clearing',
        function () { self.resize() });

      this.swipe_events(scope);
    },

    swipe_events : function (scope) {
      var self = this;

      $(this.scope)
        .on('touchstart.fndtn.clearing', '.visible-img', function(e) {
          if (!e.touches) { e = e.originalEvent; }
          var data = {
                start_page_x: e.touches[0].pageX,
                start_page_y: e.touches[0].pageY,
                start_time: (new Date()).getTime(),
                delta_x: 0,
                is_scrolling: undefined
              };

          $(this).data('swipe-transition', data);
          e.stopPropagation();
        })
        .on('touchmove.fndtn.clearing', '.visible-img', function(e) {
          if (!e.touches) { e = e.originalEvent; }
          // Ignore pinch/zoom events
          if(e.touches.length > 1 || e.scale && e.scale !== 1) return;

          var data = $(this).data('swipe-transition');

          if (typeof data === 'undefined') {
            data = {};
          }

          data.delta_x = e.touches[0].pageX - data.start_page_x;

          if ( typeof data.is_scrolling === 'undefined') {
            data.is_scrolling = !!( data.is_scrolling || Math.abs(data.delta_x) < Math.abs(e.touches[0].pageY - data.start_page_y) );
          }

          if (!data.is_scrolling && !data.active) {
            e.preventDefault();
            var direction = (data.delta_x < 0) ? 'next' : 'prev';
            data.active = true;
            self.nav(e, direction);
          }
        })
        .on('touchend.fndtn.clearing', '.visible-img', function(e) {
          $(this).data('swipe-transition', {});
          e.stopPropagation();
        });
    },

    assemble : function ($li) {
      var $el = $li.parent();

      if ($el.parent().hasClass('carousel')) return;
      $el.after('<div id="foundationClearingHolder"></div>');

      var holder = $('#foundationClearingHolder'),
          settings = $el.data('clearing-init'),
          grid = $el.detach(),
          data = {
            grid: '<div class="carousel">' + grid[0].outerHTML + '</div>',
            viewing: settings.templates.viewing
          },
          wrapper = '<div class="clearing-assembled"><div>' + data.viewing +
            data.grid + '</div></div>';

      return holder.after(wrapper).remove();
    },

    open : function ($image, current, target) {
      var root = target.closest('.clearing-assembled'),
          container = $('div', root).first(),
          visible_image = $('.visible-img', container),
          image = $('img', visible_image).not($image);

      if (!this.locked()) {
        // set the image to the selected thumbnail
        image
          .attr('src', this.load($image))
          .css('visibility', 'hidden');

        this.loaded(image, function () {
          image.css('visibility', 'visible');
          // toggle the gallery
          root.addClass('clearing-blackout');
          container.addClass('clearing-container');
          visible_image.show();
          this.fix_height(target)
            .caption($('.clearing-caption', visible_image), $image)
            .center(image)
            .shift(current, target, function () {
              target.siblings().removeClass('visible');
              target.addClass('visible');
            });
        }.bind(this));
      }
    },

    close : function (e, el) {
      e.preventDefault();

      var root = (function (target) {
            if (/blackout/.test(target.selector)) {
              return target;
            } else {
              return target.closest('.clearing-blackout');
            }
          }($(el))), container, visible_image;

      if (el === e.target && root) {
        container = $('div', root).first();
        visible_image = $('.visible-img', container);
        this.settings.prev_index = 0;
        $('ul[data-clearing]', root)
          .attr('style', '').closest('.clearing-blackout')
          .removeClass('clearing-blackout');
        container.removeClass('clearing-container');
        visible_image.hide();
      }

      return false;
    },

    is_open : function (current) {
      return current.parent().prop('style').length > 0;
    },

    keydown : function (e) {
      var clearing = $('ul[data-clearing]', '.clearing-blackout');

      if (e.which === 39) this.go(clearing, 'next');
      if (e.which === 37) this.go(clearing, 'prev');
      if (e.which === 27) $('a.clearing-close').trigger('click');
    },

    nav : function (e, direction) {
      var clearing = $('ul[data-clearing]', '.clearing-blackout');

      e.preventDefault();
      this.go(clearing, direction);
    },

    resize : function () {
      var image = $('img', '.clearing-blackout .visible-img');

      if (image.length) {
        this.center(image);
      }
    },

    // visual adjustments
    fix_height : function (target) {
      var lis = target.parent().children(),
          self = this;

      lis.each(function () {
          var li = $(this),
              image = li.find('img');

          if (li.height() > image.outerHeight()) {
            li.addClass('fix-height');
          }
        })
        .closest('ul')
        .width(lis.length * 100 + '%');

      return this;
    },

    update_paddles : function (target) {
      var visible_image = target
        .closest('.carousel')
        .siblings('.visible-img');

      if (target.next().length > 0) {
        $('.clearing-main-next', visible_image)
          .removeClass('disabled');
      } else {
        $('.clearing-main-next', visible_image)
          .addClass('disabled');
      }

      if (target.prev().length > 0) {
        $('.clearing-main-prev', visible_image)
          .removeClass('disabled');
      } else {
        $('.clearing-main-prev', visible_image)
          .addClass('disabled');
      }
    },

    center : function (target) {
      if (!this.rtl) {
        target.css({
          marginLeft : -(target.outerWidth() / 2),
          marginTop : -(target.outerHeight() / 2)
        });
      } else {
        target.css({
          marginRight : -(target.outerWidth() / 2),
          marginTop : -(target.outerHeight() / 2),
          left: 'auto',
          right: '50%'
        });
      }
      return this;
    },

    // image loading and preloading

    load : function ($image) {
      if ($image[0].nodeName === "A") {
        var href = $image.attr('href');
      } else {
        var href = $image.parent().attr('href');
      }

      this.preload($image);

      if (href) return href;
      return $image.attr('src');
    },

    preload : function ($image) {
      this
        .img($image.closest('li').next())
        .img($image.closest('li').prev());
    },

    img : function (img) {
      if (img.length) {
        var new_img = new Image(),
            new_a = $('a', img);

        if (new_a.length) {
          new_img.src = new_a.attr('href');
        } else {
          new_img.src = $('img', img).attr('src');
        }
      }
      return this;
    },

    // image caption

    caption : function (container, $image) {
      var caption = $image.data('caption');

      if (caption) {
        container
          .html(caption)
          .show();
      } else {
        container
          .text('')
          .hide();
      }
      return this;
    },

    // directional methods

    go : function ($ul, direction) {
      var current = $('.visible', $ul),
          target = current[direction]();

      if (target.length) {
        $('img', target)
          .trigger('click', [current, target]);
      }
    },

    shift : function (current, target, callback) {
      var clearing = target.parent(),
          old_index = this.settings.prev_index || target.index(),
          direction = this.direction(clearing, current, target),
          dir = this.rtl ? 'right' : 'left',
          left = parseInt(clearing.css('left'), 10),
          width = target.outerWidth(),
          skip_shift;

      var dir_obj = {};

      // we use jQuery animate instead of CSS transitions because we
      // need a callback to unlock the next animation
      // needs support for RTL **
      if (target.index() !== old_index && !/skip/.test(direction)){
        if (/left/.test(direction)) {
          this.lock();
          dir_obj[dir] = left + width;
          clearing.animate(dir_obj, 300, this.unlock());
        } else if (/right/.test(direction)) {
          this.lock();
          dir_obj[dir] = left - width;
          clearing.animate(dir_obj, 300, this.unlock());
        }
      } else if (/skip/.test(direction)) {
        // the target image is not adjacent to the current image, so
        // do we scroll right or not
        skip_shift = target.index() - this.settings.up_count;
        this.lock();

        if (skip_shift > 0) {
          dir_obj[dir] = -(skip_shift * width);
          clearing.animate(dir_obj, 300, this.unlock());
        } else {
          dir_obj[dir] = 0;
          clearing.animate(dir_obj, 300, this.unlock());
        }
      }

      callback();
    },

    direction : function ($el, current, target) {
      var lis = $('li', $el),
          li_width = lis.outerWidth() + (lis.outerWidth() / 4),
          up_count = Math.floor($('.clearing-container').outerWidth() / li_width) - 1,
          target_index = lis.index(target),
          response;

      this.settings.up_count = up_count;

      if (this.adjacent(this.settings.prev_index, target_index)) {
        if ((target_index > up_count)
          && target_index > this.settings.prev_index) {
          response = 'right';
        } else if ((target_index > up_count - 1)
          && target_index <= this.settings.prev_index) {
          response = 'left';
        } else {
          response = false;
        }
      } else {
        response = 'skip';
      }

      this.settings.prev_index = target_index;

      return response;
    },

    adjacent : function (current_index, target_index) {
      for (var i = target_index + 1; i >= target_index - 1; i--) {
        if (i === current_index) return true;
      }
      return false;
    },

    // lock management

    lock : function () {
      this.settings.locked = true;
    },

    unlock : function () {
      this.settings.locked = false;
    },

    locked : function () {
      return this.settings.locked;
    },

    off : function () {
      $(this.scope).off('.fndtn.clearing');
      $(window).off('.fndtn.clearing');
    },

    reflow : function () {
      this.init();
    }
  };

}(jQuery, this, this.document));





;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.magellan = {
    name : 'magellan',

    version : '5.0.0',

    settings : {
      active_class: 'active',
      threshold: 0
    },

    init : function (scope, method, options) {
      this.fixed_magellan = $("[data-magellan-expedition]");
      this.magellan_placeholder = $('<div></div>').css({
        height: this.fixed_magellan.outerHeight(true)
      }).hide().insertAfter(this.fixed_magellan);
      this.set_threshold();
      this.set_active_class(method);
      this.last_destination = $('[data-magellan-destination]').last();
      this.events();
    },

    events : function () {
      var self = this;

      $(this.scope)
        .off('.magellan')
        .on('arrival.fndtn.magellan', '[data-magellan-arrival]', function (e) {
          var $destination = $(this),
              $expedition = $destination.closest('[data-magellan-expedition]'),
              active_class = $expedition.attr('data-magellan-active-class')
                || self.settings.active_class;

            $destination
              .closest('[data-magellan-expedition]')
              .find('[data-magellan-arrival]')
              .not($destination)
              .removeClass(active_class);
            $destination.addClass(active_class);
        });

      this.fixed_magellan
        .off('.magellan')
        .on('update-position.fndtn.magellan', function() {
          var $el = $(this);
        })
        .trigger('update-position');

      $(window)
        .off('.magellan')
        .on('resize.fndtn.magellan', function() {
          this.fixed_magellan.trigger('update-position');
        }.bind(this))
        .on('scroll.fndtn.magellan', function() {
          var windowScrollTop = $(window).scrollTop();
          self.fixed_magellan.each(function() {
            var $expedition = $(this);
            if (typeof $expedition.data('magellan-top-offset') === 'undefined') {
              $expedition.data('magellan-top-offset', $expedition.offset().top);
            }
            if (typeof $expedition.data('magellan-fixed-position') === 'undefined') {
              $expedition.data('magellan-fixed-position', false);
            }
            var fixed_position = (windowScrollTop + self.settings.threshold) > $expedition.data("magellan-top-offset");
            var attr = $expedition.attr('data-magellan-top-offset');

            if ($expedition.data("magellan-fixed-position") != fixed_position) {
              $expedition.data("magellan-fixed-position", fixed_position);
              if (fixed_position) {
                $expedition.addClass('fixed');
                $expedition.css({position:"fixed", top:0});
                self.magellan_placeholder.show();
              } else {
                $expedition.removeClass('fixed');
                $expedition.css({position:"", top:""});
                self.magellan_placeholder.hide();
              }
              if (fixed_position && typeof attr != 'undefined' && attr != false) {
                $expedition.css({position:"fixed", top:attr + "px"});
              }
            }
          });
        });


      if (this.last_destination.length > 0) {
        $(window).on('scroll.fndtn.magellan', function (e) {
          var windowScrollTop = $(window).scrollTop(),
              scrolltopPlusHeight = windowScrollTop + $(window).height(),
              lastDestinationTop = Math.ceil(self.last_destination.offset().top);

          $('[data-magellan-destination]').each(function () {
            var $destination = $(this),
                destination_name = $destination.attr('data-magellan-destination'),
                topOffset = $destination.offset().top - $destination.outerHeight(true) - windowScrollTop;
            if (topOffset <= self.settings.threshold) {
              $("[data-magellan-arrival='" + destination_name + "']").trigger('arrival');
            }
            // In large screens we may hit the bottom of the page and dont reach the top of the last magellan-destination, so lets force it
            if (scrolltopPlusHeight >= $(self.scope).height() && lastDestinationTop > windowScrollTop && lastDestinationTop < scrolltopPlusHeight) {
              $('[data-magellan-arrival]').last().trigger('arrival');
            }
          });
        });
      }
    },

    set_threshold : function () {
      if (typeof this.settings.threshold !== 'number') {
        this.settings.threshold = (this.fixed_magellan.length > 0) ?
          this.fixed_magellan.outerHeight(true) : 0;
      }
    },

    set_active_class : function (options) {
      if (options && options.active_class && typeof options.active_class === 'string') {
        this.settings.active_class = options.active_class;
      }
    },

    off : function () {
      $(this.scope).off('.fndtn.magellan');
      $(window).off('.fndtn.magellan');
    },

    reflow : function () {}
  };
}(jQuery, this, this.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.offcanvas = {
    name : 'offcanvas',

    version : '5.0.0',

    settings : {},

    init : function (scope, method, options) {
      this.events();
    },

    events : function () {
      $(this.scope).off('.offcanvas')
        .on('click.fndtn.offcanvas', '.left-off-canvas-toggle', function (e) {
          e.preventDefault();
          $(this).closest('.off-canvas-wrap').toggleClass('move-right');
        })
        .on('click.fndtn.offcanvas', '.exit-off-canvas', function (e) {
          e.preventDefault();
          $(".off-canvas-wrap").removeClass("move-right");
        })
        .on('click.fndtn.offcanvas', '.right-off-canvas-toggle', function (e) {
          e.preventDefault();
          $(this).closest(".off-canvas-wrap").toggleClass("move-left");
        })
        .on('click.fndtn.offcanvas', '.exit-off-canvas', function (e) {
          e.preventDefault();
          $(".off-canvas-wrap").removeClass("move-left");
        });
    },

    reflow : function () {}
  };
}(jQuery, this, this.document));






/* Custom JS scripts */
/**
 * fullPage 1.6.8
 * https://github.com/alvarotrigo/fullPage.js
 * MIT licensed
 *
 * Copyright (C) 2013 alvarotrigo.com - A project by Alvaro Trigo
 */

(function($) {
    $.fn.fullpage = function(options) {
        // Create some defaults, extending them with any options that were provided
        options = $.extend({
            "verticalCentered" : true,
            'resize' : true,
            'slidesColor' : [],
            'anchors':[],
            'scrollingSpeed': 700,
            'easing': 'easeInQuart',
            'menu': false,
            'navigation': false,
            'navigationPosition': 'right',
            'navigationColor': '#000',
            'navigationTooltips': [],
            'slidesNavigation': false,
            'slidesNavPosition': 'bottom',
            'controlArrowColor': '#fff',
            'loopBottom': false,
            'loopTop': false,
            'loopHorizontal': true,
            'autoScrolling': true,
            'scrollOverflow': false,
            'css3': false,
            'paddingTop': 0,
            'paddingBottom': 0,
            'fixedElements': null,
            'normalScrollElements': null,
            'keyboardScrolling': true,
            'touchSensitivity': 5,


            //events
            'afterLoad': null,
            'onLeave': null,
            'afterRender': null,
            'afterSlideLoad': null,
            'onSlideLeave': null
        }, options);



        //Defines the delay to take place before being able to scroll to the next section
        //BE CAREFUL! Not recommened to change it under 400 for a good behavior in laptops and
        //Apple devices (laptops, mouses...)
        var scrollDelay = 600;

        $.fn.fullpage.setAutoScrolling = function(value){
            options.autoScrolling = value;

            var element = $('.section.active');

            if(options.autoScrolling){
                $('html, body').css({
                    'overflow' : 'hidden',
                    'height' : '100%'
                });

                if(element.length){
                    //moving the container up
                    if(options.css3){
                        var translate3d = 'translate3d(0px, -' + element.position().top + 'px, 0px)';
                        transformContainer(translate3d, false);
                    }else{
                        //deleting the possible negative top
                        $('#superContainer').css('top', '-'  + element.position().top + 'px');
                    }
                }

            }else{
                $('html, body').css({
                    'overflow' : 'auto',
                    'height' : 'auto'
                });

                if(options.css3){
                    //moving the container up
                    var translate3d = 'translate3d(0px, 0px, 0px)';
                    transformContainer(translate3d, false);
                }else{
                    //deleting the possible negative top
                    $('#superContainer').css('top', '0px');
                }

                //scrolling the page to the section with no animation
                $('html, body').scrollTop(element.position().top);
            }

        };

        /**
        * Defines the scrolling speed
        */
        $.fn.fullpage.setScrollingSpeed = function(value){
           options.scrollingSpeed = value;
        };

        /**
        * Adds or remove the possiblity of scrolling through sections by using the mouse wheel or the trackpad.
        */
        $.fn.fullpage.setMouseWheelScrolling = function (value){
            if(value){
                addMouseWheelHandler();
            }else{
                removeMouseWheelHandler();
            }
        };

        /**
        * Adds or remove the possiblity of scrolling through sections by using the mouse wheel/trackpad or touch gestures.
        */
        $.fn.fullpage.setAllowScrolling = function (value){
            if(value){
                $.fn.fullpage.setMouseWheelScrolling(true);
                addTouchHandler();
            }else{
                $.fn.fullpage.setMouseWheelScrolling(false);
                removeTouchHandler();
            }
        };

        /**
        * Adds or remove the possiblity of scrolling through sections by using the keyboard arrow keys
        */
        $.fn.fullpage.setKeyboardScrolling = function (value){
            options.keyboardScrolling = value;
        };

        //flag to avoid very fast sliding for landscape sliders
        var slideMoving = false;

        var isTablet = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|Windows Phone)/);

        var windowsHeight = $(window).height();
        var isMoving = false;
        var isResizing = false;
        var lastScrolledDestiny;
        var lastScrolledSlide;


        $.fn.fullpage.setAllowScrolling(true);

        //if css3 is not supported, it will use jQuery animations
        if(options.css3){
            options.css3 = support3d();
        }

        $('body').wrapInner('<div id="superContainer" />');

        //creating the navigation dots
        if (options.navigation) {
            $('body').append('<div id="fullPage-nav"><ul></ul></div>');
            var nav = $('#fullPage-nav');

            nav.css('color', options.navigationColor);
            nav.addClass(options.navigationPosition);
        }

        $('.section').each(function(index){
            var slides = $(this).find('.slide');
            var numSlides = slides.length;

            if(!index){
                $(this).addClass('active');
            }

            $(this).css('height', windowsHeight + 'px');

            if(options.paddingTop || options.paddingBottom){
                $(this).css('padding', options.paddingTop  + ' 0 ' + options.paddingBottom + ' 0');
            }

            if (typeof options.slidesColor[index] !==  'undefined') {
                $(this).css('background-color', options.slidesColor[index]);
            }

            if (typeof options.anchors[index] !== 'undefined') {
                $(this).attr('data-anchor', options.anchors[index]);
            }


            if (options.navigation) {
                var link = '';
                if(options.anchors.length){
                    link = options.anchors[index];
                }
                var tooltip = options.navigationTooltips[index];
                if(typeof tooltip === 'undefined'){
                    tooltip = '';
                }

                nav.find('ul').append('<li data-tooltip="' + tooltip + '"><a href="#' + link + '"><span></span></a></li>');
            }

            // if there's any slide
            if (numSlides > 0) {
                var sliderWidth = numSlides * 100;
                var slideWidth = 100 / numSlides;

                slides.wrapAll('<div class="slidesContainer" />');
                slides.parent().wrap('<div class="slides" />');

                $(this).find('.slidesContainer').css('width', sliderWidth + '%');
                $(this).find('.slides').after('<div class="controlArrow prev"></div><div class="controlArrow next"></div>');

                if(options.controlArrowColor!='#fff'){
                    $(this).find('.controlArrow.next').css('border-color', 'transparent transparent transparent '+options.controlArrowColor);
                    $(this).find('.controlArrow.prev').css('border-color', 'transparent '+ options.controlArrowColor + ' transparent transparent');
                }

                if(!options.loopHorizontal){
                    $(this).find('.controlArrow.prev').hide();
                }


                if(options.slidesNavigation){
                    addSlidesNavigation($(this), numSlides);
                }

                slides.each(function(index) {
                    if(!index){
                        $(this).addClass('active');
                    }

                    $(this).css('width', slideWidth + '%');

                    if(options.verticalCentered){
                        addTableClass($(this));
                    }
                });
            }else{
                if(options.verticalCentered){
                    addTableClass($(this));
                }
            }




        }).promise().done(function(){
            $.fn.fullpage.setAutoScrolling(options.autoScrolling);

            $.isFunction( options.afterRender ) && options.afterRender.call( this);

            //fixed elements need to be moved out of the plugin container due to problems with CSS3.
            if(options.fixedElements && options.css3){
                $(options.fixedElements).appendTo('body');
            }

            //vertical centered of the navigation + first bullet active
            if(options.navigation){
                nav.css('margin-top', '-' + (nav.height()/2) + 'px');
                nav.find('li').first().find('a').addClass('active');
            }

            //moving the menu outside the main container (avoid problems with fixed positions when using CSS3 tranforms)
            if(options.menu && options.css3){
                $(options.menu).appendTo('body');
            }

            if(options.scrollOverflow){
                //after DOM and images are loaded
                $(window).on('load', function() {

                    $('.section').each(function(){
                        var slides = $(this).find('.slide');

                        if(slides.length){
                            slides.each(function(){
                                createSlimScrolling($(this));
                            });
                        }else{
                            createSlimScrolling($(this));
                        }

                    });
                });
            }

            $(window).on('load', function() {
                scrollToAnchor();
            });

        });

        var scrollId;
        var isScrolling = false;

        //when scrolling...
        $(window).scroll(function(e){

            if(!options.autoScrolling){
                var currentScroll = $(window).scrollTop();

                var scrolledSections = $('.section').map(function(){
                    if ($(this).offset().top < (currentScroll + 100)){
                        return $(this);
                    }
                });

                //geting the last one, the current one on the screen
                var currentSection = scrolledSections[scrolledSections.length-1];

                //executing only once the first time we reach the section
                if(!currentSection.hasClass('active')){
                    isScrolling = true;

                    var yMovement = getYmovement(currentSection);

                    $('.section.active').removeClass('active');
                    currentSection.addClass('active');

                    var anchorLink  = currentSection.data('anchor');
                    $.isFunction( options.onLeave ) && options.onLeave.call( this, currentSection.index('.section'), yMovement);

                    $.isFunction( options.afterLoad ) && options.afterLoad.call( this, anchorLink, (currentSection.index('.section') + 1));

                    activateMenuElement(anchorLink);
                    activateNavDots(anchorLink, 0);


                    if(options.anchors.length && !isMoving){
                        //needed to enter in hashChange event when using the menu with anchor links
                        lastScrolledDestiny = anchorLink;

                        location.hash = anchorLink;
                    }

                    //small timeout in order to avoid entering in hashChange event when scrolling is not finished yet
                    clearTimeout(scrollId);
                    scrollId = setTimeout(function(){
                        isScrolling = false;
                    }, 100);
                }

            }
        });




        var touchStartY = 0;
        var touchStartX = 0;
        var touchEndY = 0;
        var touchEndX = 0;

        /* Detecting touch events

        * As we are changing the top property of the page on scrolling, we can not use the traditional way to detect it.
        * This way, the touchstart and the touch moves shows an small difference between them which is the
        * used one to determine the direction.
        */
        function touchMoveHandler(event){

            if(options.autoScrolling){
                //preventing the easing on iOS devices
                event.preventDefault();

                var e = event.originalEvent;

                var touchMoved = false;
                var activeSection = $('.section.active');
                var scrollable;

                if (!isMoving && !slideMoving) { //if theres any #
                    var touchEvents = getEventsPage(e);
                    touchEndY = touchEvents['y'];
                    touchEndX = touchEvents['x'];

                    //if movement in the X axys is greater than in the Y and the currect section has slides...
                    if (activeSection.find('.slides').length && Math.abs(touchStartX - touchEndX) > (Math.abs(touchStartY - touchEndY))) {

                        //is the movement greater than the minimum resistance to scroll?
                        if (Math.abs(touchStartX - touchEndX) > ($(window).width() / 100 * options.touchSensitivity)) {
                            if (touchStartX > touchEndX) {
                                 activeSection.find('.controlArrow.next:visible').trigger('click');

                            } else {
                                activeSection.find('.controlArrow.prev:visible').trigger('click');
                            }
                        }
                    }

                    //vertical scrolling
                    else{
                        //if there are landscape slides, we check if the scrolling bar is in the current one or not
                        if(activeSection.find('.slides').length){
                            scrollable= activeSection.find('.slide.active').find('.scrollable');
                        }else{
                            scrollable = activeSection.find('.scrollable');
                        }

                        //is the movement greater than the minimum resistance to scroll?
                        if (Math.abs(touchStartY - touchEndY) > ($(window).height() / 100 * options.touchSensitivity)) {
                            if (touchStartY > touchEndY) {
                                if(scrollable.length > 0 ){
                                    //is the scrollbar at the end of the scroll?
                                    if(isScrolled('bottom', scrollable)){
                                        $.fn.fullpage.moveSectionDown();
                                    }else{
                                        return true;
                                    }
                                }else{
                                    // moved down
                                    $.fn.fullpage.moveSectionDown();
                                }
                            } else if (touchEndY > touchStartY) {

                                if(scrollable.length > 0){
                                    //is the scrollbar at the start of the scroll?
                                    if(isScrolled('top', scrollable)){
                                        $.fn.fullpage.moveSectionUp();
                                    }
                                    else{
                                        return true;
                                    }
                                }else{
                                    // moved up
                                    $.fn.fullpage.moveSectionUp();
                                }
                            }
                        }
                    }
                }
            }
        }

        function touchStartHandler(event){

            if(options.autoScrolling){
                var e = event.originalEvent;
                var touchEvents = getEventsPage(e);
                touchStartY = touchEvents['y'];
                touchStartX = touchEvents['x'];
            }
        }



        /**
         * Detecting mousewheel scrolling
         *
         * http://blogs.sitepointstatic.com/examples/tech/mouse-wheel/index.html
         * http://www.sitepoint.com/html5-javascript-mouse-wheel/
         */
        function MouseWheelHandler(e) {
            if(options.autoScrolling){
                // cross-browser wheel delta
                e = window.event || e;
                var delta = Math.max(-1, Math.min(1,
                        (e.wheelDelta || -e.detail)));
                var scrollable;
                var activeSection = $('.section.active');

                if (!isMoving) { //if theres any #

                    //if there are landscape slides, we check if the scrolling bar is in the current one or not
                    if(activeSection.find('.slides').length){
                        scrollable= activeSection.find('.slide.active').find('.scrollable');
                    }else{
                        scrollable = activeSection.find('.scrollable');
                    }

                    //scrolling down?
                    if (delta < 0) {
                        if(scrollable.length > 0 ){
                            //is the scrollbar at the end of the scroll?
                            if(isScrolled('bottom', scrollable)){
                                $.fn.fullpage.moveSectionDown();
                            }else{
                                return true; //normal scroll
                            }
                        }else{
                            $.fn.fullpage.moveSectionDown();
                        }
                    }

                    //scrolling up?
                    else {
                        if(scrollable.length > 0){
                            //is the scrollbar at the start of the scroll?
                            if(isScrolled('top', scrollable)){
                                $.fn.fullpage.moveSectionUp();
                            }else{
                                return true; //normal scroll
                            }
                        }else{
                            $.fn.fullpage.moveSectionUp();
                        }
                    }
                }

                return false;
            }
        }


        $.fn.fullpage.moveSectionUp = function(){
            var prev = $('.section.active').prev('.section');

            //looping to the bottom if there's no more sections above
            if(options.loopTop && !prev.length){
                prev = $('.section').last();
            }

            if (prev.length > 0 || (!prev.length && options.loopTop)){
                scrollPage(prev);
            }
        };

        $.fn.fullpage.moveSectionDown = function (){
            var next = $('.section.active').next('.section');

            //looping to the top if there's no more sections below
            if(options.loopBottom && !next.length){
                next = $('.section').first();
            }

            if (next.length > 0 || (!next.length && options.loopBottom)){
                scrollPage(next);
            }
        };

        $.fn.fullpage.moveTo = function (section, slide){
            var destiny = '';

            if(isNaN(section)){
                destiny = $('[data-anchor="'+section+'"]');
            }else{
                destiny = $('.section').eq( (section -1) );
            }

            if (slide !== 'undefined'){
                scrollPageAndSlide(section, slide);
            }else if(destiny.length > 0){
                scrollPage(destiny);
            }
        };

        function scrollPage(element, callback) {
            var scrollOptions = {}, scrolledElement;
            var dest = element.position();
            var dtop = dest !== null ? dest.top : null;
            var yMovement = getYmovement(element);
            var anchorLink  = element.data('anchor');
            var sectionIndex = element.index('.section');
            var activeSlide = element.find('.slide.active');

            if(activeSlide.length){
                var slideAnchorLink = activeSlide.data('anchor');
                var slideIndex = activeSlide.index();
            }

            var leavingSection = $('.section.active').index('.section') + 1;

            element.addClass('active').siblings().removeClass('active');

            //preventing from activating the MouseWheelHandler event
            //more than once if the page is scrolling
            isMoving = true;

            if(typeof anchorLink !== 'undefined'){
                setURLHash(slideIndex, slideAnchorLink, anchorLink);
            }

            if(options.autoScrolling){
                scrollOptions['top'] = -dtop;
                scrolledElement = '#superContainer';
            }else{
                scrollOptions['scrollTop'] = dtop;
                scrolledElement = 'html, body';
            }

            if(options.css3 && options.autoScrolling){


                $.isFunction( options.onLeave ) && options.onLeave.call( this, leavingSection, yMovement);

                var translate3d = 'translate3d(0px, -' + dtop + 'px, 0px)';
                transformContainer(translate3d, true);

                setTimeout(function(){
                    $.isFunction( options.afterLoad ) && options.afterLoad.call( this, anchorLink, (sectionIndex + 1));

                        setTimeout(function(){
                            isMoving = false;
                            $.isFunction( callback ) && callback.call( this);
                        }, scrollDelay);
                }, options.scrollingSpeed);
            }else{
                $.isFunction( options.onLeave ) && options.onLeave.call( this, leavingSection, yMovement);

                $(scrolledElement).animate(
                    scrollOptions
                , options.scrollingSpeed, options.easing, function() {
                    //callback
                    $.isFunction( options.afterLoad ) && options.afterLoad.call( this, anchorLink, (sectionIndex + 1));

                    setTimeout(function(){
                        isMoving = false;
                        $.isFunction( callback ) && callback.call( this);
                    }, scrollDelay);
                });
            }

            //flag to avoid callingn `scrollPage()` twice in case of using anchor links
            lastScrolledDestiny = anchorLink;

            //avoid firing it twice (as it does also on scroll)
            if(options.autoScrolling){
                activateMenuElement(anchorLink);
                activateNavDots(anchorLink, sectionIndex);
            }
        }

        function scrollToAnchor(){
            //getting the anchor link in the URL and deleting the `#`
            var value =  window.location.hash.replace('#', '').split('/');
            var section = value[0];
            var slide = value[1];

            if(section){  //if theres any #
                scrollPageAndSlide(section, slide);
            }
        }

        //detecting any change on the URL to scroll to the given anchor link
        //(a way to detect back history button as we play with the hashes on the URL)
        $(window).on('hashchange',function(){
            if(!isScrolling){
                var value =  window.location.hash.replace('#', '').split('/');
                var section = value[0];
                var slide = value[1];

                //when moving to a slide in the first section for the first time (first time to add an anchor to the URL)
                var isFirstSlideMove =  (typeof lastScrolledDestiny === 'undefined');
                var isFirstScrollMove = (typeof lastScrolledDestiny === 'undefined' && typeof slide === 'undefined');

                /*in order to call scrollpage() only once for each destination at a time
                It is called twice for each scroll otherwise, as in case of using anchorlinks `hashChange`
                event is fired on every scroll too.*/
                if ((section && section !== lastScrolledDestiny) && !isFirstSlideMove || isFirstScrollMove || (typeof slide !== 'undefined' && !slideMoving && lastScrolledSlide != slide ))  {
                    scrollPageAndSlide(section, slide);
                }
            }

        });


        /**
         * Sliding with arrow keys, both, vertical and horizontal
         */
        $(document).keydown(function(e) {
            //Moving the main page with the keyboard arrows if keyboard scrolling is enabled
            if (options.keyboardScrolling && !isMoving) {
                switch (e.which) {
                //up
                case 38:
                case 33:
                    $.fn.fullpage.moveSectionUp();
                    break;

                //down
                case 40:
                case 34:
                    $.fn.fullpage.moveSectionDown();
                    break;

                //left
                case 37:
                    $('.section.active').find('.controlArrow.prev:visible').trigger('click');
                    break;

                //right
                case 39:
                    $('.section.active').find('.controlArrow.next:visible').trigger('click');
                    break;

                default:
                    return; // exit this handler for other keys
                }
            }
        });

        //navigation action
        $(document).on('click', '#fullPage-nav a', function(e){
            e.preventDefault();
            var index = $(this).parent().index();
            scrollPage($('.section').eq(index));
        });

        //navigation tooltips
        $(document).on({
            mouseenter: function(){
                var tooltip = $(this).data('tooltip');
                $('<div class="fullPage-tooltip ' + options.navigationPosition +'">' + tooltip + '</div>').hide().appendTo($(this)).fadeIn(200);
            },
            mouseleave: function(){
                $(this).find('.fullPage-tooltip').fadeOut().remove();
            }
        }, '#fullPage-nav li');


        if(options.normalScrollElements){
            $(document).on('mouseover', options.normalScrollElements, function () {
                $.fn.fullpage.setMouseWheelScrolling(false);
            });

            $(document).on('mouseout', options.normalScrollElements, function(){
                $.fn.fullpage.setMouseWheelScrolling(true);
            });
        }

        /**
         * Scrolling horizontally when clicking on the slider controls.
         */
        $('.section').on('click', '.controlArrow', function() {
            //not that fast my friend! :)
            if (slideMoving) {
                return;
            }
            slideMoving = true;

            var slides = $(this).closest('.section').find('.slides');
            var currentSlide = slides.find('.slide.active');
            var destiny = null;

            if ($(this).hasClass('prev')) {
                destiny = currentSlide.prev('.slide');
            } else {
                destiny = currentSlide.next('.slide');
            }

            //is there isn't a next slide in the secuence?
            if(!destiny.length) {
                //to the last
                if ($(this).hasClass('prev')) {
                    destiny = currentSlide.siblings(':last');
                } else {
                    destiny = currentSlide.siblings(':first');
                }
            }

            landscapeScroll(slides, destiny);
        });


        /**
         * Scrolling horizontally when clicking on the slider controls.
         */
        $('.section').on('click', '.toSlide', function(e) {
            e.preventDefault();

            var slides = $(this).closest('.section').find('.slides');
            var currentSlide = slides.find('.slide.active');
            var destiny = null;

            destiny = slides.find('.slide').eq( ($(this).data('index') -1) );

            if(destiny.length > 0){
                landscapeScroll(slides, destiny);
            }
        });

        /**
        * Scrolls horizontal sliders.
        */
        function landscapeScroll(slides, destiny){
            var destinyPos = destiny.position();
            var slidesContainer = slides.find('.slidesContainer').parent();
            var slideIndex = destiny.index();
            var section = slides.closest('.section');
            var sectionIndex = section.index('.section');
            var anchorLink = section.data('anchor');
            var slidesNav = section.find('.fullPage-slidesNav');
            var slideAnchor = destiny.data('anchor');

            //caching the value of isResizing at the momment the function is called
            //because it will be checked later inside a setTimeout and the value might change
            var localIsResizing = isResizing;

            if(options.onSlideLeave){
                var prevSlideIndex = section.find('.slide.active').index();
                var xMovement = getXmovement(prevSlideIndex, slideIndex);

                //if the site is not just resizing and readjusting the slides
                if(!localIsResizing){
                    $.isFunction( options.onSlideLeave ) && options.onSlideLeave.call( this, anchorLink, (sectionIndex + 1), prevSlideIndex, xMovement);
                }
            }

            destiny.addClass('active').siblings().removeClass('active');


            if(typeof slideAnchor === 'undefined'){
                slideAnchor = slideIndex;
            }

            //only changing the URL if the slides are in the current section (not for resize re-adjusting)
            if(section.hasClass('active')){

                if(!options.loopHorizontal){
                    //hidding it for the fist slide, showing for the rest
                    section.find('.controlArrow.prev').toggle(slideIndex!=0);

                    //hidding it for the last slide, showing for the rest
                    section.find('.controlArrow.next').toggle(!destiny.is(':last-child'));
                }

                setURLHash(slideIndex, slideAnchor, anchorLink);
            }

            if(options.css3){
                var translate3d = 'translate3d(-' + destinyPos.left + 'px, 0px, 0px)';

                slides.find('.slidesContainer').addClass('easing').css({
                    '-webkit-transform': translate3d,
                    '-moz-transform': translate3d,
                    '-ms-transform':translate3d,
                    'transform': translate3d
                });
                setTimeout(function(){
                    //if the site is not just resizing and readjusting the slides
                    if(!localIsResizing){
                        $.isFunction( options.afterSlideLoad ) && options.afterSlideLoad.call( this, anchorLink, (sectionIndex + 1), slideAnchor, slideIndex );
                    }

                    slideMoving = false;
                }, options.scrollingSpeed, options.easing);
            }else{
                slidesContainer.animate({
                    scrollLeft : destinyPos.left
                }, options.scrollingSpeed, options.easing, function() {

                    //if the site is not just resizing and readjusting the slides
                    if(!localIsResizing){
                        $.isFunction( options.afterSlideLoad ) && options.afterSlideLoad.call( this, anchorLink, (sectionIndex + 1), slideAnchor, slideIndex);
                    }
                    //letting them slide again
                    slideMoving = false;
                });
            }

            slidesNav.find('.active').removeClass('active');
            slidesNav.find('li').eq(slideIndex).find('a').addClass('active');
        }


        if (!isTablet) {
            var resizeId;

            //when resizing the site, we adjust the heights of the sections
            $(window).resize(function() {
                //in order to call the functions only when the resize is finished
                //http://stackoverflow.com/questions/4298612/jquery-how-to-call-resize-event-only-once-its-finished-resizing
                clearTimeout(resizeId);
                resizeId = setTimeout(doneResizing, 500);
            });

        }
        $(window).bind('orientationchange', function() {
            doneResizing();
        });

        /**
         * When resizing is finished, we adjust the slides sizes and positions
         */
        function doneResizing() {
            isResizing = true;

            var windowsWidth = $(window).width();
            windowsHeight = $(window).height();

            //text and images resizing
            if (options.resize) {
                resizeMe(windowsHeight, windowsWidth);
            }

            $('.section').each(function(){
                var scrollHeight = windowsHeight - parseInt($(this).css('padding-bottom')) - parseInt($(this).css('padding-top'));

                //resizing the scrolling divs
                if(options.scrollOverflow){
                    var slides = $(this).find('.slide');

                    if(slides.length){
                        slides.each(function(){
                            createSlimScrolling($(this));
                        });
                    }else{
                        createSlimScrolling($(this));
                    }

                }

                //adjusting the height of the table-cell for IE and Firefox
                if(options.verticalCentered){
                    $(this).find('.tableCell').css('height', getTableHeight($(this)) + 'px');
                }

                $(this).css('height', windowsHeight + 'px');

                //adjusting the position fo the FULL WIDTH slides...
                var slides = $(this).find('.slides');
                if (slides.length) {
                    landscapeScroll(slides, slides.find('.slide.active'));
                }
            });

            //adjusting the position for the current section
            var destinyPos = $('.section.active').position();

            var activeSection = $('.section.active');

            //isn't it the first section?
            if(activeSection.index('.section')){
                scrollPage(activeSection);
            }

            isResizing = false;
        }

        /**
         * Resizing of the font size depending on the window size as well as some of the images on the site.
         */
        function resizeMe(displayHeight, displayWidth) {
            //Standard height, for which the body font size is correct
            var preferredHeight = 825;
            var windowSize = displayHeight;

            /* Problem to be solved

            if (displayHeight < 825) {
                var percentage = (windowSize * 100) / preferredHeight;
                var newFontSize = percentage.toFixed(2);

                $("img").each(function() {
                    var newWidth = ((80 * percentage) / 100).toFixed(2);
                    $(this).css("width", newWidth + '%');
                });
            } else {
                $("img").each(function() {
                    $(this).css("width", '');
                });
            }*/

            if (displayHeight < 825 || displayWidth < 900) {
                if (displayWidth < 900) {
                    windowSize = displayWidth;
                    preferredHeight = 900;
                }
                var percentage = (windowSize * 100) / preferredHeight;
                var newFontSize = percentage.toFixed(2);

                $("body").css("font-size", newFontSize + '%');
            } else {
                $("body").css("font-size", '100%');
            }
        }

        /**
         * Activating the website navigation dots according to the given slide name.
         */
        function activateNavDots(name, sectionIndex){
            if(options.navigation){
                $('#fullPage-nav').find('.active').removeClass('active');
                if(name){
                    $('#fullPage-nav').find('a[href="#' + name + '"]').addClass('active');
                }else{
                    $('#fullPage-nav').find('li').eq(sectionIndex).find('a').addClass('active');
                }
            }
        }

        /**
         * Activating the website main menu elements according to the given slide name.
         */
        function activateMenuElement(name){
            if(options.menu){
                $(options.menu).find('.active').removeClass('active');
                $(options.menu).find('[data-menuanchor="'+name+'"]').addClass('active');
            }
        }

        /**
        * Return a boolean depending on whether the scrollable element is at the end or at the start of the scrolling
        * depending on the given type.
        */
        function isScrolled(type, scrollable){
            if(type === 'top'){
                return !scrollable.scrollTop();
            }else if(type === 'bottom'){
                return scrollable.scrollTop() + scrollable.innerHeight() >= scrollable[0].scrollHeight;
            }
        }

        /**
        * Retuns `up` or `down` depending on the scrolling movement to reach its destination
        * from the current section.
        */
        function getYmovement(destiny){
            var fromIndex = $('.section.active').index('.section');
            var toIndex = destiny.index('.section');

            if(fromIndex > toIndex){
                return 'up';
            }
            return 'down';
        }

        /**
        * Retuns `right` or `left` depending on the scrolling movement to reach its destination
        * from the current slide.
        */
        function getXmovement(fromIndex, toIndex){
            if(fromIndex > toIndex){
                return 'left';
            }
            return 'right';
        }


        function createSlimScrolling(element){
            //needed to make `scrollHeight` work under Opera 12
            element.css('overflow', 'hidden');

            //in case element is a slide
            var section = element.closest('.section');
            var scrollable = element.find('.scrollable');

            //if there was scroll, the contentHeight will be the one in the scrollable section
            if(scrollable.length){
                var contentHeight = element.find('.scrollable').get(0).scrollHeight;
            }else{
                var contentHeight = element.get(0).scrollHeight;
                if(options.verticalCentered){
                    contentHeight = element.find('.tableCell').get(0).scrollHeight;
                }
            }

            var scrollHeight = windowsHeight - parseInt(section.css('padding-bottom')) - parseInt(section.css('padding-top'));

            //needs scroll?
            if ( contentHeight > scrollHeight) {
                //was there already an scroll ? Updating it
                if(scrollable.length){
                    scrollable.css('height', scrollHeight + 'px').parent().css('height', scrollHeight + 'px');
                }
                //creating the scrolling
                else{
                    if(options.verticalCentered){
                        element.find('.tableCell').wrapInner('<div class="scrollable" />');
                    }else{
                        element.wrapInner('<div class="scrollable" />');
                    }


                    element.find('.scrollable').slimScroll({
                        height: scrollHeight + 'px',
                        size: '10px',
                        alwaysVisible: true
                    });
                }
            }

            //removing the scrolling when it is not necessary anymore
            else{
                element.find('.scrollable').children().first().unwrap().unwrap();
                element.find('.slimScrollBar').remove();
                element.find('.slimScrollRail').remove();
            }

            //undo
            element.css('overflow', '');
        }

        function addTableClass(element){
            element.addClass('table').wrapInner('<div class="tableCell" style="height:' + getTableHeight(element) + 'px;" />');
        }

        function getTableHeight(element){
            var sectionHeight = windowsHeight;

            if(options.paddingTop || options.paddingBottom){
                var section = element;
                if(!section.hasClass('section')){
                    section = element.closest('.section');
                }

                var paddings = parseInt(section.css('padding-top')) + parseInt(section.css('padding-bottom'));
                sectionHeight = (windowsHeight - paddings);
            }

            return sectionHeight;
        }

        /**
        * Adds a css3 transform property to the container class with or without animation depending on the animated param.
        */
        function transformContainer(translate3d, animated){
            $('#superContainer').toggleClass('easing', animated);

            $('#superContainer').css({
                '-webkit-transform': translate3d,
                '-moz-transform': translate3d,
                '-ms-transform':translate3d,
                'transform': translate3d
            });
        }


        /**
        * Scrolls to the given section and slide
        */
        function scrollPageAndSlide(destiny, slide){
            if (typeof slide === 'undefined') {
                slide = 0;
            }

            if(isNaN(destiny)){
                var section = $('[data-anchor="'+destiny+'"]');
            }else{
                var section = $('.section').eq( (destiny -1) );
            }


            //we need to scroll to the section and then to the slide
            if (destiny !== lastScrolledDestiny && !section.hasClass('active')){
                scrollPage(section, function(){
                    scrollSlider(section, slide)
                });
            }
            //if we were already in the section
            else{
                scrollSlider(section, slide);
            }

        }

        /**
        * Scrolls the slider to the given slide destination for the given section
        */
        function scrollSlider(section, slide){
            if(typeof slide != 'undefined'){
                var slides = section.find('.slides');
                var destiny =  slides.find('[data-anchor="'+slide+'"]');

                if(!destiny.length){
                    destiny = slides.find('.slide').eq(slide);
                }

                if(destiny.length){
                    landscapeScroll(slides, destiny);
                }
            }
        }

        /**
        * Creates a landscape navigation bar with dots for horizontal sliders.
        */
        function addSlidesNavigation(section, numSlides){
            section.append('<div class="fullPage-slidesNav"><ul></ul></div>');
            var nav = section.find('.fullPage-slidesNav');

            //top or bottom
            nav.addClass(options.slidesNavPosition);

            for(var i=0; i< numSlides; i++){
                nav.find('ul').append('<li><a href="#"><span></span></a></li>');
            }

            //centering it
            nav.css('margin-left', '-' + (nav.width()/2) + 'px');

            nav.find('li').first().find('a').addClass('active');
        }


        /**
        * Sets the URL hash for a section with slides
        */
        function setURLHash(slideIndex, slideAnchor, anchorLink){
            var sectionHash = '';

            if(options.anchors.length){

                //isn't it the first slide?
                if(slideIndex){
                    if(typeof anchorLink !== 'undefined'){
                        sectionHash = anchorLink;
                    }

                    //slide without anchor link? We take the index instead.
                    if(typeof slideAnchor === 'undefined'){
                        slideAnchor = slideIndex;
                    }

                    lastScrolledSlide = slideAnchor;
                    location.hash = sectionHash + '/' + slideAnchor;

                //first slide won't have slide anchor, just the section one
                }else if(typeof slideIndex !== 'undefined'){
                    location.hash = anchorLink;
                }

                //section without slides
                else{
                    location.hash = anchorLink;
                }
            }
        }

        /**
        * Scrolls the slider to the given slide destination for the given section
        */
        $(document).on('click', '.fullPage-slidesNav a', function(e){
            e.preventDefault();
            var slides = $(this).closest('.section').find('.slides');
            var destiny = slides.find('.slide').eq($(this).closest('li').index());

            landscapeScroll(slides, destiny);
        });


        /**
        * Checks for translate3d support
        * @return boolean
        * http://stackoverflow.com/questions/5661671/detecting-transform-translate3d-support
        */
        function support3d() {
            var el = document.createElement('p'),
                has3d,
                transforms = {
                    'webkitTransform':'-webkit-transform',
                    'OTransform':'-o-transform',
                    'msTransform':'-ms-transform',
                    'MozTransform':'-moz-transform',
                    'transform':'transform'
                };

            // Add it to the body to get the computed style.
            document.body.insertBefore(el, null);

            for (var t in transforms) {
                if (el.style[t] !== undefined) {
                    el.style[t] = "translate3d(1px,1px,1px)";
                    has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                }
            }

            document.body.removeChild(el);

            return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
        }



        /**
        * Removes the auto scrolling action fired by the mouse wheel and tackpad.
        * After this function is called, the mousewheel and trackpad movements won't scroll through sections.
        */
        function removeMouseWheelHandler(){
            if (document.addEventListener) {
                document.removeEventListener('mousewheel', MouseWheelHandler, false); //IE9, Chrome, Safari, Oper
                document.removeEventListener('DOMMouseScroll', MouseWheelHandler, false); //Firefox
            } else {
                document.detachEvent("onmousewheel", MouseWheelHandler); //IE 6/7/8
            }
        }


        /**
        * Adds the auto scrolling action for the mouse wheel and tackpad.
        * After this function is called, the mousewheel and trackpad movements will scroll through sections
        */
        function addMouseWheelHandler(){
            if (document.addEventListener) {
                document.addEventListener("mousewheel", MouseWheelHandler, false); //IE9, Chrome, Safari, Oper
                document.addEventListener("DOMMouseScroll", MouseWheelHandler, false); //Firefox
            } else {
                document.attachEvent("onmousewheel", MouseWheelHandler); //IE 6/7/8
            }
        }


        /**
        * Adds the possibility to auto scroll through sections on touch devices.
        */
        function addTouchHandler(){
                $(document).off('touchstart MSPointerDown').on('touchstart MSPointerDown', touchStartHandler);
                $(document).off('touchmove MSPointerMove').on('touchmove MSPointerMove', touchMoveHandler);
        }

        /**
        * Removes the auto scrolling for touch devices.
        */
        function removeTouchHandler(){
            $(document).off('touchstart MSPointerDown');
            $(document).off('touchmove MSPointerMove');
        }

        /**
        * Gets the pageX and pageY properties depending on the browser.
        * https://github.com/alvarotrigo/fullPage.js/issues/194#issuecomment-34069854
        */
        function getEventsPage(e){
            var events = new Array();
            if (window.navigator.msPointerEnabled){
                events['y'] = e.pageY;
                events['x'] = e.pageX;
            }else{
                events['y'] = e.touches[0].pageY;
                events['x'] =  e.touches[0].pageX;
            }

            return events;
        }

    };
})(jQuery);

/* Custom JS scripts */
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
