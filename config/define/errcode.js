/**
 * Created by CCMa on 5/9/15.
 */

var errcode =
{
  W200: {code: 200, error_code: 'W200', error_msg: ''},
  WUU001: {code: 400, error_code: 'WUU001', error_msg: 'Unknown error'},

  //add by Micah, compatibility for code.length = 6
  WUU200: {code: 200, error_code: 'WUU200', error_msg: ''}, //success
  WUU201: {code: 201, error_code: 'WUU201', error_msg: 'under construction or maintenance'}, //success
  WUU400: {code: 400, error_code: 'WUU400', error_msg: 'Unspecified error! Should replace this msg.'},
  WAT000: {code: 403, error_code: 'WAT000', error_msg: 'invalid auth token'},
  WAT001: {code: 403, error_code: 'WAT001', error_msg: 'token is expired'},

  // Auth_Token
  //"WA000" : "invalid auth token",
  //"WA001" : "token is expired",

  // getUserProfile
  WUB001: {code: 500, error_code: 'WUB001', error_msg: 'no such user with id : '},
  WUB002: {code: 400, error_code: 'WUB002', error_msg: 'User-Agent error'},
  WUB003: {code: 400, error_code: 'WUB003', error_msg: 'create IM account fail'},
  WUB004: {code: 400, error_code: 'WUB004', error_msg: 'create social_user_account fail'},

  // setUserPrfile
  WUB007: {code: 400, error_code: 'WUB007', error_msg: 'param birthday format error : '},
  WUB008: {code: 400, error_code: 'WUB008', error_msg: 'param sex Must be M or F : '},
  WUB009: {code: 400, error_code: 'WUB009', error_msg: 'email format error'},
  WUB010: {code: 400, error_code: 'WUB010', error_msg: 'email already exists'},
  WUB900: {code: 400, error_code: 'WUB900', error_msg: 'Cassandra error'},
  WUB901: {code: 400, error_code: 'WUB901', error_msg: 'Mysql error'},

  // restPassword
  WRP001: {code: 400, error_code: 'WRP001', error_msg: 'User does not exist, please try again.'}, // 用戶資料不存在
  WRP002: {code: 400, error_code: 'WRP002', error_msg: 'Your FDT ID did not set an e-mail before, please contact customer service. E-mail: contact@hkfdt.com'}, // FDT ID未綁定 Email
  WRP003: {code: 400, error_code: 'WRP003', error_msg: 'Your E-mail is invalid, please contact customer service. E-mail: contact@hkfdt.com'}, // email 格式內容有誤
  WRP099: {code: 400, error_code: 'WRP099', error_msg: 'System error, please try again.'}, // 程序過程中出現錯誤

  // setReferralCode

  WRC002: {code: 400, error_code: 'WRC002', error_msg: 'You cannot invite yourself.'},
  WRC003: {code: 400, error_code: 'WRC003', error_msg: 'You have already joined invitation.'},
  WRC004: {code: 400, error_code: 'WRC004', error_msg: 'Your code is invalid, please try again.'},
  WRC005: {code: 400, error_code: 'WRC005', error_msg: 'Your Coin add fail'},

  //Contest
  WCT001: {code: 400, error_code: 'WCT001', error_msg: 'Parameters error.'}, // router error
  WCT002: {code: 400, error_code: 'WCT002', error_msg: 'Parameters analyse error.'}, // controller error
  WCT003: {code: 400, error_code: 'WCT003', error_msg: 'Get contestRanking system information failed.'},
  WCT004: {code: 400, error_code: 'WCT004', error_msg: 'Get contestRanking status failed.'},
  WCT005: {code: 400, error_code: 'WCT005', error_msg: 'Get going contestRanking list failed.'},
  WCT006: {code: 400, error_code: 'WCT006', error_msg: 'Get ready contestRanking list failed.'},
  WCT007: {code: 400, error_code: 'WCT007', error_msg: 'Get contest information failed.'},
  WCT008: {code: 400, error_code: 'WCT008', error_msg: 'Please upgrade to latest version and click on the link again. Thanks!'},
  WCT009: {code: 400, error_code: 'WCT009', error_msg: 'Get user information failed.'},
  WCT010: {code: 400, error_code: 'WCT010', error_msg: 'Get user information data failed.'},
  WCT011: {code: 400, error_code: 'WCT011', error_msg: 'Get user information data count failed.'},
  WCT012: {code: 400, error_code: 'WCT012', error_msg: 'Check Join the contest failed.'},
  WCT013: {code: 400, error_code: 'WCT013', error_msg: 'Get going contestRanking list failed.'},
  WCT014: {code: 400, error_code: 'WCT014', error_msg: 'Get past contestRanking list failed.'},

  WCT015: {code: 400, error_code: 'WCT015', error_msg: 'This contest has expired.'},
  WCT016: {code: 400, error_code: 'WCT016', error_msg: 'Sorry. You are not qualified to join the contest.'},
  WCT017: {code: 400, error_code: 'WCT017', error_msg: 'Has joined.'},
  WCT018: {code: 400, error_code: 'WCT018', error_msg: 'Contest information date update was failed.'},

  //WCT019 : {code : 400, error_code : "WCT019", error_msg : "Contest Join process was failed."},

  WCT900: {code: 400, error_code: 'WCT900', error_msg: ''}, // server error message

  //WCT0033 : {code : 400, error_code : "WCT002", error_msg : "User error."},
  //WCT0044 : {code : 400, error_code : "WCT003", error_msg : "This contest has expired."},
  //WCT0055 : {code : 400, error_code : "WCT004", error_msg : "Sorry. You do not qualify to join the contest."},
  //WCT0066 : {code : 400, error_code : "WCT005", error_msg : "Sorry. The contest is not in progress."},
  //WCT0077 : {code : 400, error_code : "WCT006", error_msg : "User does not exist."},

  // Group
  WUG001: {code: 400, error_code: 'WUG001', error_msg: 'parameter error'},
  WUG002: {code: 400, error_code: 'WUG002', error_msg: 'invalid auth token'},
  WUG003: {code: 400, error_code: 'WUG003', error_msg: 'group name \'%s\' already exist'},
  WUG004: {code: 400, error_code: 'WUG004', error_msg: 'user no right to delete group'},
  WUG005: {code: 400, error_code: 'WUG005', error_msg: 'no such group'},
  WUG006: {code: 400, error_code: 'WUG006', error_msg: 'cannot disapprove'},
  WUG007: {code: 400, error_code: 'WUG007', error_msg: 'no such user'},
  WUG008: {code: 400, error_code: 'WUG008', error_msg: 'cannot request to join, already is member'},
  WUG009: {code: 400, error_code: 'WUG009', error_msg: 'cannot request to join, already requested'},
  WUG010: {code: 400, error_code: 'WUG010', error_msg: 'user not in the invited list'},
  WUG011: {code: 400, error_code: 'WUG011', error_msg: 'group name \'%s\' already exist'},
  WUG012: {code: 400, error_code: 'WUG012', error_msg: 'not in group cannot set'},
  WUG013: {code: 400, error_code: 'WUG013', error_msg: 'not creator'},
  WUG014: {code: 400, error_code: 'WUG014', error_msg: 'cannot approve'},
  WUG015: {code: 400, error_code: 'WUG015', error_msg: 'exceed maximum number of members'},

  WUG900: {code: 500, error_code: 'WUG900', error_msg: 'cassandra error'},
  WUG901: {code: 500, error_code: 'WUG901', error_msg: 'mysql error'},
  WUG999: {code: 500, error_code: 'WUG999', error_msg: 'Unknown error'},

  // Transaction
  WUT001: {code: 400, error_code: 'WUT001', error_msg: 'parameter error'},
  WUT002: {code: 400, error_code: 'WUT002', error_msg: 'User-Agent error'},
  WUT003: {code: 400, error_code: 'WUT003', error_msg: 'Account Not Exist'},
  WUT004: {code: 400, error_code: 'WUT004', error_msg: 'Not Enough Coin'},
  WUT005: {code: 400, error_code: 'WUT005', error_msg: 'Coin Status Not Init'},
  WUT006: {code: 400, error_code: 'WUT006', error_msg: 'Coin Record Not Exist'},
  WUT007: {code: 400, error_code: 'WUT007', error_msg: 'Not Enough Fuel'},
  WUT900: {code: 500, error_code: 'WUT900', error_msg: 'mysql error'},

  //Follow
  WUF001: {code: 400, error_code: 'WUF001', error_msg: 'user cannot follow him/herself'},
  WUF002: {code: 400, error_code: 'WUF002', error_msg: 'User does not enough coins'},
  WUF003: {code: 400, error_code: 'WUF003', error_msg: 'the user already followed'},
  WUF004: {code: 400, error_code: 'WUF004', error_msg: 'no such user'},
  WUF005: {code: 400, error_code: 'WUF005', error_msg: 'the user not followed'},
  WUF006: {code: 400, error_code: 'WUF006', error_msg: 'Can\'t unfollow the system account'},

  WUF900: {code: 500, error_code: 'WUF900', error_msg: 'mysql error'},

  //Ranking
  WUR900: {code: 500, error_code: 'WUR900', error_msg: 'mysql error'},

  //Symbol vote
  WSV001: {code: 400, error_code: 'WSV001', error_msg: 'parameters error'},
  WSV002: {code: 400, error_code: 'WSV002', error_msg: 'wrong voting type'},

  //Social Post
  WSP001: {code: 400, error_code: 'WSP001', error_msg: 'userid does not exist'},
  WSP002: {code: 400, error_code: 'WSP002', error_msg: 'user no right to delete post'},
  WSP003: {code: 400, error_code: 'WSP003', error_msg: 'no such post'},
  WSP004: {code: 400, error_code: 'WSP004', error_msg: 'You had reported'},
  WSP005: {code: 400, error_code: 'WSP005', error_msg: 'Option is not available'},
  WSP006: {code: 200, error_code: 'WSP006', error_msg: 'no more data'},

  WCM001: {code: 400, error_code: 'WCM001', error_msg: 'Post not found'},
  WCM002: {code: 400, error_code: 'WCM002', error_msg: 'Invalid group id'},
  WCM003: {code: 400, error_code: 'WCM003', error_msg: 'Cannot find group member'},
  WCM004: {code: 400, error_code: 'WCM004', error_msg: 'Error on getting user info'},
  WCM005: {code: 400, error_code: 'WCM005', error_msg: 'Error on saving comment'},
  WCM006: {code: 400, error_code: 'WCM006', error_msg: 'Error on update post counter'},
  WCM007: {code: 400, error_code: 'WCM007', error_msg: 'Error on like comment'},
  WCM008: {code: 400, error_code: 'WCM008', error_msg: 'Error on unlike comment'},
  WCM009: {code: 400, error_code: 'WCM009', error_msg: 'Comment not found'},
  WCM010: {code: 400, error_code: 'WCM010', error_msg: 'Error on delete comment'},
  WCM011: {code: 400, error_code: 'WCM011', error_msg: 'User is does not belong to comment'},

  // User Coin & Fuel (Wallet)
  WUW001: {code: 400, error_code: 'WUW001', error_msg: 'user id is null'},  // userId 參數空白
  WUW002: {code: 400, error_code: 'WUW002', error_msg: 'user id is illegal' },  // userId 參數非法

  WUW010: {code: 400, error_code: 'WUW010'},  // error on database connection
  WUW011: {code: 400, error_code: 'WUW011', error_msg: 'not find user'},  // not find user
  WUW012: {code: 400, error_code: 'WUW012'},  // fuel兌換數量異常 . 如 fuel 持有 500 , 卻發送要 999 的異常數量
  WUW013: {code: 400, error_code: 'WUW013'},  // 現有的fuel數量低於fuelHold，無法進行兌換作業 . 如 fuelHold設定100 , 該用戶fuel持有數量 >= 100
  WUW098: {code: 400, error_code: 'WUW098', error_msg: 'user counter error'},  // 查詢用戶資料筆數異常
  WUW099: {code: 400, error_code: 'WUW099', error_msg: 'user query error'},  // 獲取資料失敗

  // Fuel Setting
  WUF098: {code: 400, error_code: 'WUF098', error_msg: 'Fuel counter error'},  // 設定檔的數量不如預期
  WUF099: {code: 400, error_code: 'WUF099', error_msg: 'Fuel query error'},  // 獲取資料失敗

  // Check user referral
  WUR001: {code: 400, error_code: 'WUR001', error_msg: 'Referral code invalid'},  // Referral code 無效
  WUR002: {code: 400, error_code: 'WUR002', error_msg: 'Data format incorrect'}, // 各式或是其他錯誤

  //Suggest User
  WUS001: {code: 400, error_code: 'WUS001', error_msg: 'MySQL GetPopularTrader Error'},
  WUS002: {code: 400, error_code: 'WUS002', error_msg: 'MySQL GetTopTrader Error'},
  WUS003: {code: 400, error_code: 'WUS003', error_msg: 'MySQL UploadPhoneList Error'},
  WUS004: {code: 400, error_code: 'WUS004', error_msg: 'MySQL UploadSocialList Error'},
  WUS005: {code: 400, error_code: 'WUS005', error_msg: 'MySQL GetWishList Error'},
  WUS900: {code: 400, error_code: 'WUS900', error_msg: 'MySQL Error'},

  WSC001: {code: 400, error_code: 'WSC001', error_msg: 'Invalid region'},
  WSC002: {code: 400, error_code: 'WSC002', error_msg: 'Not found'},

  // Announce
  WAN204: {code: 204, error_code: 'WAN204', error_msg: 'No available announcement'},
};

module.exports = errcode;
