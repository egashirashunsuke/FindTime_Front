import React, { useState, useEffect, useRef } from 'react';
import DatePicker from "react-datepicker";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import "../style/ToDoList.css";
import "../style/common.css";
import Sidebar from './Sidebar';
import { Modal } from '@mui/material';
import { Box } from '@mui/material';
import ja from 'date-fns/locale/ja'

const token = localStorage.getItem("token");

axios.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${token}`;
  config.headers["Content-Type"] = "application/json";
  return config;
}, error => {
  return Promise.reject(error);
});

const ToDoList = () => {
  //フォームが表示されているかどうか
  const [formInview, setFormInview] = useState(false);

  //イベントを追加する操作か変更する操作か
  const [isChange, setIsChange] = useState(false);

  //イベントの開始時刻と終了時刻を管理
  const [inputStart, setInputStart] = useState(new Date());
  const [inputEnd, setInputEnd] = useState(new Date());

  const [events, setEvents] = useState([]);
  const [selectedEventID, setSelectedEventID] = useState(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/events`);
      const eventsData = res.data.map(event => ({
        id: event.id,
        start: event.start_time,
        end: event.end_time
      }));
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleSelect = (selectInfo) => {
    const start = new Date(selectInfo.start);
    const end = new Date(selectInfo.end);

    setInputStart(start);
    setInputEnd(end);
    setIsChange(false);
    setFormInview(true);
  };

  const handleClick = (info) => {
    const eventID = parseInt(info.event.id, 10);
    setSelectedEventID(eventID);

    const selEvent = events.find(event => event.id === eventID);
    if (!selEvent) {
      console.error(`Event with ID ${eventID} not found`);
      return;
    }

    const start = new Date(selEvent.start);
    const end = new Date(selEvent.end);

    setInputStart(start);
    setInputEnd(end);
    setIsChange(true);
    setFormInview(true);
  };

  const onAddEvent = async () => {
    const starttime = changeDateToString(inputStart);
    const endtime = changeDateToString(inputEnd);

    if (starttime >= endtime) {
      alert("開始時間と終了時間を確認してください。");
      return;
    }

    const event = {
      start_time: starttime,
      end_time: endtime,
    };

    try {
      const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/events`, event);
      if (res.status === 200) {
        fetchEvents();
        setFormInview(false);
        window.alert("設定しました");
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const onChangeEvent = async () => {
    if (window.confirm("変更しますか？")) {
      const starttime = changeDateToString(inputStart);
      const endtime = changeDateToString(inputEnd);

      if (starttime >= endtime) {
        alert("開始時間と終了時間を確認してください。");
        return;
      }

      const event = {
        start_time: starttime,
        end_time: endtime,
        id: selectedEventID,
      };

      try {
        await axios.put(`${process.env.REACT_APP_BASE_URL}/api/events/` + selectedEventID, event);
        window.alert("イベントを変更しました。");
        setFormInview(false);
        fetchEvents();
      } catch (error) {
        console.error("Error updating event", error);
      }
    }
  };

  const onDeleteEvent = async () => {
    if (window.confirm("削除しますか？")) {
      try {
        await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/events/` + selectedEventID);
        window.alert("イベントを削除しました。");
        setFormInview(false);
        fetchEvents();
      } catch (error) {
        console.error("Error deleting event", error);
      }
    }
  };

  const changeDateToString = (dt) => {
    const year = dt.getFullYear();
    const month = getDoubleDigitNumber(dt.getMonth() + 1);
    const date = getDoubleDigitNumber(dt.getDate());
    const hour = getDoubleDigitNumber(dt.getHours());
    const minutes = getDoubleDigitNumber(dt.getMinutes());

    return `${year}-${month}-${date} ${hour}:${minutes}:00`;
  };

  const getDoubleDigitNumber = (number) => {
    return ("0" + number).slice(-2);
  };

  const renderModal = () => (
    <Modal
      open={formInview}
      onClose={() => setFormInview(false)}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      style={{ zIndex: 1300 }} 
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '60%',
        transform: 'translate(-50%, -50%)',
        width: 220,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        zIndex: 1300
      }}>
        <div>
          {isChange ? (
            <div className="container__form__header">空き時間を変更</div>
          ) : (
            <div className="container__form__header">空き時間を追加</div>
          )}
          <div>{renderStartTime()}</div>
          <div>{renderEndTime()}</div>
          <div>{renderBtn()}</div>
        </div>
      </Box>
    </Modal>
  );

  const renderStartTime = () => (
    <>
      <p className="container__form__label">開始日時</p>
      <DatePicker
        className="container__form__datetime"
        locale={ja}
        dateFormat="yyyy/MM/d HH:mm"
        selected={inputStart}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={10}
        todayButton="today"
        onChange={(time) => setInputStart(time)}
      />
    </>
  );

  const renderEndTime = () => (
    <>
      <p className="container__form__label">終了日時</p>
      <DatePicker
        className="container__form__datetime"
        locale={ja}
        dateFormat="yyyy/MM/d HH:mm"
        selected={inputEnd}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={10}
        todayButton="today"
        onChange={(time) => setInputEnd(time)}
      />
    </>
  );

  const renderBtn = () => (
    <div>
      {!isChange ? (
        <div>
          <input
            className="container__form__btn_cancel"
            type="button"
            value="キャンセル"
            onClick={() => setFormInview(false)}
          />
          <input
            className="container__form__btn_save"
            type="button"
            value="保存"
            onClick={onAddEvent}
          />
        </div>
      ) : (
        <div>
          <input
            className="container__form__btn_delete"
            type="button"
            value="削除"
            onClick={onDeleteEvent}
          />
          <input
            className="container__form__btn_save"
            type="button"
            value="変更"
            onClick={onChangeEvent}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="container">
      <Sidebar />
      <div className='calendar-container'>
        <FullCalendar
          locale="ja"
          initialView="timeGridWeek"
          slotDuration="00:30:00"
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
            end: "timeGridWeek",
          }}
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: "0:00",
            endTime: "24:00",
          }}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          ref={calendarRef}
          weekends={true}
          events={events}
          select={handleSelect}
          eventClick={handleClick}
          slotMinTime="08:00:00"
        />
        {renderModal()}
      </div>
    </div>
  );
};

export default ToDoList;
