import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as allUserActions from '../../actions/UserActions';

import { Redirect } from 'react-router-dom';

import './styles/Base.css';
import './styles/Media.css';

class BasicViewWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            correctType: null,
            redirectToLogin: false,
            basicSuccessForward: false,
            basicSuccessForwardRedirectTo: null,
            curUserType: this.props.user.user.typeOfUser,
            initHasBaiscComplete: this.props.user.user.basicProfileInfoComplete
        }
    }


    componentDidUpdate(prevProps) { 
        if(this.props !== prevProps) {
            // console.log('wrapper component update');
            const { basicProfileInfoComplete } = this.props.user.user;
            const { studentActionState, basicSuccessStud } = this.props.students;
            const { employerActionState, basicSuccessEmp } = this.props.employers;
            const { recruiterActionState, basicSuccessR } = this.props.recruiters;

            if(this.props.user.user.basicProfileInfoComplete && this.state.initHasBaiscComplete) {
                this.setState({
                    basicSuccessForward: true,
                    basicSuccessForwardRedirectTo: this.handleBasicOnSuccess()
                })
            }
            if((!this.state.initHasBaiscComplete) && (basicSuccessEmp || basicSuccessStud || basicSuccessR) && (studentActionState === 'STUDENT_PROFILE_EDIT_SUCCESS' || employerActionState === 'EDITING_EMPLOYER_PROFILE_SUCCESS' || recruiterActionState === 'VERIFY_AS_RECRUITER_EMAIL_SENT')) {
                this.setState({
                    basicSuccessForward: true,
                    basicSuccessForwardRedirectTo: this.handleBasicOnSuccess()
                })
            }
        }
    }

    componentDidMount() {
        let curUrl = this.props.route;
        let urlSplit = curUrl.split('/');
        let typeFromUrl = urlSplit[1];


        if(!this.props.user.isAuthenticated) {
            this.setState({
                redirectToLogin: true
            })
        }
        else {
            if(this.props.user.user.typeOfUser.toLowerCase() !== typeFromUrl) {
                this.setState({
                    redirect: true,
                    correctType: this.props.user.user.typeOfUser.toLowerCase()
                })
            }
        }
        if(this.props.user.user.basicProfileInfoComplete && this.state.initHasBaiscComplete) {
            this.setState({
                basicSuccessForward: true,
                basicSuccessForwardRedirectTo: this.handleBasicOnSuccess()
            })
        }

    }

    handleBasicOnSuccess = () => {
        switch(this.state.curUserType) {
            case 'Student':
                return `/s/me`;
            case 'Recruiter':
                return `/r/me`;
            case 'Employer':
                return `/e/me`;
            default:
                return;
        }
    }

    render() {
        if(this.state.redirect) {
            return <Redirect to={`/${this.state.correctType}/basicInfo`}/>;
        }
        if(this.state.basicSuccessForward) {
            return <Redirect to={this.state.basicSuccessForwardRedirectTo} />
        }
        if(this.state.redirectToLogin) {
            return <Redirect to='/login'/>;
        }
        return (
            <div className="BasicViewWrapper">
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
  
  
export default connect(mapStateToProps, mapDispatchToProps)(BasicViewWrapper);


