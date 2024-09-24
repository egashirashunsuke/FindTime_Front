import Sidebar from '../components/Sidebar';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import "../style/common.css";
import "../style/band.css";
import { IconButton } from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';


function Band() {
    const [bands,setBand] = useState([]);
    const navigate = useNavigate();
    
    const getMybands = () => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/api/bands`).then((res) => {
            const bands = res.data.map(band => ({
                id: band.id,
                name: band.name,
                is_favorite: band.is_favorite
            }))
            setBand(bands)
        })
    }

    useEffect(() => {
        getMybands();
    },[]);

    const handleNavigate = (id) => {
        navigate(`/group/groupcalendar/${id}`);
    }

    const handleFavoriteClick = (event,id) => {
        axios.post(`${process.env.REACT_APP_BASE_URL}/api/bands/${id}/favorite`).then(() => {
            console.log("success")
            getMybands();
        })
    }

    const handleRemoveFavorite = (event,id) => {
        axios.delete(`${process.env.REACT_APP_BASE_URL}/api/bands/${id}/favorite`).then(() => {
            console.log("success")
            getMybands();
        })
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
                            key={band.id}
                            elevation={8}
                            square={false}
                            onClick={() => handleNavigate(band.id)}
                            >
                                <div className='IconSpace'>
                                    <IconButton 
                                    className='favoriteIcon'
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        
                                        if(band.is_favorite){
                                            handleRemoveFavorite(event,band.id);
                                        } else {
                                            handleFavoriteClick(event,band.id);
                                        }
                                    }}>
                                        {band.is_favorite ? (
                                            <PushPinIcon />
                                        ) : (
                                            <PushPinOutlinedIcon />
                                        )}
                                    </IconButton>
                                </div>
                                
                                <div className='group_name_id'>
                                {band.name}
                                </div>
                                <div className='band_id'>
                                (ID: {band.id})
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