'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Product from './product';
import CategoryInfo from './category-info';
import BestSellers from './best-sellers';

class ProductList extends React.Component{
    constructor( props ){
        super( props );

        this.state = { 
            products: [],
        };

        this.categories = {};
    }

    componentWillMount(){
        this.context.productServices.getProducts().then( (products) => {
            this.setState({ products: products, bestSellers: [] });
            console.log(this.props.category);
        });
    }

    render(){
        let bestSelling = [];

        let productNodes = this.state.products.map((item) =>{
            if( item.quantity < 10 ){
                bestSelling.push( item );
            }

            //if a category has been selected
            if( this.props.category ){

                //if all have been sellected, return every item
                if( this.props.category === 'all' ){
                    this.categories[item.category] = true;
                    return (
                        <Product key={item._id} title={item.product} url={item.url} price={item.price} linkTo={`/products/${item.product}`}></Product>
                    );
                
                //if one specific category has been selected, return matches
                } else if ( this.props.category === item.category ){

                    //if an item is to be skipped to avoid repetition
                    if( this.props.avoid ){
                        
                        //if this is the item to avoid, avoid it
                        if( item.product === this.props.avoid ){
                            
                            //--do nothing

                        //else, return it
                        } else {
                            this.categories[item.category] = true;
                             return (
                                <Product key={item._id} title={item.product} url={item.url} price={item.price} linkTo={`/products/${item.product}`}></Product>
                            );
                        }
                    
                    //if no item to avoid has been given, return all of the category
                    } else {
                        this.categories[item.category] = true;
                        return (
                            <Product key={item._id} title={item.product} url={item.url} price={item.price} linkTo={`/products/${item.product}`}></Product>
                        );
                    }

                }
            
            //if no category has been selected
            } else {
                this.categories[item.category] = true;
                return (
                        <Product key={item._id} title={item.product} url={item.url} price={item.price} linkTo={`/products/${item.product}`}></Product>
                    );
            }
            
        });

        //if category is sellected
        if( this.props.category ){

            //check if there are products from the selected category
            if( this.categories[this.props.category] !== true ){
                return <h3>No Products, Sorry</h3>
            } else {
                return(
                    <div className="productList">
                        <div className="row row-centered ">
                            {productNodes}
                        </div>
                    </div>
                    
                );
            }

        //if no category has been selected
        } else {
            return(
                <div className="productList">
                    <div className="row row-centered ">
                        {productNodes}
                    </div>
                </div>
                
            );
        }
        
    }
}

ProductList.contextTypes = {
  productServices: React.PropTypes.object
};

export default ProductList;