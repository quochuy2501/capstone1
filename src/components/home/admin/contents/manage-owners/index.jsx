import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Table,
  Tag,
  Form,
  Input,
  Space,
  Popconfirm,
  Select,
  notification,
} from "antd";
import useAxios from "../../../../../hooks/useAxios";
import { useGlobalContext } from "../../../../../contexts/GlobalContext";

const ManageOwners = () => {
  const [user, setUser] = useState([]);
  const { districtsCxt } = useGlobalContext();

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassWord] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [filterStatusChange, setFilterStatusChange] = useState("");
  const [filterEmailChange, setFilterEmailChange] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [apiNotification, contextHolder] = notification.useNotification();

  const openNotification = (message, description, type) => {
    if (type === "success") {
      apiNotification.success({
        message,
        description,
        placement: "topRight",
        duration: 2,
      });
    }
    if (type === "error") {
      apiNotification.error({
        message,
        description,
        placement: "topRight",
        duration: 2,
      });
    }
  };

  useEffect(() => {
    getOwner(currentPage);
  }, [currentPage, filterStatusChange, filterEmailChange]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      await api.post("/admin/owner/create", {
        full_name: fullName,
        email,
        password,
        re_password: confirmPassword,
        id_role: 1,
      });
      setIsModalOpen(false);
      getOwner();
      openNotification("Thành công", "Tạo tài khoản thành công!", "success");
    } catch (error) {
      openNotification(
        "Thất bại",
        "Tạo tài khoản thất bại, vui lòng thử lại!",
        "error"
      );
      console.log(error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

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

  async function getOwner() {
    setIsloading(true);
    try {
      const { data } = await api.post(
        `/admin/owner/get-data?page=${currentPage}`,
        {
          email: filterEmailChange,
          is_block: filterStatusChange,
        }
      );
      console.log(data);
      const _data = data.owners.data.map((d) => {
        const districtName = districtsCxt.find(
          (district) => district.value === d.id_district
        )?.label;

        return {
          key: d.id,
          email: d.email,
          name: d.full_name,
          address: districtName && `${d.address}, ${districtName}, TP. Đà Nẵng`,
          phone: d.phone,
          tags: d.is_block === 0 ? ["Active"] : ["Unactive"],
        };
      });
      setUser(_data);
      setLastPage(data.owners.last_page);
    } catch (error) {
      if (
        error.response.data.error === "There are no accounts in the system!"
      ) {
        setUser([]);
      }
    }
    setIsloading(false);
  }

  async function updateStatus(id) {
    try {
      const { data } = await api.get(`/admin/owner/update-status/${id}`);
      console.log(data, "datra");
      getOwner();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {contextHolder}
      <div>
        <Button
          type="primary"
          style={{ marginBottom: "20px" }}
          onClick={showModal}
        >
          Tạo tài khoản
        </Button>
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
      <Modal
        title="Tạo tài khoản chủ sân bóng"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Tạo"
        cancelText="Hủy"
      >
        <Form
          name="normal_login"
          className="signup-form"
          initialValues={{
            remember: true
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
          style={{ marginTop: "10px" }}
        >
          <Form.Item
            name="username"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên chủ sân bóng!",
              },
            ]}
          >
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Họ và tên"
            />
          </Form.Item>
          <Form.Item
            name="email"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập email!'
              },
              {
                pattern:
                  "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
                message: 'Email không đúng định dạng!'
              }
            ]}
          >
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="phone"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập số điện thoại!'
              }
            ]}
          >
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              prefix={<PhoneOutlined className="site-form-item-icon" />}
              placeholder="Số điện thoại"
            />
          </Form.Item>
          <Form.Item
            name="password"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu!'
              },
              {
                pattern:
                  '^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})[a-zA-Z0-9!@#$%^&*]+$',
                message:
                  'Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt!'
              }
            ]}
          >
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Mật khẩu"
            />
          </Form.Item>
          <Form.Item
            name="confirm_password"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: "Vui lòng xác nhận lại mật khẩu",
              },
              {
                validator: (rule, value) => {
                  if (value === undefined) return Promise.resolve();
                  if (value === password) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Mật khẩu không khớp!');
                }
              }
            ]}
          >
            <Input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Xác nhận mật khẩu"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="signup-form-button"
            >
              Đăng ký
            </Button>
            Hoặc <Link to="/sign-in">đăng nhập ngay!</Link>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        columns={columns}
        dataSource={user}
        loading={isLoading}
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

export default SignUpPage;
