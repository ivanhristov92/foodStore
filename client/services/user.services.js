'use strict';

import $ from 'jquery';



class UserServices{
    constructor( baseUrl ){
        this.url = baseUrl;
    }

    isLogged(){
        let url = `/${ this.url }/is-admin`;
        console.log( url );
        return new Promise(
            function ( resolve, reject ) {
                $.ajax({
                    url: url,
                    //dataType: 'json',
                    type: 'GET',
                    contentType: 'application/json',
                    data: null,
                }).done( resolve ).fail( reject );
            }
        );
    }


    getUsers(){
        let url = `/${ this.url }`;
        console.log( url );
        return new Promise(
            function ( resolve, reject ) {
                $.ajax({
                    url: url,
                    type: 'GET',
                    contentType: 'application/json',
                    data: null,
                }).done( resolve ).fail( reject );
            }
        );
    }

    updateUser( data ){
        let url = `/${ this.url }/${ data.toChange }/update`;
        console.log( url );
        return new Promise(
            function ( resolve, reject ) {
                $.ajax({
                    url: url,
                    type: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                }).done( resolve ).fail( reject );
            }
        );
    }

    logOut(){
        let url = `/${ this.url }/logout`;
        return new Promise(
            function ( resolve, reject ) {
                $.ajax({
                    url: url,
                    type: 'POST',
                    contentType: 'application/json',
                    data: null,
                }).done( resolve ).fail( reject );
            }
        );
    }

    logIn( data ){
        let url = `/${ this.url }/login`;
        return new Promise(
            function ( resolve, reject ) {
                $.ajax({
                    url: url,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
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


export default UserServices;