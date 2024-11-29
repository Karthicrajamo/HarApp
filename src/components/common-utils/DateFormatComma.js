export const DateFormatComma = (dateString) => {
    const date = new Date(dateString);
  
    // Extract day, month, and year
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' }); // Short month name
    const year = date.getFullYear().toString().slice(-2); // Last two digits of the year
  
    return `${day} ${month}, ${year}`;
  };
  