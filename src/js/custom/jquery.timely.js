/**
 * @name Timely.js
 * @author Lillian
 * @version 0.1.0
 */

;(function($, window, document, undefined) {

  var Timely = function(wrapper, options) {
    this.wrapper = wrapper;
    this.$wrapper = $(wrapper);
    this.options = options;
    this.$win = $(window);
  };

  Timely.prototype = {
    defaults: {
      container:    '.timely',
      groups:       '.timely__groups',
      marker_major: '.timely__markers--major',
      marker_minor: '.timely__markers--minor',
      marker_event: '.timely__event',
      order:        true, // true if asc, false if desc
      interval:     1
    },

    init: function() {
      var _self = this;

      _self.config = $.extend({}, _self.defaults, _self.options);

      _self.build();
      _self.bindEvents();

      return _self;
    },

    // will definitely fix how long this function is later...
    build: function() {
      var _self = this;
      var interval = _self.config.interval;

      var wrapperWidth = _self.$wrapper.width();
      _self.$wrapper.prepend('<div class="timely"></div>');
      $(_self.config.container).css('width', wrapperWidth)
                               .prepend('<ul class="timely__groups"></ul>');

      var events = [];

      // collect all events
      $('[data-year]').each(function() {
        var item = {
          year: $(this).data('year'),
          month: $(this).data('month'),
          day: $(this).data('day')
        };

        events.push(item);
      });

      // sort by asc/desc
      events.sort(_self.sortEvents(_self.config.order));

      // begin timeline build
      var start, end;

      if (_self.config.order) {
        start = events[0].year;
        end = events[events.length - 1].year;
      } else {
        start = events[events.length - 1].year;
        end = events[0].year;
      }

      var range = Math.abs(start - end);

      if (range <= 10) {
        interval = 1;
      } else if (range <= 50) {
        interval = 5;
      } else if (range <= 100) {
        interval = 10;
      } else if (range <= 500) {
        interval = 50;
      } else {
        interval = 100;
      }

      var groups = Math.ceil(range / interval),
          groupWidth = wrapperWidth / groups,
          y = _self.config.order ? start : end;
      
      for (var i = 0; i < groups; i++) {
        if (i > 0) {
          y = _self.config.order ? y + interval : y - interval;
        }

        $('<li>', {
          'data-marker-year': y,
          'style': 'width:'+ groupWidth + 'px'
        }).append(
          $('<ul>', {
            'class': 'timely__markers--minor'
          })
        ).append(
          $('<div>', {
            'class': 'timely__markers--major'
          })
        ).append(
          $('<span>', {
            'text': y
          })
        ).appendTo(_self.config.groups);
      }

      var lastYear = _self.config.order ? y + interval : y - interval;
      $('<span>', {
        'text': lastYear
      }).appendTo(_self.config.groups + '> li:last-child');

      var minorGroups = 0,
          minorType = 'm'; // m for months, y for years, d for days

      if (interval <= 5) {
        minorGroups = 12;
        minorType = 'm';
      } else {
        minorGroups = 10;
        minorType = 'y';
      }

      for (var j = 0; j < minorGroups; j++) {
        if (minorType === 'd') {

        } else if (minorType === 'm') {
          $('<li>', {
            'data-marker-month': j,
            'style': 'width:'+groupWidth/(minorGroups + 1)
          }).appendTo(_self.config.marker_minor);
        } else if (minorType === 'y') {
          $('<li>', {
            // 'data-marker-year': 
            'style': 'width:'+groupWidth/(minorGroups + 1)+'px'
          }).appendTo(_self.config.marker_minor);
        } else {

        }
      }

      $.each(events, function(i, elem) {
        // year cannot be undefined
        if (minorType === 'd') {

        } else if (minorType === 'm') {

        } else if (minorType === 'y') {
          var l = ((elem.year - start)/range) * (wrapperWidth - 1);

          $('<div>', {
            'class': 'timely__event',
            'data-year': elem.year
          }).css('left', l)
            .appendTo(_self.config.container);
        } else {

        }
      });
    },

    sortEvents: function(order) {
      return function(a, b) {
        var r1, r2;

        if (order) {
          r1 = -1;
          r2 = 1;
        } else {
          r1 = 1;
          r2 = -1;
        }

        var aYear = a.year,
            bYear = b.year;

        if (aYear === bYear) {
          var aMonth = a.month,
              bMonth = b.month;

          if (aMonth === bMonth) {
            var aDay = a.day,
                bDay = b.day;

            if (aDay === bDay) {
              return 0;
            } else if (aDay < bDay) {
              return r1;
            } else if (aDay > bDay) {
              return r2;
            } else {
              return 0;
            }
          } else if (aMonth < bMonth) {
            return r1;
          } else if (aMonth > bMonth) {
            return r2;
          } else {
            return 0;
          }
        } else if (aYear < bYear) {
          return r1;
        } else if (aYear > bYear) {
          return r2;
        } else {
          return 0;
        }
      };
    },

    bindEvents: function() {
      var _self = this;
    },

    destroy: function() {
      var _self = this;
    }
  };

  Timely.defaults = Timely.prototype.defaults;

  $.fn.timely = function(options) {
    this.destroy = function() {
      this.each(function() {
        new Timely(this, options).destroy();
      });
    };

    return this.each(function() {
      new Timely(this, options).init();
    });
  };

})(jQuery, window, document);
