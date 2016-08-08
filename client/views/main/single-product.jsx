import React from 'react';
import Product from './product';
import ProductList from './product-list';

class SingleProduct extends React.Component{
    constructor( props ){
        super( props );
        this.state = { 
            product: '',
            url: '',
            price: '',
            description: '',
            category: ''
        };
       
        this.addItem = this.addItem.bind( this );
        this.stateSetter = this.stateSetter.bind( this );
    }
        

    
    stateSetter( productName ){
         this.context.productServices.getProduct( productName ).then( (item) => {
            let available = false;
            if( item.quantity > 0 ){
                available = true;
            }
            this.setState({ product: item.product, url: item.url, price: item.price, available: available, description: item.description, category: item.category });
        });
    }


    componentWillMount(){
        this.stateSetter( this.props.params.productName );
    }

    componentWillReceiveProps( nextProps ){
        this.stateSetter( nextProps.params.productName );
    }



    addItem(  data ){

        return () => {
                if( !this.state.available )return;
                this.context.productServices.addToCart( data )
                .then(( result ) =>{
                    console.log( result );
                    this.stateSetter();
                });  
        }
        
    }


    render(){

        let buttonText = 'Buy me!';
        if( !this.state.available ){
            buttonText = 'Sold out!';
        }
        
        return(
           <div>
                <div className="row row-centered single-product">
                     <div className="col-md-5">
                        <img src={this.state.url } className="img img-responsive"/>
                     </div>
                     <div className="col-md-5">
                        <h4>{this.state.product}</h4>
                        <span style={{display: "block"}}>${this.state.price}</span>
                        <button className="btn" style={{display: "block"}} onClick={this.addItem( this.state )}>{buttonText}</button>
                        <h3>{this.state.product}</h3>
                        <p>{this.state.description}</p>
                     </div>
                </div>
                <div className="row row-centered more-from-category">

                    <h4 className="col-md-12">More from this category</h4>
                    <div className="col-md-12 more-from-category-items">
                        <ProductList className="col-md-12" category={this.state.category} avoid={this.state.product}></ProductList>
                    </div>
                </div>
            </div>
            
        );
    }
}

SingleProduct.contextTypes = {
  productServices: React.PropTypes.object
};


export default SingleProduct;


