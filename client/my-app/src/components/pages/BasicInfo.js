import React from 'react';

import { Link, Redirect, Switch, Route } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as allUserActions from '../../actions/UserActions';

/* Views */
import StudentBasic from '../view/StudentBasic';
import EmployerBasic from '../view/EmployerBasic';
import RecruiterBasic from '../view/RecruiterBasic';

/* Loaders, and ui components */
import ViewLoader from '../uiComponents/ViewLoader';

import './styles/BasicInfo.css';
import './styles/Base.css';
import './styles/MediaPages.css';


class BasicInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userType: null,
            viewLoaded: false,
            userIsAuth: false,
            userBasicComplete: false,
            correctUrl: false,
            shouldRedirectToLogin: false,
            shouldRedirectToMain: false,
            loadingUser: true
        }
    }

    componentWillMount() {
        this.props.actions.userActions.getUser();
    }

    componentDidMount() {
        let waitForUserInfo;
        waitForUserInfo = setTimeout(() => {
            this.setState({
                userType: this.props.user.user.typeOfUser,
                viewLoaded: true,
                userIsAuth: this.props.user.loggedIn && this.props.user.isAuthenticated && this.props.userLoginVerified,
                userBasicComplete: this.props.user.user.basicProfileInfoComplete,
                shouldRedirectToLogin: !this.props.user.user || !this.props.user.loggedIn || !this.props.user.isAuthenticated || !this.props.user.userLoginVerified,
                shouldRedirectToMain: this.props.user.user.basicProfileInfoComplete
            }, () => {
                this.setState((prevState, props) => {
                    return { loadingUser: false }
                })
            })
        }, 3000);

        if(this.props.user.user && this.props.user.loggedIn && this.props.user.isAuthenticated) {
            clearTimeout(waitForUserInfo);
            this.setState({
                userType: this.props.user.user.typeOfUser,
                viewLoaded: true,
                userIsAuth: this.props.user.loggedIn && this.props.user.isAuthenticated && this.props.userLoginVerified,
                userBasicComplete: this.props.user.user.basicProfileInfoComplete,
                shouldRedirectToLogin: !this.props.user.user || !this.props.user.loggedIn || !this.props.user.isAuthenticated || !this.props.user.userLoginVerified,
                shouldRedirectToMain: this.props.user.user.basicProfileInfoComplete
            }, () => {
                this.setState((prevState, props) => {
                    return { loadingUser: false }
                })
            })
        }
    }

    render() {
        return(
            <div className="page-wrapper" id="basicInfo-page-wrapper">
                <div id="basicInfo-header-container"> <h1 className="text" id="basicInfo-header">Some <span>basic info</span> first...</h1> </div>
                {
                    this.state.loadingUser ?

                    <ViewLoader />

                    :

                    (
                        <div id="basicInfo-primary-wrapper">
                            <Switch>
                                <Route exact path="/student/basicInfo" component={StudentBasic}/>
                                <Route exact path="/recruiter/basicInfo" component={RecruiterBasic}/>
                                <Route exact path="/employer/basicInfo" component={EmployerBasic}/>
                            </Switch>
                        </div>
                    )
                }
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
  
  
export default connect(mapStateToProps, mapDispatchToProps)(BasicInfo);