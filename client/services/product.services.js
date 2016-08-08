'use strict';

import $ from 'jquery';



class ProductService{
    constructor( baseUrl ){
        this.url = baseUrl;
        this.addToCart = this.addToCart.bind(this);
        this.getCart = this.getCart.bind( this );
    }

    getProducts( alt ) {
            let url = `/${this.url}`;
            if( alt ){
                url = `http://localhost:4000/api/products`
            }
            return this.getJsonAsPromise( url )
                .then( ( products ) => products.map(
                    ( product ) => {
                        return product;
                    })
                );
        }

    getProduct( product ){
        return this.getJsonAsPromise( `/api/products/${ product }` )
            .then( ( item ) =>{
                return item;
            });
    }

    updateProduct( data ){
        let url = `${ this.url }/${ data.toChange }/update`;
        console.log( url );
        return new Promise(
            function ( resolve, reject ) {
                $.ajax({
                    url: url,
                    dataType: 'json',
                    type: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify( data ),
                }).done( resolve ).fail( reject );
            }
        );
    }

    addProduct( data ){
        let newUrl = `${ this.url }/add`;
        return new Promise(
            function ( resolve, reject ) {
                $.ajax({
                    url: newUrl,
                    dataType: 'json',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify( data ),
                }).done( resolve ).fail( reject );
            }
        );
    }

    deleteItem( productName ){
        let url = `${ this.url }/${ productName }/delete`;
        return new Promise(
            function ( resolve, reject ) {
                $.ajax({
                    url: url,
                    dataType: 'json',
                    type: 'DELETE',
                    contentType: 'application/json',
                    data: null,
                }).done( resolve ).fail( reject );
            }
        );
    }


    addToCart( data ){
        let url = `/${ this.url }/${ data.product }/add-to-cart`;
        console.log( url );
        return new Promise(
            function ( resolve, reject ) {
                $.ajax({
                    url: url,
                    dataType: 'json',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify( data ),
                }).done( resolve ).fail( reject );
            }
        );
    }

    getCart(){
        return this.getJsonAsPromise( `/api/get-cart`, null );
    }

    removeFromCart( data ){
        let url = `/${ this.url }/remove-from-cart`;
        return new Promise(
            function( resolve, reject ) {
                $.ajax({
                    url: url,
                    dataType: 'json',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify( data ),
                }).done( resolve ).fail( reject );
            }
        );
    }

    removeAllOfOne( data ){
        let url = `/${ this.url }/remove-all-of-one`;
        return new Promise(
            function( resolve, reject ) {
                $.ajax({
                    url: url,
                    dataType: 'json',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify( data ),
                }).done( resolve ).fail( reject );
            }
        );
    }

    getJsonAsPromise( url, data ) {
            return new Promise( function ( resolve, reject ) {
                $.getJSON( url, data ).done( resolve ).fail( reject );
            });
        }
}


export default ProductService;