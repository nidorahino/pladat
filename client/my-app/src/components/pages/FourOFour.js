import React from 'react';

import { Link, Redirect, Switch, Route } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as allUserActions from '../../actions/UserActions';

import FourFourVines from '../uiComponents/FourFourVines';

import TypingText from '../uiComponents/TypingText';
import './styles/Base.css';
import './styles/FourOFour.css';


class FourOFour extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectTo: "/"
        }
    }

    render() {
        return(
            <div id='four0fourWrapper' className='page-wrapper'>
                <div id='fourfour-innerContainer'>
                    <div className="fourfourinnercut">
                        <h1 id="fourfourTitle"><span>4</span>0<span>4</span></h1>
                        <h1 id="fourfourSubtitle">
                            Big <span>Oofs...</span>
                        </h1>
                    </div>

                    <div className="fourfourinnercut" id="fourfourtypeholder">
                        <TypingText fpause={50000} statements={["The page you're trying to access does not exist... So why are you trying to do just that???"]}/>
                    </div>

                    <div id="fourfourfooter">
                        <h2>Go back to <Link to='/'><span className='fourfourfooterspec'>Place</span><span>Mint</span> homepage</Link> or <Link to='/login'><span>login</span></Link></h2>
                    </div>
                </div>
                <div id="fourfouranimesvgbox">
                    <FourFourVines dur={5000}/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}
        
const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            userActions: bindActionCreators(allUserActions, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FourOFour);