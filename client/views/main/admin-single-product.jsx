import React from 'react';
import Product from './product';

import $ from 'jquery';
import { browserHistory } from 'react-router';

class AdminSingleProduct extends React.Component{
    constructor( props ){
        super( props );

        this.state = { 
            toChange: this.props.params.productName,
            product: '',
            description: '',
            category: '',
            url: '',
            currency: '',
            price: '',
            quantity: ''
        };

        this.temporary = {
            toChange: this.props.params.productName,
            product: this.state.product,
            description: this.state.description,
            category: this.state.category,
            url: this.state.url,
            price: this.state.price,
            currency: this.state.currency,
            quantity: this.state.quantity
        };

        this.stateSetter = this.stateSetter.bind( this );
        this.handleTitleChange = this.handleTitleChange.bind( this );
        this.handleDescriptionChange = this.handleDescriptionChange.bind( this );
        this.handleCategoryChange = this.handleCategoryChange.bind( this );
        this.handleImageChange = this.handleImageChange.bind( this );
        this.handleCurrencyChange = this.handleCurrencyChange.bind( this );
        this.handlePriceChange = this.handlePriceChange.bind( this );
        this.handleQuantityChange = this.handleQuantityChange.bind( this );
        this.handleSaveChanges = this.handleSaveChanges.bind( this );
        this.handleDeleteItem = this.handleDeleteItem.bind( this );
    }

    
    stateSetter(){
        // this.context.productServices.getProduct( this.props.params.productName ).then( (item) => {
           
        //     this.setState({ product: item.product, url: item.url, price: item.price, quantity: item.quantity, category: item.category, description: item.description });
        //     // this.temporary.product = this.state.product;
        //     // this.temporary.url = this.state.url;
        //     // this.temporary.price = this.state.price;
        //     // this. temporary.quantity = this.state.quantity;
        //     // this. temporary.description = this.state.description;
        //     // this. temporary.category = this.state.category;
        //     // console.log('state____ ', this.state);
        //     // console.log('temporary____ ', this.temporary);
        // });
    }


   componentDidMount(){
        // this.stateSetter();
        this.context.productServices.getProduct( this.props.params.productName ).then( (item) => {
           
            this.setState({ product: item.product, url: item.url, price: item.price, quantity: item.quantity, category: item.category, description: item.description });
            this.temporary.product = this.state.product;
            this.temporary.url = this.state.url;
            this.temporary.price = this.state.price;
            this. temporary.quantity = this.state.quantity;
            this. temporary.description = this.state.description;
            this. temporary.category = this.state.category;
            console.log('state____ ', this.state);
            console.log('temporary____ ', this.temporary);
        });
    }

    handleTitleChange( e ){
        let title = $( e.target ).val();
        this.temporary.product = title;
        this.setState( this.temporary );
    }

    handleDescriptionChange( e ){
        let description = $( e.target ).val();
        console.log(description);
        this.temporary.description = description;
        this.setState( this.temporary );
    }

    handleImageChange( e ){
        
        let url = $( e.target ).val();
        console.log(url);
        this.temporary.url = url;
        this.setState( this.temporary );
    }

    handleCategoryChange( e ){
        let category = $( e.target ).val();
        console.log(category);
        this.temporary.category = category;
        console.log(this.temporary);
        this.setState( this.temporary );
    }

    handleCurrencyChange( e ){
        let currency = $( e.target ).val();
        console.log(currency);
        this.temporary.currency = currency;
        this.setState( this.temporary );
    }

    handlePriceChange( e ){
        let price = $( e.target ).val();
        console.log(price);
        this.temporary.price = price;
        this.setState( this.temporary );
    }

    handleQuantityChange( e ){
        let quantity = $( e.target ).val();
        console.log(quantity);
        this.temporary.quantity = quantity;
        this.setState( this.temporary );
    }

    handleSaveChanges(){
        console.log( 'to be saved___________', this.state );
        this.context.productServices.updateProduct( this.state )
        .then( ( result ) =>{
            console.log( 'saved successfully. Congrats!' );
            setTimeout( function(){
                browserHistory.push( '/admin/products' );
            }, 1000 );
        });
    }

    handleCancelChanges(){
        
    }


    handleDeleteItem(){
        this.context.productServices.deleteItem( this.state.product )
        .then( ( result ) =>{
            console.log( 'DELETED successfully. Congrats!' );
            setTimeout( function(){
                browserHistory.push( '/admin/products' );
            }, 1000 );
        });
    }


    render(){
        
        return(
           <div>
                <div className="row row-centered ">
                     <div className="col-md-5 col-md-offset-1">
                        <fieldset>
                            <legend>Preview</legend>
                            <img src={this.state.url } className="img img-responsive"/>
                        </fieldset><br/>
                        <button className="btn btn-primary">see preview</button>
                     </div>

                     <div className="col-md-5">
                        <form>
                            <fieldset>
                                <legend>Information</legend>
                                <div className="form-group row">
                                    <label className="col-xs-2 col-form-label">Title: </label>
                                    <div className="col-xs-10">
                                        <input type="text" onChange={this.handleTitleChange} className="form-control" name="title" value={this.state.product}/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-xs-2 col-form-label">Description: </label>
                                    <div className="col-xs-10">
                                        <textarea className="form-control" onChange={this.handleDescriptionChange} placeholder="Describe your product..." value={this.state.description}></textarea>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-xs-2 col-form-label">Category: </label>
                                    <div className="col-xs-10">
                                        <input type="text" onChange={this.handleCategoryChange} className="form-control" value={this.state.category}/>
                                   </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-xs-2 col-form-label">Image: </label>
                                    <div className="col-xs-10">
                                        <input type="text" onChange={this.handleImageChange} className="form-control" value={this.state.url}/>
                                    </div>
                                </div>
                            </fieldset>
                            
                            <fieldset>
                                <legend>Pricing:</legend>
                                <div className="form-group row">
                                    <label className="col-xs-2 col-form-label">Currency: </label>
                                    <div className="col-xs-10">
                                        <select className="form-control" onChange={this.handleCurrencyChange}>
                                            <option>dollars</option>
                                            <option>euro</option>
                                            <option>lv</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-xs-2 col-form-label">Price: </label>
                                    <div className="col-xs-10">
                                        <input type="text"className="form-control" onChange={this.handlePriceChange} value={this.state.price}/>
                                    </div>
                                </div>
                            </fieldset>

                            <fieldset>
                                <legend>Availability</legend>
                                <div className="form-group row">
                                    <label className="col-xs-2 col-form-label">Quantity: </label>
                                    <div className="col-xs-10">
                                        <input type="number" className="form-control" onChange={this.handleQuantityChange} value={this.state.quantity}/>
                                    </div>
                                </div>
                            </fieldset>
                        </form>
                        <button className="btn btn-danger pull-right" onClick={this.handleDeleteItem}>Delete product</button>
                        <button className="btn btn-default pull-right">Cancel</button>
                        <button className="btn btn-primary pull-right" onClick={this.handleSaveChanges}>Save Changes</button>
                        
                        
                     </div>
                </div>
            </div>
            
        );
    }
}

AdminSingleProduct.contextTypes = {
  productServices: React.PropTypes.object
};


export default AdminSingleProduct;


