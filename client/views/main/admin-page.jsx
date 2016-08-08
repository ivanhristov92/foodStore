'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import Menu from './menu'
import SubMenu from './sub-menu'
import CategoryInfo from './category-info';
import ProductList from './product-list';
import BestSellers from './best-sellers';
import Social from './social';
import UserServices from '../../services/user.services';
import ProductServices from '../../services/product.services';

import AdminMenu from './admin-menu';
import LoginPage from './login-page';

import { browserHistory } from 'react-router'



class AdminPage extends React.Component{
    constructor( props ){
        super( props );
        this.state = { logged: false };
        this.handleLogOut = this.handleLogOut.bind( this );
        this.handleLogIn = this.handleLogIn.bind( this );

        this.userServices = new UserServices( 'api/users' );
        this.productServices = new ProductServices( '/api/products' );
    }

    componentWillMount(){
        this.userServices.isLogged()
        .then( ( result )=>{
            this.setState( { logged: result } );
        });
    }

    getChildContext(){
        return {
            userServices: this.userServices,
            productServices: this.productServices
        }
    }

    handleLogIn( user ){
        var username = user.username;
        var password = user.password;
        
        this.userServices.logIn( { username: username, password: password } )
        .then(
            (result)=>{
                if(result === 'session set'){
                    console.log('logggginngggg');
                    window.localStorage.setItem( 'username', username );
                    $('#username').val('');
                    $('#password').val('');
                    this.setState({ logged: true });
                } else {
                }
            }
        );
    }

     handleLogOut(){
        this.userServices.logOut()
        .then( ()=>{
            window.localStorage.setItem("username", '');
            this.setState( { admin: false } );
            browserHistory.push("/");
        });
        
    }

    render(){

        
        return (this.state.logged === true) ? (
            <div className="container myPage">
                Admin Page
                <AdminMenu onLogOut={this.handleLogOut}></AdminMenu>
                {this.props.children}
                
            </div>
        ) : <LoginPage onLogIn={this.handleLogIn}></LoginPage>
    }
}

AdminPage.childContextTypes = {
    productServices: React.PropTypes.object,
    userServices: React.PropTypes.object
};

export default AdminPage;