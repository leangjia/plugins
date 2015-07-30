'use strict';

/**
 * @ngdoc directive
 * @name frontendApp.directive:rateBox
 * @description
 * # rateBox
 */
angular.module('frontendApp')

  // The rateBox directive shows a
  // "star rate" widget which allow
  // users to rate a plugin
  .directive('rateBox', function () {
    return {
      restrict: 'E',
      link: function postLink(scope, element, attrs, controller) {
        // Defaults the current note to 0
        if (typeof(scope.currentNote) === 'undefined')
          scope.currentNote = 0;

        // Creating five icon elements to display stars
        var stars = [];
        for (var i = 0 ; i < 5 ; i++) {
          var icon = angular.element('<i>');
          stars.push(icon)
          element.append(icon);
        }

        // Modify the DOM with the current stars
        var displayStars = function(note) {
          var classes = controller.getClassesFromNote(note);
          for (var i = 0 ; i < stars.length ; i++) {
           stars[i].attr('class', classes[i]);
          }
        };

        // Compute the stars height/width
        controller.starWidth = 25;
        controller.starHeight = 25;
 
        var halfOrPlain = function(offsetX) {
          return (controller.starWidth -
                  (controller.starWidth - offsetX)
                  <= (controller.starWidth / 2)
                 ) ? 0.5 : 1;
        };

        stars.forEach(function(el, i) {
          el.on('mouseenter', function(ev) {
            displayStars(i + halfOrPlain(ev.offsetX));
          });
          el.on('mousemove', function(ev) {
            displayStars(i + halfOrPlain(ev.offsetX));
          });
          el.on('mouseleave', function(ev) {
            displayStars(scope.currentNote);
          });
        });

        // Watch for future modifications of the note
        scope.$watch('currentNote', function() {
          displayStars(scope.currentNote);
        });
        // Create stars for current note
        displayStars(scope.currentNote);
      },

      scope: {
        currentNote: "=currentNote"
      },
      controller: function($scope) {
        // returns fontawesome class for a full star
        this.getFullStar = function(hover) {
          return 'fa fa-star' +(hover?' hover':'');
        };
        // returns fontawesome class for half a star
        this.getHalfStar = function(hover) {
          return 'fa fa-star-half-o' +(hover?' hover':'');
        };
        // returns fontawesome class for an empty star
        this.getEmptyStar = function(hover) {
          return 'fa fa-star-o' +(hover?' hover':'');
        };
        // returns an array of dom elements
        // which are the stars of the current
        // note
        this.getClassesFromNote = function(note, hover) {
          if (note > 5 || note < 0)
            note = 0;
          var stars = [];
          var lastIsHalf = note % 1 > 0;

          var hover = hover ? true : false;

          note = Math.floor(note);

          for (var i = 0 ; i < note ; i++) {
            stars.push(this.getFullStar(hover));
          }

          if (lastIsHalf) {
            stars.push(this.getHalfStar(hover));
            i = i + 0.5;
          }

          if (5 - i >= 1) {
            var missingStars = Math.floor(5 - i);
            for (var i = 0 ; i < missingStars ; i++) {
              stars.push(this.getEmptyStar(hover));
            }
          }

          return stars;
        };
      }
    };
  });
