import React, { useState, useEffect } from 'react';
import { Table, Pagination, Spin, Button, Modal, Upload } from 'antd';
import { UploadOutlined} from '@ant-design/icons';
import axios from 'axios';
import CreateOffer from './createOffer.tsx';
import '../../superAdmin/superAdmin.css';

const OffersTable: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [offers, setOffers] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingOffer, setEditingOffer] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<string[]>([]);
  const pageSize = 15;

  useEffect(() => {
    fetchOffers(currentPage);
  }, [currentPage]);

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    setIsModalVisible(false);
    fetchOffers(currentPage);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    fetchOffers(currentPage);
  };
  // const handleEditClick = (offer: any) => {
  //   setEditingOffer(offer);
  //   setImages(offer.images || []);
  //   setModalVisible(true);
  //   fetchOffers(currentPage);
  // };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingOffer(null);
    setImages([]);
    setNewImages([]);
    fetchOffers(currentPage);
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
        setNewImages(base64Images);
      })
      .catch((error) =>
        console.error('Error converting images to base64:', error)
      );
  };

  const handleAddImage = async () => {
    if (!editingOffer) {
      console.error('Editing offer is null.');
      return;
    }

    try {
      const response = await axios.put(
        'https://healthcareintourism-test.azurewebsites.net/api/Offer/UpdateOffer',
        {
          clincId: editingOffer.clinicId,
          hotelId: editingOffer.hotelId,
          treatmentId: editingOffer.treatmentId,
          title: editingOffer.title,
          description: editingOffer.description,
          currency: editingOffer.currency,
          price: editingOffer.price,
          discount: editingOffer.discount,
          isActive: editingOffer.isActive,
          startDate: editingOffer.startDate,
          endDate: editingOffer.endDate,
          imagesToAdd: newImages.map((image) => `data:image/jpeg;base64,${image}`),
          id:editingOffer.id,
          imagesToRemove: []
        }
      );

      if (response.status === 200) {
        setImages([...images, ...newImages]);
        setNewImages([]);
        fetchOffers(currentPage);
      } else {
        throw new Error('Error adding images');
      }
    } catch (error) {
      console.error('Error adding images:', error);
    }
  };


  const fetchOffers = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get('https://healthcareintourism-test.azurewebsites.net/api/Search/SearchOffers', {
        params: {
          SkipCount: (page - 1) * pageSize,
          MaxResultCount: pageSize,
        },
      });
      setOffers(response.data.data.items);
      setTotalCount(response.data.data.totalCount);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
    setLoading(false);
  };

  const columns = [
    { title: 'Hotel Name', dataIndex: ['hotel', 'name'], key: 'hotelName' },
    { title: 'Clinic Name', dataIndex: ['clinic', 'name'], key: 'clinicName' },
    { title: 'Treatment', dataIndex: 'treatment', key: 'treatment' },
    { title: 'Start Date', dataIndex: 'startDate', key: 'startDate' },
    { title: 'End Date', dataIndex: 'endDate', key: 'endDate' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Currency', dataIndex: 'currency', key: 'currency' },
    { title: 'Discount', dataIndex: 'discount', key: 'discount' },
    { title: 'Start Date', dataIndex: 'startDate', key: 'startDate' },
    { title: 'End Date', dataIndex: 'endDate', key: 'endDate' },
    { title: 'Agency Name', dataIndex: ['agency', 'name'], key: 'agencyName' },
    // {
    //     title: 'Action',
    //     key: 'action',
    //     render: (text: any, record: any) => (
    //       <Button
    //         icon={<EditOutlined />}
    //         onClick={() => handleEditClick(record)}
    //       />
    //     ),
    //   },
  ];

  const handleTableChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div style={{ display: 'flex', marginBottom: 17, width:150 , marginLeft:20}}>
        <h2 style={{color:'white'}}>Offers</h2>
        <Button type="primary" style={{backgroundColor:'GrayText'}} onClick={showModal}>Create</Button>
      </div>
      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <div>
          <Table
            columns={columns}
            dataSource={offers}
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
          <CreateOffer />
      </Modal>
      <Modal
        title="Edit Offer"
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button key="add" type="primary" onClick={handleAddImage}>
            Add Images
          </Button>,
        ]}
      >


        <h3>Add New Images</h3>
        <Upload
          listType="picture"
          multiple
          onChange={handleFileChange}
          beforeUpload={() => false}
        >
          <Button icon={<UploadOutlined />}>Upload Images</Button>
        </Upload>
      </Modal>
    </div>
  );
};

export default OffersTable;
