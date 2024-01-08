import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUtensils} from '@fortawesome/free-solid-svg-icons';
class Header extends Component {


    render() {
        return (
            <div>
                <header>
                    <nav className='navbar navbar-expand-md navbar-dark bg-dark'>
                        <div>
                            <a href='http://localhost:3000/' className='navbar-brand'>
                            <FontAwesomeIcon icon={faUtensils} style={{color:"#ffffff",marginLeft: '10px'}}/>
                            </a>
                            <a href='http://localhost:3000/' className='navbar-brand'>MenuMakerz</a>
                        </div>
                    </nav>
                </header>
            </div>
        );
    }
}


export default Header;