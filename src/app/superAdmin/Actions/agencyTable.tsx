import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input, Switch } from 'antd';
import axios from 'axios';
import { toast } from 'react-toastify';

const AgencyTable: React.FC = () => {
  const [agencies, setAgencies] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newAgency, setNewAgency] = useState({
    name: '',
    agencyName: '',
    agencyEmailAddress: '',
    isActive: true
  });

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      const response = await axios.get(
        'https://healthcareintourism-test.azurewebsites.net/api/Agency/GetAllAgencies'
      );
      setAgencies(response.data.data.items);
    } catch (error) {
      console.error('Error fetching agencies:', error);
    }
  };

  const handleRegisterAgency = async () => {
    try {
      const response = await axios.post(
        'https://healthcareintourism-test.azurewebsites.net/api/Account/register-agency',
        newAgency
      );
      if (response.status === 200) {
        toast.success('Agency registered successfully');
        setIsModalVisible(false);
        fetchAgencies();
      } else {
        toast.error('Error registering agency');
      }
    } catch (error) {
      console.error('Error registering agency:', error);
      toast.error('An error occurred');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Agency Name',
      dataIndex: 'agencyName',
      key: 'agencyName'
    },
    {
      title: 'Contact',
      dataIndex: 'contactInformations',
      key: 'contactInformations',
      render: (text: any) => (text ? JSON.parse(text).phone : 'N/A')
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    }
  ];
  
  return (
    <div>
      <Button type='primary'style={{backgroundColor:'GrayText' , marginBottom:'25px'}} onClick={() => setIsModalVisible(true)}>
        Register Agency
      </Button>
      <Table dataSource={agencies} columns={columns} rowKey='id' />
      <Modal
        wrapClassName="custom-modal"
        open={isModalVisible}
        footer={[
          <Button key="cancel" size="small" style={{width:105}} onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" size="small" style={{width:105}}  onClick={handleRegisterAgency}>
            Ok
          </Button>
        ]}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          placeholder='Name'
          value={newAgency.name}
          onChange={(e) => setNewAgency({ ...newAgency, name: e.target.value })}
          style={{ marginBottom: '10px', marginTop:'15px' }}
        />
        <Input
          placeholder='Agency Name'
          value={newAgency.agencyName}
          onChange={(e) =>
            setNewAgency({ ...newAgency, agencyName: e.target.value })
          }
          style={{ marginBottom: '10px' }}
        />
        <Input
          placeholder='Agency Email Address'
          value={newAgency.agencyEmailAddress}
          onChange={(e) =>
            setNewAgency({ ...newAgency, agencyEmailAddress: e.target.value })
          }
          style={{ marginBottom: '10px' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ marginRight: '10px', color:'#fff' }}>Active</span>
          <Switch
            checked={newAgency.isActive}
            onChange={(checked) => setNewAgency({ ...newAgency, isActive: checked })}
          />
        </div>
      </Modal>
    </div>
  );
};

export default AgencyTable;
