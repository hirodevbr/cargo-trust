import React, { useState, useEffect } from 'react';
import { databaseService } from '../database/simpleDatabase';

export const DatabaseStatus: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [deliveryCount, setDeliveryCount] = useState(0);
  const [lastTest, setLastTest] = useState<string>('');

  useEffect(() => {
    const checkDatabase = async () => {
      try {
        console.log('🔍 Checking database...');
        await databaseService.initialize();
        console.log('✅ Database initialized');
        
        const deliveries = await databaseService.getAllDeliveries();
        console.log('📦 Found deliveries:', deliveries.length);
        
        setDeliveryCount(deliveries.length);
        setStatus('connected');
        setLastTest(new Date().toLocaleTimeString());
        console.log('🎉 Database status: CONNECTED');
      } catch (error) {
        console.error('❌ Database check failed:', error);
        console.error('Error details:', error);
        setStatus('error');
      }
    };

    // Aguardar um pouco antes de verificar
    const timer = setTimeout(checkDatabase, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return '#10B981';
      case 'error': return '#EF4444';
      default: return '#F59E0B';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'error': return 'Erro';
      default: return 'Carregando...';
    }
  };

  if (status === 'loading') {
    return (
      <div style={{ 
        position: 'fixed', 
        top: '10px', 
        right: '10px', 
        background: '#F3F4F6', 
        padding: '8px 12px', 
        borderRadius: '6px',
        fontSize: '12px',
        zIndex: 1000
      }}>
        🗄️ DB: {getStatusText()}
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: '#F3F4F6', 
      padding: '8px 12px', 
      borderRadius: '6px',
      fontSize: '12px',
      zIndex: 1000,
      border: `2px solid ${getStatusColor()}`
    }}>
      🗄️ DB: <span style={{ color: getStatusColor(), fontWeight: 'bold' }}>
        {getStatusText()}
      </span>
      <br />
      📦 Entregas: {deliveryCount}
      {lastTest && <><br />⏰ Teste: {lastTest}</>}
    </div>
  );
};
