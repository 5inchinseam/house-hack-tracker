import { useEffect, useState } from 'react';

const FHA_INTEREST_RATE = 6.93; // April 2025 default
const DOWN_PAYMENT_PERCENT = 3.5;
const PROPERTY_TAX_INSURANCE_RATE = 2.25;

const neighborhoods = [
  {
    name: 'Southtown / Lavaca',
    city: 'San Antonio',
    price: 400000,
    rentPerUnit: 1695,
    units: 2,
  },
  {
    name: 'Eastwood',
    city: 'Houston',
    price: 391500,
    rentPerUnit: 1726,
    units: 2,
  },
  {
    name: 'East Austin (78702)',
    city: 'Austin',
    price: 722500,
    rentPerUnit: 2635,
    units: 2,
  },
  {
    name: 'Near Southside',
    city: 'Fort Worth',
    price: 544000,
    rentPerUnit: 1430,
    units: 2,
  },
  {
    name: 'Bishop Arts District',
    city: 'Dallas',
    price: 625000,
    rentPerUnit: 1609,
    units: 2,
  }
];

function calculateMortgage(price) {
  const downPayment = price * (DOWN_PAYMENT_PERCENT / 100);
  const loanAmount = price - downPayment;
  const monthlyInterest = FHA_INTEREST_RATE / 100 / 12;
  const numberOfPayments = 30 * 12;
  const basePayment =
    (loanAmount * monthlyInterest) /
    (1 - Math.pow(1 + monthlyInterest, -numberOfPayments));
  const taxesAndInsurance = (price * (PROPERTY_TAX_INSURANCE_RATE / 100)) / 12;
  return basePayment + taxesAndInsurance;
}

export default function Home() {
  const [data, setData] = useState([]);
  const [cityFilter, setCityFilter] = useState('');

  useEffect(() => {
    const updated = neighborhoods.map((n) => {
      const mortgage = calculateMortgage(n.price);
      const totalRent = n.rentPerUnit * n.units;
      const netRent = totalRent - mortgage;
      const yieldPercent = (totalRent * 12) / n.price * 100;
      return { ...n, mortgage, totalRent, netRent, yieldPercent };
    });
    setData(updated);
  }, []);

  const filtered = data.filter((n) =>
    cityFilter === '' ? true : n.city.toLowerCase().includes(cityFilter.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '1rem' }}>
        Texas House Hack Tracker
      </h1>

      <input
        type="text"
        placeholder="Filter by city..."
        value={cityFilter}
        onChange={(e) => setCityFilter(e.target.value)}
        style={{ padding: '10px', fontSize: '16px', marginBottom: '20px', width: '300px' }}
      />

      {filtered.map((item) => (
        <div
          key={item.name}
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem'
          }}
        >
          <h2>{item.name}, {item.city}</h2>
          <p>Price: ${item.price.toLocaleString()}</p>
          <p>Est. Monthly Mortgage: ${item.mortgage.toFixed(0)}</p>
          <p>Total Rent (All Units): ${item.totalRent}</p>
          <p>Net Rent (1 Unit Occupied): ${(item.netRent - item.rentPerUnit).toFixed(0)}</p>
          <p>Rental Yield: {item.yieldPercent.toFixed(1)}%</p>
        </div>
      ))}
    </div>
  );
}
