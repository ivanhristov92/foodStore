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
import AdminMenu from './admin-menu';

class AdminCustomers extends React.Component{
    constructor( props ){
        super( props );

        this.productServices = new ProductServices('api/products');
    }

    getChildContext(){
        return {
            productServices: this.productServices
        }
    }


    render(){
        return(
            <div className="container">
                Customers
                
            </div>
        );
    }
}

AdminCustomers.childContextTypes = {
    productServices: React.PropTypes.object
};

export default AdminCustomers;