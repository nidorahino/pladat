import React, { Component } from 'react';

import MintAnimation from '../uiComponents/Mint';

import './styles/Login.css';
import './styles/Base.css';
import './styles/MediaPages.css';

import { Link, Redirect } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as allUserActions from '../../actions/UserActions';

import anime from 'animejs';
import ButtonLoader from '../uiComponents/ButtonLoader';

class Login extends Component {
    constructor(props) {
        super(props);
        this.errRef = React.createRef();
        this.state = {
            email: '',
            password: '',
            authErrors: [],
            authErrorsMapper: [],
            formSubmitted: false,
            sumbitting: false,
            fakeIdIndex: 0,
            errorsLoaded: false,
            successfullSignUp: false,
            redirectCompToken: "",
            canRedirect: false
        }
    }

    componentDidMount() {
        // console.log('login page mounted idkkk');
        this.props.actions.userActions.clearAuthErrors();
        this.props.actions.userActions.clearAuthState();
        if(this.props.location.state) {
            if(this.props.location.state.email) {
                const passedEmail = this.props.location.state.email;
                this.setState({
                    email: passedEmail
                })
            }
        }
    }

    componentDidUpdate (prevProps) {
        const { user, authMessage, authError, errorsDidChange, authState, isAuthenticated, isLoading,  } = this.props.user;

        if(prevProps.user !== this.props.user) {
            if(user && isAuthenticated ) {
                this.setState({
                    submitting: false,
                    successFullLogin: true,
                    canRedirect: true,
                    redirectCompToken: this.computeRedirectUrl()
                })
            }
            
            if(authError !== prevProps.user.authError && errorsDidChange && (!authError || authError.length < 1) && this.state.formSubmitted && authState !== 'USER_LOGGING_IN') {
                this.setState({
                    authErrors: [],
                    authErrorsMapper: [],
                    errorsLoaded: false,
                    submitting: false
                })
            }
            else if(authError !== prevProps.user.authError && errorsDidChange && this.state.formSubmitted && authState !== 'USER_LOGGING_IN') {
                if(authError !== this.state.authErrors[0]) {
                    let tempArr = [];
                    tempArr.push({msg: authError});
                    this.setState({
                        authErrors: tempArr,
                        authErrorsMapper: tempArr,
                        errorsLoaded: true,
                        submitting: false
                    })
                }
            } 
            else {
                if(!errorsDidChange && this.state.authErrorsMapper.length < 1 && this.state.authErrors.length > 0 && this.state.formSubmitted === true && authState !== 'USER_LOGGING_IN') {
                    let temp = this.state.authErrors;
                    this.setState({
                        authErrorsMapper: temp,
                        errorsLoaded: true,
                        submitting: false
                    })
                }
                if(!errorsDidChange && this.state.authErrorsMapper.length > 0 && this.state.authErrors.length > 0 && this.state.submitting && authState !== 'USER_LOGGING_IN') {
                    this.setState({
                        submitting: false
                    })
                }
            }
        }

    }

    handleBasicOnSuccess = () => {
        switch(this.props.user.user.typeOfUser) {
            case 'Student':
                return this.props.user.user.hasAtLeastOneImage ? `/s/discover` : `/s/me`;
            case 'Recruiter':
                return this.props.user.user.hasAtLeastOneImage ? `/r/discover` : `/r/me`;
            case 'Employer':
                return this.props.user.user.hasAtLeastOneImage ? `/e/discover` : `/e/me`;
            default:
                return;
        }
    }

    computeRedirectUrl = () => {
        let userType = this.props.user.user.typeOfUser.toLowerCase();
        let basicComplete = this.props.user.user.basicProfileInfoComplete;

        let url = basicComplete ? this.handleBasicOnSuccess() : `${userType}/basicInfo`;

        return url;
    }

    errorOnShowAnimation = () => {
        anime({
            targets: '#auth-login-form-error-container .auth-form-error',
            delay: anime.stagger(80),
            visibility: 'visible',
            translateX: [
                {value: -40, duration: 80},
                {value: 40, duration: 80},
                {value: -40, duration: 80},
                {value: 40, duration: 80},
                {value: 0}
            ],
            easing: 'easeInOutBounce',
        });
    }

    popErr = (idx, iteration) => {
        if(this.state.authErrorsMapper.length == 1) {
            this.setState({
                authErrorsMapper: [],
                formSubmitted: false,
                fakeIdIndex: iteration+1
            })
        }
        else {
            const newArr = this.state.authErrorsMapper;
            let otherArr = newArr;
            otherArr.splice(idx, 1);
            this.setState({
                authErrorsMapper: otherArr,
                formSubmitted: false,
                fakeIdIndex: iteration+1
            })
        }
    }

    handleErrorRemoval = (event) => {
        event.preventDefault();
        const targetId = event.target.parentNode.id;
        const actualNode = event.target.parentNode;
        const index = parseInt(actualNode.getAttribute('data-key'));
        const oldIterationNum = parseInt(actualNode.getAttribute('error-iteration'));
        const func = this.popErr;

        let animePromise = new Promise((resolve, reject) => {
            anime({
                targets: actualNode,
                opacity: anime.stagger([1,0], {easing: 'easeOutCirc'}),
                translateY: [
                    {value: -100, easing: 'easeOutCirc'}
                ],
                duration: 400,
                easing: 'easeOutCirc',
                complete: function() {
                    window.setTimeout(function() {
                        resolve(true);
                    }, 50);
                }
            })
        })
        .then((val) => {
            if(val === true) {
                func(index, oldIterationNum);
            }
        })
    }

    
    handleFormSubmit = async (event) => {

        if(event) {
            event.preventDefault();
        }

        this.setState({
            formSubmitted: true,
            submitting: true
        });

        const { email, password } = this.state;
        const userCred = { email, password };
        // console.log(userCred);

        // setTimeout(() => {
        //     this.props.actions.userActions.logInUser(userCred);
        // }, 1000);

        this.props.actions.userActions.logInUser(userCred);
    }

    handleEmailInput = (e) => {
        this.setState({
            email: e.target.value
        });
    }

    handlePasswordInput = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    handleFormKeyPress = (event) => {
        switch(event.target.id) {
            case "auth-login-form-email-input":
                if(event.keyCode === 13 || event.which === 13) {
                    document.getElementById("auth-login-form-password-input").focus();
                    event.preventDefault();
                }
                break;
            case "auth-login-form-password-input":
                if(event.keyCode === 13 || event.which === 13) {
                    // document.getElementById("auth-login-form-submit-btn").focus();
                    // event.preventDefault();
                    this.handleFormSubmit();
                }
                break; 
        }
    }


    render() {
        if(this.state.canRedirect === true) {
            return <Redirect to={this.state.redirectCompToken}/>
        }
        if(this.state.errorsLoaded === true && this.state.authErrorsMapper && this.state.authErrorsMapper.length > 0  && this.state.formSubmitted) {
            this.errorOnShowAnimation();
        }

        return (
            <div className="page-wrapper" id="login-page-wrapper">

                <div className="auth-form-error-container" id="auth-login-form-error-container">
                    {
                        this.state.authErrorsMapper ?

                        this.state.authErrorsMapper.map((err, i) => {
                            return (
                                <span className="auth-form-error" error-iteration={this.state.fakeIdIndex} data-key={i} key={i+""+this.state.fakeIdIndex} id={this.state.fakeIdIndex+"-error-span"+i}>
                                    <span id={"close-btn"+i} className="auth-form-error-closebtn text" onClick={this.handleErrorRemoval}>&#10006;</span>
                                    <h3 className="text"> {err.msg} </h3>
                                </span>
                            )
                        })
                        :
                        ""
                    }
                </div>

                <div className="auth-form-wrapper" id="auth-login-form-wrapper">
                    <div className="auth-form-title">
                        <h1 className="text form-title" id="auth-form-login-title">Log In</h1>
                    </div>

                    <div className="auth-form-container" id="auth-login-form-container">

                        <div className="auth-form-container-left" id="auth-login-form-container-left">
                            <form id="auth-login-formElem">
                                <div className="auth-form-inputLine" id="auth-login-emailInput-container">
                                    <input type="email" value={this.state.email} onChange={this.handleEmailInput} onKeyPress={this.handleFormKeyPress} placeholder="email"/>
                                </div>
                                <div className="auth-form-inputLine" id="auth-login-passInput-container">
                                    <input type="password" value={this.state.password} onChange={this.handlePasswordInput} onKeyPress={this.handleFormKeyPress} placeholder="password"/>
                                </div>
                           
                                <div className="auth-form-inputLine auth-form-submitBtn-container" id="auth-login-submitBtnContainer">
                                    <button onClick={this.handleFormSubmit} className="auth-form-submitBtn">
                                        {this.state.submitting ? <ButtonLoader /> : <h2 className="text">Login</h2>}
                                    </button>
                                </div>

                                <div className="auth-form-redirectLinks" id="auth-login-form-redirectLinks">
                                    <span><Link to="/login"><h3>Forgot password? <span>Send email.</span></h3></Link></span>
                                    <span><Link to="/register"><h3>Don't have an account? <span>Sign up.</span></h3></Link></span>
                                </div>
                            </form>

                        </div>

                        <div className="auth-form-container-right" id="auth-login-form-container-right">
                            <MintAnimation />

                            <div className='auth-form-container-right-footer'> <Link to='/'><h2>Place<span>Mint</span></h2></Link> </div>
                        </div>

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
  
  
export default connect(mapStateToProps, mapDispatchToProps)(Login);