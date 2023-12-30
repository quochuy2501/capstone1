import { useState, useEffect } from 'react';
import { Button, Modal, DatePicker, TimePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../../hooks/useAxios';
import dayjs from 'dayjs';
import { ArrowRightOutlined } from '@ant-design/icons';

const { RangePicker } = TimePicker;

const ModalBooking = ({ id, isModalOpen, handleCancel }) => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [date, setDate] = useState();
  const [selectedDay, setSelectedDay] = useState();

  const [errMsg, setErrMsg] = useState(null);
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeCanBookArr, setTimeCanBookArr] = useState([]);
  const [selectedTimeIdx, setSelectedTimeIdx] = useState(null);

  const { api } = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    if (date && isModalOpen) {
      (async () => {
        try {
          const { data } = await api.post('/get-schedule-pitch', {
            id,
            date
          });
          setStatus(data.status);
          if (data.list_scheduled.length) {
            const editedListScheduled = data.list_scheduled.map((val) => {
              return {
                time_start: val.time_start.slice(0, -3),
                time_end: val.time_end.slice(0, -3)
              };
            });
            const a = [];
            editedListScheduled.forEach((val, idx) => {
              if (data.list_scheduled.length === 1) {
                a.push({ start: data.time_start, end: val.time_start });
                a.push({ start: val.time_end, end: data.time_end });
                return;
              }
              if (data.list_scheduled.length === 2) {
                if (idx === 0) {
                  a.push({ start: data.time_start, end: val.time_start });
                  a.push({
                    start: val.time_end,
                    end: editedListScheduled[idx + 1].time_start
                  });
                }
                if (idx === 1) {
                  a.push({ start: val.time_end, end: data.time_end });
                }
                return;
              }

              if (idx === 0) {
                a.push({ start: data.time_start, end: val.time_start });
                return;
              }

              if (idx === data.list_scheduled.length - 1) {
                a.push({ start: val.time_end, end: data.time_end });
                return;
              }

              a.push({
                start: data.list_scheduled[idx - 1].time_end,
                end: val.time_start
              });
              a.push({
                start: val.time_end,
                end: data.list_scheduled[idx + 1].time_start
              });
            });

            setTimeCanBookArr(a.filter((time) => time.start !== time.end));
          } else {
            setTimeCanBookArr([{ start: data.time_start, end: data.time_end }]);
          }
          setSelectedTimeIdx(0);
        } catch (error) {
          console.log(error);
        }
        setIsLoading(false);
      })();
    }
  }, [date, isModalOpen]);

  const handleOk = async () => {
    try {
      await api.post('/set-schedule-pitch', {
        id,
        date,
        time_start: `${startTime}:00`,
        time_end: `${endTime}:00`
      });
      navigate('/confirm-payment');
    } catch (error) {
      if (error.response.data.error === 'Invalid time') {
        setErrMsg('Thời gian bắt đầu và kết thúc không hợp lệ!');
      }
    }
  };

  const onChange = (date) => {
    const dateArr = String(date?.$d).split(' ');
    if (date?.$d) {
      setDate(
        `${dateArr[0]} ${dateArr[1]} ${dateArr[2]} ${dateArr[4]} MST ${dateArr[3]}`
      );
      setSelectedDay(date.$D);
      setIsLoading(true);
    } else {
      setDate(null);
    }
  };

  const hanldeRangePickerChange = (time, timeString) => {
    const [startTime, endTime] = timeString;
    if (startTime === '' && endTime === '') {
      setStartTime(null);
      setEndTime(null);
      return;
    }

    const startHour = +startTime.split(':')[0];
    const startMin = startTime.split(':')[1];
    const endHour = endTime.split(':')[0];
    const endMin = endTime.split(':')[1];

    setStartTime(`${startHour < 10 ? '0' + startHour : startHour}:${startMin}`);
    setEndTime(`${endHour < 10 ? '0' + endHour : endHour}:${endMin}`);
    setErrMsg(null);
  };

  const currentDate = new Date();
  const currentHour = currentDate.getHours();

  const checkSelectedDateisToday = () => {
    const selectedDate = new Date(date);
    if (
      date &&
      selectedDay === currentDate.getDate() &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear()
    ) {
      return true;
    } else {
      return false;
    }
  };
  console.log(currentHour);
  return (
    <Modal
      title="Đặt sân bóng:"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Đặt sân"
      cancelText="Huỷ bỏ"
    >
      {isModalOpen && (
        <DatePicker
          onChange={onChange}
          placeholder="chọn ngày đặt"
          disabledDate={(current) => {
            return current && current < dayjs().startOf('day');
          }}
        />
      )}
      {date &&
        !isLoading &&
        (!status ? (
          <p style={{ marginTop: '10px' }}>Sân không có lịch vào ngày này!</p>
        ) : (
          <div>
            <h4>Chọn khung giờ:</h4>
            <div
              style={{
                margin: '10px 0',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px'
              }}
            >
              {timeCanBookArr.map((time, idx) => {
                return (
                  <>
                    <Button
                      disabled={
                        selectedDay === currentDate.getDate() &&
                        currentHour >= +time.end.split(':')[0]
                      }
                      key={idx}
                      onClick={() => {
                        setStartTime(null);
                        setEndTime(null);
                        setSelectedTimeIdx(idx);
                      }}
                      type={idx === selectedTimeIdx ? 'primary' : 'default'}
                    >
                      {time.start} <ArrowRightOutlined /> {time.end}
                    </Button>
                  </>
                );
              })}
            </div>
            {selectedTimeIdx !== null && (
              <>
                <RangePicker
                  format="H:mm"
                  hideDisabledOptions
                  onChange={hanldeRangePickerChange}
                  value={
                    startTime && endTime
                      ? [dayjs(startTime, 'HH:mm'), dayjs(endTime, 'HH:mm')]
                      : []
                  }
                  disabledTime={() => {
                    return {
                      disabledMinutes: () => {
                        return Array.from(
                          { length: 61 },
                          (_, index) => index
                        ).filter((val) => val !== 30 && val !== 0);
                      },
                      disabledHours: () =>
                        Array.from({ length: 24 }, (_, index) => index).filter(
                          (val) =>
                            val <
                              timeCanBookArr[selectedTimeIdx].start.split(
                                ':'
                              )[0] ||
                            val >
                              timeCanBookArr[selectedTimeIdx].end.split(
                                ':'
                              )[0] ||
                            (checkSelectedDateisToday() && val <= currentHour)
                        )
                    };
                  }}
                />
                <p
                  style={{
                    marginLeft: '2px',
                    marginTop: '2px',
                    color: 'red'
                  }}
                >
                  {errMsg}
                </p>
              </>
            )}
          </div>
        ))}
    </Modal>
  );
};

export default ModalBooking;
