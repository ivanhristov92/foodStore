import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Link} from 'react-router'

class Product extends React.Component{
    constructor( props ){
        super( props );
    }

    render(){
        return(
            <div className="product col-xs-12 col-sm-5 col-md-3 col-centered">
                <Link to={this.props.linkTo}  className="productImage">
                    <img src={this.props.url}/>
                </Link>
                <div className="productDetails">
                    <div className="pull-left">
                        
                        { this.props.title }
                        <span>
                            ${ this.props.price }
                        </span>
                    </div> 
                    
                </div>
                
            </div>
        );
    }
}

export default Product;