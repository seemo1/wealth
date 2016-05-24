var aryMime = ['application/json', 'application/x-www-form-urlencoded', 'multipart/form-data'];

module.exports = function(server) {
  server.register({
    //註冊 hapijs plugin
    register: require('hapi-swaggered'),
    options: {
      requiredTags: ['social'],  //有此標籤的路徑才會有api docs(swagger)
      responseValidation: true, //驗證輸出資料格式
      produces: aryMime, //可輸出的格式
      consumes: aryMime, //可輸入的資料格式s
      tagging: {
        mode: 'path', //依路徑分群組
        pathLevel: 2  //路徑分組時的層次
      },
      //路徑分群組時的說明文字
      tags: {
        'social/v0': '社群功能',
        'symbolVote/v1': '投資標的的投票',
      },
      info: {
        title: 'FDT 社群功能 API',
        description: 'FDT 社群功能，社團，紛絲，貼文，通知，比賽等',
        version: '1.0',
      },
    }

    //選擇hapijs server.connection 中 labels: ['api']的路徑,
    //prefix設定產生swagger.json的路徑  http://hostname/swagger/swagger
  }, { select: 'api', routes: { prefix: '/swagger'} }, function(err) {
    if (err) {
      throw err;
    }
  });

  server.register({
    //註冊UI
    register: require('hapi-swaggered-ui'),
    options: {
      title: 'FDT API',

      //authorization: {
      //    field: 'apiKey',
      //    scope: 'query'
      //}
    }

    //設定UI操作介面路徑
  }, { select: 'api', routes: { prefix: '/docs'}}, function(err) {
    if (err) {
      throw err;
    }
  });

};
