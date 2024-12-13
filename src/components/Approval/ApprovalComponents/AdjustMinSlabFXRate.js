import React, {useState, useEffect} from 'react';
import {API_URL} from '../../ApiUrl';

const AdjustMinSlabFXRate = ({FromCurrency, ToCurrency, setFxRate}) => {
  const [taxCurrency, setTaxCurrency] = useState(null);
  const fromCurrency = FromCurrency; // This is a constant for the bill currency

  useEffect(() => {
    const getExchangeRate = async () => {
      console.log(
        'FromCurrency:^:',
        FromCurrency,
        '____taxCurrency',
        ToCurrency,
      );
      if (FromCurrency === ToCurrency) {
        setFxRate(1);
      } else {
        try {
          let fx = [];
          let fxsql = `select xrate from exchange_master where currency1='${FromCurrency}' and currency2='${ToCurrency}'`;

          // Fetch exchange rate
          const response1 = await fetch(
            `${API_URL}/api/common/loadContents?sql=${encodeURIComponent(
              fxsql,
            )}`,
          );
          const fxResult1 = await response1.json();
          console.log('fxresult slab::', fxResult1);
          fx = fxResult1;

          if (fxResult1.length > 0) {
            setFxRate(parseFloat(fx[0].toString()));
          } else {
            fx = [];
            fxsql = `select 1/xrate from exchange_master where currency1='${ToCurrency}' and currency2='${FromCurrency}'`;

            const response2 = await fetch(
              `${API_URL}/api/common/loadContents?sql=${encodeURIComponent(
                fxsql,
              )}`,
            );
            const fxResult2 = await response2.json();
            console.log('fxresult2 slab::', fxResult2);
            fx = fxResult2;

            if (fx.length > 0) {
              setFxRate(parseFloat(fx[0].toString()));
            } else {
              console.log(
                'Tax Currency not added in exchange master. Please add and then proceed the payment',
              );
              // Add any additional handling logic as needed
            }
          }
        } catch (error) {
          console.error('Error fetching exchange rate:', error);
        }
      }
    };

    getExchangeRate();
  }, [FromCurrency, ToCurrency]);
};

export default AdjustMinSlabFXRate;
