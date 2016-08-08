import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Link} from 'react-router'


class CartRow extends React.Component{
    constructor( props ){
        super( props );
    }

    componentWillReceiveProps(){

    }


    render(){

     
            return (
                <tr className="cartRow">
                    <td><Link to={ this.props.product }><img src={ this.props.url } style={{ width: "30px", height: "30px" }}/></Link></td>
                    <td><Link to={ this.props.product }>{ this.props.product }</Link></td>
                    <td>{ this.props.ordered }<div className="plusAndMinus"><button type="button" className="btn btn-default plus" onClick={this.props.onAdd}><p>+</p></button><button type="button" className="btn btn-default minus" onClick={this.props.onSubtract}name="minus"><p>-</p> </button></div></td>
                    <td>${ (this.props.ordered * this.props.price).toFixed(2) }</td>
                    <td><Link to="/cart" onClick={this.props.onRemove}>remove</Link></td>
                </tr>
            );
    }
}

CartRow.contextTypes = {
  productServices: React.PropTypes.object
};

export default CartRow;