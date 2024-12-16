'use strict'

document.addEventListener('DOMContentLoaded', () => {
  const daysInput = document.getElementById('days');
  const totalCostInput = document.getElementById('total_cost');
  const invPriceDay = parseFloat(document.querySelector('input[name="inv_price_day"]').value);

  const calculateTotalCost = () => {
    const days = parseInt(daysInput.value) || 0;
    const totalCost = days * invPriceDay;
    totalCostInput.value = totalCost;
  }

  daysInput.addEventListener('input', calculateTotalCost);
});