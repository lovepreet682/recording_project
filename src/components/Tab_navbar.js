import React from 'react'
import { NavLink, Outlet } from 'react-router-dom';

import { AiOutlineHome, AiOutlineUpload } from 'react-icons/ai';
import { GiNetworkBars } from 'react-icons/gi';
import { FiSettings } from 'react-icons/fi';
import { BsLink45Deg } from 'react-icons/bs';
import { BiSolidDownload, BiUserCircle } from 'react-icons/bi';

function Tab_navbar() {

    return (
        <div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-auto min-vh-100" id='iconsColor'>
                        <ul className='list-unstyled' id='iconsbar'>
                            <li className='text-center'><NavLink to="home" className='fs-2'> <AiOutlineHome /></NavLink></li>
                            <li className='text-center'><NavLink to="network" className='fs-2'><GiNetworkBars /></NavLink></li>
                            <li className='text-center'><NavLink to="setting" className='fs-2'><FiSettings /></NavLink></li>
                            <li className='text-center'><NavLink to="down" className='fs-2'><BsLink45Deg /></NavLink></li>
                            <li className='text-center'><NavLink to="download" className='fs-2'><BiSolidDownload /></NavLink></li>
                            <li className='text-center'><NavLink to="upload" className='fs-2' ><AiOutlineUpload /></NavLink></li>
                            <div className=''>
                                <li className='text-center'><NavLink to="login" className='fs-2'><BiUserCircle /></NavLink></li>
                            </div>
                        </ul>
                    </div>

                    <div className='col p-0 m-0'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tab_navbar