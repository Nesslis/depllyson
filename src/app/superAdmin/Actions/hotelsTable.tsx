import React, { useState, useEffect } from 'react';
import { Table, Pagination, Spin, Button, Modal, Row, Form, Upload, Input, Select } from 'antd';
import { EditOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import CreateHotel from '../components/createHotel.tsx'; 
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

const HotelsTable: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hotels, setHotels] = useState<any[]>([]); // Değişti
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingHotel, setEditingHotel] = useState<any>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const pageSize = 15;
  

  const showModal = () => {
    setIsModalVisible(true);
    fetchHotels(currentPage);
  };
  const handleOk = () => {
    setIsModalVisible(false);
    fetchHotels(currentPage);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    fetchHotels(currentPage);
  };
  const handleEditCancel = () => {
    setEditModalVisible(false);
    setEditingHotel(null);
    fetchHotels(currentPage);
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
    fetchHotels(currentPage); 
  }, [currentPage]);

  const fetchHotels = async (page: number) => { 
    setLoading(true);
    try {
      const response = await axios.get('https://healthcareintourism-test.azurewebsites.net/api/Hotel/GetAllHotels', { 
        params: {
          SkipCount: (page - 1) * pageSize,
          MaxResultCount: pageSize,
        },
      });
      setHotels(response.data.data.items); 
      setTotalCount(response.data.data.totalCount);
    } catch (error) {
      console.error('Error fetching hotels:', error); 
    }
    setLoading(false);
  };
  const handleUpdateHotel = async () => {
    try {
      const response = await axios.put(
        'https://healthcareintourism-test.azurewebsites.net/api/Hotel/UpdateHotel',
        editingHotel
      );
      if (response.status === 200) {
        fetchHotels(currentPage);
        setEditModalVisible(false);
        setEditingHotel(null);
      } else {
        console.error('Error updating clinic:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating clinic:', error);
    }
  };
  const handleSelectChange = (value: string, option: any, field: string) => {
    setEditingHotel((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  const handleDeleteHotel = async (hotelId: number) => {
    try {
      const response = await axios.delete(
        'https://healthcareintourism-test.azurewebsites.net/api/Hotel/DeleteHotel',
        {
          params: {
            Id: hotelId
          }
        }
      );
      if (response.status === 200) {
        fetchHotels(currentPage);
      } else {
        console.error('Error deleting hotel:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting hotel:', error);
    }
  };

  const handleEditClick = (clinic: any) => {
    setEditingHotel(clinic);
    setEditModalVisible(true);
    fetchHotels(currentPage);
  };

  const handleFileChange = (fileList: any) => {
    const file = fileList.fileList[0];
    const reader = new FileReader();
    reader.readAsDataURL(file.originFileObj);
    reader.onload = () => {
      const base64WithPrefix = reader.result as string;
      const base64String = base64WithPrefix.split(',')[1];
      setEditingHotel((prev: any) => ({
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
    { title: 'Star', dataIndex: 'star', key: 'star' },
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
        onClick={() => handleDeleteHotel(record.id)}/>
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
        <h1 style={{color:'white', marginRight:'15px'}} >Hotels</h1>
        <Button type="primary" style={{backgroundColor:'GrayText'}} onClick={showModal}>Create</Button>
      </div>
      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <div > 
          <Table
            columns={columns}
            dataSource={hotels} // Değişti
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
          <CreateHotel /> 
      </Modal>
      <Modal
      open={editModalVisible}
      wrapClassName="custom-modal"
      onOk={handleUpdateHotel}
      onCancel={handleEditCancel}
      width={500} 
      footer={null}
      maskClosable={true}
      >
        {editingHotel && (
      <Form
           labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}>
            <Form.Item label={<span style={{ color: 'white' }}>Name</span>}>
              <Input
                value={editingHotel.name}
                onChange={(e) => setEditingHotel({ ...editingHotel, name: e.target.value })}
              />
            </Form.Item>
            <Form.Item label={<span style={{ color: 'white' }}>Latitude</span>}>
              <Input
                value={editingHotel.latitude}
                onChange={(e) => setEditingHotel({ ...editingHotel, latitude: parseFloat(e.target.value) })}
              />
            </Form.Item>
            <Form.Item label={<span style={{ color: 'white' }}>Longitude</span>}>
              <Input
                value={editingHotel.longitude}
                onChange={(e) => setEditingHotel({ ...editingHotel, longitude: parseFloat(e.target.value) })}
              />
            </Form.Item>
            <Form.Item label={<span style={{ color: 'white' }}>Region</span>}>
            <Select
      showSearch
      placeholder='Region'
      optionFilterProp='children'
      value={editingHotel.regionId}
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
      value={editingHotel.cityId}
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
      value={editingHotel.countryId}
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
                value={editingHotel.address}
                onChange={(e) => setEditingHotel({ ...editingHotel, address: e.target.value })}
              />
            </Form.Item>
            <Form.Item label={<span style={{ color: 'white' }}>Phone</span>}>
              <Input
                value={editingHotel.phone}
                onChange={(e) => setEditingHotel({ ...editingHotel, phone: e.target.value })}
              />
            </Form.Item>
            <Form.Item label={<span style={{ color: 'white' }}>Email</span>}>
              <Input
                value={editingHotel.email}
                onChange={(e) => setEditingHotel({ ...editingHotel, email: e.target.value })}
              />
            </Form.Item>
            <Form.Item label={<span style={{ color: 'white' }}>Description</span>}>
              <Input
                value={editingHotel.description}
                onChange={(e) => setEditingHotel({ ...editingHotel, description: e.target.value })}
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
            <Button onClick={handleUpdateHotel} style={{ marginTop: 22, marginLeft:12 }}>
        Update Clinic
      </Button>
          </Form>
          )}
      </Modal>
    </div>
  );
};

export default HotelsTable;
