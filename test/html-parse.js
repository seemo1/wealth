var request = require("request");
var cheerio = require("cheerio");

request('http://www.4icu.org/reviews/index2.htm', function(error, response, body) {

  var $ = cheerio.load(body);
  var country, name;
  $('td table').each(function() {
    $(this).find('tr').each(function(){
      country = $(this).find('a').attr('href');
      if(country) {
        console.log(country.replace("/", "").replace("/", "") + ',' + $(this).find('a').text());
      }
      //console.log("=",$(this).text());
    })
    //console.log("=",$(this).text());

  });
});