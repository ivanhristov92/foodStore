import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Link} from 'react-router';

class CategoryInfo extends React.Component{
    constructor( props ){
        super( props );
    }

    render(){

        let cat = '';
        if ( this.props.category == 'all' ) {
            cat = 'food';
        } else {
            cat = this.props.category;
        }
        
        return(
            <div className="categoryWrapper">
                <div className="categoryBox">
                    <p>
                        <span className="showingAll"><i>Showing all:</i></span>
                    </p>
                    <h3 className="categoryInfo">{ cat }</h3>
                </div>
            </div>
        );
    }
}

export default CategoryInfo;