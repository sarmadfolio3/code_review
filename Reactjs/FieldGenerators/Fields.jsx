import React from "react";
import { Form, Input, InputNumber, Select } from "antd";

export default ({ columns, deleteRow }) => {
  let dataToReturn = [];
  dataToReturn.push({
    title: "#",
    dataIndex: "index",
    render: (index) => {
      return <span className="align-center d-block">{index + 1}</span>;
    },
  });
  // Mapping the columns and their data from field options coming from backend
  columns.map((d, index) => {
    dataToReturn.push({
      title: `${d.label.charAt(0).toUpperCase()}${d.label.slice(1)}`,
      dataIndex: d.key,
      render: (_, row, rowIndex) => {
        switch (d.type) {
          case FIELD_TYPES.INPUT_STRING:
            return (
              <Form.Item
                //passing keys and row index to identify the fields from which row it belongs
                key={`${d.key}-${rowIndex}`}
                name={`${d.key}-${rowIndex}`}
                rules={[
                  {
                    required: d.isRequired,
                    message: `Please provide ${d.label}`,
                  },
                ]}
              >
                <Input disabled={isDisabled} />
              </Form.Item>
            );
          case FIELD_TYPES.INPUT_NUMBER:
            return (
              <Form.Item
                key={`${d.key}-${rowIndex}`}
                name={`${d.key}-${rowIndex}`}
                rules={[
                  {
                    required: d.isRequired,
                    message: `Please provide ${d.label}`,
                  },
                ]}
              >
                <InputNumber
                  maxLength={d.maxLength}
                  addonBefore={d.prefixText}
                  disabled={isDisabled}
                />
              </Form.Item>
            );
          case FIELD_TYPES.DROPDOWN:
            return (
              <Form.Item
                key={`${d.key}-${rowIndex}`}
                name={`${d.key}-${rowIndex}`}
                rules={[
                  {
                    required: d.isRequired,
                    message: `Please provide ${d.label}`,
                  },
                ]}
              >
                <Select placeholder={d.label} disabled={isDisabled}></Select>
              </Form.Item>
            );
          default:
            return <></>;
        }
      },
    });
  });
  !isDisabled &&
    dataToReturn.push({
      title: " ",
      dataIndex: "actions",
      render: (text, row, index) => {
        return (
          <a className="clr-link" onClick={() => deleteRow(text, row, index)}>
            <Tooltip title="Delete">
              <DeleteOutlined
                className="btn-delete"
                style={{ cursor: "pointer" }}
              />
            </Tooltip>
          </a>
        );
      },
    });
  return dataToReturn;
};
