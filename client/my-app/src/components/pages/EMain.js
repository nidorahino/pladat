import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Link, Redirect, Switch, Route } from 'react-router-dom';


import * as allUserActions from '../../actions/UserActions';
import * as allEmployerActions from '../../actions/EmployerActions';

import MainWrapper from '../pages/MainWrapper';

import ViewLoader from '../uiComponents/ViewLoader';

import ProfileEdit from '../view/ProfileEdit';
import Preview from '../view/Preview';
import Settings from '../view/Settings';
import DiscoverView from '../view/DiscoverView';
import JobCreate from '../view/JobCreate';
import FourOFour from '../pages/FourOFour';




import './styles/Base.css';
import './styles/MainBase.css';
import './styles/EMain.css';

class EMain extends React.Component {
    constructor(props) {
        super(props);

        if(this.props.user.user) {
            this.props.actions.userActions.verifyUserLogin(this.props.user.user._id);
        }

        this.state = {
            employerUser: this.props.user.user,
            employerUserName: this.props.user.user ? this.props.user.user.firstname : 'PlaceMint User',
            employerUserLastName: this.props.user.user ? this.props.user.user.lastname : "",
            employerUserMatches: this.props.user.userMatches,
            employerUserImages: this.props.user.user ? this.props.user.user.images : [],
            userType: this.props.user.user ? this.props.user.user.typeOfUser : null,
            loadingJobs: false,
            loadingUser: true,
            redirectToLogin: false,
            redirect: false,
            redirectTo: null,
            possibUrlUsrTypes: 'sre',

            curLocation: this.props.location.pathname,
            headerText: 'PlaceMint'
        }
    }

    componentDidUpdate(prevProps) {
        if(prevProps !== this.props) {
            const { loggedIn, isAuthenticated, userLoginVerificationFail, authState, user } = this.props.user;

            if(!isAuthenticated || !user && !this.state.loadingUser) {
                // console.log('redirecting to login  from EMain wrapper');
                this.setState({ redirectToLogin: true })
            }
            else {
                this.setState({
                    loadingUser: false
                })
            }

            if(prevProps.location !== this.props.location) {
                this.setState({
                    curLocation: this.props.location.pathname
                });

                if(this.props.location.pathname === '/e/settings') {
                    this.setState({
                        headerText: "Settings"
                    })
                }
                else if(this.props.location.pathname === '/e/me' || this.props.location.pathname === '/e/me/preview_profile') {
                    this.setState({
                        headerText: "PlaceMint Profile"
                    })
                }
                else {
                    this.setState({
                        headerText: 'PlaceMint'
                    })
                }
            }
        }
    }

    componentDidMount() {
        this.props.actions.userActions.getUser();
        if(this.props.location) {
            this.setState({
                curLocation: this.props.location.pathname
            });

            if(this.props.location.pathname === '/e/settings') {
                this.setState({
                    headerText: "Settings"
                })
            }
            else if(this.props.location.pathname === '/e/me' || this.props.location.pathname === '/e/me/preview_profile') {
                this.setState({
                    headerText: "PlaceMint Profile"
                })
            }
            else {
                this.setState({
                    headerText: 'PlaceMint'
                })
            }
        }
    }

    arrayToString = (arr, startIdx) => {
        if(startIdx > arr.length) {
            return "";
        }
        if(startIdx === arr.length-1) {
            return `/${arr[startIdx]}`;
        }
        let pathCombine = ''; 
        for(let i = startIdx; i < arr.length; i++) {
            pathCombine+=`/${arr[i]}`;
        }
        return pathCombine;
    }

    handleCreateAvatar = () => {
        if(this.state.employerUserImages.length > 0) {
            return (
                <div className='grid-left-avatarRealPic'>
                    <img className='avatar' src={this.state.employerUserImages[0].secure_url} />
                </div>
            )
        }
        else {
            if(this.state.employerUserName !== 'PlaceMint User') {
                return (
                    <div className='grid-left-avatarGenerated'>
                        <h4>{this.state.employerUserName.substring(0,1).toUpperCase() + this.state.employerUserLastName.substring(0,1).toUpperCase()}</h4>
                    </div>
                )
            }
            else {
                return (
                    <div className='grid-left-avatarGenerated'>
                        <h4>PU</h4>
                    </div>
                )
            }
        }
    }


    handleLogOut = (event) => {
        event.preventDefault();
        this.props.actions.userActions.logOutUser();
        return;
    }


    render() {
        let tempAvatar = this.handleCreateAvatar();
        if(this.state.redirectToLogin) {
            return <Redirect to='/login'/>
        }
        if(this.state.redirect) {
            return <Redirect to={this.state.redirectTo}/>
        }
        return (
            <MainWrapper location={this.props.location} match={this.props.match}>

            <div className='page-wrapper' id='EMain-wrapper'>
                {
                    this.state.loadingJobs || this.state.loadingUser?

                    <div className='main-loader-div'>
                        <h1 className='text'>Getting things ready for you</h1>

                        <ViewLoader />
                    </div>

                    :

                        <div className='inner-gridWrapper' id='EMain-inner-girdWrapper'>
                            <div className="inner-gridContainer">
                                <div className='grid-left-sidebar'>
                                    <div className='grid-left-nameHolder'>
                                        {
                                            this.state.curLocation.indexOf('/e/discover') < 0 ?

                                            <span className="grid-left-backToDiscoverBtn" title="Discover">
                                                <Link to='/e/discover/'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                                                        <path d="M0 0h24v24H0z" fill="#00a68a"/>
                                                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                                                    </svg>
                                                </Link>
                                            </span>
                                            : ''
                                        }
                                        <span className='grid-left-nameHolder-nameLink'><Link to='/e/me'><h1 className='text'>{this.state.employerUserName}</h1></Link></span>
                                        <span className='grid-left-nameHolder-avatarLink'><Link to='/e/me'>{tempAvatar}</Link></span>
                                    </div>
                                    <div className='grid-left-contentHolder'>
                                       {
                                           ((this.state.curLocation === '/e/discover') || (this.state.curLocation === '/e/discover/')) ?

                                           <h2>Matches go here</h2>

                                           :

                                           <div className='grid-left-editProfileTabs'>
                                               <span className='text' style={((this.state.curLocation === '/e/me') || (this.state.curLocation === '/e/me/')) ? {color: "#00a68a", pointerEvents: 'none'} : {color: "#d3d3d3"}}>
                                                    <Link to='/e/me'><h3>Edit Profile</h3></Link>
                                                </span>
                                               <span className='text' style={((this.state.curLocation === '/e/settings') || (this.state.curLocation === '/e/settings/')) ? {color: "#00a68a", pointerEvents: 'none'} : {color: "#d3d3d3"}}>
                                                   <Link to='/e/settings'><h3>Settings</h3></Link>
                                                </span>
                                                <span className='text' style={((this.state.curLocation === '/e/create-job') || (this.state.curLocation === '/e/create-job/')) ? {color: "#00a68a", pointerEvents: 'none'} : {color: "#d3d3d3"}}>
                                                   <Link to='/e/create-job'><h3>Create Job</h3></Link>
                                                </span>
                                               <span className='text grid-left-editProfileTabSlotText' onClick={this.handleLogOut}><h3>Log out</h3></span>
                                           </div>
                                       }
                                    </div>
                                </div>
                                <div className='grid-top-title'>
                                    {
                                        this.state.headerText.indexOf('PlaceMint') >=0 ?

                                            <h1 className='text'>{this.state.headerText.substring(0,5)}<span className='grid-top-title-headerEmphasis'>{this.state.headerText.substring(5,9)}</span>{this.state.headerText.substring(9)}</h1>

                                        :
                                        
                                        <h1 className='text'>{this.state.headerText}</h1>
                                    }
                                </div>
                                <div className='grid-center-main'>
                                    <Switch>
                                        <Route exact path = '/e' component={DiscoverView}/>
                                        <Route exact path='/e/discover/' component={DiscoverView} />
                                        <Route exact path='/e/discover/:id' component={null} />
                                        <Route exact path='/e/me' component={ProfileEdit} />
                                        <Route exact path='/e/me/preview_profile' component={Preview} />
                                        <Route exact path='/e/settings' component={Settings}/>
                                        <Route exact path='/e/create-job/' component={JobCreate} />
                                        <Route component={FourOFour} />
                                    </Switch>
                                </div>
                            </div>
                        </div>
                }
            </div>
            </MainWrapper>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        employers: state.employers
    }
}
        
const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            userActions: bindActionCreators(allUserActions, dispatch),
            employerActions: bindActionCreators(allEmployerActions, dispatch)
        }
    };
}
  
  
export default connect(mapStateToProps, mapDispatchToProps)(EMain);