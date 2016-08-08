
const server = require('./../api-server.js').server;
var bcrypt = require('bcryptjs');
let timed;

///////////
function getTimeAndSid(request){

    var vars = {

    };

    if( request.auth.isAuthenticated ){
        if(request.auth){
                if( request.auth.arifacts && request.auth.artifacts.time ){
                    console.log('found date in cookie');
                    vars.time = request.auth.artifacts.time;
                    vars.sid = request.auth.artifacts.sid;
                } else if( request.auth.artifacts && !request.auth.artifacts.time && request.auth.artifacts.sid ){
                    vars.sid = request.auth.artifacts.sid;
                    vars.time = new Date();
                } else {
                    console.log('creating a new date mm');
                    vars.time = new Date();
                }
            } else {
                console.log('creating a new date mm');
                vars.time = new Date();
                console.log(vars.time);
            }

        }
        

    vars.time2 = new Date(vars.time);
    vars.time2.setSeconds(-10);

    return vars;
}





function restoreQuantityInDb( request, reply, db, quantity ){
    //return new Promise(
        db.collection('food', function (err, food_collection) {
            if( err ) throw err;
            food_collection.find( { product: request.payload.product } ).toArray( function( err, result ){
                                        
                let leftInStock = result[0].quantity;
                let newQuantity = leftInStock + quantity;
                console.log( leftInStock );
                food_collection.update({ product: request.payload.product }, {$set: { quantity: newQuantity }}, (err, result) =>{
                    reply( result );
                });
                
            });
        })
    
}

function restoreQuantityInDbReusable( request, reply, db, quantity, product){
    //return new Promise(
        db.collection('food', function (err, food_collection) {
            if( err ) throw err;
            food_collection.find( { product: product } ).toArray( function( err, result ){
                                        
                let leftInStock = result[0].quantity;
                let newQuantity = leftInStock + quantity;
                console.log( leftInStock );
                food_collection.update({ product: request.payload.product }, {$set: { quantity: newQuantity }}, (err, result) =>{
                });
            });
        })
    
}


function returnClearCart(request, reply, next){

return function clearCart ( ){
        let db = request.server.plugins['hapi-mongodb'].db;
        let time;
        let time2; //for comparison
        let sid;
        let quantity; //to be removed and then added to the DB
        let correctCart;// if there are multiple carts together
        let cart;

        let vars = getTimeAndSid(request);
        //reply( vars );
        time = vars.time;
        time2 = vars.time2;
        sid = vars.sid;

        db.collection('carts', function (err, carts_collection) {
            if (err) throw err;
            carts_collection.find({ "createdAt": {"$gt" : new Date(time2), "$lte" : new Date(time) }}).toArray(function( err, carts ){
                if ( carts.length > 1 ){
                    console.log('two created at the same time');
                    
                    correctCart = carts.filter((cart)=>{
                        return cart.sid === sid;
                    });

                    cart = correctCart;
                } else if( carts.length === 0 ) {
                    console.log( 'no carts were found' );
                    return reply('no carts were found');
                } else if( carts.length === 1 ){
                    console.log( 'one cart only' );
                    cart = carts;
                }  

                cart[0].products.forEach(function( item ){
                    let quantity = item.product.ordered;
                    let product = item.product.title;
                    console.log( quantity );
                    restoreQuantityInDbReusable( request, reply, db, quantity, product );
                });

                carts_collection.updateOne({ createdAt: cart[0].createdAt }, { $set: { products: [] } })
                .then(()=>{
                    console.log('checkkkkkkkkkkkkkkkk');
                    reply('console');
                });
            });
        });
};


}




function createSession( request, reply, sid, sessionProps, cookieProps, func ){
        request.server.app.cache.set( sid, sessionProps, 0, ( err ) => {
            if( err ) throw err;
            console.log('creating session');
            console.log(sid);
            request.cookieAuth.set(cookieProps);
            if(func){
                func();
            }
            clearTimeout(timed);
            timed = setTimeout(returnClearCart(request, reply), 29*60*1000);
        });
}





///////////






exports.register = function(request, reply){
    let user;
    var db = request.server.plugins['hapi-mongodb'].db;
    // Get the documents collection
    let collection = db.collection('users');

    // Insert user
    let userName = request.payload.username;
    collection.findOne({ username: userName }, ( err, result ) => {
        if(!result){
            bcrypt.hash(request.payload.password, 8, function( err, hash ) {
                if(err) throw err;
                user = { "username": userName, "password": hash };
                
                if( user.username && user.password ){
                    collection.insertOne( user,  ( err, result ) => {
                        if ( err ) throw err;
                        reply( result );
                    });
                } else {
                    reply('Missing Username or Password');
                }
            });

        } else {

            reply('Username is taken');
        }
    });
};



exports.logIn = function(request, reply){
    
    if (request.auth.isAuthenticated) {
        return reply('logged');
    }

    var message = "";
    var account = null;

    //Get the db
    const db = request.server.plugins['hapi-mongodb'].db;
    // Get the users collection
    let collection = db.collection('users');

    //Check user details
    if (!request.payload.username || !request.payload.password) {
        message = 'Missing username or password';
    } else {
        collection.findOne({ username: request.payload.username }, ( err, user ) =>{
            if( err ) throw err;    
            if( !user ){
                message = 'Wrong username or password!';
                return reply( message );
            }   

            //if the user is found
            if( user ){

                bcrypt.compare( request.payload.password, user.password, function(err, verified) {
                    if( err ) throw err;

                    //if the password is wrong
                    if (!verified){
                        message =  'Wrong username or password';
                        return reply(message);
                        
                    //if the password is correct
                    } else {

                        bcrypt.hash(`${user.username}:${user.password}`, 8, function( err, hash ){
                            //Set the sessions cache segment 
                            createSession( request, reply, hash, { account: user.username }, { sid: hash }, function(){
                                console.log('session set');
                                reply( 'session set' );
                            });
                        });
                    }

                });

            //if there is no such user    
            } else {
                message =  'Wrong username or password!!';
                return reply ( message );
            }
        });
    }
};

exports.logOut = function(request, reply){
    if( request.auth.isAuthenticated && !request.auth.isGuest ){
        request.cookieAuth.clear();
        reply('Cleared');
    } else {
        reply ('You are not logged yet');
    }
    
};

exports.getUsers = function(request, reply){
     var db = request.server.plugins['hapi-mongodb'].db;
    db.collection('users', function (err, user_collection) {
        if (err) throw err;
        user_collection.find({}, {}).toArray(
            (err, results) => {
                if (err) throw err;
                reply(results.map( (item) => {
                    item.id = item._id;
                    delete(item._id);
                    console.log(item);
                    return item;
                }));
          });
    });

};

exports.getOneUser = function(request, reply){
    var db = request.server.plugins['hapi-mongodb'].db;
    var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
    console.log( request.auth );
    db.collection('users', function (err, user_collection) {
        if (err) throw err;
        user_collection.findOne({ "_id" : new ObjectID(request.params.id) }, (err, result) => {
            if(err) throw err;
            reply(result);
        });
    });
    
};

exports.updateUser = function(request, reply){
    var db = request.server.plugins['hapi-mongodb'].db;
    var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
    let newUser = {};
    
    bcrypt.hash( request.payload.password, 8, function (err, hash){
        newUser.username = request.payload.username;
        newUser.password = hash;
        console.log( newUser );

        db.collection('users', function (err, user_collection) {
            if (err) throw err;
            user_collection.replaceOne({ "username" : request.params.username }, newUser, (err, result) => {
                if(err) throw err;
                reply(result);
            });
        });
    });
};

exports.replaceOneUser = function(request, reply){
    var db = request.server.plugins['hapi-mongodb'].db;
    var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
    db.collection('users', function (err, user_collection) {
        if (err) throw err;
        user_collection.replaceOne({ "_id" : new ObjectID(request.params.id) }, request.payload , (err, result) => {
            if(err) throw err;
            reply(request.payload);
        });
    });
};

exports.deleteOneUser = function(request, reply){
    var db = request.server.plugins['hapi-mongodb'].db;
    var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
    db.collection('users', function (err, user_collection) {
        if (err) throw err;
        user_collection.deleteOne({ "_id" : new ObjectID(request.params.id) }, (err, result) => {
            if(err) throw err;
            reply(result);
        });
    });
};

exports.isLogged = function( request, reply ){

        if( request.auth.isAuthenticated ){
            return reply(true);
        } else {
            return reply(false);
        }
};