const Path = require('path');
const fs = require('fs');
var bcrypt = require('bcryptjs');
var timed;


function getTimeAndSid(request){

    var vars = {

    };

    if( request.auth.isAuthenticated ){

        if( request.auth.artifacts.time ){
            console.log('found date in cookie');
            vars.time = request.auth.artifacts.time;
            vars.sid = request.auth.artifacts.sid;
        } else if( !request.auth.artifacts.time && request.auth.artifacts.sid ){
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


function returnClearCart(request, reply){

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

                if(!cart[0]){
                    console.log('session was not found');
                    return;
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
                    //reply('console');
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









exports.getAllFood = function(request, reply){
   var db = request.server.plugins['hapi-mongodb'].db;
    db.collection('food', function (err, food_collection) {
        if (err) throw err;
        //request params
        if(request.query.product){
          food_collection.findOne({product: request.query.product}, (err, result) => {
            if(err) throw err;
            reply(result);
          });
        //no request params
        }else{
        food_collection.find({}, {}).toArray(
            (err, results) => {
                if (err) throw err;
                reply(results.map( (item) => {
                    console.log(item);
                    return item;
                   
                }));
          });
        }
    });

};



exports.addNewItem = function(request, reply){
  let product = {
      product: request.payload.product,
      url: request.payload.url,
      description: request.payload.description,
      currency: request.payload.currency,
      price: request.payload.price,
      quantity: request.payload.quantity,
      category: request.payload.category
  };
  var db = request.server.plugins['hapi-mongodb'].db;
    // Get the documents collection
    let collection = db.collection('food');
    // Insert some documents
    collection.insertOne(product, function (err, result) {
        if (err) throw err;
        reply( result );
    });
};

exports.getOneItem = function(request, reply){
    var db = request.server.plugins['hapi-mongodb'].db;

    db.collection('food', function (err, food_collection) {
        if (err) throw err;
        food_collection.findOne({ "product" : request.params.product }, (err, result) => {
            if(err) throw err;
            reply(result);
        });
    });
};

exports.updateOneItem = function( request, reply ){
    var db = request.server.plugins['hapi-mongodb'].db;

    db.collection('food', function ( err, food_collection ) {
        if ( err ) throw err;
        let newItem = {
            product: request.payload.product,
            description: request.payload.description,
            url: request.payload.url,
            currency: request.payload.currency,
            price: request.payload.price,
            quantity: request.payload.quantity,
            category: request.payload.category
        };

        food_collection.replaceOne({ "product" : request.params.productName }, newItem , ( err, result ) => {
            
            if( err ) throw err;
            reply( newItem );
        });
    });
};

exports.clearItem = function( request, reply ){
    var db = request.server.plugins['hapi-mongodb'].db;
    var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
    db.collection('food', function (err, food_collection) {
        if ( err ) throw err;
        if( request.params && request.params.productName ){
            food_collection.deleteOne({ "product" : request.params.productName }, ( err, result ) => {
            if( err ) throw err;
                reply( result );
            });
        }
        
    });
};

//////////////////

exports.getCart = function( request, reply ){
    var db = request.server.plugins['hapi-mongodb'].db;
    var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID; 
    let time;
    let time2;
    let sid;



    db.collection('carts', function (err, carts_collection) {
        if (err) throw err;
        if( request.auth && request.auth.artifacts && request.auth.artifacts.time ){
            console.log( request.auth.artifacts.time );
            time = request.auth.artifacts.time;
            time2 = new Date(time);
            time2.setSeconds(-10);
            sid = request.auth.artifacts.sid;
        }

        carts_collection.find({ "createdAt": {"$gt" : new Date(time2), "$lte" : new Date(time) }}).toArray(function( err, carts ){
            
            if ( carts.length > 1 ){
                console.log('two created at the same time');
                let correctCart;
                correctCart = carts.filter((cart)=>{
                    return cart.sid === request.auth.artifacts.sid;
                });
                return reply(correctCart);
            }

            if( carts.length === 0 ) {
                
            }

            reply(carts)
        });
        
    }); 
};







//Create a cart if one is missing and add the first product
//or if a cart is present, add a product to it
exports.addProduct = function( request, reply ){

console.log( 'auth___',request.auth);
    function stockCheck(){
        return db.collection( 'food' ).findOne({ product: request.payload.product });
    };
    let inStock;
    let quantity;
    var sid;
    let time;
    let time2;
    const db = request.server.plugins['hapi-mongodb'].db;
    let collection = db.collection('carts');
    let productToInsert = {
        product: {
            title: request.payload.product,
            ordered: 0
        },
        url: request.payload.url,
        price: request.payload.price
    };
    console.log(request.auth);

    //determining sid and time of cart creation
    let vars = getTimeAndSid(request );
    console.log('vars', vars);
    time = vars.time;
    time2 = vars.time2;
    sid = vars.sid;
    
    
    //create a new cart if one does not exist already
    collection.find({ "createdAt" :  new Date(time)}).toArray( function(err, result){
        if(err) throw err;
        console.log(result);
        if(result.length === 0){
            console.log('inserting new cart');
            

            //if the person is not logged in yet - log them as a guest, create a cart, a session, and a cookie
            if(!sid){
                let altSid;
                console.log('nema sid i kolichka');
                console.log('time_________', time);
                bcrypt.hash(`${Math.random()}:${time}`, 8, function(err, hash){
                    if(err)throw err;
                    altSid = hash;
                    console.log('hash_________', altSid);

                    //create cart
                    collection.insertOne({ "createdAt": time, sid: altSid, products: [] })
                    .then((result) => {
                        console.log('inserting_______,');
                        createSession( request, reply, altSid, { time: time }, {time: time, sid: altSid, isGuest: true}, findCart );
                    })
                });
                
            //if the person is logged - just create the cart and update the cookie with the time of creation
            } else {
                console.log('ima sid no nema kolichka');
                bcrypt.hash(`${Math.random()}:${time}`, 8, function(err, hash){
                    if(err)throw err;
                    altSid = hash;
                    console.log('hash_________', hash);

                    //create cart
                    collection.insertOne({ "createdAt": time, sid: altSid, products: [] })
                    .then((result) => {
                        console.log('inserting_______,');
                        request.cookieAuth.clear();
                        createSession(request, reply, altSid, { time: time }, {time: time, sid: altSid}, findCart);

                    })
                });
            }

        } else {
            //if a cart already exists
            console.log( `a cart was created at ${request.auth.artifacts.time}` );
            console.log( `a cart was created at... ` + time );
            console.log('cart______________:', result);
            if(!sid){
                console.log('epa nqma sid');
            } else {
                console.log('epa ima sid');
                findCart();
            }
            
        }

        //Finds the right cart and updates it if the product is in stock
        function findCart(){

            function updateDb( target ){
                return db.collection('food').updateOne({ product: target }, {$set: { quantity: --quantity }});
            }

            collection.find({ "createdAt": {"$gt" : new Date(time2.toISOString()), "$lte" : new Date(new Date(time).toISOString()) }}).toArray(function( err, cart ){
                            
                if( cart.length === 0 ){
                    console.log('Your session has expired!');
                    createGuestSession();
                    return findCart();
                } 

               console.log( 'adding a new product to the cart' ); 
               console.log('cart_________', cart);

               let cart2 = cart.map(function(m){return m;});
               let correctCart;

               //probe db for stock stats
               stockCheck()
               .then( ( result ) =>{
                   console.log('quantity_________', result );
                    if( parseInt(result.quantity) === 0 ){
                        inStock = false;
                    } else {
                        inStock = true;
                        quantity = parseInt(result.quantity);
                    }
                })

                //if the item is out of stock, return
               .then( (result) => { 
                   if( inStock === false ){
                        return reply( 'out of stock' );
                    } else {
                        console.log('QUANTITY_________', quantity);
                        return true;
                    }
                 })

                 //if the item is in stock, continue
                .then( (result) => {
                     if( result !== true ) return reply( 'not in stock' );

                     console.log( 'in stock it is indeed' );

                     //two or more carts created at approximately the same time
                     if( cart.length > 1 ){
                        console.log('two or more carts created at the same time, need to scan each sid');
                        console.log('from cookie_________sid:', request.auth.artifacts.sid);

                        correctCart = cart.filter((cart) => {
                            return ( cart.sid === request.auth.artifacts.sid );
                        });

                        console.log('correct cart___________', correctCart);

                        //check if the product being added has already been ordered and increment its quantity if it has
                        correctCart[0].products.forEach(function( item ){
                            if( item.product.title === request.payload.product ){
                                productToInsert.product.ordered = ++item.product.ordered;
                            }
                        });

                        if( productToInsert.product.ordered !== 0 ){
                            
                            //update existing records
                            collection.updateOne({ "createdAt": correctCart[0].createdAt}, {$set: {products: correctCart[0].products}})
                            
                            .then(( success )=>{
                                collection.find({ "createdAt": correctCart[0].createdAt}).toArray(function( err, newCart ){
                                    console.log('cart updated');

                                    updateDb( productToInsert.product.title )
                                    .then( ( result ) =>{
                                        console.log( result );
                                        return reply(newCart);
                                    });
                                });
                            });

                            

                        } else {

                            //add the new product to the records
                            productToInsert.product.ordered = 1;
                            collection.updateOne({ "createdAt": correctCart[0].createdAt}, {$set: {products: correctCart[0].products.concat(productToInsert)}})
                            .then(( success )=>{
                            collection.find({ "createdAt": correctCart[0].createdAt}).toArray(function( err, newCart ){
                                    if( err ) throw err;
                                    console.log('cart updated');
                                    
                                    console.log('updating DB');
                                    updateDb( productToInsert.product.title )
                                    .then( ( result ) =>{
                                        console.log( 'db update result______________', result );
                                    });

                                    return reply( newCart );
                                });
                            });
                        }

                     //only one cart was created at this time
                     } else {
                        

                        console.log('updating cart');
                        console.log('cart_________', cart);

                        cart[0].products.forEach(function( item ){
                            console.log('product');
                            if( item.product.title === request.payload.product ){
                                productToInsert.product.ordered = ++item.product.ordered;
                            }
                        });

                        if( productToInsert.product.ordered !== 0 ){
                            
                            //update existing records
                            collection.updateOne({ "createdAt": cart[0].createdAt}, {$set: {products: cart[0].products}})
                            .then(( success )=>{
                                collection.find({ "createdAt": cart[0].createdAt}).toArray(function( err, newCart ){
                                    if( err ) throw err;
                                    console.log('cart updated');

                                    updateDb( productToInsert.product.title )
                                    .then( ( result ) =>{
                                        console.log( 'result_________!__________', result );
                                        return reply( newCart );
                                    });
                                });
                            });

                        } else {

                            //add the new product to the records
                            productToInsert.product.ordered = 1;
                            collection.updateOne({ "createdAt": cart[0].createdAt}, {$set: {products: cart[0].products.concat(productToInsert)}})
                            .then(( success )=>{
                                collection.find({ "createdAt": cart[0].createdAt}).toArray(function( err, newCart ){
                                    if( err ) throw err;
                                    console.log('cart updated');

                                    if( !newCart ) return;
                                    updateDb( productToInsert.product.title )
                                    .then( ( result ) =>{
                                        return reply( newCart );
                                    });
                                })
                            });
                        }
                    };
                 });//--end of then
            });//--end of collection.find()
        }//--end of findCart()
    });//--end of outer collection.find()
}//--end of addProduct handler function



exports.removeProduct = function( server ){//from the cart 
    
    return function ( request, reply ) {

            const db = request.server.plugins['hapi-mongodb'].db;
            const collection = db.collection('carts');
            const food = db.collection('food');
            let time;

            //check if a user is logged or if a guest session exists
            if( request.auth && request.auth.artifacts && request.auth.artifacts.time ){
                time = request.auth.artifacts.time;
            }

            //if a session exists
            if( time ){
                console.log('found time in cookie');

                //find the cart for the session
                collection.find({ createdAt: new Date(new Date(time).toISOString() )}).toArray( function(err, result){

                    let cart = result[0];
                    let products = cart.products;
                    let newProducts = products.map( function( item ){

                        //find the item to be modified in this subtraction
                        if( item.product.title === request.payload.product && request.payload.ordered > 1 ){

                            //modify the item
                           let modItem = {
                                    product: {
                                        title: item.product.title,
                                        ordered: --item.product.ordered
                                    },
                                    url: item.url,
                                    price: item.price
                            }
                            return modItem;

                        //return the rest of the items as they are
                        } else {
                            return item;
                        }
                    });

                    
                    if( request.payload.ordered > 1 ){

                        collection.updateOne( { createdAt: cart.createdAt }, { $set: { products: newProducts } } )
                        .then(()=>{
                            food.updateOne( { product: request.payload.product }, { $inc: { quantity: 1 } } );
                            return reply( newProducts );
                        });
                    } else {
                        reply({});
                    }
                });
                   
            } else {
                reply( 'No session yet' );
            }
        };
};

exports.removeAllOfOne = function( data ){
    return ( request, reply ) => {
        let db = request.server.plugins['hapi-mongodb'].db;
        let time;
        let time2; //for comparison
        let sid;
        let quantity; //to be removed and then added to the DB
        let correctCart;// if there are multiple carts together
        let cart;


        db.collection('carts', function (err, carts_collection) {
            if (err) throw err;

            if( !request.auth.isAuthenticated ) return reply( 'unauthenticated/ no session' );

           let vars = getTimeAndSid( request );
           time = vars.time;
           time2 = vars.time2;
           sid = vars.sid;

            carts_collection.find({ "createdAt": {"$gt" : new Date(time2), "$lte" : new Date(time) }}).toArray(function( err, carts ){

                if ( carts.length > 1 ){
                    console.log('two created at the same time');
                    
                    correctCart = carts.filter((cart)=>{
                        return cart.sid === request.auth.artifacts.sid;
                    });

                    cart = correctCart;
                } else if( carts.length === 0 ) {
                    console.log( 'no carts were found' );
                    return reply('no carts were found');
                } else if( carts.length === 1 ){
                    console.log( 'one cart only' );
                    cart = carts;
                }   

                    console.log( cart );

                    cart[0].products.forEach( function( item ) {
                        console.log( item, item.title === request.payload.product );
                        if( item.product.title === request.payload.product ){
                            //the number of elements to be removed 
                            quantity = parseInt(item.product.ordered);
                        }
                    });

                    let newProducts = cart[0].products.filter(function( item ){ 
                        if( item.product.title !== request.payload.product ){
                            return item;
                        }
                    });

                    //update the cart
                    if ( newProducts.length === 0 ) {
                        carts_collection.updateOne({ createdAt: cart[0].createdAt }, { $set: { products: [] } })

                        //and restore quantity
                        .then( (result) =>{
                            restoreQuantityInDb( request, reply, db, quantity );
                        });  
                    //update the cart
                    } else {
                        carts_collection.updateOne({ createdAt: cart[0].createdAt }, { $set: { products: newProducts } })

                        //and restore quantity
                        .then( (result) =>{
                            restoreQuantityInDb( request, reply, db, quantity );
                        });  
                    }
            });
            
        }); 
    };
};






exports.clearCart = function( request, reply ){
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

exports.removeItem = function( request, reply ){
    
};
