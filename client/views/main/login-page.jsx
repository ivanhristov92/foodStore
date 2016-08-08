'use strict';

import React from 'react';
import $ from 'jquery';

import { browserHistory } from 'react-router';



class LogInPage extends React.Component{
    constructor( props ){
        super( props );

        this.state = { username: '',  password: '' };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }



    handleNameChange (e) {
        this.setState({ username: e.target.value });
    }

    handlePasswordChange (e) {
        this.setState({ password: e.target.value });
    }

    handleSubmit ( e ) {
        e.preventDefault();
        var username = this.state.username.trim();
        var password = this.state.password.trim();
        if (!password || !username) {
            console.log('aaaa');
        return;
        }
        console.log( this.state );
        this.props.onLogIn( { username:username, password: password } )
    }


    render(){

       return (
          
           <div className="loginForm row">
                <form className="form-horizontal col-md-6 col-md-offset-3" role="form">
                    <div className="form-group usernameGroup">
                        <label className="control-label col-sm-2" htmlFor="username">Username:</label>
                        <div className="">
                        <input value={this.state.username} type="username" className="form-control" id="username" placeholder="Enter username" onChange={this.handleNameChange}/>
                        </div>
                    </div>
                    <div className="form-group passwordGroup">
                        <label className="control-label col-sm-2" htmlFor="pwd">Password:</label>
                        <div className=""> 
                        <input type="password" className="form-control" id="password" placeholder="Enter password" onChange={this.handlePasswordChange}/>
                        </div>
                    </div>
                    <div className="form-group"> 
                        <div className="col-sm-offset-2 ">
                        <button type="button" className="btn btn-default" onClick={this.handleSubmit}>Login</button>
                        </div>
                    </div>
                </form>
            
           </div>
       );
    }
}

LogInPage.contextTypes = {
    userServices: React.PropTypes.object
};

export default LogInPage;