/**
 * Simple notification system without external dependencies
 * Uses native browser notifications and custom toast-like divs
 */

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationOptions {
  title: string;
  description?: string;
  duration?: number;
  type?: NotificationType;
}

class SimpleNotificationSystem {
  private container: HTMLDivElement | null = null;

  private ensureContainer() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'notification-container';
      this.container.style.cssText = `
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        max-width: 420px;
      `;
      document.body.appendChild(this.container);
    }
    return this.container;
  }

  show(options: NotificationOptions) {
    const container = this.ensureContainer();
    const { title, description, duration = 5000, type = 'info' } = options;

    const notification = document.createElement('div');
    notification.style.cssText = `
      background: hsl(var(--card));
      border: 1px solid hsl(var(--border));
      border-radius: 0.5rem;
      padding: 1rem;
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
      animation: slideIn 0.3s ease-out;
    `;

    const colorMap = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
    };

    notification.innerHTML = `
      <div style="display: flex; gap: 0.75rem;">
        <div style="width: 4px; background: ${colorMap[type]}; border-radius: 2px;"></div>
        <div style="flex: 1;">
          <div style="font-weight: 600; font-size: 0.875rem;">${title}</div>
          ${description ? `<div style="font-size: 0.75rem; color: hsl(var(--muted-foreground)); margin-top: 0.25rem;">${description}</div>` : ''}
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="color: hsl(var(--muted-foreground)); cursor: pointer; background: none; border: none; font-size: 1.25rem; line-height: 1; padding: 0;">×</button>
      </div>
    `;

    container.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }

  success(title: string, description?: string) {
    this.show({ title, description, type: 'success' });
  }

  error(title: string, description?: string) {
    this.show({ title, description, type: 'error' });
  }

  warning(title: string, description?: string) {
    this.show({ title, description, type: 'warning' });
  }

  info(title: string, description?: string) {
    this.show({ title, description, type: 'info' });
  }
}

// Add CSS animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

export const notify = new SimpleNotificationSystem();
