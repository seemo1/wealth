'use strict';

var messageKey = require('./message-key');
var message = {};

message[messageKey.INBOX_FOLLOW.str] = '{1} ha comenzado a seguirte.';
message[messageKey.INBOX_LIKE.str] = '{1} le ha gustado tu post: {2}';
message[messageKey.INBOX_COMMENT.str] = '{1} ha dejado un comentario en tu post: {2}';
message[messageKey.INBOX_MENTIONPOST.str] = '{1} te ha mencionado en un post: {2}';
message[messageKey.INBOX_MENTIONCOMMENT.str] = '{1} te he mencionado en un comentario: {2}';
message[messageKey.INBOX_GROUPCREATED.str] = '{1} ha creado el grupo {2}.';
message[messageKey.INBOX_INVITE.str] = '{1}があなたをグループに招待しています{2}.';
message[messageKey.INBOX_ACCEPTED.str] = '{1} ha aceptado tu invitacion a el grupo {2}.';
message[messageKey.INBOX_KICKED.str] = '{1} te han expulsado del grupo {2}.';
message[messageKey.INBOX_GROUPDELETED.str] = '{1} ha borrado el grupo {2}.';
message[messageKey.INBOX_POSTGROUP.str] = '{1} ha creado un post en {2}: {3}';
message[messageKey.INBOX_CONTEST_PERFORMANCE.str] = '<b>{1}</b> Actual Top 3: \n1st: <b>{2}</b>, {3} {4} \n2nd: <b>{5}</b>, {6} {7} \n3rd: <b>{8}</b>, {9} {10}';
message[messageKey.INBOX_REQUESTTOJOIN.str] = '{1} ha solicitado unirse al grupo {2}.';
message[messageKey.INBOX_APPROVETOJOIN.str] = '{1} ha aprobado tu solicitud para unirte al grupo {2}.';
message[messageKey.INBOX_ECONCALENDAR.str] = '[{1}] {2} será publicado {3}';
message[messageKey.INBOX_COMMENTLIKE.str] = '{1} le ha gustado tu comentario: {2}';
message[messageKey.INBOX_TOP_PERFORMANCE.str] = '¡Buen trabajo! Actualmente estás en el top {2} de el <b>{1}</b>';
message[messageKey.INBOX_CONTEST_FINAL_RANKING.str] = 'Finales Top3 {1}: \n1ro: <b>{2}</b>, {3} {4}, gana {5}{6} \n2do: <b>{7}</b>, {8} {9}, gana {10}{11} \n3to: <b>{12}</b>, {13} {14}, gana {15}{16}';
message[messageKey.INBOX_CONTEST_CANCELLED.str] = 'Lo siento, <b>{1}</b> ha sido cancelado.';
message[messageKey.INBOX_CONTEST_ACTIVATED.str] = '<b>{1}</b> ha sido activado! Comenzará en {2}.';
message[messageKey.INBOX_CONTEST_NEED_PEOPLE.str] = 'Ya casi estás allì! Solo {1} personas más para activar <b>{2}</b>.';
message[messageKey.INBOX_CONTEST_START_SOON.str] = '<b>{1}</b> comienza mañana! Buena Suerte!';
message[messageKey.INBOX_CONTEST_END_SOON.str] = '<b>{1}</b> finaliza en {2} día(s). Buena Suerte!';
message[messageKey.INBOX_CONTEST_INVITATION.str] = '<b>{1}</b> te ha invitado a unirte al grupo <b>{2}</b>.';
message[messageKey.REFERRAL_INVALID_CODE.str] = 'Your code is invalid, please try again.';
message[messageKey.REFERRAL_MUTUAL_INVITE.str] = 'You already invited {1} to join, try another one!';
message[messageKey.REFERRAL_INVITE_SELF.str] = 'You cannot invite yourself';
message[messageKey.REFERRAL_CONFIRMED.str] = 'Tu código de referencia ha sido confirmado por <b>{1}</b>, has recibido {2} moneda!';
message[messageKey.FUEL_EXCHANGE.str] = 'Good job! Your FDT Fuel score is above {1}! You can now exchange {2} fuel points for 1 coin.';
message[messageKey.FUEL_FULL.str] = 'Wow! Your FDT Fuel is full! Exchange for coins now!';
message[messageKey.FUEL_LOW.str] = 'Your FDT Fuel is almost consumed. Make trades or post on “Timelines” to gain more Fuel now!';

module.exports = message;
