import React,{useCallback, useEffect,useState} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Checkbox, FormControlLabel } from "@mui/material";
import "../style/common.css"
import "../style/BandDetail.css"



function BandDetail() {
    const {id} = useParams();
    const [bandMembers,setBandMembers] = useState([]);
    const [selectedMembers,setSelectedMembers] = useState([]);
    const [events,setEvents] = useState([]);

    const ref = React.createRef();

    

    const fetchAvailability = useCallback((memberIDs) => {
        axios.post(`http://localhost:8000/api/bands/${id}/freetimes`,{
            member_ids: memberIDs
        }).then((res) =>{
            const availabilities = res.data.map(avail => ({
                start:avail.start_time,
                end:avail.end_time
            }))
            setEvents(availabilities)
        })
        .catch((err) => console.error("Error fetching availability:",err))
    },[id]);

    const getMembers = useCallback(() => {
        axios.get(`http://localhost:8000/api/bands/${id}/members`)
    .then((res) => {
        const members = res.data.map(member => ({
            id: member.id,
            name: member.name
        }))
        setBandMembers(members)
        const memberIDs = members.map(member => member.id);
        setSelectedMembers(memberIDs);
        fetchAvailability(memberIDs);
    })
    .catch((err) => console.error("Error fetch band members:",err));
    },[id,fetchAvailability]);
                                                                                                                                                                                                                                                                                                                                                              
    useEffect(() => {
        getMembers();
    },[getMembers]);


       

    // useEffect(() => {
    //     axios.get(`http://localhost:8000/api/bands/${id}/members`)
    //     .then((res) => {
    //         const members = res.data.map(member => ({
    //             id: member.id,
    //             name: member.name
    //         }))
    //         setBandMembers(members)
    //     })
    //     .catch((err) => console.error("Error fetch band members:",err));
    //     }
    // );




    

    useEffect(() => {
        if (selectedMembers.length > 0) {
            fetchAvailability(selectedMembers);
        }
    }, [selectedMembers,fetchAvailability]);

    const handleChange = (e,memberID) => {
        let updatedSelectedMembers;
        if (e.target.checked){
            updatedSelectedMembers = [...selectedMembers,memberID]
        }else{
            updatedSelectedMembers = selectedMembers.filter(id => id !== memberID)
        }
        setSelectedMembers(updatedSelectedMembers)
    }

    



    return(
        <div className="container">
            <Sidebar />
                <div className="groupdetail_container">
                <div className="members_container">
                    メンバー
                    {bandMembers.map((member,index) => {
                        return(
                            <li key={member.id}>
                                <FormControlLabel 
                                control={
                                <Checkbox defaultChecked 
                                onChange={(e) => handleChange(e,member.id)}/>} 
                                label={member.name} />
                            </li>
                        )
                    })}
                </div>
                <div className="bandcalendar_container">
                <FullCalendar
                    locale="ja" // 日本語
                    initialView="timeGridWeek"
                    slotDuration="00:30:00" // 表示する時間軸の最小値
                    selectable={true} 
                    allDaySlot={false} 
                    titleFormat={{
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    }} 
                    headerToolbar={{
                        start: "prev,next,today",
                        center: "title",
                        end: "timeGridWeek,dayGridMonth",
                    }}
                    businessHours={{
                        daysOfWeek: [1, 2, 3, 4, 5],
                        startTime: "0:00",
                        endTime: "24:00",
                    }}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    ref={ref}
                    weekends={true} // 週末表示
                    events={events} // 起動時に登録するイベント
                    />
                    </div>
                    </div>
        </div>
    )

}

export default BandDetail