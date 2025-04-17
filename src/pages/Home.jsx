import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState([]);

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

        const listings = data.properties.map(p => ({
          id: p.property_id,
          name: p.address.line || 'Unnamed Property',
          city: p.address.city || 'Austin',
          price: p.price
