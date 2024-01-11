import React from 'react'
import './App.css';
import Login from './components/Login';
import Tab_navbar from './components/Tab_navbar';
import { Outlet, Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage';
import Recording from './components/Recording';
import SettingPage from './components/SettingPage';
import ShowDetails from './components/ShowDetails';
import GroceryWord from './components/Add_Word_CRUD/GroceryWord';
import ReportTable from './components/NotificationTask/ReportTable';



function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/navbar/' element={<Tab_navbar />} >
          <Route path='home' element={<Homepage />} />
          <Route path='glossary' element={<GroceryWord/>}/>
          <Route path='report' element={<ReportTable/>}/>
          <Route path='setting' element={<SettingPage />} />
          <Route path='network/' element={<Recording />} >
          </Route>
          
          <Route path='showDetails' element={<ShowDetails />} />
          

        </Route>
      </Routes >
    </>
  );
}

export default App;
