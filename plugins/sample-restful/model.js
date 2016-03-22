'use strict';

var model = {};
var Promise = require('bluebird');
var _ = require('lodash');
var mockObj = [
  {
    id: 'TD1',
    name: 'To do 1',
    startDate: '2015-10-11',
    endDate: '2015-10-15',
    description: 'I am todo number 1',
    location: 'Taipei',
    priority: 'High',
  },
  {
    id: 'TD2',
    name: 'To do 2',
    startDate: '2015-10-10',
    endDate: '2015-10-22',
    description: 'I am todo number 2',
    location: 'Taichung',
    priority: 'Medium',
  },
  {
    id: 'TD3',
    name: 'To do 3',
    startDate: '2015-10-15',
    endDate: '2015-10-23',
    description: 'I am todo number 3',
    location: 'Taipei',
    priority: 'High',
  },
  {
    id: 'TD4',
    name: 'To do 4',
    startDate: '2015-10-27',
    endDate: '2015-10-29',
    description: 'I am todo number 4',
    location: 'Hsinchu',
    priority: 'High',
  },
  {
    id: 'TD5',
    name: 'To do 5',
    startDate: '2015-11-11',
    endDate: '2015-11-15',
    description: 'I am todo number 5',
    location: 'Kaohsiung',
    priority: 'High',
  },
];

model.get = function (id, arg) {
  var callback = null;
  var defaultProps = ['id', 'name', 'startDate', 'endDate', 'description'];
  var todo = _(mockObj).filter(function (obj) {
    return obj.id === id;
  });

  if (typeof arg === 'function') {
    callback = arg;
    todo = todo.map(function (t) {
      return _.pick(t, defaultProps);
    });

    callback(null, todo.pop() || {});
  } else {
    callback = arguments[2]; //last args is a callback
    if (typeof arguments[1] === 'object') {
      var expand = defaultProps.concat(arguments[1]);
      todo = todo.map(function (t) {
        return _.pick(t, expand);
      });
      callback(null, todo.pop() || {});
    } else {
      callback(null, {});
    }
  }

};

model.create = function (todo, callback) {
  todo.data.id = 'TD' + (_.size(mockObj) + 1);
  callback(null, {id: todo.data.id});
};

model.update = function (todo, callback) {
  var updated = false;
  var selectedTodo = getSelectedTodo(todo.data.id);
  if (!_.isEmpty(selectedTodo)) {
    selectedTodo = _.merge(selectedTodo, todo.data);
    updated = true;
  } else {
    updated = false;
  }

  console.log(mockObj);
  callback(null, updated);
};

model.delete = function (todo, callback) {
  var deleted = false;
  if (!_.isEmpty(getSelectedTodo(todo.data.id))) {
    mockObj = _.reject(mockObj, {id: todo.data.id}); //delete from mockObj
    deleted = true;
  }

  callback(null, deleted);
};

function getSelectedTodo(id) {
  return _.filter(mockObj, {id: id}).pop();
}

module.exports = model;
