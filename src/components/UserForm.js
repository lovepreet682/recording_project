import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'

function UserForm() {

    let navigate = useNavigate();
    const RecordingPage = (e) => {
        e.preventDefault();
        navigate('/navbar/showDetails');
    }
    return (
        <>
            <div id='userform_login' style={{ color: 'white', minHeight:'100vh' }}>
                <div className="container">
                    <div id="userform">
                        <h4 className='mb-3 pt-5 pb-3'>Search voice recordings</h4>
                        <div className="row mb-3">
                            <div className="col-md-2">
                                Call Type
                            </div>
                            <div className="col-md-7">
                                <select class="form-select" aria-label="Default select example">
                                    <option selected>Queued Incoming Calls</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-2 ">
                                Processed between
                            </div>
                            <div className="col-md-3">
                                <input type="date" className='form-control' name="" id="" />
                            </div>
                            <div className="col-md-1 ">
                                and
                            </div>
                            <div className="col-md-3">
                                <input type="date" className='form-control' name="" id="" />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-2">
                                Calling Name
                            </div>
                            <div className="col-md-7">
                                <input type="text" className='form-control' />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-2">
                                Evaluations
                            </div>
                            <div className="col-md-7">
                                <select class="form-select" aria-label="Default select example">
                                    <option selected>All</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                        </div>


                        <div className="row mb-3">
                            <div className="col-md-2">
                                Calling Number
                            </div>
                            <div className="col-md-7">
                                <input type="text" className='form-control' />
                            </div>
                        </div>


                        <div className="row mb-3">
                            <div className="col-md-2">
                                Number Dialed                        </div>
                            <div className="col-md-7">
                                <input type="text" className='form-control' />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-2">
                                Queue Name
                            </div>
                            <div className="col-md-7">
                                <input type="text" className='form-control' />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-2">
                                Call ID
                            </div>
                            <div className="col-md-7">
                                <input type="text" className='form-control' />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-2">
                                Client Type
                            </div>
                            <div className="col-md-7">
                                <input type="text" className='form-control' />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-2">
                                Claim No
                            </div>
                            <div className="col-md-7">
                                <input type="text" className='form-control' />
                            </div>
                        </div>

                        <div className='col-md-3 m-auto'>
                            <Link to='' onClick={RecordingPage}>
                                <div className="btn btn-danger mb-3">Click Here</div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Outlet />

        </>
    )
}

export default UserForm