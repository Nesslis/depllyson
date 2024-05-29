import React, { useState, useEffect } from 'react';
import { Table, Pagination, Spin, Button, Modal, Form, Input, Upload, Select, Row } from 'antd';
import { EditOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import CreateClinic from '../components/createClinic.tsx';
import axios from 'axios';
import '../superAdmin.css';

const { Option } = Select;
interface Country {
  id: number;
  name: string;
}
interface City {
  id: number;
  name: string;
}
interface Region {
  id: number;
  name: string;
}

const ClinicsTable: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [clinics, setClinics] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingClinic, setEditingClinic] = useState<any>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const pageSize = 15;
  

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    setIsModalVisible(false);
    fetchClinics(currentPage);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    fetchClinics(currentPage);
  };
  const handleEditCancel = () => {
    setEditModalVisible(false);
    setEditingClinic(null);
    fetchClinics(currentPage);
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://healthcareintourism-test.azurewebsites.net/api/Location/GetAllCountries');
        setCountries(response.data.items);
      } catch (error) {
        console.error('Error fetching the cities:', error);
      }
    };
  const fetchCities = async () => {
      try {
        const response = await axios.get('https://healthcareintourism-test.azurewebsites.net/api/Location/GetAllCities');
        setCities(response.data.items);
      } catch (error) {
        console.error('Error fetching the cities:', error);
      }
    };

    const fetchRegions = async () => {
      try {
        const response = await axios.get('https://healthcareintourism-test.azurewebsites.net/api/Location/GetAllRegions');
        setRegions(response.data.items);
      } catch (error) {
        console.error('Error fetching the cities:', error);
      }
    };

    fetchCountries();
    fetchCities();
    fetchRegions();
    fetchClinics(currentPage);
  }, [currentPage]);

  const fetchClinics = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get('https://healthcareintourism-test.azurewebsites.net/api/Clinic/GetAllClinics', {
        params: {
          SkipCount: (page - 1) * pageSize,
          MaxResultCount: pageSize,
        },
      });
      setClinics(response.data.data.items);
      setTotalCount(response.data.data.totalCount);
    } catch (error) {
      console.error('Error fetching clinics:', error);
    }
    setLoading(false);
  };

  const handleUpdateClinic = async () => {
    try {
      const response = await axios.put(
        'https://healthcareintourism-test.azurewebsites.net/api/Clinic/UpdateClinic',
        editingClinic
      );
      if (response.status === 200) {
        fetchClinics(currentPage);
        setEditModalVisible(false);
        setEditingClinic(null);
      } else {
        console.error('Error updating clinic:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating clinic:', error);
    }
  };
  const handleSelectChange = (value: string, option: any, field: string) => {
    setEditingClinic((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  const handleDeleteClinic = async (clinicId: number) => {
    try {
      const response = await axios.delete(
        'https://healthcareintourism-test.azurewebsites.net/api/Clinic/DeleteClinic',
        {
          params: {
            Id: clinicId
          }
        }
      );
      if (response.status === 200) {
        fetchClinics(currentPage);
      } else {
        console.error('Error deleting clinic:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting clinic:', error);
    }
  };

  const handleEditClick = (clinic: any) => {
    setEditingClinic(clinic);
    setEditModalVisible(true);
    fetchClinics(currentPage);
  };

  const handleFileChange = (fileList: any) => {
    const file = fileList.fileList[0];
    const reader = new FileReader();
    reader.readAsDataURL(file.originFileObj);
    reader.onload = () => {
      const base64WithPrefix = reader.result as string;
      const base64String = base64WithPrefix.split(',')[1];
      setEditingClinic((prev: any) => ({
        ...prev,
        imagesToAdd: [base64String]
      }));
    };
  };


  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Country Code', dataIndex: 'countryCode', key: 'countryCode' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: any) => (
        <Row>
        <Button
          icon={<EditOutlined />}
          onClick={() => handleEditClick(record)}
        />
        <Button
        icon={<DeleteOutlined />}
        onClick={() => handleDeleteClinic(record.id)}/>
        </Row>
      )
    }
  ];

  const handleTableChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 17, width:150 , marginLeft:20}}>
        <h1 style={{color:'white', marginRight:'15px'}} >Clinics</h1>
        <Button type="primary" style={{backgroundColor:'GrayText'}} onClick={showModal}>Create</Button>
      </div>
      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <div > 
          <Table
            columns={columns}
            dataSource={clinics}
            pagination={false}
            rowKey="id"
          />
          <Pagination
            current={currentPage}
            total={totalCount}
            pageSize={pageSize}
            onChange={handleTableChange}
            style={{ marginTop: '20px', textAlign: 'center' }}
          />
        </div>
      )}
      <Modal
        open={isModalVisible}
        wrapClassName="custom-modal"
        onOk={handleOk}
        onCancel={handleCancel}
        width={500} 
        footer={null}
        maskClosable={true}
      >
          <CreateClinic />
      </Modal>
      <Modal
      open={editModalVisible}
      wrapClassName="custom-modal"
      onOk={handleUpdateClinic}
      onCancel={handleEditCancel}
      width={500} 
      footer={null}
      maskClosable={true}
      >
        {editingClinic && (
      <Form
           labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}>
            <Form.Item label={<span style={{ color: 'white' }}>Name</span>}>
              <Input
                value={editingClinic.name}
                onChange={(e) => setEditingClinic({ ...editingClinic, name: e.target.value })}
              />
            </Form.Item>
            <Form.Item label={<span style={{ color: 'white' }}>Latitude</span>}>
              <Input
                value={editingClinic.latitude}
                onChange={(e) => setEditingClinic({ ...editingClinic, latitude: parseFloat(e.target.value) })}
              />
            </Form.Item>
            <Form.Item label={<span style={{ color: 'white' }}>Longitude</span>}>
              <Input
                value={editingClinic.longitude}
                onChange={(e) => setEditingClinic({ ...editingClinic, longitude: parseFloat(e.target.value) })}
              />
            </Form.Item>
            <Form.Item label={<span style={{ color: 'white' }}>Region</span>}>
            <Select
      showSearch
      placeholder='Region'
      optionFilterProp='children'
      value={editingClinic.regionId}
      onChange={(value, option) => handleSelectChange(value, option, 'regionId')}
      filterOption={(input, option) =>
        option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {regions.map((region) => (
        <Option key={region.id} value={region.id} name='regionId'>
          {region.name}
        </Option>
      ))}
    </Select>
            </Form.Item>
            <Form.Item label={<span style={{ color: 'white' }}>City</span>}>
            <Select
      showSearch
      placeholder='City'
      optionFilterProp='children'
      value={editingClinic.cityId}
      onChange={(value, option) => handleSelectChange(value, option, 'cityId')}
      filterOption={(input, option) =>
        option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {cities.map((city) => (
        <Option key={city.id} value={city.id} name='cityId'>
          {city.name}
        </Option>
      ))}
    </Select>
            </Form.Item>
            <Form.Item label={<span style={{ color: 'white' }}>Country</span>}>
            <Select
      showSearch
      placeholder='Country'
      optionFilterProp='children'
      value={editingClinic.countryId}
      onChange={(value, option) => handleSelectChange(value, option, 'countryId')}
      filterOption={(input, option) =>
        option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {countries.map((country) => (
        <Option key={country.id} value={country.id} name='countryId'>
          {country.name}
        </Option>
      ))}
    </Select>
            </Form.Item>
            <Form.Item label={<span style={{ color: 'white' }}>Address</span>}>
              <Input
                value={editingClinic.address}
                onChange={(e) => setEditingClinic({ ...editingClinic, address: e.target.value })}
              />
            </Form.Item>
            <Form.Item label={<span style={{ color: 'white' }}>Phone</span>}>
              <Input
                value={editingClinic.phone}
                onChange={(e) => setEditingClinic({ ...editingClinic, phone: e.target.value })}
              />
            </Form.Item>
            <Form.Item label={<span style={{ color: 'white' }}>Email</span>}>
              <Input
                value={editingClinic.email}
                onChange={(e) => setEditingClinic({ ...editingClinic, email: e.target.value })}
              />
            </Form.Item>
            <Form.Item label={<span style={{ color: 'white' }}>Description</span>}>
              <Input
                value={editingClinic.description}
                onChange={(e) => setEditingClinic({ ...editingClinic, description: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Upload Picture">
              <Upload
                listType="picture"
                onChange={handleFileChange}
                beforeUpload={() => false}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Upload Picture</Button>
              </Upload>
            </Form.Item>
            <Button onClick={handleUpdateClinic} style={{ marginTop: 22, marginLeft:12 }}>
        Update Clinic
      </Button>
          </Form>
          )}
      </Modal>
    </div>
  );
};

export default ClinicsTable;
