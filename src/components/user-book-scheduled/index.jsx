import { useState } from 'react';
import UserLayout from "../common/user-layout";
import { Badge, Calendar, Spin, Modal } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import "./index.css";

const UserBookScheduled = () => {
    const [schedule, setSchedule] = useState([]);
  const getListData = (value) => {
    let listData;

    const selectedSchedules = schedule.filter((val) => {
      const day = +val.date.split("-")[2];
      const month = +val.date.split("-")[1];
      const year = +val.date.split("-")[0];

      if (
        day === value.date() &&
        month === value.month() + 1 &&
        year === value.year()
      )
        return true;
    });

    listData = selectedSchedules.map((val) => ({
      type: "success",
      content: val.name_pitch,
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
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  return (
    <UserLayout>
      <div>
        <Modal footer={[]}>
          <h2
            style={{
              marginBottom: "20px",
              marginLeft: "4px",
              fontWeight: "normal",
            }}
          ></h2>
        </Modal>
        <div
          style={{
            width: "100%",
            height: "93.3vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
            position: "absolute",
            background: "white",
          }}
        >
          <Spin />
        </div>
        <div
          style={{ padding: "20px", background: "#ffffff", height: "93.3vh" }}
        >
          <Calendar cellRender={cellRender} mode="month" />
        </div>
      </div>
    </UserLayout>
  );
};

export default UserBookScheduled;
