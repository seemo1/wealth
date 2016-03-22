'use strict';

var htmlMsgKey = require('./htmlMsg-key');
var htmlMsg = {};

htmlMsg[htmlMsgKey.INBOX_FOLLOW.str] = '<b>{0}</b>追蹤了您';
htmlMsg[htmlMsgKey.INBOX_LIKE.str] = '<b>{0}</b>喜歡你的文章: <b>{1}</b>';
htmlMsg[htmlMsgKey.INBOX_COMMENT.str] = '<b>{0}</b>在你的文章留言';
htmlMsg[htmlMsgKey.INBOX_MENTIONPOST.str] = '<b>{0}</b>在文章中提到您';
htmlMsg[htmlMsgKey.INBOX_MENTIONCOMMENT.str] = '<b>{0}</b>在評論中提到您';
htmlMsg[htmlMsgKey.INBOX_GROUPCREATED.str] = '<b>{0}</b>新增了一個群組<b>{1}</b>';
htmlMsg[htmlMsgKey.INBOX_INVITE.str] = '<b>{0}</b>邀請您加入群組<b>{1}</b>';
htmlMsg[htmlMsgKey.INBOX_ACCEPTED.str] = '<b>{0}</b>加入申請已被通過<b>{1}</b>';
htmlMsg[htmlMsgKey.INBOX_KICKED.str] = '';
htmlMsg[htmlMsgKey.INBOX_GROUPDELETED.str] = '<b>{0}</b>刪除群組<b>{1}</b>';
htmlMsg[htmlMsgKey.INBOX_POSTGROUP.str] = '<b>{0}</b>在<b>{1}</b>發佈了一則文章';
htmlMsg[htmlMsgKey.INBOX_CONTEST_PERFORMANCE.str] = '<b>{0}</b> 目前排名: \n1st: <b>{1}</b>, <b>{2}</b> <b>{3}</b> \n2nd: <b>{4} </b>, <b>{5}</b> <b>{6}</b> \n3rd: <b>{7}</b>, <b>{8}</b> {9}';
htmlMsg[htmlMsgKey.INBOX_REQUESTTOJOIN.str] = '<b>{0}</b>要求加入群組<b>{1}</b>';
htmlMsg[htmlMsgKey.INBOX_APPROVETOJOIN.str] = '<b>{0}</b>批准你加入群組<b>{1}</b>';
htmlMsg[htmlMsgKey.INBOX_ECONCALENDAR.str] = '[{0}] <b>{1}</b>公佈{2}';
htmlMsg[htmlMsgKey.INBOX_COMMENTLIKE.str] = '<b>{0}</b>喜歡你的留言:<b>{1}</b>';
htmlMsg[htmlMsgKey.INBOX_TOP_PERFORMANCE.str] = '太棒了！您在<b>{0}</b>中排前{1}名！ ';
htmlMsg[htmlMsgKey.INBOX_CONTEST_FINAL_RANKING.str] = '<b>{0}</b> 總排名: \n1st: <b>{1}</b>, <b>{2}</b> <b>{3}</b>, win <b>{4}</b>{5} \ n2nd: <b>{6}</b>, <b>{7}</b> <b>{8}</b>, win {9}{10} \n3rd: <b>{11}</b>, {12} {13}, win {14}{15}';
htmlMsg[htmlMsgKey.INBOX_CONTEST_CANCELLED.str] = '<b>{0}</b>已被取消';
htmlMsg[htmlMsgKey.INBOX_CONTEST_ACTIVATED.str] = '<b>{0}</b>: 大賽啟動！將於{1}開始';
htmlMsg[htmlMsgKey.INBOX_CONTEST_NEED_PEOPLE.str] = '再{0}人參賽才能啟動大賽';
htmlMsg[htmlMsgKey.INBOX_CONTEST_START_SOON.str] = '<b>{0}</b>大賽將於明天開始!';
htmlMsg[htmlMsgKey.INBOX_CONTEST_END_SOON.str] = '<b>{0}</b>大賽將於{1}天后結束';
htmlMsg[htmlMsgKey.INBOX_CONTEST_INVITATION.str] = '<b>{0}</b>邀請你參加比賽<b>{1}</b>';
htmlMsg[htmlMsgKey.REFERRAL_INVALID_CODE.str] = '您的邀請碼無效，請再次輸入';
htmlMsg[htmlMsgKey.REFERRAL_MUTUAL_INVITE.str] = '您已邀請過{0}，請輸入其他邀請碼';
htmlMsg[htmlMsgKey.REFERRAL_INVITE_SELF.str] = '不能邀請你自己';
htmlMsg[htmlMsgKey.REFERRAL_CONFIRMED.str] = '<b>{0}</b>已確認您的邀請碼，您已獲得{1}枚金幣！';
htmlMsg[htmlMsgKey.FUEL_EXCHANGE.str] = '太棒了！你的FDT Fuel已經超過{0}點！現在你可以使用{1}點Fuel換取1枚金幣。';
htmlMsg[htmlMsgKey.FUEL_FULL.str] = '你的FDT Fuel已經滿了！趕快用Fuel換取金幣吧。';
htmlMsg[htmlMsgKey.FUEL_LOW.str] = '加油！你的FDT Fuel快要耗盡了。試著多做點交易或是在動態發表你的看法來獲得更多的Fuel吧！';
htmlMsg[htmlMsgKey.SCHOOL_PASS.str] = '您的學生證已認證！';
htmlMsg[htmlMsgKey.SCHOOL_REJECTED.str] = '您的學生證無效或是不符規定，請重新上傳或與客服人員聯絡。(請盡快重新認證，否則參加比賽時無法獲得參與排名)';
htmlMsg[htmlMsgKey.SCHOOL_REMIND.str] = '您的學生認證即將到期，請盡快重新認證。';
htmlMsg[htmlMsgKey.SCHOOL_EXPIRED.str] = '您的學生認證已到期，請重新認證。(請盡快重新認證，否則參加比賽時無法獲得參與排名)';

module.exports = htmlMsg;