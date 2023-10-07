import { useState } from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import { useNavigate } from "react-router-dom";

import "./style.css";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const { api } = useAxios();

  const onFinish = async () => {
    try {
      await api.post("/register", {
        full_name: fullName,
        email,
        password,
        re_password: confirmPassword,
      });
      navigate("/sign-in");
    } catch (error) {
      console.log(error.response.data.errors);
    }
  };

  return (
    <div className="signup-form-wrapper">
      <Form
        name="normal_login"
        className="signup-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          validateTrigger="onBlur"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập Họ và tên!",
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
              message: "Vui lòng nhập email!",
            },
            {
              pattern:
                "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
              message: "Email không đúng định dạng!",
            },
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
          name="password"
          validateTrigger="onBlur"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu!",
            },
            {
              pattern:
                "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})[a-zA-Z0-9!@#$%^&*]+$",
              message:
                "Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt!",
            },
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
              message: "Vui lòng xác nhận mật khẩu!",
            },
            {
              validator: (rule, value) => {
                if (value === undefined) return Promise.resolve();
                if (value === password) {
                  return Promise.resolve();
                }
                return Promise.reject("Mật khẩu không khớp!");
              },
            },
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
            Sign up
          </Button>
          Or <Link to="/sign-in">Login now!</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignUpPage;
