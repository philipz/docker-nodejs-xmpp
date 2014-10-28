var mqtt = require('mqtt')
  , client = mqtt.connect('mqtt://username:password@m2m.tradingbot.com.tw?clientId=nodejs_Alert');
var xmpp = require('simple-xmpp');
var count = 0;
xmpp.on('error', function(err) {
            console.error(err);
});
xmpp.connect({
                jid                 : 'yourname@gmail.com',
                password            : 'password',
                host                : 'talk.google.com',
                port                : 5222
});

function toPoint(message, callback) {
	var temp = message.split(",");
	if (temp.length > 10) {
	   try {
		var name = temp[0];
		var Bid = parseFloat(temp[1]);
		var Bc = parseInt(temp[2]);
		var Ask = parseFloat(temp[3]);
		var Ac = parseInt(temp[4]);
		var close = parseFloat(temp[5]);
		var high = parseFloat(temp[6]);
		var low = parseFloat(temp[7]);
		var TickQty = parseInt(temp[8]);
		var TQty = parseInt(temp[9]);
		var Ref = parseFloat(temp[10]);
		var Percent = ((close / Ref) - 1) * 100;
		Percent = Percent.toFixed(5);
		if (Percent == Infinity || Percent == NaN) {
			return null;
		}
		var count_temp = Math.abs(parseInt(Percent)) % 7
		if (count_temp == 0 && count != 0) {
			count = count_temp;
		} else if (count != count_temp) {
			callback.send('yourfriend@gmail.com', new Date().toLocaleTimeString() + ' Alert! ' + count_temp + '% ' + close);
			count = count_temp;
		}
		//return [name , points]; 
	   } catch (ex) {
   		console.error(ex);
  	   }
	} else {
		return null;
	}
}

client.subscribe('BOT/TX00');

client.on('message', function (topic, message) {
	toPoint(message, xmpp);
});
