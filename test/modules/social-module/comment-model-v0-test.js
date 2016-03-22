'use strict';

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script(); //REF: https://github.com/hapijs/lab

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;
var commentModel = require('../../../modules/social-module/v0/comment-model-v0');
var _ = require('lodash');

describe('Comment Model V0 Test', function() {

  var groupId = '';
  var user = {Id: 'rayson'};
  var commentData = {
    auth_token: 'D23eVsJ2LbsFZb2cud6mqC/5KLDmmlWpa3HtU1Kv1KGrLU0y7vod8c1DVTUqSpD+ht+pesWFr99h683nRhAUCvbJFKZau9dmwr/2WqkPgGzFqwhhXcgAlEjs9gz7C8y+CjKFxlPvI2qbGCMKabcbc4x/8yKoLUl87HIpScG41swPOlfOPHGGidDtXIUiRwHR8w6L9cnOazQRsNZT4joxIfFttYbVfQyhaljCDFfI7gcancnYjZBwnu1bkIlgaPR0ptpGdtQ00QAahyqjyt+/oFLoDUkLixSHrzRRTyXgGinm2SDiVgWhNhc3Ebn0J83UPYJOOM5gzVEyLG3Flvxtvw==',
    post_id: '05d995c1-d1bb-11e4-bac4-01d7ba21bee5',
    comment: 'test comment lab',
  };

  it('getPostById should returns group id', {timeout: 5000}, function(done) {
    commentModel.internals.getPostById(commentData.post_id)
            .then(function(result) {
              expect(result.rows.length).to.be.above(-1);
              groupId = groupId;
              done();
            })
            .catch(function(err) {
              done(err);
            });
  });

  it('getGroupUsers should returns group member', function(done) {
    //hardcoded UUID, get it from group_member table
    commentModel.internals.getGroupUsers('eb7aae39-13fc-11e5-bc11-fe66bc440c0c')
            .then(function(result) {
              expect(result.rows.length).to.be.above(-1);
              done();
            })
            .catch(function(err) {
              done();
            });
  });

  it('filterUserIds', function(done) {
    var userIds = [
        {user_id: 1, name: 'user1'},
        {user_id: 4, name: 'user4'},
    ];
    var mentionedUserIds = '1,2,3,4,5,6,7,8';
    var expectedResult = [1, 4];
    var filteredUser = commentModel.internals.filterUserIds(userIds, mentionedUserIds);
    expect(filteredUser).to.be.deep.equal(expectedResult);
    done();
  });

  it('getUserData should returns username by user id', function(done) {
    var userIds = ['fb-956510307727150', 'fb-1121038751246065', 'fb-986292384822196'];
    commentModel.internals.getUserData(userIds)
            .then(function(result) {
              expect(result.rows.length).to.be.equal(3);
              done();
            })
            .catch(function(err) {
              done(err);
            });
  });

  it('buildObjectUser should returns user id as property and user name as value', function(done) {
    var userObject = [
        {user_id: 'userid1', username: 'username1'},
        {user_id: 'userid2', username: 'username2'},
        {user_id: 'userid3', username: 'username3'},
    ];
    var expectedResult = {
      userid1: 'username1',
      userid2: 'username2',
      userid3: 'username3',
    };
    var resultObj = commentModel.internals.buildObjectUser(userObject);
    expect(resultObj).to.be.deep.equal(expectedResult);
    done();
  });

  it('postComment  should returns comment id', function(done) {
    commentModel.postComment(user, commentData)
            .then(function(result) {
              commentData.id = result.comment.commentid;
              expect(result.comment.commentid).to.be.exist();
              done();
            })
            .catch(function(err) {
              done(err);
            });
  });

  it('postComment with mention user should returns mentionuserid', function(done) {
    var newComment = _.cloneDeep(commentData);
    newComment.mention_userids = 'seemo,yauri,joedev';
    commentModel.postComment(user, newComment)
            .then(function(result) {
              expect(result.comment.mentionuserid).to.be.exist();
              done();
            })
            .catch(function(err) {
              done(err);
            });
  });

  it('postComment with mention currency should returns mentioncur', function(done) {
    var newComment = _.cloneDeep(commentData);
    newComment.mention_currencies = 'AUD.USD, HKD.USD';
    commentModel.postComment(user, newComment)
            .then(function(result) {
              expect(result.comment.mentioncur).to.be.exist();
              done();
            })
            .catch(function(err) {
              done(err);
            });
  });

  it('postComment with mention currency should returns replyusername', function(done) {
    var newComment = _.cloneDeep(commentData);
    newComment.replyuserid = 'seemo';
    commentModel.postComment(user, newComment)
            .then(function(result) {
              expect(result.comment.replyusername).to.be.exist();
              done();
            })
            .catch(function(err) {
              done(err);
            });
  });

  it('like should increase users in comment', function(done) {
    commentModel.like('seemo', commentData.id)
            .then(function(result) {
              commentData.numLike = result.length;
              expect(result.length).to.be.above(0);
              done();
            })
            .catch(function(err) {
              done(err);
            });
  });

  it('getCommentLikeUsers should get users who like the comment', function(done) {
    commentModel.getCommentLikeUsers(commentData.id)
            .then(function(result) {
              expect(result.rows[0].user_id).to.be.equal('seemo');
              done();
            })
            .catch(function(err) {
              done();
            });
  });

  it('unlike should increase return users in comment', function(done) {
    commentModel.unlike('seemo', commentData.id)
            .then(function(result) {
              expect(result.length).to.be.equal(commentData.numLike - 1);
              done();
            })
            .catch(function(err) {
              done(err);
            });
  });

  it('getComment should returns post id', function(done) {
    commentModel.internals.getComment(commentData.id)
            .then(function(result) {
              commentData.publishTime = result.rows[0].publish_time;
              commentData.postId = result.rows[0].post_id;
              expect(result.rows[0].post_id).to.be.exist();
              done();
            })
            .catch(function(err) {
              done(err);
            });
  });

  it('deleteComment with wrong user id should returns invalid user', function(done) {
    commentModel.delete('wrongusername', commentData.id)
            .then(function(result) {
              done();
            })
            .catch(function(err) {
              expect(err).to.be.equal('WCM011');
              done();
            });
  });

  it('deleteComment with wrong comment id should returns invalid comment', function(done) {
    commentModel.delete(user.Id, '6b65d181-1xea')
            .then(function(result) {
              done();
            })
            .catch(function(err) {
              expect(err).to.be.exist();
              done();
            });
  });

  it('deleteComment should returns true', function(done) {
    commentModel.delete(user.Id, commentData.id)
            .then(function(result) {
              done();
            })
            .catch(function(err) {
              done(err);
            });
  });

});
