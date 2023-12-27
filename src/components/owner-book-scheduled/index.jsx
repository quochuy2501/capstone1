import { useState, useEffect } from 'react';
import UserLayout from '../common/user-layout';
import useAxios from '../../hooks/useAxios';
import { Badge, Calendar, Spin, Modal, Descriptions, Divider } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
dayjs.locale('vi');
import './index.css';

const currentDate = new Date();
const formattedDate = currentDate.toLocaleDateString('en-GB');
const currentDay = formattedDate.split('/')[0];
const currentMonth = formattedDate.split('/')[1];
const currentYear = formattedDate.split('/')[2];

const OwnerBookScheduled = () => {
  const [schedule, setSchedule] = useState([]);
  const [scheduleDetail, setScheduleDetail] = useState([]);
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [datesHaveEvent, setDatesHaveEvent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { api } = useAxios();

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const { data } = await api.post('/owner/get-schedule-in-month', {
          month: `${selectedMonth}/01/${selectedYear}`
        });
        setSchedule(data.schedule);
        setDatesHaveEvent([...new Set(data.schedule.map((val) => val.date))]);
      } catch (error) {
        console.log(error);
        setSchedule([]);
      }
      setIsLoading(false);
    })();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (isModalOpen) {
      getScheduleInDate();
    }
  }, [isModalOpen]);

  const getScheduleInDate = async () => {
    try {
      const { data } = await api.post('/owner/get-schedule-in-date', {
        date: `${selectedMonth}/${selectedDay}/${selectedYear}`
      });
      setScheduleDetail(data.schedule);
    } catch (error) {
      console.log(error);
    }
    setIsDetailLoading(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getListData = (value) => {
    let listData;

    const selectedSchedules = schedule.filter((val) => {
      const day = +val.date.split('-')[2];
      const month = +val.date.split('-')[1];
      const year = +val.date.split('-')[0];

      if (
        day === value.date() &&
        month === value.month() + 1 &&
        year === value.year()
      )
        return true;
    });

    listData = selectedSchedules.map((val) => ({
      type: 'success',
      content: val.name_pitch
    }));

    return listData || [];
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    return info.originNode;
  };

  const handleSelect = (value, { source }) => {
    const formattedMonth =
      value.$M + 1 < 10 ? '0' + (value.$M + 1) : value.$M + 1;
    const formattedDay = value.$D < 10 ? '0' + value.$D : value.$D;

    if (
      datesHaveEvent.includes(
        `${value.$y}-${formattedMonth}-${formattedDay}`
      ) &&
      source === 'date'
    ) {
      showModal();
      setIsDetailLoading(true);
    }
    setSelectedDay(value.$D);
    setSelectedMonth(value.$M + 1);
    setSelectedYear(value.$y);
  };

  const renderItemForDetailShedule = (item) => {
    return [
      {
        key: '1',
        label: 'Tên sân bóng',
        children: <p>{item.name_pitch}</p>
      },
      {
        key: '2',
        label: 'Địa chỉ',
        children: (
          <p>{`${item.address}, ${item.name_ward}, ${item.name_district}, TP. Đà Nẵng`}</p>
        )
      },
      {
        key: '3',
        label: 'Giờ bắt đầu',
        children: <p>{item.time_start.slice(0, -3)}</p>
      },
      {
        key: '4',
        label: 'Giờ kết thúc',
        children: <p>{item.time_end.slice(0, -3)}</p>
      }
    ];
  };

  return (
    <div>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
      >
        <h2
          style={{
            marginBottom: '20px',
            marginLeft: '4px',
            fontWeight: 'normal'
          }}
        >{`${selectedDay}/${selectedMonth}/${selectedYear}`}</h2>
        {isDetailLoading ? (
          <div
            style={{
              height: '100px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Spin />
          </div>
        ) : (
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {scheduleDetail.map((val, idx) => {
              return (
                <>
                  <Descriptions
                    items={renderItemForDetailShedule(val)}
                    column={2}
                  />
                  {idx !== scheduleDetail.length - 1 && (
                    <Divider style={{ margin: 0, marginBottom: '20px' }} />
                  )}
                </>
              );
            })}
          </div>
        )}
      </Modal>
      {isLoading && (
        <div
          style={{
            width: '100%',
            height: '77vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            position: 'absolute',
            background: 'white'
          }}
        >
          <Spin />
        </div>
      )}
      <div style={{ background: '#ffffff', height: '77vh' }}>
        <Calendar
          cellRender={cellRender}
          mode="month"
          onSelect={(value, source) => handleSelect(value, source)}
        />
      </div>
    </div>
  );
};

export default OwnerBookScheduled;