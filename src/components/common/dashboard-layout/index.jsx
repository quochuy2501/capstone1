import { useState, useEffect } from 'react';
import {
  Layout,
  Menu,
  Space,
  Modal,
  Button,
  Form,
  Input,
  Select,
  Radio,
  notification
} from 'antd';
import { useGlobalContext } from '../../../contexts/GlobalContext';
import { forgetCookie } from '../../../configs/cookie';
import useAxios from '../../../hooks/useAxios';

const DashBoardLayout = ({ children, items, selectedKey, setSelectedKey }) => {
  const { user, setUser, setDistrictsCxt } = useGlobalContext();
  const { Header, Sider, Content } = Layout;
  const [open, setOpen] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState(user.email);
  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone);
  const [selectedDistrict, setSelectedDistrict] = useState(user.district);
  const [selectedWard, setSelectedWard] = useState(user.ward);
  const [address, setAddress] = useState(user.address);
  const [apiNotification, contextHolder] = notification.useNotification();

  const { api } = useAxios();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/get-districts');
        const _data = data.districts.map((d) => {
          return {
            value: d.id,
            label: d.name_district
          };
        });
        setDistricts(_data);
        setDistrictsCxt(_data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (selectedDistrict === '') return;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/get-wards/${selectedDistrict}`);
        const _wards = data.wards.map((d) => {
          return {
            value: d.id,
            label: d.name_ward
          };
        });
        setWards(_wards);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    })();
  }, [selectedDistrict]);

  useEffect(() => {
    if (user.role === '1' && user.address === '') {
      setOpen(true);
    }
  }, []);

  const handleLogout = () => {
    forgetCookie('access_token');
    setUser({ id: '', role: '', address: '' });
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    try {
      await api.post('/owner/update-my-information', {
        id: +user.id,
        full_name: fullName,
        email: email,
        phone: phone,
        id_district: selectedDistrict,
        id_ward: selectedWard,
        address: address
      });
      openNotification(
        'Thông báo',
        'Cập nhật thông tin thành công!',
        'success'
      );
      setUser({ ...user, address });
      setOpen(false);
    } catch (error) {
      if (
        error.response.data.errors.phone ||
        error.response.data.errors.id_district ||
        error.response.data.errors.id_ward ||
        error.response.data.errors.address
      ) {
        openNotification(
          'Thông báo',
          'Việc cập nhật thông tin cho lần đăng nhập đầu tiên là bắt buộc!',
          'error'
        );
      }
    }
  };

  const handleCancel = () => {
    console.log(user.address);
    if (user.role === '1' && user.address === '') {
      return;
    }
    setOpen(false);
  };

  const handleChangeWard = (value) => {
    setSelectedWard(value);
  };

  const openNotification = (message, description, type) => {
    if (type === 'success') {
      apiNotification.success({
        message,
        description,
        placement: 'topRight',
        duration: 2
      });
    }
    if (type === 'error') {
      apiNotification.error({
        message,
        description,
        placement: 'topRight',
        duration: 2
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title="Thông tin cá nhân"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={() => (
          <Button onClick={handleOk} type="primary">
            Cập nhật
          </Button>
        )}
      >
        <Form
          name="basic"
          autoComplete="off"
          layout="vertical"
          style={{ marginTop: '10px' }}
        >
          <Form.Item
            label="Email"
            name="email"
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
              defaultValue={email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Tên chủ sân bóng"
            name="username"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tên chủ sân bóng!'
              }
            ]}
          >
            <Input
              value={fullName}
              defaultValue={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập địa chỉ sân bóng!'
              }
            ]}
          >
            <Input
              defaultValue={address}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập số điện thoại!'
              }
            ]}
          >
            <Input
              defaultValue={phone}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Quận"
            name="district"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập quận!'
              }
            ]}
          >
            <Select
              value={selectedDistrict}
              defaultValue={selectedDistrict}
              onChange={(value) => setSelectedDistrict(value)}
              options={districts}
            />
          </Form.Item>

          {selectedDistrict && (
            <Form.Item
              label="Huyện"
              name="ward"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập huyện!'
                }
              ]}
            >
              <Radio.Group
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '7px'
                }}
                defaultValue={selectedWard}
              >
                {wards.map((ward) => {
                  return (
                    <div key={ward.value}>
                      <Radio
                        value={ward.value}
                        onClick={() => setSelectedWard(ward.value)}
                      >
                        {ward.label}
                      </Radio>
                    </div>
                  );
                })}
              </Radio.Group>
            </Form.Item>
          )}
        </Form>
      </Modal>
      <Layout style={{ height: '100vh' }}>
        <Sider breakpoint="xl" collapsedWidth={70}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectedKey}
            items={items}
            onClick={(e) => setSelectedKey([e.key])}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: 'white',
              display: 'flex',
              justifyContent: 'flex-end',
              paddingRight: '50px'
            }}
          >
            <Space size="middle">
              {user.role !== '2' && (
                <a role="button" onClick={showModal}>
                  Thông tin cá nhân
                </a>
              )}
              <a role="button" onClick={handleLogout}>
                Đăng xuất
              </a>
            </Space>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: 'white',
              overflow: 'scroll'
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default DashBoardLayout;
