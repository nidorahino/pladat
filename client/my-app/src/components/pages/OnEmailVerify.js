import React from 'react';

import { Link, Redirect } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as allUserActions from '../../actions/UserActions';



import './styles/OnEmailVerify.css';
import './styles/Base.css';
import './styles/MediaPages.css';
import ViewLoader from '../uiComponents/ViewLoader';

class OnEmailVerify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            verifying: false,
            success: false,
            preliminaryInfo: null,
            token: null,
            user: null,
            onFinishContent: [],
        }
    }

    shouldComponentUpdate(x,y) {
        return this.state.success === false;
    }

    componentDidMount() {
        this.props.actions.userActions.clearAuthErrors();
        this.props.actions.userActions.clearAuthState();

        this.setState({
            verifying: true,
            token: this.props.match.params.token,
        }, () => {
            this.validateVerifyToken(this.state.token);
        })
    }

    componentDidUpdate(prevProps) {
        let { user, emailIsValidated, authMessage, authError, errorsDidChange, authState } = this.props.user;

        if(user && emailIsValidated && authState === 'USER_EMAIL_VERIFIED' && authError.length < 1) {
            let temp = [];
            temp.push({content: user.firstname + " " + user.lastname, id: "Name: "}, {content: user.email, id: "Email: "}, {content: user.typeOfUser, id: "User Type: "});
        
            this.setState({
                verifying: false,
                success: true,
                onFinishContent: temp
            })
        }
        if(authError !== prevProps.user.authError && errorsDidChange && !emailIsValidated && !user && authState == 'USER_EMAIL_VERIFICATION_FALIURE') {
            let tempArr = [];
            tempArr.push({content: authError});
            this.setState({
                onFinishContent: tempArr,
                verifying: false,
                success: false
            })
        }
    }

    validateVerifyToken = (token) => {
        setTimeout(() => {
            this.props.actions.userActions.verifyUserEmail(token);
        }, 5000)
    }

    render() {
        return (
            <div id="verify-email-page-wrapper" className="page-wrapper">
                
                <div id="main-card-view">
                    <h1 id="main-card-header" className="text">
                        Place<span>Mint</span>
                    </h1>
                    <div id="main-card-content-holder">
                        <div id='main-card-content0'>
                            {this.state.success ? <h2 className="text" id="success-verify-title">Your account has been <span>verified!</span></h2> : ""}
                            {/* <h2>Your account has been <span>verified!</span></h2> */}
                        </div>

                        <div id='main-card-content'>
                            {this.state.verifying ? <ViewLoader /> 
                            : this.state.onFinishContent.map((content, i) => {
                                return (
                                    <h2 className={this.state.success === false ? "card-content-text-err text": "card-content-text text"} key={i}>
                                        <span>{content.id}</span> {content.content}
                                    </h2>
                                )
                            })}
                            {/* <h2 className="card-content-text text">Name: Elon Musk</h2>
                            <h2 className="card-content-text text">Email: williamd8323@afsenyc.org</h2>
                            <h2 className="card-content-text text">Institution: undefined</h2>
                            <h2 className="card-content-text text">Role: undefined</h2> */}
                        </div>
                        
                        {
                            this.state.success ? 
                            <Link id="success-login-link" to={{
                                pathname: '/login',
                                state: { email: this.props.user.user.email}
                            }}>
                                <h2 className="text" id="success-login-link-text">
                                    Proceed to <span>Login</span>
                                </h2>
                            </Link>

                            :
                            ""
                        }

                            {/* <Link id="success-login-link" to={{
                                pathname: '/login',
                                // state: { email: this.props.user.user.email}
                                }}>
                                <h2 className="text" id="success-login-link-text">
                                    Proceed to <span>Login</span>
                                </h2>
                            </Link> */}
                    </div>
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
            userActions: bindActionCreators(allUserActions, dispatch),
        }
    };
}
  
  
export default connect(mapStateToProps, mapDispatchToProps)(OnEmailVerify);