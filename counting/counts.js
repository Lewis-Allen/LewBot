var storage = require('node-persist');

var options = {
    dir: './counting/data',
}

storage.init(options);

// Commands
var counts = ['Kappa', 'SMOrc', 'Messages']

module.exports = {
    
    // Increase the count of the specified field
    increase: function(name){
        if(counts.includes(name)){
            var count = storage.getItemSync(name);
            storage.setItemSync(name, ++count);
        }
    },
    
    // Get the value of the specified field
    get: function(name){
        if(counts.includes(name)){
            return storage.getItemSync(name);
        }
    },
    
    // Reset the count of the specified field
    reset: function (name){
        if(counts.includes(name)){
            storage.setItemSync(name, 0);
            return true;
        } else {
            return false;
        }
    }
};