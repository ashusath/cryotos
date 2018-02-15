var Alexa = require('alexa-sdk');
var http = require('http');
var https = require('https');

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {
  'LaunchRequest': function () {
    this.emit('GetBTCPrice');
  },
  'GetBTCPrice': function() {
    getBTCHttp((data) => {
      var outputSpeech = "the price for 1 bitcoin is $"+ data[0].price_usd + ".";
      this.emit(':tell', outputSpeech);
    });
  },
  'GetBTCPriceForCountry': function() {
    var countryName = this.event.request.intent.slots.country.value;
    if (String(countryName) != "India") {
      this.emit("AMAZON.HelpIntent");
      return;
    }
    getBTCHttpForCountry(countryName,(data) => {
      var outputSpeech = "the price for 1 bitcoin in "+countryName+" is Rs "+ Math.round(data[0].price_inr) + ".";
      this.emit(':tell', outputSpeech);
    });
  },
  'AMAZON.HelpIntent': function () {
      this.emit(':ask', "I cannot find the country you requested. Please refer the list of countries that we supports", "How can I help?");
  },
  'AMAZON.CancelIntent': function () {
      this.emit(':tell', "Okay!");
  },
  'AMAZON.StopIntent': function () {
      this.emit(':tell', "Goodbye!");
  }
};

function getBTCHttpForCountry(countryName,callback) {
  console.log("country is "+ countryName);
  //https://api.coinmarketcap.com/v1/ticker/bitcoin/
  var options = {
    host: 'api.coinmarketcap.com',
    port: 443,
    path: '/v1/ticker/bitcoin/?convert=INR',
    method: 'GET'
  };

  var req = https.request(options, res => {
      res.setEncoding('utf8');
      var returnData = "";

      res.on('data', chunk => {
          returnData = returnData + chunk;
      });

      res.on('end', () => {
        var result = JSON.parse(returnData);
        callback(result);
      });

  });
  req.end();
}

function getBTCHttp(callback) {
  //https://api.coinmarketcap.com/v1/ticker/bitcoin/
  var options = {
    host: 'api.coinmarketcap.com',
    port: 443,
    path: '/v1/ticker/bitcoin/',
    method: 'GET'
  };

  var req = https.request(options, res => {
      res.setEncoding('utf8');
      var returnData = "";

      res.on('data', chunk => {
          returnData = returnData + chunk;
      });

      res.on('end', () => {
        var result = JSON.parse(returnData);
        callback(result);
      });

  });
  req.end();
}
