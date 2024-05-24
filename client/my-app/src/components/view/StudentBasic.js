import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as allUserActions from '../../actions/UserActions';
import * as allStudentActions from '../../actions/StudentActions';


import BasicViewWrapper from './BasicViewWrapper';

import { usSchoolNames } from '../../staticData/universites';
import { preferredRoles } from '../../staticData/preferredRoles';
import { experienceArr } from '../../staticData/experience';
import { majorsArr } from '../../staticData/majors';
import { skillsArr } from '../../staticData/skills';

import ButtonLoader from '../uiComponents/ButtonLoader';


import './styles/StudentBasic.css';
import './styles/Base.css';
import './styles/Media.css';
import { industries } from '../../staticData/industries';



class StudentBasic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: this.props.user.user.firstname+ " " + this.props.user.user.lastname,
            majors: [],
            major: "",
            majorArrIdx: 0,
            majorAddError: "",
            gradDate: "",
            dateError: "",
            shortDesc: "",
            universities: [],
            university: "",
            uniAddError: "",
            uniArrIdx: 0,
            roles: [],
            experiences: [],
            submittingData: false,
            skills:[],
            skill: "",
            skillArrIdx: 0,
        }
    }

    componentWillMount() {

    }

    componentDidMount() {
        
    }

    handleUniChange = (event) => {
        event.preventDefault();

        this.setState({
            university: event.target.value,
            uniAddError: "",
            universities: this.state.universities.length <=1 && this.state.uniArrIdx === 0 ? [event.target.value]: this.state.universities
        })
    }
    handleUniAddMore = (event) => {
        event.preventDefault();

        if(this.state.university.length < 2) {
            if(this.state.universities.length === 2) {
                this.setState({
                    uniAddError: "Can add up to two universities/colleges"
                })
            }
            else {
                this.setState({
                    uniAddError: "Please pick, or enter a university/college"
                })
            }
        }
        else if(this.state.university.length >= 2 && this.state.universities.length === 1) {
            if(this.state.universities.includes(this.state.university)) {
                this.setState({
                    university: "",
                    uniArrIdx: this.state.uniArrIdx+1
                })
            }
            else {
                let unis = this.state.universities;
                unis.push(this.state.university);
                this.setState({
                    universities: unis,
                    university: "",
                    uniArrIdx: this.state.uniArrIdx+1
                })
            }
        }
        else {
            if(this.state.university.length >=2 && this.state.universities.length < 1) {
                this.setState({
                    universities: [this.state.university],
                    university: "",
                    uniAddError: "",
                    uniArrIdx: 1
                })
            }
            else {
                this.setState({
                    uniAddError: "Can add up to two universities/colleges"
                })
            }
        }
    }
    handleUniRemove = (event) => {
        event.preventDefault();
        let id = event.target.id;
        id = Number(id);

        let unis = this.state.universities;
        unis = [...unis.slice(0,id), ...unis.slice(id+1)];
        this.setState({
            universities: unis,
            uniAddError: "",
            uniArrIdx: this.state.uniArrIdx > 0 ? this.state.uniArrIdx-1 : 0
        })
    }

    handleDateAdd = (event) => {
        event.preventDefault();
        clearTimeout();
        this.setState({
            gradDate: event.target.value
        })
    }

    handleDateValid = () => {
        // event.preventDefault();
        // setTimeout(() => {
        //     const regex = /^((0[1-9]{1})|(1[0-2]{1}))(\/)([0-9]{4})$/g;
        //     if(!regex.test(this.state.gradDate)) {
        //         this.setState({
        //             dateError: "Please enter a valid date in mm/yyyy format"
        //         })
        //     }
        // }, 2000)
        let reversedDate = this.state.gradDate;
        reversedDate = reversedDate.split("-").reverse().join("-");
        // const regex = /^((0[1-9]{1})|(1[0-2]{1}))(\/)([0-9]{4})$/g;
        // const regex = /^((0[1-9]{1})|(1[0-2]{1}))(\-)([0-9]{2})(\-)([0-9]{4})$/g;
        const regex = /^([0-9]{2})(\-)([0-9]{2})(\-)([0-9]{4})$/g;
        const mmddyyFormat = regex.test(reversedDate);
        // console.log(reversedDate, mmddyyFormat);
        return mmddyyFormat;

    }

    handleMajorInput = (event) => {
        event.preventDefault();
        this.setState({
            major: event.target.value,
            majorAddError: "",
            majors: this.state.majors.length <=1 && this.state.majorArrIdx === 0 ? [event.target.value]: this.state.majors

        })
    }
    handleMajorAddMore = (event) => {
        event.preventDefault();

        if(this.state.major.length < 2) {
            if(this.state.majors.length === 2) {
                this.setState({
                    majorAddError: "Can add up to two majors"
                })
            }
            else {
                this.setState({
                    majorAddError: "Please pick, or enter a major"
                })
            }
        }
        else if(this.state.major.length >= 2 && this.state.majors.length === 1) {
            if(this.state.majors.includes(this.state.major)) {
                this.setState({
                    major: "",
                    majorArrIdx: this.state.majorArrIdx+1
                })
            }
            else {
                let majs = this.state.majors;
                majs.push(this.state.major);
                this.setState({
                    majors: majs,
                    major: "",
                    majorArrIdx: this.state.majorArrIdx+1
                })
            }
        }
        else {
            if(this.state.major.length >= 2 && this.state.majors.length < 1) {
                this.setState({
                    majors: [this.state.major],
                    major: "",
                    majorAddError: "",
                    majorArrIdx: 1
                })
            }
            else {
                this.setState({
                    majorAddError: "Can add up to two majors"
                })
            }
        }
    }

    handleMajorRemove = (event) => {
        event.preventDefault();
        let id = event.target.id;
        // console.log(id);
        id = Number(id);

        let majs = this.state.majors;
        majs = [...majs.slice(0,id), ...majs.slice(id+1)];
        this.setState({
            majors: majs,
            majorAddError: "",
            majorArrIdx: this.state.majorArrIdx > 0 ? this.state.majorArrIdx-1: 0
        })
    }

    handleBackgroundPick = (event) => {
        event.preventDefault();
        let clickedRole = event.target.dataset.experiencetype;
        if(this.state.experiences.includes(clickedRole)) {
            let popper = this.state.experiences;
            let clickedIdx = popper.indexOf(clickedRole);
            popper = [...popper.slice(0, clickedIdx), ...popper.slice(clickedIdx+1)];
            this.setState({
                experiences: popper
            })
        }
        else {
            if(this.state.experiences.length === 5) {
                let popper = this.state.experiences;
                popper.pop();
                popper.push(clickedRole);
                this.setState({
                    experiences: popper
                })
            }
            else {
                let pusher = this.state.experiences;
                pusher.push(clickedRole);
                this.setState({
                    experiences: pusher
                })
            }
        }
    }


    handlePreferredPick = (event) => {
        event.preventDefault();
        let clickedRole = event.target.dataset.role;
        if(this.state.roles.includes(clickedRole)) {
            let popper = this.state.roles;
            let clickedIdx = popper.indexOf(clickedRole);
            popper = [...popper.slice(0, clickedIdx), ...popper.slice(clickedIdx+1)];
            this.setState({
                roles: popper
            })
        }
        else {
            if(this.state.roles.length === 4) {
                let popper = this.state.roles;
                popper.pop();
                popper.push(clickedRole);
                this.setState({
                    roles: popper
                })
            }
            else {
                let pusher = this.state.roles;
                pusher.push(clickedRole);
                this.setState({
                    roles: pusher
                })
            }
        }
    }

    handleShortBioInput = (event) => {
        event.preventDefault();
        this.setState({
            shortDesc: event.target.value
        })
    }


    handleSkillInput = (event) => {
        event.preventDefault();
        this.setState({
            skill: event.target.value,
            skills: this.state.skills.length <= 1 && this.state.skillArrIdx === 0 ?  [event.target.value] : this.state.skills
        })
    }
    handleAddSkill = (event) => {
        event.preventDefault();
       if(this.state.skill.length > 0) {
           if(this.state.skills.length === 1 && this.state.skills.includes(this.state.skill)) {
               this.setState({
                   skill: '',
                   skills: this.state.skills,
                   skillArrIdx: 1
               })
           }
           else {
               if(this.state.skills.length >=1 && !this.state.skills.includes(this.state.skill)) {
                   let pusher = this.state.skills;
                   pusher.push(this.state.skill);
                   this.setState({
                       skills: pusher,
                       skill: '',
                       skillArrIdx: this.state.skillArrIdx+1
                   })
               }
           }
       }
    }
    handleSkillRemove = (event) => {
        event.preventDefault();
        let id = event.target.dataset.idx;
        let popper = this.state.skills;
        popper.splice(id,1);
        this.setState({
            skills: popper,
            skillArrIdx: this.state.skillArrIdx > 0 ? this.state.skillArrIdx-1: 0
        })
    }


    handleSubmitBasicInfo = (event) => {
        const submitData = {
            university: this.state.universities,
            major: this.state.majors,
            graduationDate: this.state.gradDate,
            shortDesc: this.state.shortDesc,
            preferredRoles: this.state.roles,
            generalExperience: this.state.experiences,
            skills: this.state.skills
        };

        this.setState({
            submittingData: true
        }, () => {
            this.props.actions.studentActions.completeBasicProfile(submitData);
        })
    }

    render() {

        return (
            <BasicViewWrapper route={this.props.match.path}>
                <div className="basicInfo-form-wrapper" id="basicInfo-student-form-wrapper">

                    <div className="basicInfo-form-title-container" id="basicInfo-student-form-title-container">
                        <h1 className="text baseInfo-title-txt" id="basicInfo-student-form-title"><span>Place<span>Mint</span> - </span>Student <span className="basicInfo-form-userName">{this.state.userName}</span></h1>
                    </div>

                    <div className="baseInfo-form-container">
                        <div className="basicInfo-form-inner-left">
                            <form>
                                <div className="basicInfo-form-inputContainer" id="basicInfo-form-unis">
                                    <label htmlFor="uniInput" className="text basicInfo-form-inputLabel">What university/universities have you attended.</label>
                                    <input value={this.state.university} list="school-options" name="uniInput" onChange={this.handleUniChange} className="basicInfo-form-input" placeholder="univerity/college"/>
                                    <span className="basicInfo-input-error">{this.state.uniAddError.length > 0 ? this.state.uniAddError: ""}</span>
                                    <span className="basicInfo-form-addBtn" onClick={this.handleUniAddMore}>Add <span>&#43;</span></span>
                                    <datalist id="school-options">
                                        {
                                            usSchoolNames.map((school, index) => {
                                                return <option value={school} key={"school-"+index}/>
                                            })
                                        }
                                    </datalist>
                                </div>
                                <div className="basicInfo-form-inputContainer" id="basicInfo-form-gradDate">
                                    <label htmlFor="dateInput" className="text basicInfo-form-inputLabel">Graduation date</label>
                                    <input type="date" value={this.state.gradDate} name="dateInput" onChange={this.handleDateAdd} className="basicInfo-form-input" placeholder="mm/dd/yy" required/>
                                    <span className="basicInfo-input-error">{this.state.dateError.length > 0 ? this.state.dateError: ""}</span>

                                </div>
                                <div className="basicInfo-form-inputContainer" id="basicInfo-form-majors">
                                    <label htmlFor="majorInput" className="text basicInfo-form-inputLabel">What are you studying?</label>
                                    <input value={this.state.major} onChange={this.handleMajorInput} name="majorInput" list="major-options" className="basicInfo-form-input" placeholder="subjects"/>
                                    <span className="basicInfo-input-error">{this.state.majorAddError.length > 0 ? this.state.majorAddError: ""}</span>
                                    <span className="basicInfo-form-addBtn" onClick={this.handleMajorAddMore}>Add <span>&#43;</span></span>
                                    <datalist id="major-options">
                                        {
                                            majorsArr.map((major, index) => {
                                                return <option value={major} key={"major-"+index}/>
                                            })
                                        }
                                    </datalist>
                                </div>
                                <div className="basicInfo-form-inputContainer" id="basicInfo-form-background">
                                    <label htmlFor="backgroundInput" className="text basicInfo-form-inputLabel">What's your background experience?</label>
                                    <fieldset name="backgroundInput" className="basicInfo-form-optionsBox" id="basicInfo-form-backgroundChoicesContainer">
                                        {
                                            experienceArr.map((background, index) => {
                                                return <div className="experienceSlot" data-experiencetype={background} onClick={this.handleBackgroundPick} key={"expSlot-"+index} style={this.state.experiences.includes(background) ? {backgroundColor: "#00a68a"} : {}}>
                                                    <span data-experiencetype={background} className="experienceSlot-type" >{background}</span>
                                                </div>
                                            })
                                        }
                                    </fieldset>
                                </div>
                                {/* skills */}
                                <div className="basicInfo-form-inputContainer" id="basicInfo-form-skills">
                                    <label htmlFor="skillsInput" className="text basicInfo-form-inputLabel">What is you skillset?</label>
                                    <input value={this.state.skill} onChange={this.handleSkillInput} name="skillsInput" list="skillsList" className="basicInfo-form-input" placeholder="skills"/>
                                    <span className="basicInfo-form-addBtn" onClick={this.handleAddSkill}>Add <span>&#43;</span></span>
                                    <datalist id="skillsList">
                                        {
                                            skillsArr.map((skill, index) => {
                                                return <option value={skill} key={'skill'+index} />
                                            })
                                        }
                                    </datalist>
                                </div>
                                <div className="basicInfo-form-inputContainer" id="basicInfo-form-preferred">
                                    <label htmlFor="preferred" className="text basicInfo-form-inputLabel">What's your preferred work role?</label>
                                    <fieldset name="preferred" className="basicInfo-form-optionsBox" id="basicInfo-form-preferredRolesContainer">
                                        {
                                            preferredRoles.map((role, index) => {
                                                return <div className="roleSlot" data-role={role} onClick={this.handlePreferredPick} key={"roleSlot-"+index} style={this.state.roles.includes(role) ? {backgroundColor: "#00a68a"} : {}}>
                                                    <span data-role={role} className="roleSlot-type">{role}</span>
                                                </div>
                                            })
                                        }
                                    </fieldset>
                                </div>
                                <div className="basicInfo-form-inputContainer" id="basicInfo-form-shortDesc">
                                    <textarea maxLength="280" value={this.state.shortDesc} onChange={this.handleShortBioInput} name="majorInput" className="basicInfo-form-input" placeholder="Tell us about yourself; keep it short and concise.">
                                    </textarea>
                                    <span className="baiscInfoShortDesc-charCount">{280-this.state.shortDesc.length}</span>
                                </div>
                            </form>
                        </div>

                        <div className="basicInfo-form-inner-right">
                            {
                                (this.state.experiences.length > 0 && this.state.gradDate.length > 0 && this.handleDateValid() && this.state.majors.length > 0 && this.state.roles.length > 0 && this.state.universities.length > 0 && this.state.shortDesc.length > 0) ?

                                <div className="baiscInfo-form-inner-right-submitBtn" onClick={this.handleSubmitBasicInfo}>
                                    {
                                        this.state.submittingData ?

                                        <ButtonLoader />

                                        :

                                        <span className="basicInfo-submitBtn-innerContainer">
                                            <h3>
                                            Next 
                                            </h3>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                                                    <path d="M0 0h24v24H0z" fill="none"/>
                                                    <path id="svgNextArrow" d="M16.01 11H4v2h12.01v3L20 12l-3.99-4z"/>
                                                </svg>
                                            </span>
                                        </span>
                                    }
                                </div>
                                
                                

                                : ""

                            }
                           <div className="basicInfo-form-inner-right-innerWrapper">
                           {
                                this.state.universities.length > 0 ?
                                <div className="basicInfo-form-inner-right-elem-container" id="basicInfo-form-inner-right-unis">
                                    <label>You've attended: </label>
                                    {this.state.universities.map((uni, idx) => {
                                        return <span className="basicInfo-form-right-slot" key={idx} >
                                            {uni}  <span id={idx+""} onClick={this.handleUniRemove} title="Remove" className="basicInfo-form-right-slotRemoveBtn">&#10006;</span>
                                        </span>
                                    })}
                                </div> 
                                : ""
                            }
                            {
                                this.state.gradDate.length > 0 ?

                                <div className="basicInfo-form-inner-right-elem-container">
                                    <label>Graduation date:</label>
                                    <span className="basicInfo-form-right-slot"> {this.state.gradDate}</span>
                                </div>

                                : ""
                            }
                            {
                                this.state.majors.length > 0 ?
                                <div className="basicInfo-form-inner-right-elem-container" id="basicInfo-form-inner-right-majors">
                                    <label>You're majoring in: </label>
                                    {this.state.majors.map((major, idx) => {
                                        return <span className="basicInfo-form-right-slot" key={idx}>
                                            {major}  <span id={idx+""} onClick={this.handleMajorRemove} title="Remove" className="basicInfo-form-right-slotRemoveBtn">&#10006;</span>
                                        </span>
                                    })}
                                </div> 
                                : ""
                            }
                            {
                                this.state.experiences.length > 0 ?
                                <div className="basicInfo-form-inner-right-elem-container" id="basicInfo-form-inner-right-experiences">
                                    <label>You have experience with: </label>
                                    {this.state.experiences.map((exp, idx) => {
                                        return <span className="basicInfo-form-right-slot" key={idx} id={idx+"exp"}>
                                            {exp} 
                                        </span>
                                    })}
                                </div> 
                                : ""
                            }
                            {
                                this.state.skills.length > 0 ?
                                <div className="basicInfo-form-inner-right-elem-container" id="basicInfo-form-inner-right-skills">
                                    <label>Skillset: </label>
                                    {this.state.skills.map((skill, idx) => {
                                        return <span className="basicInfo-form-right-slot" key={idx} >
                                            {skill}  <span data-idx={idx} onClick={this.handleSkillRemove} title="Remove" className="basicInfo-form-right-slotRemoveBtn">&#10006;</span>
                                        </span>
                                    })}
                                </div> 
                                : ""
                            }
                            {
                                this.state.roles.length > 0 ?
                                <div className="basicInfo-form-inner-right-elem-container" id="basicInfo-form-inner-right-roles">
                                    <label>You prefer to work as: </label>
                                    {this.state.roles.map((role, idx) => {
                                        return <span className="basicInfo-form-right-slot" key={idx} id={idx+"role"}>
                                            {role} 
                                        </span>
                                    })}
                                </div> 
                                : ""
                            }
                            {
                                this.state.shortDesc.length > 0 ?
                                <div className="basicInfo-form-inner-right-elem-container" id="basicInfo-form-inner-right-shortDesc">
                                    <label>Bio: </label><br/>
                                    <span className="basicInfo-form-right-slot"><p>{this.state.shortDesc}</p></span>
                                </div>

                                :""
                            }
                           </div>
                            
                        </div>
                    </div>

                </div>
            </BasicViewWrapper>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        students: state.students
    }
}
        
const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            userActions: bindActionCreators(allUserActions, dispatch),
            studentActions: bindActionCreators(allStudentActions, dispatch)
        }
    };
}
  
  
export default connect(mapStateToProps, mapDispatchToProps)(StudentBasic);