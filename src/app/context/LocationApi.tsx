import { encodeQuery } from '../common/commonUtils.tsx';
import fetch from '../api/fetch.tsx';

export const API_URL = 'https://healthcareintourism-test.azurewebsites.net/api';


export const getAllCountries = async (name: string, skipCount: number, maxResultCount: number) => {
  try {
    const queryParams = encodeQuery({ name, skipCount, maxResultCount });
    const url = `${API_URL}/Location/GetAllCountries${queryParams}`;
    const response = await fetch.get(url);

    if (response.status !== 200) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response.data.items;
  } catch (error) {
    return {
      error: true,
      msg: (error as any).response.data.items,
    };
  }
};
export const getByCountryId = async (id ?: number) => {
  try {
    const queryParams = encodeQuery({ id});
    const url = `${API_URL}/Location/GetByCountryId${queryParams}`;
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

export const createCountry = async (name: string) => {
  try {
    const queryParams = { name };
    const url = `${API_URL}/Location/CreateCountry`;
    const response = await fetch.post(url, queryParams);

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

export const deleteCountry = async (id: number) => {
  try {
    const queryParams = encodeQuery({ id });
    const url = `${API_URL}/Location/DeleteCountry`;
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
export const updateCountry = async (id: number, name: string) => {
  try {
    const queryParams = encodeQuery({ id, name });
    const url = `${API_URL}/Location/UpdateCountry`;
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
export const getAllCities = async () => {
    try {
      // const queryParams = encodeQuery({ name, skipCount, maxResultCount });
      const url = `${API_URL}/Location/GetAllCities`;
      const response = await fetch.get(url);
  
      if (response.status !== 200) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
    return data.data.items; 
      
    } catch (error) {
      return {
        error: true,
        msg: (error as any).response,
      };
    }
  };
  export const getByCityId = async (id ?: number) => {
    try {
      const queryParams = encodeQuery({ id});
      const url = `${API_URL}/Location/GetByCityId${queryParams}`;
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
  
  export const createCity = async (name: string, countryId: number) => {
    try {
      const queryParams = { name, countryId };
      const url = `${API_URL}/Location/CreateCity`;
      const response = await fetch.post(url, queryParams);
  
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
  
  export const deleteCity = async (id: number) => {
    try {
      const queryParams = encodeQuery({ id });
      const url = `${API_URL}/Location/DeleteCity`;
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
  export const updateCity = async (id: number, name: string, countryId: number) => {
    try {
      const queryParams = encodeQuery({ id, name, countryId });
      const url = `${API_URL}/Location/UpdateCity`;
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
  export const getAllRegions = async (name?: string, skipCount?: number, maxResultCount?: number) => {
    try {
      const queryParams = encodeQuery({ name, skipCount, maxResultCount });
      const url = `${API_URL}/Location/GetAllRegions${queryParams}`;
      const response = await fetch.get(url);
  
      if (response.status !== 200) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.data.items;
    } catch (error) {
      return {
        error: true,
        msg: (error as any).response.data.data,
      };
    }
  };
  export const getByRegionId = async (id ?: number) => {
    try {
      const queryParams = encodeQuery({ id});
      const url = `${API_URL}/Location/GetByRegionId${queryParams}`;
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
  
  export const createRegion = async (name: string, cityId: number) => {
    try {
      const queryParams = { name, cityId };
      const url = `${API_URL}/Location/CreateRegion`;
      const response = await fetch.post(url, queryParams);
  
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
  
  export const deleteRegion = async (id: number) => {
    try {
      const queryParams = encodeQuery({ id });
      const url = `${API_URL}/Location/DeleteRegion`;
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
  export const updateRegion = async (id: number, name: string, cityId: number) => {
    try {
      const queryParams = encodeQuery({ id, name, cityId });
      const url = `${API_URL}/Location/UpdateRegion`;
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