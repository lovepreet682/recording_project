import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa'
import { MdDeleteForever } from 'react-icons/md'
import { ToastContainer, toast } from 'react-toastify';


function GroCeryWordTable({ loading}) {
    const [show, setShow] = useState(false);
    const [suspiciousWord, setSuspiciousWord] = useState([]);
    const [suspiciousId, setSuspiciousId] = useState('');
    const [suspiciousUpdateId, setSuspiciousUpdateId] = useState('');
    const [suspiciousUpdateModal, setSuspiciousUpdateModal] = useState(false);
    const [RefreshTableDelete, setRefreshTableDelete] = useState(false);
    const [editGroceryWord, setEditGroceryWord] = useState('')
    


    // get Table
    useEffect(() => {
        axios.get('http://13.233.34.0:4000/groceryWord')
            .then((res) => {
                const response = res.data;
                setSuspiciousWord(response);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [RefreshTableDelete, loading]);

    const handleDeleteSuspiciousWord = (suspicios_word_Id) => {
        setShow(true);
        setSuspiciousId(suspicios_word_Id)
    }

    // Delete Data
    const handleDataDelete = () => {
        setShow(true)
        axios.delete(`http://13.233.34.0:4000/groceryWord/${suspiciousId}`).then((res) => {
            const deleteResponse = res.data;
            setSuspiciousWord(deleteResponse);
            toast.success(deleteResponse.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000
            });
            setShow(false)
            setRefreshTableDelete(!RefreshTableDelete)
            window.location.reload();
        }).catch((error) => {
            console.log(error);
        })
    }

    const handleClose = () => {
        setShow(false)
    }

    // Edit part

    const handleCloseEdit = () => {
        setSuspiciousUpdateModal(false)
    }

    const handleUpdateGroceryWord = (suspicios_word_Id, grocery_word) => {
        setSuspiciousUpdateModal(true)
        setSuspiciousUpdateId(suspicios_word_Id);
        setEditGroceryWord(grocery_word)
    }

    const handleEditButton = async () => {
        try {
            const response = await axios.put(`http://13.233.34.0:4000/groceryWord/${suspiciousUpdateId}`, { grocery_word: editGroceryWord });
            setSuspiciousWord(response.data);
            setSuspiciousUpdateModal(false)
            setRefreshTableDelete(!RefreshTableDelete)
            toast.success('Suspicious word updated successfully!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
        } catch (error) {
            console.error('Error updating suspicious word:', error);
            toast.error('Error updating suspicious word!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
        }
    };


    return (
        <>        
            <div className="container">
                <ToastContainer />
                <div className="container">
                    <table class="table text-center table-striped">
                        <thead>
                            <tr className='theading'>
                                <th scope="col">Sr No.</th>
                                <th scope="col">Suspicious Word</th>
                                <th scope="col">Operation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suspiciousWord.length !== 0 &&(
                                <>
                                    {Array.isArray(suspiciousWord) && suspiciousWord.map((item, index) => (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{item.grocery_word}</td>
                                            <td className='d-flex justify-content-center'>
                                                <div className='d-flex'>
                                                    <span className='operation_icons text-center'>
                                                        <div className='fs-4 mx-3'>
                                                            <FaEdit onClick={() => {
                                                                handleUpdateGroceryWord(item.suspicios_word_Id, item.grocery_word)
                                                            }} />
                                                        </div>
                                                    </span>
                                                    <span className='operation_icons text-center'>
                                                        <div className='fs-4'>
                                                            <MdDeleteForever onClick={() => { handleDeleteSuspiciousWord(item.suspicios_word_Id) }} />
                                                        </div>
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <>
                <Modal centered show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='' style={{ fontSize: "16px" }}>You want to Delete Suspicious Data </Modal.Body>
                    <Modal.Footer className='d-flex justify-content-center'>
                        <Button id='UserModuleBtn' onClick={handleDataDelete}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>

            {/* Modal Edit */}
            <Modal show={suspiciousUpdateModal} onHide={handleCloseEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label htmlFor="" style={{ fontWeight: "500" }}>Update Suspicious Word</label>
                        <input type="text" value={editGroceryWord} onChange={(e) => { setEditGroceryWord(e.target.value.toUpperCase()) }} style={{ border: '1px solid black' }} className='form-control' required />
                    </div>
                </Modal.Body>
                <Modal.Footer className='d-flex justify-content-center'>
                    <Button id='UserModuleBtn' onClick={handleEditButton}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default GroCeryWordTable