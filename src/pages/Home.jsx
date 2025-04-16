
// House Hack Tracker - Core React App (Vite + Tailwind) + Live API Hooks

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const FHA_INTEREST_RATE = 6.93; // April 2025 default
const DOWN_PAYMENT_PERCENT = 3.5;
const PROPERTY_TAX_INSURANCE_RATE = 2.25;

// Placeholder for static fallback (until API connected)
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
    async function fetchNeighborhoods() {
      try {
        const fetchedData = neighborhoods.map((n) => {
          const mortgage = calculateMortgage(n.price);
          const totalRent = n.rentPerUnit * n.units;
          const netRent = totalRent - mortgage;
          const yieldPercent = (totalRent * 12) / n.price * 100;
          return { ...n, mortgage, totalRent, netRent, yieldPercent };
        });
        setData(fetchedData);
      } catch (err) {
        console.error('API fetch failed:', err);
        setData([]);
      }
    }
    fetchNeighborhoods();
  }, []);

  const filtered = data.filter((n) =>
    cityFilter === '' ? true : n.city.toLowerCase().includes(cityFilter.toLowerCase())
  );

  return (
    <div className="p-4 grid gap-4">
      <h1 className="text-2xl font-bold">Texas House Hack Tracker</h1>

      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Filter by city..."
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        />
      </div>

      {filtered.map((item) => (
        <Card key={item.name}>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold">{item.name}, {item.city}</h2>
            <p>Price: ${item.price.toLocaleString()}</p>
            <p>Est. Monthly Mortgage: ${item.mortgage.toFixed(0)}</p>
            <p>Total Rent (All Units): ${item.totalRent}</p>
            <p>Net Rent (1 Unit Occupied): ${item.netRent - item.rentPerUnit}</p>
            <p>Rental Yield: {item.yieldPercent.toFixed(1)}%</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
