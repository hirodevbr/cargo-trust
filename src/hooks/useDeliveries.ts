import { useState, useEffect, useCallback } from 'react';
import { databaseService, Delivery } from '../database/simpleDatabase';

export const useDeliveries = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inicializar banco de dados
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        setIsLoading(true);
        await databaseService.initialize();
        const allDeliveries = await databaseService.getAllDeliveries();
        setDeliveries(allDeliveries);
        setError(null);
      } catch (err) {
        console.error('Erro ao inicializar banco de dados:', err);
        setError('Erro ao carregar dados do banco');
      } finally {
        setIsLoading(false);
      }
    };

    initializeDatabase();
  }, []);

  const refreshDeliveries = useCallback(async () => {
    try {
      const allDeliveries = await databaseService.getAllDeliveries();
      setDeliveries(allDeliveries);
    } catch (err) {
      console.error('Erro ao atualizar entregas:', err);
      setError('Erro ao atualizar dados');
    }
  }, []);

  const createDelivery = async (deliveryData: Omit<Delivery, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const newDelivery = await databaseService.createDelivery({
        ...deliveryData,
        status: 'open'
      });
      
      await refreshDeliveries();
      return newDelivery;
    } catch (err) {
      console.error('Erro ao criar entrega:', err);
      setError('Erro ao criar entrega');
      throw err;
    }
  };

  const acceptDelivery = async (deliveryId: number, carrier: string) => {
    try {
      setError(null);
      await databaseService.updateDeliveryStatus(deliveryId, 'accepted', carrier);
      await refreshDeliveries();
    } catch (err) {
      console.error('Erro ao aceitar entrega:', err);
      setError('Erro ao aceitar entrega');
      throw err;
    }
  };

  const updateDeliveryStatus = async (deliveryId: number, newStatus: Delivery['status']) => {
    try {
      setError(null);
      await databaseService.updateDeliveryStatus(deliveryId, newStatus);
      await refreshDeliveries();
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      setError('Erro ao atualizar status');
      throw err;
    }
  };

  const getDeliveriesByRequester = useCallback(async (requester: string): Promise<Delivery[]> => {
    try {
      return await databaseService.getDeliveriesByRequester(requester);
    } catch (err) {
      console.error('Erro ao buscar entregas do solicitante:', err);
      setError('Erro ao buscar entregas');
      return [];
    }
  }, []);

  const getDeliveriesByCarrier = useCallback(async (carrier: string): Promise<Delivery[]> => {
    try {
      return await databaseService.getDeliveriesByCarrier(carrier);
    } catch (err) {
      console.error('Erro ao buscar entregas do transportador:', err);
      setError('Erro ao buscar entregas');
      return [];
    }
  }, []);

  const getOpenDeliveries = useCallback(async (): Promise<Delivery[]> => {
    try {
      return await databaseService.getOpenDeliveries();
    } catch (err) {
      console.error('Erro ao buscar entregas abertas:', err);
      setError('Erro ao buscar entregas abertas');
      return [];
    }
  }, []);

  const getDeliveryById = useCallback(async (id: number): Promise<Delivery | null> => {
    try {
      return await databaseService.getDeliveryById(id);
    } catch (err) {
      console.error('Erro ao buscar entrega:', err);
      setError('Erro ao buscar entrega');
      return null;
    }
  }, []);

  const updateDelivery = async (id: number, updates: Partial<Delivery>) => {
    try {
      setError(null);
      await databaseService.updateDelivery(id, updates);
      await refreshDeliveries();
    } catch (err) {
      console.error('Erro ao atualizar entrega:', err);
      setError('Erro ao atualizar entrega');
      throw err;
    }
  };

  const deleteDelivery = async (id: number) => {
    try {
      setError(null);
      await databaseService.deleteDelivery(id);
      await refreshDeliveries();
    } catch (err) {
      console.error('Erro ao deletar entrega:', err);
      setError('Erro ao deletar entrega');
      throw err;
    }
  };

  return {
    deliveries,
    isLoading,
    error,
    createDelivery,
    acceptDelivery,
    updateDeliveryStatus,
    updateDelivery,
    deleteDelivery,
    getDeliveriesByRequester,
    getDeliveriesByCarrier,
    getOpenDeliveries,
    getDeliveryById,
    refreshDeliveries
  };
};
