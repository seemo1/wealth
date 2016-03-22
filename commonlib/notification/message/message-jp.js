'use strict';

var messageKey = require('./message-key');
var message = {};

message[messageKey.INBOX_FOLLOW.str] = '{1}があなたをフォローしました';
message[messageKey.INBOX_LIKE.str] = '{1}があなたの投稿にいいねといっています: {2}';
message[messageKey.INBOX_COMMENT.str] = '{1}があなたの投稿にコメントしました: {2}';
message[messageKey.INBOX_MENTIONPOST.str] = '{1}があなたについて投稿しました:{2}';
message[messageKey.INBOX_MENTIONCOMMENT.str] = '{1}があなたについてコメントしました: {2}';
message[messageKey.INBOX_GROUPCREATED.str] = '{1}がグループをつくりました{2}';
message[messageKey.INBOX_INVITE.str] = '{1}があなたをグループに招待しています{2}.';
message[messageKey.INBOX_ACCEPTED.str] = '{1}があなたの招待を承認しました{2}.';
message[messageKey.INBOX_KICKED.str] = '{1}があなたをグループから外しました{2}.';
message[messageKey.INBOX_GROUPDELETED.str] = '{1}がグループを削除しました{2}.';
message[messageKey.INBOX_POSTGROUP.str] = '{1}が{2}に投稿しました: {3}';
message[messageKey.INBOX_CONTEST_PERFORMANCE.str] = '<b>{1}</b> 暫定トップ3: \n1st: <b>{2}</b>, {3} {4} \n2nd: <b>{5}</b>, {6} {7} \n3rd: <b>{8}</b>, {9} {10}';
message[messageKey.INBOX_REQUESTTOJOIN.str] = '{1}があなたのグループへの参加を求めています {2}.';
message[messageKey.INBOX_APPROVETOJOIN.str] = '{1}がグループ参加リクエストを承認しました{2}.';
message[messageKey.INBOX_ECONCALENDAR.str] = '[{1}] {2}は{3}に公開されます';
message[messageKey.INBOX_COMMENTLIKE.str] = '{1}があなたのコメントにいいねといっています:{2}';
message[messageKey.INBOX_TOP_PERFORMANCE.str] = 'すばらしい！あなたは今<b>{1}</b>の暫定トップ{2}です';
message[messageKey.INBOX_CONTEST_FINAL_RANKING.str] = '<b>{1}</b> の最終トップ3: \n1位: <b>{2}</b>, {3} {4}, win {5}{6} \n2位: <b>{7}</b>, {8} {9}, win {10}{11} \n3位: <b>{12}</b>, {13} {14}, win {15}{16}';
message[messageKey.INBOX_CONTEST_CANCELLED.str] = '<b>{1}</b>はキャンセルされました';
message[messageKey.INBOX_CONTEST_ACTIVATED.str] = '<b>{1}</b>が{2}に開始します！';
message[messageKey.INBOX_CONTEST_NEED_PEOPLE.str] = '{1}を開始させるにはあと<b>{2}</b>人の参加が必要です';
message[messageKey.INBOX_CONTEST_START_SOON.str] = '<b>{1}</b>は明日開始されます！頑張ってください！';
message[messageKey.INBOX_CONTEST_END_SOON.str] = '<b>{1}</b>はあと{2}日で終了します。頑張ってください！';
message[messageKey.INBOX_CONTEST_INVITATION.str] = '<b>{1}</b>があなたをコンテストに招待しました<b>{2}</b>.';
message[messageKey.REFERRAL_INVALID_CODE.str] = 'Your code is invalid, please try again.';
message[messageKey.REFERRAL_MUTUAL_INVITE.str] = 'You already invited {1} to join, try another one!';
message[messageKey.REFERRAL_INVITE_SELF.str] = 'You cannot invite yourself';
message[messageKey.REFERRAL_CONFIRMED.str] = '<b>{1}</b>より紹介コードが認証されました。あなたのアカウントに{2}コインが追加されます！';
message[messageKey.FUEL_EXCHANGE.str] = 'Good job! Your FDT Fuel score is above {1}! You can now exchange {2} fuel points for 1 coin.';
message[messageKey.FUEL_FULL.str] = 'Wow! Your FDT Fuel is full! Exchange for coins now!';
message[messageKey.FUEL_LOW.str] = 'Your FDT Fuel is almost consumed. Make trades or post on “Timelines” to gain more Fuel now!';

module.exports = message;
