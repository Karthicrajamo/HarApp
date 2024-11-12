import React, {useState, useEffect} from 'react';
import {View, Text, ActivityIndicator, Alert} from 'react-native';
import API_URL from '../ApiUrl';

//Example API prop : /api/...
const APIRequestComponent = ({
  api,
  httpMethod,
  headers,
  body,
  setData,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('api 905w9050w59w85: ', `${API_URL}${api}`);
        setLoading(true);
        const response = await fetch(`${API_URL}${api}`, {
          method: httpMethod,
          headers: {'Content-Type': 'application/json', ...headers},
          body: body ? JSON.stringify(body) : null,
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (setData) setData(data);
        if (onSuccess) onSuccess(data);
      } catch (err) {
        setError(err.message);
        if (onError) onError(err.message);
        else Alert.alert('Error', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [api, httpMethod, headers, body, setData, onSuccess, onError]);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error}</Text>;

  return null;
};

export default APIRequestComponent;
