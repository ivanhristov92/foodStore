import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Link} from 'react-router';

class SubMenu extends React.Component{
    constructor( props ){
        super( props );
    }

    render(){
        return(
            <div id="subMenu" className="subMenu">
                <Link to="/products/categories/all" className="subMenuText">All</Link>
                <Link to="/products/categories/fruits" className="subMenuText">Fruits</Link>
                <Link to="/products/categories/vegetables" className="subMenuText">Vegetables</Link>
                <Link to="/products/categories/nuts" className="subMenuText">Nuts</Link>
            </div>
        );
    }
}

export default SubMenu;