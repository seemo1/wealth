'use strict';
const Boom = require('../commonlib/boom');
const moment = require('moment');
const Logger = require('../commonlib/logger');
const logTag = '[Canned-images-Model]';
const Fs = require('fs');
const Path = require('path');
const Uuid = require('node-uuid');
const Sharp = require('sharp');
const Config = require('config');

class CannedImagesModel {

  constructor() {
  }

  //查詢圖片素材
  getCannedImage(offset, hits) {
    // get total record count
    let sqlScripts = [
      {
        sql: "SELECT SQL_CALC_FOUND_ROWS seqno, serving_url, comment, unix_timestamp(publish_time) as publish_time, unix_timestamp(update_time) as update_time " +
        "FROM canned_images WHERE del_flag = 0 limit :offset , :hits" ,
        params: {
          offset: offset,
          hits: hits,
        },
      },

      {
        sql: "SELECT FOUND_ROWS() as data_length",
        params: {},
      },
    ];
    let result = {};
    return new Promise(function(resolve, reject) {
      MySqlConn.multipleQuery(logTag, sqlScripts)
        .then(function(res) {
          result.data = res[0];
          result.length = res[1][0].data_length;
          resolve(result);
        })
        .catch(function(err) {
          Logger.error(logTag, err);
          reject(err);
        });
    });
  }

  //儲存上傳的圖片
  storeFile(fileBuffer) {
    return new Promise(function(resolve, reject) {
      Sharp(fileBuffer._data)
        .metadata()
        .then(function(metadata) {
          let pathRoot = global.PROJECT_ROOT || Path.join(__dirname, '../public/img/');
          let filename = Uuid.v1() + '.' + metadata.format;
          let path = pathRoot + filename;
          let img_url = Config.get('Domain') + 'img/' + filename;
          
          Fs.writeFile(path, fileBuffer._data, 'binary', function(err) {
            if (err) {
              Logger.error(logTag, err);
              return reject(err)
            }else {
              return resolve(img_url);
            }
          })
        })
        .catch(function(err) {
          Logger.error(logTag, err);
          reject(err);
        });
    })
  }

  //移除上傳的圖片(update logic)
  removeFile(serving_url) {
    return new Promise(function(resolve, reject) {
      let filename = serving_url.split('/').pop();
      Fs.unlink(__dirname + '/../public/img/' + filename,function(err) {
          if (err) {
            Logger.error(logTag, err);
            reject('no such file.');
          }else {
            resolve()
          }
        });
    });
  }

  //更名上傳的圖片(del logic)
  renameFile(serving_url) {
    return new Promise(function(resolve, reject) {
      let path = __dirname + '/../public/img/';
      let oldFilePath = path + serving_url.split('/').pop();
      let newFilePath = path + 'wrf_' + serving_url.split('/').pop();
      Fs.rename(oldFilePath, newFilePath, function(err) {
        if (err) {
          Logger.error(logTag, err);
          reject('no such file.');
        }else {
          resolve()
        }
      });
    });
  }

  //新增圖片素材
  addCannedImage(image,comment) {
    let that = this;
    return new Promise(function(resolve, reject) {
      that.storeFile(image)
        .then(function(serving_url) {
          let sql = "INSERT INTO `canned_images`(`serving_url`,`comment`,`publish_time`,`update_time`)" +
            "VALUES(:serving_url, :comment, now(), now())" ;

          let params = {
            serving_url: serving_url,
            comment: comment,
          };

          return new Promise(function(resolve, reject) {
            MySqlConn.query(logTag, sql, params)
              .then(function(res) {
                return resolve(res);
              })
              .catch(function(err) {
                Logger.error(logTag, err);
                reject(err);
              })
          });
        })
        .then(function(res) {
          return that.getCannedImageById(res.insertId);
        })
        .then(function(res) {
          return resolve(res[0]);
        })
        .catch(function(err) {
          Logger.error(logTag, err);
          reject(err);
        });
    });
  }

  //刪除圖片素材
  delCannedImage(seqno) {
    let that = this;
    return new Promise(function(resolve, reject) {
      that.getCannedImageById(seqno)
        .then(function(res) {
          if (res.length === 0) {
            return reject('no such data.');
          }else {
            let sql = "UPDATE `canned_images` SET `del_flag` = 1 WHERE `seqno` = :seqno";
            let params = {
            seqno: seqno,
          };
            //async remove file
            that.renameFile(res[0].serving_url);

            return new Promise(function(resolve, reject) {
            MySqlConn.query(logTag, sql, params)
              .then(function(res) {
                let result = {seqno: seqno};
                resolve(result);
              })
              .catch(function(err) {
                Logger.error(logTag, err);
                reject(err);
              });
          });
          }
        })
        .then(function(res) {
          return resolve(res);
        })
        .catch(function(err) {
          Logger.error(logTag, err);
          reject(err);
        });

    })
  }

  //更新圖片素材
  updateCannedImage(seqno, image, comment) {
    let that = this;
    return new Promise(function(resolve, reject) {
      that.getCannedImageById(seqno)
        .then(function(res) {
          if (res.length === 0) {
            return reject('no such data.');
          }else {
            if (image === undefined) {
              return Promise.resolve();
            } else {
              //非同步處理
              that.removeFile(res[0].serving_url);
              return that.storeFile(image);
            }
          }
        })
        .then(function(serving_url) {
          let field = '';

          if (serving_url) {
            field = '`serving_url` = :serving_url,';
          }

          let sql = "UPDATE `canned_images` SET " +
            field +
            " `comment` = :comment, `update_time` = now() " +
            "WHERE `seqno` = :seqno and del_flag = 0";

          let params = {
            seqno: seqno,
            serving_url: serving_url,
            comment: comment,
          };
          return MySqlConn.query(logTag, sql, params);
        })
        .then(function() {
          return that.getCannedImageById(seqno);
        })
        .then(function(res) {
          return resolve(res[0]);
        })
        .catch(function(err) {
          Logger.error(logTag, err);
          reject(err);
        });
    });
  }

  //查詢圖片素材
  getCannedImageById(seqno) {
    let sql = "SELECT seqno, serving_url, comment, unix_timestamp(publish_time) as publish_time, unix_timestamp(update_time) as update_time " +
      "FROM canned_images WHERE seqno = :seqno and del_flag = 0 " ;

    let params = {
      seqno: seqno,
    };

    return new Promise(function(resolve, reject) {
      MySqlConn.query(logTag, sql, params)
        .then(function(res) {
          return resolve(res);
        })
        .catch(function(err) {
          Logger.error(logTag, err);
          reject(err);
        });
    });
  };

}

module.exports = CannedImagesModel;
