import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as allUserActions from '../../actions/UserActions';
import * as allEmployerActions from '../../actions/EmployerActions';

import BasicViewWrapper from './BasicViewWrapper';

import { industries } from '../../staticData/industries';
import { companyStage } from '../../staticData/values';

import ButtonLoader from '../uiComponents/ButtonLoader';



import './styles/StudentBasic.css';
import './styles/Base.css';
import './styles/Media.css';



class EmployerBasic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: this.props.user.user.firstname+ " " + this.props.user.user.lastname,
            companyName: "",
            location: "",
            industries: [],
            industry: "",
            industryAddError: "",
            industryArrIdx: 0,
            shortDesc: "",
            yearFounded: "",
            companyGrowthStage: "",
            approxNumEmps: null,
            locationSuggestions: [],
            submittingData: false
        }
    }

    handleIndustryInput = (event) => {
        event.preventDefault();

        this.setState({
            industry: event.target.value,
            industryAddError: "",
            industries: this.state.industries.length <=1 && this.state.industryArrIdx === 0 ? [event.target.value]: this.state.industries
        })
    }
    handleIndustryAddMore = (event) => {
        event.preventDefault();

        if(this.state.industry.length < 3) {
            if(this.state.industries.length === 3) {
                this.setState({
                    industryAddError: "Can add up to 3 industries of work"
                })
            }
            else {
                this.setState({
                    industryAddError: "Please pick, or enter an industry of work"
                })
            }
        }
        else if(this.state.industry.length >= 3 && this.state.industries.length < 3) {
            if(this.state.industries.includes(this.state.industry)) {
                this.setState({
                    industry: "",
                    industryArrIdx: this.state.industryArrIdx+1
                })
            }
            else {
                let unis = this.state.industries;
                unis.push(this.state.industry);
                this.setState({
                    industries: unis,
                    industry: "",
                    industryArrIdx: this.state.industryArrIdx+1
                })
            }
        }
        else {
            if(this.state.industry.length >=3 && this.state.industries.length === 0) {
                this.setState({
                    industries: [this.state.industry],
                    industry: "",
                    industryAddError: "",
                    industryArrIdx: 1
                })
            }
            else {
                this.setState({
                    industryAddError: "Can add up to 3 industries of work"
                })
            }
        }
    }
    handleIndustryRemove = (event) => {
        event.preventDefault();
        let id = event.target.id;
        id = Number(id);

        let inds = this.state.industries;
        inds = [...inds.slice(0,id), ...inds.slice(id+1)];
        this.setState({
            industries: inds,
            industryAddError: "",
            industryArrIdx: this.state.industryArrIdx > 0 ? this.state.industryArrIdx-1 : 0
        })
    }

    handleCompanyName = (event) => {
        event.preventDefault();
        this.setState({
            companyName: event.target.value
        })
    }

    handleLocationInput = (event) => {
        event.preventDefault();
        this.setState({
            location: event.target.value
        })
    }
    handleLocationPick = (event) => {
        event.preventDefault();
        let locationData = event.target.dataset.longlabel;
        this.setState({
            location: locationData,
            locationSuggestions: []
        })
    }
    handleShortBioInput = (event) => {
        event.preventDefault();
        this.setState({
            shortDesc: event.target.value
        })
    }

    handleLocationSuggestions = (event) => {
        event.preventDefault();

        fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?singleLine=${this.state.location}&outFields=LongLabel,ShortLabel,PlaceName,Place_addr&forStorage=false&f=json`)
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

    toggleDataListOnBioFocus = (event) => {
        event.preventDefault();
        this.setState({
            locationSuggestions: []
        })
    }

    handleYearFound = (event) => {
        event.preventDefault();
        this.setState({
            yearFounded: event.target.value
        })
    }

    handleCompGrowth = (event) => {
        event.preventDefault();
        this.setState({
            companyGrowthStage: event.target.value
        })
    }

    handleNumEmps = (event) => {
        event.preventDefault();
        this.setState({
            approxNumEmps: event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const { industries, shortDesc, companyName, location, yearFounded, companyGrowthStage, approxNumEmps } = this.state;
        const empProfile = {
            companyName: companyName,
            industry: industries,
            shortDesc: shortDesc,
            location: location,
            yearFounded: yearFounded,
            companyGrowthStage: companyGrowthStage,
            approxNumEmployees: approxNumEmps
        };
        this.setState({
            submittingData: true
        }, () => {
            this.props.actions.employerActions.completeBasicProfile(empProfile);
        })
    }

    

    render() {
        return (
            <BasicViewWrapper route={this.props.match.path}>
                <div className="basicInfo-form-wrapper" id="basicInfo-employer-form-wrapper">
                    <div className="basicInfo-form-title-container" id="basicInfo-employer-form-title-container">
                        <h1 className="text baseInfo-title-txt" id="basicInfo-employer-form-title"><span>Place<span>Mint</span> - </span>Employer <span className="basicInfo-form-userName">{this.state.userName}</span></h1>
                    </div>

                    <div className="baseInfo-form-container">
                        <div className="basicInfo-form-inner-left">
                            <form id="basicInfo-empsFrom">
                                <div className="basicInfo-form-inputContainer" id="basicInfo-form-companyName-emp">
                                    <label htmlFor="companyName">Name of your company</label>
                                    <input name="companyName" className="basicInfo-form-input" placeholder="company name" value={this.state.companyName} onChange={this.handleCompanyName}/>
                                </div>
                                <div className="basicInfo-form-inputContainer" id="basicInfo-form-yearFounded">
                                    <label htmlFor="yearFounded">What year was the company founded</label>
                                    <input name="yearFounded" className="basicInfo-form-input" type="date" value={this.state.yearFounded} onChange={this.handleYearFound}/>
                                </div>
                                <div className="basicInfo-form-inputContainer" id="basicInfo-form-growthStage">
                                    <label htmlFor="growthStage">Company growth stage</label>
                                    <input list="growthStage" name="growthStage" placeholder="growth stage" className="basicInfo-form-input" type="text" value={this.state.companyGrowthStage} onChange={this.handleCompGrowth}/>
                                    <datalist id="growthStage">
                                        {
                                            companyStage.map((stage, index) => {
                                                return <option value={stage} key={"stage-"+index}/>
                                            })
                                        }
                                    </datalist>
                                </div>
                                <div className="basicInfo-form-inputContainer" id="basicInfo-form-numEmp">
                                    <label htmlFor="numEmp">Approximately, the number of employees.</label>
                                    <input name="numEmp" className="basicInfo-form-input" type="number" value={this.state.approxNumEmps} onChange={this.handleNumEmps}/>
                                </div>
                                <div className="basicInfo-form-inputContainer" id="basicInfo-form-location">
                                    <label htmlFor="location">Location of HQ, or secondary site</label>
                                    <input name="location" className="basicInfo-form-input" placeholder="address" value={this.state.location} onChange={this.handleLocationInput} onKeyUp={this.handleLocationSuggestions}/>

                                    <div id="company-options2" className="basicInfo-from-customDatalist2" style={this.state.locationSuggestions.length > 0 ? {visibility: 'visible'}: {visibility: 'hidden'}}>
                                        {
                                            this.state.locationSuggestions.map((location, index) => {
                                                return <span key={"location-"+index} className="customDataList-option" data-placename={location.attributes.PlaceName} data-longlabel={location.attributes.LongLabel} onClick={this.handleLocationPick}>
                                                    <span data-placename={location.attributes.PlaceName} data-longlabel={location.attributes.LongLabel} className="customDataListSpan1">{location.attributes.PlaceName}</span>
                                                    <span data-placename={location.attributes.PlaceName} data-longlabel={location.attributes.LongLabel} className="customDataListSpan2">{location.attributes.LongLabel}</span>
                                                </span>
                                            })
                                        }
                                    </div>
                                </div>
                                <div className="basicInfo-form-inputContainer" id="basicInfo-form-industry">
                                        <label htmlFor="industry" className="text basicInfo-form-inputLabel">What is the company's industry of work?</label>
                                        <input value={this.state.industry} list="industry-options" name="industry" className="basicInfo-form-input" placeholder="industry" onChange={this.handleIndustryInput} onFocus={this.toggleDataListOnBioFocus}/>
                                        <span className="basicInfo-input-error">{this.state.industryAddError.length > 0 ? this.state.industryAddError: ""}</span>
                                        <span className="basicInfo-form-addBtn" onClick={this.handleIndustryAddMore}>Add <span>&#43;</span></span>
                                        <datalist id="industry-options">
                                            {
                                                industries.map((industry, index) => {
                                                    return <option value={industry} key={"industry-"+index}/>
                                                })
                                            }
                                        </datalist>
                                </div>
                                <div className="basicInfo-form-inputContainer" id="basicInfo-form-shortDesc">
                                    <textarea maxLength="280" value={this.state.shortDesc} onChange={this.handleShortBioInput} className="basicInfo-form-input" placeholder="Tell us about your company; keep it short and concise." onFocus={this.toggleDataListOnBioFocus}>
                                    </textarea>
                                    <span className="baiscInfoShortDesc-charCount">{280-this.state.shortDesc.length}</span>
                                </div>
                            </form>
                        </div>

                        <div className="basicInfo-form-inner-right">
                            {
                                (this.state.industries.length > 0 && this.state.shortDesc.length > 0 && this.state.location.length > 0 && this.state.companyName.length > 0) ?

                                <div className="baiscInfo-form-inner-right-submitBtn" onClick={this.handleSubmit}>
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
                                    this.state.companyName.length > 0 ?
                                    <div className="basicInfo-form-inner-right-elem-container" id="basicInfo-form-inner-right-companyName">
                                        <label>Company Name: </label>
                                        <span className="basicInfo-form-right-slot">{this.state.companyName}</span>
                                    </div> 
                                    : ""
                                }
                                {
                                    this.state.yearFounded.length > 0 ?
                                    <div className="basicInfo-form-inner-right-elem-container" id="basicInfo-form-inner-right-yearFounded">
                                        <label>Year founded: </label>
                                        <span className="basicInfo-form-right-slot">{this.state.yearFounded}</span>
                                    </div> 
                                    : ""
                                }
                                {
                                    this.state.companyGrowthStage.length > 0 ?
                                    <div className="basicInfo-form-inner-right-elem-container" id="basicInfo-form-inner-right-growth">
                                        <label>Growth stage: </label>
                                        <span className="basicInfo-form-right-slot">{this.state.companyGrowthStage}</span>
                                    </div> 
                                    : ""
                                }
                                {
                                    this.state.approxNumEmps ?
                                    <div className="basicInfo-form-inner-right-elem-container" id="basicInfo-form-inner-right-numEmps">
                                        <label>Number of employees: </label>
                                        <span className="basicInfo-form-right-slot">{this.state.approxNumEmps}</span>
                                    </div> 
                                    : ""
                                }
                                {
                                    this.state.location.length > 0 ?
                                    <div className="basicInfo-form-inner-right-elem-container" id="basicInfo-form-inner-right-location">
                                        <label>Location: </label>
                                        <span className="basicInfo-form-right-slot">{this.state.location}</span>
                                    </div> 
                                    : ""
                                }
                                {
                                    this.state.industries.length > 0 ?
                                    <div className="basicInfo-form-inner-right-elem-container" id="basicInfo-form-inner-right-industries">
                                        <label>Company's industry of work </label>
                                        {this.state.industries.map((ind, idx) => {
                                            return <span className="basicInfo-form-right-slot" key={idx} id={idx+""}>
                                                {ind}  <span onClick={this.handleIndustryRemove} title="Remove" className="basicInfo-form-right-slotRemoveBtn">&#10006;</span>
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
  
  
export default connect(mapStateToProps, mapDispatchToProps)(EmployerBasic);