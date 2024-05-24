import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as allUserActions from '../../actions/UserActions';
import * as allEmployerActions from '../../actions/EmployerActions';

import { pays } from '../../staticData/pays';
import { jobtypes } from '../../staticData/jobtypes';
import { studentValues } from '../../staticData/values';
import { skillsArr } from '../../staticData/skills';
import { preferredRoles } from '../../staticData/preferredRoles';
import { workEnvironment } from '../../staticData/values';
import { industries } from '../../staticData/industries';

import ButtonLoader from '../uiComponents/ButtonLoader';

import './styles/JobCreate.css';



class JobCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '',
            locations: [],
            location: '',
            locIdx: 0,
            todo: '',
            skillsRequired: [],
            skill: '',
            skillsIdx: 0,
            typeOfJob: '',
            industry: '',
            role: '',
            perks: [],
            pay: {},
            workEnv: [],
            companyName: this.props.user.user ? this.props.user.user.companyName : '',
            companyId: this.props.user.user ? this.props.user.user.companyId : '',
            compLogo: this.props.user.user ? this.props.user.user.images[0] : null,

            locationSuggestions: [],
            recruiters: [],

            canSubmit: false,

            submittingJob: false,
            toggleJobSuccessMsg: false,
            submitFail: false
        }
    }

    componentDidUpdate(prevProps) {
        const {jobCreateSuccess, jobCreateError} = this.props.employers;
        if(prevProps.employers !== this.props.employers) {
            if(this.state.submittingJob & jobCreateSuccess) {
                this.setState({
                    submittingJob: false,
                    toggleJobSuccessMsg: true
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            toggleJobSuccessMsg: false
                        })
                    }, 7000)
                })
            }
            if(this.state.submittingJob && jobCreateError) {
                this.setState({
                    submittingJob: false,
                    toggleJobSuccessMsg: true,
                    submitFail: true
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            toggleJobSuccessMsg: false
                        })
                    }, 7000)
                })
            }
        }
    }

    handleLocationSuggestions = (event) => {
        event.preventDefault();

        fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?singleLine=${this.state.location}&outFields=LongLabel,ShortLabel,PlaceName,Place_addr&maxLocations=25&forStorage=false&f=json`)
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    locationSuggestions: result.candidates
                })
            },
            (error) => {
                console.log(error);
            }
        )
    }
    locationOnChange = (event) => {
        event.preventDefault();
        this.setState({
            location: event.target.value,
            locations: this.state.locIdx === 0 && this.state.location.length > 0 ? [event.target.value] : this.state.locations
        })
    }
    locationAddMore = (event) => {
        event.preventDefault();
        if(this.state.locIdx === 0 && this.state.location === this.state.locations[0] && this.state.locations.length === 1) {
            this.setState({
                locIdx: 1,
                location: ''
            })
        }
        else {
            this.setState({
                locations: this.state.location.length > 0 && !this.state.locations.includes(this.state.location) ? [...this.state.locations, this.state.location] : this.state.locations,
                locIdx: this.state.locIdx+1
            })
        }
    }
    locationRemove = (event) => {
        event.preventDefault();
        let idx = Number(event.target.dataset.idx);
        let newArr = this.state.locations;
        newArr.splice(idx,1);
        this.setState({
            locations: [...newArr],
            locIdx: this.state.locIdx > 0 ? this.state.locIdx-1 : 0
        });
    }

    handleJobTitle = (event) => {
        event.preventDefault();
        this.setState({
            title: event.target.value
        })
    }

    handleJobType = (event) => {
        event.preventDefault();
        this.setState({
            typeOfJob: this.state.typeOfJob !== event.target.dataset.jt ? event.target.dataset.jt : ''
        })
    }

    handleJobDesc = (event) => {
        event.preventDefault();
        this.setState({
            description: this.state.description.length < 1500 ? event.target.value : this.state.description
        })
    }

    skillsOnChange = (event) => {
        event.preventDefault();
        this.setState({
            skill: event.target.value,
            skillsRequired: this.state.skillsIdx === 0 && this.state.skill.length > 0 ? [event.target.value] : this.state.skillsRequired
        })
    }
    skillsAddMore = (event) => {
        event.preventDefault();
        if(this.state.skillsIdx === 0 && this.state.skill === this.state.skillsRequired[0] && this.state.skillsRequired.length === 1) {
            this.setState({
                skillsIdx: 1,
                skill: ''
            })
        }
        else {
            this.setState({
                skillsRequired: this.state.skill.length > 0 && !this.state.skillsRequired.includes(this.state.skill) ? [...this.state.skillsRequired, this.state.skill] : this.state.skillsRequired,
                skillsIdx: this.state.skillsIdx+1
            })
        }
    }
    skillsRemove = (event) => {
        event.preventDefault();
        let idx = Number(event.target.dataset.idx);
        let newArr = this.state.skillsRequired;
        newArr.splice(idx,1);
        this.setState({
            skillsRequired: [...newArr],
            skillsIdx: this.state.skillsIdx > 0 ? this.state.skillsIdx-1 : 0
        });
    }

    handleRoleInput = (event) => {
        event.preventDefault();
        this.setState({
            role: this.state.role !== event.target.dataset.role ? event.target.dataset.role: ''
        })
    }

    handleEnvInput = (event) => {
        if(this.state.workEnv.length === 4 && !this.state.workEnv.includes(event.target.dataset.env)) {
            let p = this.state.workEnv;
            p.pop();
            p.push(event.target.dataset.env);
            this.setState({
                workEnv: p
            })
        }
        else if(this.state.workEnv.includes(event.target.dataset.env)) {
            let i = this.state.workEnv.indexOf(event.target.dataset.env);
            let pq = this.state.workEnv;
            pq.slice(i,1);
            this.setState({
                workEnv: pq
            })
        }
        else {
            if(this.state.workEnv.length < 4) {
                this.setState({
                    workEnv: [...this.state.workEnv, event.target.dataset.env]
                })
            }
        }
    }

    handleBenfInput = (event) => {
        if(this.state.perks.length === 4 && !this.state.perks.includes(event.target.dataset.val)) {
            let p = this.state.perks;
            p.pop();
            p.push(event.target.dataset.val);
            this.setState({
                perks: p
            })
        }
        else if(this.state.perks.includes(event.target.dataset.val)) {
            let i = this.state.perks.indexOf(event.target.dataset.val);
            let pq = this.state.perks;
            pq.slice(i,1);
            this.setState({
                perks: pq
            })
        }
        else {
            if(this.state.perks.length < 4) {
                this.setState({
                    perks: [...this.state.perks, event.target.dataset.val]
                })
            }
        }
    }

    handlePayClick = (event) => {
        event.preventDefault();
        this.setState({
            pay: this.state.pay.sym !== event.target.dataset.sym ? { sym: event.target.dataset.sym, text: event.target.dataset.text }: ''
        })
    }

    handleIndustryClick = (event) => {
        event.preventDefault();
        this.setState({
            industry: this.state.industry !== event.target.dataset.ind ? event.target.dataset.ind: ''
        })
    }

    handleTodo = (event) => {
        event.preventDefault();
        this.setState({
            todo: event.target.value
        })
    }

    handleJobList = () => {
        let jobInfo = {
            title: this.state.title,
            description: this.state.description,
            locations: this.state.locations,
            skillsRequired: this.state.skillsRequired,
            typeOfJob: this.state.typeOfJob,
            industry: this.state.industry,
            assignedRecruiter: 'null',
            fullJobAppLink: 'null',
            dateClose: 'null',
            perks: this.state.perks,
            workEnv: this.state.workEnv,
            pay: this.state.pay, role: this.state.role
        }
        this.setState({
            submittingJob: true
        }, () => {
            this.props.actions.employerActions.createJob(jobInfo);
        })
    }


    render() {
        return (
            <div id="JobCreate-view">
                <div id='JobCreate-view-innerWrapper'>
                    <div id='JobCreate-view-form-container'>
                        {
                            this.state.toggleJobSuccessMsg ?
                            
                            (
                                this.state.submitFail ? <span className='jobSubFail'>Job listing failed.</span> : <span id='toggleJobSuccess'>Job listed successfully</span>
                            )

                            :''
                        }
                        <form>
                           <div id='JobCreate-inner-form-container'>
                                <div className='JobCreate-from-fromGroup groupwborder'>
                                    <input autoComplete='false' type="text" value={this.state.title} placeholder='Job Tile' onChange={this.handleJobTitle}/>
                                </div>

                                <div className='JobCreate-from-fromGroup groupwborder'>
                                    <textarea placeholder='Briefly describe this job offer.' value={this.state.description} onChange={this.handleJobDesc}>
                                        
                                    </textarea>
                                    <span className='JobCreate-ta-counter'>{this.state.description.length}</span>
                                </div>

                                <div className='JobCreate-from-fromGroup groupwborder'>
                                    <label>What type of job offer is this?</label>
                                    <div className='JobCreate-fromGroup-fieldsetContainer'>
                                        <fieldset>
                                            {
                                                jobtypes.map((jt, idx) => {
                                                    return(
                                                        <div className='JobCreate-group-fieldVal' data-jt={jt} key={"jt-"+jt} style={this.state.typeOfJob === jt ? {backgroundColor: "#00a68a"} : {}} onClick={this.handleJobType}>
                                                            <span data-jt={jt}>{jt}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </fieldset>
                                    </div>
                                </div>

                                <div className='JobCreate-from-fromGroup groupwborder'>
                                    <textarea placeholder='In as much detail, describe exactly what the student will be ding on this job. Markdown syntax permitted.' onChange={this.handleTodo} value={this.state.todo}>
                                    </textarea>
                                    <span className='JobCreate-ta-counter'>{this.state.todo.length}</span>
                                </div>

                                <div className='JobCreate-from-fromGroup groupwborder'>
                                    <label>What skills are required for this job?</label>
                                    <input autoComplete='false' placeholder='eg: NodeJs, Powerpoint, etc' value={this.state.skill} list="jobCreateSkillsList" onChange={this.skillsOnChange}/>
                                    <span className='JobCreate-from-addmoreBtn' onClick={this.skillsAddMore}>Add more</span>
                                    {   
                                           this.state.skillsRequired.map((skill, idx) => {
                                               return (
                                                   <div className='otr'><h2 className='locotrname'>{skill}</h2>   <span title='remove' data-idx={idx} onClick={this.skillsRemove}>&#8722;</span></div>
                                               )
                                           })
                                    }
                                    <datalist id="jobCreateSkillsList">
                                        {
                                            skillsArr.map((skill, index) => {
                                                return <option value={skill} key={'skill'+skill} />
                                            })
                                        }
                                    </datalist>
                                </div>

                                <div className='JobCreate-from-fromGroup groupwborder'>
                                    <label>Specific role of this position?</label>
                                    <div className='JobCreate-fromGroup-fieldsetContainer'>
                                        <fieldset>
                                            {
                                                preferredRoles.map((role, idx) => {
                                                    return(
                                                        <div onClick={this.handleRoleInput} className='JobCreate-group-fieldVal' data-role={role} key={"role-"+role} style={this.state.role === role ? {backgroundColor: "#00a68a"} : {}}>
                                                            <span data-role={role}>{role}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </fieldset>
                                    </div>
                                </div>

                                <div className='JobCreate-from-fromGroup groupwborder'>
                                    <label>Describe the work environment</label>
                                    <div className='JobCreate-fromGroup-fieldsetContainer'>
                                        <fieldset>
                                            {
                                                workEnvironment.map((env, idx) => {
                                                    return(
                                                        <div data-idx={idx} onClick={this.handleEnvInput} className='JobCreate-group-fieldVal' data-env={env} key={"env-"+env} style={this.state.workEnv.includes(env) ? {backgroundColor: "#00a68a"} : {}}>
                                                            <span data-idx={idx} data-env={env}>{env}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </fieldset>
                                    </div>
                                </div>

                                <div className='JobCreate-from-fromGroup groupwborder'>
                                    <label>What are some benefits of this job opportunity?</label>
                                    <div className='JobCreate-fromGroup-fieldsetContainer'>
                                        <fieldset>
                                            {
                                                studentValues.map((val, idx) => {
                                                    return(
                                                        <div onClick={this.handleBenfInput} className='JobCreate-group-fieldVal' data-val={val} key={"val-"+val} style={this.state.perks.includes(val)? {backgroundColor: "#00a68a"} : {}}>
                                                            <span data-val={val}>{val}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </fieldset>
                                    </div>
                                </div>

                                <div className='JobCreate-from-fromGroup groupwborder'>
                                    <label>What's the pay like?</label>
                                    <div className='JobCreate-fromGroup-fieldsetContainer'>
                                        <fieldset>
                                            {
                                                pays.map((pay, idx) => {
                                                    return(
                                                        <div onClick={this.handlePayClick} className='JobCreate-group-fieldVal' data-text={pay.text} data-sym={pay.sym} key={"pay-"+pay.sym} style={this.state.pay.sym === pay.sym ? {backgroundColor: "#00a68a"} : {}}>
                                                            <span data-text={pay.text} data-sym={pay.sym}>{pay.sym} {pay.text}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </fieldset>
                                    </div>
                                </div>

                                <div className='JobCreate-from-fromGroup groupwborder'>
                                    <label>What is the relevant industry?</label>
                                    <div className='JobCreate-fromGroup-fieldsetContainer'>
                                        <fieldset>
                                            {
                                                industries.map((ind, idx) => {
                                                    return(
                                                        <div onClick={this.handleIndustryClick} className='JobCreate-group-fieldVal' data-ind={ind} key={"ind-"+ind} style={this.state.industry === ind ? {backgroundColor: "#00a68a"} : {}}>
                                                            <span data-ind={ind}>{ind}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </fieldset>
                                    </div>
                                </div>

                                <div className='JobCreate-from-fromGroup groupwborder'>
                                    <label>Assign a recruiter for this job.</label>
                                    <div className='JobCreate-fromGroup-fieldsetContainer'>
                                            {
                                                this.state.recruiters.length > 0 ? ''

                                                :

                                                <label className='groupExep'>You have no recruiters registered on the platform.</label>
                                            }
                                    </div>
                                </div>

                                <div className='JobCreate-from-fromGroup'>
                                    <label>What company locations are you hiring for</label>
                                    <input autoComplete='false' type="text" placeholder='locations' list='locsugs' value={this.state.location} onChange={this.locationOnChange} onKeyUp={this.handleLocationSuggestions}/>
                                    <span className='JobCreate-from-addmoreBtn' onClick={this.locationAddMore}>Add more</span>
                                    <div className='JobCreate-from-pickedListHoriz'>
                                        {
                                           
                                            this.state.locations.map((locOp, idx) => {
                                                return (
                                                    <div className='otr'><h2 className='locotrname'>{locOp}</h2>   <span title='remove' data-idx={idx} onClick={this.locationRemove}>&#8722;</span></div>
                                                )
                                            })

                                            
                                        }
                                    </div>
                                    <datalist id="locsugs">
                                        {
                                            this.state.locationSuggestions.map((loc, index) => {
                                                return <option value={loc.attributes.LongLabel} key={'loc'+index} />
                                            })
                                        }
                                    </datalist>
                                </div>
                                        
                                <div onClick={this.handleJobList} className='listJobBtn'>
                                    {
                                        this.state.submittingJob ?

                                        <ButtonLoader />

                                        :

                                        <h2>List job</h2>
                                    }
                                </div>
                            </div> 
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        employers: state.employers,
    }
}
        
const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            userActions: bindActionCreators(allUserActions, dispatch),
            employerActions: bindActionCreators(allEmployerActions, dispatch),
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(JobCreate);