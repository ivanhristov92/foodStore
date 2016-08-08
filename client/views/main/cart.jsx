import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Link} from 'react-router'
import $ from 'jquery';

import CartRow from './cart-row';


class Cart extends React.Component{
    constructor( props ){
        super( props );
        this.state = { products: [], totalPrice: 0 };
        this.stateSetter = this.stateSetter.bind( this );
        this.addOneMore = this.addOneMore.bind(this);
        this.removeOneMore = this.removeOneMore.bind(this);
        this.removeAllOfOne = this.removeAllOfOne.bind(this);
        this.submitPayment = this.submitPayment.bind(this);
    }

    stateSetter(){
        this.context.productServices.getCart().then((results)=>{
            this.setState( { products: results[0].products, totalPrice: this.state.totalPrice } );
        });
    }


    componentDidMount(){
       this.stateSetter();
    }

    addOneMore( data ){
            return () => {
                $('.btn').attr("disabled", true);
                setTimeout(function(){$('.btn').attr("disabled", false);}, 800);
                this.context.productServices.addToCart( data )
                .then(()=>{
                    this.stateSetter();
                });
            };
    }

    removeOneMore( data ){
            return ( )=>{
                $('.btn').attr("disabled", true);
                setTimeout(function(){$('.btn').attr("disabled", false);}, 500);
                this.context.productServices.removeFromCart( data )
                .then(() =>{
                    this.stateSetter();
                }); 
            }
    }

    removeAllOfOne( data ){
        return ()=>{
            this.context.productServices.removeAllOfOne( data )
            .then( ()=>{
                this.stateSetter();
            });
        };
    }

    submitPayment( value ){
                return ()=>{
                    if( value > 0 ){
                        $('.amount').attr('value', value.toString());
                        $('#paypalForm').submit();
                    }
                }
    }


    render(){
        let total = 0;

        let cartRows = this.state.products.map((product) => {
            console.log( product );
            total += product.product.ordered * product.price;
            let data = {
                product: product.product.title,
                price: product.price,
                url: product.url,
                ordered: product.product.ordered
            };

            

            return (
                <CartRow key={`${data.product}${Math.random()*Math.random()}`} product={data.product} url={data.url} ordered={data.ordered} price={data.price}
                onAdd={ this.addOneMore( data )} onSubtract={this.removeOneMore( data )} onRemove={this.removeAllOfOne( data )}></CartRow>
            );
        });

        //if the cart is empy reply with a message
        if ( this.state.products.length === 0 ) {
            return (
                <div className="row emptyCart cartRow">
                    <h2 className="col-md-12">Your cart is empty</h2>

                    <p className="col-md-12 text-center">Perhaps you'd like to check some of our products below</p>
                </div>
            );
        }

        return(
        <div className="row cart-row">
            <h2 className="col-md-10 col-md-offset-1">Cart</h2>
            
            <table className="cartTable col-md-10 col-md-offset-1">
                <tbody>
                    <tr className="cartLabels">
                        <td>Image</td>
                        <td>Item</td>
                        <td>Quantity</td>
                        <td>Total</td>
                        <td>Remove</td>
                    </tr>
                    {cartRows}
                    <tr className="lastRow">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className="totalPrice">Total Price: { total.toFixed(2) }</td>
                        <td><button className="btn btn-default checkoutButton" onClick={this.submitPayment(total)}>Check Out!</button></td>
                    </tr>
                </tbody>
            </table>
            <div className="col-md-10 col-md-offset-1">
                

                <form name="_xclick" action="https://www.paypal.com/cgi-bin/webscr" method="post" id="paypalForm" style={{visibility: 'hidden'}}>
                    <input type="hidden" name="cmd" value="_xclick"/>
                    <input type="hidden" name="business" value="ivan_hristov_mail@mail.bg"/>
                    <input type="hidden" name="currency_code" value="USD"/>
                    <input type="hidden" name="item_name" value="FoodStore Purchase"/>
                    <input type="hidden" name="amount" value={total} className="amount"/>
                    <input type="image" src="http://www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif" name="submit" alt="Make payments with PayPal - it's fast, free and secure!"/>
                </form>
            </div>
        </div>
        );
    }
}

Cart.contextTypes = {
  productServices: React.PropTypes.object
};

export default Cart;