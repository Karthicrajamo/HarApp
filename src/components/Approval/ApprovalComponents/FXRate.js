import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native';
import {API_URL} from '../../ApiUrl';

const CurrencyConversion = ({BillCurrency, setFxRate}) => {
  const [taxCurrency, setTaxCurrency] = useState(null);
  const billCurrency = BillCurrency; // This is a constant for the bill currency

  useEffect(() => {
    const getTaxCurrency = async () => {
      try {
        console.log('BillCurrency::', BillCurrency);
        // SQL query to get the TAX_CURRENCY
        const taxCurrencyQuery = `select TAX_CURRENCY from financial_cycle where rownum = 1`;

        const response = await fetch(
          `${API_URL}/api/common/loadContents?sql=${encodeURIComponent(
            taxCurrencyQuery,
          )}`,
        );
        const taxCurrencyResult = await response.json();
        console.log('Tax Currency Result:', taxCurrencyResult);

        if (taxCurrencyResult.length > 0) {
          setTaxCurrency(taxCurrencyResult[0].TAX_CURRENCY);
          // setTDSCurrency(taxCurrencyResult);
        } else {
          console.error('Tax currency not found.');
        }
      } catch (error) {
        console.error('Error fetching tax currency:', error);
      }
    };

    getTaxCurrency();
  }, []);

  useEffect(() => {
    const getExchangeRate = async () => {
      if (billCurrency === taxCurrency) {
        setFxRate(1);
      } else {
        try {
          let fx = [];
          let fxsql = `select xrate from exchange_master where currency1='${billCurrency}' and currency2=(select TAX_CURRENCY from financial_cycle where rownum = 1)`;

          // Fetch exchange rate
          const response1 = await fetch(
            `${API_URL}/api/common/loadContents?sql=${encodeURIComponent(
              fxsql,
            )}`,
          );
          const fxResult1 = await response1.json();
          console.log('fxresult::', fxResult1);
          fx = fxResult1;

          if (fxResult1.length > 0) {
            setFxRate(parseFloat(fx[0].toString()));
          } else {
            fx = [];
            fxsql = `select 1/xrate from exchange_master where currency1=(select TAX_CURRENCY from financial_cycle where rownum = 1) and currency2='${billCurrency}'`;

            const response2 = await fetch(
              `${API_URL}/api/common/loadContents?sql=${encodeURIComponent(
                fxsql,
              )}`,
            );
            const fxResult2 = await response2.json();
            console.log('fxresult2::', fxResult2);
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
  }, [billCurrency, taxCurrency]);
};

export default CurrencyConversion;