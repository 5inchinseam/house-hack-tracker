import { useState, useEffect } from 'react';

// Example property data (to simulate API response)
const properties = [
  {
    name: "Southtown / Lavaca",
    city: "San Antonio",
    price: 400000,
    rentPerUnit: 1695,
    units: 2,
    walkability: 84,
    drivability: 92,
    rating: "A"
  },
  {
    name: "Eastwood",
    city: "Houston",
    price: 391500,
    rentPerUnit: 1726,
    units: 2,
    walkability: 76,
    drivability: 88,
    rating: "B+"
  }
];

// Constants
const FHA_RATE = 0.035;
const FHA_MIP = 0.0175;
const CLOSING_COST_RATE = 0.03;
const PROPERTY_TAX_RATE = 0.0185;
const INSURANCE_RATE = 0.0035;
const INTEREST_RATE = 0.0693;

function calcMortgage(price) {
  const downPayment = price * FHA_RATE;
  const loan = price - downPayment;
  const monthlyRate = INTEREST_RATE / 12;
  const numPayments = 30 * 12;

  const baseMortgage = (loan * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numPayments));
  const propertyTax = (price * PROPERTY_TAX_RATE) / 12;
  const insurance = (price * INSURANCE_RATE) / 12;

  return {
    monthly: baseMortgage + propertyTax + insurance,
    downPayment,
    loan,
    tax: price * PROPERTY_TAX_RATE,
    insurance: price * INSURANCE_RATE,
    mip: loan * FHA_MIP,
    closing: price * CLOSING_COST_RATE,
  };
}

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const enriched = properties.map(p => {
      const costs = calcMortgage(p.price);
      const totalRent = p.rentPerUnit * p.units;
      const netRent = totalRent - costs.monthly;
      const yieldPercent = (totalRent * 12) / p.price * 100;
      const totalUpfront = costs.downPayment + costs.mip + costs.tax + costs.insurance + costs.closing;

      return { ...p, ...costs, totalRent, netRent, yieldPercent, totalUpfront };
    });
    setData(enriched);
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '1rem' }}>🏠 House Hack Tracker (Investor View)</h1>
      {data.map((item, idx) => (
        <div key={idx} style={{ background: '#fff', padding: '1rem', marginBottom: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>{item.name} — {item.city}</h2>
          <p><strong>Home Price:</strong> ${item.price.toLocaleString()}</p>
          <p><strong>Down Payment (3.5%):</strong> ${item.downPayment.toFixed(0)}</p>
          <details>
            <summary style={{ cursor: 'pointer' }}>View Additional Upfront Costs</summary>
            <ul>
              <li>FHA MIP: ${item.mip.toFixed(0)}</li>
              <li>Property Taxes: ${item.tax.toFixed(0)}</li>
              <li>Insurance: ${item.insurance.toFixed(0)}</li>
              <li>Closing Costs: ${item.closing.toFixed(0)}</li>
            </ul>
          </details>
          <p><strong>Total Upfront Costs:</strong> ${item.totalUpfront.toFixed(0)}</p>
          <p><strong>Loan Amount:</strong> ${item.loan.toFixed(0)}</p>
          <p><strong>Est. Monthly Mortgage:</strong> ${item.monthly.toFixed(0)}</p>
          <hr />
          <p><strong>Units:</strong> {item.units} — Rent/Unit: ${item.rentPerUnit}</p>
          <p><strong>Total Rent:</strong> ${item.totalRent}</p>
          <p><strong>Cashflow (1 unit occupied):</strong> ${item.netRent - item.rentPerUnit}</p>
          <p><strong>Rental Yield:</strong> {item.yieldPercent.toFixed(1)}%</p>
          <hr />
          <p><strong>Rating:</strong> {item.rating}</p>
          <p>🚶 Walkability: {item.walkability}/100 | 🚗 Drivability: {item.drivability}/100</p>
        </div>
      ))}
    </div>
  );
}
