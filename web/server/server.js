var http = require("http");
var os = require("os");
var mongo = require("mongodb").MongoClient;
var dns = require("dns");
var format = require("string-format");

var port = 8888;

var mongoHost = "mongo";
var mongoPort = 27017;
var mongoDbName = "exampleDb";

format.extend(String.prototype);

function resolveHostIp(host) {
  return new Promise(function (resolve, reject) {
    dns.lookup(host, function(err, result) {
      if (err) {
        reject("Error while resolving host '{}': {}".format(host, err));
      } else {
        resolve(result);
      }
    })
  });
};

function connectToDatabase(response) {
  return new Promise(function (resolve, reject) {
    mongo.connect("mongodb://{}:{}/{}".format(mongoHost, mongoPort, mongoDbName), function(err, db) {
      if (err) {
        response.write("Error while connecting to mongo: {}\n".format(err));
        reject();
      } else {
        response.write("Connected to mongo database\n");
        resolve();
      }
    })
  });
}

http.createServer(function(request, response) {
  // write ip of current machine
  resolveHostIp(os.hostname())
    .then(function (result) {
      response.write("Hello from {} running node {} on IP {}\n".format(os.hostname(), process.version, result));
      return;
    })

    // write ip of mongo server
    .then(function () { return resolveHostIp(mongoHost);})
    .then(function (result) {
      response.write("Mongo running on IP {}\n".format(result));
      return;
    })

    // connect to Mongo database and write status message to response
    .then(function () { return connectToDatabase(response); })
    
    // end
    .then(function () {
      response.end();
    })
    .catch(function (err) {
      response.write(err);
      response.end();
    });
}).listen(port);

console.log("Node.js http server running at port " + port);
