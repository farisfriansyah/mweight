// mweight/frontend/src/hooks/useWeightHistoryApi.js
import { useEffect, useState } from 'react';

const useWeightHistoryApi = (url) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('API fetch failed');
        const result = await response.json();
        setData(result.data); // Menyimpan data history ke state
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [url]);

  return { data, error };
};

export default useWeightHistoryApi;
