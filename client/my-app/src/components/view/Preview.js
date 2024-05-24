import React from 'react';


import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as allUserActions from '../../actions/UserActions';
import * as allStudentActions from '../../actions/StudentActions';
import * as allRecruiterActions from '../../actions/RecruiterActions';
import * as allEmployerActions from '../../actions/EmployerActions';

import Card from './Card';
import './styles/Preview.css';



class Preview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            curUser: this.props.user.user,
            curUserType: this.props.user.user.typeOfUser
        }
    }

    render() {
        return (
            <div id="Preview-wrapper">
                <div id="Preview-wrapper-innerContainer">
                    <Card cardType='user' mode="preview" isPreview={true} cardData={this.state.curUser}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Preview);