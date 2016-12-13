(function () {
	'use strict';

	angular.module('todomvc').component('layout', {
		templateUrl: 'js/components/Layout.html',
		bindings: {
			// one-way input binding from router resolved
			store: '<'
		}
	});
})();
