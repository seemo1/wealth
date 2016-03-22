/**
 * Created by CCMa on 4/27/15.
 */
'use strict';
var jsModel = require('./js-common');
var cassandra = require('cassandra-driver');
var Lodash = require('lodash');
var cassModel = {};

var traceLog = false;
var logMergeCql = false; //log the merge CQL if true

/**
 * EQ : PK, Index都可
 * 其他 : PK only
 * @type {{EQ: number, GT: number, LT: number, GE: number, LE: number}}
 */
cassModel.Condition = {EQ: 0, GT: 1, LT: 2, GE: 3, LE: 4};
var CondStr = [' = ', ' > ', ' < ', ' >= ', ' <= '];

/**
 * 轉換成 timeuuid
 * @param toBeTimeuuid {string or timeuuid} to be converted to timeuuid
 * @returns { timeuuid or null}
 */
cassModel.assureTimeUuid = function(toBeTimeuuid) {
  try {
    if (toBeTimeuuid instanceof cassandra.types.TimeUuid) {
      return toBeTimeuuid;
    } else if (toBeTimeuuid) {
      return cassandra.types.TimeUuid.fromString(toBeTimeuuid);
    } else {
      return null;
    };
  } catch (e) {
    return null;
  }
};

/**
 * 轉換成 uuid
 * @param toBeUuid {string or uuid} to be converted to uuid
 * @returns {uuid or null}
 */
cassModel.assureUuid = function(toBeUuid) {
  try {
    if (toBeUuid instanceof cassandra.types.Uuid) {
      return toBeUuid;
    } else if (toBeUuid) {
      return cassandra.types.Uuid.fromString(toBeUuid);
    } else {
      return null;
    };
  } catch (e) {
    return null;
  }
};

function getResObject(error) {
  if (error) {
    return {success: false, errMsg: error.message};
  }  else {
    return {success: true};
  }
}

function getErrorResObject(errorMsg) {
  return {success: false, errMsg: errorMsg};
}

function getValue(value) {
  return jsModel.isString(value) ? ('\'' + value + '\'') : value;
}

/**
 * replace question marks to column values in cql string
 * issues: use isNaN(value) to judge the quotation, not real db data types
 * @param {string} strCql -  ex. = "insert symbol_vote_user (symbol,user,vote) values (?, ?, ?) ";
 * @param {array} columnValues  - ex. = ['EURUSD.FX', 'frank444', '2'];
 * @returns {string} - ex. insert symbol_vote_user (symbol,user,vote) values ("EURUSD.FX", "frank444", 2)
 */
function cqlQmarkToValue(strCql, columnValues) {
  if (!Array.isArray(columnValues)) {
    return 'wrong params:' + strCql;
  }

  ;
  var wholeCql = '';
  var aryCql = strCql.split('?');
  for (var ii = 0; ii < aryCql.length; ii++) {
    wholeCql += aryCql[ii];
    if (ii < columnValues.length) {
      wholeCql += (isNaN(columnValues[ii]) ? '\'' + columnValues[ii] + '\'' : columnValues[ii]);
    }

    ;
  }

  ;
  return wholeCql;
}

/**
 * 組成 column = value
 * @param column
 * @param condition : Condition
 * @param value
 * @returns {string}
 */

function getCondClause(column, condition) {
  var clauseStr = column + CondStr[condition] + '? ';

  return clauseStr;
}

/**
 * 組成 where column1 = value1 and column2 > value2
 * @param column : ['userid', 'userName', age]
 * @param conditions : [Condition.GE, Condition.LT, Condition.NE]
 * @param value : ['cc', 'ccma', 20]
 */
function getCondClauseString(columns, conditions) {
  if (columns == null || columns.length == 0 || columns.length != conditions.length)
      return '';

  var clauseStr = ' where ';

  for (var ii = 0; ii < columns.length; ii++) {

    clauseStr += getCondClause(columns[ii], conditions[ii]);

    if (ii < columns.length - 1) {
      clauseStr += ' and ';
    }
  }

  return clauseStr + ' ';
}

function getClauseString(columns) {
  if (columns == null || columns.length == 0)
      return '';

  var clauseStr = ' where ';

  for (var ii = 0; ii < columns.length; ii++) {
    clauseStr += getCondClause(columns[ii], cassModel.Condition.EQ);
    if (ii < columns.length - 1) {
      clauseStr += ' and ';
    }
  }

  return clauseStr;
}

function getFieldString(fields) {
  if (fields == null || fields.length == 0)
      return ' * ';

  var FieldStr = '';

  for (var ii = 0; ii < fields.length; ii++) {
    FieldStr += fields[ii];
    if (ii < fields.length - 1)
        FieldStr += ',';
  }

  return FieldStr;
}

function getColumnString(columns) {
  if (columns == null || columns.length == 0)
      return '';

  var columnStr = ' (';

  for (var ii = 0; ii < columns.length; ii++) {
    columnStr += columns[ii];

    if (ii < columns.length - 1) {
      columnStr += ',';
    }
  }

  columnStr += ') ';

  return columnStr;
}

/**
 * 取得(?, ?, ?)
 * @param columns
 * @returns {*}
 */
function getParamString(columns) {
  if (columns == null || columns.length == 0)
      return '';

  var paramStr = ' (';

  for (var ii = 0; ii < columns.length; ii++) {
    paramStr += '?';

    if (ii < columns.length - 1) {
      paramStr += ',';
    }
  }

  paramStr += ') ';

  return paramStr;
}

/**
 * 組成 set column1 = value1 and column2 = value2
 * @param column : ['userid', 'userName', age]
 * @param value : ['cc', 'ccma', 20]
 */
function getSetString(columns) {
  if (columns == null || columns.length == 0)
      return '';

  var setStr = ' set ';

  for (var ii = 0; ii < columns.length; ii++) {
    setStr += getCondClause(columns[ii], cassModel.Condition.EQ);
    if (ii < columns.length - 1) {
      setStr += ', ';
    }
  }

  return setStr;
}

/**
 * USE KEYSPACE
 * return : err
 * @param keyspaceName
 * @param callback
 */
cassModel.useKeyspace = function(keyspaceName, callback) {
  cassandraClient.execute('use ' + keyspaceName, function(error, success) {
    var res = getResObject(error);
    return callback(res);
  });
};
/**
 * 執行command
 * return : err, result
 * @param command
 * @param callback
 */
cassModel.execute = function(command, callback) {
  cassandraClient.execute(command, function(error, result) {
    var res = getResObject(error);
    res.result = result;

    if (traceLog) {
      console.log('execute command : ' + command);
      console.log(res);
    }

    return callback(res);
  });
};

function getInsertString(table, columns) {
  var commandStr = 'insert into ' + table + ' ' + getColumnString(columns) + ' VALUES ' + getParamString(columns);
  return commandStr;
}

function getDeleteString(table, columns) {
  return 'delete from ' + table + getClauseString(columns);
}

function getUpdateString(table, setColumns, whereColumns) {
  var commandStr = 'update ' + table + getSetString(setColumns) + getClauseString(whereColumns);
  return commandStr;
}

function getKeyValue(json, callback) {
  var column = [], value = [];

  Lodash.forEach(json, function(n, key) {
    column.push(key);
    value.push(n);
  });

  var res = {column: column, value: value};
  return callback(res);
}

cassModel.batchInsert = function(table, whereColumns, whereValues) {
  var commandStr = getInsertString(table, whereColumns);
  var query = {query: commandStr, params: whereValues};

  return query;
};

cassModel.batchInsertJ = function(table, whereJson) {
  getKeyValue(whereJson, function(res) {
    return cassModel.batchInsert(table, res.column, res.value, callback);
  });
};

cassModel.insert = function(table, whereColumns, whereValues, callback) {
  if (whereColumns.length != whereValues.length) {
    return callback(getErrorResObject('wrong parameters!'));
  }

  var commandStr = getInsertString(table, whereColumns);
  if (logMergeCql) {
    console.log('mergeCql:' + cqlQmarkToValue(commandStr, whereValues));
  }

  cassandraClient.execute(commandStr, whereValues, {prepare: true}, function(error, result) {
    var res = getResObject(error);
    if (traceLog) {
      console.log('insert res : ');
      console.log(res);
    }

    return callback(res);
  });
};

cassModel.insertJ = function(table, whereJson, callback) {
  getKeyValue(whereJson, function(res) {
    return cassModel.insert(table, res.column, res.value, callback);
  });
};

cassModel.truncate = function(table, callback) {
  cassandraClient.execute('truncate ' + table, function(error, result) {
    var res = getResObject(error);
    if (traceLog) {
      console.log('truncate res : ');
      console.log(res);
    }

    return callback(res);
  });
};

cassModel.batchDelete = function(table, whereColumns, whereValues) {
  var commandStr = getDeleteString(table, whereColumns);
  var query = {query: commandStr, params: whereValues};

  return query;
};

cassModel.batchDeleteJ = function(table, whereJson) {
  getKeyValue(whereJson, function(res) {
    return cassModel.batchDelete(table, res.column, res.value, callback);
  });
};

/**
 * 刪除特定row
 * @param table
 * @param columns
 * @param values
 * @param callback
 * @returns {*}
 */
cassModel.delete = function(table, whereColumns, whereValues, callback) {
  var commandStr = getDeleteString(table, whereColumns);
  if (logMergeCql) {
    console.log('mergeCql:' + cqlQmarkToValue(commandStr, whereValues));
  }

  cassandraClient.execute(commandStr, whereValues, {prepare: true}, function(error, result) {
    var res = getResObject(error);
    if (traceLog) {
      console.log('delete res : ');
      console.log(res);
    }

    return callback(res);
  });
};

cassModel.deleteJ = function(table, whereJson, callback) {
  getKeyValue(whereJson, function(res) {
    return cassModel.delete(table, res.column, res.value, callback);
  });
};

cassModel.batchUpdate = function(table, setColumns, setValues, whereColumns, whereValues) {
  var commandStr = getUpdateString(table, setColumns, whereColumns);
  var query = {query: commandStr, params: setValues.concat(whereValues)};

  return query;
};

/**
 * Update moultiple counter columns
 * @author Micah.Peng
 * @param {string} table - table name
 * @param {array} counterColumns - [ counterColumn1, counterColumn2 ..], ex ["bullish", "bearish" ]
 * @param {array} counterValues - [ counterColumn1Value, counterColumn2Value ..], ex [1, -1]
 * @param {array} whereColumns - [ filterColumn1, filterColumn2 ..], ex [ 'symbol' ..]
 * @param {array} whereValues - [ filterColumn1Value, filterColumn2Value ..], ex [ 'EURUSD.FX' ..]
 * @param {function} callbak - callback function with result
 * @returns {callback}
 */
cassModel.updateCountColumns = function(table, counterColumns, counterValues, whereColumns, whereValues, callback) {
  if ((counterColumns.length != counterValues.length) ||
      (whereColumns.length != whereValues.length)) {
    callback(getErrorResObject('wrong parameters!'));
  }

  var strCmd = 'update ' + table + ' set ';
  for (var ii = 0; ii < counterColumns.length; ii++) {
    strCmd += counterColumns[ii] + ' = ' + counterColumns[ii]
        + ((counterValues[ii] >= 0) ? ' + ' : ' ') + counterValues[ii].toString();
    if (ii < counterColumns.length - 1) {
      strCmd += ', ';
    }
  }

  strCmd += getClauseString(whereColumns);

  if (logMergeCql) {
    console.log('mergeCql:' + cqlQmarkToValue(strCmd, whereValues));
  }

  cassandraClient.execute(strCmd, whereValues, {prepare: true}, function(error, result) {
    var res = getResObject(error);
    res.result = result; //could be commented out
    if (traceLog) {
      console.log('.updateCountColumns : ');
      console.log(res);
    }

    return callback(res);
  });
};

/**
 * updateCount
 * @param table
 * @param plus : true/false, +/- 1
 * @param whereColumns
 * @param whereValues
 * @param callback
 */
/* obsolete function, please don't use it */
/*
 cassModel.updateCount = function(table, plus, whereColumns, whereValues, callback) {
 var commandStr = "update " + table + " set count = count " + ((plus == true) ? "+" : "-")+ " 1 " + getClauseString(whereColumns);
 if (logMergeCql) {
 console.log("mergeCql:" + cqlQmarkToValue(commandStr, whereValues ));
 }
 cassandraClient.execute(commandStr, whereValues, {prepare: true}, function (error, result) {
 var res = getResObject(error);
 if (traceLog) {
 console.log("update res : ");
 console.log(res);
 }
 return callback(res);
 });
 };
 */

/* obsolete function, please don't use it */
/*
 cassModel.updateCountN = function(table, plus, count, whereColumns, whereValues, callback) {
 var commandStr = "update " + table + " set count = count " + ((plus == true) ? "+ " : "- ")+ count + getClauseString(whereColumns);
 if (logMergeCql) {
 console.log("mergeCql:" + cqlQmarkToValue(commandStr, whereValues ));
 }
 cassandraClient.execute(commandStr, whereValues, {prepare: true}, function (error, result) {
 var res = getResObject(error);
 if (traceLog) {
 console.log("update res : ");
 console.log(res);
 }
 return callback(res);
 });
 };
 */

cassModel.batchDeleteJ = function(table, setJson, whereJson) {
  getKeyValue(setJson, function(resSet) {
    getKeyValue(whereJson, function(resWhere) {
      return cassModel.batchUpdate(table, resSet.column, resSet.value, resWhere.column, resWhere.value);
    });
  });
};

cassModel.update = function(table, setColumns, setValues, whereColumns, whereValues, callback) {
  var commandStr = getUpdateString(table, setColumns, whereColumns);
  var mergeSet8WhereValues = setValues.concat(whereValues);
  if (logMergeCql) {
    console.log('mergeCql:' + cqlQmarkToValue(commandStr, mergeSet8WhereValues));
  }

  cassandraClient.execute(commandStr, mergeSet8WhereValues, {prepare: true}, function(error, result) {
    var res = getResObject(error);
    if (traceLog) {
      console.log('update res : ');
      console.log(res);
    }

    return callback(res);
  });
};

cassModel.update2 = function(table, setJson, whereColumns, whereValues, callback) {
  getKeyValue(setJson, function(resSet) {
    return cassModel.update(table, resSet.column, resSet.value, whereColumns, whereValues, callback);
  });
};

cassModel.updateJ = function(table, setJson, whereJson, callback) {
  getKeyValue(setJson, function(resSet) {
    getKeyValue(whereJson, function(resWhere) {
      return cassModel.update(table, resSet.column, resSet.value, resWhere.column, resWhere.value, callback);
    });
  });
};

/**
 * bacth
 * @param commands [command1, command2, ...] command結尾請加';'
 * @param callback
 */
cassModel.batch = function(queries, callback) {
  if (logMergeCql) {
    console.log('mergeCql batch:');
    for (var ii = 0; ii < queries.length; ii++) {
      console.log(cqlQmarkToValue(queries[ii].query, queries[ii].params));
    }
  }

  cassandraClient.batch(queries, {prepare: true}, function(error, result) {
    var res = getResObject(error);
    if (traceLog) {
      console.log('batch res ');
      console.log(res);
    }

    return callback(res);
  });
};

function select(table, selectFields, whereColumns, whereConditions, whereValues, extension, callback) {
  var commandStr = 'select ' + getFieldString(selectFields) + ' from ' + table + getCondClauseString(whereColumns, whereConditions) + extension;
  if (logMergeCql) {
    console.log('mergeCql:' + cqlQmarkToValue(commandStr, whereValues));
  }

  cassandraClient.execute(commandStr, whereValues, {prepare: true}, function(error, result) {
    var res = getResObject(error);

    if (result) {
      res.result = result;
    }

    if (traceLog) {
      console.log('select res ahc : ');
      console.log(res);
    }

    return callback(res);
  });
}

cassModel.selectA = function(table, selectFields, whereColumns, whereConditions, whereValues, callback) {
  return select(table, selectFields, whereColumns, whereConditions, whereValues, '', callback);
};

cassModel.selectE = function(table, selectFields, whereColumns, whereValues, extension, callback) {
  var conditions = [];

  for (var ii = 0; ii < whereColumns.length; ii++) {
    conditions.push(cassModel.Condition.EQ);
  }

  return select(table, selectFields, whereColumns, conditions, whereValues, extension, callback);
};

cassModel.select = function(table, selectFields, whereColumns, whereValues, callback) {
  var conditions = [];

  for (var ii = 0; ii < whereColumns.length; ii++) {
    conditions.push(cassModel.Condition.EQ);
  }

  return cassModel.selectA(table, selectFields, whereColumns, conditions, whereValues, callback);
};

cassModel.pageSelectA = function(rowCount, pageState, table, selectFields, whereColumns, whereConditions, whereValues, callback) {
  var result = {rows: [], pageState: '', next: true};
  var options = {prepare: 1, fetchSize: rowCount};

  if (pageState) {
    options.pageState = pageState;
  }

  var commandStr = 'select ' + getFieldString(selectFields) + ' from ' + table + getCondClauseString(whereColumns, whereConditions);
  if (logMergeCql) {
    console.log('mergeCql:' + cqlQmarkToValue(commandStr, whereValues));
  }

  cassandraClient.eachRow(commandStr, whereValues, options, function(n, row) {
    result.rows.push(row);
  },

        function(error, resp) {
          var res = getResObject(error);

          if (!error) {
            result.pageState = resp.pageState;
            if (result.rows.length < rowCount)
                result.next = false;
          }

          res.result = result;

          if (traceLog) {
            console.log('pageSelect res : ');
            console.log(res);
          }

          return callback(res);
        });
};

/**
 * 分頁查詢 次頁查詢 pageState請帶入上頁返回的值
 * @param rowCount
 * @param pageState
 * @param columns
 * @param values
 * @param callback
 */
cassModel.pageSelect = function(rowCount, pageState, table, selectFields, whereColumns, whereValues, callback) {
  var conditions = [];

  for (var ii = 0; ii < whereColumns.length; ii++) {
    conditions.push(cassModel.Condition.EQ);
  }

  return cassModel.pageSelectA(rowCount, pageState, table, selectFields, whereColumns, conditions, whereValues, callback);
};

/**
 * 執行command with param
 * return : err, result
 * @param command
 * @param callback
 */
cassModel.executeWithParam = function(command, param, callback) {
  if (logMergeCql) {
    console.log('mergeCql:' + cqlQmarkToValue(command, param));
  }

  cassandraClient.execute(command, param, {prepare: true}, function(error, result) {
    var res = getResObject(error);
    res.result = result;

    if (traceLog) {
      console.log('execute command : ' + command);
      console.log(res);
    }

    return callback(res);
  });
};

cassModel.genTimeUUid = function() {
  var timeId = cassandra.types.TimeUuid.now(); //new instance based on current date
  return timeId;
};

module.exports = cassModel;
