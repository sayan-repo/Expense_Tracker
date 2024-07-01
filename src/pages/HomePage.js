import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Form, Input, Modal, Select, Table, message, DatePicker } from "antd";
import moment from "moment";
// import { set } from "mongoose";
import axios from "axios";
import LoadingScreen from "../components/LoadingScreen";
import Analytics from "../components/Analytics";
const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectdate] = useState([]);
  const [type, setType] = useState("all");
  const [viewData, setViewData] = useState("table");
  const [editable, setEditable] = useState(null);

  //table
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render : (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Reference",
      dataIndex: "reference",
    },
    {
      title: "Actions",
      render: (text,record) => (
        <div>
          <EditOutlined 
            onClick={() => {
              setEditable(record);
              setShowModal(true);
            }}
          />
          <DeleteOutlined className="mx-2" onClick={() => {handleDelete(record)}}/>
        </div>
      ),
    },
  ];

  //get transactions 

  //useEffect Hook
  useEffect(() => {
    const getAllTransaction = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setLoading(true);
        const res = await axios.post("/transaction/fetch-transaction", { 
          userid: user._id, 
          frequency, 
          selectedDate,
          type,
        });
        setLoading(false);
        setAllTransaction(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
        message.error("Issue with fetching Transaction");
      }
    };
    getAllTransaction();
  }, [frequency, selectedDate, type,]);

  //delete handling
  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post("/transaction/delete-transaction", {transactionId:record._id});
      setLoading(false);
      message.success("Deleted Transaction");
    } catch (error) {
      console.log(error);
      setLoading(false);
      message.error("unable to delete");
    }
  };

  //form handling
  const handleSubmit = async (value) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      if (editable) {
        await axios.post("/transaction/edit-transaction", { 
          payload:{
            ...value, 
            userid: user._id
          },
          transactionId: editable._id
        });
        setLoading(false);
        message.success("Transaction updated successfully");
      } else {
        await axios.post("/transaction/enter-transaction", { ...value, userid: user._id, });
        setLoading(false);
        message.success("Transaction added successfully");
      }
      setShowModal(false);
      setEditable(null);
    } catch (error) {
      setLoading(false);
      message.error("Transaction could'nt be added");
    }
  };

  return (
    <Layout>
      {loading && <LoadingScreen />}
      <div className="filters">
        <div>
          <h6>Filters</h6>
          <Select value={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value="1">Today</Select.Option>
            <Select.Option value="7">This week</Select.Option>
            <Select.Option value="30">This month</Select.Option>
            <Select.Option value="365">This year</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
          </Select>
          {frequency === "custom" && <RangePicker value={selectedDate} onChange={(values) => setSelectdate(values)} />}
        </div>
        <div>
          <h6>Type</h6>
          <Select value={type} onChange={(values) => setType(values)}>
            <Select.Option value="all">ALL</Select.Option>
            <Select.Option value="income">INCOME</Select.Option>
            <Select.Option value="expense">EXPENSE</Select.Option>
          </Select>
          {frequency === "custom" && <RangePicker value={selectedDate} onChange={(values) => setSelectdate(values)} />}
        </div>
        <div className="switch-icons">
            <UnorderedListOutlined className={`mx-2 ${viewData === "table" ? "active-icon" : "inactive-icon"}`} onClick={() => setViewData("table")} />
            <AreaChartOutlined className={`mx-2 ${viewData === "analytics" ? "active-icon" : "inactive-icon"}`} onClick={() => setViewData("analytics")} />
        </div>
        <div>          
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add New</button>
        </div> 
      </div>
      <div className="content">
        {viewData === "table" ?
        <Table columns={columns} dataSource={allTransaction} />
         : <Analytics allTransaction={allTransaction} />
         }
        
      </div>
      <Modal title={editable ? "Edit Transaction" : "Add Transaction"} open={showModal} onCancel={() => setShowModal(false)} footer={false}>
        <Form layout="vertical" onFinish={handleSubmit} initialValues={editable}>
          <Form.Item label="Amount" name="amount">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Type" name="type">
            <Select>
              <Select.Option value="income">INCOME</Select.Option>
              <Select.Option value="expense">EXPENSE</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="salary">SALARY</Select.Option>
              <Select.Option value="pocketmoney">POCKET MONEY</Select.Option>
              <Select.Option value="food">FOOD</Select.Option>
              <Select.Option value="movie">MOVIE</Select.Option>
              <Select.Option value="shopping">SHOPPING</Select.Option>
              <Select.Option value="medical">MEDICAL</Select.Option>
              <Select.Option value="recharge/bills">RECHARGE/BILLS</Select.Option>
              <Select.Option value="borrowed">BORROWED</Select.Option>
              <Select.Option value="fee">COLLEGE FEE</Select.Option>
              <Select.Option value="misc">MISCELLANEOUS</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Reference" name="reference">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input type="text" />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">{" "}Submit</button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;