import { useState, useEffect } from "react";
import Modal from "../modal";
import useAxios from "../../../../../hooks/useAxios";
import { Table, Space, Tabs } from "antd";
import OwnerBookScheduled from '../../../../owner-book-scheduled';

const handleCategory = (id) => {
  if (id === 1) return "Sân 5";
  if (id === 2) return "Sân 7";
  if (id === 3) return "Sân 11";
};

const ManageField = ({ openNotification }) => {
  const [footballField, setFootballField] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsloading] = useState(false);

  const { api } = useAxios();

  useEffect(() => {
    getFootballFields();
  }, [currentPage]);

  const columns = [
    {
      title: "Tên sân bóng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (_, record) => {
        return (
          <p style={{ display: "flex", gap: "10px" }}>
            <div
              dangerouslySetInnerHTML={{
                __html: record.description.slice(0, 40),
              }}
            />
            .....
          </p>
        );
      },
    },
    {
      title: "Loại sân",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Giá (một giờ)",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Hình ảnh",
      key: "picture",
      render: (_, record) => (
        <Space size="middle">
          {record.picture[0] && (
            <img
              src={record.picture[0]}
              style={{ width: "90px", height: "90px" }}
            />
          )}
          {record.picture[1] && (
            <img
              src={record.picture[1]}
              style={{ width: "90px", height: "90px" }}
            />
          )}
          {record.picture[2] && (
            <img
              src={record.picture[2]}
              style={{ width: "90px", height: "90px" }}
            />
          )}
        </Space>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => {
        return (
          <Space size="middle">
            <Modal
              fieldId={record.id}
              getFootballFields={getFootballFields}
              openNotification={openNotification}
            />
          </Space>
        );
      },
    },
  ];

  const getFootballFields = async () => {
    setIsloading(true);
    try {
      const { data } = await api.get(
        `/owner/football-pitch/get-data?page=${currentPage}`
      );
      setLastPage(data.football_pitchs.last_page);
      setFootballField(
        data.football_pitchs.data.map((item) => {
          return {
            id: item.id,
            name: item.name,
            description: item.describe,
            category: handleCategory(item.id_category),
            price: item.price,
            picture: item.image.split(","),
            schedule: JSON.parse(item.detailed_schedule),
          };
        })
      );
    } catch (error) {
      setFootballField([]);
      console.log(error);
    }
    setIsloading(false);
  };

  const items = [
    {
      key: '1',
      label: 'Quản lý sân',
      children: (
        <Table
          columns={columns}
          dataSource={footballField}
          loading={isLoading}
          pagination={{
            current: currentPage,
            total: lastPage * 10,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false
          }}
        />
      )
    },
    {
      key: '2',
      label: 'Lịch đặt sân',
      children: <OwnerBookScheduled />
    }
  ];

  useEffect(() => {
    getFootballFields();
  }, [currentPage]);

  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default ManageField;