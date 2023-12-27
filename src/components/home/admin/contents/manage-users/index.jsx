import { useEffect, useState } from "react";
import { Table, Tag, Input, Space, Popconfirm, Select } from "antd";
import useAxios from "../../../../../hooks/useAxios";

const ManageUsers = () => {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      dataIndex: "name",
      title: "Họ và tên",
      key: "name",
    },
    {
      title: "Trạng thái",
      key: "tags",
      dataIndex: "tags",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 7 ? "volcano" : "geekblue";
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (value) => (
        <Space size="middle">
          <Popconfirm
            title="Thay đổi trạng thái của người dùng?"
            description=""
            onConfirm={() => popupConfirm(value)}
            onCancel={popupCancel}
            okText="Có"
            cancelText="Không"
          >
            <a>Chỉnh sửa</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const { api } = useAxios();
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [filterStatusChange, setFilterStatusChange] = useState("");
  const [filterEmailChange, setFilterEmailChange] = useState("");

  const handlePageChange = (value) => {
    setCurrentPage(value);
  };

  const popupConfirm = (value) => {
    updateStatus(value.key);
  };

  const popupCancel = () => {};

  const handleFilterStatusChange = (value) => {
    setFilterStatusChange(value);
    setCurrentPage(1);
  };

  const handleFilterEmailChange = (e) => {
    setFilterEmailChange(e.target.value);
    setCurrentPage(1);
  };

  async function getOwner(currentPage) {
    try {
      const { data } = await api.post(
        `/admin/user/get-data?page=${currentPage}`,
        {
          email: filterEmailChange,
          is_block: filterStatusChange,
        }
      );

      const _data = data.users.data.map((d) => {
        return {
          key: d.id,
          email: d.email,
          name: d.full_name,
          tags: d.is_block === 0 ? ["Active"] : ["Unactive"],
        };
      });
      setUser(_data);
      setLastPage(data.users.last_page);
    } catch (error) {
      if (
        error.response.data.error === "There are no accounts in the system!"
      ) {
        setUser([]);
      }
    }
    setLoading(false);
  }

  async function updateStatus(id) {
    try {
      const { data } = await api.get(`/admin/user/update-status/${id}`);
      getOwner();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getOwner(currentPage);
  }, [currentPage, filterStatusChange, filterEmailChange]);

  return (
    <>
      <div>
        <span style={{ paddingLeft: "20px" }}>
          <p style={{ display: "inline", paddingRight: "3px" }}>Trạng thái: </p>
          <Select
            style={{
              width: 120,
            }}
            value={filterStatusChange}
            onChange={handleFilterStatusChange}
            options={[
              {
                value: "",
                label: "Tất cả",
              },
              {
                value: 0,
                label: "Active",
              },
              {
                value: 1,
                label: "Unactive",
              },
            ]}
          />
        </span>
        <span style={{ paddingLeft: "20px" }}>
          <p style={{ display: "inline", paddingRight: "3px" }}>Email: </p>
          <Input
            style={{
              width: 180,
            }}
            value={filterEmailChange}
            onChange={(e) => handleFilterEmailChange(e)}
          />
        </span>
      </div>
      <Table
        columns={columns}
        dataSource={user}
        style={{ marginTop: "20px" }}
        pagination={{
          current: currentPage,
          total: lastPage * 10,
          onChange: handlePageChange,
          showSizeChanger: false,
        }}
      />
    </>
  );
};

export default ManageUsers;