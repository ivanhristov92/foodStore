'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './client/assets/css/main.css';
import cartStyles from './client/assets/css/cart.css';


import Page from './client/views/main/page';
import ProductPage from './client/views/main/product-page';
import Product from './client/views/main/product';
import SingleProduct from './client/views/main/single-product';
import Cart from './client/views/main/cart';
import AdminPage from './client/views/main/admin-page';
import AdminProducts from './client/views/main/admin-products';
import AdminSingleProduct from './client/views/main/admin-single-product';
import AdminAddNewProduct from './client/views/main/admin-add-new-product';
import AdminProfile from './client/views/main/admin-profile';
import LogInPage from './client/views/main/login-page';
import Category from './client/views/main/category';

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={Page}>
            <IndexRoute component={ProductPage}/>
            
            <Route path="/products/:productName" component={SingleProduct}></Route>
            <Route path="/products/categories/:categoryName" component={Category}></Route>

            <Route path="/cart" component={Cart}></Route>
            <Route path="/login" component={LogInPage}></Route>
        </Route>
        <Route path="/admin" component={AdminPage}>
            <Route path="/admin/products" component={AdminProducts}></Route>
            <Route path="/admin/products/:productName" component={AdminSingleProduct}></Route>
            <Route path="/admin/products/new-product/add" component={AdminAddNewProduct}></Route>
            <Route path="/admin/profile" component={AdminProfile}></Route>
        </Route>
    </Router>
    ,
    document.getElementById('root')
);


