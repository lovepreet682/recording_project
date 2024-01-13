import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import {FaFileExcel,FaFilePdf} from 'react-icons/fa'
import {FaFileCsv} from 'react-icons/fa6'
import * as XLSX from 'xlsx';

function DownloadFiles({ filteredTable}) {
    const [excelList, setExcelList] = useState([])

    const downloadPDF = () => {
        let listOfTable = '';
        if (filteredTable != null) {
            listOfTable = filteredTable;
        }
        else {
            listOfTable = null;
        }

        const pdfDownload = new jsPDF();
        const row = Object.keys(listOfTable[0]);
        const data = listOfTable.map(row => Object.values(row));

        pdfDownload.autoTable({
            head: [row],
            body: data,
        });

        pdfDownload.save('Downlaod.pdf')
    }

    // Download CSV File
    const downloadCSV = () => {
        let dataToDownload = '';

        if (filteredTable != null) {
            dataToDownload = filteredTable;
        } else {
            dataToDownload = null;
        }

        setExcelList(dataToDownload);
    }

    // Download Excel File
    const downloadExcel = () => {
        
        let dataToDownload = '';
        console.log(dataToDownload);

        if (filteredTable != null) {
            dataToDownload = filteredTable;
        } else {
            dataToDownload = null;
        }

        const ws = XLSX.utils.json_to_sheet(dataToDownload);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'Download.xlsx');
    };

    return (
        <>
            <div className="dropdown">
                <button className="btn btn-primary dropdown-toggle" id='ExportButton' type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    EXPORT
                </button>
                <ul className="dropdown-menu">
                    <li>
                        <span className="dropdown-item" onClick={downloadPDF}><FaFilePdf /><span className=''  style={{ marginLeft: "10px" }}>PDF</span></span>
                    </li>
                    <li><span className="dropdown-item" ><FaFileExcel /><span className='' onClick={downloadExcel} style={{ marginLeft: "10px" }}>EXCEL</span></span></li>
                    <li><CSVLink data={excelList} filename='downloadCSV'><span className="dropdown-item" onClick={downloadCSV}><FaFileCsv /><span className='' style={{ marginLeft: "10px" }}>CSV</span></span></CSVLink></li>
                </ul>
            </div>
        </>
    );
}

export default DownloadFiles;
