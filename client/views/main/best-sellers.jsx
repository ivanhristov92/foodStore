import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Link} from 'react-router';
import Product from './product';

class BestSellers extends React.Component{
    constructor( props ){
        super( props );

        this.state = { 
            products: []
        };
    }

    componentDidMount(){
        this.context.productServices.getProducts().then( (products) => {
            this.setState({ products: products, bestSellers: [] });
            console.log(this.props.category);
        });
    }

    render(){

        let productsCount = this.state.products.length;
        let checkedProducts = -1;
        let count = 0;
        
        let bestSellerNodes = this.state.products.map( ( item )=>{

            //mark this product as checked
            checkedProducts++;

            //we need no more than 4 best selling items to show
            if ( count < 4 ){

                //check quantity item to see if it is a best seller
                if( item.quantity < 10 ){

                    //mark this product as added
                    count++;
                    return <Product className="col-md-3"key={item._id} title={item.product} url={item.url} price={item.price} linkTo={`/products/${item.product}`}></Product>
                
                //if there are less than 4 best selling items, add remaining items to fill them up
                } else {

                    //if we have as many items left to check as the number of items we need to show, show all left
                    if( ( productsCount - checkedProducts ) === ( 4 - count ) ){
                        count++;
                        return <Product className="col-md-3"key={item._id} title={item.product} url={item.url} price={item.price} linkTo={`/products/${item.product}`}></Product>
                    }
                }
            
            //if we already have more than 4, do not show anymore
            } else {
                return;
            }
             
        });
        return(
            <div className="row best-sellers">
                <h2 className="bestSellers col-md-12">Best Sellers</h2>
                <div className="col-md-12 bestSellingItems">
                    {bestSellerNodes}
                </div>
            </div>
        );
    }
}

BestSellers.contextTypes = {
    productServices: React.PropTypes.object
};

export default BestSellers;