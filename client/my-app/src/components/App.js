import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as AllStudentActions from '../actions/StudentActions';
import * as AllEmployerActions from '../actions/EmployerActions';
import * as AllRecruiterActions from '../actions/RecruiterActions';
import * as AllUserActions from '../actions/UserActions';
import * as AllSocketActions from '../actions/SocketActions';

// import Main from './Main';

// const mapStateToProps = (state) => {
//     return {
//         jobs: state.jobs,
//         employers: state.employers,
//         recruiters: state.recruiters,
//         user: state.user,
//         students: state.students,
//         socket: state.socket
//     };
// }


// const mapDispatchToProps = (dispatch) => {
//     return {
//         actions: {
//             userActions: bindActionCreators(AllUserActions, dispatch),
//             studentActions: bindActionCreators(AllStudentActions, dispatch),
//             employerActions: bindActionCreators(AllEmployerActions, dispatch),
//             socketActions: bindActionCreators(AllSocketActions, dispatch),
//             recruiterActions: bindActionCreators(AllRecruiterActions, dispatch)
//         }
//     };
// }



// const App = connect(mapStateToProps, mapDispatchToProps)(Main);

// export default App;

class App extends React.Component {
    render() {
        return (
            <div>
                <h1>This is app</h1>
                {/* {React.cloneElement(this.props.children, this.props)} */}
                {/* {React.cloneElement({...this.props}.children, {...this.props})} */}
                {React.cloneElement({...{...this.props}.children}.children, {...this.props})}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        jobs: state.jobs,
        employers: state.employers,
        recruiters: state.recruiters,
        user: state.user,
        students: state.students,
        socket: state.socket
    };
}


const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            userActions: bindActionCreators(AllUserActions, dispatch),
            studentActions: bindActionCreators(AllStudentActions, dispatch),
            employerActions: bindActionCreators(AllEmployerActions, dispatch),
            socketActions: bindActionCreators(AllSocketActions, dispatch),
            recruiterActions: bindActionCreators(AllRecruiterActions, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);