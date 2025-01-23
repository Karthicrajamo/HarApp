import React, { useState, useEffect } from 'react';
import { API_URL } from '../../ApiUrl';

const FinLoadContentsAPI = ({ Query, setResult }) => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/api/common/finloadContentsjson?sql=${encodeURIComponent(Query)}`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                console.log("FinloadContent result:", result);
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

export default FinLoadContentsAPI;