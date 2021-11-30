import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import _ from "lodash";
import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  Upload,
  Button,
  Table,
  Checkbox,
  Row,
  Col,
  Tooltip,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { triggerNotification } from "@/actions/Creators";
import { FIELD_TYPES } from "@/Constants/fieldTypes";

export default (props) => {
  const { isDisabled } = props;
  const [tableData, setTableData] = useState([{}]);
  const dispatch = useDispatch();
  const TableFieldsMapper = (columns) => {
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
  useEffect(() => {
    if (props.values && props.values.sku.length > 0) {
      let a = props.values.sku.map((d, i) => {
        return { ...d, id: i };
      });
      setTableData([...a]);
    } else {
      setTableData(tableData);
    }

    if (props.col_type == "table") {
      let obj = {};
      props.field_options.forEach((d) => {
        obj[d.key] = d.key;
      });
    }
    return () => {
      props.tableForm.resetFields();
    };
  }, []);

  const addRow = () => {
    let duplicateStateObject = tableData;
    let keys = Object.keys(tableData[0]);
    let obj = {};
    keys.forEach((d) => {
      obj[d] = "";
      obj.id = duplicateStateObject.length;
    });
    duplicateStateObject.push(obj);
    setTableData([...duplicateStateObject]);
  };

  const deleteRow = (text, row, index) => {
    if (tableData.length < 2) {
      dispatch(triggerNotification("error", "SKU details are required"));
      return;
    }
    //gathering existing field values
    let fieldValues = props.tableForm.getFieldsValue();
    let duplicateStateObject = tableData;
    //deleting the selected row
    duplicateStateObject = duplicateStateObject.filter((d, i) => {
      return i !== index;
    });
    //reseting the fields so it won't get messed by deleting the row
    props.tableForm.resetFields();
    setTableData([...duplicateStateObject]);
    //deleting the selcted row from Form values
    for (let prop in fieldValues) {
      delete fieldValues[`${prop.split("-")[0]}-${index}`];
    }
    //Rendering again the whole table form with proper unique key
    let obj = {};
    let maxRows;
    let columnsList = Object.keys(fieldValues).map((dt) => {
      maxRows = dt.split("-")[1];
      return `${dt.split("-")[0]}`;
    });
    columnsList = [...new Set(columnsList)];
    const dto = [...Array(parseInt(maxRows) + 1).keys()].map((_, index1) => {
      return columnsList.reduce((result, value, colIndex) => {
        if (index1 !== index) {
          result[value] = fieldValues[`${value}-${index1}`];
          return result;
        }
      }, {});
    });
    let filtered = dto.filter((el) => {
      return el != null;
    });

    filtered.map((d, i) => {
      Object.keys(d).map((dt, index2) => {
        obj[`${dt}-${i}`] = d[dt];
      });
    });
    props.tableForm.setFieldsValue({
      ...obj,
    });
  };
  switch (props.col_type) {
    case FIELD_TYPES.INPUT_STRING:
      return (
        <Form.Item
          label={props.col_name}
          name={props.field_key}
          rules={[
            {
              required: true,
              message: "Please provide this field",
            },
          ]}
        >
          <Input disabled={isDisabled} />
        </Form.Item>
      );
    case FIELD_TYPES.INPUT_NUMBER:
      return (
        <Form.Item label={props.col_name} name={props.field_key}>
          <InputNumber disabled={isDisabled} />
        </Form.Item>
      );
    case FIELD_TYPES.DROPDOWN:
      return (
        <Form.Item label={props.col_name} name={props.field_key}>
          <Select placeholder={props.col_name} disabled={isDisabled}>
            {props.field_options &&
              props.field_options.map((d) => {
                return (
                  <Select.Option key={d.key} value={d.key}>
                    {d.name}
                  </Select.Option>
                );
              })}
          </Select>
        </Form.Item>
      );
    case FIELD_TYPES.TOGGLE:
      return (
        <Form.Item label={props.col_name} name={props.field_key}>
          <Switch disabled={isDisabled} />
        </Form.Item>
      );
    case FIELD_TYPES.DATEPICKER:
      return (
        <Form.Item label={props.col_name} name={props.field_key}>
          <DatePicker disabled={isDisabled} placeholder="YYYY-MM-DD" />
        </Form.Item>
      );
    case FIELD_TYPES.RADIO_BUTTON:
      return (
        <Form.Item label={props.col_name} name={props.field_key}>
          <Radio.Group disabled={isDisabled}>
            <Radio value="horizontal">1</Radio>
            <Radio value="vertical">2</Radio>
          </Radio.Group>
        </Form.Item>
      );
    case FIELD_TYPES.CHECKBOX:
      return (
        <Form.Item label={props.col_name} name={props.field_key}>
          <Checkbox disabled={isDisabled} />
        </Form.Item>
      );
    case FIELD_TYPES.VENDOR_SELECTION:
      return (
        <Form.Item label={props.col_name} name={props.field_key}>
          <Select placeholder={props.col_name} disabled={isDisabled}></Select>
        </Form.Item>
      );
    case FIELD_TYPES.ATTACHMENT:
      return (
        <React.Fragment>
          <Row className="mt-2" gutter={24} align="top">
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <h6 className="sub-ht3">Attachments</h6>
              <Form.Item name={props.field_key}>
                <Upload {...props} disabled={isDisabled}>
                  <Button className="btn-upload">Browse</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </React.Fragment>
      );
    case FIELD_TYPES.TABLE:
      return (
        <Form form={props.tableForm}>
          <Table
            className="table-t2 table-form-inline"
            size="middle"
            columns={TableFieldsMapper(props.field_options)}
            dataSource={tableData}
            pagination={false}
          />
          {!isDisabled && (
            <Row className="mt-1 mb-t2" justify="end">
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Button className="btn-tertiary btn-clr-type3" onClick={addRow}>
                  <span className="btn-icon icon-add-new"></span> Add Row
                </Button>
              </Col>
            </Row>
          )}
        </Form>
      );
    default:
      return <></>;
  }
};
