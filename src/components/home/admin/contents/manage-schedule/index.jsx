import React from "react";
import events from "./events";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/dist/locale/vi";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const messages = {
  allDay: "Cả ngày",
  previous: "Trước",
  next: "Tiếp",
  today: "Hôm nay",
  month: "Tháng",
  week: "Tuần",
  day: "Ngày",
  agenda: "Lịch công việc",
  date: "Ngày",
  time: "Thời gian",
  event: "Sự kiện",
  showMore: (total) => `+ (${total}) xem thêm`,
};

const ManageSchedule = () => {
  return (
    <div style={{ height: 700 }}>
      <Calendar
        localizer={localizer}
        messages={messages}
        events={events}
        // step={60}
        // views={allViews}
        defaultDate={new Date(2015, 3, 1)}
        startAccessor="start"
        endAccessor="end"
        // popup={false}
        // onShowMore={(events) => this.setState({ showModal: true, events })}
        onSelectEvent={(event) => console.log(event)}
      />
    </div>
  );
};

export default ManageSchedule;
