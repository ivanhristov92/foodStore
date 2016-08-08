const Hapi = require('hapi');
const welcome = require('./handlers/welcome').welcome;
const Food = require('./handlers/food.handlers').getAllFood;
const Path = require('path');
const fs = require('fs');
const FOOD_FILE = Path.join(__dirname, 'food.json');
var Boom = require("boom");

const server = new Hapi.Server();
server.connection({ port: 4000 });


server.register([
 {
  register: require('good'),
  options: {
    reporters: {
      console: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{
          error: '*',
          log: '*'
        }]
      }, {
          module: 'good-console'
        }, 'stdout']
    }
  }
}], (err) => {
  if (err) {
    throw err;
  }

  /////
 
 /////


server.route([
    {
        method: 'GET',
        path: '/',
        handler: welcome
    }
]);



server.start((err) => {
    if(err){
        throw err;
    }
    console.log( `Server running at: ${server.info.uri}` );
});