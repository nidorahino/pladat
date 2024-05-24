import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as allUserActions from '../../actions/UserActions';
import * as allRecruiterActions from '../../actions/RecruiterActions';
import * as allEmployerActions from '../../actions/EmployerActions';

import BasicViewWrapper from './BasicViewWrapper';

import { usSchoolNames } from '../../staticData/universites';
import { preferredRoles } from '../../staticData/preferredRoles';
import { experienceArr } from '../../staticData/experience';
import { majorsArr } from '../../staticData/majors';

import ButtonLoader from '../uiComponents/ButtonLoader';


import './styles/RecruiterBasic.css';
import './styles/Base.css';
import './styles/Media.css';


class RecruiterBasic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: this.props.user.user.firstname+ " " + this.props.user.user.lastname,
            universities: [],
            university: "",
            uniAddError: "",
            uniArrIdx: 0,
            jobTitle: "",
            shortDesc: "",
            company: "",
            companyId: "",
            companyList: [],
            submittingData: false
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props !== prevProps) {
            const { searchResults,  searchResultsLoaded } = this.props.employers;
            if(searchResultsLoaded && this.state.companyList !== searchResults) {
                this.setState({
                    companyList: searchResults,
                }, () => {
                    // document.querySelector('#company-options').style.visibility = 'visible';
                })
            }
        }
    }

    componentDidMount() {
        //get all employers
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

    handleAddJobTitle = (event) => {
        event.preventDefault();

        this.setState({
            jobTitle: event.target.value
        })
    }

    handleShortBioInput = (event) => {
        event.preventDefault();
        this.setState({
            shortDesc: event.target.value
        })
    }

    handleCompanyChange = (event) => {
        event.preventDefault();
        this.setState({
            company: event.target.value,
            companyList: []
        })
    }
    handleCompanySearch = (event) => {
        event.preventDefault();
        this.props.actions.employerActions.employerSearchQuery(this.state.company);
    }
    handleCompanyChoose = (event) => {
        event.preventDefault();
        let compId = event.target.dataset.compid;
        let compName = event.target.dataset.compname;

        // console.log(compId, compName);
        this.setState({
            company: compName,
            companyId: compId
        })
    }
    toggleDataListOnBioFocus = (event) => {
        event.preventDefault();
        this.setState({companyList: []})
    }

    hanldeBasicInfoSubmit = (event) => {
        event.preventDefault();
        const { companyId, jobTitle, universities, shortDesc } = this.state;
        const editedProfile = { company: companyId, education: universities, jobTitle: jobTitle, shortDesc: shortDesc};
        this.setState({
            submittingData: true,
            companyList: []
        }, () => {
            this.props.actions.recruiterActions.completeBasicProfile(editedProfile);
        })
    }

    render() {
        return (
            <BasicViewWrapper route={this.props.match.path}>
                <div className="basicInfo-form-wrapper" id="basicInfo-recruiter-form-wrapper">
                    <div className="basicInfo-form-title-container" id="basicInfo-recruiter-form-title-container">
                        <h1 className="text baseInfo-title-txt" id="basicInfo-recruiter-form-title"><span>Place<span>Mint</span> - </span>Recruiter <span className="basicInfo-form-userName">{this.state.userName}</span></h1>
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

                                <div className="basicInfo-form-inputContainer" id="basicInfo-form-jobTitle">
                                        <label htmlFor="jobtitle" className="text basicInfo-form-inputLabel">What's your job title</label>
                                        <input value={this.state.jobTitle} list="role-options" name="jobtitle" className="basicInfo-form-input" placeholder="job title" onChange={this.handleAddJobTitle}/>
                                        <datalist id="role-options">
                                            {
                                                preferredRoles.map((role, index) => {
                                                    return <option value={role} key={"school-"+index}/>
                                                })
                                            }
                                        </datalist>
                                </div>

                                <div className="basicInfo-form-inputContainer" id="basicInfo-form-companyName">
                                        <label htmlFor="companyName" className="text basicInfo-form-inputLabel">What company do you work for?</label>
                                        <input autoComplete="off" value={this.state.company} list="company-options" name="companyName" className="basicInfo-form-input" id="basicInfo-form-input-recruiterCompanyInput" placeholder="company name/id" onChange={this.handleCompanyChange}/>
                                        <span id="basicInfo-form-searchCompanyBtn" className="basicInfo-form-addBtn" onClick={this.handleCompanySearch}>Search <span>&#128269;</span></span>
                                        <div id="company-options" className="basicInfo-from-customDatalist" style={this.state.companyList.length > 0 ? {visibility: 'visible'}: {visibility: 'hidden'}}>
                                            {
                                                this.state.companyList.map((company, index) => {
                                                    return <span key={"company-"+index} className="customDataList-option" data-compid={company._id} data-compname={company.companyName} onClick={this.handleCompanyChoose}>
                                                        <span onClick={this.handleCompanyChoose} data-compid={company._id} data-compname={company.companyName} className="customDataListSpan1">{company.companyName}</span>
                                                        <span onClick={this.handleCompanyChoose} data-compid={company._id} data-compname={company.companyName} className="customDataListSpan2">{company.location}</span>
                                                    </span>
                                                })
                                            }
                                        </div>
                                </div>

                                <div className="basicInfo-form-inputContainer" id="basicInfo-form-shortDesc">
                                    <textarea maxLength="280" value={this.state.shortDesc} onChange={this.handleShortBioInput} className="basicInfo-form-input" placeholder="Tell us about yourself; keep it short and concise." onFocus={this.toggleDataListOnBioFocus}>
                                    </textarea>
                                    <span className="baiscInfoShortDesc-charCount">{280-this.state.shortDesc.length}</span>
                                </div>
                            </form>
                        </div>

                        <div className="basicInfo-form-inner-right">
                            {
                                (this.state.universities.length > 0 && this.state.shortDesc.length > 0 && this.state.company.length > 0 && this.state.jobTitle.length > 0) ?

                                <div className="baiscInfo-form-inner-right-submitBtn" onClick={this.hanldeBasicInfoSubmit}>
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
                                            return <span className="basicInfo-form-right-slot" key={idx} id={idx+""}>
                                                {uni}  <span onClick={this.handleUniRemove} title="Remove" className="basicInfo-form-right-slotRemoveBtn">&#10006;</span>
                                            </span>
                                        })}
                                    </div> 
                                    : ""
                                }
                                {
                                    this.state.jobTitle.length > 0 ?
                                    <div className="basicInfo-form-inner-right-elem-container" id="basicInfo-form-inner-right-jobTitle">
                                        <label>Job title: </label>
                                        <span className="basicInfo-form-right-slot">{this.state.jobTitle}</span>
                                    </div> 
                                    : ""
                                }
                                {
                                    this.state.company.length > 0 ?
                                    <div className="basicInfo-form-inner-right-elem-container" id="basicInfo-form-inner-right-companyName">
                                        <label>Company: </label>
                                        <span className="basicInfo-form-right-slot">{this.state.company}</span>
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
        recruiters: state.recruiters,
        employers: state.employers
    }
}
        
const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            userActions: bindActionCreators(allUserActions, dispatch),
            recruiterActions: bindActionCreators(allRecruiterActions, dispatch),
            employerActions: bindActionCreators(allEmployerActions, dispatch)
        }
    };
}
  
  
export default connect(mapStateToProps, mapDispatchToProps)(RecruiterBasic);