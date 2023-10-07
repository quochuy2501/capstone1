import { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { setCookie } from "../../configs/cookie";
import { useNavigate } from "react-router-dom";

import "./style.css";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user, setUser } = useGlobalContext();
  const { api, setAccessToken } = useAxios();
  const navigate = useNavigate();

  const onFinish = async () => {
    try {
      const { data } = await api.post("/login", {
        email,
        password,
      });

      setUser({ ...user, role: "2" });
      setCookie("access_token", data.token);
      setAccessToken(data.token);
      navigate("/");
    } catch (error) {
      console.log(error.response.data.errors);
    }
  };
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/me");
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div className="login-form-wrapper">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="Email"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập email!",
            },
          ]}
        >
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu!",
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

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
          Or <Link to="/sign-up">register now!</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignInPage;
