import { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import { useNavigate } from 'react-router-dom';

import './style.css';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [apiToast, contextHolder] = notification.useNotification();

  const openNotification = (message, description, type) => {
    apiToast[type]({
      message,
      description,
      placement: 'topRight'
    });
  };

  const navigate = useNavigate();
  const { api } = useAxios();

  const onFinish = async () => {
    try {
      await api.post('/register', {
        full_name: fullName,
        email,
        password,
        phone,
        re_password: confirmPassword
      });
      navigate('/sign-in');
    } catch (error) {
      console.log(error.response.data.message)
      if(error.response.data.message === 'Email already exist') {
        openNotification(
          'Đăng ký thất bại!',
          'Email này đã được sử dụng',
          'error'
        );
      }
    }
  };

  return (
    <>
      {contextHolder}
      <div className="signup-form-wrapper">
        <img
          src="https://makan.vn/wp-content/uploads/2022/11/logo-da-banh-vector-1.jpg"
          style={{ width: '200px', height: '150px', marginBottom: '40px' }}
        />

        <Form
          name="normal_login"
          className="signup-form"
          initialValues={{
            remember: true
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập Họ và tên!'
              }
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
                message: 'Vui lòng xác nhận mật khẩu!'
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
      </div>
    </>
  );
};

export default SignUpPage;
