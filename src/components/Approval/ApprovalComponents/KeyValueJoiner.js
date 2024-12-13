export const KeyValueJoiner = (keys, values, skipValue = [], setSlabTaxes) => {
  // Initialize an empty array to hold the key-value objects for all arrays in values
  const keyValueArray = [];

  // Iterate through each array in values
  values.forEach((valueArray) => {
    // Filter out values based on skipValue indices
    const filteredValues = valueArray.filter((value, index) => !skipValue.includes(index));
    console.log("filteredValues", filteredValues);
    
    // Create a key-value object for the current array
    const keyValueObj = {};

    // Iterate through the keys and corresponding values
    keys.forEach((key, index) => {
      // Ensure we only add keys corresponding to existing filtered values
      if (index < filteredValues.length) {
        keyValueObj[key] = filteredValues[index];
      }
    });

    // Add the created object to the key-value array
    keyValueArray.push(keyValueObj);
  });

  return keyValueArray; // Return the array of key-value objects
};
