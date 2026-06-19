import { useNotification, type Notification, type NotificationType } from '../context/NotificationContext';
import '../styles/notification.css';

function NotificationItem({ notification, onClose }: { notification: Notification; onClose: () => void }) {
  const icons: Record<NotificationType, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ⓘ',
  };

  return (
    <div className={`notification notification-${notification.type}`} role="alert" aria-live="polite">
      <span className="notification-icon">{icons[notification.type]}</span>
      <span className="notification-message">{notification.message}</span>
      <button
        className="notification-close"
        onClick={onClose}
        aria-label={`Close ${notification.type} notification`}
      >
        ×
      </button>
    </div>
  );
}

export function NotificationCenter() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="notification-center" role="region" aria-label="Notifications">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}
