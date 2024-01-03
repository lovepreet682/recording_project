import React, { useEffect, useState } from 'react';
import { BsArrowsFullscreen } from 'react-icons/bs'
import axios from 'axios';
import { Link } from 'react-router-dom';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';


function ShowDetails() {
    const [fetchData, setFetchData] = useState([]);
    const [selectedRecording, setSelectedRecording] = useState(null);
    const [selectedListenRecording, setSelectedListenRecording] = useState(null); // Selected recording for listening
    const [selectedTranscriptRecording, setSelectedTranscriptRecording] = useState(null); // Selected recording for viewing transcript
    const [transcript, setTranscript] = useState("");
    const [searchCriteriaUsed, setSearchCriteriaUsed] = useState(false);
    const [sentiment, setSentiment] = useState('');
    const [sentimentValue, setSentimentValue] = useState("");
    const [wordSearch, setWordSearch] = useState('');
    const [wordSearchEmpty, setWordSearchEmpty] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingQueryData, setLoadingQueryData] = useState(false);

    const handleClose = () => {
        setModalVisible(false);
        setWordSearch('');
        setSearchCriteria({
            name: "",
            todate: "",
            fromdate: ""
        })
    }

    const handleCloseQueryModal = () => {
        setQuerySearchModal(false);
        setQuerySearch('')
    }
    const [modalData, setModalData] = useState([]);

    // Query useState
    const [querySearch, setQuerySearch] = useState('');
    const [querySearchModal, setQuerySearchModal] = useState(false);
    const [errorQuerySearch, setErrorQuerySearch] = useState('')

    //Duration Range
    const [range, setRange] = React.useState([0, 100]); // Initial range [min, max]
    const handleRangeChange = (newRange) => {
        setRange(newRange);
    };

    // Search Data
    const [searchData, setSearchData] = useState([]); // Initialize searchData with the original data
    const [searchCriteria, setSearchCriteria] = useState({
        name: "",
        fromdate: "",
        todate: "",
        type: "",
    });

    const [selectIncOutCall, setSelectIncOutCall] = useState(""); // Default: no filter
    const [selectedDurationLongShort, setSelectedDurationLongShort] = useState(null);

    //Handle the Longest And Shortest
    const handleDurationOptionChange = (e) => {
        setSelectedDurationLongShort(e.target.value);
        applyFilter(" ", " ", e.target.value);
    };

    const handleFilterChange = (e) => {
        const selectedType = e.target.value;

        console.log(selectedType);
        // Update the selected filter type state
        setSelectIncOutCall(selectedType);

        // console.log(setSelectIncOutCall(selectedType));
        applyFilter(selectedType, "", "", "")

    };

    const handleSentiment = (e) => {
        const selectSentiment = e.target.value;
        setSentiment(selectSentiment);
        applyFilter("", "", "", selectSentiment)
    }

    // console.log(selectIncOutCall);
    const applyFilter = (filterType, durationRange, durationOption, selectSentiment) => {
        // Filter the search data based on the selected filter type
        let filteredData = searchData;
        let sentimentData = searchData;
        console.log(selectSentiment);

        if (filterType === "In") {
            // console.log(filteredData, "1");
            filteredData = filteredData.filter((data) => data.type_in === "In");
        } else if (filterType === "Out") {
            console.log(filteredData);
            filteredData = filteredData.filter((data) => data.type_in === "Out");
            console.log(filteredData);
        }

        if (selectSentiment === "positive") {
            filteredData = filteredData.filter((data) => data.sentiment_analysis === "positive")
        } else if (selectSentiment === "negative") {
            filteredData = filteredData.filter((data) => data.sentiment_analysis === "negative")
        } else if (selectSentiment === "neutral") {
            filteredData = filteredData.filter((data) => data.sentiment_analysis === "neutral")
        }

        console.log(filteredData);

        if (durationOption === "Longest") {
            filteredData.sort((a, b) => {
                const durationA = parseDuration(a.duration);
                const durationB = parseDuration(b.duration);
                return durationB - durationA;
            });

        } else if (durationOption === "Shortest") {
            filteredData.sort((a, b) => {
                const durationA = parseDuration(a.duration);
                const durationB = parseDuration(b.duration);
                return durationA - durationB;
            });
        }
        // Set the filtered search data to the state
        setFetchData(filteredData);
    };

    const parseDuration = (durationString) => {
        const [hours, minutes, seconds] = durationString.split(":").map(Number);
        // for example 2*3600 + 2*60 + 13 = 7200+120+13=  7323
        return hours * 3600 + minutes * 60 + seconds;
    };


    /////////////////////////////////////////////////////////////////////////////////////////////////

    const formatDate = (dateString) => {
        if (!dateString) return ""; // Return an empty string if dateString is falsy
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = String(date.getFullYear());
        return `${year}-${month}-${day}`;
    };

    const handleWordSearchChange = (e) => {
        setWordSearchEmpty(e.target.value.trim() !== '' && searchCriteria.name.trim() === '');
        setWordSearch(e.target.value);
    }

    const handleSearch = () => {
        if (wordSearch.trim() !== '' && searchCriteria.name.trim() !== '') {
            const fetchData = async () => {
                try {
                    const response = await axios.post('http://15.207.55.127:5000/fetch_records', {
                        agent_name: searchCriteria.name,
                        word_search: wordSearch,
                        from_date: searchCriteria.fromdate || null,
                        to_date: searchCriteria.todate || null
                    });
                    setModalData(response.data)
                    // console.log(response.data.Records.Records[0]);
                    setModalVisible(true);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            // Call the fetchData function
            fetchData();

<<<<<<< HEAD
            setSearchCriteriaUsed(criteriaUsed);
            // Only make the request if there are search criteria
            axios.get("http://13.233.34.0:4000/search", {
                params: updatedSearchCriteria,
            }).then((res) => {
                setFetchData(res.data);
                setSearchData(res.data);
                console.log(res.data);
            }).catch((error) => {
                console.log(error);
            });
=======
>>>>>>> d6443cf4660aef6e3d643247f4923d5c82ea5b81
        } else {
            // Check if any of the search criteria fields have values
            if (
                searchCriteria.name ||
                searchCriteria.fromdate ||
                searchCriteria.todate ||
                searchCriteria.queue
            ) {
                // Convert the 'from date' and 'to date' fields to the required format (dd-mm-yyyy)
                const formattedFromDate = formatDate(searchCriteria["fromdate"]);
                const formattedToDate = formatDate(searchCriteria["todate"]);
                console.log(formattedFromDate, formattedToDate);
                // Create a new search criteria object with the formatted date fields
                const updatedSearchCriteria = {
                    ...searchCriteria,
                    "fromdate": formattedFromDate,
                    "todate": formattedToDate,
                };
                console.log(updatedSearchCriteria);
                // Check if any search criteria have been applied
                const criteriaUsed = Object.values(updatedSearchCriteria).some((value) =>
                    Boolean(value)
                );
                // Update the flag based on whether criteria have been used

                setSearchCriteriaUsed(criteriaUsed);
                // Only make the request if there are search criteria
                axios.get("http://localhost:4000/search", {
                    params: updatedSearchCriteria,
                }).then((res) => {
                    setFetchData(res.data);
                    setSearchData(res.data);
                    console.log(res.data);
                }).catch((error) => {
                    console.log(error);
                });
            } else {
                console.log("No search criteria provided.");
            }
        };

    }


    // Use useEffect to set fetchData after searchData has been updated
    useEffect(() => {
        console.log(fetchData);
    }, [fetchData]);

    const HandleForm = (e) => {
        const { name, value } = e.target;
        setSearchCriteria({ ...searchCriteria, [name]: value });
        setWordSearchEmpty(wordSearch.trim() === '' && searchCriteria.name.trim() === '');

    };

    // handleQuerySearch
    const handleQuerySearch = async () => {
        try {
            setErrorQuerySearch('');
            setQuerySearchModal(true);
            setLoadingQueryData(true)
            const queryResponse = await axios.post('http://15.207.55.127:5000/query', { question: querySearch });

            // Set state and log result within the try block

            setQuerySearch(queryResponse.data);
            console.log(querySearch);
        } catch (error) {
            // Handle errors if needed
            console.log(error);
        } finally {
            setLoadingQueryData(false);
        }
    };


    //////////////////// Reset Button///////////////////////////
    const handleReset = () => {
        setSearchCriteria({
            name: "",
            fromdate: "",
            todate: "",
            queue: "",
        });

        setFetchData([]);
        setSearchData([]);
        setSelectedRecording(null); // Reset the selected recording for listening
        setSelectedTranscriptRecording(null); // Reset the selected transcript recording
        setTranscript("");
        setSentiment("")
        setSearchCriteriaUsed(false)
        setSelectedDurationLongShort(null); // Clear the selected duration option
        setRange([0, 100]); // Reset the range slider
        setSelectIncOutCall(""); // Clear the selected filter
    };

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
        axios.get(`http://13.233.34.0:4000/summary/${id}`).then((res) => {
            setSentimentValue(res.data);
        })
    }

    // Date Setting
    const formatDateString = (isoDateString) => {
        const parsedDate = new Date(isoDateString);
        const formattedDate = `${parsedDate.getDate()}-${parsedDate.getMonth() + 1}-${parsedDate.getFullYear()}`;
        return formattedDate;
    };


    const formatTranscription = (transcription, wordSearch) => {
        // Split the input into individual words and remove empty strings
        const searchWords = wordSearch.split(',').filter(word => word.trim() !== '');
        // Create a regex pattern for case-insensitive matches with commas
        const myword = new RegExp(`(${searchWords.map(word => word.trim()).join('|')})`, 'ig');
        const parts = transcription.split(myword);

        return parts.map((part, index) => (
            myword.test(part) ? <span key={index} style={{ color: 'green', background: "yellow", padding: '0px', margin: "0px" }}>{part}</span> : part
        ));
    };

    return (
        <div className="pt-1" id='showDetails'>
            <div className="row m-0" >
                <div className="col-md-2 col-lg-2" id='filterData'>
                    <h4 className='mt-4 text-center'>Filter</h4>
                    <div>
                        <li className="list-unstyled">
                            <span className="fs-5">Duration</span>
                            <div class="form-check">
                                <input class="form-check-input"
                                    type="radio"
                                    name="flexRadioDefault"
                                    id="flexRadioDefault1"
                                    value="Longest"
                                    onChange={handleDurationOptionChange}
                                    checked={selectedDurationLongShort === "Longest"}
                                />
                                <label class="form-check-label" for="flexRadioDefault1">Longest</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input"
                                    type="radio"
                                    name="flexRadioDefault"
                                    id="flexRadioDefault2"
                                    value="Shortest"
                                    onChange={handleDurationOptionChange}
                                    checked={selectedDurationLongShort === "Shortest"}
                                />
                                <label class="form-check-label" for="flexRadioDefault2">Shortest</label>
                            </div>

                        </li>
                        <div className="mb-3">
                            <label htmlFor="customRange1" className="form-label fs-5">Duration in Minutes</label>
                            <Slider
                                min={0} // Minimum value
                                max={100} // Maximum value
                                value={range} // Current range [min, max]
                                onChange={handleRangeChange} // Handle change
                                range // Enable range mode
                            />
                        </div>
                        <p className="">Selected Duration Range: {range[0]} minutes - {range[1]} minutes</p>

                        <label htmlFor="" className='fs-5'>Select Type</label>
                        <select className="w-100" onChange={handleFilterChange} value={selectIncOutCall} aria-label="Default select example">
                            <option value="">ALL</option> {/* Default: no filter */}
                            <option value="In">INC</option>
                            <option value="Out">OUT</option>
                        </select>


                        <label htmlFor="" className='fs-5 mt-3'>Select Sentiment </label>
                        <select className="w-100" onChange={handleSentiment} value={sentiment} aria-label="Default select example">
                            <option value="">ALL</option>
                            <option value="positive">POSTIIVE</option>
                            <option value="negative">NEGATIVE</option>
                            <option value="neutral">NEUTRAL</option>
                        </select>
                    </div>
                </div>

                <div className="col-lg-9 col-md-9  pt-4">
                    <div className="row d-flex">
                        <div className="con-md-12 col-lg-12 d-flex ">
                            <input type="text" placeholder='Enter Your Query' name='querySearch' value={querySearch}
                                onChange={(e) => {
                                    console.log(e.target.value);
                                    setQuerySearch(e.target.value);
                                }} className='form-control' />

                            <button type='button' onClick={handleQuerySearch} className='btn btn-primary' style={{ width: '150px', marginLeft: "10px" }}>Search Query</button>
                        </div>
                        <small className='text-danger mb-2'>{errorQuerySearch}</small>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <input type="text" className='form-control mb-3' name='wordSearch' value={wordSearch} onChange={handleWordSearchChange} placeholder='Word Search Here' />
                        </div>
                    </div>

                    <div className="search d-flex pb-2">
                        <input type="text" name='name' value={searchCriteria.name} onChange={HandleForm} className='form-control' style={{ border: wordSearchEmpty ? '1px solid red' : '1px solid #a7a7a7' }} id="name" placeholder="name" />
                        <input type="date" name='fromdate' value={searchCriteria.fromdate} onChange={HandleForm} className="form-control mx-2 " id="name" placeholder="choose date" />
                        <span className='pt-2'>To</span>
                        <input type="date" name='todate' value={searchCriteria.todate} onChange={HandleForm} className="form-control mx-2 " id="name" placeholder="choose date" />
                        <input type="text" name='queue' value={searchCriteria.queue} onChange={HandleForm} className="form-control" id="name" placeholder="queue" />
                        <button className='btn btn-primary mx-2' disabled={wordSearchEmpty}
                            onClick={handleSearch}>Search</button>
                        <button type="button" className='btn btn-primary mx-2' onClick={handleReset}>Reset</button>
                    </div>

                    <div className="row">
                        <div className="col-md-12 overflow-table">
                            <div className="col-md-12 mb-3" id="boxStyling" style={{ border: '1px solid #a7a7a7', padding: '10px' }}>
                                {fetchData.length === 0 && searchCriteriaUsed ? (
                                    <div className="text-center">
                                        <h5 className='text-dark'>Data is not matched</h5>
                                    </div>
                                ) : (
                                    <>
                                        <table className="table table-striped text-center" style={{ borderRadius: '10px' }}>
                                            <thead>
                                                <tr className=''>
                                                    <th scope="col">Recording</th>
                                                    <th scope="col">Sentiment</th>
                                                    <th scope="col text-center">Type</th>
                                                    <th scope="col text-center">Duration</th>
                                                    <th scope="col text-center">Date</th>
                                                    <th scope="col text-center">Queue</th>
                                                    <th scope='col text-center'>Agent</th>
                                                </tr>
                                            </thead>
                                            <tbody className="">
                                                {fetchData.map((data, index) => (
                                                    <tr key={data.recording_Id}>
                                                        <td className='data1' key={index}>
                                                            <Link to="#" onClick={() => ListenRecording(data.recording_Id)} className="text-primary">
                                                                Listen
                                                            </Link>
                                                            ||
                                                            <Link to="#" onClick={() => GetTranscript(data.recording_Id)} className="text-primary">
                                                                Transcript
                                                            </Link>
                                                            ||
                                                            <Link to="#" onClick={() => getSeummary(data.recording_Id)} data-bs-toggle="modal" data-bs-target="#sentimentValue" className="text-primary">
                                                                Summary
                                                            </Link>
                                                        </td>

                                                        <td className="text-center data1">{data.sentiment_analysis}</td>
                                                        <td className="text-center data1">{data.type_in}</td>
                                                        <td className="text-center data1">{data.duration}</td>
                                                        <td className="text-center data1">{formatDateString(data.recording_date)}</td>
                                                        <td className="text-center data1">{data.queue_name}</td>
                                                        <td className="text-center data1">{data.agent_name}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>
                                )}
                            </div>


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



                        </div>
                    </div>
                </div>
            </div>


            {/* Show the summary data */}
            <div class="modal fade" id="sentimentValue" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Summary</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            {sentimentValue}
                        </div>

                    </div>
                </div>
            </div>


            {/* Modal for Query */}
            {querySearchModal && (
                <Modal show={querySearchModal} onHide={handleCloseQueryModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Records</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {loadingQueryData ? (
                            <div className='text-center'>
                                <img src='../img/loading.gif' style={{ width: "50px", marginTop: "10px" }} alt="" />
                            </div>

                        ) : (
                            <>
                                {console.log(Object.keys(querySearch).length)}
                                {Object.keys(querySearch).length > 0 ? (
                                    <div>
                                        <p>{querySearch.response}</p>
                                    </div>
                                ) : (
                                    <h5>No data available.</h5>
                                )}
                            </>
                        )}
                    </Modal.Body>
                </Modal>
            )}

            {/* Modal For Search */}
            {modalVisible && (
                <>
                    <Modal show={modalVisible} onHide={handleClose} dialogClassName="modal-lg">
                        <Modal.Header closeButton>
                            <Modal.Title>Word Search </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Table striped bordered hover className='text-center'>
                                <thead>
                                    <tr>
                                        <th scope='col' style={{ border: '1px solid black' }}>Agent Name</th>
                                        <th scope='col' style={{ border: '1px solid black' }}>Queue Name</th>
                                        <th scope='col' style={{ border: '1px solid black' }}>Recording Date</th>
                                        <th scope='col' style={{ border: '1px solid black' }}>Recording Type</th>
                                        <th scope="col" style={{ border: '1px solid black' }}>Transcription</th>
                                    </tr>
                                </thead>

                                {modalData && modalData.Records && modalData.Records.Records && modalData.Records.Records.length > 0 ? (
                                    modalData.Records.Records.map((row, index) => (
                                        <tr key={index}>
                                            <td scope='col' style={{ border: '1px solid black' }}>{row.agent_name}</td>
                                            <td scope='col' style={{ border: '1px solid black' }}>{row.queue_name}</td>
                                            <td scope='col' style={{ border: '1px solid black' }}>{formatDateString(row.recording_date)}</td>
                                            <td scope='col' style={{ border: '1px solid black' }}>{row.type_in}</td>
                                            <td scope='col' style={{ border: '1px solid black' }}>{formatTranscription(row.transcription, wordSearch)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2">No data available</td>
                                    </tr>
                                )}
                            </Table>
                        </Modal.Body>
                    </Modal>
                </>
            )
            }
        </div>
    );

}

export default ShowDetails;
