(function () {
	'use strict';

	var TodoForm = (function () {
		// Constructor
		function Component() {

			this.newTodo = '';

		}

		Component.prototype.addTodo = function () {
			var newTodo = {
				title: this.newTodo.trim(),
				completed: false
			};

			if (!newTodo.title) {
				return;
			}

			this.saving = true;
			this.store.insert(newTodo)
				.then(angular.bind(this, function success() {
					this.newTodo = '';
				}))
				.finally(angular.bind(this, function () {
					this.saving = false;
				}));
		};

		Component.$inject = [
		];
		return Component;
	}());

	angular.module('todomvc').component('todoForm', {
		templateUrl: 'js/components/TodoForm.html',
		controller: TodoForm,
		bindings: {
			store: '<'
		}
	});
})();
