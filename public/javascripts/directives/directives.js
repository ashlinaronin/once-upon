// Directive to show and hide the explanatory navbar.
onceUpon.directive('navbarExpand', function($animate, Modernizr) {
  function link (scope, element, attrs) {
    scope.recordEnabled = Modernizr.getusermedia && Modernizr.speechrecognition;

    var whatLink = element.find('#what');
    var howLink = element.find('#how');
    var currentlyShowing = null;


    element.bind('click', function(e) {
      if (e.target.id === "what" || e.target.id === "how") {
        var content = element.find('#navbar-content-' + e.target.id);

        if (!element.hasClass('expanded')) {
          $animate.addClass(element, 'expanded').then(showContent(content));
        } else if (element.hasClass('expanded') && currentlyShowing !== e.target){
          showContent(content);
        }
      } else {
        // clicked anything except what? or how? links
        if (element.hasClass('expanded')) {
          hideNav();
        }
      }

      e.stopPropagation();

      scope.$apply(); // need to apply scope in all custom event handlers!
    });

    var showContent = function(content) {
      if (currentlyShowing) {
        $animate.removeClass(currentlyShowing, 'showing').then(function() {
          $animate.addClass(content, 'showing');
        });
      } else {
        $animate.addClass(content, 'showing');
      }
      currentlyShowing = content;
    }

    var hideNav = function() {
      if (currentlyShowing) {
        $animate.removeClass(currentlyShowing, 'showing').then(function() {
          $animate.removeClass(element, 'expanded');
          currentlyShowing = null;
        });
      }
    }
  };

  return {
    restrict: 'A',
    scope: true,
    templateUrl: 'partials/navbar.html',
    link: link
  };
});



// Directive to handle automatic scrolling of the sentences panel.
onceUpon.directive('scroller', function($animate, SocketFactory) {
  function link (scope, element, attrs) {

    // If we get a new message, scroll down to it.
    scope.$watch(function() {
      return SocketFactory.hasNew;
    }, function(newVal, oldVal) {
      if (newVal === true) {
        // adding 300px to account for the padding added at the bottom of the
        // sentences panel
        element.animate({scrollTop:element[0].scrollHeight+300}, 1000);
      }
    });
  };

  return {
    restrict: 'A',
    scope: true,
    link: link
  };
});



onceUpon.directive('recordButton', function($animate, SocketFactory) {
  function link (scope, element, attrs) {
    var recordImg = element.find('img');
    scope.clickable = false;

    // anytime the current message or userposition changes, fire this handler
    scope.$watchGroup(['SocketFactory.userPosition', 'SocketFactory.currentMessage'],
      function(newVals, oldVals) {
        var userPos = newVals[0];
        var currentMsg = newVals[1];

        if (userPos === 0 && !currentMsg.inProgress) {
          recordImg.removeClass('active waiting');
          recordImg.addClass('ready');
          scope.clickable = true;
        } else if (userPos === 0 && currentMsg.inProgress) {
          recordImg.removeClass('ready waiting');
          recordImg.addClass('active');
          scope.clickable = false;
        } else {
          recordImg.removeClass('ready active');
          recordImg.addClass('waiting');
          scope.clickable = false;
        }

    });


  };

  return {
    restrict: 'A',
    link: link
  };
});
