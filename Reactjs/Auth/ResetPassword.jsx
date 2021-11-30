import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, withRouter } from "react-router-dom";
import { EyeInvisibleOutlined } from "@ant-design/icons";
import Notification from "@/Common/Notification";
import { Form, Input, Button, Typography } from "antd";
import { actionDispatch, resetPassword } from "@/actions/Creators";
import { HIDE_NOTIFICATION } from "@/actions/Types";
import { LOGIN_ROUTE } from "@/Constants/routeNames";
import { Messages } from "@/Constants/messages";
import SidePanel from "./SidePanel";
const { Title } = Typography;

const ResetPassword = ({ history }) => {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const token = query.get("token");

  const [form] = Form.useForm();

  const onSubmit = async () => {
    dispatch(resetPassword(form.getFieldsValue(), token));
  };
  useEffect(() => {
    if (!token) {
      history.push(LOGIN_ROUTE);
    }
  });
  const notification = useSelector((state) => state.commonReducer.notification);
  return (
    <SidePanel>
      <div className="login-form-wrapper">
        <Title level={3}>Set your new password</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={() => onSubmit()}
          className="cc-form-group"
          validateTrigger="onBlur"
        >
          <Form.Item
            label={<label>Password</label>}
            name="password"
            rules={[
              {
                required: true,
                message: Messages.PASSWORD_REQUIRED,
              },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                message: Messages.PASSWORD_VALIDATION_MESSAGE,
              },
            ]}
            required={false}
          >
            <Input.Password
              placeholder="Password"
              name="password"
              suffix={<EyeInvisibleOutlined />}
            />
          </Form.Item>
          <Form.Item
            label={<label>Confirm</label>}
            name="Confirm Password"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: Messages.CONFIRM_PASSWORD_REQUIRED,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    Messages.CONFIRM_PASSWORD_VALIDATION_MESSAGE
                  );
                },
              }),
            ]}
            required={false}
          >
            <Input.Password
              placeholder="Confirm Password"
              name="confrimpassword"
              suffix={<EyeInvisibleOutlined />}
            />
          </Form.Item>
          <Form.Item htmlType="submit">
            <Button className="form_button btn-login" block htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        {notification.open && notification.message ? (
          <Notification
            msg={notification.message}
            type={notification.type}
            clearMsg={() => {
              dispatch(actionDispatch(HIDE_NOTIFICATION));
            }}
          />
        ) : null}
      </div>
    </SidePanel>
  );
};

export default withRouter(ResetPassword);
