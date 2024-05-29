import React, { useState, useEffect } from 'react';
import { Input, Row, Col, Card, Button, Modal, Select, Form, InputNumber} from 'antd';
import axios from 'axios';

const { Meta } = Card;
const { Option } = Select;

const OffersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [offers, setOffers] = useState<any[]>([]);
  const [treatments, setTreatments] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchOptions();
    fetchAllOffers();
  }, [searchQuery]);

  const fetchOptions = async () => {
    try {
      const [treatmentsResponse, clinicsResponse, hotelsResponse, agenciesResponse] = await Promise.all([
        axios.get('https://healthcareintourism-test.azurewebsites.net/api/Treatment/GetAllTreatments'),
        axios.get('https://healthcareintourism-test.azurewebsites.net/api/Clinic/GetAllClinics'),
        axios.get('https://healthcareintourism-test.azurewebsites.net/api/Hotel/GetAllHotels'),
        axios.get('https://healthcareintourism-test.azurewebsites.net/api/Agency/GetAllAgencies'),
      ]);
      setTreatments(treatmentsResponse.data.data.items);
      setClinics(clinicsResponse.data.data.items);
      setHotels(hotelsResponse.data.data.items);
      setAgencies(agenciesResponse.data.data.items);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };
  const fetchAllOffers = async () => {
    try {
      const response = await axios.get('https://healthcareintourism-test.azurewebsites.net/api/Search/SearchOffers');
      setOffers(response.data.data.items);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const searchOffers = async (values) => {
    console.log("Selected Treatment Id:", values.treatmentId);
    try {
      const response = await axios.get('https://healthcareintourism-test.azurewebsites.net/api/Search/SearchOffers', {
        params: {
          Description: values.description,
          MinPrice: values.minPrice,
          MaxPrice: values.maxPrice,
          TreatmentId: values.treatmentId,
          HotelId: values.hotelId,
          ClinicId: values.clinicId,
          AgencyId: values.agencyId,
        }
      });
      setOffers(response.data.data.items);
    } catch (error) {
      console.error('Error searching offers:', error);
    }
  };
  

  const handleOfferClick = (offer) => {
    setSelectedOffer(offer);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const onSearch = (values) => {
    setSearchQuery(values.description);
    searchOffers(values);
  };
  const formatDate = (dateTimeString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateTimeString).toLocaleDateString('en-US', options);
  };
  

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onSearch}
        style={{ marginBottom: '20px' }}
      >
        <Row gutter={16}>
          <Col span={4}>
            <Form.Item name="description" label="Description">
              <Input placeholder="Search by description" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="minPrice" label="Min Price">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="maxPrice" label="Max Price">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="treatmentId" label="Treatment">
              <Select placeholder="Select a treatment" allowClear>
                {treatments.map(treatment => (
                  <Option key={treatment.id} value={treatment.id}>{treatment.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="hotelId" label="Hotel">
              <Select placeholder="Select a hotel" allowClear>
                {hotels.map(hotel => (
                  <Option key={hotel.id} value={hotel.id}>{hotel.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="clinicId" label="Clinic">
              <Select placeholder="Select a clinic" allowClear>
                {clinics.map(clinic => (
                  <Option key={clinic.id} value={clinic.id}>{clinic.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={4}>
            <Form.Item name="agencyId" label="Agency">
              <Select placeholder="Select an agency" allowClear>
                {agencies.map(agency => (
                  <Option key={agency.id} value={agency.id}>{agency.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4} offset={16}>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Search</Button>
          </Col>
        </Row>
      </Form>
      <Row gutter={[16, 16]}>
        {offers.map((offer, index) => (
          <Col span={12} key={index}>
            <Card
              hoverable
              style={{ width: '80%', marginLeft:'45px' }}
              cover={<img alt="example" src={offer.images && offer.images.length > 0 ? offer.images[0] : './medical-clinic.jpg'} style={{ height: '150px', objectFit: 'cover' }} />}
              onClick={() => handleOfferClick(offer)}
            >
              <Meta
                title={offer.title}
                description={offer.description}
              />
            </Card>
          </Col>
        ))}
      </Row>
      <Modal
        title={selectedOffer ? selectedOffer.title : ''}
        open={modalVisible}
        onCancel={closeModal}
        footer={[
          <Button key="close" onClick={closeModal}>
            Close
          </Button>,
        ]}
      >
        {selectedOffer && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <img
                alt="Offer"
                src={selectedOffer.images && selectedOffer.images.length > 0 ? selectedOffer.images[0] : './medical-clinic.jpg'}
                style={{ width: '40%', height: '200px', objectFit: 'cover' }}
              />
              <div style={{ width: '55%' }}>
                <h2 style={{fontWeight:'bold'}}>Offer Information</h2>
                <p>Description: {selectedOffer.description}</p>
                <p>Price: {selectedOffer.price}</p>
                <p>Discount: {selectedOffer.discount}</p>
                <p>Currency: {selectedOffer.currency}</p>
                <p>Start Date: {formatDate(selectedOffer.startDate)}</p>
                <p>End Date: {formatDate(selectedOffer.endDate)}</p>
              </div>
            </div>
            {selectedOffer.hotel && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <img
                  alt="Hotel"
                  src={selectedOffer.hotel.imageUrls && selectedOffer.hotel.imageUrls.length > 0 ? selectedOffer.hotel.imageUrls[0] : './hotel.jpg'}
                  style={{ width: '40%', height: '200px', objectFit: 'cover' }}
                />
                <div style={{ width: '55%' }}>
                  <h2 style={{fontWeight:'bold'}}>Hotel Information</h2>
                  <p>Name: {selectedOffer.hotel.name}</p>
                  <p>Phone: {selectedOffer.hotel.phone}</p>
                  <p>Email: {selectedOffer.hotel.email}</p>
                  <p>Address: {selectedOffer.hotel.address}</p>
                </div>
              </div>
            )}
            {selectedOffer.clinic && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <img
                  alt="Clinic"
                  src={selectedOffer.clinic.imageUrls && selectedOffer.clinic.imageUrls.length > 0 ? selectedOffer.clinic.imageUrls[0] : './clinic.jpg'}
                  style={{ width: '40%', height: '200px', objectFit: 'cover' }}
                />
                <div style={{ width: '55%' }}>
                  <h2 style={{fontWeight:'bold'}}>Clinic Information</h2>
                  <p>Name: {selectedOffer.clinic.name}</p>
                  <p>Phone: {selectedOffer.clinic.phone}</p>
                  <p>Email: {selectedOffer.clinic.email}</p>
                  <p>Address: {selectedOffer.clinic.address}</p>
                </div>
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default OffersPage;
