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
  const numPayments = 30 * 12*
