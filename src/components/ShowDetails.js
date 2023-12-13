import React, { useEffect, useState } from 'react';
import { BsArrowsFullscreen } from 'react-icons/bs'
import axios from 'axios';
import { Link } from 'react-router-dom';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function ShowDetails() {
    const [fetchData, setFetchData] = useState([]);
    const [selectedRecording, setSelectedRecording] = useState(null);
    const [selectedListenRecording, setSelectedListenRecording] = useState(null); // Selected recording for listening
    const [selectedTranscriptRecording, setSelectedTranscriptRecording] = useState(null); // Selected recording for viewing transcript
    const [transcript, setTranscript] = useState("");
    const [searchCriteriaUsed, setSearchCriteriaUsed] = useState(false);
    const [sentiment, setSentiment] = useState('');
    const [sentimentValue, setSentimentValue]=useState("");

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

    const handleSentiment=(e)=>{
        const selectSentiment = e.target.value;
        setSentiment(selectSentiment);
        applyFilter("", "", "",selectSentiment)
    }

    // console.log(selectIncOutCall);
    const applyFilter = (filterType, durationRange, durationOption,selectSentiment) => {
        // Filter the search data based on the selected filter type
        let filteredData = searchData;
        let sentimentData=searchData;
        console.log(selectSentiment);

        if (filterType === "In") {
            // console.log(filteredData, "1");
            filteredData = filteredData.filter((data) => data.type_in === "In");
        } else if (filterType === "Out") {
            console.log(filteredData);
            filteredData = filteredData.filter((data) => data.type_in === "Out");
            console.log(filteredData);
        } 

        if(selectSentiment==="positive"){
            filteredData = filteredData.filter((data) => data.sentiment_analysis === "positive")
        }else if(selectSentiment==="negative"){
            filteredData = filteredData.filter((data) => data.sentiment_analysis === "negative")
        }else if(selectSentiment==="neutral"){
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

    const handleSearch = () => {
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
            // Handle the case where there are no search criteria provided (e.g., show a message or do nothing)
            console.log("No search criteria provided.");
        }
    };

    // Use useEffect to set fetchData after searchData has been updated
    useEffect(() => {
        console.log(fetchData);
    }, [fetchData]);

    const HandleForm = (e) => {
        const { name, value } = e.target;
        setSearchCriteria({ ...searchCriteria, [name]: value });
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
        axios.get(`http://localhost:4000/audio/${id}`, { responseType: 'arraybuffer' })
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
            axios.get(`http://localhost:4000/transcript/${id}`)
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
        axios.get(`http://localhost:4000/summary/${id}`).then((res)=>{
            setSentimentValue(res.data);
        })
    }

    // 
    const formatDateString = (isoDateString) => {
        const parsedDate = new Date(isoDateString);
        const formattedDate = `${parsedDate.getDate()}-${parsedDate.getMonth() + 1}-${parsedDate.getFullYear()}`;
        return formattedDate;
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
                    <div className="search d-flex pb-2">
                        <input type="text" name='name' value={searchCriteria.name} onChange={HandleForm} className="form-control" id="name" placeholder="name" />
                        <input type="date" name='fromdate' value={searchCriteria.fromdate} onChange={HandleForm} className="form-control mx-2 " id="name" placeholder="choose date" />
                        <span className='pt-2'>To</span>
                        <input type="date" name='todate' value={searchCriteria.todate} onChange={HandleForm} className="form-control mx-2 " id="name" placeholder="choose date" />
                        <input type="text" name='queue' value={searchCriteria.queue} onChange={HandleForm} className="form-control" id="name" placeholder="queue" />
                        <button className='btn btn-primary mx-2' onClick={handleSearch}>Search</button>
                        <button type="button" className='btn btn-danger mx-2' onClick={handleReset}>Reset</button>
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
                                                            <Link to="#" onClick={() => getSeummary(data.recording_Id)}  data-bs-toggle="modal" data-bs-target="#sentimentValue" className="text-primary">
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
        </div>
    );
}

export default ShowDetails;
