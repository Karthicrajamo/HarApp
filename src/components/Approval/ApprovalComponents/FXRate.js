import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { API_URL } from '../../ApiUrl';

const CurrencyConversion = ({ BillCurrency, setFxRate }) => {
  const [taxCurrency, setTaxCurrency] = useState(null);
  const billCurrency = BillCurrency;

  // Fetch tax currency on component mount
  useEffect(() => {
    const fetchTaxCurrency = async () => {
      try {
        const taxCurrencyQuery = `SELECT TAX_CURRENCY FROM financial_cycle WHERE ROWNUM = 1`;
        const response = await fetch(
          `${API_URL}/api/common/loadContents?sql=${encodeURIComponent(
            taxCurrencyQuery
          )}`
        );
        const taxCurrencyResult = await response.json();

        if (Array.isArray(taxCurrencyResult) && taxCurrencyResult.length > 0) {
          setTaxCurrency(taxCurrencyResult[0].TAX_CURRENCY);
        } else {
          console.error('Tax currency not found in the database.');
        }
      } catch (error) {
        console.error('Error fetching tax currency:', error);
      }
    };

    fetchTaxCurrency();
  }, [BillCurrency]);

  // Fetch exchange rate whenever billCurrency or taxCurrency changes
  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (!taxCurrency) return; // Wait until taxCurrency is loaded

      if (billCurrency === taxCurrency) {
        setFxRate(1);
      } else {
        try {
          const fxSql = `SELECT XRATE FROM exchange_master WHERE currency1='${billCurrency}' AND currency2='${taxCurrency}'`;
          const response1 = await fetch(
            `${API_URL}/api/common/loadContents?sql=${encodeURIComponent(fxSql)}`
          );
          const fxResult1 = await response1.json();

          if (Array.isArray(fxResult1) && fxResult1.length > 0) {
            setFxRate(parseFloat(fxResult1[0].XRATE));
          } else {
            const reverseFxSql = `SELECT 1 / XRATE AS XRATE FROM exchange_master WHERE currency1='${taxCurrency}' AND currency2='${billCurrency}'`;
            const response2 = await fetch(
              `${API_URL}/api/common/loadContents?sql=${encodeURIComponent(
                reverseFxSql
              )}`
            );
            const fxResult2 = await response2.json();

            if (Array.isArray(fxResult2) && fxResult2.length > 0) {
              setFxRate(parseFloat(fxResult2[0].XRATE));
            } else {
              console.error(
                'Exchange rate not found in the database. Please add the exchange rate and retry.'
              );
            }
          }
        } catch (error) {
          console.error('Error fetching exchange rate:', error);
        }
      }
    };

    fetchExchangeRate();
  }, [billCurrency, taxCurrency, setFxRate]);

  // return (
  //   <View>
  //     <Text>Fetching exchange rate...</Text>
  //   </View>
  // );
};

export default CurrencyConversion;
