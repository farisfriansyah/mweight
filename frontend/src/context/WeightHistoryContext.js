// mweight/frontend/src/context/WeightHistoryContext.js
import React, { createContext, useState, useCallback, useEffect } from 'react';
import { fetchWeightHistoryData } from '../api/api';
import connectWebSocket from '../api/socket';

export const WeightHistoryContext = createContext();

export const WeightHistoryProvider = ({ children }) => {
  const [apiData, setApiData] = useState([]);
  const [wsData, setWsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  const loadWeightHistory = useCallback(async () => {
    try {
      const data = await fetchWeightHistoryData();
      setApiData(data?.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching API data:", error);
      setLoading(false);
    }
  }, []);

  // Connect WebSocket and handle incoming data
  useEffect(() => {
    const onMessage = (data) => {
      if (data.event === 'weight-history' && data.data) {
        const newProcessedData = data.data.map((item) => ({
          ...item,
          timestamp: new Date(item.timestamp).getTime(),
        }));

        setWsData((prevData) => {
          const mergedData = [...prevData, ...newProcessedData];

          // Eliminate duplicates and sort by timestamp (newest first)
          const uniqueData = Array.from(
            new Map(mergedData.map((item) => [item.id, item]))
          ).map(([, value]) => value);

          return uniqueData.sort((a, b) => b.timestamp - a.timestamp);
        });
      }
    };

    const ws = connectWebSocket(onMessage);
    return () => ws && ws.close(); // Cleanup WebSocket connection on component unmount
  }, []);

  useEffect(() => {
    loadWeightHistory();
    const interval = setInterval(loadWeightHistory, 5000);

    return () => clearInterval(interval);
  }, [loadWeightHistory]);

  return (
    <WeightHistoryContext.Provider value={{ apiData, wsData, loading }}>
      {children}
    </WeightHistoryContext.Provider>
  );
};
