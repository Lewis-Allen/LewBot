var tmi = require('tmi.js');
var env = require('dotenv/config');
var count = require('./counting/counts.js');

var channel = process.env.CHANNEL;

var options = {
   options: {
        debug: true
   },
    connection: {
        cluster: "aws",
        reconnect: true
    },
    identity: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD 
    },
    channels: [channel]
};

var client = new tmi.client(options);
client.connect();

// Functions
var introduction = "Hello, i'm a baby bot."


// When the client connects.
client.on("connected", function(address, port) {
    client.say(channel, introduction);
});

// When the client disconnects.
client.on("disconnected", function(reason) {
   console.log("Disconnected due to: \n" + reason); 
});

// Subscriptions
client.on("subscription", function(channel, username, method){
    client.say("Thankyou for subscribing " + username + "!");
});

// Responding to chat.
client.on("chat", function(channel, user, message, self) {
    if(self)
        return;
    
    count.increase('Messages');
    
    if(message.includes("Kappa") && message !== "!Kappa"){
        count.increase('Kappa');
    }
    
    if(message.includes("SMOrc") && message !== "!SMOrc"){
        count.increase('SMOrc');
    }
    
    if(message === "!Kappa"){
        client.say(channel, count.get('Kappa') + " Kappa");
    }
    
    if(message === "!SMOrc"){
        client.say(channel, count.get('SMOrc') + " SMOrc");
    }
    
    if(message === "!twitter"){
        client.say(channel,"I don't have a Twitter lol");
    }
    
    if(message === "!youtube"){
        client.say(channel,"I don't have a Youtube");
    }
    
    if(message === "!code"){
        client.say(channel,"The code can be found on my GitHub at - ");
    }
    
    if(message === "!messages"){
        client.say(channel, "Total messages: " + count.get('Messages'));
    }
    
    // Mod commands
    if (user.mod) {
        
        if(message.substr(0,6) === "!reset"){
            var name = message.trim().split(" ");
            if(name.length != 2) {
                client.say(channel, "!reset <count>");
                return;
            }   
            
            if(count.reset(name[1].trim())){ 
                client.say(channel, "Counts reset");
            } else {
                client.say(channel, "Count for " + name[1] + " doesn't exist");
            }
        }
        
        if(message.substr(0,4) === ("!mod")){ 
            var name = message.trim().split(" ");
            if(name.length != 2) {
                client.say(channel, "!mod <username>");
                return;
            }
            
            client.say(channel, "Attempting to mod '" + name[1].trim() + "'...");
            client.mod(channel, name[1].trim());         
        }
        
        if(message.substr(0,6) === ("!color")){
            var color = message.trim().split(" ");
            if(color.length != 2) {
                client.say(channel, "!color <color>");
                return;
            }

            client.color( color[1].trim() ).then(function(data) {              
                client.say(channel, "Changing my color to " + color[1].trim() + "!");
            }).catch(function(err) {
                client.say(channel, "That is not a valid color!");    
            });
        }
    }
});