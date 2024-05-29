import React, { useEffect, useRef, useState } from 'react';
import './hotels.css'; 

interface CustomHotelData {
  name: string;
  vicinity: string;
  place_id: string;
}

const MapPage: React.FC = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [nearbyHotels, setNearbyHotels] = useState<google.maps.places.PlaceResult[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<google.maps.places.PlaceResult | CustomHotelData>();
  const [selectedFromList, setSelectedFromList] = useState<boolean>(false);
  const hotelListRef = useRef<HTMLUListElement>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    // Load the Google Maps JavaScript API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAtcTm3CJHafsnCcowGCJkSTNZ-v-SUcl4&libraries=places`;
    script.async = true;
    script.onload = initializeMap;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  

  const initializeMap = () => {
    const infoWindow = new google.maps.InfoWindow();
    infoWindowRef.current = infoWindow;

    if (navigator.geolocation) {
      // Request user's location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          const mapOptions: google.maps.MapOptions = {
            center: userLocation,
            zoom: 14,
            streetViewControlOptions: {
              position: google.maps.ControlPosition.RIGHT_BOTTOM,
            },
            gestureHandling: 'cooperative',
          };
          const map = new window.google.maps.Map(document.getElementById('map') as HTMLElement, mapOptions);
          setMap(map);
          fetchNearbyHotels(map, userLocation);
        },
        () => {
          //default to Antalya
          const defaultLocation = { lat: 36.8969, lng: 30.7133 };
          const mapOptions: google.maps.MapOptions = {
            center: defaultLocation,
            zoom: 12,
          };
          const map = new window.google.maps.Map(document.getElementById('map') as HTMLElement, mapOptions);
          setMap(map);
          fetchNearbyHotels(map, defaultLocation);
        }
      );
    } else {
      // default to Antalya
      const defaultLocation = { lat: 36.8969, lng: 30.7133 };
      const mapOptions: google.maps.MapOptions = {
        center: defaultLocation,
        zoom: 12,
      };
      const map = new window.google.maps.Map(document.getElementById('map') as HTMLElement, mapOptions);
      setMap(map);
      fetchNearbyHotels(map, defaultLocation);
    }
  };

  const fetchNearbyHotels = (map: google.maps.Map, location: google.maps.LatLngLiteral) => {
    // search for nearby places
    const placesService = new window.google.maps.places.PlacesService(map);

    //request for nearby hotels
    const request: google.maps.places.PlaceSearchRequest = {
      location: location,
      radius: 5000, // in meters
      type: 'lodging', // lodging places (hotels)
    };

    // Search for hotels
    placesService.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        if (!selectedFromList) {
          // Add markers for each hotel
          setNearbyHotels(results);
          results.forEach((place) => {
            const marker = new window.google.maps.Marker({
              position: place.geometry?.location!,
              map: map,
              title: place.name,
            });
            marker.addListener('click', () => {
              map.setCenter(place.geometry?.location!);
              map.setZoom(16);
              setSelectedHotel(place);
              setSelectedFromList(false);
              infoWindowRef.current?.setContent(place.name);
              infoWindowRef.current?.open(map, marker);

              const selectedHotelElement = hotelListRef.current?.querySelector(`[data-place-id="${place.place_id}"]`);
               if (selectedHotelElement) {
                    selectedHotelElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
          });
        }
      }
    });
  };
  const handleListHotelClick = (hotel: google.maps.places.PlaceResult | CustomHotelData, fromList: boolean) => {
    setSelectedFromList(fromList);
    setSelectedHotel(hotel);
    if (map) {
      if ('geometry' in hotel) {
          map.setCenter(hotel.geometry?.location!);
      }
      map.setZoom(16);
  }

    // Scroll the list to bring the selected hotel into view
    if (hotelListRef.current ) {
      const selectedHotelElement = hotelListRef.current.querySelector(`[data-place-id="${hotel.place_id}"]`);
      if (selectedHotelElement) {
        selectedHotelElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="map-page">
      <div className="hotel-list">
        <h1>Nearby Hotels</h1>
        <ul ref={hotelListRef}>
          {nearbyHotels.map((hotel, index) => (
            <li
              key={index}
              onClick={() => handleListHotelClick(hotel, true)}
              className={selectedHotel === hotel ? 'selected' : ''}
              data-place-id={hotel.place_id} 
            >
              <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>{hotel.name}</h3>
              <p>{hotel.vicinity}</p>
            </li>
          ))}
        </ul>
      </div>
      <div id="map" className="rounded-map"></div>
    </div>
  );
};

export default MapPage;
