import num2words from 'num2words';

export const NumToWordsCon = (amount, currency) => {
  const [integerPart, fractionalPart] = amount.toFixed(2).split('.');

  // Convert the integer part to words
  const integerWords = num2words(integerPart, { lang: 'en' });

  // Convert the fractional part to words only if it's not zero
  const fractionalWords = 
    fractionalPart === '00' ? '' : `and ${num2words(fractionalPart, { lang: 'en' })}`;

  // Define currency labels
  const currencyLabels = {
    USD: 'US Dollars',
    INR: 'Rupees',
  };

  const currencyCents = {
    USD: 'Cents',
    INR: 'Paise',
  };

  return `${currencyLabels[currency]} ${integerWords} ${fractionalWords} ${
    fractionalPart === '00' ? '' : currencyCents[currency]
  } only`.trim();
};

// Example Usage
console.log(NumToWordsCon(190000, 'USD')); // Output: Dollars Nineteen only
console.log(NumToWordsCon(19.5, 'USD')); // Output: Dollars Nineteen and Fifty Cents only
console.log(NumToWordsCon(19000, 'INR')); // Output: Rupees Nineteen only
console.log(NumToWordsCon(19.5, 'INR')); // Output: Rupees Nineteen and Fifty Paise only
