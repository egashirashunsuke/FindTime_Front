import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";




class ToDoList extends Component {
    constructor(props) {
      super(props);
      this.state = {
        formInview: false,
        isChange: false,
        inputStart: new Date(),
        inputEnd: new Date(),
        formPosition: { top: 0, left: 0 }, // フォームの位置を管理
      };
      this.ref = React.createRef();
      this.myEvents = [
        {
          id: 0,
          start: "2020-05-22 10:00:00",
          end: "2020-05-22 11:00:00",
        },
        {
          id: 1,
          start: "2024-06-27 10:00:00",
          end: "2024-06-27 11:00:00",
        },
      ];
      
  
      this.selEventID = null;

    //  バインド　特定のコンテキストにおいて関数のthisの値を固定する．
    //   コールバックとうぃて使用されると，thisの値がよきしないものになる可能性がある．
      this.handleSelect = this.handleSelect.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.onAddEvent = this.onAddEvent.bind(this);
      this.addEvent = this.addEvent.bind(this);
      this.changeDateToString = this.changeDateToString.bind(this);
      this.onChangeEvent = this.onChangeEvent.bind(this);
      this.changeEvent = this.changeEvent.bind(this);
      this.onDeleteEvent = this.onDeleteEvent.bind(this);
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
    this.selEventID = info.event.id;
    const selEvent = this.myEvents[info.event.id];
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
      start: starttime,
      end: endtime,
    };
    if (this.addEvent(event) === true) {
      window.alert("設定しました");
      this.setState({ formInview: false });
    }
  }

  
  addEvent = (ev) => {
    ev.id = this.getID();
    this.myEvents.push(ev);
    this.ref.current.getApi().addEvent(ev);
    return true;
  };

  
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
        start: starttime,
        end: endtime,
        id: this.selEventID,
      };
      if (this.changeEvent(event) === true) {
        window.alert("イベントを変更しました。");
        this.setState({ formInview: false });
      }
    } else {
      return;
    }
  }

  
  changeEvent = (ev) => {
    this.myEvents[ev.id].start = ev.start;
    this.myEvents[ev.id].end = ev.end;

    this.ref.current.getApi().getEventById(ev.id).remove();
    this.ref.current.getApi().addEvent(this.myEvents[ev.id]);

    return true;
  };

  
    onDeleteEvent() {
      if (window.confirm("削除しますか？")) {
        if (this.selEventID !== null) {
          let EventID = this.selEventID;
          let delevent = this.ref.current.getApi().getEventById(EventID);
          if (delevent) {
            delevent.remove();
          }
  
          this.myEvents[EventID] = {
            id: EventID,
            start: "",
            end: "",
          };
          window.alert("イベントを削除しました。");
          this.setState({ formInview: false });
        }
      }
    }
  
    render() {
      return (
          <div className="container">
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
            events={this.myEvents} // 起動時に登録するイベント
            select={this.handleSelect} // カレンダー範囲選択時
            eventClick={this.handleClick} // イベントクリック時
            />
            {this.renderForm()}
            
          </div>
      );
    }
  }
  
  export default ToDoList;