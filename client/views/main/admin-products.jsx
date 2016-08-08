'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Menu from './menu'
import SubMenu from './sub-menu'
import CategoryInfo from './category-info';
import ProductList from './product-list';
import Product from './product';
import AdminMenu from './admin-menu';
import {Link} from 'react-router';

class AdminProducts extends React.Component{
    constructor( props ){
        super( props );
        this.state = { products: [] };

    }

    componentDidMount(){
        this.context.productServices.getProducts('localhost:4000').then( (products) => {
            this.setState({ products: products });
        });
    }

   

    render(){
        let productNodes = this.state.products.map((item) =>{
            return (
                <Product key={item._id} title={item.product} url={item.url} price={item.price} linkTo={`/admin/products/${item.product}`}></Product>
            );
        });
        return(
            <div className="productList">
                <div className="row row-centered ">
                    {productNodes}
                    <Link to="/admin/products/new-product/add"><button className="btn btn-default" >Add Product</button></Link>
                </div>
            </div>
            
        );
    }
}

AdminProducts.contextTypes = {
    productServices: React.PropTypes.object
};

export default AdminProducts;