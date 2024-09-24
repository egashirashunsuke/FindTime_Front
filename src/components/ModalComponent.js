// ModalComponent.jsx
import React from "react";
import { Modal, Box } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ja from "date-fns/locale/ja";

const ModalComponent = ({ 
  isOpen, 
  isChange, 
  inputStart, 
  inputEnd, 
  setInputStart, 
  setInputEnd, 
  onAddEvent, 
  onChangeEvent, 
  onDeleteEvent, 
  handleClose 
}) => {

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

  const renderButtons = () => (
    <div>
      {!isChange ? (
        <div>
          <input
            className="container__form__btn_cancel"
            type="button"
            value="キャンセル"
            onClick={handleClose}
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
    <Modal
      open={isOpen}
      onClose={handleClose}
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
          {renderStartTime()}
          {renderEndTime()}
          {renderButtons()}
        </div>
      </Box>
    </Modal>
  );
};

export default ModalComponent;
