/**
 * This file provided by IPT-Intellectual Products & Technologies (IPT)
 * is for non-commercial testing and evaluation purposes only. 
 * IPT reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
'use strict';

const fs = require('fs');
var path = require('path');
const Hapi = require('hapi');
const Good = require('good');
const Boom = require('boom');
const Password = require('password-hash-and-salt');
const routes = require('./routes');
var bcrypt = require('bcryptjs');
var Q = require("q");

const Food = require('./handlers/food.handlers');
const Users = require('./handlers/users.handlers');
 
const server = new Hapi.Server();
server.connection({ port: 9000 });

var dbOpts = {
    "url": "mongodb://User:12345@ds145365.mlab.com:45365/foodstore",
    "settings": {
        "db": {
            "native_parser": false
        }
    }
};

// Registering the Good plugin
server.register([
{
    register: require('hapi-mongodb'),
    options: dbOpts
},
{
  register: Good,
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
},
{
    register: require('hapi-auth-cookie')
}], (err) => {
  if (err) {
    throw err;
  }


     //Declare the cache refference
    const cache = server.cache( { segment: 'sessions', expiresIn: 32 * 60 * 1000 } );
    server.app.cache = cache;

    server.auth.strategy('session', 'cookie', true, {
        password: 'password-should-be-32-characterspassword-should-be-32-characters',
        cookie: 'sid-example',
        redirectTo: '/login',
        isSecure: false,
        ttl: 32*60*1000,
        clearInvalid: true,
        validateFunc: function ( request, session, callback ) {

            cache.get( session.sid, (err, cached ) => {

                if (err) {
                    return callback( err, false );
                }

                if (!cached) {
                    return callback( null, false );
                }

                return callback( null, true, cached.account);
            });
        }
    });
  
 // Registering routes
  server.route([
{
    "method"  : "GET",
    "path"    : "/api/users/is-admin",
    config: { 
        handler: Users.isLogged, 
        auth: {  mode: 'try' }, 
        plugins: { 'hapi-auth-cookie': { 
            redirectTo: false } 
        }
    }
},
{
    "method"  : "POST",
    "path"    : "/api/users/login",
    config: { 
        handler: Users.logIn,  
        auth: {  mode: 'try' }, 
        plugins: { 'hapi-auth-cookie': { 
            redirectTo: false } 
        }
    }
},
{
    "method"  : "POST",
    "path"    : "/api/users/logout",
    config: { 
        handler: Users.logOut,  
        auth: {  mode: 'try' }, 
        plugins: { 'hapi-auth-cookie': { 
            redirectTo: false } 
        }
    }
},
{
    "method"  : "POST",
    "path"    : "/api/users/register",
    config: { 
        handler: Users.register,  
        auth: {  mode: 'try' }, 
        plugins: { 'hapi-auth-cookie': { 
            redirectTo: false } 
        }
    }
},
{
    "method"  : "PUT",
    "path"    : "/api/users/{username}/update",
    config: { 
        handler: Users.updateUser,  
        auth: {  mode: 'required' }, 
        plugins: { 'hapi-auth-cookie': { 
            redirectTo: false } 
        }
    }
},
{
    "method"  : "GET",
    "path"    : "/api/users",
    config: { 
        handler: Users.getUsers,  
        auth: {  mode: 'try' }, 
        plugins: { 'hapi-auth-cookie': { 
            redirectTo: false } 
        }
    }
},
{
    "method"  : "POST",
    "path"    : "/api/products/{productName}/add-to-cart",
    config: { 
        handler: Food.addProduct, 
        auth: {  mode: 'try' }, 
        plugins: { 'hapi-auth-cookie': { 
            redirectTo: false } 
        }
    }
},
{
    "method"  : "POST",
    "path"    : "/api/products/remove-from-cart",
    config: { 
        handler: Food.removeProduct(), 
        auth: {  mode: 'try' }, 
        plugins: { 'hapi-auth-cookie': { 
            redirectTo: false } 
        }
    }
},
{
    "method"  : "POST",
    "path"    : "/api/products/remove-all-of-one",
    config: { 
        handler: Food.removeAllOfOne( ), 
        auth: {  mode: 'try' }, 
        plugins: { 'hapi-auth-cookie': { 
            redirectTo: false } 
        }
    }
},
{
    "method"  : "GET",
    "path"    : "/api/products",
    config: { 
        handler: Food.getAllFood, 
        auth: {  mode: 'try' }, 
        plugins: { 'hapi-auth-cookie': { 
            redirectTo: false } 
        }
    }
},
{
    "method"  : "GET",
    "path"    : "/api/products/{product}",
    config: { 
        handler: Food.getOneItem, 
        auth: {  mode: 'try' }, 
        plugins: { 'hapi-auth-cookie': { 
            redirectTo: false } 
        }
    }
},
{
    "method"  : "POST",
    "path"    : "/api/products/add",
    config: { 
        handler: Food.addNewItem, 
        auth: {  mode: 'try' }, 
        plugins: { 'hapi-auth-cookie': { 
            redirectTo: false } 
        }
    }
},
{
    "method"  : "DELETE",
    "path"    : "/api/products/{productName}/delete",
    config: { 
        handler: Food.clearItem, 
        auth: {  mode: 'try' }, 
        plugins: { 'hapi-auth-cookie': { 
            redirectTo: false } 
        }
    }
},
{
    "method"  : "PUT",
    "path"    : "/api/products/{productName}/update",
    config: { 
        handler: Food.updateOneItem, 
        auth: {  mode: 'try' }, 
        plugins: { 'hapi-auth-cookie': { 
            redirectTo: false } 
        }
    }
},
{
    "method"  : "GET",
    "path"    : "/api/get-cart",
    config: { 
        handler: Food.getCart, 
        auth: {  mode: 'try' }, 
        plugins: { 'hapi-auth-cookie': { 
            redirectTo: false } 
        }
    }
},
{
    "method"  : "POST",
    "path"    : "/api/clear-cart",
    config: { 
        handler: Food.clearCart, 
        auth: {  mode: 'try' }, 
        plugins: { 'hapi-auth-cookie': { 
            redirectTo: false } 
        }
    }
}]);

  // Starting the server
  server.start((err) => {
    if (err) {
      throw err;
    }
    console.log('Server running at:', server.info.uri);
  });
});












 

