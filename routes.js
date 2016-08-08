const Food = require('./handlers/food.handlers');
const Users = require('./handlers/users.handlers');

module.exports = [
{
  method: 'GET',
  path: '/api/alf',
  handler: function (request, reply) {
    reply('ALFFF');
  }
},
{
  method: 'GET',
  path: '/api/bob',
  handler: function (request, reply) {
    reply('BOOOOB');
  }
},//////////////FOOD////////////////
{
    "method"  : "GET",
    "path"    : "/api/food",
    "handler" : Food.getAllFood
},
{
    "method"  : "POST",
    "path"    : "/api/food",
    "handler" : Food.postNewItem
},
{
    "method"  : "GET",
    "path"    : "/api/food/{id}",
    "handler" : Food.getOneItem 
},
{
    "method"  : "PUT",
    "path"    : "/api/food/{id}",
    "handler" : Food.updateOneItem 
},
{
    "method"  : "POST",
    "path"    : "/api/food/{id}",
    "handler" : Food.replaceOneItem 
},
{
    "method"  : "DELETE",
    "path"    : "/api/food/{id}",
    "handler" : Food.deleteOneItem
},//////////////USERS////////////////
{
    "method"  : "POST",
    "path"    : "/api/users",
    config: { 
        handler: Users.register, 
        auth: { mode: 'try' }, 
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
        auth: { mode: 'try' }, 
        plugins: { 'hapi-auth-cookie': { 
            redirectTo: false } 
        }
    }
},
{
    "method"  : "GET",
    "path"    : "/api/users",
    "handler" : Users.getAllUsers 
},
{
    "method"  : "GET",
    "path"    : "/api/users/{id}",
    config: { 
        handler: Users.getOneUser, 
        auth: { mode: 'try' }, 
        plugins: { 'hapi-auth-cookie': { 
            redirectTo: false } 
        }
    }
},
{
    "method"  : "PUT",
    "path"    : "/api/users/{id}",
    "handler" : Users.updateOneUser
},
{
    "method"  : "POST",
    "path"    : "/api/users/{id}",
    "handler" : Users.replaceOneUser
},
{
    "method"  : "DELETE",
    "path"    : "/api/users/{id}",
    "handler" : Users.deleteOneUser
}

]