import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Upload } from 'antd';
import { Modal, Box, Typography} from '@mui/material';
import { UploadOutlined } from '@ant-design/icons';
import '../superAdmin.css';
import axios from 'axios';

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

const CreateHotel: React.FC = () => {
  const [hotelData, setHotelData] = useState({
    name: '',
    latitude: undefined,
    longitude: undefined,
    star: undefined,
    description: '',
    regionId: undefined,
    cityId: undefined,
    countryId: undefined,
    address: '',
    phone: '',
    email: '',
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

  const handleHotelInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setHotelData({ ...hotelData, [name]: value });
  };

  const handleSelectChange = (value: string, option: any) => {
    const { name } = option.props;
    setHotelData((prevData) => ({ ...prevData, [name]: value }));
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
        setHotelData((prevData) => ({ ...prevData, base64Images }));
      })
      .catch((error) =>
        console.error('Error converting images to base64:', error)
      );
  };
  const resetForm = () => {
    setHotelData({
      name: '',
    latitude: undefined,
    longitude: undefined,
    star: undefined,
    description: '',
    regionId: undefined,
    cityId: undefined,
    countryId: undefined,
    address: '',
    phone: '',
    email: '',
    base64Images: []
    });
  };

  const handleCreateHotel = async () => {
    try {
      const queryParams = {
        name: hotelData.name,
        latitude: Number(hotelData.latitude),
        longitude: Number(hotelData.longitude),
        star: Number(hotelData.star),
        description: hotelData.description,
        regionId: Number(hotelData.regionId),
        cityId: Number(hotelData.cityId),
        countryId: Number(hotelData.countryId),
        address: hotelData.address,
        phone: hotelData.phone,
        email: hotelData.email,
        base64Images: hotelData.base64Images
      };
      const url = `https://healthcareintourism-test.azurewebsites.net/api/Hotel/CreateHotel`;
      const response = await axios.post(url, queryParams);
  
      if (response.status !== 200) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      setShowSuccessModal(true); 
      resetForm();
      return response.data.data; 
    } catch (error: any) {
      let errorMsg = 'An error occurred';
      if (error.response && error.response.data.data) {
        errorMsg = error.response.data.message || errorMsg;
      }
      return {
        error: true,
        msg: errorMsg,
      };
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '26px', color: '#ffffff', marginBottom: 24 }}>
        Create Hotel
      </h1>
      <Input
        className='hotelInput'
        placeholder='Hotel Name'
        name='name'
        value={hotelData.name}
        onChange={handleHotelInputChange}
      />
      <Input
        className='hotelInput'
        placeholder='Hotel Latitude'
        name='latitude'
        value={hotelData.latitude}
        onChange={handleHotelInputChange}
      />
      <Input
        className='hotelInput'
        placeholder='Hotel Longitude'
        name='longitude'
        value={hotelData.longitude}
        onChange={handleHotelInputChange}
      />
      <Input
        className='hotelInput'
        type='number'
        name='star'
        placeholder='Star'
        value={hotelData.star}
        onChange={handleHotelInputChange}
      />
      <Input
        className='hotelInput'
        name='description'
        placeholder='Hotel Description'
        value={hotelData.description}
        onChange={handleHotelInputChange}
      />
      <Select
        className='hotelInput'
        showSearch
        placeholder='Region Id'
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
        className='hotelInput'
        showSearch
        placeholder='City Id'
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
        className='hotelInput'
        showSearch
        placeholder='Country Id'
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
        className='hotelInput'
        placeholder='Hotel Address'
        name='address'
        value={hotelData.address}
        onChange={handleHotelInputChange}
      />
      <Input
        className='hotelInput'
        placeholder='Hotel Phone'
        name='phone'
        value={hotelData.phone}
        onChange={handleHotelInputChange}
      />
      <Input
        className='hotelInput'
        placeholder='Hotel Email'
        name='email'
        value={hotelData.email}
        onChange={handleHotelInputChange}
      />
      <Upload
        className='hotelInput'
        listType="picture"
        multiple
        onChange={handleFileChange}
        beforeUpload={() => false}
      >
        <Button icon={<UploadOutlined />}>Upload Images</Button>
      </Upload>
      <Button onClick={handleCreateHotel} style={{ marginTop: 16 }}>
        Create Hotel
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
            Hotel created successfully!
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
export default CreateHotel;
