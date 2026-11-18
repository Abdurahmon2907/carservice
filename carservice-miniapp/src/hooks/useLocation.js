import { useEffect } from 'react';
import useAppStore from '../store/useAppStore';

const useLocation = () => {
  const { location, setLocation } = useAppStore();

  useEffect(() => {
    if (location) return;

    if (!navigator.geolocation) {
      setLocation({ lat: 41.2995, lng: 69.2401 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      ()    => setLocation({ lat: 41.2995, lng: 69.2401 })
    );
  }, []);

  return location;
};

export default useLocation;