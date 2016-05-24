'use strict';

(function(window) {
  window.fdt = window.fdt || {};
  window.fdt.NIM = window.fdt.NIM || {};
  var console = fdt.console;

  var fdtNIM = function(user, options) {

    var data = {
      currUser : {}, //被選取的客戶
      users    : [],
      friends  : [],
      msgs     : {}
    };

    var defOptions = {
      session    : new fdt.ui.View(),
      friendList : new fdt.ui.View(),
    }
    //init
    var setting = $.extend({}, defOptions, options);

    function registerEvent () {
      if (typeof setting.session.onSendMsg === 'function') {
        setting.session.onSendMsg(onSendMsg);
      }
      if (typeof setting.session.onFileSelector === 'function') {
        setting.session.onFileSelector(onFileSelector);
      }
      if (typeof setting.session.onCannedImageSelector === 'function') {
        setting.session.onCannedImageSelector(onCannedImageSelector);
      }
      if (typeof setting.friendList.onClickFriend === 'function') {
        setting.friendList.onClickFriend(onClickFriend);
      }
    }
    registerEvent();

    var nim = NIM.getInstance({
      // 初始化SDK
      // debug: true
      appKey: fdt.config.NIMAppKey,
      account: user.account,
      token: user.token,
      onconnect: onConnect,
      onerror: onError,
      onwillreconnect: onWillReconnect,
      ondisconnect: onDisconnect,
      // 多端登录
      onloginportschange: onLoginPortsChange,
      // 用户关系
      onblacklist: onBlacklist,
      onsyncmarkinblacklist: onMarkInBlacklist,
      onmutelist: onMutelist,
      onsyncmarkinmutelist: onMarkInMutelist,
      // 好友关系
      onfriends: onFriends,
      onsyncfriendaction: onSyncFriendAction,
      // 用户名片
      onmyinfo: onMyInfo,
      onupdatemyinfo: onUpdateMyInfo,
      onusers: onUsers,
      onupdateuser: onUpdateUser,
      // 群组
      onteams: onTeams,
      onsynccreateteam: onCreateTeam,
      onteammembers: onTeamMembers,
      onsyncteammembersdone: onSyncTeamMembersDone,
      onupdateteammember: onUpdateTeamMember,
      // 会话
      onsessions: onSessions,
      onupdatesession: onUpdateSession,
      // 消息
      onroamingmsgs: onRoamingMsgs,
      onofflinemsgs: onOfflineMsgs,
      onmsg: onMsg,
      // 系统通知
      onofflinesysmsgs: onOfflineSysMsgs,
      onsysmsg: onSysMsg,
      onupdatesysmsg: onUpdateSysMsg,
      onsysmsgunread: onSysMsgUnread,
      onupdatesysmsgunread: onUpdateSysMsgUnread,
      onofflinecustomsysmsgs: onOfflineCustomSysMsgs,
      oncustomsysmsg: onCustomSysMsg,
      // 同步完成
      onsyncdone: onSyncDone
    });

    function onConnect() {
      console.log('连接成功');
    }
    function onWillReconnect(obj) {
      // 此时说明 `SDK` 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
      console.log('即将重连');
      console.log(obj.retryCount);
      console.log(obj.duration);
    }
    function onDisconnect(error) {
      // 此时说明 `SDK` 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
      console.log('丢失连接');
      console.log(error);
      if (error) {
        switch (error.code) {
        // 账号或者密码错误, 请跳转到登录页面并提示错误
        case 302:
          fdt.alert(error.message, function(){
            window.location.href = '/manager/login';
          });
          break;
        // 被踢, 请提示错误后跳转到登录页面
        case 'kicked':
          fdt.alert(error.message, function(){
            window.location.href = '/manager/login';
          });
          break;
        default:
          break;
        }
      }
    }
    function onError(error) {
      console.log(error);
    }

    function onLoginPortsChange(loginPorts) {
      console.log('当前登录帐号在其它端的状态发生改变了', loginPorts);
    }

    function onBlacklist(blacklist) {
      console.log('收到黑名单', blacklist);
      data.blacklist = nim.mergeRelations(data.blacklist, blacklist);
      data.blacklist = nim.cutRelations(data.blacklist, blacklist.invalid);
      refreshBlacklistUI();
    }
    function onMarkInBlacklist(obj) {
      console.log(obj);
      console.log(obj.account + '被你在其它端' + (obj.isAdd ? '加入' : '移除') + '黑名单');
      if (obj.isAdd) {
        addToBlacklist(obj);
      } else {
        removeFromBlacklist(obj);
      }
    }
    function addToBlacklist(obj) {
      data.blacklist = nim.mergeRelations(data.blacklist, obj.record);
      refreshBlacklistUI();
    }
    function removeFromBlacklist(obj) {
      data.blacklist = nim.cutRelations(data.blacklist, obj.record);
      refreshBlacklistUI();
    }
    function refreshBlacklistUI() {
      // 刷新界面
    }
    function onMutelist(mutelist) {
      console.log('收到静音列表', mutelist);
      data.mutelist = nim.mergeRelations(data.mutelist, mutelist);
      data.mutelist = nim.cutRelations(data.mutelist, mutelist.invalid);
      refreshMutelistUI();
    }
    function onMarkInMutelist(obj) {
      console.log(obj);
      console.log(obj.account + '被你' + (obj.isAdd ? '加入' : '移除') + '静音列表');
      if (obj.isAdd) {
        addToMutelist(obj);
      } else {
        removeFromMutelist(obj);
      }
    }
    function addToMutelist(obj) {
      data.mutelist = nim.mergeRelations(data.mutelist, obj.record);
      refreshMutelistUI();
    }
    function removeFromMutelist(obj) {
      data.mutelist = nim.cutRelations(data.mutelist, obj.record);
      refreshMutelistUI();
    }
    function refreshMutelistUI() {
      // 刷新界面
    }

    function onFriends(friends) {
      console.log('收到好友列表', friends);
      data.friends = nim.mergeFriends(data.friends, friends);
      data.friends = nim.cutFriends(data.friends, friends.invalid);
      refreshFriendsUI();
    }
    function onSyncFriendAction(obj) {
      console.log(obj);
      switch (obj.type) {
      case 'addFriend':
        console.log('你在其它端直接加了一个好友' + obj.account + ', 附言' + obj.ps);
        onAddFriend(obj.friend);
        break;
      case 'applyFriend':
        console.log('你在其它端申请加了一个好友' + obj.account + ', 附言' + obj.ps);
        break;
      case 'passFriendApply':
        console.log('你在其它端通过了一个好友申请' + obj.account + ', 附言' + obj.ps);
        onAddFriend(obj.friend);
        break;
      case 'rejectFriendApply':
        console.log('你在其它端拒绝了一个好友申请' + obj.account + ', 附言' + obj.ps);
        break;
      case 'deleteFriend':
        console.log('你在其它端删了一个好友' + obj.account);
        onDeleteFriend(obj.account);
        break;
      case 'updateFriend':
        console.log('你在其它端更新了一个好友', obj.friend);
        onUpdateFriend(obj.friend);
        break;
      }
    }
    function onAddFriend(friend) {
      data.friends = nim.mergeFriends(data.friends, friend);
      refreshFriendsUI();
    }
    function onDeleteFriend(account) {
      data.friends = nim.cutFriendsByAccounts(data.friends, account);
      refreshFriendsUI();
    }
    function onUpdateFriend(friend) {
      data.friends = nim.mergeFriends(data.friends, friend);
      refreshFriendsUI();
    }
    function refreshFriendsUI() {
      // 刷新界面
      updateFriendList();
    }

    function onMyInfo(user) {
      console.log('收到我的名片', user);
      data.myInfo = user;
      updateMyInfoUI();
    }
    function onUpdateMyInfo(user) {
      console.log('我的名片更新了', user);
      data.myInfo = NIM.util.merge(data.myInfo, user);
      updateMyInfoUI();
    }
    function updateMyInfoUI() {
        // 刷新界面
    }
    function onUsers(users) {
      console.log('收到用户名片列表', users);
      data.users = nim.mergeUsers(data.users, users);
      updateFriendList();
    }
    function onUpdateUser(user) {
      console.log('用户名片更新了', user);
      data.users = nim.mergeUsers(data.users, user);
    }

    function onTeams(teams) {
      console.log('群列表', teams);
      data.teams = nim.mergeTeams(data.teams, teams);
      onInvalidTeams(teams.invalid);
    }
    function onInvalidTeams(teams) {
      data.teams = nim.cutTeams(data.teams, teams);
      data.invalidTeams = nim.mergeTeams(data.invalidTeams, teams);
      refreshTeamsUI();
    }
    function onCreateTeam(team) {
      console.log('你创建了一个群', team);
      data.teams = nim.mergeTeams(data.teams, team);
      refreshTeamsUI();
      onTeamMembers({
          teamId: team.teamId,
          members: owner
      });
    }
    function refreshTeamsUI() {
        // 刷新界面
    }
    function onTeamMembers(teamId, members) {
      console.log('群id', teamId, '群成员', members);
      var teamId = obj.teamId;
      var members = obj.members;
      data.teamMembers = data.teamMembers || {};
      data.teamMembers[teamId] = nim.mergeTeamMembers(data.teamMembers[teamId], members);
      data.teamMembers[teamId] = nim.cutTeamMembers(data.teamMembers[teamId], members.invalid);
      refreshTeamMembersUI();
    }
    function onSyncTeamMembersDone() {
      console.log('同步群列表完成');
    }
    function onUpdateTeamMember(teamMember) {
      console.log('群成员信息更新了', teamMember);
      onTeamMembers({
        teamId: teamMember.teamId,
        members: teamMember
      });
    }
    function refreshTeamMembersUI() {
      // 刷新界面
    }

    function onSessions(sessions) {
      console.log('收到会话列表', sessions);
      data.sessions = nim.mergeSessions(data.sessions, sessions);
      updateSessionsUI();
    }
    function onUpdateSession(session) {
      console.log('会话更新了', session);
      data.sessions = nim.mergeSessions(data.sessions, session);
      updateSessionsUI();
    }
    function updateSessionsUI() {
      // 刷新界面
      data.sessions.forEach(function(element, index, array){
        var friend = getFriendInfoBySession(element.id);
        if (!friend) return;
        friend.states = [{
          type  : 'message',
          count : element.unread
        }];
      });
      setting.friendList.setState(data.friends);
    }

    function onRoamingMsgs(obj) {
      console.log('漫游消息', obj);
      pushMsg(obj.msgs);
    }
    function onOfflineMsgs(obj) {
      console.log('离线消息', obj);
      pushMsg(obj.msgs);
    }
    function onMsg(msg) {
      console.log('收到消息', msg.scene, msg.type, msg);
      pushMsg(msg);
    }

    function pushMsg(msgs) {
      if (!Array.isArray(msgs)) { msgs = [msgs]; }

      var sessionId = (msgs[0] && msgs[0].sessionId) ? msgs[0].sessionId : data.currUser.sessionId;
      data.msgs = data.msgs || {};
      data.msgs[sessionId] = nim.mergeMsgs(data.msgs[sessionId], msgs);
      if (sessionId == data.currUser.sessionId) {
        setting.session.setState(data);
      }
    }

    function onOfflineSysMsgs(sysMsgs) {
      console.log('收到离线系统通知', sysMsgs);
      pushSysMsgs(sysMsgs);
    }
    function onSysMsg(sysMsg) {
      console.log('收到系统通知', sysMsg)
      pushSysMsgs(sysMsg);
    }
    function onUpdateSysMsg(sysMsg) {
      pushSysMsgs(sysMsg);
    }
    function pushSysMsgs(sysMsgs) {
      data.sysMsgs = nim.mergeSysMsgs(data.sysMsgs, sysMsgs);
      refreshSysMsgsUI();
    }
    function onSysMsgUnread(obj) {
      console.log('收到系统通知未读数', obj);
      data.sysMsgUnread = obj;
      refreshSysMsgsUI();
    }
    function onUpdateSysMsgUnread(obj) {
      console.log('系统通知未读数更新了', obj);
      data.sysMsgUnread = obj;
      refreshSysMsgsUI();
    }
    function refreshSysMsgsUI() {
      // 刷新界面
    }
    function onOfflineCustomSysMsgs(sysMsgs) {
      console.log('收到离线自定义系统通知', sysMsgs);
    }
    function onCustomSysMsg(sysMsg) {
      console.log('收到自定义系统通知', sysMsg);
    }

    function onSyncDone() {
      console.log('同步完成');
    }

    function onSendMsg (text, sessionObj) {
      text = text.trim();
      if(!text) {
        return
      };
      sendMsg(text);
      sessionObj.get().find('.im-post-message').val('');
      sessionObj.get().find('.im-post-message').focus();
    }
    function sendMsg(text) {
      var msg = nim.sendText({
        scene: 'p2p',
        to: data.currUser.account,
        text: text,
        done: sendMsgDone
      });
      console.log('正在发送p2p text消息, id=' + msg.idClient);
      pushMsg(msg);
    };

    function sendMsgDone(error, msg) {
      console.log(error);
      console.log(msg);
      console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error?'成功':'失败') + ', id=' + msg.idClient);
      pushMsg(msg);
      msgToBottom();
    }

    //取得 local cache messages history
    var getLocalMsgs = function(account) {
      console.log('getLocalMsgs');
      nim.getLocalMsgs({
        scene: 'p2p',
        to: account,
        limit: 100,
        done: getLocalMsgsDone,
        asc: true
      });
    }

    function getLocalMsgsDone(error, obj) {
      console.log(error);
      console.log(obj);
      console.log('获取本地消息' + ((!error) ? '成功' : '失败'));
      if (!error && obj.msgs.length > 0) {
        pushMsg(obj.msgs);
      }
      else {
        getHistoryMsgs(obj.to);
      }
    }
    //取得雲信的 message history
    var getHistoryMsgs = function(account) {
      nim.getHistoryMsgs({
        scene: 'p2p',
        to: account,
        done: getHistoryMsgsDone,
        asc: true
      });
    }

    function getHistoryMsgsDone(error, obj) {
      console.log('获取p2p历史消息' + ((!error) ? '成功' : '失败'));
      console.log(error);
      console.log(obj);
      if (!error) {
        pushMsg(obj.msgs);
      }
      else {
        $.fdt.alert('無法取得歷史記錄');
      }
    }
    function updateLocalMsgDone(error, obj) {
      console.log(error);
      console.log(obj);
      console.log('更新本地消息' + (!error?'成功':'失败'));
    }
    //以下為新增 function
    function updateFriendList() {
      var notFound = [];
      data.friends.forEach(function(element, index, array) {
        var user = getUserInfo(element.account);
        if (!user) {
          notFound.push(element.account);
          return;
        }
        $.extend(element, user);
        element.sessionId = 'p2p-' + user.account;
      });
      if (notFound.length > 0) {
        nim.getUsers({
          accounts: notFound,
          done: function (error, users) {
            console.log(error);
            console.log(users);
            console.log('获取用户名片数组' + (!error?'成功':'失败'));
            if (!error) {
              onUsers(users);
            }
          }
        });
      }
      setting.friendList.setState(data.friends);
    }
    function getUserInfo(account) {
      var index = data.users.map(function(e) { return e.account; }).indexOf(account);
      if(index < 0) {
        return false;
      }
      return data.users[index];
    }

    function getFriendInfoBySession(sessionId) {
      var index = data.friends.map(function(e) { return e.sessionId; }).indexOf(sessionId);
      if(index < 0) {
        return false;
      }
      return data.friends[index];
    }

    function onFileSelector(fileInput, sessionObj) {
      var file = fileInput.files[0];
      var maxSize = 100 * 1024 * 1024;
      if (file.size >= maxSize) {
        fdt.alert('檔案不得超過 100MB');
        return ;
      }
      var image = ['image/jpeg'];
      var type = (/^image/.exec(file.type)) ? 'image' : 'file';
      if (type === 'image') {
        fdt.toBase64(file)
        .then(function(base64){
          sendFile({
            type: type,
            dataURL: base64,
            filename: file.name
          });
        });
      }
      else {
        sendFile({
          type: type,
          fileInput: fileInput,
          filename: file.name
        });
      }
    }
    function onCannedImageSelector(item, modal) {
      var state = item.getState();
      fdt.http.getBase64(state.serving_url)
      .done(function(base64){
        sendFile({
          type: 'image',
          dataURL: base64,
          filename: state.comment
        });
        modal.modal('hide');
      });
    }
    function sendFile(options) {
      var defaults = {
        scene    : 'p2p',
        to       : data.currUser.account,
        type     : 'file',
        filename : 'filename',
        fileInput: undefined,
        blob     : undefined,
        dataURL  : undefined,
      }
      var opts = $.extend({}, defaults, options);

      var msg = {};
      opts.beginupload = function(upload) {
        // - 如果开发者传入 fileInput, 在此回调之前不能修改 fileInput
        // - 在此回调之后可以取消图片上传, 此回调会接收一个参数 `upload`, 调用 `upload.abort();` 来取消文件上传
        var time = moment().utc().valueOf();
        var id = data.currUser.sessionId + '-' + time;
        msg = {
          idClient : id,
          type : opts.type,
          flow : 'out',
          file : {
            name       : opts.filename,
            percentage : 0,
            url        : ''
          },
          time : time,
          sessionId: data.currUser.sessionId,
        };
        msg.file.url = opts.dataURL;
        pushMsg(msg);
        msgToBottom();
      };
      opts.uploadprogress = function(obj) {
        msg.file.percentage = obj.percentage;
        setting.session.render();
        console.log('文件总大小: ' + obj.total + 'bytes');
        console.log('已经上传的大小: ' + obj.loaded + 'bytes');
        console.log('上传进度: ' + obj.percentage);
        console.log('上传进度文本: ' + obj.percentageText);
      };
      opts.uploaddone = function(error, file) {
        console.log(error);
        console.log(file);
        console.log('上传' + (!error?'成功':'失败'));
      };
      opts.beforesend = function(m) {
        console.log('正在发送p2p image消息, id=' + msg.idClient);
      };
      opts.done = function (error, m) {
        if (error) {
          alert(error);
          //TODO ui 狀態改變
          return;
        }
        if (opts.type === "image") {
          //使用原 base64 url
          m.file.url = msg.file.url;
        }

        $.extend(msg, m);

        setting.session.render();
      };
      nim.sendFile(opts);
    }

    function onClickFriend(user, friendListObject) {
      var state = user.getState();
      //同一個就不重新 render;
      if (data.currUser.account == state.account) {
        return;
      }
      nim.setCurrSession(state.sessionId);
      data.currUser = state;
      getHistoryMsgs(state.account);
      if(!data.msgs[state.sessionId] || data.msgs[state.sessionId].length <= 0) {
        // nim.deleteLocalMsgsBySession({
        //   scene: 'p2p',
        //   to: state.account,
        //   done: deleteLocalMsgsBySessionDone
        // });
        getHistoryMsgs(state.account);
      }
      else {
        setting.session.setState(data);
      }
      setting.session.get().removeClass('hidden');
      msgToBottom();
    }
    // function deleteLocalMsgsBySessionDone(error, obj) {
    //   console.log(error);
    //   console.log(obj);
    //   console.log('删除会话本地消息' + (!error?'成功':'失败'));
    // }
    function msgToBottom() {
      // $('.im-message .im-message-image').last().on('load', function() {
      //   $('.im-message-block').animate({ scrollTop: $('.im-message-list').height() }, "fast");
      // });
      $('.im-message-block').animate({ scrollTop: $('.im-message-list').height() }, "fast");
    }
  };
  window.fdt.NIM = fdtNIM;
})(window)