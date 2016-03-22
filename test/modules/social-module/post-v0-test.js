/**
 * Created by Micah on 2015/06/08
 * node_modules/lab/bin/lab test/modules/social-module/post-v0-test.js -m 0 -e localcass -g makePost
 *  -e : check the config/xxxxx.json for require('config')
 * check the process.env["NODE_ENV"] in modules or the -e won't work
 */
'use strict';

//process.env["NODE_ENV"] = "localcass";

var Lodash = require('lodash');

var Code = require('code');
var expect = Code.expect;

var Lab = require('lab');
var lab = exports.lab = Lab.script();
var it = lab.it;
var before = lab.before;
var describe = lab.describe;

var outfitUtil = require('../../../utils/outfit-util');
var postTry = require('./post-v0-try');
var postModel = require('../../../modules/social-module/v0/post-model-v0');

function dumpResult(result) {
  if (Lodash.has(result, 'rows') && (result.rows.length > 0)) {
    result.rows.forEach(function(row) {
      console.log(row);
    });
  } else if (Array.isArray(result)) {
    //might be Promise.inspect
    result.forEach(function(item) {
      if (Lodash.has(item, 'value')) {
        console.log(item.value()); //promise.value()
      } else {
        console.log(item);
      };
    });
  } else {
    console.log(result);
  };
}

describe('post', function() {

  it('fetchInTo1Column', function(done) {
    postTry.fetchInTo1Column()
            .then(function(result) {
              dumpResult(result);
              return done();
            })
            .catch(function(err) {
              outfitUtil.dumpError(err);
              return done();
            });
  });

  it('deleteRelatives', function(done) {
    postTry.deleteRelatives()
            .then(function(result) {
              dumpResult(result);
              return done();
            })
            .catch(function(err) {
              outfitUtil.dumpError(err);
              return done();
            });
  });

  it('selectThenDelete', function(done) {
    postTry.selectThenDelete()
            .then(function(result) {
              dumpResult(result);
              return done();
            })
            .catch(function(err) {
              outfitUtil.dumpError(err);
              return done();
            });
  });

  it('getTablePK', function(done) {
    postTry.getTablePK('post_user_feed')
            .then(function(result) {
              dumpResult(result);
              done();
            })
            .catch(function(err) {
              outfitUtil.dumpError(err);
              done();
            });
  });

  it('tableMetadata', function(done) {
    postTry.tableMetadata('post_user_wall')
            .then(function(result) {
              dumpResult(result);
              done();
            })
            .catch(function(err) {
              outfitUtil.dumpError(err);
              done();
            });
  });

  it('insertSystemFeed', function(done) {
    postTry.insertSystemFeed()
            .then(function(result) {
              dumpResult(result);
              done();
            })
            .catch(function(err) {
              outfitUtil.dumpError(err);
              done();
            });
  });

  it('getUserDataToJo', function(done) {
    postModel.getUserDataToJo('fxmtw001')
            .then(function(result) {
              dumpResult(result);
              done();
            })
            .catch(function(err) {
              outfitUtil.dumpError(err);
              done();
            });
  });

  it('getIdMapRow', function(done) {
    postTry.getIdMapRow()
            .then(function(result) {
              dumpResult(result);
              done();
            })
            .catch(function(err) {
              outfitUtil.dumpError(err);
              done();
            });
  });

  it('getPostFromPostUserFeedByUserId', function(done) {
    postModel.getPostFromPostUserFeedByUserId({user_id:'alan'})
            .then(function(result) {
              dumpResult(result);
              done();
            })
            .catch(function(err) {
              outfitUtil.dumpError(err);
              done();
            });
  });

  it('postModelGetFollower', function(done) {
    postTry.postModelGetFollower()
            .then(function(result) {
              dumpResult(result);
              done();
            })
            .catch(function(err) {
              outfitUtil.dumpError(err);
              done();
            });
  });

  it('getFollower', function(done) {
    postTry.getFollower(done);
  });

  it('get1ColumnArrayBy1', function(done) {
    postTry.get1ColumnArrayBy1()
            .then(function(result) {
              dumpResult(result);
              done();
            })
            .catch(function(err) {
              outfitUtil.dumpError(err);
              done();
            });
  });

  it('get1ColumnArray', function(done) {
    postTry.get1ColumnArray()
            .then(function(result) {
              dumpResult(result);
              done();
            })
            .catch(function(err) {
              outfitUtil.dumpError(err);
            });
  });

  it('uuid8timeUuid', function(done) {
    postTry.uuid8timeUuid();
    done();
  });

  it('getGroupMember', function(done) {
    postTry.getGroupMember()
            .then(function(result) {
              dumpResult(result);
              done();
            })
            .catch(function(err) {
              outfitUtil.dumpError(err);
            });
  });

  it('deletePost', function(done) {
    postTry.deletePost()
            .then(function(result) {
              //return Promise.inspect
              if (Array.isArray(result)) {
                result.forEach(function(item) {
                  console.log(item.value()); //promise.value()
                });
              } else {
                console.log('result=', result);
              }

              done();
            })
            .catch(function(err) {
              console.log('err=', err);
              done();
            });
  });

  it('searchPost', function(done) {
    postTry.searchPost()
            .then(function(result) {
              //return Promise.inspect
              if (Array.isArray(result)) {
                result.forEach(function(item) {
                  console.log(item.value()); //promise.value()
                });
              } else {
                console.log('result=', result);
              }

              done();
            })
            .catch(function(err) {
              console.log('err=', err);
              done();
            });
  });

  it('getPostComments', function(done) {
    postTry.getPostComments()
            .then(function(result) {
              //return Promise.inspect
              if (Array.isArray(result)) {
                result.forEach(function(item) {
                  console.log(item.value()); //promise.value()
                });
              } else {
                console.log('result=', result);
              }

              done();
            })
            .catch(function(err) {
              console.log('err=', err);
              done();
            });
  });

  it('makeRepost', function(done) {
    postTry.makeRepost()
            .then(function(result) {
              //return Promise.inspect
              if (Array.isArray(result)) {
                result.forEach(function(item) {
                  console.log(item.value()); //promise.value()
                });
              } else {
                console.log('result=', result);
              }

              done();
            })
            .catch(function(err) {
              console.log('err=', err);
              done();
            });
  });

  it('makePost', function(done) {
    postTry.makePost()
            .then(function(result) {
              //return Promise.inspect
              if (Array.isArray(result)) {
                result.forEach(function(item) {
                  console.log(item.value()); //promise.value()
                });
              } else {
                console.log('result=', result);
              }

              done();
            })
            .catch(function(err) {
              console.log('err=', err);
              done();
            });
  });

  it('insPostUserFeed', function(done) {
    postTry.insPostUserFeed()
            .then(function(result) {
              console.log('result=', result);
              done();
            })
            .catch(function(err) {
              console.log('err=', err);
              done();
            });
  });
});
