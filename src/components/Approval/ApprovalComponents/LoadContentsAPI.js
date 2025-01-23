import React, { useState, useEffect } from 'react';
import { API_URL } from '../../ApiUrl';

const LoadContentsAPI = ({ Query, setResult }) => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/api/common/loadContents?sql=${encodeURIComponent(Query)}`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                console.log("loadContent result:", result);
                setResult(result);
            } catch (err) {
                console.error("Fetch error:", err);
                // Optionally set error in parent if needed
                setResult(null);
            }
        };

        fetchData();
    }, [Query, setResult]); // Adding API_URL as a dependency

    // No UI rendering logic is handled in this component
    return null;
};

export default LoadContentsAPI;

{/* <LoadContentsAPI
Query={`select party_name from a_payment_details where payment_id = ${paymentId}`}
setResult={setPartyName}
/> */}