import React, { useState, useEffect } from 'react';
import clinicsData from '../../components/clinicsData.json'
import './clinics.css';
import axios from 'axios';
import { Select } from 'antd';

const { Option } = Select;
interface Clinic {
    photo: string;
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
}
export interface CityAtt {
    name: string,
    countryId : number,
    id: number
  }
const Clinics: React.FC = () => {
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [cities, setCities] = useState<CityAtt[]>([]);
    const [selectedCity, setSelectedCity] =useState<any>();
    const [currentPage, setCurrentPage] = useState(1);
    const [clinicsPerPage] = useState(6); // Number of clinics per page
    const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([]);
    const [searchName, setSearchName] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');

    const fetchClinics = async () => {
        try {
          const response = await axios.get('https://healthcareintourism-test.azurewebsites.net/api/Clinic/GetAllClinics');
          setClinics(response.data.data.items);
        } catch (error) {
          console.error('Error fetching the cities:', error);
        }
    };
    const handleCitySelect = (value: any) => {
        const selectedCity = cities.find(city => city.id === value);
        setSelectedCity(selectedCity);
    }
    const fetchCities = async () => {
        try {
          const response = await axios.get('https://healthcareintourism-test.azurewebsites.net/api/Location/GetAllCities');
          setCities(response.data.items);
        } catch (error) {
          console.error('Error fetching the cities:', error);
        }
      };

    useEffect(() => {
        fetchClinics();
        fetchCities();
        setFilteredClinics(clinicsData);
    }, []);

    useEffect(() => {
        // Filter clinics based on search criteria
        let filtered = clinics.filter(clinic =>
            clinic.name.toLowerCase().includes(searchName.toLowerCase()) ||
            clinic.description.toLowerCase().includes(searchName.toLowerCase())
        );

        if (selectedLocation) {
            filtered = filtered.filter(clinic => clinic.address.includes(selectedLocation));
        }

        setFilteredClinics(filtered);
    }, [clinics, searchName, selectedLocation]);

    // Get current clinics
    const indexOfLastClinic = currentPage * clinicsPerPage;
    const indexOfFirstClinic = indexOfLastClinic - clinicsPerPage;
    const currentClinics = clinics.slice(indexOfFirstClinic, indexOfLastClinic);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

        return (
            <div className="clinics-page">
                <div className="header">
                    <h1 style={{textAlign:'center', fontSize:42, fontFamily:'sans-serif'}}>Clinics</h1>
                    </div>
                    <div className="filter-dropdowns">
                    <input
                         type="text"
                         placeholder="Search..."
                         className='searchFilter'
                         value={searchName}
                         onChange={(e) => setSearchName(e.target.value)}
                    />
                        <Select 
                        showSearch
                        placeholder="Select a city"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        style={{width: 200}}
                        onChange={handleCitySelect}>
                            {cities && cities.map((cities) => (
                    <Option key={cities.id} value={cities.id}>
                      {cities.name}
                      </Option>
                        ))}
                        </Select>
                        <button className="filter-button" onClick={() => {
                           setSearchName('');
                           setSelectedLocation('');
                        }}>Clear Filters</button>
                       <button className="filter-button" onClick={() => setCurrentPage(1)}>Search</button>
                </div>
                <div className="clinics-section">
                    <div className="clinics-container">
                        {currentClinics.map((clinic: Clinic, index: number) => (
                            <div className="clinic-card" key={index}>
                               {clinic.imageUrls.length > 0 && (
                               <img src={clinic.imageUrls[0]} alt={`Image 1`} />
                                )}
                                <div className="clinic-details">
                                    <h3>{clinic.name}</h3>
                                    <p><strong>Speciality:</strong> {clinic.description}</p>
                                    <p><strong>Location:</strong> {clinic.address}</p>
                                    <p><strong>Phone:</strong> {clinic.phone}</p>
                                    <p><strong>Email:</strong> {clinic.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pagination">
                        {Array.from({ length: Math.ceil(filteredClinics.length / clinicsPerPage) }, (_, i) => (
                            <button key={i} onClick={() => paginate(i + 1)}>{i + 1}</button>
                        ))}
                    </div>
                </div>
            </div>
        );
};

export default Clinics;
