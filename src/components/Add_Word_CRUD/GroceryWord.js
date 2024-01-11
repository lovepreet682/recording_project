import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GroCeryWordTable from './GroCeryWordTable';

function GroceryWord() {
  const [groceryWord, setGroceryWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLength, setLengthData] = useState(0);
  const [deleteNumber, setDeleteNumber] = useState(false)


  // Fetch data length from the server
  useEffect(() => {
    axios.get('http://13.233.34.0:4000/groceryWord')
      .then((res) => {
        const response = res.data;
        setLengthData(response.length);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [deleteNumber]);


  const handleSubmitGroceryWord = async (e) => {
    e.preventDefault();
    console.log("Submitting...........");

    try {
      await axios.post('http://13.233.34.0:4000/groceryWord', { grocery_word: groceryWord }).then((res) => {
        const response = res.data;
        setGroceryWord(response);
        setLengthData(dataLength + 1);
        toast.success(response.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000
        });
        setLoading(!loading)
      })
      setGroceryWord('')
    } catch (error) {
      if (error) {
        console.error('Error response from server:', error.response.data);
        toast.error(error.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        })
      } else if (error.request) {
        console.error('No response received:', error.request);
        toast.error('No response received!', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });

      } else {
        console.error('Error setting up the request:', error.message);
        toast.error('Error setting up the request!', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
      }
    }
  }

  const handleGroceryWord = (e) => {
    const { value } = e.target;
    const upperCase=value.toUpperCase();
    setGroceryWord(upperCase)
  }
  return (
    <>
      <ToastContainer />
      <div id="groceryWord">
        <form onSubmit={handleSubmitGroceryWord}>
          <div className="row">
            <h4 className='text-center my-3'>Add Word</h4>
            <div className="col-md-6 m-auto">
              <input name='grocery_word' value={groceryWord} onChange={handleGroceryWord} type="text" className='form-control' placeholder='Enter Word' required />
            </div>
            <div className='d-flex justify-content-center my-3'>
              <button className='btn btn-primary' type='submit' disabled={dataLength > 0}>Submit</button>
            </div>
          </div>
        </form>

        <GroCeryWordTable loading={loading} deleteNumber={deleteNumber}/>
      </div>
    </>
  )
}

export default GroceryWord