import { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import { useGlobalContext } from '../../contexts/GlobalContext';
import { setCookie } from '../../configs/cookie';
import { useNavigate } from 'react-router-dom';

import './style.css';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { getUser } = useGlobalContext();
  const [apiToast, contextHolder] = notification.useNotification();
  const { api, setAccessToken } = useAxios();
  const navigate = useNavigate();

  const openNotification = (message, description, type) => {
    apiToast[type]({
      message,
      description,
      placement: 'topRight'
    });
  };

  const onFinish = async () => {
    try {
      const { data } = await api.post('/login', {
        email,
        password
      });
      setCookie('access_token', data.token);
      setAccessToken(data.token);
      getUser(false);
      navigate('/');
      localStorage.setItem('login-success', 'true');
    } catch (error) {
      if (error.response.data.error === 'Email or password is not correct') {
        openNotification(
          'Đăng nhập thất bại!',
          'Sai email hoặc mật khẩu',
          'error'
        );
      }
      if (error.response.data.error === 'Your account has been locked') {
        openNotification(
          'Đăng nhập thất bại!',
          'Tài khoản của bạn đã bị khoá',
          'error'
        );
      }
    }
  };

  return (
    <>
      {contextHolder}
      <div className="login-form-wrapper">
        <img
          src="https://makan.vn/wp-content/uploads/2022/11/logo-da-banh-vector-1.jpg"
          style={{ width: '200px', height: '150px', marginBottom: '40px' }}
        />
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="Email"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập email!'
              }
            ]}
          >
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu!'
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

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Đăng nhập
            </Button>
            Hoặc <Link to="/sign-up">đăng ký ngay!</Link>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default SignInPage;
