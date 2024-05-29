import { encodeQuery } from '../common/commonUtils.tsx';
import fetch from '../api/fetch.tsx';

export const API_URL = 'https://healthcareintourism-test.azurewebsites.net/api';

//Clinics

export const createClinic = async (name: string, latitude: number, longitude: number, regionId: number, cityId: number, countryId: number, address: string , phone: string , email : string , description: string) => {
  try {
    const queryParams = { name, latitude, longitude, regionId, cityId, countryId, address , phone , email , description};
    const url = `${API_URL}/Clinic/CreateClinic`;
    const response = await fetch.post(url, queryParams);

    if (response.status !== 200) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response.data.data;
  } catch (error) {
    return {
      error: true,
      msg: (error as any).response.data.data,
    };
  }
};

export const updateClinic = async (name: string, latitude: number, longitude: number, regionId: number, cityId: number, countryId: number, address: string , phone: string , email : string , description: string) => {
    try {
      const queryParams = encodeQuery({ name, latitude, longitude, regionId, cityId, countryId, address , phone , email , description });
      const url = `${API_URL}/Clinic/UpdateClinic`;
      const response = await fetch.put(url, queryParams);
  
      if (response.status !== 200) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.data;
    } catch (error) {
      return {
        error: true,
        msg: (error as any).response.data,
      };
    }
  };

export const deleteClinic = async (id: number) => {
  try {
    const queryParams = encodeQuery({ id });
    const url = `${API_URL}/Clinic/DeleteClinic`;
    const response = await fetch.delete(url, queryParams);

    if (response.status !== 200) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response.data;
  } catch (error) {
    return {
      error: true,
      msg: (error as any).response.data,
    };
  }
};

export const getAllClinics = async (name?: string, skipCount?: number, maxResultCount?: number) => {
    try {
      const queryParams = encodeQuery({ name, skipCount, maxResultCount });
      const url = `${API_URL}/Clinic/GetAllClinics${queryParams}`;
      const response = await fetch.get(url);
  
      if (response.status !== 200) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      return data.data.items; 
    } catch (error) {
      return {
        error: true,
        msg: (error as any).response.data.items,
      };
    }
  };
  export const getClinicById = async (id ?: number) => {
    try {
      const queryParams = encodeQuery({ id});
      const url = `${API_URL}/Clinic/GetClinicById${queryParams}`;
      const response = await fetch.get(url);
  
      if (response.status !== 200) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.data.data;
    } catch (error) {
      return {
        error: true,
        msg: (error as any).response.data.data,
      };
    }
  };
 
  //Hotels
  export const createHotel = async (name: string, latitude: number, longitude: number,star: number, description: string, regionId: number, cityId: number, countryId: number, address: string , phone: string , email : string ) => {
    try {
      const queryParams = { name, latitude, longitude, star, description, regionId, cityId, countryId, address , phone , email };
      const url = `${API_URL}/Hotel/CreateHotel`;
      const response = await fetch.post(url, queryParams);
  
      if (response.status !== 200) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.data.data;
    } catch (error) {
      return {
        error: true,
        msg: (error as any).response.data.data,
      };
    }
  };
  
  export const updateHotel = async (name: string, latitude: number, longitude: number, star: number,description: string, regionId: number, cityId: number, countryId: number, address: string , phone: string , email : string ) => {
      try {
        const queryParams = encodeQuery({ name, latitude, longitude,star, description, regionId, cityId, countryId, address , phone , email  });
        const url = `${API_URL}/Hotel/UpdateHotel`;
        const response = await fetch.put(url, queryParams);
    
        if (response.status !== 200) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.data.data;
      } catch (error) {
        return {
          error: true,
          msg: (error as any).response.data.data,
        };
      }
    };
    
    export const getAllHotels = async (name?: string, skipCount?: number, maxResultCount?: number) => {
        try {
          const queryParams = encodeQuery({ name, skipCount, maxResultCount });
          const url = `${API_URL}/Hotel/GetAllHotels${queryParams}`;
          const response = await fetch.get(url);
      
          if (response.status !== 200) {
            throw new Error(`Request failed with status ${response.status}`);
          }
          return response.data.data;
        } catch (error) {
          return {
            error: true,
            msg: (error as any).response.data.data,
          };
        }
      };

  export const deleteHotel = async (id: number) => {
    try {
      const queryParams = encodeQuery({ id });
      const url = `${API_URL}/Hotel/DeleteHotel`;
      const response = await fetch.delete(url, queryParams);
  
      if (response.status !== 200) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.data.data;
    } catch (error) {
      return {
        error: true,
        msg: (error as any).response.data.data,
      };
    }
  };

    export const getByHotelId = async (id ?: number) => {
      try {
        const queryParams = encodeQuery({ id});
        const url = `${API_URL}/Clinic/GetHotelById${queryParams}`;
        const response = await fetch.get(url);
    
        if (response.status !== 200) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.data;
      } catch (error) {
        return {
          error: true,
          msg: (error as any).response.data,
        };
      }
    };

    //Search
    export const getSearchOffers = async (skipCount?: number, maxResultCount?: number) => {
        try {
          const queryParams = encodeQuery({ skipCount, maxResultCount });
          const url = `${API_URL}/Search/SearchOffers${queryParams}`;
          const response = await fetch.get(url);
      
          if (response.status !== 200) {
            throw new Error(`Request failed with status ${response.status}`);
          }
          return response.data;
        } catch (error) {
          return {
            error: true,
            msg: (error as any).response.data,
          };
        }
      };