import React from "react";
import { UserOutlined } from "@ant-design/icons";
import { Form, Input, Button, Typography } from "antd";
import { actionDispatch, forgotPassword } from "../../actions/Creators";
import { useDispatch, useSelector } from "react-redux";
import Notification from "../../Common/Notification";
import { HIDE_NOTIFICATION } from "../../actions/Types";
import SidePanel from "./SidePanel";
const { Title } = Typography;

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const onSubmit = async () => {
    dispatch(forgotPassword(form.getFieldsValue()));
  };
  const notification = useSelector((state) => state.commonReducer.notification);
  const loading = useSelector((state) => state.commonReducer.loader);
  return (
    <SidePanel>
      <div className="login-form-wrapper">
        <Title level={3}>Please provide your email address</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={() => onSubmit()}
          className="cc-form-group"
          validateTrigger="onBlur"
        >
          <Form.Item
            label={<label>Email</label>}
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
              },
              {
                type: "email",
                message: "Email is not valid.",
              },
            ]}
            required={false}
          >
            <Input
              placeholder="Enter Email"
              name="email"
              suffix={<UserOutlined />}
            />
          </Form.Item>
          <Form.Item htmlType="submit">
            <Button
              className="form_button btn-login"
              block
              htmlType="submit"
              loading={loading}
            >
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

export default ForgotPassword;
