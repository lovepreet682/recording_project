import React from 'react'
import { MdSettingsVoice } from 'react-icons/md'
import { IoMdRecording } from 'react-icons/io'
import { CgVoicemailR } from 'react-icons/cg'
import { AiOutlineMail } from 'react-icons/ai'
import { FiExternalLink } from 'react-icons/fi'
import { Link, NavLink, useNavigate } from 'react-router-dom'


function Recording() {
    let navigate= useNavigate();

    const RecordingSytling=({isActive})=>{
        return{
            color:isActive?'yellow':'white'
        }
    }
    const UserFormPage = async (e) => {
        e.preventDefault();
        navigate('/navbar/showDetails');
    }
    return (
        <>
            <div id="recording" className='pt-5 text-center' style={{minHeight:"100vh"}}>
                <div className="container">
                    <div className="row d-flex justify-content-between">
                        <div id='mycolumn' className="col-md-3 mb-3 col-sm-12 col-lg-3 mycolumn">
                            <NavLink onClick={UserFormPage} style={RecordingSytling} className='mycolumn'>
                                <div className="recordingBox" style={{ backgroundColor: "#0C32AE" }}>
                                    <span className='mx-2 text-center text-warning fs-4'><MdSettingsVoice /></span>
                                    Voice Recording
                                </div>
                            </NavLink>
                        </div>

                        <div className="col-md-3 mb-3 col-sm-12 col-lg-3">
                            <Link to=''>
                                <div className="recordingBox" style={{ backgroundColor: "#0C32AE" }}>
                                    <span className='mx-2 text-center text-warning fs-4'><IoMdRecording /></span>
                                    Chat Recording
                                </div>
                            </Link>
                        </div>

                        <div className="col-md-3 mb-3 col-sm-12 col-lg-3">
                            <Link to="">
                                <div className="recordingBox" style={{ backgroundColor: "#0C32AE" }}>
                                    <span className='mx-2 text-center text-warning fs-4'><CgVoicemailR /></span>
                                    Voicemail Recording
                                </div>
                            </Link>
                        </div>

                        <div className="col-md-3 mb-3 col-sm-12 col-lg-3">
                            <Link to=''>
                                <div className="recordingBox" style={{ backgroundColor: "#0C32AE" }}>
                                    <span className='mx-2 text-center text-warning fs-4'><AiOutlineMail /></span>
                                    Email Recording
                                </div>
                            </Link>
                        </div>

                        <div className="col-md-3 mb-3 mb-3 col-sm-12 col-lg-3">
                            <Link to=''>
                                <div className="recordingBox" style={{ backgroundColor: "#0C32AE" }}>
                                    <span className='mx-2 text-center text-warning fs-4'><FiExternalLink /></span>
                                    External Recording
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Recording