/*global angular */

/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
angular.module('todomvc', ['ui.router', 'ngResource'])
	.config(function ($stateProvider) {
		'use strict';

		var root = {
			url: '',
			component: 'layout',
			resolve: {
				store: function (todoStorage) {
					todoStorage.get(); // Fetch the todo records in the background.
					return todoStorage;
				}
			}
		};
		var status = {
			url: '/:status',
			parent: 'root'
		};

		$stateProvider.state('root', root);
		$stateProvider.state('status', status);
	});
