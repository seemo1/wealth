'use strict';

var htmlMsgKey = require('./htmlMsg-key');
var htmlMsg = {};

htmlMsg[htmlMsgKey.INBOX_FOLLOW.str] = '<b>{0}</b>关注了您';
htmlMsg[htmlMsgKey.INBOX_LIKE.str] = '<b>{0}</b>喜欢你的帖: <b>{1}</b>';
htmlMsg[htmlMsgKey.INBOX_COMMENT.str] = '<b>{0}</b>在你的帖留言';
htmlMsg[htmlMsgKey.INBOX_MENTIONPOST.str] = '<b>{0}</b>在帖中提到您';
htmlMsg[htmlMsgKey.INBOX_MENTIONCOMMENT.str] = '<b>{0}</b>在评论中提到您';
htmlMsg[htmlMsgKey.INBOX_GROUPCREATED.str] = '<b>{0}</b>创建了一个群组<b>{1}</b>';
htmlMsg[htmlMsgKey.INBOX_INVITE.str] = '<b>{0}</b>邀请您加入群组<b>{1}</b>';
htmlMsg[htmlMsgKey.INBOX_ACCEPTED.str] = '<b>{0}</b>加入申请已被通过<b>{1}</b>';
htmlMsg[htmlMsgKey.INBOX_KICKED.str] = '';
htmlMsg[htmlMsgKey.INBOX_GROUPDELETED.str] = '<b>{0}</b>刪除群組<b>{1}</b>';
htmlMsg[htmlMsgKey.INBOX_POSTGROUP.str] = '<b>{0}</b>在{1}发布一則帖';
htmlMsg[htmlMsgKey.INBOX_CONTEST_PERFORMANCE.str] = '<b>{0}</b> 当前排名: \n1st: <b>{1}</b>, <b>{2}</b> <b>{3}</b> \n2nd: <b>{4}</b>, <b>{5}</b> <b>{6}</b> \n3rd: <b>{7}</b>, {8} {9}';
htmlMsg[htmlMsgKey.INBOX_REQUESTTOJOIN.str] = '<b>{0}</b>要求加入群組<b>{1}</b>';
htmlMsg[htmlMsgKey.INBOX_APPROVETOJOIN.str] = '<b>{0}</b>批准你加入群組<b>{1}</b>';
htmlMsg[htmlMsgKey.INBOX_ECONCALENDAR.str] = '[{0}] <b>{1}</b>公布{2}';
htmlMsg[htmlMsgKey.INBOX_COMMENTLIKE.str] = '<b>{0}</b>喜欢你的留言:<b>{1}</b>';
htmlMsg[htmlMsgKey.INBOX_TOP_PERFORMANCE.str] = '太棒了！您在<b>{0}</b>中排前{1}名！';
htmlMsg[htmlMsgKey.INBOX_CONTEST_FINAL_RANKING.str] = '<b>{0}</b> 总排名: \n1st: <b>{1}</b>, <b>{2}</b> <b>{3}</b>, win <b>{4}</b>{5} \n2nd: <b>{6}</b>, <b>{7}</b> {8}, win {9}{10} \n3rd: <b>{11}</b>, {12} {13}, win {14}{15}';
htmlMsg[htmlMsgKey.INBOX_CONTEST_CANCELLED.str] = '<b>{0}</b>已被取消';
htmlMsg[htmlMsgKey.INBOX_CONTEST_ACTIVATED.str] = '<b>{0}</b>: 大赛启动！将于{1}开始';
htmlMsg[htmlMsgKey.INBOX_CONTEST_NEED_PEOPLE.str] = '再{0}人参赛才能启动大赛';
htmlMsg[htmlMsgKey.INBOX_CONTEST_START_SOON.str] = '<b>{0}</b>大赛将于明天开始!';
htmlMsg[htmlMsgKey.INBOX_CONTEST_END_SOON.str] = '<b>{0}</b>大赛将于{1}天后结束';
htmlMsg[htmlMsgKey.INBOX_CONTEST_INVITATION.str] = '<b>{0}</b>邀请你参加比赛<b>{1}</b>';
htmlMsg[htmlMsgKey.REFERRAL_INVALID_CODE.str] = '您的邀请码无效，请再次输入';
htmlMsg[htmlMsgKey.REFERRAL_MUTUAL_INVITE.str] = '您已邀请过{0}，请输入其他邀请码';
htmlMsg[htmlMsgKey.REFERRAL_INVITE_SELF.str] = '不能邀请你自己';
htmlMsg[htmlMsgKey.REFERRAL_CONFIRMED.str] = '<b>{0}</b>已确认您的邀请码，您已获得{1}枚金币！';
htmlMsg[htmlMsgKey.FUEL_EXCHANGE.str] = '太棒了！你的FDT Fuel已经超过{0}点！现在你可以用{1}点Fuel换取1枚金币。';
htmlMsg[htmlMsgKey.FUEL_FULL.str] = '你的FDT Fuel已满！现在快来换取金币吧。';
htmlMsg[htmlMsgKey.FUEL_LOW.str] = '"加油！你的FDT Fuel快要耗尽了。试着多做点交易或是在“动态”上发表你的观点来获得更多Fuel吧';
htmlMsg[htmlMsgKey.SCHOOL_PASS.str] = '您的学生证已认证！';
htmlMsg[htmlMsgKey.SCHOOL_REJECTED.str] = '您的学生证无效或不符合规定，请重新上传或与客服人员联系。(请尽快重新认证，否则参加比赛时无法获得比赛排名)';
htmlMsg[htmlMsgKey.SCHOOL_REMIND.str] = '您的学生认证即将到期，请尽快重新认证。';
htmlMsg[htmlMsgKey.SCHOOL_EXPIRED.str] = '您的学生认证已到期，请重新认证。(请尽快重新认证，否则参加比赛时无法获得比赛排名)';

module.exports = htmlMsg;