import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Upload } from 'antd';
import { Modal, Box, Typography} from '@mui/material';
import { UploadOutlined } from '@ant-design/icons';
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


const CreateClinic: React.FC = () => {
  const [clinicData, setClinicData] = useState({
    name: '',
    latitude: undefined,
    longitude: undefined,
    regionId: undefined,
    cityId: undefined,
    countryId: undefined,
    address: '',
    phone: '',
    email: '',
    description: '',
    base64Images: [] as string[]
  });
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
  }, []);


  const resetForm = () => {
    setClinicData({
      name: '',
      latitude: undefined,
      longitude: undefined,
      regionId: undefined,
      cityId: undefined,
      countryId: undefined,
      address: '',
      phone: '',
      email: '',
      description: '',
      base64Images: [],
    });
  };
  const handleClinicInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setClinicData({ ...clinicData, [name]: value });
  };

  const handleSelectChange = (value: string, option: any) => {
    const { name } = option.props;
    setClinicData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (fileList: any) => {
    const files = fileList.fileList;
    const base64ImagesPromises = files.map((file: any) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () =>  {
          const base64WithPrefix = reader.result as string;
          const base64String = base64WithPrefix.split(',')[1]; 
          resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
      });
    });

    Promise.all(base64ImagesPromises)
      .then((base64Images) => {
        console.log('Base64 Images:', base64Images); // Debugging line
        setClinicData((prevData) => ({ ...prevData, base64Images }));
      })
      .catch((error) =>
        console.error('Error converting images to base64:', error)
      );
  };

  const handleCreateClinic = async () => {
    try {
      const queryParams = {
        name: clinicData.name,
        latitude: Number(clinicData.latitude),
        longitude: Number(clinicData.longitude),
        regionId: Number(clinicData.regionId),
        cityId: Number(clinicData.cityId),
        countryId: Number(clinicData.countryId),
        address: clinicData.address,
        phone: clinicData.phone,
        email: clinicData.email,
        description: clinicData.description,
        base64Images: clinicData.base64Images
      };
      const url = `https://healthcareintourism-test.azurewebsites.net/api/Clinic/CreateClinic`;
  
      const response = await axios.post(url, queryParams, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.status !== 200) {
        throw new Error(`Request failed with status ${response.status}`);
      }
  
      console.log('Clinic created successfully:', response.data);
      setShowSuccessModal(true); 
      resetForm();
      return response.data.data;
    } catch (error: any) {
      let errorMsg = 'An error occurred';
      if (error.response && error.response.data && error.response.data.message) {
        errorMsg = error.response.data.data.message;
      }
      console.error(errorMsg);
      return {
        error: true,
        msg: errorMsg,
      };
    }
  };
  

  return (
    <div>
      <h1 style={{ fontSize: '26px', color: 'white', marginBottom: 24 }}>
        Create Clinic
      </h1>
      <Input
        className='clinicInput'
        placeholder='Clinic Name'
        name='name'
        value={clinicData.name}
        onChange={handleClinicInputChange}
      />
      <Input
        className='clinicInput'
        placeholder='Clinic Latitude'
        name='latitude'
        value={clinicData.latitude}
        onChange={handleClinicInputChange}
      />
      <Input
        className='clinicInput'
        placeholder='Clinic Longitude'
        name='longitude'
        value={clinicData.longitude}
        onChange={handleClinicInputChange}
      />
      <Select
        className='clinicInput'
        showSearch
        placeholder='Region'
        optionFilterProp='children'
        onChange={handleSelectChange}
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
      <Select
        className='clinicInput'
        showSearch
        placeholder='City'
        optionFilterProp='children'
        onChange={handleSelectChange}
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
      <Select
        className='clinicInput'
        showSearch
        placeholder='Country'
        optionFilterProp='children'
        onChange={handleSelectChange}
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
      <Input
        className='clinicInput'
        placeholder='Clinic Address'
        name='address'
        value={clinicData.address}
        onChange={handleClinicInputChange}
      />
      <Input
        className='clinicInput'
        placeholder='Clinic Phone'
        name='phone'
        value={clinicData.phone}
        onChange={handleClinicInputChange}
      />
      <Input
        className='clinicInput'
        placeholder='Clinic Email'
        name='email'
        value={clinicData.email}
        onChange={handleClinicInputChange}
      />
      <Input
        className='clinicInput'
        placeholder='Clinic Description'
        name='description'
        value={clinicData.description}
        onChange={handleClinicInputChange}
      />
      <Upload
        className='clinicInput'
        listType="picture"
        multiple
        onChange={handleFileChange}
        beforeUpload={() => false}
      >
        <Button icon={<UploadOutlined />}>Upload Images</Button>
      </Upload>
      <Button onClick={handleCreateClinic} style={{ marginTop: 22, marginLeft:12 }}>
        Create Clinic
      </Button>
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
            Clinic created successfully!
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
export default CreateClinic;
