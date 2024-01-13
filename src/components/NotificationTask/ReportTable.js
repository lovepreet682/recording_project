import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoEyeSharp } from "react-icons/io5";
import Modal from 'react-bootstrap/Modal';
import DownloadFiles from '../DownloadReport/DownloadFiles';

function ReportTable() {
    const [notificationTable, setNotificationTable] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [filteredTable, setFilteredTable] = useState([]);
    const [show, setShow] = useState(false);
    const [modalTable, setModalTable] = useState([]);
    const [getID, setGetID] = useState('');
    const [notificationTableValue, setNotificationTableValue] = useState('');


    useEffect(() => {
        axios.get('http://13.233.34.0:4000/notificationTable')
            .then((res) => {
                const response = res.data;
                setNotificationTable(response);
                setFilteredTable(response);
                console.log(response);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [])

    // format date
    const formatDateString = (isoDateString) => {
        const parsedDate = new Date(isoDateString);

        const day = ('0' + parsedDate.getDate()).slice(-2)
        const month = ('0' + (parsedDate.getMonth() + 1)).slice(-2); // Adding 1 because months are zero-based
        const year = parsedDate.getFullYear();

        const hours = parsedDate.getHours();
        const minutes = parsedDate.getMinutes();
        const seconds = parsedDate.getSeconds();

        const formattedHours = ('0' + hours).slice(-2);
        const formattedMinutes = ('0' + minutes).slice(-2);
        const formattedSeconds = ('0' + seconds).slice(-2);

        const formattedDate = `${day}-${month}-${year} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        return formattedDate;
    };

    // format Date in the Modal 
    const modalDateFormat = (myStringDate) => {
        const parsedDate = new Date(myStringDate);

        const formatDate = `${parsedDate.getDate()}-${parsedDate.getMonth()}-${parsedDate.getFullYear()}`
        return formatDate;

    }

    // Handle Reset
    const handleReset = () => {
        setFromDate('');
        setToDate('');
        setFilteredTable(notificationTable);
    }

    // Format Date
    const formatDate = (dateString) => {
        if (!dateString) return ""; // Return an empty string if dateString is falsy
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = String(date.getFullYear());
        return `${year}-${month}-${day}`;
    };

    // handleSubmit
    const handleSubmit = () => {
        if (fromDate || toDate) {
            const formattedFromDate = formatDate(fromDate);
            const formattedToDate = formatDate(toDate);
            console.log(formattedFromDate, formattedToDate);

            const updatedSearchCriteria = {
                "fromdate": formattedFromDate,
                "todate": formattedToDate,
            };
            console.log(updatedSearchCriteria);

            const criteriaUsed = Object.values(updatedSearchCriteria).some((value) =>
                Boolean(value)
            );
            // Update the flag based on whether criteria have been used
            setNotificationTableValue(criteriaUsed);
            // console.log(notificationTable);

            axios.get("http://13.233.34.0:4000/notification", {
                params: updatedSearchCriteria,
            }).then((res) => {
                setFilteredTable(res.data);
                console.log(res.data);
            }).catch((error) => {
                console.log(error);
            });
        }
    };

    // handleClose
    const handleClose = () => {
        setShow(false);
    }

    // handleModalSection
    const handleModalSection = (call_id) => {
        setShow(true);
        setGetID(call_id);
        console.log(call_id);
    };

    useEffect(() => {
        if (getID !== null) {
            axios.get(`http://13.233.34.0:4000/users/${getID}`)
                .then((res) => {
                    const response = res.data;
                    console.log('Response:', response);
                    if (typeof response === 'object' && !Array.isArray(response)) {
                        setModalTable([response]);
                    } else {
                        console.error('Invalid response format:', response);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [getID]);


    return (
        <>
            <div id="notification">
                <h4 className='text-center pt-2'>Notification Reports </h4>
                <div className="container pt-2" id=''>
                    <div className="row d-flex justify-content-center mb-1">
                        From
                        <div className="col-md-4">
                            <input type="date" className='form-control' value={fromDate} onChange={(e) => {
                                setFromDate(e.target.value); console.log(e.target.value);
                            }} />
                        </div>
                        To
                        <div className="col-md-4">
                            <input type="date" className='form-control' value={toDate} onChange={(e) => {
                                setToDate(e.target.value); console.log(e.target.value);
                            }} />
                        </div>
                        <div className='col-md-3 d-flex '>
                            <button className='btn btn-primary mx-1' onClick={handleSubmit}>SUBMIT</button>
                            <button className='btn btn-danger' onClick={handleReset}>RESET</button>
                            <span className='' style={{ marginLeft: "7px" }}>
                                <DownloadFiles filteredTable={filteredTable} />
                            </span>



                        </div>
                    </div>
                    <div style={{overflow:"auto", height:"77vh"}}>
                        <table class="table text-center table-striped" style={{ overflow: "auto" }}>
                            <thead>
                                <tr className='theading' id='reportTable'>
                                    <th scope="col">Sr No.</th>
                                    <th scope="col">Txn Id</th>
                                    <th scope="col">No Of Records</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Call Id</th>
                                    <th scope="col">Notification Id</th>
                                    <th scope="col">View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTable.length != 0 && notificationTableValue ? (
                                    <>
                                        {filteredTable.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td >TXN-{item.tax_id}</td>
                                                <td >{item.no_of_records}</td>
                                                <td >{formatDateString(item.datetime)}</td>
                                                <td >{item.call_id}</td>
                                                <td >{item.sentemai}</td>
                                                <td>
                                                    <div>
                                                        <IoEyeSharp className='fs-4' onClick={() => handleModalSection(item.call_id)} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                ) : (
                                    <div className='mt-1 text-center'>
                                        <h5 className='text-center'>No Data Found</h5>
                                    </div>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal Update */}
                <Modal show={show} onHide={handleClose} className='' dialogClassName="modal-lg">
                    <Modal.Header closeButton>
                        <Modal.Title className='text-center'>User Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <table className="table table-striped text-center" style={{ borderRadius: '10px', width: '100%' }}>
                            <thead>
                                <tr className=''>
                                    <th scope="col" style={{ border: '1px solid black' }}>Call Id</th>
                                    <th scope="col" style={{ border: '1px solid black' }}>Sentiment</th>
                                    <th scope="col" style={{ border: '1px solid black' }}>Type</th>
                                    <th scope="col" style={{ border: '1px solid black' }}>Duration</th>
                                    <th scope="col" style={{ border: '1px solid black' }}>Date</th>
                                    <th scope="col" style={{ border: '1px solid black' }}>Queue</th>
                                    <th scope='col' style={{ border: '1px solid black' }}>Agent</th>
                                    <th scope='col' style={{ border: '1px solid black' }}>Transcription</th>
                                </tr>
                            </thead>
                            {modalTable.length > 0 ? (
                                <>
                                    {modalTable.map((data, index) => (
                                        <tr key={index} >
                                            <td className="data1" style={{ border: '1px solid black', margin: "10px" }}>{data.call_id}</td>
                                            <td className="data1" style={{ border: '1px solid black', margin: "10px" }}>{data.sentiment_analysis}</td>
                                            <td className="data1" style={{ border: '1px solid black', margin: "10px" }}>{data.type_in}</td>
                                            <td className="data1" style={{ border: '1px solid black', margin: "10px" }}>{data.duration}</td>
                                            <td className="data1" style={{ border: '1px solid black', margin: "10px" }}>{modalDateFormat(data.recording_date)}</td>
                                            <td className="data1" style={{ border: '1px solid black', margin: "10px" }}>{data.queue_name}</td>
                                            <td className="data1" style={{ border: '1px solid black', margin: "10px" }}>{data.agent_name}</td>
                                            <td className="data1" style={{ border: '1px solid black', margin: "10px" }}>{data.transcription}</td>
                                        </tr>
                                    ))}
                                </>
                            ) : (
                                <div>
                                    <h5>Data Is Not Exists</h5>
                                </div>
                            )}
                        </table>
                    </Modal.Body>
                </Modal>

            </div>
        </>
    )
}

export default ReportTable