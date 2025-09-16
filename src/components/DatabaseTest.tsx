import React, { useState } from 'react';

export const DatabaseTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runTest = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      addResult('🧪 Starting database test...');
      
      // Teste 1: Verificar localStorage
      addResult('📂 Testing localStorage availability...');
      if (typeof Storage !== 'undefined') {
        addResult('✅ localStorage is available');
      } else {
        addResult('❌ localStorage is not available');
        return;
      }

      // Teste 2: Testar operações básicas do localStorage
      addResult('🔧 Testing localStorage operations...');
      try {
        localStorage.setItem('test_key', 'test_value');
        const testValue = localStorage.getItem('test_key');
        if (testValue === 'test_value') {
          addResult('✅ localStorage read/write works');
          localStorage.removeItem('test_key');
        } else {
          addResult('❌ localStorage read/write failed');
        }
      } catch (error) {
        addResult(`❌ localStorage error: ${error}`);
        return;
      }

      // Teste 3: Importar e testar o banco
      addResult('📦 Importing database service...');
      try {
        const { databaseService } = await import('../database/simpleDatabase');
        addResult('✅ Database service imported successfully');

        // Teste 4: Inicializar banco
        addResult('🔄 Initializing database...');
        await databaseService.initialize();
        addResult('✅ Database initialized successfully');

        // Teste 5: Criar entrega de teste
        addResult('📝 Creating test delivery...');
        const testDelivery = await databaseService.createDelivery({
          origin: 'São Paulo, SP',
          destination: 'Rio de Janeiro, RJ',
          description: 'Teste de entrega',
          amount: '100.00',
          status: 'open',
          deadline: '2025-12-31',
          requester: 'GDXN...TEST'
        });
        addResult(`✅ Test delivery created with ID: ${testDelivery.id}`);

        // Teste 6: Buscar entregas
        addResult('🔍 Searching for deliveries...');
        const deliveries = await databaseService.getAllDeliveries();
        addResult(`✅ Found ${deliveries.length} deliveries`);

        // Teste 7: Buscar por solicitante
        const requesterDeliveries = await databaseService.getDeliveriesByRequester('GDXN...TEST');
        addResult(`✅ Found ${requesterDeliveries.length} deliveries for requester`);

        addResult('🎉 All tests passed successfully!');
        
      } catch (error) {
        addResult(`❌ Database test failed: ${error}`);
        console.error('Database test error:', error);
      }

    } catch (error) {
      addResult(`❌ Test failed: ${error}`);
      console.error('Test error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '50px', 
      right: '10px', 
      background: '#F3F4F6', 
      padding: '12px', 
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 1000,
      maxWidth: '300px',
      maxHeight: '400px',
      overflow: 'auto',
      border: '2px solid #3B82F6'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <strong>🧪 Database Test</strong>
        <button 
          onClick={runTest} 
          disabled={isRunning}
          style={{
            padding: '4px 8px',
            fontSize: '10px',
            background: isRunning ? '#9CA3AF' : '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isRunning ? 'not-allowed' : 'pointer'
          }}
        >
          {isRunning ? 'Running...' : 'Run Test'}
        </button>
      </div>
      
      <div style={{ maxHeight: '300px', overflow: 'auto' }}>
        {testResults.map((result, index) => (
          <div key={index} style={{ 
            marginBottom: '2px', 
            fontSize: '10px',
            color: result.includes('❌') ? '#EF4444' : result.includes('✅') ? '#10B981' : '#6B7280'
          }}>
            {result}
          </div>
        ))}
      </div>
    </div>
  );
};
