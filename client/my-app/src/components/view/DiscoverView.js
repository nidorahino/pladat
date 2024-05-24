import React from 'react';

import './styles/DiscoverView.css';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as allUserActions from '../../actions/UserActions';
import * as allStudentActions from '../../actions/StudentActions';
import * as allRecruiterActions from '../../actions/RecruiterActions';
import * as allEmployerActions from '../../actions/EmployerActions';

import Card from '../view/Card';

import ViewLoader from '../uiComponents/ViewLoader';

import './styles/Preview.css';



class DiscoverView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gettingCandidates: false,

            curUserType: this.props.user.user.typeOfUser,

            fakeJob: {
                title: 'Great tech Job',
                description: 'Beautiful Job',
                companyName: 'Nozama Inc',
                companyId: '5fd498ae25f410120b276769',
                locations: ['Seattle, WA'],
                todo: 'Coding stuff',
                skillsRequired: 'Java',
                typeOfJob: 'Internship unpaid',
                industry: 'AI',
                role: 'Programmer',
                perks: ['Career Growth'],
                workEnv: ['Chaotic'],
                pay: '$$$',
                compLogo: [{url: 'http://res.cloudinary.com/placemint/image/upload/v1607769238/ldgo2ta6p5guggojjznx.jpg'}],
             
                numApplicants: 99,

                ///////

                cardType: this.props.user.user.typeOfUser !== 'Student' ? 'user' : 'job',
                cardData: this.props.user.user.typeOfUser !== 'Student' ? this.props.user.user : {}
             
            }
        }
    }

    componentDidMount() {
        this.setState({
            gettingCandidates: false,
        }, () => {
        this.props.actions.userActions.getCandidates();
        })
    }

    render() {
        return (
            <div id="Discover-wrapper">
                <div id="Discover-wrapper-innerContainer">
                    {
                        this.state.gettingCandidates ?

                        <div id='Discover-wrapper-loadingDivContainer'>
                            <h1>Setting things up for you...</h1>

                            <ViewLoader />
                        </div>
                    
                        :

                        <Card cardType={this.state.curUserType !== 'Student' ? 'user' : 'job'} mode="swipe" isPreview={true} cardData={this.state.curUserType !== 'Student' ? this.props.user.user : this.state.fakeJob}/>

                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        recruiters: state.recruiters,
        employers: state.employers,
        students: state.students
    }
}
        
const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            userActions: bindActionCreators(allUserActions, dispatch),
            recruiterActions: bindActionCreators(allRecruiterActions, dispatch),
            employerActions: bindActionCreators(allEmployerActions, dispatch),
            studentActions: bindActionCreators(allStudentActions, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DiscoverView);