
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'realtor-com4.p.rapidapi.com',
          'x-rapidapi-key': import.meta.env.VITE_REALTOR_API_KEY
        }
      };

      try {
        const response = await fetch(
          'https://realtor-com4.p.rapidapi.com/properties/list_v2?location=Austin_TX&limit=10&offset=0&status=for_sale',
          options
        );
        const data = await response.json();

        if (!Array.isArray(data.properties)) {
          throw new Error('Invalid API response');
        }

        const listings = data.properties.map(p => ({
          id: p.property_id,
          name: p.address?.line || 'Unnamed Property',
          city: p.address?.city || 'Austin',
          price: p.price || 0,
          photo: p.primary_photo?.href || '',
          beds: p.beds || '?',
          baths: p.baths_full || '?',
          sqft: p.building_size?.size || '?'
        }));

        setData(listings);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading listings...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>Error loading listings. Check your API key or try again later.</div>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '1rem' }}>🏠 Live Listings - Austin, TX</h1>
      {data.map((item) => (
        <div
          key={item.id}
          style={{
            background: '#fff',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <h2>{item.name}</h2>
          <p><strong>City:</strong> {item.city}</p>
          <p><strong>Price:</strong> ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p><strong>Beds:</strong> {item.beds} | <strong>Baths:</strong> {item.baths}</p>
          <p><strong>Square Feet:</strong> {item.sqft.toLocaleString()}</p>
          {item.photo && (
            <img
              src={item.photo}
              alt="Property"
              style={{ width: '100%', maxWidth: '500px', borderRadius: '8px' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
