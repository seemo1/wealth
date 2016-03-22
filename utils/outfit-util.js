/**
 * @author Micah 2015-06-09
 */
'use strict';

var Lodash = require('lodash');
var Moment = require('moment');
var errcode = require('../config/define/errcode.js');
var logTags = ['info', 'outfitUtil'];
var logMeta = { module: 'outfitUtil'};
var logLevel = 'info';
var logger = require('./logger');

//var logger = { log: console.log};

var outfitUtil = {};
/**
 * 輸出最終結果及錯誤代碼 JSON
 * 預設輸出值 { meta: { code:400, error_code:"WUU001", error_msg:"unknown error."} }
 *
 * 用法3類: 1個參數是錯誤; 2個參數是成功（null, result); 4個參數或以上是客製訊息（null,status,errorCode,errorMsg,..)
 *
 *   1. 錯誤：第1 個參數不為null時
 *      a. 參數為字串時：
 *         字串長度為6 且有 errocde["參數1"]: ex, func("WUU001") : 取出errcode的內容 out.meta = errocde["WUU001"]
 *         其它字串則輸出為 error_msg：ex, func("something wrong"):  out.meta.error_msg = "something wrong", code=400
 *      b. 參數為其他物件則合併物件 errcode["WUU001"]
 *      c. 如果有第二個參數時，合併物件
 *
 *   2. 成功: 只傳入2個參數，且第1個參數為null; func(null, result)
 *      a. result是字串則輸出為 error_msg：ex, func(null, "action done"):  out.meta.error_msg = "action done", code=200
 *      b. 參數為其他物件則合併物件 errcode["WUU200"]
 *
 *   3. 客製輸出：4個參數或以上 func(null, status, errorCode, errorMsg, mergeObj1, mergeObj2..)
 *      out.meta = { "code": statusOrResult, "error_code": errorCode, "error_msg": errorMsg };
 *      out會合併其他物件 mergeObj1, mergeObj2
 *
 * format the output for errcode and merge objects if necessary.
 * @param objError {Object or String} -- Error if not null
 * @param statusOrResult {number or object} -- (arguments.length > 3) ? status : "result object"
 * @param errorCode {string}
 * @param errorMsg {string}
 * @param ..more {json} : more objects to be merged
 * @returns {json}
 *
 */
outfitUtil.endResult = function(objError, statusOrResult, errorCode, errorMsg) {
  //load the default unknown error
  var joOutput = {};
  joOutput.meta = Lodash.cloneDeep(Lodash.get(errcode, 'WUU001', {
    code: 400,
    error_code: 'WUU001',
    error_msg: 'unknown error.',
  }));

  //第一個參數不為 null
  if (objError) {
    //error output
    if (Lodash.isString(objError)) {
      if ((objError.length == 6) && Lodash.has(errcode, objError)) {
        //get standard output from errcode
        joOutput.meta = Lodash.cloneDeep(Lodash.get(errcode, objError));
      } else {
        joOutput.meta.error_msg = objError;
      }
    } else {
      Lodash.merge(joOutput, objError);
    }

    //合併第二個參數
    if (statusOrResult) {
      Lodash.merge(joOutput, statusOrResult);
    }

  } else if (arguments.length === 2) {
    //success output
    joOutput.meta = Lodash.cloneDeep(Lodash.get(errcode, 'WUU200', {
      code: 200,
      error_code: 'WUU200',
      error_msg: '',
    }));
    if (Lodash.isString(statusOrResult)) {
      joOutput.meta.error_msg = statusOrResult;
    } else {
      Lodash.merge(joOutput, statusOrResult);
    }
  } else if (arguments.length > 3) {
    //customized output
    joOutput.meta = {code: statusOrResult, error_code: errorCode, error_msg: errorMsg};

    //merge multiple objects
    if (arguments.length > 4) {
      for (var ii = 4; ii < arguments.length; ii++) {
        Lodash.merge(joOutput, arguments[ii]);
      }
    }
  }

  return joOutput;
};

/*
//test and usage demo
var hapiResult =
{
    "error": "Bad Request",
    "message": "the length of name must be less than or equal to 10 characters long",
    "statusCode": 400,
    "validation": {
        "keys": [
            "name"
        ],
        "source": "params"
    }
}
var votingResult = {"voting": {"symbol": "USDRMB.FX", "votes":0, "myvote": "none", "bearish":0, "bullish":0 }  }; 

logger.log(' === objError is string ===', outfitUtil.endResult("invalid input"));
logger.log(' === objError is errcode ===', outfitUtil.endResult("WAT001"));
logger.log(' === objError is object ===', outfitUtil.endResult(hapiResult));
logger.log(' === success output with string ===', outfitUtil.endResult(null, "voting is finish.(same existing vote)"));
logger.log(' === success output with object ===', outfitUtil.endResult(null, votingResult));
logger.log(' === customized output ===', outfitUtil.endResult(null, 400, "WSV001","invalid input parameters"));
joMyOut = {"SymbolVotes": { "error_msg": "invalid input parameters." } };
logger.log(' === customized output with object === ', outfitUtil.endResult(null, 400, "WSV001","invalid input parameters", joMyOut));
logger.log(' === customized with literal object ===' , outfitUtil.endResult(null, 400, "WSV002", "wrong voting type",
                    {"SymbolVotes":{"error_msg": "wrong voting type"} } ) );
         
logger.log(' === customized with multiple merge ===' , outfitUtil.endResult(null, 400, "WSV002", "wrong voting type", hapiResult,
                    {"SymbolVotes":{"error_msg": "wrong voting type"} } ) );
*/

function isEmptyButNotZero(dataValue) {
  if ((dataValue === null) || (typeof dataValue === 'undefined') || (dataValue === '')) {
    return true;
  }

  return false;
}

function valueToType(dataValue, dataType) {
  var retValue;

  //0 is false, do not use if (dataValue)
  //javascript switch case only take one parameter, no case 'i','f':
  switch (dataType) {
    case 'a':

      //as original data
      retValue = dataValue;
      break;
    case 'i':
    case 'f':

      //integer, float
      retValue = (!(dataValue) || isNaN(Number(dataValue))) ? new Number(0) : new Number(dataValue);
      console.log(retValue);
      break;
    case 'n':

      //number to string
      if (dataValue && Lodash.has(retValue, 'toString') && (typeof retValue.toString === 'function')) {
        retValue = retValue.toString();
      } else {
        retValue = dataValue;
      }

      break;
    case 't':

      //timestamp
      //console.log('typeof ' + dataValue + ' =' + (typeof dataValue));
      //console.log('instanceof Date, ' + dataValue + ' =' + (dataValue instanceof Date));
      //all convert to string, for android ???
      if (!(dataValue)) {
        retValue = '';
      } else if (dataValue instanceof Date) {
        retValue = new String(dataValue.valueOf());
      } else if (Lodash.has(dataValue, 'getTime') && (typeof dataValue.getTime === 'function')) {
        retValue = new String(dataValue.getTime());
      } else if (Lodash.isNumber(dataValue)) {
        retValue = new String(parseInt(dataValue));
      } else if (Moment(dataValue).isValid()) {
        retValue = new String(Moment(dataValue).valueOf());
      } else {
        retValue = dataValue;
      }

      //if (Lodash.has(retValue, 'toString') && (typeof retValue.toString === 'function') ) {
      //    retValue = retValue.toString();
      //}
      break;
    default:
    case 's':

      //string
      //logger.log("  --string , key=", key," value=", joData[ format.db ]);
      if (isEmptyButNotZero(dataValue)) {
        retValue = '';
      } else if (Lodash.has(dataValue, 'toString') && (typeof dataValue.toString === 'function')) {
        console.log('it has toString', dataValue);
        retValue = dataValue.toString();
      } else {
        retValue = dataValue;
      }

      break;
  }; //end switch(format.t)

  return retValue;
}

/**
 * 以輸出結果的格式定義，將資料庫記錄轉出，參考下方使用範例
 * @param joData {json object} 資料庫記錄 row
 * @param joTargetFormat {json object} 格式定義 { field: {t: 'type', k: 'key', o: 'option', f: 'function'}, field2: ..}
 *  t: type, convert data to type: string, int, float, timestamp, date, numberToString, a(as data)
 *  k: key mapping in joData[key]
 *  o: option :=
 *      do output field: h=hidden if joData has no key(property); e=empty if Data[key]===['',null,undefined]
 *  f: function
 *  c: constant
 */
outfitUtil.convertFormat = function(joData, joTargetFormat) {
  var joBack = {};

  //logger.log(logTags, "convertFormat, joData=", joData);
  Lodash.forOwn(joTargetFormat, function(format, field) {
    //console.log("-------field=", field, 'format=', format);
    //field name mapping
    //0 is false, do not use if (joData [ format.k ])
    //javascript switch case only take one parameter
    var tmpValue;
    var finalType = format.t || 's'; //type is required, default is 's'

    //if format.k defined, process joData[key]
    if (Lodash.has(format, 'k')) {
      if (Lodash.has(joData, format.k)) {
        //joData[ key ] exists
        tmpValue = valueToType(joData[format.k], finalType);
        if (field == 'username') {
          tmpValue = valueToType(joData.username, 's');
          if (tmpValue == '') {
            tmpValue = valueToType(joData[format.k], finalType);
          }
        }

        if (isEmptyButNotZero(tmpValue) && Lodash.has(format, 'o') && (format.o === 'e')) {
          return; //do not output the field
        }

        joBack[ field ] = tmpValue;
        return;
      } else if (Lodash.has(format, 'o') && format.o === 'h') {
        //hidden field, joData has no such key. Just return and don't output
        return;
      }
    }; //end if (Lodash.has(format, 'k'))

    //constant value
    if (Lodash.has(format, 'c')) {
      joBack[field] = format.c;
      return;
    }

    //use function=format.f to convert
    if (Lodash.has(format, 'f') && (typeof format.f === 'function')) {
      tmpValue = valueToType(format.f(joData), finalType);

      //if(field=='mentionuseridarray' || field=='mentionuserid'){
      //    if(tmpValue.length > 0 ){
      //        var tmpValue2 = [];
      //        Lodash.each(tmpValue,function(value){
      //            var valueTmp = value.split(":");
      //            tmpValue2.push(valueTmp[0]);
      //        });
      //        tmpValue = tmpValue2;
      //    }
      //}
      if (isEmptyButNotZero(tmpValue) && Lodash.has(format, 'o') && (format.o === 'e')) {
        return; //do not output the field
      }

      joBack[ field ] = tmpValue;
      return;
    }

    //no value to process, check if need to suppress output field
    if (Lodash.has(format, 'o') &&
        ((format.o === 'h') || format.o === 'e')) {
      //option = hidden or empty. Just return and don't output
      return;
    }

    //default value
    switch (format.t) {
      case 'i':
      case 'f':
        joBack[field] = new Number(0);
        break;
      case 'n':
        joBack[field] = '0';
        break;
      default:
      case 's':
      case 't':
      case 'a':
        joBack[field] = '';
        break;
    }; //end switch(format.t)   
  }); //end Lodash.forOwn(postController.postFormat0...

  return joBack;
};
/*
useage example
// t: type: string, int, float, timestamp, date
// k: key mapping;
// f: function
// c: constant
postFormat0 = {
    status:             {t: "s", k: "status" },
    img_size:           {t: "s", k: "img_size" },
    lastupdatetime:     {t: "s", k: "last_update_time" },
    userid:             {t: "s", k: "user_id" },
    postid:             {t: "s", k: "post_id" },
    publishtimegmt:     {t: "t", f: function(joData) { return joData.publish_time } },
    publishtime:        {t: "s", k: "publish_time" },
    servingUrl:         {t: "s", k: "img_url" },
    lastupdatetimegmt:  {t: "s", k: "last_update_time_gmt" },

    numRepost:          {t: "i", k: "repost_count" },
    numShare:           {t: "i", k: "share_count" },
    numComment:         {t: "i", k: "comment_count" },
    numLike:            {t: "f", k: "like_count" },
    msg:                {t: "s", k: "msg" },
    img_Bolbkey:        {t: "s", c: "" },
    groupid:            {t: "s", k: "group_id" },
    osservingUrl:       {t: "s", c: ""  },
}
var postData = {post_id: "abcde", msg: "anymsg", repost_count: 23, like_count: "2.6" , publish_time: Date.now() };
logger.log(convertFormat(postData, postFormat0 ));
*/
outfitUtil.dumpError = function(err) {
  if (typeof err === 'object') {
    if (err.message) {
      console.log('\nMessage: ' + err.message);
    };

    if (err.stack) {
      console.log('\nStacktrace:');
      console.log('====================');
      console.log(err.stack);
    };
  } else {
    console.log(err);
  };
};

outfitUtil.ifErrorDumpDo = function(err, callback) {
  if (!err) {
    return;
  }

  outfitUtil.dumpError(err);
  if (callback && (typeof callback === 'function')) {
    return callback(err);
  }

};

module.exports = outfitUtil;

