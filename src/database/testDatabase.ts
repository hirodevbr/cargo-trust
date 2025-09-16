import { databaseService } from './simpleDatabase';

export const testDatabase = async () => {
  try {
    console.log('🧪 Testing database...');
    
    // Inicializar banco
    await databaseService.initialize();
    console.log('✅ Database initialized');

    // Testar criação de entrega
    const testDelivery = await databaseService.createDelivery({
      origin: 'São Paulo, SP',
      destination: 'Rio de Janeiro, RJ',
      description: 'Teste de entrega',
      amount: '100.00',
      status: 'open',
      deadline: '2025-12-31',
      requester: 'GDXN...TEST'
    });
    console.log('✅ Delivery created:', testDelivery);

    // Testar busca por solicitante
    const deliveries = await databaseService.getDeliveriesByRequester('GDXN...TEST');
    console.log('✅ Found deliveries:', deliveries.length);

    // Testar busca de entregas abertas
    const openDeliveries = await databaseService.getOpenDeliveries();
    console.log('✅ Open deliveries:', openDeliveries.length);

    // Testar atualização de status
    await databaseService.updateDeliveryStatus(testDelivery.id, 'accepted', 'GCAR...TEST');
    console.log('✅ Status updated');

    // Verificar atualização
    const updatedDelivery = await databaseService.getDeliveryById(testDelivery.id);
    console.log('✅ Updated delivery:', updatedDelivery?.status);

    console.log('🎉 All database tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return false;
  }
};

// Executar teste automaticamente se estiver no navegador
if (typeof window !== 'undefined') {
  // Aguardar um pouco para o banco inicializar
  setTimeout(() => {
    testDatabase();
  }, 2000);
}
