(function () {
	'use strict';

	var TodoList = (function () {
		// Constructor
		function Component($scope, $filter, $transitions) {

			this.$filter = $filter;

			this.todos = this.store.todos;
			this.editedTodo = null;

			$scope.$watch('$ctrl.todos', angular.bind(this, function () {
				this.remainingCount = this.$filter('filter')(this.todos, {completed: false}).length;
				this.completedCount = this.todos.length - this.remainingCount;
				this.allChecked = !this.remainingCount;
			}), true);

			// Monitor the current route for changes and adjust the filter accordingly.
			$transitions.onSuccess({to: 'status'}, angular.bind(this, function (trans) {
				var status = this.status = trans._targetState._params.status || '';
				this.statusFilter = (status === 'active') ?
				{completed: false} : (status === 'completed') ?
				{completed: true} : {};
			}));

		}

		Component.prototype.editTodo = function (todo) {
			this.editedTodo = todo;
			// Clone the original todo to restore it on demand.
			this.originalTodo = angular.extend({}, todo);
		};

		Component.prototype.saveEdits = function (todo, event) {
			// Blur events are automatically triggered after the form submit event.
			// This does some unfortunate logic handling to prevent saving twice.
			if (event === 'blur' && this.saveEvent === 'submit') {
				this.saveEvent = null;
				return;
			}

			this.saveEvent = event;

			if (this.reverted) {
				// Todo edits were reverted-- don't save.
				this.reverted = null;
				return;
			}

			todo.title = todo.title.trim();

			if (todo.title === this.originalTodo.title) {
				this.editedTodo = null;
				return;
			}

			this.store[todo.title ? 'put' : 'delete'](todo)
				.then(function success() {
				}, angular.bind(this, function error() {
					todo.title = this.originalTodo.title;
				}))
				.finally(angular.bind(this, function () {
					this.editedTodo = null;
				}));
		};

		Component.prototype.revertEdits = function (todo) {
			this.todos[this.todos.indexOf(todo)] = this.originalTodo;
			this.editedTodo = null;
			this.originalTodo = null;
			this.reverted = true;
		};

		Component.prototype.removeTodo = function (todo) {
			this.store.delete(todo);
		};

		Component.prototype.saveTodo = function (todo) {
			this.store.put(todo);
		};

		Component.prototype.toggleCompleted = function (todo, completed) {
			if (angular.isDefined(completed)) {
				todo.completed = completed;
			}
			this.store.put(todo, this.todos.indexOf(todo))
				.then(function success() {
				}, function error() {
					todo.completed = !todo.completed;
				});
		};

		Component.prototype.clearCompletedTodos = function () {
			this.store.clearCompleted();
		};

		Component.prototype.markAll = function (completed) {
			this.todos.forEach(angular.bind(this, function (todo) {
				if (todo.completed !== completed) {
					this.toggleCompleted(todo, completed);
				}
			}));
		};

		Component.$inject = [
			'$scope',
			'$filter',
			'$transitions'
		];
		return Component;
	}());

	angular.module('todomvc').component('todoList', {
		templateUrl: 'js/components/TodoList.html',
		controller: TodoList,
		bindings: {
			// one-way attribute binding,
			store: '<'
		}
	});
})();
