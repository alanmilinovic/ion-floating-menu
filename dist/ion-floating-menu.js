/*!
 * Copyright 2016 PREGIOTEK
 * http://pregiotek.com/
 *
 * ion-floating-menu
 * Material UI-like Floating Action Button and Menu for Ionic applications.
 *
 * By @ennedigi
 *
 * Licensed under the MIT license. Please see LICENSE for more information.
 *
 */

(function () {
    'use strict';

    angular.module('ion-floating-menu', [])

        .directive('ionFloatingButton', ionFloatingButton)
        .directive('ionFloatingMenu', ionFloatingMenu)
        .directive('ionFloatingItem', ionFloatingItem)
        .factory('$ionicBackdropIon', $ionicBackdropIon);


    function ionFloatingButton() {
        return {
            restrict: 'E',
            scope: {
                click: '&?',
                buttonColor: '@?',
                buttonClass: '@?',
                icon: '@?',
                iconColor: '@?',
                hasFooter: '=?',
                isCentered: '=?',
                text: '@?',
                textClass: '@?',
                bottom: '@?'
            },
            template: '<ul ng-click="click();" id="floating-button" ng-class="{\'center\': isCentered}" ng-style="{\'bottom\' : \'{{bottom}}\' }">' +
                '<li ng-class="buttonClass" ng-style="{\'background-color\': buttonColor }">' +
                '<a><span ng-if="text" class="label-container"><span class="label" ng-class="textClass" ng-bind="text"></span></span><i class="icon menu-icon" ng-class="{ \'{{icon}}\' : true}" ng-style="{\'color\': iconColor }"></i></a>' +
                '</li>' +
                '</ul>',
            replace: false,
            transclude: true,
            controller: ionFloatingButtonCtrl
        };
    }

    ionFloatingButtonCtrl.$inject = ['$scope'];
    function ionFloatingButtonCtrl($scope) {
        $scope.buttonColor = $scope.buttonColor || '#2AC9AA';
        $scope.icon = $scope.icon || 'ion-plus';
        $scope.iconColor = $scope.iconColor || '#fff';
        $scope.hasFooter = $scope.hasFooter || false;
        $scope.isCentered = $scope.isCentered || false;

        if ($scope.hasFooter) {
            $scope.bottom = '60px';
        } else {
            $scope.bottom = $scope.bottom || '20px';
        }
    }

    function ionFloatingMenu() {
        return {
            restrict: 'E',
            scope: {
                menuOpenColor: '@?',
                menuOpenIcon: '@?',
                menuOpenIconColor: '@?',
                menuColor: '@?',
                menuIcon: '@?',
                menuIconColor: '@?',
                hasFooter: '=?',
                backdrop: '=?',
                backdropAppendSelector: '@?',
                bottom: '@?'
            },
            template: '<ul id="floating-menu"  \n\
                            ng-style="{\'bottom\' : \'{{bottom}}\'}" \n\
                            ng-class="{\'active\' : isOpen}" \n\
                            ng-click="open()">' +
                '<div ng-transclude></div>' +
                '<span><li class="menu-button icon menu-icon" ng-class="icon" ng-style="{\'background-color\' : buttonColor, \'color\': iconColor}"></li></span>' +
                '</ul>',
            replace: false,
            transclude: true,
            link: function (scope, element, attrs, ctrl, transclude) {
                element.find('div').replaceWith(transclude());
            },
            controller: ionFloatingMenuCtrl
        };
    }

    function ionFloatingItem() {
        return {
            restrict: 'E',
            require: ['^ionFloatingMenu'],
            scope: {
                click: '&?',
                icon: '@',
                iconColor: '@?',
                buttonColor: '@?',
                buttonClass: '@?',
                iconImagePath: '@?',
                iconImageClass: '@?',
                text: '@?',
                textClass: '@?'
            },
            template:
                '<li ng-click="click();" ng-class="buttonClass" ng-style="{\'background-color\': buttonColor }">' +
                '<span ng-if="text" class="label-container"><span class="label" ng-class="textClass" ng-bind="text"></span></span>' +
                '<img ng-if="iconImagePath" class="menu-icon" ng-class="iconImageClass" ng-src="{{iconImagePath}}"/>' +
                '<i ng-if="!iconImagePath" class="icon menu-icon" ng-class="{ \'{{icon}}\' : true}" ng-style="{\'color\': iconColor }"></i>' +
                '</li>',
            replace: false,
            controller: ionFloatingItemCtrl
        };
    }

    ionFloatingMenuCtrl.$inject = ['$scope', '$rootScope', '$ionicBackdropIon', '$ionicPlatform', '$timeout'];
    function ionFloatingMenuCtrl($scope, $rootScope, $ionicBackdropIon, $ionicPlatform, $timeout) {
        $scope.isOpen = false;
        $scope.open = function () {
            $scope.isOpen = !$scope.isOpen;
            if ($scope.isOpen) {
                $scope.setOpen();
            } else {
                $scope.setClose();
            }
        };

        var deregisterFirst = null;
        $scope.setOpen = function () {
            $scope.buttonColor = menuOpenColor;
            $scope.icon = menuOpenIcon;
            $scope.iconColor = menuOpenIconColor;

            if (backdrop) {
                $ionicBackdropIon.retain();
            }
            $rootScope.$broadcast('floating-menu:open');
            deregisterFirst = $ionicPlatform.registerBackButtonAction(
                function (event) {
                    event.preventDefault();
                    $scope.setClose(); $timeout(function () { $scope.isOpen = false; });
                }, 101);
        };
        $scope.setClose = function () {
            $scope.buttonColor = menuColor;
            $scope.icon = menuIcon;
            $scope.iconColor = menuIconColor;
            if (backdrop) {
                $ionicBackdropIon.release();
            }
            $rootScope.$broadcast('floating-menu:close');
            if (deregisterFirst) {
                deregisterFirst();
            }
        };

        $scope.attachBackdropClickEvent = function () {
            if (document.getElementById("floatingBD")) {
                document.getElementById("floatingBD").addEventListener("click", function (e) {
                    $scope.setClose(); $timeout(function () { $scope.isOpen = false; });
                }, false);
            }
        };

        $rootScope.$on('floating-menu:close-all', function () {
            $scope.setClose(); $timeout(function () { $scope.isOpen = false; });
        });

        var menuColor = $scope.menuColor || '#2AC9AA';
        var menuIcon = $scope.menuIcon || 'ion-plus';
        var menuIconColor = $scope.menuIconColor || '#fff';
        var menuOpenColor = $scope.menuOpenColor || '#2AC9AA';
        var menuOpenIcon = $scope.menuOpenIcon || 'ion-minus';
        var menuOpenIconColor = $scope.menuOpenIconColor || '#fff';
        var backdrop = $scope.backdrop || false;

        // Create backdrop
        $ionicBackdropIon.createBackdrop($scope.backdropAppendSelector);
        $scope.attachBackdropClickEvent();

        $scope.setClose();
        $scope.hasFooter = $scope.hasFooter || false;
        if ($scope.hasFooter) {
            $scope.bottom = '60px';
        } else {
            $scope.bottom = $scope.bottom || '20px';
        }
    }

    ionFloatingItemCtrl.$inject = ['$scope'];
    function ionFloatingItemCtrl($scope) {
        $scope.buttonColor = $scope.buttonColor || '#2AC9AA';
        $scope.iconColor = $scope.iconColor || '#fff';
    }


    $ionicBackdropIon.$inject = ['$document', '$timeout', '$$rAF', '$rootScope'];
    function $ionicBackdropIon($document, $timeout, $$rAF, $rootScope) {
        var el;
        var backdropHolds = 0;

        function createBackdrop(backdropAppendSelector) {
            if (el) {
                el.remove(); // Remove existing backdrop if any
            }

            // Create and append a new backdrop element
            el = angular.element('<div class="backdrop" id="floatingBD">');

            angular.element(document.querySelector(backdropAppendSelector || 'ion-content')).append(el[0]);
        }

        return {
            /**
             * @ngdoc method
             * @name $ionicBackdrop#retain
             * @description Retains the backdrop.
             */
            retain: retain,
            /**
             * @ngdoc method
             * @name $ionicBackdrop#release
             * @description
             * Releases the backdrop.
             */
            release: release,
            getElement: getElement,
            createBackdrop: function (backdropAppendSelector) {
                createBackdrop(backdropAppendSelector);
            },
            // exposed for testing
            _element: el
        };

        function retain() {
            backdropHolds++;
            if (backdropHolds === 1) {
                el.addClass('visible');
                $rootScope.$broadcast('backdrop.shown');
                $$rAF(function () {
                    // If we're still at >0 backdropHolds after async...
                    if (backdropHolds >= 1)
                        el.addClass('active');
                });
            }
        }
        function release() {
            if (backdropHolds === 1) {
                el.removeClass('active');
                $rootScope.$broadcast('backdrop.hidden');
                $timeout(function () {
                    // If we're still at 0 backdropHolds after async...
                    if (backdropHolds === 0)
                        el.removeClass('visible');
                }, 400, false);
            }
            backdropHolds = Math.max(0, backdropHolds - 1);
        }

        function getElement() {
            return el;
        }

    }
})();
