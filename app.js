var tmi = require('tmi.js');
var env = require('dotenv/config')

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

client.on("subscription", function(channel, username, method){
    client.say("Thankyou for subscribing " + username + "!");
});

// Responding to chat.
client.on("chat", function(channel, user, message, self) {
    if(self)
        return;
    
    if(message === "!twitter"){
        client.say(channel,"I don't have a Twitter lol");
    }
    
    if(message === "!youtube"){
        client.say(channel,"I don't have a Youtube");
    }
    
    if(message === "!code"){
        client.say(channel,"The code can be found on my GitHub at - ");
    }
    
    // Mod commands
    if (user.mod) {
        
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