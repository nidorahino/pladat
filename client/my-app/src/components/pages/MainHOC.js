import React from 'react';

import { Link, Redirect, Switch, Route } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as allUserActions from '../../actions/UserActions';
import * as allStudentActions from '../../actions/StudentActions';
import * as allRecruiterActions from '../../actions/RecruiterActions';
import * as allEmployerActions from '../../actions/EmployerActions';

import SMain from './SMain';
import RMain from './RMain';
import EMain from './EMain';

import './styles/Base.css';

class MainHOC extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.props.actions.userActions.getUser();
    }

    render() {
        return (
            <div className='page-wrapper' id="MainHoc-page-wrapper">
                <Switch>
                    <Route path="/s/" component={SMain}/>
                    <Route path="/r/" component={RMain}/>
                    <Route path="/e/" component={EMain}/>
                </Switch>
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

export default connect(mapStateToProps, mapDispatchToProps)(MainHOC);
