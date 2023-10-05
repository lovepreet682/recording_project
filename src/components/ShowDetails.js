import React, { useEffect, useState } from 'react';
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai'
import axios from 'axios';
import { Link } from 'react-router-dom';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

function ShowDetails() {
    const [fetchData, setFetchData] = useState([]);
    const [selectedRecording, setSelectedRecording] = useState(null);
    const [transcript, setTranscript] = useState("");



    const [searchData, setSearchData] = useState([]); // Initialize searchData with the original data
    const [searchCriteria, setSearchCriteria] = useState({
        name: ""
    });

    const HandleForm = (e) => {
        const { name, value } = e.target;
        setSearchCriteria({ ...searchCriteria, [name]: value });
    }

    // const handleSearch = () => {
    //     const filteredData = searchData.filter((data) => {
    //         return data.name && data.name.toLowerCase().includes(searchCriteria.name.toLowerCase());
    //     });
    //     setFetchData(filteredData); 
    // }    

    console.log(searchData);
    // console.log("Filtered Data:", filteredData);


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
        axios.get(`http://192.168.29.172:4000/transcript/${id}`)
            .then((res) => {
                setTranscript(res.data.transcript);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    return (
        <div className="pt-4" id='showDetails'>
            <div className="row">
                <div className="col-md-1 col-lg-1" id='filterData' style={{ borderRight: '2px solid black' }}>
                    <h4 className='text-white text-center'>Filter</h4>

                    <ul>
                        <div>
                            <li className='list-unstyled fs-4'><Link to=''><AiOutlineArrowUp /> <AiOutlineArrowDown /></Link></li>
                        </div>
                        <li className='list-unstyled fs-4'><Link to=''>Recent </Link></li>
                        <li className='list-unstyled fs-4'><Link to=''>Name</Link></li>
                    </ul>
                </div>

                <div className="col-lg-10 col-md-10" >

                    <div className="search d-flex pb-2">
                        <input type="text" name='name' value={searchCriteria.name} onChange={HandleForm} className="form-control" id="name" placeholder="name" />
                        <input type="date" name='date' value={searchCriteria.date} onChange={HandleForm} className="form-control mx-2 " id="name" placeholder="choose date" />
                        <input type="text" name='queue' value={searchCriteria.queue} onChange={HandleForm} className="form-control" id="name" placeholder="queue" />
                        <input type="text" name='type' value={searchCriteria.type} onChange={HandleForm} className="form-control mx-2" id="name" placeholder="type" />
                        <button className='btn btn-warning mx-2' onClick={handleSearch}>Search</button>
                        {/* <button type="submit" className='btn btn-danger mx-2' onClick={()=>SearchButton()}>Reset</button> */}


                    </div>


                    {/* Table  */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="col-md-12 mb-3" id="boxStyling" style={{ border: '2px solid black', padding: '10px' }}>
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
                            </div>
                        </div>
                    </div>

                    {/* Additional Content */}
                    <div className="row">
                        <div className="col-md-2 col-lg-2" id='filterData'>

                        </div>
                        <div id='audioPlayerbackground' className="col-md-12 col-12 col-lg-12 "
                            style={{ border: '2px solid black', padding: '10px' }}>
                            {selectedRecording ? (
                                <>
                                    <div className='w-100 p-2'>
                                        <AudioPlayer controls className="text-center w-100" src={selectedRecording} type="audio/mp3" />
                                    </div>
                                    <hr />

                                    <div className="transcript">
                                        {transcript}
                                    </div>

                                </>

                            ) : (
                                <div>
                                    <h5>Click on the "Listen" link to play a recording</h5>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>





    );
}

export default ShowDetails;
