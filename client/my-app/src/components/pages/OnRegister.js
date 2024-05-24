import React from 'react';
import { Redirect } from 'react-router-dom';
import { ON_REGISTER_SUCCESS_KEY } from '../../staticData/config';

import './styles/Base.css';
import './styles/OnRegister.css';
import './styles/MediaPages.css';
import { setInterval } from 'timers';


export default class OnRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            preliminaries: null, 
            success: false,
            redirectToRegister: false,
            startCountDown: false,
            countDownTime: null
        }
    }

    componentDidMount() {
        const jwt = require('jsonwebtoken');
        const token = this.props.match.params.prelims;

        jwt.verify(token, ON_REGISTER_SUCCESS_KEY, {expiresIn: '24h'}, (err, data) => {
            if(err) {
                this.setState({
                    redirectToRegister: true
                })
            }

            else {
                if(!err && data) {
                    let timeLeft = this.configureCoutDown(data.data.dateExpr);
                    this.setState({
                        preliminaries: {
                            name: data.data.name,
                            email: data.data.email,
                            expirationDate: data.data.dateExpr
                        },
                        success: true,
                        countDownTime: {
                            hours: timeLeft.h,
                            minutes: timeLeft.m,
                            seconds: timeLeft.s
                        },
                        startCountDown: true
                    }, () => {
                        this.commenceCountDown();
                    })
                }
            }

        });

    }

    commenceCountDown = () => {
        if(this.state.startCountDown) {
            setInterval(() => {
                if(this.state.countDownTime.seconds === 0 && this.state.countDownTime.hours === 0 && this.state.countDownTime.minutes === 0) {
                        this.setState({
                            startCountDown: false
                        })
                }
                if(this.state.countDownTime.seconds === 0) {
                    this.setState({
                        countDownTime: {
                            ...this.state.countDownTime,
                            minutes: this.state.countDownTime.minutes-1,
                            seconds:60
                        }
                    })
                }
                if(this.state.countDownTime.minutes === 0) {
                    this.setState({
                        countDownTime: {
                            ...this.state.countDownTime,
                            hours: this.state.countDownTime.hours > 0 ? this.state.countDownTime.hours-1: 0,
                            minutes: 59
                        }
                    })
                }
                else {
                    this.setState({
                        countDownTime: {
                            ...this.state.countDownTime,
                            seconds: this.state.countDownTime.seconds-1
                        }
                    })
                }
            }, 1000)
        }
    }

    configureCoutDown = (futureDateString) => {
        let exp = new Date(futureDateString);
        let now = new Date(Date.now());

        let diff = exp - now;

        let seconds = parseInt((diff/1000)%60);
        let minutes = parseInt(((diff/1000)/60)%60);
        let hours = parseInt(((diff/1000)/60)/60);
        return {h: hours, m: minutes, s: seconds};
    }

    render() {
        if(sessionStorage.getItem('utoken') !== null) {
            return <Redirect to='/login' />
        }
        if(this.state.redirectToRegister) {
            return <Redirect to="/register"/>
        }
        return (
            <div id="register-on-success" className="page-wrapper">
                <div id="register-on-success-inner">
                    <h1>Place<span>Mint</span></h1>
                    {
                        this.state.success ? 
                        
                        <h2 id="register-on-success-text" className="text">
                            Well done <span className="register-on-success-text-info">{this.state.preliminaries.name}</span>! To complete your registeration,
                            and in order to log in, check your email at <span className="register-on-success-text-info">{this.state.preliminaries.email}</span>,
                            for the account verification email sent from us. 
                            Click on the verification link provided, and proceed with logging in. <br/> <br/>

                            Your email verification link expires in: <span className="on-reg-success-time-comp">{this.state.countDownTime.hours}</span> hours <span className="on-reg-success-time-comp">{this.state.countDownTime.minutes}</span> minutes <span className="on-reg-success-time-comp">{this.state.countDownTime.seconds}</span> seconds
                        </h2>

                        :

                        ""
                    }
                    {/* {this.state.startCountDown ? this.commenceCountDown() : ""} */}

                    
                </div>
                <div id="resendVerificationContainer" className="auth-form-redirectLinks">
                    <span><h3>Didn't receive an email? <span>Resend.</span></h3></span>
                </div>
            </div>
        )
    }
}