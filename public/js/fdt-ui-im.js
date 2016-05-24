'use strict';

  (function(window) {
  window.fdt = window.fdt || {};
  window.fdt.ui = window.fdt.ui || {};
  window.fdt.ui.im = window.fdt.ui.im || {};
  var console = fdt.console;

  var Friend = (function (_super) {
    fdt.__extends(Friend, _super);
    function Friend(newState) {
      var that = this;
      var defState = {
        index   : 0,
        nick    : '',
        account : '',
        states  : [],
      };
      that.TAG = '[fdt.im.Friend]';
      that.template = undefined;
      that.state = $.extend({}, defState, newState);
      $('body').templateLoad('im-friend-template')
      .then(function(temp){
        that.template = temp;
      });
    }

    Friend.prototype.render = function() {
      var that = this;
      console.log(that.TAG, that.state);
      that.template.attr('index', that.state.index);
      var name = (!that.state.nick || that.state.nick === '') ? that.state.account : that.state.nick;
      that.template.find('.im-friend-name').html(name);

      that.template.find('.im-friend-state').addClass('hide');
      if (that.state.states && $.isArray(that.state.states)) {
        that.state.states.forEach(function(element, index, array){
          if (!element.count || element.count <= 0) {
            return;
          }
          var up = undefined;
          var msg = '';
          if (element.type === 'message') {
            up = that.template.find('.im-friend-state-red');
            msg = '消息 ';
          }
          else {
            up = that.template.find('.im-friend-state-blue');
            msg = '交易 '
          }
          up.html(msg + element.count);
          up.removeClass('hide');
        })
      }
      return that.template;
    };
    return Friend;
  }(fdt.ui.View));

  var FriendList = (function (_super) {
    fdt.__extends(FriendList, _super);
    function FriendList(selector, newState) {
      var that = this;
      that.selector = $(selector);
      _super.call(that, Friend, newState);
      that.TAG = '[fdt.im.FriendList]';
      $('body').templateLoad('im-friend-list-template', fdt.config.templateUrl + '/im/friend-list.html')
      .then(function(temp){
        that.template = temp;
        that.selector.html(that.template);
      });
    }

    FriendList.prototype.onClickFriend = function(callback) {
      var that = this;
      that.selector.on('click','.im-friend', function(event){
        that.selector.find('.im-friend-list').find('.active').removeClass('active');
        var user = that.lists[$(this).attr('index')];
        user.get().addClass('active');
        console.log(user);
        callback.call(that, user, that);
      })
    };

    return FriendList;
  }(fdt.ui.ListView));

  var Message = (function (_super) {
    fdt.__extends(Message, _super);
    function Message(newState) {
      var that = this;
      var defState = {
        flow     : '',
        from     : '',
        fromNick : '',
        to       : '',
        type     : '',
        text     : '',
        file     : undefined,
        time     : 0,
        userUpdateTime : 0,
      };
      that.TAG = '[fdt.im.Message]';
      that.state = $.extend({}, defState, newState);
      that.template = undefined;
      $('body').templateLoad('im-message-template')
      .then(function(temp){
        that.template = temp;

      });
    }

    Message.prototype.render = function() {
      var that = this;
      console.log(that.TAG, that.state);
      that.template.find('.im-message-time').html(moment(that.state.time).format('A hh:mm'));
      var css = '';
      if (that.state.flow === 'in') {
        css = 'im-message-in';
      }
      else {
        css = 'im-message-out'
      }
      that.template.attr('class', 'im-message ' + css);
      switch (that.state.type) {
        case 'file' :
          var file =  $(document.createElement('a'));
          var filename = fdt.htmlEscape(that.state.file.name);
          file.html(filename);
          if (that.state.file.url) {
            file.attr('href', that.state.file.url + '?download=' + filename);
            file.attr('download', filename);
            file.attr('target', '_blank');
          }
          that.template.find('.im-message-text').html(file);
          break;
        case 'image':
          var filename = fdt.htmlEscape(that.state.file.name);
          var a = $(document.createElement('a'));
          a.attr('href', that.state.file.url + '?download=' + filename);
          a.attr('download', filename);
          a.attr('target', '_blank');
          var img = $(document.createElement('img'));
          img.addClass('im-message-image');
          img.attr('src', that.state.file.url);
          a.append(img);
          that.template.find('.im-message-text').html(a);
          break;
        //message
        default:
          //that.template.find('.im-message-text').html(fdt.nl2br(that.state.text));
          that.template.find('.im-message-text').html(fdt.nl2br(Autolinker.link(fdt.htmlEscape(that.state.text), {stripPrefix: false})));
      }
      // 上傳時的 progress bar
      if (that.state.file && that.state.file.percentage && that.state.file.percentage < 100) {
        var progress = $($('#im-progress-template').html());
        progress.find('.im-progress-bar').css('width', that.state.file.percentage + "%");
        that.template.find('.im-message-text').append(progress);
      }
      return that.template;
    };

    return Message;
  }(fdt.ui.View));

  var MessageList = (function (_super) {
    fdt.__extends(MessageList, _super);
    function MessageList(selector, newState) {
      var that = this;
      that.selector = $(selector);
      _super.call(that, Message, newState);
      that.TAG = '[fdt.im.MessageList]';
      $('body').templateLoad('im-message-list-template')
      .then(function(temp){
        that.template = temp;
        that.selector.html(that.template);
      });
    }
    MessageList.prototype.render = function() {
      var that = this;
      console.log(that.TAG, that.state);
      var preFlow = '';
      that.state.forEach(function(element, index, array){
        var instance = that.lists[index];
        element.index = index;
        if (!instance) {
          var item = new that.Item(element);
          that.lists.push(item);
          that.template.append(item.render());
          instance = item;
        }
        else {
          instance.setState(element);
        }
        if (preFlow != element.flow) {
          instance.get().addClass('im-message-first');
          instance.get().prev().addClass('im-message-last');
        }
        preFlow = element.flow;
      })

      if (that.lists.length > that.state.length) {
        var dels = that.lists.splice(that.state.length);
        if($.isArray(dels) > 0) {
          dels.forEach(function(element, index, array){
            element.remove();
          });
        }
      }
      return that.template;
    };
    return MessageList;
  }(fdt.ui.ListView));

  var Session = (function (_super) {
    fdt.__extends(Session, _super);
    function Session(selector, newState) {
      var that = this;
      var defState = {
          myInfo   : {},
          currUser : {},
          users    : [],
          friends  : [],
          msgs     : {}
      };
      that.selector = $(selector);
      that.TAG = '[fdt.im.Session]';
      that.template = undefined;
      that.state = $.extend({}, defState, newState);
      that._onCannedImageSelector = undefined;
      that._onFileSelector = undefined;
      $('body').templateLoad('im-session-template', fdt.config.templateUrl + '/im/session.html')
      .then(function(temp){
        that.template = temp;
        that.selector.html(that.template);
        that.messageList = new MessageList('.im-message-block');
        if(typeof that._onFileSelector === 'function') {
          that.selector.find('#im-btn-file').fileInput({
            multiple : false,
            onchange : function(fileInput) {
              that._onFileSelector.call(that, fileInput, that);
            }
          });
        }
        _registerEvent.call(that);
      });

      function _registerEvent() {
        var _session = this;
        // 文字
        var cText = new CannedTextList();
        var modalText = fdt.modal({
          id    : 'text-modal',
          title : '選擇文字素材',
          body  : cText.render(),
          footer: '<button type="button" class="btn btn-default" id="modal-close" data-dismiss="modal">關閉</button>',
          show  : false
        });

        cText.onClickItem(function(item){
          var post = that.template.find('.im-post-message');
          post.val(post.val() + item.getState().message);
          modalText.modal('hide');
        });

        that.template.find('#im-btn-canned-text').on('click', function(e) {
          modalText.modal('show');
        });

        //圖片
        var cImage = new CannedImageList();
        var modalImage = fdt.modal({
          id    : 'image-modal',
          title : '選擇圖片素材',
          body  : cImage.render(),
          footer: '<button type="button" class="btn btn-default" id="modal-close" data-dismiss="modal">關閉</button>',
          show  : false
        });
        cImage.onClickItem(function(item){
          if(typeof _session._onCannedImageSelector === 'function') {
            _session._onCannedImageSelector.call(that, item, modalImage, that);
          }
        });
        that.template.find('#im-btn-canned-image').on('click', function(e) {
          modalImage.modal('show');
        });
      }
    }
    Session.prototype.onCannedImageSelector = function(callback){
      this._onCannedImageSelector = callback;
    }
    Session.prototype.onSendMsg = function (callback) {
      var that = this;
      that.selector.on('submit', "#im-form-post" , function(e) {
        e.preventDefault();
        callback.call(that, that.template.find('.im-post-message').val(), that);
      });
      that.selector.on('keydown', '.im-post-message', function(e) {
        if (e.altKey && e.keyCode === 13) {
          e.preventDefault();
          callback.call(that, that.template.find('.im-post-message').val(), that);
          return;
        }
      })
    };

    Session.prototype.onFileSelector = function(callback) {
      this._onFileSelector = callback;
    };

    Session.prototype.render = function() {
      var that = this;
      console.log(that.TAG, that.state);
      var name = (!that.state.currUser.nick || that.state.currUser.nick === '') ? that.state.currUser.account : that.state.currUser.nick;
      if (that.template.find('.im-session-header-name').html() != name) {
        that.template.find('.im-session-header-name').html(name);
      }
      var avatar = that.state.currUser.avatar || '/css/img/icon_user_default.png';
      if (that.template.find('.im-header-user-avatar').attr('src') != avatar) {
        that.template.find('.im-header-user-avatar').attr('src', avatar);
      }
      that.messageList.setState(that.state.msgs[that.state.currUser.sessionId]);
      // that.template.find('.im-message-block').animate({ scrollTop: that.template.find('.im-message-list').height() }, "fast");
      // that.template.find('.im-message .im-message-image').last().on('load', function() {
      //   that.template.find('.im-message-block').animate({ scrollTop: that.template.find('.im-message-list').height() }, "fast");
      // });
    };
    return Session;
  }(fdt.ui.View));


  var CannedText = (function (_super) {
    fdt.__extends(CannedText, _super);
    function CannedText(newState) {
      var that = this;
      var defState = {
        index   : 0,
        message : ''
      };
      that.TAG = '[fdt.im.CannedText]';
      that.template = undefined;
      that.state = $.extend({}, defState, newState);
      $('body').templateLoad('im-canned-text-template')
      .then(function(temp){
        var parent = temp;
        that.template = $(parent.find('#im-canned-text-item-template').html());
      });
    }

    CannedText.prototype.render = function() {
      var that = this;
      that.template.attr('index', that.state.index);
      that.template.html(that.state.message);
      return that.template;
    };
    return CannedText;
  }(fdt.ui.View));

  var CannedTextList = (function (_super) {
    fdt.__extends(CannedTextList, _super);
    function CannedTextList(newState) {
      var that = this;
      _super.call(that, CannedText, newState);
      that.TAG = '[fdt.im.CannedTextList]';
      that._getData();
      $('body').templateLoad('im-canned-text-template')
      .then(function(temp){
        that.template = temp;
        that.listTemplate = that.template.find('.im-canned-text-list');
        //event
        that.template.on('click', '.more', function(){
          that.state.page +=1;
          that.listTemplate.find('.more').remove();
          that._getData();
        });
      });
    }

    CannedTextList.prototype._getData = function () {
      var dfd = $.Deferred();
      var that = this;
      fdt.http.get('/api/canned/v0/cannedMessage', {
        offset: (that.state.page-1)*that.state.pageNumber,
        hits: that.state.pageNumber
      })
      .then(function(data) {
        data.result.data = that.state.data.concat(data.result.data);
        that.setState(data.result);
        that.listTemplate.scrollTop(9999);
        dfd.resolve(data);
      }).fail(function(err) {
        console.error(that.TAG, err);
        dfd.reject(err);
      });
      return dfd.promise();
    };


    CannedTextList.prototype.onClickItem = function(callback) {
      var that = this;
      $('#text-modal').on('click','.im-canned-text-item', function(event){
        var item = that.lists[$(this).attr('index')];
        callback.call(that, item, that);
      })
    };

    CannedTextList.prototype.render = function(callback) {
      var that = this;
      _super.prototype.render.call(that);
      if (that.state.length > that.state.data.length) {
        var li = $(document.createElement('li'));
        li.html('<a class="more">更多</a>');
        that.listTemplate.append(li);
      }
      return that.template;
    };
    return CannedTextList;
  }(fdt.ui.PageListView));


  var CannedImage = (function (_super) {
    fdt.__extends(CannedImage, _super);
    function CannedImage(newState) {
      var that = this;
      var defState = {
        index   : 0,
        comment : '',
        serving_url : '',
      };
      that.TAG = '[fdt.im.CannedImage]';
      that.template = undefined;
      that.state = $.extend({}, defState, newState);
      $('body').templateLoad('im-canned-image-template')
      .then(function(temp){
        var parent = temp;
        that.template = $(parent.find('#im-canned-image-item-template').html());
      });
    }

    CannedImage.prototype.render = function() {
      var that = this;
      that.template.attr('index', that.state.index);
      that.template.find('.im-canned-image').attr({
        alt : that.state.comment,
        src : that.state.serving_url
      });
      return that.template;
    };
    return CannedImage;
  }(fdt.ui.View));

  var CannedImageList = (function (_super) {
    fdt.__extends(CannedImageList, _super);
    function CannedImageList(newState) {
      var that = this;
      _super.call(that, CannedImage, newState);

      that.state.pageNumber = 20;
      that.TAG = '[fdt.im.CannedImageList]';
      that._getData();
      $('body').templateLoad('im-canned-image-template')
      .then(function(temp){
        that.template = temp;
        that.listTemplate =  that.template.find('.im-canned-image-list');
        //event
        that.template.on('click', '.more', function(){
          that.state.page +=1;
          that._getData();
        });
      });
    }

    CannedImageList.prototype._getData = function () {
      var dfd = $.Deferred();
      var that = this;
      fdt.http.get('/api/canned/v0/cannedImage', {
        offset: (that.state.page-1)*that.state.pageNumber,
        hits: that.state.pageNumber
      })
      .then(function(data) {
        data.result.data = that.state.data.concat(data.result.data);
        that.setState(data.result);
        that.listTemplate.scrollTop(9999);
        dfd.resolve(data);
      }).fail(function(err) {
        console.error(that.TAG, err);
        dfd.reject(err);
      });
      return dfd.promise();
    };

    CannedImageList.prototype.onClickItem = function(callback) {
      var that = this;
      $('#image-modal').on('click','.im-canned-image-item', function(event){
        var item = that.lists[$(this).attr('index')];
        callback.call(that, item, that);
      })
    };

    CannedImageList.prototype.render = function(callback) {
      var that = this;
      _super.prototype.render.call(that);
      if (that.state.length > that.state.data.length) {
        that.template.find('.more').removeClass('hide-block');
      }
      else {
        that.template.find('.more').addClass('hide-block');
      }
      return that.template;
    };
    return CannedImageList;
  }(fdt.ui.PageListView));

  // export
  window.fdt.ui.im.Friend = Friend;
  window.fdt.ui.im.FriendList = FriendList;
  window.fdt.ui.im.Session = Session;
  window.fdt.ui.im.Message = Message;
  window.fdt.ui.im.MessageList = MessageList;
  window.fdt.ui.im.CannedText = CannedText;
  window.fdt.ui.im.CannedTextList = CannedTextList;
  window.fdt.ui.im.CannedImage = CannedImage;
  window.fdt.ui.im.CannedImageList = CannedImageList;
})(window)