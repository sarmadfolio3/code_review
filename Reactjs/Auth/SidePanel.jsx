import React from "react";
import Login_logo from "../../assets/images/bg-login-splash.png";
import AppLogo from "../../assets/images/app-logo-white.png";
import { Row, Col, Typography, Image } from "antd";
 
const SidePanel = ({ children }) => {
  const { Title } = Typography;
  return (
    <div className="login-wrapper fade-in">
      <div className="login-wrapper-inner">
        <div className="login-block ">
          <Row align="middle" className="p-height-100">
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={12}
              className="bg-brand-clr"
            >
              <div className="login-brand">
                <div className="app-logo">
                  <Image src={AppLogo} alt="Smart Contract" preview={false} />
                </div>
                <Image
                  src={Login_logo}
                  alt="Smart Contract"
                  preview={false}
                  className="bg-splash"
                />
                <Title level={1}>
                  Take Control of your Contract Commercials
                </Title>
              </div>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={12}
              className="bg-form-box-clr"
            >
              {children}
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
