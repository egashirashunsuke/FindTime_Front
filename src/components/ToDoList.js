import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import "../style/ToDoList.css";
import "../style/common.css"
import Sidebar from './Sidebar';

const token = localStorage.getItem("token")

axios.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${token}`;
  config.headers["Content-Type"] = "application/json";
  return config;
}, error => {
  return Promise.reject(error);
})


class ToDoList extends Component {
    constructor(props) {
      super(props);
      this.state = {
        formInview: false,
        isChange: false,
        inputStart: new Date(),
        inputEnd: new Date(),
        formPosition: { top: 0, left: 0 }, // フォームの位置を管理
        events:[]
      };
      this.ref = React.createRef();
      this.selEventID = null;
      

    //  バインド　特定のコンテキストにおいて関数のthisの値を固定する．
    //   コールバックとうぃて使用されると，thisの値がよきしないものになる可能性がある．
      this.handleSelect = this.handleSelect.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.onAddEvent = this.onAddEvent.bind(this);
      // this.addEvent = this.addEvent.bind(this);
      this.changeDateToString = this.changeDateToString.bind(this);
      this.onChangeEvent = this.onChangeEvent.bind(this);
      // this.changeEvent = this.changeEvent.bind(this);
      this.onDeleteEvent = this.onDeleteEvent.bind(this);
      this.fetchEvents = this.fetchEvents.bind(this);
    }

    componentDidMount(){
      this.fetchEvents();
    }
  
    renderForm() {
        const { top, left } = this.state.formPosition;
        return (
          <div
            className={
              this.state.formInview ? "container__form inview" : "container__form"
            }
            style={{ 
                top: top, 
                left: left, 
                position: 'absolute', 
                backgroundColor: 'white', 
                zIndex: 1000, // 最前面に表示
                padding: '10px', // パディングを追加して内容を見やすく
                border: '1px solid #ccc', // 境界線を追加
                borderRadius: '5px' // 角を丸くする
              }}
          >
            <form>
              {this.state.isChange  ? (
                <div className="container__form__header">空き時間を変更</div>
              ) : (
                <div className="container__form__header">空き時間を追加</div>
              )}
              <div>{this.renderStartTime()}</div>
              <div>{this.renderEndTime()}</div>
              <div>{this.renderBtn()}</div>
            </form>
          </div>
        );
      }
    
  
      
      
      renderStartTime() {
        return (
          <React.Fragment>
            <p className="container__form__label">開始日時</p>
            <DatePicker
              className="container__form__datetime"
              locale="ja"
              dateFormat="yyyy/MM/d HH:mm"
              selected={this.state.inputStart}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={10}
              todayButton="today"
              onChange={(time) => {
                this.setState({ inputStart: time });
              }}
            />
          </React.Fragment>
        );
      }
      renderEndTime() {
        return (
          <React.Fragment>
            <p className="container__form__label">終了日時</p>
            <DatePicker
              className="container__form__datetime"
              locale="ja"
              dateFormat="yyyy/MM/d HH:mm"
              selected={this.state.inputEnd}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={10}
              todayButton="today"
              onChange={(time) => {
                this.setState({ inputEnd: time });
              }}
            />
          </React.Fragment>
        );
      }
      renderBtn() {
        return (
          <div>
            {!this.state.isChange ? (
              <div>
                <input
                  className="container__form__btn_cancel"
                  type="button"
                  value="キャンセル"
                  onClick={() => {
                    this.setState({ formInview: false });
                  }}
                />
                <input
                  className="container__form__btn_save"
                  type="button"
                  value="保存"
                  onClick={this.onAddEvent}
                />
              </div>
            ) : (
              <div>
                <input
                  className="container__form__btn_delete"
                  type="button"
                  value="削除"
                  onClick={this.onDeleteEvent}
                />
                <input
                  className="container__form__btn_save"
                  type="button"
                  value="変更"
                  onClick={this.onChangeEvent}
                />
              </div>
            )}
          </div>
        );
      }
    
    fetchEvents = () => {
      axios.get(`${process.env.REACT_APP_BASE_URL}/api/events`).then((res) =>{
        const events = res.data.map(event => ({
          id: event.id,
          start: event.start_time,
          end: event.end_time
        }))
        console.log("Fetched events:", events); // デバッグ用のログ
        this.setState({events})
      })
    }

    handleSelect = (selectInfo) => {
    let start = new Date(selectInfo.start);
    let end = new Date(selectInfo.end);
    start.setHours(start.getHours());
    end.setHours(end.getHours());

    const formPosition = {
        top: selectInfo.jsEvent.clientY, // マウスのY位置
        left: selectInfo.jsEvent.clientX, // マウスのX位置
      };

    this.setState({
        inputStart: start,
        inputEnd: end,
        isChange: false,
        formInview: true,
        formPosition: formPosition,
      });
    };

    
  
  handleClick = (info) => {
    this.selEventID = parseInt(info.event.id,10);
    // const selEvent = this.state.events[info.event.id];
    console.log("Clicked event ID:", this.selEventID); // デバッグ用のログ
    console.log("Fetched events:", this.state.events); // デバッグ用のログ
    const selEvent = this.state.events.find(event => event.id === this.selEventID);

    if (!selEvent) {
      console.error(`Event with ID ${this.selEventID} not found`);
      return; // selEvent が見つからなかった場合、処理を中止
  }

    const start = new Date(selEvent.start);
    const end = new Date(selEvent.end);
    const formPosition = {
        top: info.jsEvent.clientY, // マウスのY位置
        left: info.jsEvent.clientX, // マウスのX位置
      };

      this.setState({
        inputStart: start,
        inputEnd: end,
        isChange: true,
        formInview: true,
        formPosition: formPosition,
      });
  };

  
  onAddEvent() {
    const starttime = this.changeDateToString(this.state.inputStart);
    const endtime = this.changeDateToString(this.state.inputEnd);

    if (starttime >= endtime) {
      alert("開始時間と終了時間を確認してください。");
      return;
    }
    const event = {
      start_time: starttime,
      end_time: endtime,
    };

    axios.post(`${process.env.REACT_APP_BASE_URL}/api/events`,event).then((res) =>{
      if (res.status === 200){
        this.fetchEvents();
        this.setState({formInview:false});
        window.alert("設定しました")
      }
    })
    .catch(error => {
      console.error("Error",error);
    });

   
  }

  

  
  sortEventID = (a, b) => {
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  };
  getID = () => {
    this.myEvents.sort(this.sortEventID);
    let i;
    for (i = 0; i < this.myEvents.length; i++) {
      if (this.myEvents[i].id !== i) {
        break;
      }
    }
    return i;
  };

  
  changeDateToString(dt) {
    const year = dt.getFullYear();
    const month = this.getdoubleDigestNumer(dt.getMonth() + 1);
    const date = this.getdoubleDigestNumer(dt.getDate());
    const hour = this.getdoubleDigestNumer(dt.getHours());
    const minutes = this.getdoubleDigestNumer(dt.getMinutes());

    const retDate = `${year}-${month}-${date} ${hour}:${minutes}:00`;
    return retDate;
  }
  getdoubleDigestNumer(number) {
    return ("0" + number).slice(-2);
  }

  
  onChangeEvent(values) {
    if (window.confirm("変更しますか？")) {
      const starttime = this.changeDateToString(this.state.inputStart);
      const endtime = this.changeDateToString(this.state.inputEnd);

      if (starttime >= endtime) {
        alert("開始時間と終了時間を確認してください。");
        return;
      }

      const event = {
        start_time: starttime,
        end_time: endtime,
        id: this.selEventID,
      };

      if (this.selEventID !== null) {
        let EventID = this.selEventID;
        let delevent = this.ref.current.getApi().getEventById(EventID);
        if (delevent) {
          // delevent.remove();
          axios.put(`${process.env.REACT_APP_BASE_URL}/api/events/` + this.selEventID,event).then(() => {
        })
        }

      window.alert("イベントを変更しました。");
      this.setState({ formInview: false });
      this.fetchEvents();
      }

  }
}

  
  

  
    onDeleteEvent() {
      if (window.confirm("削除しますか？")) {
        if (this.selEventID !== null) {
          let EventID = this.selEventID;
          let delevent = this.ref.current.getApi().getEventById(EventID);
          if (delevent) {
            axios.delete(`${process.env.REACT_APP_BASE_URL}/api/events/` + this.selEventID).then(() => {
              window.alert("イベントを削除しました。");
              this.setState({ formInview: false });
              this.fetchEvents();
          })
          }

          

        }
      }
    }
  
    render() {
      return (
          <div className="container">
            <Sidebar />
            <div className='calendar-container'>
          <FullCalendar
            locale="ja" // 日本語
            initialView="timeGridWeek"
            slotDuration="00:30:00" // 表示する時間軸の最小値
            selectable={true} // 日付選択可能
            allDaySlot={false} // alldayの表示設定
            titleFormat={{
                year: "numeric",
                month: "short",
                day: "numeric",
            }} // タイトルに年月日を表示
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
            ref={this.ref}
            weekends={true} // 週末表示
            events={this.state.events} // 起動時に登録するイベント
            select={this.handleSelect} // カレンダー範囲選択時
            eventClick={this.handleClick} // イベントクリック時
            slotMinTime= "08:00:00"
            
            
            />
            {this.renderForm()}
            </div>
            
            
          </div>
      );
    }
  }
  
  export default ToDoList;