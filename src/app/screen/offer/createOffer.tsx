import React, { useState, useEffect } from 'react';
import { Input, Button, Switch, DatePicker, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext.tsx';
import { toast } from 'react-toastify';
import axios from 'axios';

const { Option } = Select;

const CreateOffer: React.FC = () => {
  const [clinics, setClinics] = useState<any[]>([]);
  const [clinicId, setClinicId] = useState<number>();
  const [hotels, setHotels] = useState<any[]>([]);
  const [hotelId, setHotelId] = useState<number>();
  const [treatments, setTreatments] = useState<any[]>([]);
  const [treatmentId, setTreatmentId] = useState<number>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState('');
  const [price, setPrice] = useState<number>();
  const [discount, setDiscount] = useState<number>();
  const [imagesToAdd, setBannerImage] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const { onPushOffer } = useAuth();

  useEffect(() => {
    fetchClinics();
    fetchHotels();
    fetchTreatments();
  }, []);

  const fetchClinics = async () => {
    try {
      const response = await axios.get(
        'https://healthcareintourism-test.azurewebsites.net/api/Clinic/GetAllClinics'
      );
      setClinics(response.data.data.items);
    } catch (error) {
      console.error('Error fetching the cities:', error);
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await axios.get(
        'https://healthcareintourism-test.azurewebsites.net/api/Hotel/GetAllHotels'
      );
      setHotels(response.data.data.items);
    } catch (error) {
      console.error('Error fetching the hotels:', error);
    }
  };

  const fetchTreatments = async () => {
    try {
      const response = await axios.get(
        'https://healthcareintourism-test.azurewebsites.net/api/Treatment/GetAllTreatments'
      );
      setTreatments(response.data.data.items);
    } catch (error) {
      console.error('Error fetching the treatments:', error);
    }
  };

  const handleClinicSelect = (value: any) => {
    setClinicId(value);
  };

  const handleHotelSelect = (value: any) => {
    setHotelId(value);
  };

  const handleTreatmentSelect = (value: any) => {
    setTreatmentId(value);
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
        setBannerImage(base64Images);
      })
      .catch((error) =>
        console.error('Error converting images to base64:', error)
      );
  };

  const handlePushOffer = async () => {
    if (
      !clinicId ||
      !hotelId ||
      !treatmentId ||
      !title ||
      !description ||
      !currency ||
      !price ||
      !discount ||
      !imagesToAdd ||
      !startDate ||
      !endDate
    ) {
      toast('Please fill all the required inputs');
      return;
    }

    const formattedStartDate = startDate?.toISOString();
    const formattedEndDate = endDate?.toISOString();

    try {
      if(!onPushOffer){ throw console.error('There is an error');
      }
      const response = await onPushOffer(
        clinicId,
        hotelId,
        treatmentId,
        title,
        description,
        currency,
        price,
        discount,
        isActive,
        formattedStartDate,
        formattedEndDate,
        imagesToAdd
      );

      if (response.status !== 200) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      toast.success('Offer pushed successfully');
    } catch (error) {
      console.error('Error pushing offer:', error);
      const errorMsg = error.response?.data?.message || 'An error occurred';
      toast.error(errorMsg);
    }
  };

  return (
    <div>
      <h1 style={{ color: '#ffffff' }}>Create Offer</h1>
      <Select
        className='offerInput'
        showSearch
        placeholder='Select a clinic'
        optionFilterProp='children'
        onChange={handleClinicSelect}
        filterOption={(input, option) =>
          option?.children
            ?.toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        }
      >
        {clinics.map((clinic) => (
          <Option key={clinic.id} value={clinic.id}>
            {clinic.name}
          </Option>
        ))}
      </Select>
      <Select
        className='offerInput'
        showSearch
        placeholder='Select a hotel'
        optionFilterProp='children'
        onChange={handleHotelSelect}
        filterOption={(input, option) =>
          option?.children
            ?.toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        }
      >
        {hotels.map((hotel) => (
          <Option key={hotel.id} value={hotel.id}>
            {hotel.name}
          </Option>
        ))}
      </Select>
      <Select
        className='offerInput'
        showSearch
        placeholder='Select a treatment'
        optionFilterProp='children'
        onChange={handleTreatmentSelect}
        filterOption={(input, option) =>
          option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {treatments.map((treatment) => (
          <Option key={treatment.id} value={treatment.id}>
            {treatment.name}
          </Option>
        ))}
      </Select>
      <Input
        className='offerInput'
        placeholder='Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        className='offerInput'
        placeholder='Description'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Input
        className='offerInput'
        placeholder='Currency'
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
      />
      <Input
        className='offerInput'
        placeholder='Price'
        type='number'
        value={price}
        onChange={(e) => setPrice(parseFloat(e.target.value))}
      />
      <Input
        className='offerInput'
        placeholder='Discount'
        type='number'
        value={discount}
        onChange={(e) => setDiscount(parseFloat(e.target.value))}
      />
      <Upload
        className='offerInput'
        listType="picture"
        multiple
        onChange={handleFileChange}
        beforeUpload={() => false}
      >
        <Button icon={<UploadOutlined />}>Upload Images</Button>
      </Upload>
      <div className='altageç'>
        <div>
          <Switch
            checked={isActive}
            onChange={(checked) => setIsActive(checked)}
          />
          <DatePicker
            className='offerDate'
            placeholder='Start Date'
            value={startDate}
            onChange={(date) => setStartDate(date)}
          />
          <DatePicker
            className='offerDate'
            placeholder='End Date'
            value={endDate}
            onChange={(date) => setEndDate(date)}
          />
        </div>
        <Button onClick={handlePushOffer} style={{ marginTop: 5 }}>
          Create Offer
        </Button>
      </div>
    </div>
  );
};

export default CreateOffer;
