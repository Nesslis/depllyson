import React, { useState } from 'react';
import { FaUser, FaEnvelope} from 'react-icons/fa';
import { registerAgency } from '../../../context/AdminApi.tsx';
import { Link } from 'react-router-dom';
import MyCheckbox from '../../../components/checkbox/checkbox.tsx';
import { Modal, Box, Typography, Button} from '@mui/material';
import './register.css';
interface RegistrationInfo {
  name: string;
  agencyName: string;
  email: string;
}

const RegisterPage: React.FC = () => {
  const [registrationInfo, setRegistrationInfo] = useState<RegistrationInfo>({
    name: '',
    agencyName: '',
    email: ''
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegistrationInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const resetForm = () => {
    setRegistrationInfo({
      name:'',
      agencyName:'',
      email:'',
    })
  }

  const handleSubmit =  async(e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted registration info:', registrationInfo);
    try {
      const response = await registerAgency(
        registrationInfo.name,
        registrationInfo.agencyName,
        registrationInfo.email,
        true 
      );

      if (response.error) {
        console.log(response.msg);
      } else {
        console.log('Registration successful:', response);
        setShowSuccessModal(true); 
        resetForm();
      }
    } catch (error) {
      console.log('Unexpected error occurred. Please try again later');
    }
  };

  return (
    <div className="register-page">
      <div className="registration-container">
          <form onSubmit={handleSubmit}>
            <h2>Sign Up.</h2>
            <div className="note">Create an account.</div>
            <div className="form-group1">
            <FaUser className="icon" />
              <input
                type="text"
                id="name"
                name="name"
                placeholder='Name : '
                value={registrationInfo.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group1">
            <FaUser className="icon" />
              <input
                type="text"
                id="agencyName"
                name="agencyName"
                placeholder='Agency Name : '
                value={registrationInfo.agencyName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group1">
            <FaEnvelope className="icon" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder='Email : '
                value={registrationInfo.email}
                onChange={handleChange}
                required
              />
            </div>
            <MyCheckbox/>
            <button type="submit" className="submit-button" onClick={handleSubmit}>Create Account</button>
            <div style={{ color: '#3a5a5e', marginTop: '8px', fontSize:'15px', alignSelf:'center', marginLeft:'8px' }}>
            Already have an account? <Link to="/login" style={{ fontWeight: 'bold', marginBottom: '5px', color: '#206f74' }}>Log in</Link>.
          </div>
          </form>
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
            Account created successfully!
          </Typography>
          <Button onClick={() => setShowSuccessModal(false)} sx={{marginTop:3}}>
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
export default RegisterPage;
