'use strict';

var messageKey = require('./message-key');
var message = {};

message[messageKey.INBOX_FOLLOW.str] = '{1} started following you.';
message[messageKey.INBOX_LIKE.str] = '{1} liked your post: {2}';
message[messageKey.INBOX_COMMENT.str] = '{1} left a comment on your post: {2}';
message[messageKey.INBOX_MENTIONPOST.str] = '{1} mentioned you in a post: {2}';
message[messageKey.INBOX_MENTIONCOMMENT.str] = '{1} mentioned you in a comment: {2}';
message[messageKey.INBOX_GROUPCREATED.str] = '{1} just created a group {2}.';
message[messageKey.INBOX_INVITE.str] = '{1} invited you to join the group {2}.';
message[messageKey.INBOX_ACCEPTED.str] = '{1} accepted your invitation to join the group {2}.';
message[messageKey.INBOX_KICKED.str] = '{1} kicked you out of the group {2}.';
message[messageKey.INBOX_GROUPDELETED.str] = '{1} just deleted the group {2}.';
message[messageKey.INBOX_POSTGROUP.str] = '{1} just made a post in {2}: {3}.';
message[messageKey.INBOX_CONTEST_PERFORMANCE.str] = '<b>{1}</b> Current Top 3: \n1st: <b>{2}</b>, {3} {4} \n2nd: <b>{5}</b>, {6} {7} \n3rd: <b>{8}</b>, {9} {10}';
message[messageKey.INBOX_REQUESTTOJOIN.str] = '{1} requested to join the group {2}.';
message[messageKey.INBOX_APPROVETOJOIN.str] = '{1} approved you to join the group {2}.';
message[messageKey.INBOX_ECONCALENDAR.str] = '[{1}] {2} will be released at {3}';
message[messageKey.INBOX_COMMENTLIKE.str] = '{1} liked your comment: {2}';
message[messageKey.INBOX_TOP_PERFORMANCE.str] = 'Great job! You are currently in the top {2} of the <b>{1}</b>';
message[messageKey.INBOX_CONTEST_FINAL_RANKING.str] = 'Congratulations! Final Top 3 of <b>{1}</b>: \n1st: <b>{2}</b>, {3} {4}, win {5}{6} \n2nd: <b>{7}</b>, {8} {9}, win {10}{11} \n3rd: <b>{12}</b>, {13} {14}, win {15}{16}';
message[messageKey.INBOX_CONTEST_CANCELLED.str] = 'Sorry, <b>{1}</b> has been cancelled.';
message[messageKey.INBOX_CONTEST_ACTIVATED.str] = '<b>{1}</b> is activated! It will start on {2}.';
message[messageKey.INBOX_CONTEST_NEED_PEOPLE.str] = 'You are almost there! Only {1} more people needed to activate <b>{2}</b>.';
message[messageKey.INBOX_CONTEST_START_SOON.str] = '<b>{1}</b> starts tomorrow! Good luck!';
message[messageKey.INBOX_CONTEST_END_SOON.str] = '<b>{1}</b> ends in {2} day(s). Good luck!';
message[messageKey.INBOX_CONTEST_INVITATION.str] = '<b>{1}</b> invited you to join the contest <b>{2}</b>.';
message[messageKey.REFERRAL_INVALID_CODE.str] = 'Your code is invalid, please try again.';
message[messageKey.REFERRAL_MUTUAL_INVITE.str] = 'You already invited {1} to join, try another one!';
message[messageKey.REFERRAL_INVITE_SELF.str] = 'You cannot invite yourself';
message[messageKey.REFERRAL_CONFIRMED.str] = 'Your referral code has been confirmed by <b>{1}</b>. Now you get {2} coin in your account!';
message[messageKey.FUEL_EXCHANGE.str] = 'Good job! Your FDT Fuel score is above {1}! You can now exchange {2} fuel points for 1 coin.';
message[messageKey.FUEL_FULL.str] = 'Wow! Your FDT Fuel is full! Exchange for coins now!';
message[messageKey.FUEL_LOW.str] = 'Your FDT Fuel is almost consumed. Make trades or post on “Timelines” to gain more Fuel now!';

module.exports = message;
