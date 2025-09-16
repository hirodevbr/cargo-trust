import React, { useState, useEffect, useCallback } from "react";
import {
  Layout,
  Card,
  Button,
  Badge,
  Icon,
  Alert,
  Modal,
} from "@stellar/design-system";
import { useWallet } from "../hooks/useWallet";
import { useDeliveryContract } from "../hooks/useDeliveryContract";
import { useDeliveries } from "../hooks/useDeliveries";
import { useScrollLock } from "../hooks/useScrollLock";
import { useModalFix } from "../hooks/useModalFix";
import { useNotifications } from "../components/Notification";
import CargoTrustLogo from "../components/CargoTrustLogo";

interface AvailableDelivery {
  id: number;
  origin: string;
  destination: string;
  description: string;
  amount: string;
  deadline: string;
  requester: string;
  distance: string;
  estimatedTime: string;
}

interface AcceptedDelivery {
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
  requester: string;
  carrier?: string;
}

const Carriers: React.FC = () => {
  const wallet = useWallet();
  const { contract, isReady, isLoading, error } = useDeliveryContract();
  const {
    getOpenDeliveries,
    getDeliveriesByCarrier,
    acceptDelivery,
    updateDeliveryStatus,
  } = useDeliveries();
  const { showSuccess, showError, NotificationContainer } = useNotifications();
  const [selectedDelivery, setSelectedDelivery] =
    useState<AvailableDelivery | null>(null);
  const [selectedActiveDelivery, setSelectedActiveDelivery] =
    useState<AcceptedDelivery | null>(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [processingDeliveries, setProcessingDeliveries] = useState<Set<number>>(
    new Set(),
  );

  // Hooks para gerenciar modais e scroll
  useScrollLock(showAcceptModal || showDetailsModal);
  useModalFix(showAcceptModal || showDetailsModal);

  // Estados para entregas
  const [availableDeliveries, setAvailableDeliveries] = useState<
    AvailableDelivery[]
  >([]);
  const [acceptedDeliveries, setAcceptedDeliveries] = useState<
    AcceptedDelivery[]
  >([]);

  // Carregar entregas disponíveis e aceitas
  const loadDeliveries = useCallback(async () => {
    try {
      const openDeliveries = await getOpenDeliveries();
      setAvailableDeliveries(
        openDeliveries.map((delivery) => ({
          ...delivery,
          distance: "Calculating...",
          estimatedTime: "To be determined",
        })),
      );

      if (wallet?.address) {
        const carrierDeliveries = await getDeliveriesByCarrier(wallet.address);
        setAcceptedDeliveries(carrierDeliveries);
      } else {
        setAcceptedDeliveries([]);
      }
    } catch (error) {
      console.error("Error loading deliveries:", error);
    }
  }, [wallet?.address, getOpenDeliveries, getDeliveriesByCarrier]);

  useEffect(() => {
    void loadDeliveries();
  }, [loadDeliveries]);

  const getStatusInfo = (status: string) => {
    const statusConfig = {
      accepted: {
        variant: "warning" as const,
        text: "Accepted",
        icon: Icon.Clock as React.ComponentType<{
          size?: string;
          style?: React.CSSProperties;
        }>,
      },
      picked_up: {
        variant: "secondary" as const,
        text: "Picked Up",
        icon: Icon.Package as React.ComponentType<{
          size?: string;
          style?: React.CSSProperties;
        }>,
      },
      in_transit: {
        variant: "primary" as const,
        text: "In Transit",
        icon: Icon.Truck01 as React.ComponentType<{
          size?: string;
          style?: React.CSSProperties;
        }>,
      },
      delivered: {
        variant: "success" as const,
        text: "Delivered",
        icon: Icon.CheckCircle as React.ComponentType<{
          size?: string;
          style?: React.CSSProperties;
        }>,
      },
      completed: {
        variant: "success" as const,
        text: "Completed",
        icon: Icon.CurrencyDollarCircle as React.ComponentType<{
          size?: string;
          style?: React.CSSProperties;
        }>,
      },
    };

    return statusConfig[status as keyof typeof statusConfig];
  };

  const handleAcceptDelivery = async () => {
    if (!selectedDelivery || !contract || !isReady || !wallet?.address) return;

    try {
      setIsAccepting(true);

      await contract.acceptDelivery({
        deliveryId: BigInt(selectedDelivery.id),
      });

      // Aceitar entrega no sistema de persistência
      await acceptDelivery(selectedDelivery.id, wallet.address);

      // Recarregar dados para atualizar as listas
      await loadDeliveries();

      setShowAcceptModal(false);
      setSelectedDelivery(null);

      // Mostrar notificação de sucesso
      showSuccess(
        "🎉 Delivery Accepted!",
        "The delivery has been added to your active deliveries and is ready for pickup.",
      );
    } catch (error) {
      console.error("Erro ao aceitar entrega:", error);
      showError(
        "❌ Acceptance Error",
        "Could not accept the delivery. Check your connection and try again.",
      );
    } finally {
      setIsAccepting(false);
    }
  };

  const handleStatusUpdate = async (
    deliveryId: number,
    newStatus: AcceptedDelivery["status"],
  ) => {
    if (!contract || !isReady) return;

    try {
      setProcessingDeliveries((prev) => new Set(prev).add(deliveryId));

      switch (newStatus) {
        case "picked_up":
          await contract.confirmPickup({ deliveryId: BigInt(deliveryId) });
          break;
        case "in_transit":
          await contract.confirmInTransit({ deliveryId: BigInt(deliveryId) });
          break;
        case "delivered":
          await contract.confirmDelivery({ deliveryId: BigInt(deliveryId) });
          break;
        case "completed":
          await contract.releasePayment({ deliveryId: BigInt(deliveryId) });
          break;
      }

      // Atualizar status no sistema de persistência
      await updateDeliveryStatus(deliveryId, newStatus);

      // Recarregar dados para atualizar as listas
      await loadDeliveries();

      // Mostrar notificação de sucesso
      const statusText = getStatusInfo(newStatus).text;
      showSuccess(
        "✅ Status Updated!",
        `The delivery now has status: ${statusText}`,
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      showError(
        "❌ Update Error",
        "Could not update the status. Check your connection and try again.",
      );
    } finally {
      setProcessingDeliveries((prev) => {
        const newSet = new Set(prev);
        newSet.delete(deliveryId);
        return newSet;
      });
    }
  };

  const getNextAction = (status: AcceptedDelivery["status"]) => {
    switch (status) {
      case "accepted":
        return { text: "Confirm Pickup", nextStatus: "picked_up" as const };
      case "picked_up":
        return { text: "Start Transport", nextStatus: "in_transit" as const };
      case "in_transit":
        return { text: "Confirm Delivery", nextStatus: "delivered" as const };
      case "delivered":
        return { text: "Release Payment", nextStatus: "completed" as const };
      case "open":
      case "completed":
      default:
        return null;
    }
  };

  return (
    <Layout.Content>
      <NotificationContainer />
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <Layout.Inset>
        {/* Header */}
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
            Carrier Portal
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "#666",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            Find available deliveries, accept jobs and manage your routes.
            Receive payments automatically through the blockchain.
          </p>
        </div>

        {!wallet?.address ? (
          <Alert
            variant="error"
            title="Wallet not connected"
            placement="inline"
          >
            To accept deliveries, you need to connect your Stellar wallet.
          </Alert>
        ) : error ? (
          <Alert variant="error" title="Contract error" placement="inline">
            {error}
          </Alert>
        ) : (
          <div>
            {/* Stats Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
                marginBottom: "3rem",
              }}
            >
              <Card>
                <div style={{ padding: "1.5rem", textAlign: "center" }}>
                  <Icon.Package
                    size="lg"
                    style={{ marginBottom: "0.5rem", color: "#0066cc" }}
                  />
                  <h3 style={{ margin: "0", fontSize: "2rem" }}>
                    {availableDeliveries.length}
                  </h3>
                  <p style={{ margin: "0", color: "#666" }}>
                    Available Deliveries
                  </p>
                </div>
              </Card>

              <Card>
                <div style={{ padding: "1.5rem", textAlign: "center" }}>
                  <Icon.Truck01
                    size="lg"
                    style={{ marginBottom: "0.5rem", color: "#ff9500" }}
                  />
                  <h3 style={{ margin: "0", fontSize: "2rem" }}>
                    {acceptedDeliveries.length}
                  </h3>
                  <p style={{ margin: "0", color: "#666" }}>
                    Active Deliveries
                  </p>
                </div>
              </Card>

              <Card>
                <div style={{ padding: "1.5rem", textAlign: "center" }}>
                  <Icon.CurrencyDollarCircle
                    size="lg"
                    style={{ marginBottom: "0.5rem", color: "#28a745" }}
                  />
                  <h3 style={{ margin: "0", fontSize: "2rem" }}>
                    {acceptedDeliveries
                      .reduce((sum, d) => sum + parseFloat(d.amount), 0)
                      .toFixed(2)}
                  </h3>
                  <p style={{ margin: "0", color: "#666" }}>Pending XLM</p>
                </div>
              </Card>
            </div>

            {/* Active Deliveries */}
            {acceptedDeliveries.length > 0 && (
              <div style={{ marginBottom: "3rem" }}>
                <h2 style={{ marginBottom: "1.5rem" }}>
                  <Icon.Truck01 size="md" style={{ marginRight: "0.5rem" }} />
                  Your Active Deliveries
                </h2>

                <div style={{ display: "grid", gap: "1rem" }}>
                  {acceptedDeliveries.map((delivery) => {
                    const statusInfo = getStatusInfo(delivery.status);
                    const nextAction = getNextAction(delivery.status);
                    const statusText = statusInfo.text;

                    return (
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
                              <Badge variant={statusInfo.variant}>
                                {statusText}
                              </Badge>
                              <p
                                style={{
                                  margin: "0.5rem 0 0 0",
                                  fontWeight: "bold",
                                  fontSize: "1.1rem",
                                }}
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
                            <div>
                              <small
                                style={{ color: "#666", display: "block" }}
                              >
                                Requester: {delivery.requester}
                              </small>
                              <small style={{ color: "#666" }}>
                                Deadline:{" "}
                                {new Date(delivery.deadline).toLocaleDateString(
                                  "en-US",
                                )}
                              </small>
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <Button
                                variant="tertiary"
                                size="sm"
                                onClick={() => {
                                  setSelectedActiveDelivery(delivery);
                                  setShowDetailsModal(true);
                                }}
                              >
                                <Icon.Eye size="sm" />
                                Details
                              </Button>
                              {nextAction &&
                                delivery.status !== "completed" && (
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() =>
                                      void handleStatusUpdate(
                                        delivery.id,
                                        nextAction.nextStatus,
                                      )
                                    }
                                    disabled={
                                      processingDeliveries.has(delivery.id) ||
                                      !isReady ||
                                      isLoading
                                    }
                                  >
                                    {processingDeliveries.has(delivery.id)
                                      ? "Processing..."
                                      : nextAction.text}
                                  </Button>
                                )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Available Deliveries */}
            <div>
              <h2 style={{ marginBottom: "1.5rem" }}>
                <Icon.SearchLg size="md" style={{ marginRight: "0.5rem" }} />
                Available Deliveries
              </h2>

              <div style={{ display: "grid", gap: "1rem" }}>
                {availableDeliveries.map((delivery) => (
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
                          <p
                            style={{
                              margin: "0",
                              fontWeight: "bold",
                              fontSize: "1.2rem",
                              color: "#28a745",
                            }}
                          >
                            {delivery.amount} XLM
                          </p>
                          <Badge variant="secondary">{delivery.distance}</Badge>
                        </div>
                      </div>

                      <p style={{ marginBottom: "1rem", color: "#333" }}>
                        {delivery.description}
                      </p>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 2fr",
                          gap: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        <div>
                          <small style={{ color: "#666", display: "block" }}>
                            Estimated Time
                          </small>
                          <strong
                            style={{
                              color:
                                delivery.estimatedTime === "A definir"
                                  ? "#F59E0B"
                                  : "#374151",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                            }}
                          >
                            {delivery.estimatedTime === "To be determined" &&
                              "⏳ "}
                            {delivery.estimatedTime}
                          </strong>
                        </div>
                        <div>
                          <small style={{ color: "#666", display: "block" }}>
                            Deadline
                          </small>
                          <strong>
                            {new Date(delivery.deadline).toLocaleDateString(
                              "en-US",
                            )}
                          </strong>
                        </div>
                        <div style={{ minWidth: 0, overflow: "hidden" }}>
                          <small style={{ color: "#666", display: "block" }}>
                            Requester
                          </small>
                          <strong
                            style={{
                              fontFamily: "monospace",
                              fontSize: "0.8rem",
                              wordBreak: "break-all",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "block",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {delivery.requester}
                          </strong>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <Badge variant="primary">Urgent</Badge>
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              padding: "0.25rem 0.75rem",
                              backgroundColor: "#FEF3C7",
                              color: "#92400E",
                              borderRadius: "0.375rem",
                              fontSize: "0.75rem",
                              fontWeight: "500",
                              animation: "pulse 2s infinite",
                            }}
                          >
                            <span
                              style={{ animation: "spin 1s linear infinite" }}
                            >
                              ⏳
                            </span>
                            Calculating...
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <Button
                            variant="tertiary"
                            size="sm"
                            onClick={() => {
                              // Converter AvailableDelivery para AcceptedDelivery para reutilizar o modal
                              const deliveryForModal: AcceptedDelivery = {
                                ...delivery,
                                status: "accepted" as const,
                              };
                              setSelectedActiveDelivery(deliveryForModal);
                              setShowDetailsModal(true);
                            }}
                          >
                            <Icon.Eye size="sm" />
                            View Details
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setSelectedDelivery(delivery);
                              setShowAcceptModal(true);
                            }}
                          >
                            <Icon.Check size="sm" />
                            Accept
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {availableDeliveries.length === 0 && (
                  <Card>
                    <div
                      style={{
                        padding: "3rem",
                        textAlign: "center",
                        color: "#666",
                      }}
                    >
                      <Icon.SearchLg
                        size="lg"
                        style={{ marginBottom: "1rem" }}
                      />
                      <p>No deliveries available at the moment.</p>
                      <p>New opportunities will appear here in real time.</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Accept Delivery Modal */}
        {showAcceptModal && selectedDelivery && (
          <Modal
            visible={showAcceptModal}
            onClose={() => setShowAcceptModal(false)}
          >
            <div
              style={{
                padding: "1.5rem",
                maxHeight: "90vh",
                overflowY: "auto",
                width: "100%",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              <h3
                style={{
                  marginTop: "0",
                  marginBottom: "1rem",
                  fontSize: "1.5rem",
                }}
              >
                Confirm Acceptance
              </h3>
              <p
                style={{
                  marginBottom: "1.5rem",
                  color: "#666",
                  lineHeight: "1.5",
                }}
              >
                You are about to accept the following delivery:
              </p>

              <Card>
                <div style={{ padding: "1.5rem" }}>
                  <h4
                    style={{
                      marginTop: "0",
                      marginBottom: "1rem",
                      fontSize: "1.2rem",
                    }}
                  >
                    Delivery #{selectedDelivery.id}
                  </h4>

                  <div style={{ display: "grid", gap: "0.75rem" }}>
                    <div>
                      <strong style={{ color: "#333" }}>Route:</strong>
                      <span
                        style={{ marginLeft: "0.5rem", fontSize: "0.9rem" }}
                      >
                        {selectedDelivery.origin} →{" "}
                        {selectedDelivery.destination}
                      </span>
                    </div>

                    <div>
                      <strong style={{ color: "#333" }}>Description:</strong>
                      <span
                        style={{ marginLeft: "0.5rem", fontSize: "0.9rem" }}
                      >
                        {selectedDelivery.description}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(140px, 1fr))",
                        gap: "0.75rem",
                      }}
                    >
                      <div>
                        <strong style={{ color: "#333" }}>Amount:</strong>
                        <span
                          style={{
                            marginLeft: "0.5rem",
                            fontSize: "1rem",
                            fontWeight: "bold",
                            color: "#28a745",
                          }}
                        >
                          {selectedDelivery.amount} XLM
                        </span>
                      </div>

                      <div>
                        <strong style={{ color: "#333" }}>Distance:</strong>
                        <span
                          style={{ marginLeft: "0.5rem", fontSize: "0.9rem" }}
                        >
                          {selectedDelivery.distance}
                        </span>
                      </div>
                    </div>

                    <div>
                      <strong style={{ color: "#333" }}>Deadline:</strong>
                      <span
                        style={{ marginLeft: "0.5rem", fontSize: "0.9rem" }}
                      >
                        {new Date(selectedDelivery.deadline).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginTop: "2rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid #e9ecef",
                  justifyContent: "flex-end",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setShowAcceptModal(false)}
                  style={{ minWidth: "100px" }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => void handleAcceptDelivery()}
                  disabled={isAccepting || !isReady || isLoading}
                  style={{ minWidth: "150px" }}
                >
                  {isAccepting ? "Accepting..." : "Confirm Acceptance"}
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedActiveDelivery && (
          <Modal
            visible={showDetailsModal}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedActiveDelivery(null);
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
                Delivery Details #{selectedActiveDelivery.id}
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
                        <Badge
                          variant={
                            getStatusInfo(selectedActiveDelivery.status).variant
                          }
                        >
                          {getStatusInfo(selectedActiveDelivery.status).text}
                        </Badge>
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
                          {selectedActiveDelivery.amount} XLM
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
                            {selectedActiveDelivery.origin}
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
                            {selectedActiveDelivery.destination}
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
                          "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "1rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <div>
                        <h4
                          style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}
                        >
                          Description
                        </h4>
                        <p
                          style={{
                            margin: "0",
                            padding: "0.75rem",
                            backgroundColor: "#f8f9fa",
                            borderRadius: "6px",
                            fontSize: "0.9rem",
                            lineHeight: "1.4",
                            wordBreak: "break-word",
                          }}
                        >
                          {selectedActiveDelivery.description}
                        </p>
                      </div>
                      <div>
                        <h4
                          style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}
                        >
                          Delivery Deadline
                        </h4>
                        <p
                          style={{
                            margin: "0",
                            padding: "0.75rem",
                            backgroundColor: "#f8f9fa",
                            borderRadius: "6px",
                            fontSize: "0.9rem",
                            lineHeight: "1.4",
                          }}
                        >
                          {new Date(
                            selectedActiveDelivery.deadline,
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Informações do solicitante */}
                    <div style={{ marginBottom: "1.5rem" }}>
                      <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>
                        Requester
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "1rem",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "8px",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                        }}
                      >
                        <Icon.User01
                          size="md"
                          style={{ color: "#666", flexShrink: 0 }}
                        />
                        <div style={{ flex: 1, minWidth: "200px" }}>
                          <p
                            style={{
                              margin: "0",
                              fontFamily: "monospace",
                              fontSize: "0.8rem",
                              wordBreak: "break-all",
                              lineHeight: "1.3",
                            }}
                          >
                            {selectedActiveDelivery.requester}
                          </p>
                          <small style={{ color: "#666", fontSize: "0.75rem" }}>
                            Stellar wallet address
                          </small>
                        </div>
                      </div>
                    </div>

                    {/* Timeline de status (para entregas aceitas) */}
                    {selectedActiveDelivery.status !== "accepted" && (
                      <div>
                        <h4 style={{ margin: "0 0 1rem 0" }}>
                          Delivery Progress
                        </h4>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                          }}
                        >
                          {[
                            {
                              status: "accepted",
                              text: "Accepted",
                              icon: Icon.Check as React.ComponentType<{
                                size?: string;
                                style?: React.CSSProperties;
                              }>,
                            },
                            {
                              status: "picked_up",
                              text: "Picked Up",
                              icon: Icon.Package as React.ComponentType<{
                                size?: string;
                                style?: React.CSSProperties;
                              }>,
                            },
                            {
                              status: "in_transit",
                              text: "In Transit",
                              icon: Icon.Truck01 as React.ComponentType<{
                                size?: string;
                                style?: React.CSSProperties;
                              }>,
                            },
                            {
                              status: "delivered",
                              text: "Delivered",
                              icon: Icon.CheckCircle as React.ComponentType<{
                                size?: string;
                                style?: React.CSSProperties;
                              }>,
                            },
                            {
                              status: "completed",
                              text: "Completed",
                              icon: Icon.CurrencyDollarCircle as React.ComponentType<{
                                size?: string;
                                style?: React.CSSProperties;
                              }>,
                            },
                          ].map((step, index) => {
                            const isCompleted =
                              [
                                "accepted",
                                "picked_up",
                                "in_transit",
                                "delivered",
                                "completed",
                              ].indexOf(selectedActiveDelivery.status) >= index;
                            const isCurrent =
                              step.status === selectedActiveDelivery.status;
                            const StepIcon = step.icon as React.ComponentType<{
                              size?: string;
                              style?: React.CSSProperties;
                            }>;

                            return (
                              <div
                                key={step.status}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  flex: 1,
                                }}
                              >
                                <div
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    backgroundColor: isCompleted
                                      ? "#28a745"
                                      : isCurrent
                                        ? "#ffc107"
                                        : "#e9ecef",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: "0.5rem",
                                  }}
                                >
                                  <StepIcon
                                    size="sm"
                                    style={{
                                      color:
                                        isCompleted || isCurrent
                                          ? "white"
                                          : "#6c757d",
                                    }}
                                  />
                                </div>
                                <small
                                  style={{
                                    textAlign: "center",
                                    color: isCompleted
                                      ? "#28a745"
                                      : isCurrent
                                        ? "#ffc107"
                                        : "#6c757d",
                                    fontWeight: isCurrent ? "bold" : "normal",
                                  }}
                                >
                                  {step.text}
                                </small>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                  flexWrap: "wrap",
                  marginTop: "1.5rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid #e9ecef",
                }}
              >
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedActiveDelivery(null);
                  }}
                  style={{ minWidth: "100px" }}
                >
                  Close
                </Button>
                {selectedActiveDelivery.status !== "completed" && (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      const nextAction = getNextAction(
                        selectedActiveDelivery.status,
                      );
                      if (nextAction) {
                        void handleStatusUpdate(
                          selectedActiveDelivery.id,
                          nextAction.nextStatus,
                        );
                        setShowDetailsModal(false);
                        setSelectedActiveDelivery(null);
                      }
                    }}
                    disabled={
                      processingDeliveries.has(selectedActiveDelivery.id) ||
                      !isReady ||
                      isLoading
                    }
                    style={{ minWidth: "150px" }}
                  >
                    {(() => {
                      const nextAction = getNextAction(
                        selectedActiveDelivery.status,
                      );
                      if (processingDeliveries.has(selectedActiveDelivery.id)) {
                        return "Processing...";
                      }
                      return nextAction ? nextAction.text : "Update";
                    })()}
                  </Button>
                )}
              </div>
            </div>
          </Modal>
        )}

        {/* How it Works Section */}
        <div
          style={{
            marginTop: "4rem",
            padding: "2rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
            How It Works for Carriers
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "2rem",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <Icon.SearchLg
                size="lg"
                style={{ marginBottom: "1rem", color: "#0066cc" }}
              />
              <h3>1. Find Deliveries</h3>
              <p>
                Browse available opportunities and choose the ones that best fit
                your route.
              </p>
            </div>

            <div style={{ textAlign: "center" }}>
              <Icon.Check
                size="lg"
                style={{ marginBottom: "1rem", color: "#ff9500" }}
              />
              <h3>2. Accept the Job</h3>
              <p>
                Accept the delivery and the amount is automatically held in
                escrow on the blockchain until completion.
              </p>
            </div>

            <div style={{ textAlign: "center" }}>
              <Icon.Truck01
                size="lg"
                style={{ marginBottom: "1rem", color: "#28a745" }}
              />
              <h3>3. Execute the Delivery</h3>
              <p>
                Pick up the item, transport safely and confirm delivery at the
                destination.
              </p>
            </div>

            <div style={{ textAlign: "center" }}>
              <Icon.CurrencyDollarCircle
                size="lg"
                style={{ marginBottom: "1rem", color: "#6f42c1" }}
              />
              <h3>4. Receive Instantly</h3>
              <p>
                After confirmation, payment is automatically released to your
                wallet.
              </p>
            </div>
          </div>
        </div>
      </Layout.Inset>
    </Layout.Content>
  );
};

export default Carriers;
