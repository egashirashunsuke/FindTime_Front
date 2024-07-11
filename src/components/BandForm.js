import axios from 'axios';
import Sidebar from './Sidebar';
import React, {useState} from 'react';
import "../style/common.css"
import "../style/BandForm.css"
import { Button, TextField } from '@mui/material';



function BandForm() {
    const [createValue, setCreateValues] = useState();
    const [joinValue, setJoinValues] = useState();

    const handleChange = (e) => {
        const {name, value} = e.target;
        if (name === "groupname"){
            setCreateValues(value)
        } else if (name === "groupid"){
            setJoinValues(value)
        }
    }

    const handleCreateSubmit = (e) => {
        axios.post("http://localhost:8000/api/bands",{
            name: createValue
        }).then((res) => {
            if (res.status === 200){
                window.alert("グループを作成しました")
            }
        })
    }

    const handleJoinSubmit = (e) => {
        axios.post("http://localhost:8000/api/bands/" + joinValue + "/members").then((res) => {
            if (res.status === 200){
                window.alert("グループに参加しました")
            }
        })
    }

    return(<div className='container'>
        <Sidebar />
        <div className='main_container'>
            <div className='bandform_container'>
                <div className='create_group_container'>
                    <h2 className='create_group_title'>グループを作成</h2>
                    <form className='bandform_form' onSubmit={handleCreateSubmit}>
                        <TextField className="groupForm" label="グループ名" name='groupname' onChange={(e) => handleChange(e)}/>
                        <Button  className="groupButton" varisant="contained" type='submit'>
                            グループを作成
                        </Button>
                    </form>
                </div>

                <hr/>

                <div className='join_group_container'>
                    <h2 className='join_group_title'>グループに参加</h2>
                    <form className="bandform_form" onSubmit={handleJoinSubmit}>
                        <TextField className="groupForm" label="グループID" type="text"  name='groupid' onChange={(e) => handleChange(e)}/>
                        <Button className="groupButton" variant="contained" type='submit'>
                            グループに参加
                        </Button>
                    </form>
                    </div>
                </div>
            </div>


    </div>)
}

export default BandForm