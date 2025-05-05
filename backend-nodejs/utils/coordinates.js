const axios = require('axios');

const getCoordinate = async (district, sector) => {
  if (!district || !sector) return { latitude: null, longitude: null };

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(`${sector},${district},Rwanda`)}`;

  try {
    const resp = await axios.get(url, { 
      headers: { 
        'User-Agent': 'YourAppName/1.0 (contact@yourapp.com)',
        'Accept-Language': 'en'
      },
      timeout: 5000
    });

    if (resp.data?.length > 0) {
      return {
        latitude: parseFloat(resp.data[0].lat),
        longitude: parseFloat(resp.data[0].lon)
      };
    }
    return { latitude: null, longitude: null };
  } catch (err) {
    console.error('Geocoding failed:', err.message);
    return { latitude: null, longitude: null };
  }
};

module.exports = { getCoordinate };
