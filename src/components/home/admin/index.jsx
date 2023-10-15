import { useState } from "react";
import DashBoardLayout from "../../common/dashboard-layout";
import { UserOutlined } from "@ant-design/icons";
import ManageUsers from "./contents/manage-users";
import ManageOwners from "./contents/manage-owners";
import ManageSchedule from "./contents/manage-schedule";

const Admin = () => {
  const [selectedKey, setSelectedKey] = useState(["0"]);
  const [items] = useState([
    {
      key: "0",
      icon: <UserOutlined />,
      label: "Quản lý chủ sân bóng",
    },
    {
      key: "1",
      icon: <UserOutlined />,
      label: "Quản lý người dùng",
    },
  ]);

  return (
    <DashBoardLayout
      selectedKey={selectedKey}
      setSelectedKey={setSelectedKey}
      items={items}
    >
      {selectedKey[0] === "0" && <ManageOwners />}
      {selectedKey[0] === "1" && <ManageUsers />}
      {/* {selectedKey[0] === "1" && <ManageSchedule />} */}
    </DashBoardLayout>
  );
};

export default Admin;