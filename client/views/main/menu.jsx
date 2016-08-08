'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Link} from 'react-router';

class Menu extends React.Component{
    constructor( props ){
        super( props );
    }


    render(){
        
        return  (

            <nav className="navbar navbar-default">
            <div className="container-fluid ">
                    
                    <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <a className="navbar-brand myBrand" href="#">FoodStore</a>
                    
                    </div>


                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul className="nav navbar-nav">
                        <li><Link to="" >HOME</Link></li>
                        <li><Link to="">SHOP</Link></li>
                    
                    </ul>
                    <ul className="nav navbar-nav navbar-right cart">
                        <li><Link to="/cart">CART</Link></li>
                    </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Menu;