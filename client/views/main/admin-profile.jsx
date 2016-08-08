'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Menu from './menu'
import SubMenu from './sub-menu'
import CategoryInfo from './category-info';
import ProductList from './product-list';
import BestSellers from './best-sellers';
import Social from './social';
import ProductServices from '../../services/product.services'
import AdminMenu from './admin-menu';

import { browserHistory } from 'react-router';

import $ from 'jquery';

class AdminProfile extends React.Component{
    constructor( props ){
        super( props );

        this.state = {
            username: '',
            password: '',
            repeatPassword: '',
            toChange: ''
        }

        this.temporary = {
            username: this.state.username,
            password: this.state.password,
            repeatPassword: this.state.repeatPassword,
            toChange: this.state.toChange
        };
    
        this.handleUsernameChange = this.handleUsernameChange.bind( this );
        this.handlePasswordChange = this.handlePasswordChange.bind( this );
        this.handleRepeatPasswordChange = this.handleRepeatPasswordChange.bind( this );
        this.handleSaveChanges = this.handleSaveChanges.bind( this );
    }


    componentDidMount(){
        this.temporary.username = window.localStorage['username'];
        this.temporary.toChange = window.localStorage['username'];
        this.setState( this.temporary );
    }

    handleUsernameChange( e ){
        let username = $( e.target ).val();
        this.temporary.username = username;
        this.setState( this.temporary );
    }

    handlePasswordChange( e ){
        let password = $( e.target ).val();
        console.log(password);
        this.temporary.password = password;
        this.setState( this.temporary );
    }

    handleRepeatPasswordChange( e ){
        
        let repeatPassword = $( e.target ).val();
        console.log(repeatPassword);
        this.temporary.repeatPassword = repeatPassword;
        this.setState( this.temporary );
    }


    handleSaveChanges(){
        console.log( 'to be saved___________', this.state );
        if( this.state.password === this.state.repeatPassword ){
            this.context.userServices.updateUser( { username: this.state.username, password: this.state.password, toChange: this.state.toChange } )
            .then( ( result ) =>{
                console.log( 'saved successfully. Congrats!' );
                setTimeout( function(){
                    browserHistory.push( '/admin' );
                }, 1000 );
            });
        } else {
            console.log('check password');
        }
        
    }

    handleCancelChanges(){
        
    } 


    render(){
        return(
            <div>
                <div className="row row-centered ">

                     <div className="col-md-6 col-md-offset-3">
                        <form>
                            <fieldset>
                                <legend>Account Information</legend>
                                <div className="form-group row">
                                    <label className="col-xs-2 col-form-label">Username: </label>
                                    <div className="col-xs-10">
                                        <input type="text"  onChange={this.handleUsernameChange} className="form-control" name="title" value={this.state.username}/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-xs-2 col-form-label">New Password: </label>
                                    <div className="col-xs-10">
                                        <input type="password" onChange={this.handlePasswordChange} className="form-control" value={this.state.password}/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-xs-2 col-form-label">Repeat Password: </label>
                                    <div className="col-xs-10">
                                        <input type="password" onChange={this.handleRepeatPasswordChange} className="form-control" value={this.state.repeatPassword}/>
                                    </div>
                                </div>
                            </fieldset>
                            
                            

                        </form>
                        <div className="col-md-12">
                            <button className="btn btn-primary pull-right" onClick={this.handleSaveChanges}>Save Changes</button>
                            <button className="btn btn-default pull-right">Cancel</button>
                        </div>
                        
                        
                     </div>
                </div>
            </div>
        );
    }
}

AdminProfile.contextTypes = {
    productServices: React.PropTypes.object,
    userServices: React.PropTypes.object
};

export default AdminProfile;