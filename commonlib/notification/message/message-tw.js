'use strict';

var messageKey = require('./message-key');
var message = {};

message[messageKey.INBOX_FOLLOW.str] = '{1}關注了您.';
message[messageKey.INBOX_LIKE.str] = '{1}喜歡你的文章: {2}';
message[messageKey.INBOX_COMMENT.str] = '{1}在你的帖留言:{2}';
message[messageKey.INBOX_MENTIONPOST.str] = '{1}在帖中提到您:{2}';
message[messageKey.INBOX_MENTIONCOMMENT.str] = '{1}在評論中提到您:{2}';
message[messageKey.INBOX_GROUPCREATED.str] = '{1}創建了一個群組{2}.';
message[messageKey.INBOX_INVITE.str] = '{1}邀請您加入群組{2}.';
message[messageKey.INBOX_ACCEPTED.str] = '{1}加入申請已被通過{2}.';
message[messageKey.INBOX_KICKED.str] = '{1} kicked you out of the group {2}.';
message[messageKey.INBOX_GROUPDELETED.str] = '{1}刪除群組{2}.';
message[messageKey.INBOX_POSTGROUP.str] = '{1}在{2}發佈了一則文章: {3}';
message[messageKey.INBOX_CONTEST_PERFORMANCE.str] = '<b>{1}</b> 當前排名: \n1st: <b>{2}</b>, {3} {4} \n2nd: <b>{5} </b>, {6} {7} \n3rd: <b>{8}</b>, {9} {10}';
message[messageKey.INBOX_REQUESTTOJOIN.str] = '{1}要求加入群組{2}.';
message[messageKey.INBOX_APPROVETOJOIN.str] = '{1}批准你加入群組{2}.';
message[messageKey.INBOX_ECONCALENDAR.str] = '[{1}] {2}公佈{3}';
message[messageKey.INBOX_COMMENTLIKE.str] = '{1}喜歡你的留言:{2}';
message[messageKey.INBOX_TOP_PERFORMANCE.str] = '太棒了！您在<b>{1}</b>中排前{2}名！ ';
message[messageKey.INBOX_CONTEST_FINAL_RANKING.str] = '<b>{1}</b> 總排名: \n1st: <b>{2}</b>, {3} {4}, win {5}{6} \ n2nd: <b>{7}</b>, {8} {9}, win {10}{11} \n3rd: <b>{12}</b>, {13} {14}, win { 15}{16}';
message[messageKey.INBOX_CONTEST_CANCELLED.str] = '<b>{1}</b>已被取消';
message[messageKey.INBOX_CONTEST_ACTIVATED.str] = '<b>{1}</b>: 大賽啟動！將於{2}開始';
message[messageKey.INBOX_CONTEST_NEED_PEOPLE.str] = '再{1}人參賽才能啟動大賽';
message[messageKey.INBOX_CONTEST_START_SOON.str] = '<b>{1}</b>大賽將於明天開始!';
message[messageKey.INBOX_CONTEST_END_SOON.str] = '<b>{1}</b>大賽將於{2}天后結束';
message[messageKey.INBOX_CONTEST_INVITATION.str] = '<b>{1}</b>邀請你參加比賽<b>{2}</b>.';
message[messageKey.REFERRAL_INVALID_CODE.str] = '您的邀請碼無效，請再次輸入';
message[messageKey.REFERRAL_MUTUAL_INVITE.str] = '您已邀請過{1}，請輸入其他邀請碼';
message[messageKey.REFERRAL_INVITE_SELF.str] = '不能邀請你自己';
message[messageKey.REFERRAL_CONFIRMED.str] = '<b>{1}</b>已確認您的邀請碼，您已獲得{2}枚金幣！';
message[messageKey.FUEL_EXCHANGE.str] = '太棒了！你的FDT Fuel已經超過{1}點！現在你可以使用{2}點Fuel換取1枚金幣。';
message[messageKey.FUEL_FULL.str] = '你的FDT Fuel已經滿了！趕快用Fuel換取金幣吧。';
message[messageKey.FUEL_LOW.str] = '加油！你的FDT Fuel快要耗盡了。試著多做點交易或是在動態發表你的看法來獲得更多的Fuel吧！';

module.exports = message;
