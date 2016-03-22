var defMsg = 'EN';

var notifyType =
{
  FOLLOW:
	{
  KEY: 'FOLLOW',
  TYPE: '4',
  MSG:
		{
  EN: '{1} started following you.',
  TW: '{1}追蹤了您.',
  CN: '{1}关注了您.',
  JA: '{1}があなたをフォローしました',
  ES: '{1} ha comenzado a seguirte.',
		},
	},
  LIKE:
	{
  KEY: 'LIKE',
  TYPE: '5',
  MSG:
		{
  EN: '{1} liked your post: {2}',
  TW: '{1}喜歡你的文章: {2}',
  CN: '{1}喜欢你的帖: {2}',
  JA: '{1}があなたの投稿にいいねといっています: {2}',
  ES: '{1} le ha gustado tu post: {2}',
		},
	},
  COMMENT:
	{
  KEY: 'COMMENT',
  TYPE: '6',
  MSG:
		{
  EN: '{1} left a comment on your post: {2}',
  TW: '{1}在你的文章留言:{2}',
  CN: '{1}在你的帖留言:{2}',
  JA: '{1}があなたの投稿にコメントしました: {2}',
  ES: '{1} ha dejado un comentario en tu post: {2}',
		},
	},
  MENTIONPOST:
	{
  KEY: 'MENTIONPOST',
  TYPE: '7',
  MSG:
		{
  EN: '{1} mentioned you in a post: {2}',
  TW: '{1}在文章中提到您:{2}',
  CN: '{1}在帖中提到您:{2}',
  JA: '{1}があなたについて投稿しました:{2}',
  ES: '{1} te ha mencionado en un post: {2}',
		},
	},
  MENTIONCOMMENT:
	{
  KEY: 'MENTIONCOMMENT',
  TYPE: '8',
  MSG:
		{
  EN: '{1} mentioned you in a comment: {2}',
  TW: '{1}在評論中提到您:{2}',
  CN: '{1}在评论中提到您:{2}',
  JA: '{1}があなたについてコメントしました: {2}',
  ES: '{1} te he mencionado en un comentario: {2}',
		},
	},
  GROUPCREATED:
	{
  KEY: 'GROUPCREATED',
  TYPE: '9',
  MSG:
		{
  EN: '{1} just created a group {2}.',
  TW: '{1}新增了一個群組{2}.',
  CN: '{1}创建了一个群组{2}.',
  JA: '{1}がグループをつくりました{2}',
  ES: '{1} ha creado el grupo {2}.',
		},
	},
  INVITE:
	{
  KEY: 'INVITE',
  TYPE: '10',
  MSG:
		{
  EN: '{1} invited you to join the group {2}.',
  TW: '{1}邀請您加入群組{2}.',
  CN: '{1}邀请您加入群组{2}.',
  JA: '{1} te ha invitado al grupo {2}.',
  ES: '{1}があなたをグループに招待しています{2}.',
		},
	},
  ACCEPTED:
	{
  KEY: 'ACCEPTED',
  TYPE: '11',
  MSG:
		{
  EN: '{1} accepted your invitation to join the group {2}.',
  TW: '{1}加入申請已被通過{2}.',
  CN: '{1}加入申请已被通过{2}.',
  JA: '{1}があなたの招待を承認しました{2}.',
  ES: '{1} ha aceptado tu invitacion a el grupo {2}.',
		},
	},
  KICKED:
	{
  KEY: 'KICKED',
  TYPE: '12',
  MSG:
		{
  EN: '{1} kicked you out of the group {2}.',
  TW: '{1} kicked you out of the group {2}.',
  CN: '{1} kicked you out of the group {2}.',
  JA: '{1}があなたをグループから外しました{2}.',
  ES: '{1} te han expulsado del grupo {2}.',
		},
	},
  GROUPDELETED:
	{
  KEY: 'GROUPDELETED',
  TYPE: '13',
  MSG:
		{
  EN: '{1} just deleted the group {2}.',
  TW: '{1}删除群组{2}.',
  CN: '{1}刪除群組{2}.',
  JA: '{1}がグループを削除しました{2}.',
  ES: '{1} ha borrado el grupo {2}.',
		},
	},
  POSTGROUP:
	{
  KEY: 'POSTGROUP',
  TYPE: '14',
  MSG:
		{
  EN: '{1} just made a post in {2}: {3}.',
  TW: '{1}發佈一則文章:{2}.',
  CN: '{1}发布一則帖:{2}',
  JA: '{1}が{2}に投稿しました: {3}',
  ES: '{1} ha creado un post en {2}: {3}',
		},
	},
  REQUESTTOJOIN:
	{
  KEY: 'REQUESTTOJOIN',
  TYPE: '16',
  MSG:
		{
  EN: '{1} requested to join your group {2}.',
  TW: '{1}要求加入群組{2}.',
  CN: '{1}要求加入群組{2}.',
  JA: '{1}があなたのグループへの参加を求めています {2}.',
  ES: '{1} ha solicitado unirse al grupo {2}.',
		},
	},
  APPROVETOJOIN:
	{
  KEY: 'APPROVETOJOIN',
  TYPE: '17',
  MSG:
		{
  EN: '{1} approved you to join the group {2}.',
  TW: '{1}批准你加入群組{2}.',
  CN: '{1}批准你加入群組{2}.',
  JA: '{1}がグループ参加リクエストを承認しました{2}.',
  ES: '{1} ha aprobado tu solicitud para unirte al grupo {2}.',
		},
	},
  ECONCALENDAR:
	{
  KEY: 'ECONCALENDAR',
  TYPE: 18,
  MSG:
		{
  EN: '[{1}] {2} will be released at {3}',
  TW: '[{1}] {2}公佈{3}',
  CN: '[{1}] {2}公布{3}',
  JA: '[{1}] {2}は{3}に公開されます',
  ES: '[{1}] {2} será publicado {3}',
		},
	},
  COMMENTLIKE:
	{
  KEY: 'COMMENTLIKE',
  TYPE: '19',
  MSG:
		{
  EN: '<b>{1}</b> liked your comment: {2}',
  TW: '<b>{1}</b>喜歡你的留言:{2}',
  CN: '<b>{1}</b>喜欢你的留言:{2}',
  JA: '<b>{1}</b>があなたのコメントにいいねといっています:{2}',
  ES: '<b>{1}</b> le ha gustado tu comentario: {2}',
		},
	},
  TOP_PERFORMANCE:
	{
  KEY: 'TOP_PERFORMANCE',
  TYPE: '20',
  MSG:
		{
  EN: 'Great job! You are currently in the top {2} of the <b>{1}</b>',
  TW: '太棒了！您在<b>{1}</b>中排前{2}名！',
  CN: '太棒了！您在<b>{1}</b>中排前{2}名！',
  JA: 'すばらしい！あなたは今<b>{1}</b>の暫定トップ{2}です',
  ES: '¡Buen trabajo! Actualmente estás en el top {2} de el <b>{1}</b>',
		},
	},
  CONTEST_FINAL_RANKING:
	{
  KEY: 'CONTEST_FINAL_RANKING',
  TYPE: '21',
  MSG:
		{
  EN: 'Congratulations! Final Top 3 of <b>{1}</b>: \n1st: <b>{2}</b>, {3} {4}, win {5}{6} \n2nd: <b>{7}</b>, {8} {9}, win {10}{11} \n3rd: <b>{12}</b>, {13} {14}, win {15}{16}',
  TW: '<b>{1}</b> 總排名: \n1st: <b>{2}</b>, {3} {4}, win {5}{6} \n2nd: <b>{7}</b>, {8} {9}, win {10}{11} \n3rd: <b>{12}</b>, {13} {14}, win {15}{16}',
  CN: '<b>{1}</b> 总排名: \n1st: <b>{2}</b>, {3} {4}, win {5}{6} \n2nd: <b>{7}</b>, {8} {9}, win {10}{11} \n3rd: <b>{12}</b>, {13} {14}, win {15}{16}',
  JA: '<b>{1}</b> の最終トップ3: \n1位: <b>{2}</b>, {3} {4}, win {5}{6} \n2位: <b>{7}</b>, {8} {9}, win {10}{11} \n3位: <b>{12}</b>, {13} {14}, win {15}{16}',
  ES: 'Finales Top3 {1}: \n1ro: <b>{2}</b>, {3} {4}, gana {5}{6} \n2do: <b>{7}</b>, {8} {9}, gana {10}{11} \n3to: <b>{12}</b>, {13} {14}, gana {15}{16}',

		},
	},
  CONTEST_CANCELLED:
	{
  KEY: 'CONTEST_CANCELLED',
  TYPE: '22',
  MSG:
		{
  EN: 'Sorry, <b>{1}</b> has been cancelled.',
  TW: '<b>{1}</b>已被取消',
  CN: '<b>{1}</b>已被取消',
  JA: '<b>{1}</b>はキャンセルされました',
  ES: 'Lo siento, <b>{1}</b> ha sido cancelado.',
		},
	},
  CONTEST_ACTIVATED:
	{
  KEY: 'CONTEST_ACTIVATED',
  TYPE: '23',
  MSG:
		{
  EN: '<b>{1}</b> is activated! It will start on {2}.',
  TW: '<b>{1}</b>: 比賽啟動！將於{2}開始',
  CN: '<b>{1}</b>: 大赛启动！将于{2}开始',
  JA: '<b>{1}</b>が{2}に開始します！',
  ES: '<b>{1}</b> ha sido activado! Comenzará en {2}.',
		},
	},
  CONTEST_NEED_PEOPLE:
	{
  KEY: 'CONTEST_NEED_PEOPLE',
  TYPE: '24',
  MSG:
		{
  EN: 'You\'re almost there! Only {1} more people needed to activate <b>{2}</b>.',
  TW: '再{1}人參賽才能啟動比賽',
  CN: '再{1}人参赛才能启动大赛',
  JA: '{1}を開始させるにはあと<b>{2}</b>人の参加が必要です',
  ES: 'Ya casi estás allì! Solo {1} personas más para activar <b>{2}</b>.',
		},
	},
  CONTEST_START_SOON:
	{
  KEY: 'CONTEST_START_SOON',
  TYPE: '25',
  MSG:
		{
  EN: '<b>{1}</b> starts tomorrow! Good luck!',
  TW: '<b>{1}</b>大賽將於明天開始!',
  CN: '<b>{1}</b>大赛将于明天开始!',
  JA: '<b>{1}</b>は明日開始されます！頑張ってください！',
  ES: '<b>{1}</b> comienza mañana! Buena Suerte!',
		},
	},
  CONTEST_INVITATION:
	{
  KEY: 'CONTEST_INVITATION',
  TYPE: '26',
  MSG:
		{
  EN: '<b>{1}</b> invited you to join the contest <b>{2}</b>. ',
  TW: '<b>{1}</b>邀請你參加比賽<b>{2}</b>.',
  CN: '<b>{1}</b>邀请你参加比赛<b>{2}</b>.',
  JA: '<b>{1}</b>があなたをコンテストに招待しました<b>{2}</b>.',
  ES: '<b>{1}</b> te ha invitado a unirte al grupo <b>{2}</b>.',
		},
	},
  CONTEST_END_SOON:
	{
  KEY: 'CONTEST_END_SOON',
  TYPE: '27',
  MSG:
		{
  EN: '<b>{1}</b> ends in {2} day(s). Good luck!',
  TW: '<b>{1}</b>大賽將於{2}天後結束',
  CN: '<b>{1}</b>大赛将于{2}天后结束',
  JA: '<b>{1}</b>はあと{2}日で終了します。頑張ってください！',
  ES: '<b>{1}</b> finaliza en {2} día(s). Buena Suerte!',
		},
	},
  CONTEST_PERFORMANCE:
	{
  KEY: 'CONTEST_END_SOON',
  TYPE: '35',
  MSG:
		{
  EN: '<b>{1}</b> Current Top 3: \n1st: <b>{2}</b>, {3} {4} \n2nd: <b>{5}</b>, {6} {7} \n3rd: <b>{8}</b>, {9} {10}',
  TW: '<b>{1}</b> 目前排名: \n1st: <b>{2}</b>, {3} {4} \n2nd: <b>{5}</b>, {6} {7} \n3rd: <b>{8}</b>, {9} {10}',
  CN: '<b>{1}</b> 当前排名: \n1st: <b>{2}</b>, {3} {4} \n2nd: <b>{5}</b>, {6} {7} \n3rd: <b>{8}</b>, {9} {10}',
  JA: '<b>{1}</b> 暫定トップ3: \n1st: <b>{2}</b>, {3} {4} \n2nd: <b>{5}</b>, {6} {7} \n3rd: <b>{8}</b>, {9} {10}',
  ES: '<b>{1}</b> Actual Top 3: \n1st: <b>{2}</b>, {3} {4} \n2nd: <b>{5}</b>, {6} {7} \n3rd: <b>{8}</b>, {9} {10}',

		},
	},
};

notifyType.genNotifyMsg = function(type, ln, params) {
  return _genNotifyMsg(type, ln, params);
};

notifyType.genAllNotifyMsg = function(type, params) {
  var allMsgs = notifyType[type]['MSG'];
  var rtnMsgJson = {};
  for (var msgKey in allMsgs)
  {
    rtnMsgJson[msgKey] = _genNotifyMsg(type, msgKey, params);
  }

  return rtnMsgJson;
};

function _genNotifyMsg(type, ln, params)
{
  var msgObj = notifyType[type]['MSG'][ln];
  if (!msgObj)
      msgObj = notifyType[type]['MSG'][defMsg];

  return _inject_data(msgObj, params);
}

function _inject_data(msg, params)
{
  for (var ii = 0; ii < params.length; ii++)
  {
    msg = msg.replace('{' + (ii + 1) + '}', params[ii]);
  }

  return msg;
}

notifyType.defMsg = defMsg;

module.exports = notifyType;
