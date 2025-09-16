import React, { useState, useEffect } from "react";
import { 
  Layout, 
  Card, 
  Button, 
  Input, 
  Textarea, 
  Alert,
  Badge,
  Icon,
  Modal
} from "@stellar/design-system";
import { useWallet } from "../hooks/useWallet";
import { useDeliveryContract } from "../hooks/useDeliveryContract";
import { useDeliveries } from "../hooks/useDeliveries";
import { useScrollLock } from "../hooks/useScrollLock";
import { useModalFix } from "../hooks/useModalFix";
import { DatabaseStatus } from "../components/DatabaseStatus";
import { DatabaseTest } from "../components/DatabaseTest";
import { useNotifications } from "../components/Notification";
import CargoTrustLogo from "../components/CargoTrustLogo";

interface DeliveryRequest {
  id: number;
  origin: string;
  destination: string;
  description: string;
  amount: string;
  status: 'open' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'completed';
  deadline: string;
  requester?: string;
}

const Home: React.FC = () => {
  const wallet = useWallet();
  const { contract, isReady, isLoading, error } = useDeliveryContract();
  const { 
    createDelivery, 
    getDeliveriesByRequester
  } = useDeliveries();
  const { showSuccess, showError, NotificationContainer } = useNotifications();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryRequest | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Hooks para gerenciar modal e scroll
  useScrollLock(showDetailsModal);
  useModalFix(showDetailsModal);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    description: '',
    amount: '',
    pickupDeadline: '',
    deliveryDeadline: ''
  });

  // Estado para entregas do usuário
  const [userDeliveries, setUserDeliveries] = useState<DeliveryRequest[]>([]);

  // Carregar entregas do usuário quando a carteira conectar
  useEffect(() => {
    const loadUserDeliveries = async () => {
      if (wallet?.address) {
        try {
          const deliveries = await getDeliveriesByRequester(wallet.address);
          setUserDeliveries(deliveries);
        } catch (error) {
          console.error('Erro ao carregar entregas:', error);
        }
      } else {
        setUserDeliveries([]);
      }
    };

    loadUserDeliveries();
  }, [wallet?.address, getDeliveriesByRequester]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { variant: "primary" as const, text: "Aberto" },
      accepted: { variant: "warning" as const, text: "Aceito" },
      in_transit: { variant: "secondary" as const, text: "Em Trânsito" },
      delivered: { variant: "success" as const, text: "Entregue" },
      completed: { variant: "success" as const, text: "Concluído" }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const handleCreateDelivery = async () => {
    if (!wallet?.address) {
      showError('🔐 Carteira Necessária', 'Por favor, conecte sua carteira primeiro!');
      return;
    }

    if (!contract || !isReady) {
      showError('⏳ Contrato Indisponível', 'O contrato não está pronto. Tente novamente em alguns segundos.');
      return;
    }

    // Validações básicas
    if (!formData.origin || !formData.destination || !formData.description || 
        !formData.amount || !formData.pickupDeadline || !formData.deliveryDeadline) {
      showError('📝 Campos Obrigatórios', 'Por favor, preencha todos os campos antes de criar a entrega!');
      return;
    }

    try {
      setIsCreating(true);

      // Integração real com o contrato
      await contract.createDelivery({
        origin: formData.origin,
        destination: formData.destination,
        description: formData.description,
        paymentAmount: BigInt(Math.floor(parseFloat(formData.amount) * 10000000)), // Converter para stroop
        tokenAddress: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAUHKENNOSB', // Native XLM
        pickupDeadline: BigInt(new Date(formData.pickupDeadline).getTime()),
        deliveryDeadline: BigInt(new Date(formData.deliveryDeadline).getTime())
      });

      // Criar entrega no sistema de persistência
      await createDelivery({
        origin: formData.origin,
        destination: formData.destination,
        description: formData.description,
        amount: formData.amount,
        deadline: formData.deliveryDeadline,
        requester: wallet.address
      });
      setShowCreateForm(false);
      setFormData({
        origin: '',
        destination: '',
        description: '',
        amount: '',
        pickupDeadline: '',
        deliveryDeadline: ''
      });

      showSuccess('🎉 Entrega Criada!', 'Sua entrega foi criada com sucesso e está disponível para transportadores.');
    } catch (error) {
      console.error('Erro ao criar entrega:', error);
      showError('❌ Erro ao Criar', 'Não foi possível criar a entrega. Verifique sua conexão e tente novamente.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Layout.Content>
      <NotificationContainer />
      <DatabaseStatus />
      <DatabaseTest />
      <Layout.Inset>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
            <CargoTrustLogo size="lg" />
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#1a1a1a' }}>
            Meridian Delivery
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '800px', margin: '0 auto' }}>
            Plataforma descentralizada de entregas powered by Stellar blockchain. 
            Elimine intermediários, garanta transparência e automatize pagamentos com contratos inteligentes.
          </p>
        </div>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <Card>
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <Icon.Shield01 size="lg" style={{ marginBottom: '1rem' }} />
              <h3>Escrow Inteligente</h3>
              <p>Pagamentos seguros com liberação automática após confirmação de entrega</p>
            </div>
          </Card>
          
          <Card>
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <Icon.Eye size="lg" style={{ marginBottom: '1rem' }} />
              <h3>Transparência Total</h3>
              <p>Todas as transações registradas na blockchain para auditoria completa</p>
            </div>
          </Card>
          
          <Card>
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <Icon.Zap size="lg" style={{ marginBottom: '1rem' }} />
              <h3>Sem Intermediários</h3>
              <p>Redução de custos e agilidade através da descentralização</p>
            </div>
          </Card>
        </div>

        {/* Main Action */}
        {!wallet?.address ? (
          <Alert variant="error" title="Carteira não conectada" placement="inline">
            Para usar o Meridian Delivery, você precisa conectar sua carteira Stellar.
          </Alert>
        ) : error ? (
          <Alert variant="error" title="Erro no contrato" placement="inline">
            {error}
          </Alert>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2>Suas Entregas</h2>
              <Button 
                variant="primary" 
                size="md"
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                <Icon.Plus size="sm" />
                Nova Entrega
              </Button>
            </div>

            {/* Create Delivery Form */}
            {showCreateForm && (
              <Card>
                <div style={{ padding: '2rem' }}>
                  <h3 style={{ marginBottom: '1.5rem' }}>Criar Nova Entrega</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    <Input
                      id="origem"
                      fieldSize="md"
                      label="Origem"
                      placeholder="Ex: São Paulo, SP"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    />
                    <Input
                      id="destino"
                      fieldSize="md"
                      label="Destino"
                      placeholder="Ex: Rio de Janeiro, RJ"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    />
                  </div>
                  
                  <Textarea
                    id="descricao"
                    fieldSize="md"
                    label="Descrição"
                    placeholder="Descreva o item a ser entregue..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    <Input
                      id="valor"
                      fieldSize="md"
                      label="Valor (XLM)"
                      placeholder="50.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                    <Input
                      id="prazo-coleta"
                      fieldSize="md"
                      label="Prazo de Coleta"
                      type="datetime-local"
                      value={formData.pickupDeadline}
                      onChange={(e) => setFormData({ ...formData, pickupDeadline: e.target.value })}
                    />
                    <Input
                      id="prazo-entrega"
                      fieldSize="md"
                      label="Prazo de Entrega"
                      type="datetime-local"
                      value={formData.deliveryDeadline}
                      onChange={(e) => setFormData({ ...formData, deliveryDeadline: e.target.value })}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Button 
                      variant="primary"
                      size="md"
                      onClick={handleCreateDelivery}
                      disabled={isCreating || !isReady || isLoading}
                    >
                      {isCreating || isLoading ? 'Criando...' : 'Criar Entrega'}
                    </Button>
                    <Button variant="secondary" size="md" onClick={() => setShowCreateForm(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Deliveries List */}
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {userDeliveries.map((delivery) => (
                <Card key={delivery.id}>
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.5rem 0' }}>
                          Entrega #{delivery.id}
                        </h4>
                        <p style={{ margin: '0', color: '#666' }}>
                          <Icon.ArrowRight size="sm" style={{ marginRight: '0.5rem' }} />
                          {delivery.origin} → {delivery.destination}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {getStatusBadge(delivery.status)}
                        <p style={{ margin: '0.5rem 0 0 0', fontWeight: 'bold' }}>
                          {delivery.amount} XLM
                        </p>
                      </div>
                    </div>
                    
                    <p style={{ marginBottom: '1rem', color: '#333' }}>
                      {delivery.description}
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <small style={{ color: '#666' }}>
                        Prazo: {new Date(delivery.deadline).toLocaleDateString('pt-BR')}
                      </small>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button 
                          variant="tertiary" 
                          size="sm"
                          onClick={() => {
                            setSelectedDelivery(delivery);
                            setShowDetailsModal(true);
                          }}
                        >
                          <Icon.Eye size="sm" />
                          Detalhes
                        </Button>
                        {delivery.status === 'open' && (
                          <Button variant="secondary" size="sm">
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              {userDeliveries.length === 0 && (
                <Card>
                  <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
                    <Icon.Package size="lg" style={{ marginBottom: '1rem' }} />
                    <p>Nenhuma entrega encontrada. Crie sua primeira entrega!</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedDelivery && (
          <Modal
            visible={showDetailsModal}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedDelivery(null);
            }}
          >
            <div style={{ 
              padding: '1.5rem', 
              maxHeight: '90vh', 
              overflowY: 'auto',
              width: '100%',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <h3 style={{ marginTop: '0', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                Detalhes da Entrega #{selectedDelivery.id}
              </h3>
              
              <div style={{ marginBottom: '2rem' }}>
                <Card>
                  <div style={{ padding: '1.5rem' }}>
                    {/* Status e Valor */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                      gap: '1.5rem', 
                      marginBottom: '1.5rem' 
                    }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Status Atual</h4>
                        {getStatusBadge(selectedDelivery.status)}
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Valor da Entrega</h4>
                        <p style={{ margin: '0', fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
                          {selectedDelivery.amount} XLM
                        </p>
                      </div>
                    </div>

                    {/* Rota */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Rota</h4>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '1rem', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '8px',
                        flexWrap: 'wrap',
                        gap: '1rem'
                      }}>
                        <div style={{ textAlign: 'center', flex: '1 1 140px', minWidth: '140px' }}>
                          <strong style={{ fontSize: '0.9rem', wordBreak: 'break-word' }}>
                            {selectedDelivery.origin}
                          </strong>
                          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#666' }}>Origem</p>
                        </div>
                        <div style={{ margin: '0 0.5rem', flexShrink: 0 }}>
                          <Icon.ArrowRight size="md" style={{ color: '#0066cc' }} />
                        </div>
                        <div style={{ textAlign: 'center', flex: '1 1 140px', minWidth: '140px' }}>
                          <strong style={{ fontSize: '0.9rem', wordBreak: 'break-word' }}>
                            {selectedDelivery.destination}
                          </strong>
                          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#666' }}>Destino</p>
                        </div>
                      </div>
                    </div>

                    {/* Informações adicionais */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.5rem 0' }}>Descrição</h4>
                        <p style={{ margin: '0', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                          {selectedDelivery.description}
                        </p>
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 0.5rem 0' }}>Prazo de Entrega</h4>
                        <p style={{ margin: '0', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                          {new Date(selectedDelivery.deadline).toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Status da entrega */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0' }}>Status da Entrega</h4>
                      <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                        {selectedDelivery.status === 'open' && (
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Icon.Clock size="md" style={{ marginRight: '1rem', color: '#0066cc' }} />
                            <div>
                              <p style={{ margin: '0', fontWeight: 'bold' }}>Aguardando Transportadora</p>
                              <small style={{ color: '#666' }}>
                                Sua entrega está disponível para transportadoras aceitarem
                              </small>
                            </div>
                          </div>
                        )}
                        {selectedDelivery.status === 'accepted' && (
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Icon.Check size="md" style={{ marginRight: '1rem', color: '#ffc107' }} />
                            <div>
                              <p style={{ margin: '0', fontWeight: 'bold' }}>Entrega Aceita</p>
                              <small style={{ color: '#666' }}>
                                Uma transportadora aceitou sua entrega e em breve fará a coleta
                              </small>
                            </div>
                          </div>
                        )}
                        {selectedDelivery.status === 'in_transit' && (
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Icon.Truck01 size="md" style={{ marginRight: '1rem', color: '#0066cc' }} />
                            <div>
                              <p style={{ margin: '0', fontWeight: 'bold' }}>Em Trânsito</p>
                              <small style={{ color: '#666' }}>
                                Sua entrega está a caminho do destino
                              </small>
                            </div>
                          </div>
                        )}
                        {selectedDelivery.status === 'delivered' && (
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Icon.CheckCircle size="md" style={{ marginRight: '1rem', color: '#28a745' }} />
                            <div>
                              <p style={{ margin: '0', fontWeight: 'bold' }}>Entregue</p>
                              <small style={{ color: '#666' }}>
                                Sua entrega foi concluída com sucesso
                              </small>
                            </div>
                          </div>
                        )}
                        {selectedDelivery.status === 'completed' && (
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Icon.CurrencyDollarCircle size="md" style={{ marginRight: '1rem', color: '#28a745' }} />
                            <div>
                              <p style={{ margin: '0', fontWeight: 'bold' }}>Concluída</p>
                              <small style={{ color: '#666' }}>
                                Entrega finalizada e pagamento liberado para a transportadora
                              </small>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Informações da blockchain */}
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0' }}>Informações da Blockchain</h4>
                      <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <small style={{ color: '#666' }}>ID da Entrega:</small>
                          <p style={{ margin: '0', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                            #{selectedDelivery.id}
                          </p>
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <small style={{ color: '#666' }}>Contrato Inteligente:</small>
                          <p style={{ margin: '0', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                            CDRW...X7YZ (Escrow Ativo)
                          </p>
                        </div>
                        <div>
                          <small style={{ color: '#666' }}>Status do Escrow:</small>
                          <p style={{ margin: '0', color: selectedDelivery.status === 'completed' ? '#28a745' : '#0066cc', fontWeight: 'bold' }}>
                            {selectedDelivery.status === 'completed' ? '✓ Fundos Liberados' : '🔒 Fundos em Escrow'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <Button 
                  variant="secondary" 
                  size="md" 
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedDelivery(null);
                  }}
                >
                  Fechar
                </Button>
                {selectedDelivery.status === 'open' && (
                  <Button 
                    variant="error" 
                    size="md"
                    onClick={() => {
                      // Implementar lógica de cancelamento aqui
                      setShowDetailsModal(false);
                      setSelectedDelivery(null);
                    }}
                  >
                    Cancelar Entrega
                  </Button>
                )}
              </div>
            </div>
          </Modal>
        )}

        {/* Problem/Solution Section */}
        <div style={{ marginTop: '4rem', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Como Resolvemos os Problemas Tradicionais</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div>
              <h3 style={{ color: '#dc3545', marginBottom: '1rem' }}>❌ Problemas Tradicionais</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}>• Falta de confiança entre partes</li>
                <li style={{ marginBottom: '0.5rem' }}>• Centralização e altas taxas</li>
                <li style={{ marginBottom: '0.5rem' }}>• Falta de transparência</li>
                <li style={{ marginBottom: '0.5rem' }}>• Atraso no recebimento (até 30 dias)</li>
              </ul>
            </div>
            
            <div>
              <h3 style={{ color: '#28a745', marginBottom: '1rem' }}>✅ Nossa Solução</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}>• Escrow automático com contratos inteligentes</li>
                <li style={{ marginBottom: '0.5rem' }}>• Descentralização total, sem intermediários</li>
                <li style={{ marginBottom: '0.5rem' }}>• Transparência total na blockchain</li>
                <li style={{ marginBottom: '0.5rem' }}>• Pagamento imediato após entrega</li>
              </ul>
            </div>
          </div>
        </div>
    </Layout.Inset>
  </Layout.Content>
);
};

export default Home;
