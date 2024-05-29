import React, { useState } from 'react';
import { Drawer, Button} from 'antd';
import { UserOutlined, MenuOutlined } from '@ant-design/icons';
import './superAdmin.css';
import ClinicsTable from './Actions/clinicsTable.tsx';
import HotelsTable from './Actions/hotelsTable.tsx';
import AgencyTable from './Actions/agencyTable.tsx';
import { useAuth } from '../context/AuthContext.tsx';

const SuperAdmin: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerContent, setDrawerContent] = useState('welcome');
  const {onLogout} = useAuth();

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onCloseDrawer = () => {
    setDrawerVisible(false);
  };
  const handleLogout = async () => {
    try {
      if (onLogout) {
        await onLogout();
        window.location.href = '/';
      } else {
        console.error('Error while log out');
      }
    } catch (error) {
      console.error('Error occured', error);
    }
  };

  return (
    <div className='superAdminPage'>
      <div className='adminPanel'>
        <div className='adminIcon' onClick={showDrawer}>
          <MenuOutlined style={{ fontSize: '24px', color: '#ffffff' }} />
        </div>
        <div
          onClick={() => setDrawerContent('welcome')}
          style={{ display: 'flex', flexDirection: 'row' }}
        >
          <UserOutlined
            style={{ fontSize: '20px', color: '#ffffff', marginLeft: 3 }}
          />
          <div className='adminText'>Super Admin Panel</div>
        </div>
      </div>
      <Drawer
        title='Admin Actions'
        placement='left'
        closable={false}
        onClose={onCloseDrawer}
        visible={drawerVisible}
      >
        <div className='drawerContent'>
          <Button
            onClick={() => {
              setDrawerContent('createClinic');
              onCloseDrawer();
            }}
          >
            Clinics
          </Button>
          <Button
            onClick={() => {
              setDrawerContent('createHotel');
              onCloseDrawer();
            }}
          >
            Hotels
          </Button>
          <Button
            onClick={() => {
              setDrawerContent('createAgency');
              onCloseDrawer();
            }}
          >
            Agency
          </Button>
          <Button
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </Drawer>
      <div className='adminSections'>
        <div className='homePage'>
          {drawerContent === 'welcome' && (
            <div style={{ fontSize: '24px', color: '#ffffff' }}>
              <h1>Welcome to the Super Admin Panel</h1>
            </div>
          )}
          {drawerContent === 'createClinic' && <ClinicsTable/>}
          {drawerContent === 'createHotel' && <HotelsTable/>}
          {drawerContent === 'createAgency' && <AgencyTable />}
        </div>
      </div>
    </div>
  );
};

export default SuperAdmin;
