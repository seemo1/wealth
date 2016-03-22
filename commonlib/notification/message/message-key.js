'use strict';


//id:null means not it's not saved into inbox table
var messageKey = {
  INBOX_FOLLOW: {id: 4, str: 'FOLLOW', workType: 5, icon: 'comment', deepLink: '{0}://fdt/discover/profile?userid={1}'},
  INBOX_LIKE: {id: 5, str: 'LIKE', workType: 1, icon: 'comment', deepLink: '{0}://fdt/timelines/post?postid={1}'},
  INBOX_COMMENT: {id: 6, str: 'COMMENT', workType: 1, icon: 'comment', deepLink: '{0}://fdt/timelines/post?postid={1}'},
  INBOX_MENTIONPOST: {id: 7, str: 'MENTIONPOST', workType: 1, icon: 'comment', deepLink: '{0}://fdt/timelines/post?postid={1}'},
  INBOX_MENTIONCOMMENT: {id: 8, str: 'MENTIONCOMMENT', workType: 1, icon: 'comment', deepLink: '{0}://fdt/timelines/post?postid={1}'},
  INBOX_GROUPCREATED: {id: 9, str: 'GROUPCREATED', workType: 1, icon: 'group', deepLink: '{0}://fdt/discover/group?groupid={1}'},
  INBOX_INVITE: {id: 10, str: 'INVITE', workType: 7, icon: 'group', deepLink: '{0}://fdt/discover/group?groupid={1}'},
  INBOX_ACCEPTED: {id: 11, str: 'ACCEPTED', workType: 1, icon: 'group', deepLink: '{0}://fdt/discover/group?groupid={1}'},
  INBOX_KICKED: {id: 12, str: 'KICKED', workType: 0, icon: '', deepLink: ''},
  INBOX_GROUPDELETED: {id: 13, str: 'GROUPDELETED', workType: 1, icon: 'group', deepLink: ''},
  INBOX_POSTGROUP: {id: 14, str: 'POSTGROUP', workType: 1, icon: 'comment', deepLink: '{0}://fdt/timelines/post?postid={1}'},
  INBOX_REQUESTTOJOIN: {id: 16, str: 'REQUESTTOJOIN', workType: 7, icon: 'group', deepLink: '{0}://fdt/discover/group?groupid={1}'},
  INBOX_APPROVETOJOIN: {id: 17, str: 'APPROVETOJOIN', workType: 1, icon: 'group', deepLink: '{0}://fdt/discover/group?groupid={1}'},
  INBOX_ECONCALENDAR: {id: 18, str: 'ECONCALENDAR', workType: 1, icon: 'bull', deepLink: ''},
  INBOX_COMMENTLIKE: {id: 19, str: 'COMMENTLIKE', workType: 1, icon: 'comment', deepLink: ''},
  INBOX_TOP_PERFORMANCE: {id: 20, str: 'TOP_PERFORMANCE', workType: 1, icon: 'star', deepLink: '{0}://fdt/discover/contests/contestmain/about?contestid={1}'},
  INBOX_CONTEST_FINAL_RANKING: {id: 21, str: 'CONTEST_FINAL_RANKING', workType: 1, icon: 'star', deepLink: '{0}://fdt/discover/contests/contestmain/about?contestid={1}'},
  INBOX_CONTEST_CANCELLED: {id: 22, str: 'CONTEST_CANCELLED', workType: 1, icon: 'star', deepLink: ''},
  INBOX_CONTEST_ACTIVATED: {id: 23, str: 'CONTEST_ACTIVATED', workType: 1, icon: 'star', deepLink: '{0}://fdt/discover/contests/contestmain/about?contestid={1}'},
  INBOX_CONTEST_NEED_PEOPLE: {id: 24, str: 'CONTEST_NEED_PEOPLE', workType: 4, icon: 'star', deepLink: '{0}://fdt/discover/contests/contestmain/about?contestid={1}'},
  INBOX_CONTEST_START_SOON: {id: 25, str: 'CONTEST_START_SOON', workType: 1, icon: 'star', deepLink: '{0}://fdt/discover/contests/contestmain/about?contestid={1}'},
  INBOX_CONTEST_INVITATION: {id: 26, str: 'CONTEST_INVITATION', workType: 8, icon: 'star', deepLink: '{0}://fdt/discover/contests/contestmain/about?contestid={1}'},
  INBOX_CONTEST_END_SOON: {id: 27, str: 'CONTEST_END_SOON', workType: 1, icon: 'star', deepLink: '{0}://fdt/discover/contests/contestmain/about?contestid={1}'},
  INBOX_UNLIKE: {id: null, str: 'UNLIKE', workType: 0, icon: '', deepLink: ''},
  INBOX_COMMENT_UNLIKE: {id: null, str: 'COMMENT_UNLIKE', workType: 0, icon: '', deepLink: ''},
  INBOX_MENTION: {id: null, str: 'MENTION', workType: 1, icon: 'comment', deepLink: '{0}://fdt/timelines/post?postid={1}'},
  REFERRAL_INVALID_CODE: {id: null, str: 'REFERRAL_INVALID_CODE', workType: 0, icon: '', deepLink: ''},
  REFERRAL_MUTUAL_INVITE: {id: null, str: 'REFERRAL_MUTUAL_INVITE', workType: 0, icon: '', deepLink: ''},
  REFERRAL_INVITE_SELF: {id: null, str: 'REFERRAL_INVITE_SELF', workType: 0, icon: '', deepLink: ''},
  REFERRAL_CONFIRMED: {id: 34, str: 'REFERRAL_CONFIRMED', workType: 1, icon: 'crown', deepLink: '{0}://fdt/me/wallet'},
  INBOX_CONTEST_PERFORMANCE: {id: 35, str: 'CONTEST_PERFORMANCE', workType: 1, icon: 'star', deepLink:'{0}://fdt/discover/contests/contestmain/about?contestid={1}'},
  FUEL_EXCHANGE: {id: 36, str: 'FUEL_EXCHANGE', workType: 3, icon: 'fuel', deepLink: '{0}://fdt/me'},
  FUEL_FULL: {id: 36, str: 'FUEL_FULL', workType: 3, icon: 'fuel', deepLink: '{0}://fdt/me'},
  FUEL_LOW: {id: 36, str: 'FUEL_LOW', workType: 1, icon: 'fuel', deepLink: '{0}://fdt/me'},
};

module.exports = messageKey;
