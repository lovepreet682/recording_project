import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import DownloadFiles from '../DownloadReport/DownloadFiles';
import { Link } from 'react-router-dom';
import AudioPlayer from 'react-h5-audio-player';
import { BsArrowsFullscreen } from 'react-icons/bs'


function ModalReportTable() {
    const [notificationTable, setNotificationTable] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [filteredTable, setFilteredTable] = useState([]);
    const [show, setShow] = useState(false);
    const [summaryModel, setSummaryModel] = useState(false);
    const [modalTable, setModalTable] = useState([]);
    const [getID, setGetID] = useState('');
    const [notificationTableValue, setNotificationTableValue] = useState([]);
    const [getSuspiciousWord, setGetSuspiciousWord] = useState([]);
    const [taxIdShow, setTaxIdShow] = useState(false);
    const [sentimentValue, setSentimentValue] = useState("");
    const [transcript, setTranscript] = useState("");
    const [selectedListenRecording, setSelectedListenRecording] = useState(null);
    const [selectedTranscriptRecording, setSelectedTranscriptRecording] = useState(null);
    const [selectedRecording, setSelectedRecording] = useState(null);

    // 10 Record's API
    useEffect(() => {
        axios.get('http://13.233.34.0:4000/groceryWord')
            .then((res) => {
                const response = res.data;
                setGetSuspiciousWord(response);
                console.log(response);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });

        axios.get('http://13.233.34.0:4000/notificationTable')
            .then((res) => {
                const response = res.data;
                setNotificationTable(response);
                setFilteredTable(response);
                // console.log(response);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

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


    // formatTaxIdDate
    const formatTaxIdDate = (formatdate) => {
        if (!formatdate) return '';
        const date = new Date(formatdate);
        const day = String(date.getDay()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = String(date.getFullYear())
        return `${day}-${month}-${year}`
    }

    // handleSubmit
    const handleSubmit = () => {
        console.log("submitting");
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
            console.log(notificationTable);

            axios.get("http://13.233.34.0:4000/notification", {
                params: updatedSearchCriteria,
            }).then((res) => {
                setFilteredTable(res.data);
                console.log("handle submit data", res.data);
            }).catch((error) => {
                console.log(error);
            });
        }
    };

    // handleClose
    const handleClose = () => {
        setShow(false);
        setTaxIdShow(false);
        setSelectedRecording(null)
        setTranscript('')
    }

    const handleTaxId = (call_id) => {
        setTaxIdShow(true)
        setGetID(call_id);
    }


    useEffect(() => {
        axios.get('http://13.233.34.0:4000/groceryWord')
            .then((res) => {
                const response = res.data;

                // Extract the Array 
                const extractArray = response.map((item) => item.grocery_word)
                setGetSuspiciousWord(extractArray);
                console.log(getSuspiciousWord);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });

        if (getID !== null) {
            axios.get(`http://13.233.34.0:4000/users/${getID}`)
                .then((res) => {
                    const response = res.data;
                    console.log('This is my Response:', response);

                    if (Array.isArray(response)) {
                        // If the response is an array, set it directly to modalTable
                        setModalTable(response);
                    } else if (typeof response === 'object') {
                        // If the response is an object, wrap it in an array and set modalTable
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

    // ListenRecording 
    const ListenRecording = (id) => {
        // Set the selected recording for listening
        setSelectedListenRecording(id);

        if (selectedTranscriptRecording !== id) {
            // Clear the transcript if it's not for the same recording
            setTranscript("");
        }
        axios.get(`http://13.233.34.0:4000/audio/${id}`, { responseType: 'arraybuffer' })
            .then((res) => {
                const blob = new Blob([res.data]);
                console.log(blob);
                const audioUrl = URL.createObjectURL(blob);
                setSelectedRecording(audioUrl);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const GetTranscript = (id) => {
        if (selectedListenRecording === id) {
            axios.get(`http://13.233.34.0:4000/transcript/${id}`)
                .then((res) => {
                    setTranscript(res.data.transcript);
                    setSelectedTranscriptRecording(id);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            // Clear the transcript if audio and transcript IDs don't match
            setTranscript("");
        }
    };

    const getSeummary = (id) => {
        console.log(id);
        setSummaryModel(true)
        axios.get(`http://13.233.34.0:4000/summary/${id}`).then((res) => {
            setSentimentValue(res.data);
        })
    }


    const handleCloseSummaryModel = () => {
        setSummaryModel(false)
    }

    return (
        <>
            <div id="notification">
                <h4 className='text-center pt-2'>Records Report </h4>
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
                    <div style={{ overflow: "auto", height: "77vh" }}>
                        <table class="table text-center table-striped" style={{ overflow: "auto" }}>
                            <thead>
                                <tr className='theading' id='reportTable'>
                                    <th scope="col">Sr No.</th>
                                    <th scope="col">Txn Id</th>
                                    <th scope="col">No Of Records</th>
                                    <th scope="col">Date</th>
                                    {/* <th scope="col">Call Id</th> */}
                                    <th scope="col">Notification Id</th>
                                    {/* <th scope="col">View</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTable.length > 0 && notificationTableValue ? (
                                    <>
                                        {filteredTable.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <Link className='reportTaxID' onClick={() => handleTaxId(item.call_id)}>
                                                        TXN-{item.txn_id}
                                                    </Link>
                                                </td>

                                                <td >{item.no_of_records}</td>
                                                <td >{formatDateString(item.datetime)}</td>
                                                {/* <td >{item.call_id.split(',').map((callId, callIndex) => (
                                                    <React.Fragment key={callIndex}>
                                                        {callIndex > 0 && <br />}
                                                        {callId}
                                                    </React.Fragment>
                                                ))}</td> */}
                                                <td >{item.sentemai}</td>
                                                {/* <td>
                                                    <div>
                                                        <IoEyeSharp className='fs-4' onClick={() => {
                                                            handleModalSection(item.call_id);

                                                        }} />
                                                    </div>
                                                </td> */}
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

                {/* Tax Id */}
                <Modal show={taxIdShow} onHide={handleClose} className='' dialogClassName="modal-lg">
                    <Modal.Header closeButton>
                        <Modal.Title className='text-center'>User Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <table className="table table-striped text-center" style={{ borderRadius: '10px', width: '100%' }}>
                            <thead>
                                <tr className=''>
                                    <th scope="col" style={{ border: '1px solid black', margin: "10px" }}>Sr No</th>
                                    <th scope="col" style={{ border: '1px solid black', margin: "10px" }}>Call Id</th>
                                    <th scope="col" style={{ border: '1px solid black', margin: "10px" }}>Recording</th>
                                    <th scope="col" style={{ border: '1px solid black', margin: "10px" }}>Sentiment</th>
                                    <th scope="col" style={{ border: '1px solid black', margin: "10px" }}>Type</th>
                                    <th scope="col" style={{ border: '1px solid black', margin: "10px" }}>Duration</th>
                                    <th scope="col" style={{ border: '1px solid black', margin: "10px" }}>Date</th>
                                    <th scope="col" style={{ border: '1px solid black', margin: "10px" }}>Queue</th>
                                    <th scope='col' style={{ border: '1px solid black', margin: "10px" }}>Agent</th>
                                </tr>
                            </thead>
                            {modalTable.length > 0 ? (
                                <>
                                    {console.log(modalTable)}
                                    {modalTable.map((data, index) => (
                                        <tr key={data.recording_Id}>
                                            <td style={{ border: '1px solid black', margin: "10px" }} className="text-center data1">{index + 1}</td>
                                            <td style={{ border: '1px solid black', margin: "10px" }} className="text-center data1">{data.call_id}</td>
                                            <td style={{ border: '1px solid black', margin: "10px", padding: "10px" }} className='data1' key={index}>
                                                <Link to="#" onClick={() => ListenRecording(data.recording_Id)} className="text-primary">
                                                    Listen
                                                </Link>
                                                ||
                                                <Link to="#" onClick={() => GetTranscript(data.recording_Id)} className="text-primary">
                                                    Transcript
                                                </Link>
                                                ||
                                                <Link to="#" onClick={() => getSeummary(data.recording_Id)} className="text-primary">
                                                    Summary
                                                </Link>
                                            </td>

                                            <td style={{ border: '1px solid black', margin: "10px" }} className="text-center data1">{data.sentiment_analysis}</td>
                                            <td style={{ border: '1px solid black', margin: "10px" }} className="text-center data1">{data.type_in}</td>
                                            <td style={{ border: '1px solid black', margin: "10px" }} className="text-center data1">{data.duration}</td>
                                            <td style={{ border: '1px solid black', margin: "10px" }} className="text-center data1">{formatTaxIdDate(data.recording_date)}</td>
                                            <td style={{ border: '1px solid black', margin: "10px" }} className="text-center data1">{data.queue_name}</td>
                                            <td style={{ border: '1px solid black', margin: "10px" }} className="text-center data1">{data.agent_name}</td>
                                        </tr>
                                    ))}
                                </>
                            ) : (
                                <div>
                                    <h5>Data Is Not Exists</h5>
                                </div>
                            )}
                        </table>

                        <>
                            {/* Audio and Transcipt Section */}
                            {selectedRecording != null && (
                                <div className="row" id=''>
                                    <div className="col-md-5 col-lg-5 ">
                                        <div id='audioPlayerbackground' className="col-md-12 col-12 col-lg-12 Audio_transcript">
                                            <div className='w-100 p-2'>
                                                <AudioPlayer style={{ height: "130px" }} controls className="text-center w-100" src={selectedRecording} type="audio/mp3" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-7 col-lg-7">
                                        <div className="transcript Audio_transcript" style={{ overflowY: 'auto', maxHeight: selectedTranscriptRecording ? '150px' : 'auto', padding: "5px 10px" }}>
                                            <span data-bs-toggle="modal" data-bs-target="#exampleModal" className='fullwidthIcons'><BsArrowsFullscreen /></span>
                                            <span className='fs-5' style={{ paddingLeft: "40%" }}>Transcript</span>
                                            <br />


                                            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                <div class="modal-dialog">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <h1 class="modal-title fs-5 text-center" id="exampleModalLabel">Transcript</h1>
                                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <div class="modal-body">
                                                            {transcript}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {transcript}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    </Modal.Body>
                </Modal>

                {/* React-bootstrap */}
                <Modal show={summaryModel} onHide={handleCloseSummaryModel} style={{ backdropFilter: summaryModel ? 'blur(1px)' : "none" }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Summary</Modal.Title>
                    </Modal.Header>
                    {console.log(sentimentValue)}
                    <Modal.Body>{sentimentValue}</Modal.Body>
                </Modal>
            </div>
        </>
    )
}

export default ModalReportTable