import React, { useState } from 'react';
import { Drawer, Button, Input} from 'antd';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserOutlined, MenuOutlined } from '@ant-design/icons';
import { Modal, Box, Typography } from '@mui/material';
import OffersTable from '../../screen/offer/offersTable.tsx';
import axios from 'axios';
import './adminHomePage.css';
import { useUser } from '../../context/UserContext.tsx';

const AdminHome: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerContent, setDrawerContent] = useState('welcome');
  const { onLogout } = useAuth();
  const {user} = useUser();
  const [showSuccessModal, setShowSuccessModal] = useState(false);



  const [profile, setProfile] = useState({
    id: user?.id,
    name: '',
    contactInformations: '',
    address: '',
    pictureBase64: '',
  });

  const showToast = (message: string) => {
    toast(message);
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

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      showToast('Passwords are not matching');
      return;
    }

    try {
      const response = await axios.post(
        'https://healthcareintourism-test.azurewebsites.net/api/Account/reset-password-panel',
        {
          password,
          confirmPassword
        }
      );
      if (response.status === 200) {
        showToast('Password successfully resetted');
      } else {
        showToast('Error resetting password');
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      showToast('There is an error during password reset');
    }
  };
  const handleProfileUpdate = async () => {
    try {
      profile.id= user?.id;
      const response = await axios.put(
        'https://healthcareintourism-test.azurewebsites.net/api/Agency/UpdateAgency',
        profile
      );
      if (response.status === 200) {
        showToast('Profile updated successfully');
      } else {
        showToast('Error updating profile');
      }
    } catch (error) {
      console.error('Error during profile update:', error);
      showToast('There is an error during profile update');
    }
  };
  const handleImageUpload = ({ file }: any) => {
    const reader = new FileReader();
    reader.onload = () => {
      setProfile((prevProfile) => ({
        ...prevProfile,
        pictureBase64: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onCloseDrawer = () => {
    setDrawerVisible(false);
  };


  return (
    <div className='adminPage'>
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
          <div className='adminText'>Admin Panel</div>
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
        {/* <Button
            onClick={() => {
              setDrawerContent('editProfile');
              onCloseDrawer();
            }}
          >
            Edit Profile
          </Button> */}
          <Button
            onClick={() => {
              setDrawerContent('resetPassword');
              onCloseDrawer();
            }}
          >
            Reset Password
          </Button>
          <Button
            onClick={() => {
              setDrawerContent('createOffer');
              onCloseDrawer();
            }}
          >
            Offers
          </Button>
          <Button
            onClick={() => {
              handleLogout();
              onCloseDrawer();
            }}
          >
            Logout
          </Button>
        </div>
      </Drawer>
      <div className='adminSections'>
        {/* Add other components for different pages */}
        <div className='homePage'>
          {drawerContent === 'welcome' && (
            <div style={{ fontSize: '24px', color: '#ffffff' }}>
              <h1> Welcome to our Agency Panel </h1>
            </div>
          )}
          {/* {drawerContent === 'editProfile' && (
            <div className='editProfileBox'>
              <Typography variant="h5" component="h2" style={{ marginBottom: '16px', marginTop: '16px' }}>
                Edit Profile
              </Typography>
              <Form layout="vertical">
                <Form.Item label="Name">
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </Form.Item>
                <Form.Item label="Contact Information">
                  <Input
                    value={profile.contactInformations}
                    onChange={(e) => setProfile({ ...profile, contactInformations: e.target.value })}
                  />
                </Form.Item>
                <Form.Item label="Address">
                  <Input
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  />
                </Form.Item>
                <Form.Item label="Profile Picture">
                  <Upload
                    accept='image/*'
                    showUploadList={false}
                    beforeUpload={file => {
                      handleImageUpload({ file });
                      return false;
                    }}
                  >
                    <Button>
                      Upload Picture
                    </Button>
                  </Upload>
                </Form.Item>
                <Button type="primary" onClick={handleProfileUpdate} style={{ marginTop: '10px' }}>
                  Update Profile
                </Button>
              </Form>
            </div>
          )} */}
          {drawerContent === 'resetPassword' && (
            <div className='resetPasswordBox'>
            <Typography variant="h5" component="h2" style={{ marginBottom: '16px', marginTop:'16px' }}>
              Reset Password
            </Typography>
            <Input
              className='resetInput'
              placeholder='New Password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              className='resetInput'
              placeholder='Confirm Password'
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ marginTop: '10px' }}
            />
            <Button onClick={handleResetPassword} style={{ marginTop: '10px', marginLeft:'8px' }}>
              Reset Password
            </Button>
          </div>
          )}
          {drawerContent === 'createOffer' && <OffersTable/>}
        </div>
      </div>
      <Modal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Success
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Offer pushed successfully!
          </Typography>
          <Button onClick={() => setShowSuccessModal(false)}>
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};
export default AdminHome;
