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
  Modal,
} from "@stellar/design-system";
import { useWallet } from "../hooks/useWallet";
import { useDeliveryContract } from "../hooks/useDeliveryContract";
import { useDeliveries } from "../hooks/useDeliveries";
import { useScrollLock } from "../hooks/useScrollLock";
import { useModalFix } from "../hooks/useModalFix";
import { useNotifications } from "../components/Notification";
import CargoTrustLogo from "../components/CargoTrustLogo";

interface DeliveryRequest {
  id: number;
  origin: string;
  destination: string;
  description: string;
  amount: string;
  status:
    | "open"
    | "accepted"
    | "picked_up"
    | "in_transit"
    | "delivered"
    | "completed";
  deadline: string;
  requester?: string;
}

const Home: React.FC = () => {
  const wallet = useWallet();
  const { contract, isReady, isLoading, error } = useDeliveryContract();
  const { createDelivery, getDeliveriesByRequester } = useDeliveries();
  const { showSuccess, showError, NotificationContainer } = useNotifications();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] =
    useState<DeliveryRequest | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Hooks para gerenciar modal e scroll
  useScrollLock(showDetailsModal);
  useModalFix(showDetailsModal);
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    description: "",
    amount: "",
    pickupDeadline: "",
    deliveryDeadline: "",
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
          console.error("Erro ao carregar entregas:", error);
        }
      } else {
        setUserDeliveries([]);
      }
    };

    void loadUserDeliveries();
  }, [wallet?.address, getDeliveriesByRequester]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { variant: "primary" as const, text: "Open" },
      accepted: { variant: "warning" as const, text: "Accepted" },
      in_transit: { variant: "secondary" as const, text: "In Transit" },
      delivered: { variant: "success" as const, text: "Delivered" },
      completed: { variant: "success" as const, text: "Completed" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const handleCreateDelivery = async () => {
    if (!wallet?.address) {
      showError("🔐 Wallet Required", "Please connect your wallet first!");
      return;
    }

    if (!contract || !isReady) {
      showError(
        "⏳ Contract Unavailable",
        "The contract is not ready. Please try again in a few seconds.",
      );
      return;
    }

    // Validações básicas
    if (
      !formData.origin ||
      !formData.destination ||
      !formData.description ||
      !formData.amount ||
      !formData.pickupDeadline ||
      !formData.deliveryDeadline
    ) {
      showError(
        "📝 Required Fields",
        "Please fill in all fields before creating the delivery!",
      );
      return;
    }

    try {
      setIsCreating(true);

      // Integração real com o contrato
      await contract.createDelivery({
        origin: formData.origin,
        destination: formData.destination,
        description: formData.description,
        paymentAmount: BigInt(
          Math.floor(parseFloat(formData.amount) * 10000000),
        ), // Converter para stroop
        tokenAddress:
          "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAUHKENNOSB", // Native XLM
        pickupDeadline: BigInt(new Date(formData.pickupDeadline).getTime()),
        deliveryDeadline: BigInt(new Date(formData.deliveryDeadline).getTime()),
      });

      // Criar entrega no sistema de persistência
      await createDelivery({
        origin: formData.origin,
        destination: formData.destination,
        description: formData.description,
        amount: formData.amount,
        deadline: formData.deliveryDeadline,
        requester: wallet.address,
      });
      setShowCreateForm(false);
      setFormData({
        origin: "",
        destination: "",
        description: "",
        amount: "",
        pickupDeadline: "",
        deliveryDeadline: "",
      });

      showSuccess(
        "🎉 Delivery Created!",
        "Your delivery has been created successfully and is available for carriers.",
      );
    } catch (error) {
      console.error("Erro ao criar entrega:", error);
      showError(
        "❌ Creation Error",
        "Could not create the delivery. Check your connection and try again.",
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Layout.Content>
      <NotificationContainer />
      <Layout.Inset>
        {/* Hero Section */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <CargoTrustLogo size="lg" />
          </div>
          <h1
            style={{
              fontSize: "2.5rem",
              marginBottom: "1rem",
              color: "#1a1a1a",
            }}
          >
            Meridian Delivery
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "#666",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            Decentralized delivery platform powered by Stellar blockchain.
            Eliminate intermediaries, ensure transparency and automate payments
            with smart contracts.
          </p>
        </div>

        {/* Features */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            marginBottom: "3rem",
          }}
        >
          <Card>
            <div style={{ padding: "1.5rem", textAlign: "center" }}>
              <Icon.Shield01 size="lg" style={{ marginBottom: "1rem" }} />
              <h3>Smart Escrow</h3>
              <p>
                Secure payments with automatic release after delivery
                confirmation
              </p>
            </div>
          </Card>

          <Card>
            <div style={{ padding: "1.5rem", textAlign: "center" }}>
              <Icon.Eye size="lg" style={{ marginBottom: "1rem" }} />
              <h3>Total Transparency</h3>
              <p>
                All transactions recorded on the blockchain for complete audit
              </p>
            </div>
          </Card>

          <Card>
            <div style={{ padding: "1.5rem", textAlign: "center" }}>
              <Icon.Zap size="lg" style={{ marginBottom: "1rem" }} />
              <h3>No Intermediaries</h3>
              <p>Cost reduction and agility through decentralization</p>
            </div>
          </Card>
        </div>

        {/* Main Action */}
        {!wallet?.address ? (
          <Alert
            variant="error"
            title="Wallet not connected"
            placement="inline"
          >
            To use Meridian Delivery, you need to connect your Stellar wallet.
          </Alert>
        ) : error ? (
          <Alert variant="error" title="Contract error" placement="inline">
            {error}
          </Alert>
        ) : (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2rem",
              }}
            >
              <h2>Your Deliveries</h2>
              <Button
                variant="primary"
                size="md"
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                <Icon.Plus size="sm" />
                New Delivery
              </Button>
            </div>

            {/* Create Delivery Form */}
            {showCreateForm && (
              <Card>
                <div style={{ padding: "2rem" }}>
                  <h3 style={{ marginBottom: "1.5rem" }}>
                    Create New Delivery
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <Input
                      id="origem"
                      fieldSize="md"
                      label="Origin"
                      placeholder="Ex: New York, NY"
                      value={formData.origin}
                      onChange={(e) =>
                        setFormData({ ...formData, origin: e.target.value })
                      }
                    />
                    <Input
                      id="destino"
                      fieldSize="md"
                      label="Destination"
                      placeholder="Ex: Los Angeles, CA"
                      value={formData.destination}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          destination: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Textarea
                    id="descricao"
                    fieldSize="md"
                    label="Description"
                    placeholder="Describe the item to be delivered..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "1rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <Input
                      id="valor"
                      fieldSize="md"
                      label="Amount (XLM)"
                      placeholder="50.00"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                    />
                    <Input
                      id="prazo-coleta"
                      fieldSize="md"
                      label="Pickup Deadline"
                      type="datetime-local"
                      value={formData.pickupDeadline}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pickupDeadline: e.target.value,
                        })
                      }
                    />
                    <Input
                      id="prazo-entrega"
                      fieldSize="md"
                      label="Delivery Deadline"
                      type="datetime-local"
                      value={formData.deliveryDeadline}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          deliveryDeadline: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div style={{ display: "flex", gap: "1rem" }}>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => void handleCreateDelivery()}
                      disabled={isCreating || !isReady || isLoading}
                    >
                      {isCreating || isLoading
                        ? "Creating..."
                        : "Create Delivery"}
                    </Button>
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Deliveries List */}
            <div style={{ display: "grid", gap: "1rem" }}>
              {userDeliveries.map((delivery) => (
                <Card key={delivery.id}>
                  <div style={{ padding: "1.5rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        marginBottom: "1rem",
                      }}
                    >
                      <div>
                        <h4 style={{ margin: "0 0 0.5rem 0" }}>
                          Delivery #{delivery.id}
                        </h4>
                        <p style={{ margin: "0", color: "#666" }}>
                          <Icon.ArrowRight
                            size="sm"
                            style={{ marginRight: "0.5rem" }}
                          />
                          {delivery.origin} → {delivery.destination}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        {getStatusBadge(delivery.status)}
                        <p
                          style={{ margin: "0.5rem 0 0 0", fontWeight: "bold" }}
                        >
                          {delivery.amount} XLM
                        </p>
                      </div>
                    </div>

                    <p style={{ marginBottom: "1rem", color: "#333" }}>
                      {delivery.description}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <small style={{ color: "#666" }}>
                        Deadline:{" "}
                        {new Date(delivery.deadline).toLocaleDateString(
                          "en-US",
                        )}
                      </small>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Button
                          variant="tertiary"
                          size="sm"
                          onClick={() => {
                            setSelectedDelivery(delivery);
                            setShowDetailsModal(true);
                          }}
                        >
                          <Icon.Eye size="sm" />
                          Details
                        </Button>
                        {delivery.status === "open" && (
                          <Button variant="secondary" size="sm">
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {userDeliveries.length === 0 && (
                <Card>
                  <div
                    style={{
                      padding: "3rem",
                      textAlign: "center",
                      color: "#666",
                    }}
                  >
                    <Icon.Package size="lg" style={{ marginBottom: "1rem" }} />
                    <p>No deliveries found. Create your first delivery!</p>
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
            <div
              style={{
                padding: "1.5rem",
                maxHeight: "90vh",
                overflowY: "auto",
                width: "100%",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              <h3
                style={{
                  marginTop: "0",
                  marginBottom: "1.5rem",
                  fontSize: "1.5rem",
                }}
              >
                Delivery Details #{selectedDelivery.id}
              </h3>

              <div style={{ marginBottom: "2rem" }}>
                <Card>
                  <div style={{ padding: "1.5rem" }}>
                    {/* Status e Valor */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "1.5rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <div>
                        <h4
                          style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}
                        >
                          Current Status
                        </h4>
                        {getStatusBadge(selectedDelivery.status)}
                      </div>
                      <div>
                        <h4
                          style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}
                        >
                          Delivery Amount
                        </h4>
                        <p
                          style={{
                            margin: "0",
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            color: "#28a745",
                          }}
                        >
                          {selectedDelivery.amount} XLM
                        </p>
                      </div>
                    </div>

                    {/* Rota */}
                    <div style={{ marginBottom: "1.5rem" }}>
                      <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>
                        Route
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "1rem",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "8px",
                          flexWrap: "wrap",
                          gap: "1rem",
                        }}
                      >
                        <div
                          style={{
                            textAlign: "center",
                            flex: "1 1 140px",
                            minWidth: "140px",
                          }}
                        >
                          <strong
                            style={{
                              fontSize: "0.9rem",
                              wordBreak: "break-word",
                            }}
                          >
                            {selectedDelivery.origin}
                          </strong>
                          <p
                            style={{
                              margin: "0.25rem 0 0 0",
                              fontSize: "0.75rem",
                              color: "#666",
                            }}
                          >
                            Origin
                          </p>
                        </div>
                        <div style={{ margin: "0 0.5rem", flexShrink: 0 }}>
                          <Icon.ArrowRight
                            size="md"
                            style={{ color: "#0066cc" }}
                          />
                        </div>
                        <div
                          style={{
                            textAlign: "center",
                            flex: "1 1 140px",
                            minWidth: "140px",
                          }}
                        >
                          <strong
                            style={{
                              fontSize: "0.9rem",
                              wordBreak: "break-word",
                            }}
                          >
                            {selectedDelivery.destination}
                          </strong>
                          <p
                            style={{
                              margin: "0.25rem 0 0 0",
                              fontSize: "0.75rem",
                              color: "#666",
                            }}
                          >
                            Destination
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Informações adicionais */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "1rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <div>
                        <h4 style={{ margin: "0 0 0.5rem 0" }}>Description</h4>
                        <p
                          style={{
                            margin: "0",
                            padding: "0.5rem",
                            backgroundColor: "#f8f9fa",
                            borderRadius: "4px",
                          }}
                        >
                          {selectedDelivery.description}
                        </p>
                      </div>
                      <div>
                        <h4 style={{ margin: "0 0 0.5rem 0" }}>
                          Delivery Deadline
                        </h4>
                        <p
                          style={{
                            margin: "0",
                            padding: "0.5rem",
                            backgroundColor: "#f8f9fa",
                            borderRadius: "4px",
                          }}
                        >
                          {new Date(
                            selectedDelivery.deadline,
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Status da entrega */}
                    <div style={{ marginBottom: "1.5rem" }}>
                      <h4 style={{ margin: "0 0 0.5rem 0" }}>
                        Delivery Status
                      </h4>
                      <div
                        style={{
                          padding: "1rem",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "8px",
                        }}
                      >
                        {selectedDelivery.status === "open" && (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Icon.Clock
                              size="md"
                              style={{ marginRight: "1rem", color: "#0066cc" }}
                            />
                            <div>
                              <p style={{ margin: "0", fontWeight: "bold" }}>
                                Waiting for Carrier
                              </p>
                              <small style={{ color: "#666" }}>
                                Your delivery is available for carriers to
                                accept
                              </small>
                            </div>
                          </div>
                        )}
                        {selectedDelivery.status === "accepted" && (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Icon.Check
                              size="md"
                              style={{ marginRight: "1rem", color: "#ffc107" }}
                            />
                            <div>
                              <p style={{ margin: "0", fontWeight: "bold" }}>
                                Delivery Accepted
                              </p>
                              <small style={{ color: "#666" }}>
                                A carrier has accepted your delivery and will
                                soon pick it up
                              </small>
                            </div>
                          </div>
                        )}
                        {selectedDelivery.status === "in_transit" && (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Icon.Truck01
                              size="md"
                              style={{ marginRight: "1rem", color: "#0066cc" }}
                            />
                            <div>
                              <p style={{ margin: "0", fontWeight: "bold" }}>
                                In Transit
                              </p>
                              <small style={{ color: "#666" }}>
                                Your delivery is on its way to the destination
                              </small>
                            </div>
                          </div>
                        )}
                        {selectedDelivery.status === "delivered" && (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Icon.CheckCircle
                              size="md"
                              style={{ marginRight: "1rem", color: "#28a745" }}
                            />
                            <div>
                              <p style={{ margin: "0", fontWeight: "bold" }}>
                                Delivered
                              </p>
                              <small style={{ color: "#666" }}>
                                Your delivery has been completed successfully
                              </small>
                            </div>
                          </div>
                        )}
                        {selectedDelivery.status === "completed" && (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Icon.CurrencyDollarCircle
                              size="md"
                              style={{ marginRight: "1rem", color: "#28a745" }}
                            />
                            <div>
                              <p style={{ margin: "0", fontWeight: "bold" }}>
                                Completed
                              </p>
                              <small style={{ color: "#666" }}>
                                Delivery finalized and payment released to the
                                carrier
                              </small>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Informações da blockchain */}
                    <div>
                      <h4 style={{ margin: "0 0 0.5rem 0" }}>
                        Blockchain Information
                      </h4>
                      <div
                        style={{
                          padding: "1rem",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "8px",
                        }}
                      >
                        <div style={{ marginBottom: "0.5rem" }}>
                          <small style={{ color: "#666" }}>Delivery ID:</small>
                          <p
                            style={{
                              margin: "0",
                              fontFamily: "monospace",
                              fontSize: "0.9rem",
                            }}
                          >
                            #{selectedDelivery.id}
                          </p>
                        </div>
                        <div style={{ marginBottom: "0.5rem" }}>
                          <small style={{ color: "#666" }}>
                            Smart Contract:
                          </small>
                          <p
                            style={{
                              margin: "0",
                              fontFamily: "monospace",
                              fontSize: "0.8rem",
                            }}
                          >
                            CDRW...X7YZ (Escrow Ativo)
                          </p>
                        </div>
                        <div>
                          <small style={{ color: "#666" }}>
                            Escrow Status:
                          </small>
                          <p
                            style={{
                              margin: "0",
                              color:
                                selectedDelivery.status === "completed"
                                  ? "#28a745"
                                  : "#0066cc",
                              fontWeight: "bold",
                            }}
                          >
                            {selectedDelivery.status === "completed"
                              ? "✓ Funds Released"
                              : "🔒 Funds in Escrow"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedDelivery(null);
                  }}
                >
                  Close
                </Button>
                {selectedDelivery.status === "open" && (
                  <Button
                    variant="error"
                    size="md"
                    onClick={() => {
                      // Implementar lógica de cancelamento aqui
                      setShowDetailsModal(false);
                      setSelectedDelivery(null);
                    }}
                  >
                    Cancel Delivery
                  </Button>
                )}
              </div>
            </div>
          </Modal>
        )}

        {/* Problem/Solution Section */}
        <div
          style={{
            marginTop: "4rem",
            padding: "2rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
            How We Solve Traditional Problems
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            <div>
              <h3 style={{ color: "#dc3545", marginBottom: "1rem" }}>
                ❌ Traditional Problems
              </h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{ marginBottom: "0.5rem" }}>
                  • Lack of trust between parties
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  • Centralization and high fees
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  • Lack of transparency
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  • Delayed payments (up to 30 days)
                </li>
              </ul>
            </div>

            <div>
              <h3 style={{ color: "#28a745", marginBottom: "1rem" }}>
                ✅ Our Solution
              </h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{ marginBottom: "0.5rem" }}>
                  • Automatic escrow with smart contracts
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  • Total decentralization, no intermediaries
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  • Total transparency on the blockchain
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  • Immediate payment after delivery
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Layout.Inset>
    </Layout.Content>
  );
};

export default Home;
