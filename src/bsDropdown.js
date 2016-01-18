(function(window, angular, undefined){
'use strict';

  var module = angular.module("ng.bs.dropdown", []);

  module.run(['$templateCache', function($templateCache) {
    $templateCache.put('bsDropdown/templates/defaultTemplate.html', [
      '<div class="dropdown">',
        '<button class="btn btn-default dropdown-toggle" type="button">',
          '{{showText}}',
        '</button>',
        '<ul class="dropdown-menu" role="menu">',
          "<li role='presentation' ng-repeat='item in items'>",
            '<a role="menuitem" tabindex="-1" href="" ng-click="selectItem(item)">{{item.text}}</a>',
          '</li>',
        '</ul>',
      '</div>'
    ].join(''));
  }]);

  module.controller("bsDropdownController",
    ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
      var ngModelCtrl,
          self = this;

      this.init = function (ngModelCtrl_) {
        ngModelCtrl = ngModelCtrl_;
        ngModelCtrl.$render = function () {
          if (angular.isDefined($scope.selected)) {
            ngModelCtrl.$setViewValue($scope.selected.value);
            self.$render($scope.selected);
          } else {
            self.$render(ngModelCtrl.$viewValue);
          }
        };
      };

      $scope.selectItem = function (item) {
        $scope.selected = item;
        ngModelCtrl.$render();
      };
  }]);

  module.directive("bsDropdown", function () {
    return {
      scope:{
        bsDropdownItems: "=",
        bsDropdownFormat: "&"
      },
      require: ['bsDropdown','?ngModel'],
      controller: "bsDropdownController", 
      templateUrl: "bsDropdown/templates/defaultTemplate.html",
      link: function (scope, el, attr, ctrls) {

        var bsDropdownCtrl = ctrls[0],
            ngModelCtrl    = ctrls[1];

        var defaultDisplay = 'DropDisplay';
        if (angular.isDefined(attr.bsDropdownDisplay)) {
          defaultDisplay = attr.bsDropdownDisplay;
        }

        var bsDropdownFormat = angular.identity;
        if (angular.isDefined(scope.bsDropdownFormat)) {
          bsDropdownFormat = scope.bsDropdownFormat(scope);
        }

        bsDropdownCtrl.init(ngModelCtrl);
        bsDropdownCtrl.$render = function (item) {
          if (item !== null) {
            changeShowText(item.text);
          }
        };

        
        scope.items = scope.bsDropdownItems.map(function (item) {
          return {
            text:  bsDropdownFormat(item),
            value: item
          };
        });

        function changeShowText(text) {
          if (text !== null) {
            scope.showText = text;
          } else {
            scope.showText = defaultDisplay;
          }
        }

        changeShowText(defaultDisplay);

      },
      restrict: "AE"
    };
  });
})(window, window.angular);
