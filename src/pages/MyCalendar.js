import React, { useState, useEffect, useRef } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import "../style/MyCalendar.css";
import "../style/common.css";
import Sidebar from '../components/Sidebar';
import ApiCalendar from "react-google-calendar-api";
import { Button } from '@mui/material';
import ModalComponent from '../components/ModalComponent';

const token = localStorage.getItem("token");

//リクエストのヘッダーにトークンを設定
axios.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${token}`;
  config.headers["Content-Type"] = "application/json";
  return config;
}, error => {
  return Promise.reject(error);
});

const config = {
  clientId: "563602060812-1vd4uvgueq3h8268bndlqeigljei587b.apps.googleusercontent.com",
  apiKey: "",
  scope: "https://www.googleapis.com/auth/calendar",
  discoveryDocs: [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
  ]
};

const apiCalendar = new ApiCalendar(config);

const MyCalendar = () => {
  //フォームが表示されているかどうか
  const [formInview, setFormInview] = useState(false);

  //イベントを追加する操作か変更する操作か
  const [isChange, setIsChange] = useState(false);

  //イベントの開始時刻と終了時刻
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
        end: event.end_time,
        classNames:["free_event"]
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

  

  const handleAuthClick = () => {
    apiCalendar.handleAuthClick()
      .then(() => {
        console.log("Signed in");
      })
      .catch((e) => {
        console.error("Error signing in", e);
      });
  };

  const getEvents = () => {
    apiCalendar.listCalendars()
    .then(({ result }) => {
        const calendarIds = result.items.map(calendar => calendar.id);

        const allEventsPromises = calendarIds.map(calendarId => {
            return apiCalendar.listUpcomingEvents(100,calendarId);
        });
        // すべてのカレンダーのイベント取得が完了するのを待つ
        return Promise.all(allEventsPromises);
    })
    .then(allEventsResults => {
        const allEvents = [];
        allEventsResults.forEach(({ result }) => {
            allEvents.push(...result.items); 
        });

        const fullCalendarEvents = convertGoogleEventsToFullCalendarEvents(allEvents);
      setEvents(prevEvents => [...prevEvents, ...fullCalendarEvents]);
    })
    .catch((e) => {
        console.error("Error fetching calendar lists or events", e);
    });
  };

  const convertGoogleEventsToFullCalendarEvents = (googleEvents) => {
    return googleEvents.map(event => ({
      id: event.id,
      title: event.summary,
      start: event.start.dateTime || event.start.date, // どちらかが存在
      end: event.end.dateTime || event.end.date,       // どちらかが存在
      url: event.htmlLink,
      extendedProps: {
        organizer: event.organizer.displayName || event.organizer.email,
        creator: event.creator.email,
      },
      classNames:["google_calendar_event"]
    }));
  };
  

  return (
    <div className="container">
      <Sidebar />
      <div className='calendar-container'>
        <div className='add_googlecalender'>
        <Button 
          variant="contained"
          onClick={handleAuthClick} 
          size="small">
            GoogleCalendarを反映
        </Button>
        <Button 
          variant="contained"
          onClick={getEvents}
          size="small">
            Get Events
        </Button>
        </div>
        
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
            end: "timeGridWeek,dayGridMonth",
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
        <ModalComponent
          isOpen={formInview}
          isChange={isChange}
          inputStart={inputStart}
          inputEnd={inputEnd}
          setInputStart={setInputStart}
          setInputEnd={setInputEnd}
          onAddEvent={onAddEvent}
          onChangeEvent={onChangeEvent}
          onDeleteEvent={onDeleteEvent}
          handleClose={() => setFormInview(false)}
        />
        
      </div>
    </div>
  );
};

export default MyCalendar;
