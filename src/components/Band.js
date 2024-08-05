import Sidebar from './Sidebar';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import "../style/common.css";
import "../style/band.css";


function Band() {
    const [bands,setBand] = useState([]);
    const navigate = useNavigate();
    
    const getMybands = () => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/api/bands`).then((res) => {
            const bands = res.data.map(band => ({
                id: band.id,
                name: band.name
            }))
            setBand(bands)
        })
    }

    useEffect(() => {
        getMybands();
    },[]);

    const handleNavigate = (id) => {
        navigate(`/band/banddetail/${id}`);
    }

    return(
        <div className='container'>
            <Sidebar />
            <div className='main_container'>
                <h1 className='band_title'>グループ</h1>
                <div className='band_container'>
                    {bands.map((band,index) => {
                        return(
                            <Paper className='group_paper'
                            elevation={8}
                            square={false}
                            onClick={() => handleNavigate(band.id)}
                            >
                                <div className='group_name_id'>
                                {band.name}<br />(ID: {band.id})
                                </div>
                            
                            </Paper>
                        
                        )
                        })}
                </div>
            </div>
        </div>
    )
}

export default Band