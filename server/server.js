const mosca = require('mosca');

var mqttPort = process.env.PORT || 3000;

var authenticate = function(client, username, password, callback) {
  var authorized = (username === 'nodeMCU-felix' && password.toString() === 'testpassword');
  if (authorized) client.user = username;
  callback(null, authorized);
}

var pubsubsettings = {
  //using ascoltatore
  type: 'mongo',
  url: process.env.MONGOLAB_URI || process.env.MONGODBURI,
  pubsubCollection: 'mqtt',
  mongo: {}
};

var moscaSettings = {
  port: mqttPort,			//mosca (mqtt) port
  backend: pubsubsettings	//pubsubsettings is the object we created above

};

var mqttServer = new mosca.Server(moscaSettings);	//here we start mosca

mqttServer.on('clientConnected', function(client) {
  console.log('client connected', client.id);
});

mqttServer.on('clientDisconnected', function(client) {
  console.log('client disconnected', client.id);
});

mqttServer.on('published', function(packet, client) {
  console.log(packet);
});

mqttServer.on('subscribed', function(topic, client) {
  console.log('subscribed: ' + client.id);
});

mqttServer.on('unsubscribed', function(topic, client) {
  console.log('unsubscribed: ' + client.id);
});

mqttServer.on('ready', function() {
  console.log(`MQTT server is up and running on port: ${mqttPort}`)
  mqttServer.authenticate = authenticate;
});
