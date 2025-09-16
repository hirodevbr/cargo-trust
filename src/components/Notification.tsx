import React, { useState, useEffect } from 'react';

interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

export const Notification: React.FC<NotificationProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animar entrada
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto-fechar após duração
    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoCloseTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Aguardar animação de saída
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: '#10B981',
          borderColor: '#059669',
          icon: '✅'
        };
      case 'error':
        return {
          bgColor: '#EF4444',
          borderColor: '#DC2626',
          icon: '❌'
        };
      case 'warning':
        return {
          bgColor: '#F59E0B',
          borderColor: '#D97706',
          icon: '⚠️'
        };
      case 'info':
      default:
        return {
          bgColor: '#3B82F6',
          borderColor: '#2563EB',
          icon: 'ℹ️'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: styles.bgColor,
        color: 'white',
        padding: '16px 20px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        border: `2px solid ${styles.borderColor}`,
        minWidth: '320px',
        maxWidth: '400px',
        zIndex: 10000,
        transform: isVisible && !isLeaving ? 'translateX(0)' : 'translateX(100%)',
        opacity: isVisible && !isLeaving ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer'
      }}
      onClick={handleClose}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ fontSize: '20px', flexShrink: 0 }}>
          {styles.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: '16px', 
            marginBottom: '4px',
            lineHeight: '1.2'
          }}>
            {title}
          </div>
          <div style={{ 
            fontSize: '14px', 
            opacity: 0.9,
            lineHeight: '1.4'
          }}>
            {message}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '0',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            flexShrink: 0
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Hook para gerenciar notificações
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    duration?: number;
  }>>([]);

  const addNotification = (
    type: 'success' | 'error' | 'info' | 'warning',
    title: string,
    message: string,
    duration?: number
  ) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, type, title, message, duration }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const showSuccess = (title: string, message: string, duration?: number) => {
    addNotification('success', title, message, duration);
  };

  const showError = (title: string, message: string, duration?: number) => {
    addNotification('error', title, message, duration);
  };

  const showWarning = (title: string, message: string, duration?: number) => {
    addNotification('warning', title, message, duration);
  };

  const showInfo = (title: string, message: string, duration?: number) => {
    addNotification('info', title, message, duration);
  };

  const NotificationContainer = () => (
    <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 10000 }}>
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    NotificationContainer
  };
};
