var url = require("url");
var Crawler = require('./crawler/crawler.js').Crawler;
var request = require('request');
var fs = require('fs');

//Some config
var cacheFileName = 'coordCache.ex'
, ccfHandle = fs.openSync(cacheFileName, "w", 0666)
, baseURL = "http://montreal.en.craigslist.ca/apa/"
, coordsCacheArray = []
//This is used to keep track of wether we're finished
//geocoding everything in the queue.
, geocoded = 0
, pages = 0;

function writeCoordCache() {

  var str = "var coordCache = ";
  str     += JSON.stringify(coordsCacheArray);
  str     += ";\n";

  console.log('started writing');
  fs.write(ccfHandle, str);
  console.log('finished writing');
  fs.close(ccfHandle);
}

//Geocoder function
function geoCode(clPost) {
  //geocoding API url + dev key
  var base = "http://where.yahooapis.com/geocode?appid=YOUR_YAHOO_API_KEY&flags=CJ&q=";
  var queryURL = base + clPost.gqAddress;

  request({uri: queryURL, method: 'GET'}, function (error, response, body) {

    var response  = body && JSON.parse(body)
    , results     = response.ResultSet.Results;

    if (typeof results !== "undefined" && results !== null) {
      var results = results[0]
      , coords = { lat : results.latitude
                 , lng : results.longitude
                 };

      clPost.coords = coords;
      coordsCacheArray.push(clPost);

    }
    else {
      console.log("Geocoding failed!");
      console.log(error);
      checkState();
    }

    console.log(geocoded + ": " + clPost.clURL);
    checkState();
  });

}

function checkState() {
    geocoded--;
    console.log("Geocoded: " + geocoded);
    if (!geocoded) {
      console.log("Pages: " + pages);
      if (!pages) writeCoordCache();
    }
}

var processPost = function processPostBody() {
  var $         = this.jQuery
  , addressLink = $("small > a").attr("href")
  , postTitle   = $("h2").text()
  , rent        = postTitle.match(/(\$\d{3,})/)
  , bedrooms    = postTitle.match(/(\dbr)/)
  , postBody    = null
  , qAddress    = ""
  , imageList   = null
  , clPostID    = $("span.postingidtext").text().split(":")[1].trim()
  , clPostObj   = { };

  //preprocess, remove images div.
  $(".iw").remove();
  $("#userbody script").remove();
  postBody = $("#userbody").html();

  if (typeof addressLink !== 'undefined' && addressLink !== null) {
    //Use url.parse to extract the query portion of the url and split based on loc argument.
    //We're not decoding the url here because we will use it shortly for geocoding
    //the address.
    qAddress = url.parse(addressLink, true).search.split('loc%3A+')[1];

    clPostObj.title     = postTitle;
    clPostObj.body      = postBody;
    clPostObj.clURL     = baseURL + clPostID + ".html";
    clPostObj.gqAddress = qAddress;
    clPostObj.bedrooms  = bedrooms ? parseInt(bedrooms[0].replace("br", "")) : 2;
    clPostObj.rent      = rent ? parseInt(rent[0].replace("$", "")) : 700;
    clPostObj.imageList = imageList;

    geoCode(clPostObj);
  }
  else {
    checkState();
    console.log('address link not found');
    console.log(geocoded + ":" + baseURL + clPostID + ".html");
  }
}

var pageCrawler = new Crawler({ callback: processPost });
var clCrawler = new Crawler({

  callback: function () {

    if (pages > 0) {
      var $ = this.jQuery
        , paras = $("p")
        , links = []
        , linkText

      console.log("Gathering links to crawl.\n");
      $.each(paras, function (index, value) {
        var pLink = $(value).children("a");
        if (pLink.length !== 0) {
          linkText = pLink.attr("href");
          links.push(linkText);
        }
      });

      console.log("Crawling pages.");
      geocoded = links.length + geocoded;
      pageCrawler.enqueue(links);

      console.log("Queueing next page for link gathering.\n");
      var nextPageLink = $("#nextpage").find("a").attr("href");
      nextPageLink && clCrawler.enqueue(baseURL + nextPageLink);
      pages--;
    }
    else {
      return;
    }
  }
});

pages = 4;
clCrawler.enqueue(baseURL);
