import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as allUserActions from '../../actions/UserActions';

import { Redirect } from 'react-router-dom';

import './styles/Base.css';
import './styles/MainBase.css';

class MainWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userType: this.props.user.user ? this.props.user.user.typeOfUser : null,
            redirectToLogin: false,
            redirect: false,
            redirectTo: null,
            possibUrlUsrTypes: 'sre'
        }

        if(this.props.user.user) {
        }
    }



    componentDidUpdate(prevProps) {
        if(this.props !== prevProps) {
            const { loggedIn, isAuthenticated, userLoginVerificationFail, authState, user } = this.props.user;

            let correctUrlUserType = this.props.user.isAuthenticated ? this.state.userType.toLowerCase().trim().substring(0,1) : null;

            let curUrlArr = this.props.location && this.props.location.pathname ? this.props.location.pathname.split('/') : this.props.match.path;
            let curUrlUserType = curUrlArr[1];

            if(!isAuthenticated || !user) {
                // console.log('redirecting to login from main wrapper');
                this.setState({ redirectToLogin: true })
            }
            if(correctUrlUserType !== curUrlUserType && this.state.possibUrlUsrTypes.indexOf(curUrlUserType) >=0 && isAuthenticated) {
                // console.log('redirecting to correct url from main wrapper');
                this.setState({
                    redirect: true,
                    redirectTo: `/${correctUrlUserType}`+this.arrayToString(curUrlArr, 2)
                })
            }
        }
    }

    componentDidMount() {
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

    render() {
        if(this.state.redirectToLogin) {
            return <Redirect to='/login'/>
        }
        if(this.state.redirect) {
            return <Redirect to={this.state.redirectTo}/>
        }
        return (
            <div className='page-wrapper' id="MainWrapper">
                {React.cloneElement({...this.props}.children, {...this.props})}
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        user: state.user,
        students: state.students,
        recruiters: state.recruiters,
        employers: state.employers
    }
}
        
const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            userActions: bindActionCreators(allUserActions, dispatch),
        }
    };
}
  
  
export default connect(mapStateToProps, mapDispatchToProps)(MainWrapper);