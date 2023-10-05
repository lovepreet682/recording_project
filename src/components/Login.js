import React, { useState } from 'react';
import {  useNavigate } from "react-router-dom";
import { AiOutlineMail } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";


function Login() {
    let navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState()
    const [Login, setLogin] = useState({
        email: "",
        password: ""
    })

    const ChangeFields = (e) => {
        const value = e.target.value;
        setLogin({ ...Login, [e.target.name]: value });
    };

    //Login the button
    const handleLogin = async (e) => {
        e.preventDefault();
        navigate('/navbar/network');
    }

    return (
        <>
            <div id="LoginBox">
                <div className="container-fluid">
                    <div className="row">
                        <div id='sendMailpage' className='pt-4'>
                            <div className="container sendMail" id='sendMailBox'>
                                <form onSubmit={handleLogin}>
                                    <h4 className='text-center mb-2'> Login </h4>
                                    {/* Show the Error message */}
                                    {errorMessage && <div className="alert alert-danger" role="alert">
                                        {errorMessage}
                                    </div>}

                                    <div className="row">
                                        <div className="col-md-12">
                                            <label htmlFor="email" className="form-label">Enter Your Email</label>
                                            <div className="input-group mb-3">
                                                <span className="input-group-text" id="basic-addon1"><AiOutlineMail /></span>
                                                <input required type="email" name="email" value={Login.email} onChange={ChangeFields} class="form-control" id="" aria-describedby="helpId" placeholder="" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-12">
                                            <label htmlFor="" className="form-label">Password</label>
                                            <div className="input-group mb-3">
                                                <span className="input-group-text" id="basic-addon1"><FaUserCircle /></span>
                                                <input required type="password" name="password" value={Login.password} onChange={ChangeFields} class="form-control" id="" aria-describedby="helpId" placeholder="" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='mb-3 d-flex justify-content-center'>
                                       <button className='btn btn-danger'>Login Here</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login