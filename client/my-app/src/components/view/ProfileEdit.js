import React from 'react';

import ButtonLoader from '../uiComponents/ButtonLoader';

import './styles/ProfileEdit.css';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Link, Redirect, Switch, Route } from 'react-router-dom';

import { studentPersonalities, studentValues, workEnvironment, companyStage } from '../../staticData/values';
import { industries } from '../../staticData/industries';


import * as allUserActions from '../../actions/UserActions';
import * as allStudentActions from '../../actions/StudentActions';
import * as allRecruiterActions from '../../actions/RecruiterActions';
import * as allEmployerActions from '../../actions/EmployerActions';


class ProfileEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            curUser: this.props.user.user,
            curUserType: this.props.user.user ? this.props.user.user.typeOfUser : null,
            // curUserImages: this.props.user.user ? this.props.user.user.images: [],
            curUserImages: this.handleImgPopulate(),
            curUserMaxImgNum: this.props.user.user ? this.props.user.user.maxNumImages : 6,
            toggleImgAdd: false,
            upLoadedFileName: null,
            upLoadedFile: null,

            uploadingImgToDB: false,

            profileEditFields: null,

            toggleSaveChangesBtn: false,

            studVals: this.props.user.user.typeOfUser === 'Student' ? this.props.user.user.values.compVals: [],
            studPers: this.props.user.user.typeOfUser === 'Student' ? this.props.user.user.values.personality: [],
            studWrkEnv: this.props.user.user.typeOfUser === 'Student' ? this.props.user.user.values.workEnv: [],
            studCompStage: this.props.user.user.typeOfUser === 'Student' ? this.props.user.user.values.compStage: [],
            studIndus: this.props.user.user.typeOfUser === 'Student' ? this.props.user.user.values.industry: [],
            studResume: this.props.user.user.typeOfUser === 'Student' ? (this.props.user.user.resume ? this.props.user.user.resume: '') : '',
            studSocials: this.props.user.user.typeOfUser === 'Student' ? this.props.user.user.socials: '',


            empOffer: this.props.user.user.typeOfUser === 'Employer' ? this.props.user.user.values.compOffer: [],
            empStudsPref: this.props.user.user.typeOfUser === 'Employer' ? this.props.user.user.values.studPersPref: [],
            empWorkEnv: this.props.user.user.typeOfUser === 'Employer' ? this.props.user.user.values.workEnv: [],


            prevProfUrl: '/',

            recEducation: this.props.user.user.typeOfUser === 'Recruiter' ? this.props.user.user.education : [],
            recJobTitle: this.props.user.user.typeOfUser === 'Recruiter' ? this.props.user.user.jobTitle : '',
            recShortDesc: this.props.user.user.typeOfUser === 'Recruiter' ? this.props.user.user.shortDesc : '',
            recSocials: this.props.user.user.typeOfUser === 'Recruiter' ? this.props.user.user.socials: '',
            recAutomatedMatchMsg: this.props.user.user.typeOfUser === 'Recruiter' ? this.props.user.user.automatedMatchMsg: '',
            recCompName: this.props.user.user.typeOfUser === 'Recruiter' ? this.props.user.user.companyName: ''


        }

        this.handleAddImg = this.handleAddImg.bind(this);
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return (this.props.user.user !== nextProps.user.user) || (this.props.user !== nextProps.user) || (this.state !== nextState) || (JSON.stringify(nextProps.user.user) !== JSON.stringify(this.props.user.user)) || (JSON.stringify(nextProps.user) !== JSON.stringify(this.props.user));
    // }

    componentDidUpdate(prevProps) {
        if(prevProps !== this.props) {
            const { defaultEditSuccess, imagesUpdated, user, uploadingImg } = this.props.user;

            if(prevProps.user.user !== user) {
                this.setState({
                    curUser: user ? this.props.user.user: null,
                    curUserType: user ? this.props.user.user.typeOfUser : null,
                    curUserImages: this.handleImgPopulate(),
                    curUserMaxImgNum: user ? this.props.user.user.maxNumImages : 6
                })
            }

            if(defaultEditSuccess) {
                this.setState({
                    curUser: user,
                    curUserType: user.typeOfUser,
                    curUserMaxImgNum: user.maxNumImages,
                    curUserImages: this.handleImgPopulate()
                })
            }

            if(uploadingImg) {
                this.setState({ uploadingImgToDB: true })
            }
            else {
                this.setState({ uploadingImgToDB: false })
            }

            if(imagesUpdated) {
                this.setState({
                    toggleImgAdd: false
                })
            }
        }
    }

    componentDidMount() {
        this.setState({
            profileEditFields: this.props.user.editFields,
            prevProfUrl: this.getPrevProfLink(this.props.user.user.typeOfUser)
        })
    }

    handleImgPopulate = () => {
        const curUserImgs = this.props.user.user ? this.props.user.user.images : [];
        const imgMax = this.props.user.user ? this.props.user.user.maxNumImages : 6;

        if(curUserImgs.length === imgMax) {
            return [...curUserImgs];
        }
        else if(curUserImgs.length > 0 && curUserImgs.length < imgMax) {
            let remains = imgMax - curUserImgs.length;
            let tempArr = [...curUserImgs];
            for(let i = 0; i < remains; i++) {
                tempArr.push(null);
            }
            return tempArr;
        }
        else {
            return [];
        }
    }

    handleAddImg = (event) => {
        event.preventDefault();
        this.setState({
            toggleImgAdd: true
        })
    }

    handleRemoveImg = (event) => {
        event.preventDefault();

        let targetParent = event.target.parentNode;

        let publicKey = targetParent.dataset.imgpubkey;
        let deleteIndex = targetParent.dataset.imgidx;

        console.log(deleteIndex, publicKey);

        this.props.actions.userActions.deleteImage(deleteIndex, publicKey);

    }

    handleGetImgFromUser = (event) => {
        event.preventDefault();
        
        const file = event.target.files[0];
        const fileName = file ? file.name : null;

        this.setState({
            upLoadedFile: file,
            upLoadedFileName: fileName
        })
      
    }

    handleUploadImg = (event) => {
        event.preventDefault();

        let formData = new FormData();
        let file = this.state.upLoadedFile;
        formData.append('file', file);

        // console.log(file);

        this.props.actions.userActions.upLoadImage(formData);
    }

    handleStudPersPick = (event) => {
        event.preventDefault();
        let clickedRole = event.target.dataset.experiencetype;
        if(this.state.studPers.includes(clickedRole)) {
            let popper = this.state.studPers;
            let clickedIdx = popper.indexOf(clickedRole);
            popper = [...popper.slice(0, clickedIdx), ...popper.slice(clickedIdx+1)];
            this.setState({
                studPers: popper,
                toggleSaveChangesBtn: true
            })
        }
        else {
            if(this.state.studPers.length === 4) {
                let popper = this.state.studPers;
                popper.pop();
                popper.push(clickedRole);
                this.setState({
                    studPers: popper,
                    toggleSaveChangesBtn: true
                })
            }
            else {
                let pusher = this.state.studPers;
                pusher.push(clickedRole);
                this.setState({
                    studPers: pusher,
                    toggleSaveChangesBtn: true
                })
            }
        }
    }

    handleStudIndPick = (event) => {
        event.preventDefault();
        let clickedRole = event.target.dataset.experiencetype;
        if(this.state.studIndus.includes(clickedRole)) {
            let popper = this.state.studIndus;
            let clickedIdx = popper.indexOf(clickedRole);
            popper = [...popper.slice(0, clickedIdx), ...popper.slice(clickedIdx+1)];
            this.setState({
                studIndus: popper,
                toggleSaveChangesBtn: true
            })
        }
        else {
            if(this.state.studIndus.length === 4) {
                let popper = this.state.studIndus;
                popper.pop();
                popper.push(clickedRole);
                this.setState({
                    studIndus: popper,
                    toggleSaveChangesBtn: true
                })
            }
            else {
                let pusher = this.state.studIndus;
                pusher.push(clickedRole);
                this.setState({
                    studIndus: pusher,
                    toggleSaveChangesBtn: true
                })
            }
        }
    }

    handleStudVals = (event) => {
        event.preventDefault();
        let clickedRole = event.target.dataset.experiencetype;
        if(this.state.studVals.includes(clickedRole)) {
            let popper = this.state.studVals;
            let clickedIdx = popper.indexOf(clickedRole);
            popper = [...popper.slice(0, clickedIdx), ...popper.slice(clickedIdx+1)];
            this.setState({
                studVals: popper,
                toggleSaveChangesBtn: true
            })
        }
        else {
            if(this.state.studVals.length === 4) {
                let popper = this.state.studVals;
                popper.pop();
                popper.push(clickedRole);
                this.setState({
                    studVals: popper,
                    toggleSaveChangesBtn: true
                })
            }
            else {
                let pusher = this.state.studVals;
                pusher.push(clickedRole);
                this.setState({
                    studVals: pusher,
                    toggleSaveChangesBtn: true
                })
            }
        }
    }

    handleStudWorkEnv = (event) => {
        event.preventDefault();
        let clickedRole = event.target.dataset.experiencetype;
        if(this.state.studWrkEnv.includes(clickedRole)) {
            let popper = this.state.studWrkEnv;
            let clickedIdx = popper.indexOf(clickedRole);
            popper = [...popper.slice(0, clickedIdx), ...popper.slice(clickedIdx+1)];
            this.setState({
                studWrkEnv: popper,
                toggleSaveChangesBtn: true
            })
        }
        else {
            if(this.state.studWrkEnv.length === 4) {
                let popper = this.state.studWrkEnv;
                popper.pop();
                popper.push(clickedRole);
                this.setState({
                    studWrkEnv: popper,
                    toggleSaveChangesBtn: true
                })
            }
            else {
                let pusher = this.state.studWrkEnv;
                pusher.push(clickedRole);
                this.setState({
                    studWrkEnv: pusher,
                    toggleSaveChangesBtn: true
                })
            }
        }
    }

    handleStudCompStg = (event) => {
        event.preventDefault();
        let clickedRole = event.target.dataset.experiencetype;
        if(this.state.studCompStage.includes(clickedRole)) {
            let popper = this.state.studCompStage;
            let clickedIdx = popper.indexOf(clickedRole);
            popper = [...popper.slice(0, clickedIdx), ...popper.slice(clickedIdx+1)];
            this.setState({
                studCompStage: popper,
                toggleSaveChangesBtn: true
            })
        }
        else {
            if(this.state.studCompStage.length === 4) {
                let popper = this.state.studCompStage;
                popper.pop();
                popper.push(clickedRole);
                this.setState({
                    studCompStage: popper,
                    toggleSaveChangesBtn: true
                })
            }
            else {
                let pusher = this.state.studCompStage;
                pusher.push(clickedRole);
                this.setState({
                    studCompStage: pusher,
                    toggleSaveChangesBtn: true
                })
            }
        }
    }

    handleStudResumeAdd = (event) => {
        event.preventDefault();
        this.setState({
            studResume: event.target.value
        })
    }

    handleEmpOffer = (event) => {
        event.preventDefault();
        let clickedRole = event.target.dataset.experiencetype;
        if(this.state.empOffer.includes(clickedRole)) {
            let popper = this.state.empOffer;
            let clickedIdx = popper.indexOf(clickedRole);
            popper = [...popper.slice(0, clickedIdx), ...popper.slice(clickedIdx+1)];
            this.setState({
                empOffer: popper,
                toggleSaveChangesBtn: true
            })
        }
        else {
            if(this.state.empOffer.length === 4) {
                let popper = this.state.empOffer;
                popper.pop();
                popper.push(clickedRole);
                this.setState({
                    empOffer: popper,
                    toggleSaveChangesBtn: true
                })
            }
            else {
                let pusher = this.state.empOffer;
                pusher.push(clickedRole);
                this.setState({
                    empOffer: pusher,
                    toggleSaveChangesBtn: true
                })
            }
        }
    }

    handleCompWorkEnv = (event) => {
        event.preventDefault();
        let clickedRole = event.target.dataset.experiencetype;
        if(this.state.empWorkEnv.includes(clickedRole)) {
            let popper = this.state.empWorkEnv;
            let clickedIdx = popper.indexOf(clickedRole);
            popper = [...popper.slice(0, clickedIdx), ...popper.slice(clickedIdx+1)];
            this.setState({
                empWorkEnv: popper,
                toggleSaveChangesBtn: true
            })
        }
        else {
            if(this.state.empWorkEnv.length === 4) {
                let popper = this.state.empWorkEnv;
                popper.pop();
                popper.push(clickedRole);
                this.setState({
                    empWorkEnv: popper,
                    toggleSaveChangesBtn: true
                })
            }
            else {
                let pusher = this.state.empWorkEnv;
                pusher.push(clickedRole);
                this.setState({
                    empWorkEnv: pusher,
                    toggleSaveChangesBtn: true
                })
            }
        }
    }

    handleEmpQualPick = (event) => {
        event.preventDefault();
        let clickedRole = event.target.dataset.experiencetype;
        if(this.state.empStudsPref.includes(clickedRole)) {
            let popper = this.state.empStudsPref;
            let clickedIdx = popper.indexOf(clickedRole);
            popper = [...popper.slice(0, clickedIdx), ...popper.slice(clickedIdx+1)];
            this.setState({
                empStudsPref: popper,
                toggleSaveChangesBtn: true
            })
        }
        else {
            if(this.state.empStudsPref.length === 4) {
                let popper = this.state.empStudsPref;
                popper.pop();
                popper.push(clickedRole);
                this.setState({
                    empStudsPref: popper,
                    toggleSaveChangesBtn: true
                })
            }
            else {
                let pusher = this.state.empStudsPref;
                pusher.push(clickedRole);
                this.setState({
                    empStudsPref: pusher,
                    toggleSaveChangesBtn: true
                })
            }
        }
    }

    handleRecruiterAutoMsg = (event) => {
        event.preventDefault();
        this.setState({
            recAutomatedMatchMsg: event.target.value,
            toggleSaveChangesBtn: true
        })
    }

    SaveChanges = (event) => {
        event.preventDefault();
        switch(this.state.curUserType) {
            case 'Student':
                let profileEditData = {
                    university: this.state.curUser.university,
                    major: this.state.curUser.major,
                    graduationDate: this.state.curUser.graduationDate,
                    shortDesc: this.state.curUser.shortDesc,
                    skills: this.state.curUser.skills,
                    resume: this.state.studResume,
                    values: { compVals: this.state.studVals, personality: this.state.studPers, workEnv: this.state.studWrkEnv, compStage: this.state.studCompStage, industry: this.state.studIndus },
                    socials: this.state.curUser.socials,
                    generalExperience: this.state.curUser.generalExperience,
                    preferredRoles: this.state.curUser.preferredRoles
                };
                this.props.actions.studentActions.editProfile(profileEditData);
                return;
            case 'Employer':
                let empProfEditData = {
                    companyGrowthStage: this.state.curUser.companyGrowthStage,
                    approxNumEmployees: this.state.curUser.approxNumEmployees,
                    yearFounded: this.state.curUser.yearFounded,
                    socials: this.state.curUser.socials,
                    industry: this.state.curUser.industry,
                    location: this.state.curUser.location,
                    shortDesc: this.state.curUser.shortDesc, 
                    values: {
                        compOffer: this.state.empOffer,
                        studPersPref: this.state.empStudsPref,
                        workEnv: this.state.empWorkEnv
                    }
                };
                this.props.actions.employerActions.editProfile(empProfEditData);
                return;
            case 'Recruiter':
                let recEditInfo = {
                    education: this.state.recEducation,
                    jobTitle: this.state.recJobTitle,
                    shortDesc: this.state.recShortDesc,
                    socials: this.state.recSocials,
                    automatedMatchMsg: this.state.recAutomatedMatchMsg
                };
                this.props.actions.recruiterActions.editProfile(recEditInfo);
            default:
                return;
        }
    }

    getPrevProfLink = (uType) => {
        switch(uType) {
            case "Student":
                return '/s/me/preview_profile';
            case "Employer":
                return '/e/me/preview_profile';
            case "Recruiter":
                return '/r/me/preview_profile';
            default:
                return;
        }
    }


    

    render() {
        return (
            <div id="ProfileEdit-wrapper">
                <div className='ProfileEdit-imageContainer ProfileEdit-cut'>
                    {
                        this.state.curUserImages.length > 0 ?

                        this.state.curUserImages.map((imgData, idx) => {
                            let elem = imgData ? 

                            (<div style={{backgroundImage: `url(${imgData.url})`, backgroundBlendMode:'overlay'}} data-imgidx={idx} data-imgurl={imgData.secure_url} data-imgpubkey={imgData.public_id} key={idx} className={'ProfileEdit-img ProfileEdit-img-hasImg ' + 'ProfileEdit-imgItem'+(idx+1)}>
                                {/* <img className='ProfileEdit-img-accImg' src={imgData.url}/> */}
                                <span className='ProfileEdit-addImgBtn' title={imgData ? 'Replace Image' : 'Add Image'}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" preserveAspectRatio='xMidYMid meet' >
                                        <path d="M0 0h24v24H0V0z" fill="none"/>
                                        <path fill="#666666" d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z"/>
                                    </svg>
                                </span>

                                <span onClick={this.handleRemoveImg} className='ProfileEdit-img-removeImgBtn'>&#10006;</span>
                            </div>)

                            : 
                            
                            (<div key={idx+1} data-imgidx={idx} className={'ProfileEdit-img ' + 'ProfileEdit-imgItem'+(idx+1)} onClick={this.handleAddImg}>
                            <span className='ProfileEdit-addImgBtn' title='Add Image'>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" preserveAspectRatio='xMidYMid meet' >
                                    <path d="M0 0h24v24H0V0z" fill="none"/>
                                    <path fill="#666666" d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z"/>
                                </svg>
                            </span>
                        </div>);
                            return elem;
                        })

                        :

                        [1,2,3,4,5,6].map((num, idx) => {
                            return (
                                <div key={num} data-imgidx={idx} className={'ProfileEdit-img ' + 'ProfileEdit-imgItem' + num} onClick={this.handleAddImg}>
                                    <span className='ProfileEdit-addImgBtn' title='Add Image'>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" preserveAspectRatio='xMidYMid meet' >
                                            <path d="M0 0h24v24H0V0z" fill="none"/>
                                            <path fill="#666666" d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z"/>
                                        </svg>
                                    </span>
                                </div>
                            )
                        })
                    }

                </div>

                {
                    this.state.toggleImgAdd ?

                    <div className='ProfileEdit-cut ProfileEdit-addImgDialogue'>
                        <form>
                            <input id='ProfileEdit-imgFileInput' type='file' name='imgInput' accept="image/png, image/jpeg, image/jpg" onChange={this.handleGetImgFromUser}/>
                { this.state.upLoadedFile && this.state.upLoadedFileName ? <button id='ProfileEdit-uploadImgBtn' onClick={this.handleUploadImg}>{this.state.uploadingImgToDB ? <ButtonLoader/> : 'Upload image'}</button> : '' }
                        </form>
                    </div>

                    :

                    ''
                }

                
                    <div className='ProfileEdit-previewProfileBtn ProfileEdit-cut'>
                        <Link to={this.state.prevProfUrl}>
                            <h2>Preview profile</h2>
                        </Link>
                    </div>

                <div className='ProfileEdit-inputs ProfileEdit-cut'>
                    {
                        this.state.curUserType === 'Student' && this.state.profileEditFields ?

                        <div className='ProfileEdit-inputs-student ProfileEdit-inputsContainer'>

                            <div className='ProfileEdit-input-group ProfileEdit-student-uni'>
                                <label>Education</label>
                                <div className='ProfileEdit-choice-slot-container'>
                                    {this.state.profileEditFields.university.map((uni, idx) => {
                                        return <span className='ProfileEditChoiceSlot'>{uni} <span>&#10006;</span> </span>
                                    })}
                                </div>
                                <input type='text' placeholder='Enter a college / university'/>
                            </div>

                            <div className='ProfileEdit-input-group ProfileEdit-student-major'>
                                <label>Majors</label>
                                <div className='ProfileEdit-choice-slot-container'>
                                    {this.state.profileEditFields.major.map((maj, idx) => {
                                        return <span className='ProfileEditChoiceSlot'>{maj} <span>&#10006;</span> </span>
                                    })}
                                </div>
                                <input type='text' placeholder='Enter a major'/>
                            </div>

                            <div className='ProfileEdit-input-group ProfileEdit-student-gradDate'>
                                <label>Graduation Date: </label> 
                                <input type="date" value={this.state.profileEditFields.graduationDate} />
                            </div>

                            <div className='ProfileEdit-input-group ProfileEdit-student-genExp'>
                                <label>Experience</label>
                                <div className='ProfileEdit-choice-slot-container'>
                                    {this.state.profileEditFields.generalExperience.map((gexp, idx) => {
                                        return <span className='ProfileEditChoiceSlot'>{gexp} <span>&#10006;</span> </span>
                                    })}
                                </div>
                                <input type='text' placeholder='Enter a skill'/>
                            </div>

                            <div className='ProfileEdit-input-group ProfileEdit-student-roles'>
                                <label>Preferred Roles</label>
                                <div className='ProfileEdit-choice-slot-container'>
                                    {this.state.profileEditFields.preferredRoles.map((pr, idx) => {
                                        return <span className='ProfileEditChoiceSlot'>{pr} <span>&#10006;</span> </span>
                                    })}
                                </div>
                                <input type='text' placeholder='What roles interest you'/>
                            </div>

                            <div className='ProfileEdit-input-group ProfileEdit-student-shortDesc'>
                                <label>Bio</label>
                                <textarea>{this.state.profileEditFields.shortDesc}</textarea>
                            </div>

                            <div className='ProfileEdit-input-group ProfileEdit-student-values'>
                                <label>Values</label>
                                <div className='ProfileEdit-choice-slot-container'>
                                    <label htmlFor='personalities'>How would you describe yourself?</label>
                                    <fieldset name="personalities" className="ProfileEdit-valuesField">
                                        {
                                            studentPersonalities.map((background, index) => {
                                                return <div data-experiencetype={background} className="ProfileEdit-valuesOption" onClick={this.handleStudPersPick} key={index} style={this.state.studPers.includes(background) ? {backgroundColor: "#00a68a"} : {}}>
                                                    <span data-experiencetype={background} className="ProfileEdit-valuesOption-type" >{background}</span>
                                                </div>
                                            })
                                        }
                                    </fieldset>
                                </div>
                                <div className='ProfileEdit-choice-slot-container'>
                                    <label>What do you value most in a company?</label>
                                    <fieldset name="backgroundInput" className="ProfileEdit-valuesField">
                                        {
                                            studentValues.map((background, index) => {
                                                return <div data-experiencetype={background} className="ProfileEdit-valuesOption" onClick={this.handleStudVals} key={index} style={this.state.studVals.includes(background) ? {backgroundColor: "#00a68a"} : {}}>
                                                    <span data-experiencetype={background} className="ProfileEdit-valuesOption-type" >{background}</span>
                                                </div>
                                            })
                                        }
                                    </fieldset>
                                </div>
                                <div className='ProfileEdit-choice-slot-container'>
                                    <label>What work environment do you prefer?</label>
                                    <fieldset name="backgroundInput" className="ProfileEdit-valuesField">
                                        {
                                            workEnvironment.map((background, index) => {
                                                return <div data-experiencetype={background} className="ProfileEdit-valuesOption" onClick={this.handleStudWorkEnv} key={index} style={this.state.studWrkEnv.includes(background) ? {backgroundColor: "#00a68a"} : {}}>
                                                    <span data-experiencetype={background} className="ProfileEdit-valuesOption-type" >{background}</span>
                                                </div>
                                            })
                                        }
                                    </fieldset>
                                </div>
                                <div className='ProfileEdit-choice-slot-container'>
                                    <label>What industries are you interested in?</label>
                                    <fieldset name="backgroundInput" className="ProfileEdit-valuesField">
                                        {
                                            industries.map((background, index) => {
                                                return <div data-experiencetype={background} className="ProfileEdit-valuesOption" onClick={this.handleStudIndPick} key={index} style={this.state.studIndus.includes(background) ? {backgroundColor: "#00a68a"} : {}}>
                                                    <span data-experiencetype={background} className="ProfileEdit-valuesOption-type" >{background}</span>
                                                </div>
                                            })
                                        }
                                    </fieldset>
                                </div>
                                <div className='ProfileEdit-choice-slot-container'>
                                    <label>What company stage do you prefer?</label>
                                    <fieldset name="backgroundInput" className="ProfileEdit-valuesField">
                                        {
                                            companyStage.map((background, index) => {
                                                return <div data-experiencetype={background} className="ProfileEdit-valuesOption" onClick={this.handleStudCompStg} key={index} style={this.state.studCompStage.includes(background) ? {backgroundColor: "#00a68a"} : {}}>
                                                    <span data-experiencetype={background} className="ProfileEdit-valuesOption-type" >{background}</span>
                                                </div>
                                            })
                                        }
                                    </fieldset>
                                </div>
                            </div>

                            <div className='ProfileEdit-input-group ProfileEdit-student-resume'>
                                <label>Resume</label>
                                <input type='url' placeholder="Link to you resume" value={this.state.studResume} onChange={this.handleStudResumeAdd}/>
                            </div>

                            <div className='ProfileEdit-input-group ProfileEdit-student-socials'>
                                <label>Socials; comma separated string of linkedin, github, and any other site</label>
                                <input type='text' placeholder="LinkedIn, Github, Personal Site"/>
                            </div>

                            
                            
                        </div>

                        : ""
                    }
                    {
                        this.state.curUserType === 'Employer' && this.state.profileEditFields ?

                        <div className='ProfileEdit-inputs-employer ProfileEdit-inputsContainer'>
                            <div className='ProfileEdit-input-group ProfileEdit-emp-compName'>
                                <label>Company Name</label>
                                <input type='text' placeholder='Company name' value={this.state.curUser.companyName}/>
                            </div>

                            <div className='ProfileEdit-input-group ProfileEdit-emp-loc'>
                                <label>Location</label>
                                <input type='text' placeholder='Company location' value={this.state.profileEditFields.location}/>
                            </div>

                            <div className='ProfileEdit-input-group ProfileEdit-emp-ind'>
                                <label>Industry of work</label>
                                <div className='ProfileEdit-choice-slot-container'>
                                    {this.state.profileEditFields.industry.map((ind, idx) => {
                                        return <span key={idx} className='ProfileEditChoiceSlot'>{ind} <span>&#10006;</span> </span>
                                    })}
                                </div>
                                <input type='text' placeholder='Enter industry of work'/>
                            </div>

                            <div className='ProfileEdit-input-group ProfileEdit-emp-bio'>
                                <label>Bio</label>
                                <textarea value={this.state.profileEditFields.shortDesc}></textarea>
                            </div>
                            
                            <div className='ProfileEdit-input-group ProfileEdit-emp-yf'>
                                <label>Year founded</label>
                                <input type='date' placeholder='Year founded' value={this.state.profileEditFields.yearFounded}/>
                            </div>

                            <div className='ProfileEdit-input-group ProfileEdit-emp-gs'>
                                <label>Company growth stage</label>
                                <input type='text' placeholder='Company growth stage' value={this.state.profileEditFields.companyGrowthStage}/>
                            </div>

                           <div className="ProfileEdit-input-group ProfileEdit-emp-studQuals">
                            <div className='ProfileEdit-choice-slot-container'>
                                    <label htmlFor='personalities'>What employee qualities do you prefer</label>
                                    <fieldset name="personalities" className="ProfileEdit-valuesField">
                                        {
                                            studentPersonalities.map((background, index) => {
                                                return <div data-experiencetype={background} className="ProfileEdit-valuesOption" onClick={this.handleEmpQualPick} key={index} style={this.state.empStudsPref.includes(background) ? {backgroundColor: "#00a68a"} : {}}>
                                                    <span data-experiencetype={background} className="ProfileEdit-valuesOption-type" >{background}</span>
                                                </div>
                                            })
                                        }
                                    </fieldset>
                                </div>
                           </div>
                            
                            <div className="ProfileEdit-input-group ProfileEdit-emp-offer">
                                <div className='ProfileEdit-choice-slot-container'>
                                    <label>What will your company offer?</label>
                                    <fieldset name="backgroundInput" className="ProfileEdit-valuesField">
                                        {
                                            studentValues.map((background, index) => {
                                                return <div data-experiencetype={background} className="ProfileEdit-valuesOption" onClick={this.handleEmpOffer} key={index} style={this.state.empOffer.includes(background) ? {backgroundColor: "#00a68a"} : {}}>
                                                    <span data-experiencetype={background} className="ProfileEdit-valuesOption-type" >{background}</span>
                                                </div>
                                            })
                                        }
                                    </fieldset>
                                </div>
                            </div>

                            <div className="ProfileEdit-input-group ProfileEdit-emp-workEnv">
                                <div className='ProfileEdit-choice-slot-container'>
                                    <label>How would best describe the work environment at {this.state.curUser.companyName} </label>
                                    <fieldset name="backgroundInput" className="ProfileEdit-valuesField">
                                        {
                                            workEnvironment.map((background, index) => {
                                                return <div data-experiencetype={background} className="ProfileEdit-valuesOption" onClick={this.handleCompWorkEnv} key={index} style={this.state.empWorkEnv.includes(background) ? {backgroundColor: "#00a68a"} : {}}>
                                                    <span data-experiencetype={background} className="ProfileEdit-valuesOption-type" >{background}</span>
                                                </div>
                                            })
                                        }
                                    </fieldset>
                                </div>
                            </div>

                        </div>

                        : ""
                    }
                    {
                        this.state.curUserType === 'Recruiter' && this.state.profileEditFields ?
                        <div className='ProfileEdit-inputs-recruiter ProfileEdit-inputsContainer'>
                            <div className='ProfileEdit-input-group ProfileEdit-rec-education'>
                                <label>Education</label>
                                <div className='ProfileEdit-choice-slot-container'>
                                    {this.state.recEducation.map((ed, idx) => {
                                        return <span key={idx} className='ProfileEditChoiceSlot'>{ed} <span>&#10006;</span> </span>
                                    })}
                                </div>
                                <input type='text' placeholder='Enter a college / university'/>
                            </div>

                            <div className='ProfileEdit-input-group ProfileEdit-rec-compName'>
                                <label>Company Name</label>
                                <input type='text' placeholder='Company name' value={this.state.recCompName}/>
                            </div>

                            <div className='ProfileEdit-input-group ProfileEdit-rec-jobTitle'>
                                <label>Job Title</label>
                                <input type='text' placeholder='Job Title' value={this.state.recJobTitle}/>
                            </div>

                            <div className='ProfileEdit-input-group ProfileEdit-rec-bio'>
                                <label>Bio</label>
                                <textarea type='text' placeholder='Bio' value={this.state.recShortDesc}></textarea>
                            </div>

                            <div className='ProfileEdit-input-group ProfileEdit-rec-socials'>
                                <label>Socials</label>
                                <input type='text' placeholder='A comma separated string, of you socials' value={this.state.recSocials}/>
                            </div>

                            <div className='ProfileEdit-input-group ProfileEdit-rec-autoMsg'>
                                <label>Automated Match Message</label>
                                <textarea type='text' onChange={this.handleRecruiterAutoMsg} placeholder='This is an automatic message starting the conversation with a student upon a match.'>
                                    {this.state.recAutomatedMatchMsg}
                                </textarea>
                            </div>

                        </div>

                        : ""
                    }
                    
                </div>
                    {
                        this.state.toggleSaveChangesBtn ?

                        <div onClick={this.SaveChanges} className='ProfileEdit-saveChangesBtn'><h2>Save changes</h2></div>
                        
                        : ''
                    }
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEdit);