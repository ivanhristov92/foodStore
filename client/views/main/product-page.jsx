import React from 'react';
import SubMenu from './sub-menu';
import CategoryInfo from './category-info';
import ProductList from './product-list';

class ProductPage extends React.Component{
    constructor( props ){
        super( props );
    }

    render(){
        return(
            <div>
            <SubMenu></SubMenu>
            <ProductList></ProductList>
            </div>
        );
    }
}

export default ProductPage;


