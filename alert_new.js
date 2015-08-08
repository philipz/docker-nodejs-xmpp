var mqtt = require('mqtt')
var d = new Date().getTime();
var rnd = Math.random().toFixed(5);
var client = mqtt.connect('mqtt://user:tradingbot@m2m.tradingbot.com.tw?clientId=nodejs_Alert'+d.toString()+rnd);
var client1 = mqtt.connect('mqtt://user:tradingbot@m2m.tradingbot.com.tw?clientId=nodejs_Alert1+'+d.toString()+rnd);
var xmpp = require('simple-xmpp');
var count = 0;
var sgxper = 0;
var txper = 0;
var txclose;
xmpp.on('error', function(err) {
            console.error(err);
});
xmpp.connect({
                jid                 : 'futuresbot@gmail.com',
                password            : 'PASSWORD',
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
		if (name.substring(0, 2) == "TX") {
			txper = Percent
			txclose = close
		} else {
			sgxper = Percent
		}
		var gap = Math.abs(sgxper - txper)
		var gap1 = sgxper - txper
		if (txper != 0 && sgxper != 0 && txclose != 0) {
		if (gap >= 0.2 && gap < 0.3 && count != 2) {
			count = 2
		callback.send('philipzheng@gmail.com', new Date().toLocaleTimeString() + ' Alert! Gap:' + gap1 + ' Per:' + txper + '% ' + txclose);
		} else if (gap >= 0.3 && gap < 0.4 && count != 3) {
			count = 3
		callback.send('philipzheng@gmail.com', new Date().toLocaleTimeString() + ' Alert! Gap:' + gap1 + ' Per:' + txper + '% ' + txclose);
		} else if (gap >= 0.4 && gap < 0.5 && count != 4) {
			count = 4
		callback.send('philipzheng@gmail.com', new Date().toLocaleTimeString() + ' Alert! Gap:' + gap1 + ' Per:' + txper + '% ' + txclose);
		} else if (gap >= 0.5 && count != 5) {
			count = 5
		callback.send('philipzheng@gmail.com', new Date().toLocaleTimeString() + ' Alert! Gap:' + gap1 + ' Per:' + txper + '% ' + txclose);
		}
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
client1.subscribe('BOT/TWN');
console.log('Starting!!!');

client.on('message', function (topic, message) {
	toPoint(message, xmpp);
});
client1.on('message', function (topic, message) {
	toPoint(message, xmpp);
});
