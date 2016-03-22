'use strict';

var messageKey = require('./message-key');
var message = {};

message[messageKey.INBOX_FOLLOW.str] = '{0}关注了您.';
message[messageKey.INBOX_LIKE.str] = '{0}喜欢你的帖: {1}';
message[messageKey.INBOX_COMMENT.str] = '{0}在你的帖留言:{1}';
message[messageKey.INBOX_MENTIONPOST.str] = '{0}在帖中提到您:{1}';
message[messageKey.INBOX_MENTIONCOMMENT.str] = '{0}在评论中提到您:{1}';
message[messageKey.INBOX_GROUPCREATED.str] = '{0}创建了一个群组{1}.';
message[messageKey.INBOX_INVITE.str] = '{0}邀请您加入群组{1}.';
message[messageKey.INBOX_ACCEPTED.str] = '{0}加入申请已被通过{1}.';
message[messageKey.INBOX_KICKED.str] = '{0} kicked you out of the group {1}.';
message[messageKey.INBOX_GROUPDELETED.str] = '{0}刪除群組{1}.';
message[messageKey.INBOX_POSTGROUP.str] = '{0}在{1}发布一則帖: {2}';
message[messageKey.INBOX_CONTEST_PERFORMANCE.str] = '<b>{0}</b> 当前排名: \n1st: <b>{1}</b>, {2} {3} \n2nd: <b>{4}</b>, {5} {6} \n3rd: <b>{7}</b>, {8} {9}';
message[messageKey.INBOX_REQUESTTOJOIN.str] = '{0}要求加入群組{1}.';
message[messageKey.INBOX_APPROVETOJOIN.str] = '{0}批准你加入群組{1}.';
message[messageKey.INBOX_ECONCALENDAR.str] = '[{0}] {1}公布{2}';
message[messageKey.INBOX_COMMENTLIKE.str] = '{0}喜欢你的留言:{1}';
message[messageKey.INBOX_TOP_PERFORMANCE.str] = '太棒了！您在<b>{0}</b>中排前{1}名！';
message[messageKey.INBOX_CONTEST_FINAL_RANKING.str] = '<b>{0}</b> 总排名: \n1st: <b>{1}</b>, {2} {3}, win {4}{5} \n2nd: <b>{6}</b>, {7} {8}, win {9}{10} \n3rd: <b>{11}</b>, {12} {13}, win {14}{15}';
message[messageKey.INBOX_CONTEST_CANCELLED.str] = '<b>{0}</b>已被取消';
message[messageKey.INBOX_CONTEST_ACTIVATED.str] = '<b>{0}</b>: 大赛启动！将于{1}开始';
message[messageKey.INBOX_CONTEST_NEED_PEOPLE.str] = '再{0}人参赛才能启动大赛';
message[messageKey.INBOX_CONTEST_START_SOON.str] = '<b>{0}</b>大赛将于明天开始!';
message[messageKey.INBOX_CONTEST_END_SOON.str] = '<b>{0}</b>大赛将于{1}天后结束';
message[messageKey.INBOX_CONTEST_INVITATION.str] = '<b>{0}</b>邀请你参加比赛<b>{1}</b>.';
message[messageKey.REFERRAL_INVALID_CODE.str] = '您的邀请码无效，请再次输入';
message[messageKey.REFERRAL_MUTUAL_INVITE.str] = '您已邀请过{0}，请输入其他邀请码';
message[messageKey.REFERRAL_INVITE_SELF.str] = '不能邀请你自己';
message[messageKey.REFERRAL_CONFIRMED.str] = '<b>{0}</b>已确认您的邀请码，您已获得{1}枚金币！';
message[messageKey.FUEL_EXCHANGE.str] = '太棒了！你的FDT Fuel已经超过{0}点！现在你可以用{1}点Fuel换取1枚金币。';
message[messageKey.FUEL_FULL.str] = '你的FDT Fuel已满！现在快来换取金币吧。';
message[messageKey.FUEL_LOW.str] = '"加油！你的FDT Fuel快要耗尽了。试着多做点交易或是在“动态”上发表你的观点来获得更多Fuel吧';

module.exports = message;
