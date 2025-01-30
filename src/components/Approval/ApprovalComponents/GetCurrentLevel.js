import { API_URL } from "../../ApiUrl";

export const getCurrentLevel = async trans_id => {
    try {
      const currentLevelSql = `select no_of_levels, current_level from transaction_list where trans_id=${trans_id}`;
      console.log("currentLevelSql",currentLevelSql)
      const response = await fetch(
        `${API_URL}/api/common/loadVectorwithContents?sql=${encodeURIComponent(currentLevelSql)}`
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
  
      if (result.length > 0) {
        console.log('Tax Current Level:', result[0][1]);
        return result[0][1]; // Returning current_level
      }
  
      throw new Error("No data found");
    } catch (error) {
      console.error('Error fetching current level:', error);
      throw error; // Rethrow the error for proper handling
    }
  };
  