import React,{useState,useEffect,useCallback} from 'react';
import { Modal,Form, Input, Select,message,DatePicker } from "antd";
import Layout from '../components/Layout/Layout';
import Spinner from '../components/Spinner';
import {UnorderedListOutlined,AreaChartOutlined,EditOutlined,DeleteOutlined} from '@ant-design/icons'
import axios from 'axios';
import { Table } from "antd";
import moment from 'moment';
import Analytics from '../components/Analytics';
import '../styles/HomePageStyles.css';
// import axiosInstance from '../utils/axiosInstance';



const { RangePicker } = DatePicker;


const HomePage =()=>{
  const [showModal, setShowModal] = useState(false);
  const[loading,setLoading]=useState(false);  
  const[allTransactions,setAllTransactions]=useState([]);
  const[frequency,setFrequency]=useState('7');
  const[selectedDate,setSelectedDate]=useState([]);
  const [type,setType]=useState('all');
  const [viewData,setViewData]=useState('table');
  const[editable,setEditable]=useState(null);


  //table data

  const columns = [{
    title: "Date",
    dataIndex:'date',
    render:(text)=><span>{moment(text).format('YYYY-MM-DD')}</span>
  },
  {
    title: "Amount",
    dataIndex:'amount'
  },
  {
    title: "Type",
    dataIndex:'type'
  },
  {
    title: "Category",
    dataIndex:'category'
  },
  {
    title: "Description",
    dataIndex:'description'
  },
  {
    title: "Actions",
    render:(text,record)=>(
      <div>
        <EditOutlined onClick={()=>{
          setEditable(record);
          setShowModal(true);
        }} />
        <DeleteOutlined className='mx-2' onClick={()=>{
          handleDelete(record);
        }}/>
      </div>
    )
  
  },
    
  ];

 
//fetch all transactions
const getAllTransactions = useCallback(async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('jwt_token');  // Get the JWT token from localStorage

    if (!token) {
      message.error('No token found, please log in again.');
      return;
    }

    setLoading(true);

    // Add the token to the Authorization header as a Bearer token
    const res = await axios.post('api/v1/transactions/get-transaction', {
      userid: user._id,
      frequency,
      selectedDate,
      type,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Send the token with the request
      },
    });

    setLoading(false);
    setAllTransactions(res.data);
    console.log(res.data);
  } catch (err) {
    setLoading(false);
    console.log(err);
    message.error('Failed to fetch transactions');
  }
}, [frequency, selectedDate, type]);  // dependencies for useCallback

// useEffect to trigger getAllTransactions when dependencies change
useEffect(() => {
  getAllTransactions();
}, [getAllTransactions]);  // Run whenever getAllTransactions changes





//delete handler
const handleDelete=async(record)=>{
  try{
    const token =localStorage.getItem('jwt_token');
    if(!token){
      message.error('No token found,please login again.');
      return;
    }

    setLoading(true);
    await axios.post('api/v1/transactions/del-transaction',{transactionId:record._id}
      ,{
        headers:{
          'Authorization':`Bearer ${token}`,
        }
      }
    );
    setLoading(false);
    message.success("Transaction deleted successfully");
    getAllTransactions(); // Refresh transactions after add/edit
  }
  
  catch(err){
    setLoading(false);
    console.log(err);
    message.error("Failed to delete transaction");
  }
}

  //form handling
  const handleSubmit = async(values)=>{
    try{
      const user=JSON.parse(localStorage.getItem('user'));

      const token=localStorage.getItem('jwt_token');

      if(!token){
        message.error('No token found, please log in again.');
      return;
      }

      if (!user || !user._id) {
        setLoading(false);
        message.error('User not found. Please log in again.');
        return;
      }
     
      setLoading(true);

      if (editable) {
        await axios.post("api/v1/transactions/edit-transaction", {
          payload: {
            ...values,
            userId: user._id,
          },
          transactionId: editable._id,
        },
      {
        headers:{
        'Authorization':`Bearer ${token}`,
      }

      });
        setLoading(false);
        message.success("Transaction Updated Successfully");
      } else {
        await axios.post("api/v1/transactions/add-transaction", {
          userid: user._id,
          ...values,
        },
        {
          headers:{
          'Authorization':`Bearer ${token}`,
        }
  
        });
        setLoading(false);
        message.success("Transaction Added Successfully");
      }
  

      setShowModal(false);
      setEditable(null);
      getAllTransactions(); // Refresh transactions after add/edit
    }
    catch(err){
      setLoading(false);
      message.error("Failed to add transaction");
      
    }

  }
  

  return (
    <Layout>
      {loading && <Spinner />}
     
      <div className="filters">
        <div className="filter-tab">
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(val) => setFrequency(val)}>
            <Select.Option value="7">Last 1 Week</Select.Option>
            <Select.Option value="30">Last 1 Month</Select.Option>
            <Select.Option value="365">Last 1 Year</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
          </Select>
          {frequency === "custom" && (
            <RangePicker value={selectedDate} onChange={(values) => setSelectedDate(values)} />
          )}
        </div>
        <div className="filter-tab">
          <h6>Select Type</h6>
          <Select value={type} onChange={(val) => setType(val)}>
            <Select.Option value="all">ALL</Select.Option>
            <Select.Option value="Income">INCOME</Select.Option>
            <Select.Option value="Expense">EXPENSE</Select.Option>
          </Select>
        </div>
        <div className="switch-icons">
          <UnorderedListOutlined
            className={`mx-2 ${viewData === "table" ? "active-icon" : "inactive-icon"}`}
            onClick={() => setViewData("table")}
          />
          <AreaChartOutlined
            className={`mx-2 ${viewData === "analytics" ? "active-icon" : "inactive-icon"}`}
            onClick={() => setViewData("analytics")}
          />
        </div>
        <div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Add New
          </button>
        </div>
      </div>

      <div className="content">
        {viewData === "table" ? (
          <Table columns={columns} dataSource={allTransactions} />
        ) : (
          <Analytics allTransactions={allTransactions} />
        )}
      </div>

      <Modal
        title={editable ? "Edit Transaction" : "Add Transaction"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={false}
      >
        <Form layout="vertical" onFinish={handleSubmit} initialValues={editable}>
          <Form.Item label="Amount" name="amount">
            <Input type="text" placeholder="Enter amount" required />
          </Form.Item>
          <Form.Item label="Type" name="type">
            <Select placeholder="Select type">
              <Select.Option value="Income">Income</Select.Option>
              <Select.Option value="Expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select placeholder="Select Category">
              <Select.Option value="Education">Education</Select.Option>
              <Select.Option value="Food">Food</Select.Option>
              <Select.Option value="Freelancing">Freelancing</Select.Option>
              <Select.Option value="Investments">Investments</Select.Option>
              <Select.Option value="Medical">Medical</Select.Option>
              <Select.Option value="Movie">Movie</Select.Option>
              <Select.Option value="Project">Project</Select.Option>
              <Select.Option value="Rent">Rent</Select.Option>
              <Select.Option value="Salary">Salary</Select.Option>
              <Select.Option value="Shopping">Shopping</Select.Option>
              <Select.Option value="Travel">Travel</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date">
            <Input type="date" required />
          </Form.Item>
          {/* <Form.Item label="Reference" name="reference">
            <Input type="text" required />
          </Form.Item> */}
          <Form.Item label="Description" name="description">
            <Input type="text" required />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary" type="submit">
              Save
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
);


}



export default HomePage;



// import React, { useState, useEffect, useCallback } from 'react';
// import { Modal, Form, Input, Select, message, DatePicker } from 'antd';
// import Layout from '../components/Layout/Layout';
// import Spinner from '../components/Spinner';
// import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
// import axios from 'axios';
// import { Table } from "antd";
// import moment from 'moment';
// import Analytics from '../components/Analytics';
// import '../styles/HomePageStyles.css';

// const { RangePicker } = DatePicker;

// const HomePage = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [allTransactions, setAllTransactions] = useState([]);
//   const [frequency, setFrequency] = useState('7');
//   const [selectedDate, setSelectedDate] = useState([]);
//   const [type, setType] = useState('all');
//   const [viewData, setViewData] = useState('table');
//   const [editable, setEditable] = useState(null);

//   // Table columns
//   const columns = [
//     {
//       title: "Date",
//       dataIndex: 'date',
//       render: (text) => <span>{moment(text).format('YYYY-MM-DD')}</span>
//     },
//     {
//       title: "Amount",
//       dataIndex: 'amount'
//     },
//     {
//       title: "Type",
//       dataIndex: 'type'
//     },
//     {
//       title: "Category",
//       dataIndex: 'category'
//     },
//     {
//       title: "Description",
//       dataIndex: 'description'
//     },
//     {
//       title: "Actions",
//       render: (text, record) => (
//         <div>
//           <EditOutlined onClick={() => {
//             setEditable(record);
//             setShowModal(true);
//           }} />
//           <DeleteOutlined className='mx-2' onClick={() => {
//             handleDelete(record);
//           }} />
//         </div>
//       )
//     },
//   ];

//   // Get all transactions
//   const getAllTransactions = useCallback(async () => {
//     try {
//       const token = localStorage.getItem('jwt'); // Retrieve token from localStorage
//       if (!token) {
//         message.error('User not logged in. Please log in again.');
//         return;
//       }

//       setLoading(true);
//       const res = await axios.post('api/v1/transactions/get-transaction', {
//         frequency,
//         selectedDate,
//         type,
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}` // Include JWT in Authorization header
//         }
//       });
//       setLoading(false);
//       setAllTransactions(res.data);
//     } catch (err) {
//       setLoading(false);
//       message.error('Failed to fetch transactions');
//     }
//   }, [frequency, selectedDate, type]);

//   useEffect(() => {
//     getAllTransactions();
//   }, [getAllTransactions]);

//   // Delete handler
//   const handleDelete = async (record) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('jwt');
//       await axios.post('api/v1/transactions/del-transaction', { transactionId: record._id }, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       setLoading(false);
//       message.success("Transaction deleted successfully");
//       getAllTransactions();
//     } catch (err) {
//       setLoading(false);
//       message.error("Failed to delete transaction");
//     }
//   };

//   // Form submit handler
//   const handleSubmit = async (values) => {
//     try {
//       const token = localStorage.getItem('jwt');
//       if (!token) {
//         setLoading(false);
//         message.error('User not logged in. Please log in again.');
//         return;
//       }

//       setLoading(true);
//       if (editable) {
//         await axios.post("api/v1/transactions/edit-transaction", {
//           payload: {
//             ...values,
//           },
//           transactionId: editable._id,
//         }, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         setLoading(false);
//         message.success("Transaction Updated Successfully");
//       } else {
//         await axios.post("api/v1/transactions/add-transaction", {
//           ...values,
//         }, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         setLoading(false);
//         message.success("Transaction Added Successfully");
//       }

//       setShowModal(false);
//       setEditable(null);
//       getAllTransactions();
//     } catch (err) {
//       setLoading(false);
//       message.error("Failed to add transaction");
//     }
//   };

//   return (
//     <Layout>
//       {loading && <Spinner />}
//       <div className="filters">
//         <div className="filter-tab">
//           <h6>Select Frequency</h6>
//           <Select value={frequency} onChange={(val) => setFrequency(val)}>
//             <Select.Option value="7">Last 1 Week</Select.Option>
//             <Select.Option value="30">Last 1 Month</Select.Option>
//             <Select.Option value="365">Last 1 Year</Select.Option>
//             <Select.Option value="custom">Custom</Select.Option>
//           </Select>
//           {frequency === "custom" && (
//             <RangePicker value={selectedDate} onChange={(values) => setSelectedDate(values)} />
//           )}
//         </div>
//         <div className="filter-tab">
//           <h6>Select Type</h6>
//           <Select value={type} onChange={(val) => setType(val)}>
//             <Select.Option value="all">ALL</Select.Option>
//             <Select.Option value="Income">INCOME</Select.Option>
//             <Select.Option value="Expense">EXPENSE</Select.Option>
//           </Select>
//         </div>
//         <div className="switch-icons">
//           <UnorderedListOutlined
//             className={`mx-2 ${viewData === "table" ? "active-icon" : "inactive-icon"}`}
//             onClick={() => setViewData("table")}
//           />
//           <AreaChartOutlined
//             className={`mx-2 ${viewData === "analytics" ? "active-icon" : "inactive-icon"}`}
//             onClick={() => setViewData("analytics")}
//           />
//         </div>
//         <div>
//           <button className="btn btn-primary" onClick={() => setShowModal(true)}>
//             Add New
//           </button>
//         </div>
//       </div>

//       <div className="content">
//         {viewData === "table" ? (
//           <Table columns={columns} dataSource={allTransactions} />
//         ) : (
//           <Analytics allTransactions={allTransactions} />
//         )}
//       </div>

//       <Modal
//         title={editable ? "Edit Transaction" : "Add Transaction"}
//         open={showModal}
//         onCancel={() => setShowModal(false)}
//         footer={false}
//       >
//         <Form layout="vertical" onFinish={handleSubmit} initialValues={editable}>
//           <Form.Item label="Amount" name="amount">
//             <Input type="text" placeholder="Enter amount" required />
//           </Form.Item>
//           <Form.Item label="Type" name="type">
//             <Select placeholder="Select type">
//               <Select.Option value="Income">Income</Select.Option>
//               <Select.Option value="Expense">Expense</Select.Option>
//             </Select>
//           </Form.Item>
//           <Form.Item label="Category" name="category">
//             <Select placeholder="Select Category">
//               <Select.Option value="Education">Education</Select.Option>
//               <Select.Option value="Food">Food</Select.Option>
//               <Select.Option value="Freelancing">Freelancing</Select.Option>
//               <Select.Option value="Investments">Investments</Select.Option>
//               <Select.Option value="Medical">Medical</Select.Option>
//               <Select.Option value="Movie">Movie</Select.Option>
//               <Select.Option value="Project">Project</Select.Option>
//               <Select.Option value="Rent">Rent</Select.Option>
//               <Select.Option value="Salary">Salary</Select.Option>
//               <Select.Option value="Shopping">Shopping</Select.Option>
//               <Select.Option value="Travel">Travel</Select.Option>
//               <Select.Option value="Other">Other</Select.Option>
//             </Select>
//           </Form.Item>
//           <Form.Item label="Date" name="date">
//             <Input type="date" required />
//           </Form.Item>
//           <Form.Item label="Description" name="description">
//             <Input type="text" required />
//           </Form.Item>
//           <div className="d-flex justify-content-end">
//             <button className="btn btn-primary" type="submit">
//               Save
//             </button>
//           </div>
//         </Form>
//       </Modal>
//     </Layout>
//   );
// };

// export default HomePage;
