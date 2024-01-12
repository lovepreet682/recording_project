import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoEyeSharp } from "react-icons/io5";
import Modal from 'react-bootstrap/Modal';


function ReportTable() {
    const [notificationTable, setNotificationTable] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [filteredTable, setFilteredTable] = useState([]);
    const [show, setShow] = useState(false);
    const [modalTable, setModalTable] = useState([]);
    const [getID, setGetID] = useState('')

    useEffect(() => {
        axios.get('http://localhost:4000/notification')
            .then((res) => {
                const response = res.data;
                setNotificationTable(response);
                setFilteredTable(response)
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

    // handleSubmit
    const handleSubmit = () => {
        // Now im converting input strings to Date objects
        const fromDateObj = new Date(fromDate);
        console.log(fromDateObj);
        const toDateObj = new Date(toDate);
        const filteredData = notificationTable.filter((item) => {
            const itemDate = new Date(item.datetime);

            // Check if fromDate is a valid date
            if (!isNaN(fromDateObj)) {
                // Check date range if toDate is a valid date
                if (!isNaN(toDateObj)) {
                    return itemDate >= fromDateObj && itemDate <= toDateObj;
                } else {
                    // Only check start date if toDate is not valid
                    return itemDate >= fromDateObj;
                }
            }
            // If fromDate is not a valid date, include all items
            return true;
        });

        // Update the table with the filtered data
        setFilteredTable(filteredData);
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
            axios.get(`http://localhost:4000/users/${getID}`)
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
                        <div className='col-md-3'>
                            <button className='btn btn-primary mx-1' onClick={handleSubmit}>Submit</button>
                            <button className='btn btn-danger' onClick={handleReset}>Reset</button>
                        </div>
                    </div>
                    <table class="table text-center table-striped">
                        <thead>
                            <tr className='theading'>
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
                            {filteredTable.length > 0 ? (
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
                                    <h5 className=''>No Data Found</h5>
                                </div>
                            )}
                        </tbody>
                    </table>
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