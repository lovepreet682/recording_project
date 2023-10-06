import React, { useEffect, useState } from 'react';
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

function ShowDetails() {
    const [fetchData, setFetchData] = useState([]);
    const [selectedRecording, setSelectedRecording] = useState(null);
    const [selectedListenRecording, setSelectedListenRecording] = useState(null); // Selected recording for listening
    const [selectedTranscriptRecording, setSelectedTranscriptRecording] = useState(null); // Selected recording for viewing transcript
    const [transcript, setTranscript] = useState("");
    const [isAudioVisible, setIsAudioVisible] = useState(false);

    // Search Data
    const [searchData, setSearchData] = useState([]); // Initialize searchData with the original data
    const [searchCriteria, setSearchCriteria] = useState({
        name: "",
        date: "",
        queue: "",
        type: "",
    });

    const [selectedFilter, setSelectedFilter] = useState(""); // Default: no filter
  const handleFilterChange = (e) => {
    const selectedType = e.target.value;
    console.log(selectedFilter);
    // Update the selected filter type state
    setSelectedFilter(selectedType);
    // Reset the search criteria type field
    setSearchCriteria({ ...searchCriteria, type: "" });
    // Apply the filter
    applyFilter(selectedType);
  };
  const applyFilter = (filterType) => {
    // Filter the data based on the selected filter type
    const filteredData = searchData.filter((data) => {
      if (filterType === "In" && data.type === "In") {
        return true;
      } else if (filterType === "Out" && data.type === "Out") {
        return true;
      } else if (!filterType) {
        // No filter selected, return all data
        return true;
      }
      return false; // Filter out other cases
    });
    // Set the filtered data to the state
    setFetchData(filteredData);

  };

 

  /////////////////////////////////////////////////////////////////////////////////////////////////

    const formatDate = (dateString) => {
        if (!dateString) return ""; // Return an empty string if dateString is falsy
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = String(date.getFullYear());
        return `${day}-${month}-${year}`;
    };

    const handleSearch = () => {
        // Make an HTTP request to your backend with the search criteria
        // Convert the date format to "dd-mm-yyyy"
        const formattedDate = formatDate(searchCriteria.date);
        // Update the date field in the search criteria
        const updatedSearchCriteria = { ...searchCriteria, date: formattedDate };
        console.log(updatedSearchCriteria);
        axios
            .get("http://192.168.29.172:4000/audio/search", {
                params: updatedSearchCriteria,
            })
            .then((res) => {
                setFetchData(res.data);
                console.log(res.data);
            })
            .catch((error) => {
                console.log(error);
            });

    };
    const HandleForm = (e) => {
        const { name, value } = e.target;
        setSearchCriteria({ ...searchCriteria, [name]: value });
    };

    // Sort Order
    const [sortingOrder, setSortingOrder] = useState("asc");

    const handleSort = () => {
        const sortedData = [...fetchData];
        if (sortingOrder === "asc") {
            sortedData.sort((a, b) => a.duration.localeCompare(b.duration));
            setSortingOrder("desc");
        } else {
            sortedData.sort((a, b) => b.duration.localeCompare(a.duration));
            setSortingOrder("asc");
        }
        setFetchData(sortedData);
    };

    //////////////////// Reset Button///////////////////////////
    const handleReset = () => {
        setSearchCriteria({
            name: "",
            type: "",
            date: "",
            queue: "",
        });

        // Fetch and set the original data
        axios.get('http://192.168.29.172:4000/audio')
            .then((res) => {
                setFetchData(res.data);
                setSearchData(res.data); // Update searchData as well
            })
            .catch((error) => {
                console.log(error);
            });

        setSelectedRecording(null);


    };



    ////////////////USEEFFECT CONCEPT////////////////////
    useEffect(() => {

        axios.get('http://192.168.29.172:4000/audio')
            .then((res) => {
                setFetchData(res.data);
                setSearchData(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const ListenRecording = (id) => {
        // Set the selected recording for listening
        setSelectedListenRecording(id);

        if (selectedTranscriptRecording !== id) {
            // Clear the transcript if it's not for the same recording
            setTranscript("");
        }
        axios.get(`http://192.168.29.172:4000/audio/${id}`, { responseType: 'arraybuffer' })
            .then((res) => {
                const blob = new Blob([res.data]);
                const audioUrl = URL.createObjectURL(blob);
                setSelectedRecording(audioUrl);
            })
            .catch((error) => {
                console.log(error);
            });

    };

    const GetTranscript = (id) => {
        if (selectedListenRecording === id) {
            axios.get(`http://192.168.29.172:4000/transcript/${id}`)
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

    return (
        <div className="pt-1" id='showDetails'>
            <div className="row m-0" >
                <div className="col-md-2 col-lg-2" id='filterData'>
                    <h4 className='text-white mt-4 text-center'>Filter</h4>

                    <div>
                        <li className='list-unstyled mb-1 fs-5'>
                            <Link to="#" onClick={handleSort} className='text-white'>
                                Duration
                                {sortingOrder === "asc" ? (
                                    <AiOutlineArrowUp />
                                ) : (
                                    <AiOutlineArrowDown />
                                )}
                            </Link>

                        </li>

                        <label htmlFor="" className='fs-5 text-white mb-1'>Duration Range</label>
                        <div class="mb-3 d-flex">
                            <select class="" aria-label="Default select example">
                                <option selected>Min</option>
                                <option value="1">1 Mins</option>
                                <option value="2">5 Mins</option>
                                <option value="3">10 Mins</option>
                                <option value="3">20 Mins</option>
                                <option value="3">Above</option>




                            </select>
                            <span className=' text-white mx-1'>To</span>
                            <select class="" aria-label="Default select example">
                                <option selected>Max</option>
                                <option value="1">1 Mins</option>
                                <option value="2">5 Mins</option>
                                <option value="3">10 Mins</option>
                                <option value="3">20 Mins</option>
                                <option value="3">Above</option>



                            </select>
                        </div>

                        <label htmlFor="" className='text-white fs-5'>Select Type</label>
                        <select className="w-100" onChange={handleFilterChange} value={selectedFilter} aria-label="Default select example">
                            <option value="">ALL</option> {/* Default: no filter */}
                            <option value="In">INC</option>
                            <option value="Out">OUT</option>
                        </select>
                    </div>


                </div>

                <div className="col-lg-9 col-md-9 pt-4">
                    <div className="search d-flex pb-2">
                        <input type="text" name='name' value={searchCriteria.name} onChange={HandleForm} className="form-control" id="name" placeholder="name" />
                        <input type="date" name='date' value={searchCriteria.date} onChange={HandleForm} className="form-control mx-2 " id="name" placeholder="choose date" />
                        <input type="text" name='queue' value={searchCriteria.queue} onChange={HandleForm} className="form-control" id="name" placeholder="queue" />
                        <input type="text" name='type' value={searchCriteria.type} onChange={HandleForm} className="form-control mx-2" id="name" placeholder="type" />
                        <button className='btn btn-warning mx-2' onClick={handleSearch}>Search</button>
                        <button type="button" className='btn btn-danger mx-2' onClick={handleReset}>Reset</button>
                    </div>

                    <div className="row">
                        <div className="col-md-12 ">
                            <div className="col-md-12 mb-3" id="boxStyling" style={{ border: '2px solid black', padding: '10px' }}>
                                {fetchData.length === 0 && searchData.length > 0 ? (
                                    <div className="text-center">
                                        <h5 className='text-white'>Data is not matched</h5>
                                    </div>
                                ) : (
                                    <>
                                        <table className="table table-striped text-center" style={{ borderRadius: '10px' }}>
                                            <thead>
                                                <tr className=''>
                                                    <th scope="col">Recording</th>
                                                    <th scope="col text-center">Type</th>
                                                    <th scope="col text-center">Duration</th>
                                                    <th scope="col text-center">Date</th>
                                                    <th scope="col text-center">Queue</th>
                                                    <th scope='col text-center'>Agent</th>
                                                </tr>
                                            </thead>
                                            <tbody className="">
                                                {fetchData.map((data, index) => (
                                                    <tr key={data.id}>
                                                        <td className='data1' key={index}>
                                                            <Link to="#" onClick={() => ListenRecording(data.id)} className="text-primary">
                                                                Listen
                                                            </Link>
                                                            ||
                                                            <Link to="#" onClick={() => GetTranscript(data.id)} className="text-primary">
                                                                Transcript
                                                            </Link>
                                                        </td>
                                                        <td className="text-center data1">{data.type}</td>
                                                        <td className="text-center data1">{data.duration}</td>
                                                        <td className="text-center data1">{data.date}</td>
                                                        <td className="text-center data1">{data.queue}</td>
                                                        <td className="text-center data1">{data.agent}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {selectedRecording != null && (
                                            <div id='audioPlayerbackground' className="col-md-12 col-12 col-lg-12 " style={{ border: '2px solid black', padding: '10px' }}>
                                                <div className='w-100 p-2'>
                                                    <AudioPlayer controls className="text-center w-100" src={selectedRecording} type="audio/mp3" />
                                                </div>
                                                <hr />
                                                <div className="transcript" style={{ overflowY: 'auto', maxHeight: selectedTranscriptRecording ? '90px' : 'auto', padding: "5px 10px" }}>
                                                    {transcript}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShowDetails;
