import React from 'react';
import ReactDOM from 'react-dom';

class Social extends React.Component{
    constructor( props ){
        super( props );
    }

    render(){
        return(
            <div className="row row-centered social-row">
                <div className="social col-md-4">
                    <div className="col-md-12">
                        <h3>Stay tuned!</h3>
                        <ul>
                            <li>
                            <span className="facebook">
                                <img src="https://www.facebookbrand.com/img/fb-art.jpg" />
                                <a>Facebook</a>
                            </span>
                            </li>
                            <li>
                                <span className="tweeter">  
                                    <img src="http://www.cbesudluberon.com/assets/picto-twitter.png" />
                                    <a>Tweeter</a>
                                </span>
                            </li>
                        </ul>
                        
                        
                    </div>
                </div>

                <div className="partners col-md-4">
                    <div className="col-md-12">
                        <h3>Our Partners</h3>
                    </div>
                </div>

                <div className="more col-md-4">
                    <div className="col-md-12">
                        <h3>More</h3>
                        <ul>
                            <li><a>Get in touch</a></li>
                            <li><a>About</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default Social;