'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Menu from './menu'
import SubMenu from './sub-menu'
import CategoryInfo from './category-info';
import ProductList from './product-list';
import BestSellers from './best-sellers';
import Social from './social';
import ProductServices from '../../services/product.services'
import UserServices from '../../services/user.services'

class Page extends React.Component{
    constructor( props ){
        super( props );

        this.productServices = new ProductServices('api/products');
        this.userServices = new UserServices('api/users');
    }

    getChildContext(){
        return {
            productServices: this.productServices,
            userServices: this.userServices
        }
    }

    componentWillMount(){
        this.userServices.isLogged()
        .then( (result)=>{
            
            if( result === true ){
                this.userServices.logOut()
                .then( ()=>{
                    window.localStorage.setItem('username', '');
                    console.log( 'logged out' );
                });
            } 
        });
    }




    render(){

        return (
            
            <div className="container myPage">
                <Menu></Menu>
                {this.props.children}
                <BestSellers></BestSellers>
                <Social></Social>
            </div>
        );
    }
}

Page.childContextTypes = {
    productServices: React.PropTypes.object,
    userServices: React.PropTypes.object
};

export default Page;