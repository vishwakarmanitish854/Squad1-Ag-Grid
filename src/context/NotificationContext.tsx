import React, { createContext, useCallback, useState } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type: NotificationType, duration?: number) => void;
  removeNotification: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string, type: NotificationType, duration = 3000) => {
    const id = Date.now().toString();
    const notification: Notification = { id, message, type, duration };

    setNotifications((prev) => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}
