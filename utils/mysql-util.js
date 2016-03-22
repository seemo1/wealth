'use strict';

var Promise = require('bluebird');
var mysqlUtil = {dbCon: null};

mysqlUtil.setConnection = function(connection) {
  mysqlUtil.dbCon = connection;
};

/**
 *
 * @param queryString (string)
 * @param params (array)
 * @returns Object (Promise)
 */
mysqlUtil.query = function(queryString, params) {
  return new Promise(function(resolve, reject) {

    if (params instanceof Array === false) {
      throw 'params must be an array!';
    }

    mysqlUtil.dbCon.query(queryString, params, function(err, res) {
      if (err) {
        return reject(err);
      }

      resolve(res);
    });
  });
};

/**
 *
 * @param tableName (string)
 * @param fields (array)
 * @param conditions (object)
 * @param optionalString (string)
 * @return Object (Promise)
 */
mysqlUtil.select = function(tableName, fields, conditions, optionalString) {
  return new Promise(function(resolve, reject) {

    if (!tableName) {
      throw 'table name must be a string!';
    }

    if (fields instanceof Array === false) {
      throw 'fields must be an array!';
    }

    if (typeof conditions !== 'object' || conditions instanceof Array === true) {
      throw 'conditions must be a key value object!';
    }

    if (fields.length < 1) {
      fields = ['*'];
    }

    var queryCondition = buildQueryCondition(conditions);
    var query = 'SELECT ' + fields.join(', ') + ' FROM ' + tableName;
    if (optionalString) {
      query = query.concat(optionalString);
    }

    if (queryCondition.values.length > 0) {
      query = query.concat(queryCondition.fields);
    }

    mysqlUtil.dbCon.query(query, queryCondition.values, function(err, res) {
      if (err) {
        return reject(err);
      }

      resolve(res);
    });
  });
};

/**
 *
 * @param query (string)
 * @param params (object {keys, values})
 * @returns Object (Promise)
 */
mysqlUtil.insert = function(tableName, params) {

  return new Promise(function(resolve, reject) {
    if (!tableName) {
      throw 'table name must be a string!';
    }

    if (typeof params !== 'object' || params instanceof Array === true) {
      throw 'params must be a key value object!';
    }

    if (Object.keys(params).length < 1) {
      throw 'params cannot be an empty object!';
    }

    var valuesMark = repeatString('?,', Object.keys(params).length).slice(0, -1);
    var query = 'INSERT INTO ' + tableName + ' (' + Object.keys(params).join(',') + ') VALUES (' + valuesMark + ')';
    mysqlUtil.dbCon.query(query, getObjectValues(params), function(err, res) {
      if (err) {
        return reject(err);
      }

      resolve(res);
    });
  });
};

/**
 *
 * @param tableName (string)
 * @param conditions (object {key, value})
 * @returns Object (Promise)
 */
mysqlUtil.delete = function(tableName, conditions) {
  return new Promise(function(resolve, reject) {

    if (!tableName) {
      throw 'table name must be a string!';
    }

    if (typeof conditions !== 'object' || conditions instanceof Array === true) {
      throw 'conditions must be a key value object!';
    }

    if (Object.keys(conditions).length < 1) {
      throw 'conditions must not be an empty object!';
    }

    conditions = buildQueryCondition(conditions);
    var query = 'DELETE FROM ' + tableName + conditions.fields;
    mysqlUtil.dbCon.query(query, conditions.values, function(err, res) {
      if (err) {
        return reject(err);
      }

      resolve(res);
    });
  });
};

/**
 *
 * @param conditions (object)
 * @returns Object (string, value)
 */
function buildQueryCondition(conditions) {
  var conditionFields = '';
  var conditionValues = [];
  for (var prop in conditions) {
    if (conditions.hasOwnProperty(prop)) {
      conditionFields += ' ' + prop + '=? AND';
      conditionValues.push(conditions[prop]);
    }
  }

  conditionFields = ' WHERE' + conditionFields.slice(0, -4);

  return {
    fields: conditionFields,
    values: conditionValues,
  };
}

/**
 *
 * @param str (string)
 * @param length (int)
 */
function repeatString(str, length) {
  str = String(str);
  var concatString = '';
  do {
    if (length % 2) {
      concatString += str;
    }

    str += str;
    length = Math.floor(length / 2);
  } while (length);

  return concatString;
}

/**
 *
 * @param object
 * @returns Array
 */
function getObjectValues(object) {
  var values = [];
  for (var prop in object) {
    if (object.hasOwnProperty(prop)) {
      values.push(object[prop]);
    }
  }

  return values;
}

module.exports = mysqlUtil;
