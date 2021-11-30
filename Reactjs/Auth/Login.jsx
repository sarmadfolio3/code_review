import React, { useState } from "react";
import { UserOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { Typography, Form, Input, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { actionDispatch, signIn } from "@/actions/Creators";
import Notification from "@/Common/Notification";
import SidePanel from "@/Components/Auth/SidePanel";
import { HIDE_NOTIFICATION } from "@/actions/Types";
import CONSTANTS from "@/Constants/constants";
import "./Login.scss";
import { FORGOT_PASSWORD_ROUTE } from "../../../Constants/routeNames";

const Login = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { Title } = Typography;
  const [form] = Form.useForm();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    dispatch(signIn(formData));
  };
  const notification = useSelector((state) => state.commonReducer.notification);
  const loading = useSelector((state) => state.commonReducer.loader);

  return (
    <SidePanel>
      <div className="login-form-wrapper">
        <Title level={2}>Welcome to TruPacta</Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          className="cc-form-group"
          validateTrigger="onBlur"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: CONSTANTS.MESSAGES.EMAIL_REQUIRED,
              },
              {
                type: "email",
                message: CONSTANTS.MESSAGES.EMAIL_INVALID,
              },
            ]}
            required={false}
          >
            <Input
              placeholder="Enter Email"
              name="email"
              onChange={(e) => onChange(e)}
              suffix={<UserOutlined />}
            />
          </Form.Item>
          <Form.Item
            label="Password"
            rules={[
              {
                required: true,
                message: CONSTANTS.MESSAGES.PASSWORD_REQUIRED,
              },
            ]}
            name="password"
            required={false}
          >
            <Input.Password
              placeholder="Enter password"
              name="password"
              onChange={(e) => onChange(e)}
              suffix={<EyeInvisibleOutlined />}
            />
          </Form.Item>
          <div className="align-right">
            <Link to={FORGOT_PASSWORD_ROUTE}>
              <Button type="link" className="lnk-forgot-password">
                Forgot Password?
              </Button>
            </Link>
          </div>
          {notification.open && notification.message ? (
            <Notification
              msg={notification.message}
              type={notification.type}
              clearMsg={() => {
                dispatch(actionDispatch(HIDE_NOTIFICATION));
              }}
            />
          ) : null}
          <Form.Item>
            <Button
              className="form_button btn-login"
              block
              htmlType="submit"
              loading={loading}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </SidePanel>
  );
};

export default Login;
