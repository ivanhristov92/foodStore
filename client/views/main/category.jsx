import React from 'react';
import SubMenu from './sub-menu';
import CategoryInfo from './category-info';
import ProductList from './product-list';

class Category extends React.Component{
    constructor( props ){
        super( props );
    }

    render(){
        return(
            <div>
            <SubMenu></SubMenu>
            <CategoryInfo category={this.props.params.categoryName}></CategoryInfo>
            <ProductList category={this.props.params.categoryName}></ProductList>
            </div>
        );
    }
}

export default Category;


