'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Menu from './menu'
import SubMenu from './sub-menu'
import CategoryInfo from './category-info';
import ProductList from './product-list';
import BestSellers from './best-sellers';
import Social from './social';
import UserServices from '../../services/user.services'
import {Link} from 'react-router';

class AdminMenu extends React.Component{
    constructor( props ){
        super( props );
    }

   


    render(){
        return(
            <nav className="navbar navbar-default">
            <div className="container-fluid ">
                
                <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand myBrand" href="#"></a>
                </div>


                


                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul className="nav navbar-nav">
                    <li><Link to="/admin/products" >PRODUCTS</Link></li>
                    <li><Link to="/admin/profile">PROFILE</Link></li>
                
                </ul>
                <ul className="nav navbar-nav navbar-right cart">
                    <li><Link to="/admin" onClick={this.props.onLogOut}>log out</Link></li>
                </ul>
                </div>
            </div>
            </nav>
        );
    }
}

AdminMenu.contextTypes = {
    userServices: React.PropTypes.object
};

export default AdminMenu;

