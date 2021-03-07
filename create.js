var AWS = require("aws-sdk");
var util = require("util");
var async = require("async");
var fs = require("fs");


AWS.config.update({
  region: "us-east-1",
});

var sns = new AWS.SNS();



function createTopic(cb) {
  sns.createTopic(
    {
      Name: "demo",
    },
    function (err, result) {
      if (err !== null) {
        console.log(util.inspect(err));
        return cb(err);
      }
      console.log(util.inspect(result));

      config.TopicArn = result.TopicArn;

      cb();
    }
  );
}

function snsSubscribe(cb) {
  sns.subscribe(
    {
      TopicArn: config.TopicArn,
      Protocol: "sqs",
      Endpoint: config.QueueArn,
    },
    function (err, result) {
      if (err !== null) {
        console.log(util.inspect(err));
        return cb(err);
      }

      console.log(util.inspect(result));

      cb();
    }
  );
}

function writeConfigFile(cb) {
  fs.writeFile("config.json", JSON.stringify(config, null, 4), function (err) {
    if (err) {
      return cb(err);
    }

    console.log("config saved to config.json");
    cb();
  });
}

async.series([
  createTopic,
  snsSubscribe,
  writeConfigFile,
]);
