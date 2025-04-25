import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { Alert, Badge } from 'react-bootstrap';

const AutoSaveStatus = () => {
  const [isAutoSaveActive, setIsAutoSaveActive] = useState(false);

  useEffect(() => {
    const checkAutoSaveStatus = () => {
      const now = moment().tz('Asia/Jakarta');
      const currentHour = now.hour();
      const isActive = currentHour >= 7 && currentHour < 22; // 07:00 - 21:59
      setIsAutoSaveActive(isActive);
    };

    // Periksa status saat komponen dimuat
    checkAutoSaveStatus();

    // Perbarui status setiap menit
    const interval = setInterval(checkAutoSaveStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-0">
      <Badge bg={isAutoSaveActive ? 'success' : 'danger'} className="mb-2">
        {isAutoSaveActive ? 'Active (07:00 - 22:00)' : 'Inactive (Outside 07:00 - 22:00)'}
      </Badge>
      {!isAutoSaveActive && (
        <Alert variant="warning">
          Auto saving is disabled outside operating hours (07:00 - 22:00, Asia/Jakarta).
        </Alert>
      )}
    </div>
  );
};

export default AutoSaveStatus;