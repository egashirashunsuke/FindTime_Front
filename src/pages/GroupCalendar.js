import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from '../components/Sidebar';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Checkbox, FormControlLabel, InputLabel } from "@mui/material";
import "../style/common.css";
import "../style/BandDetail.css";
import { Button } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

function BandDetail() {
  const { id } = useParams();
  const [bandMembers, setBandMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [events, setEvents] = useState([]);

  const ref = React.createRef();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [duration, setDuration] = useState(0);
  const duration_handleChange = (event) => {
    setDuration(event.target.value);
    // const value = event.target.value;
    // setDuration(Number(value));
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // メンバーの空き時間を取得する関数
  const fetchAvailability = (memberIDs, duration) => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/bands/${id}/freetimes`, {
        member_ids: memberIDs,
        min_duration: duration
      })
      .then((res) => {
        console.log(res.data);
        const availabilities = res.data.map((avail) => ({
          start: avail.start_time,
          end: avail.end_time,
        }));
        setEvents(availabilities);
      })
      .catch((err) => {
        console.error("Error fetching availability:", err);
        setEvents([]);
  });
  };

  // メンバー情報を取得する関数
  const getMembers = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/bands/${id}/members`)
      .then((res) => {
        const members = res.data.map((member) => ({
          id: member.id,
          name: member.name,
        }));
        setBandMembers(members);
        const memberIDs = members.map((member) => member.id);
        setSelectedMembers(memberIDs);
        fetchAvailability(memberIDs);
      })
      .catch((err) => console.error("Error fetching band members:", err));
  };

  useEffect(() => {
    getMembers();
    // eslint-disable-next-line
  }, []); // 初回マウント時にメンバーを取得

  useEffect(() => {
    if (selectedMembers.length > 0) {
      fetchAvailability(selectedMembers,duration);
    }
    // eslint-disable-next-line
  }, [selectedMembers,duration]); // メンバーが変更された時に空き時間を再取得

  const handleChange = (e, memberID) => {
    let updatedSelectedMembers;
    if (e.target.checked) {
      updatedSelectedMembers = [...selectedMembers, memberID];
    } else {
      updatedSelectedMembers = selectedMembers.filter((id) => id !== memberID);
    }
    setSelectedMembers(updatedSelectedMembers);
  };

  const leaveGroup = () => {
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/bands/${id}/leave`).then((res) => {
      if (res.status === 200) {
        window.alert("脱退しました");
      }
    });
  };

  return (
    <div className="container">
      <Sidebar />
      <div className="groupdetail_container">
        <div className="members_container">
          <Button
            variant="contained"
            id="basic-button"
            aria-controls={open ? `basic-menu` : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            Menu
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={leaveGroup}>グループを退会</MenuItem>
          </Menu>
          <Box sx={{ minWidth: 120 }}>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 80 }}>
              <InputLabel id="demo-simple-select-label">duration</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={duration}
                label="duration"
                onChange={duration_handleChange}
              >
                <MenuItem value={0}>間隔無し</MenuItem>
                <MenuItem value={60}>1時間以上</MenuItem>
                <MenuItem value={120}>2時間以上</MenuItem>
                <MenuItem value={180}>3時間以上</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <div>
            <h3 className="text_member">メンバー</h3>
          </div>

          {bandMembers.map((member, index) => {
            return (
              <li key={member.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      defaultChecked
                      onChange={(e) => handleChange(e, member.id)}
                    />
                  }
                  label={member.name}
                />
              </li>
            );
          })}
        </div>
        <div className="bandcalendar_container">
          <FullCalendar
            locale="ja" // 日本語
            initialView="dayGridMonth"
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
  );
}

export default BandDetail;
