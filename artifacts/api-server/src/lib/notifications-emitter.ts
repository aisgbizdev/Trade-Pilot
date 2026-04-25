import { EventEmitter } from "node:events";

export interface NotificationEvent {
  userId: number;
  notification: {
    id?: number;
    title: string;
    message: string;
    type?: string | null;
    createdAt?: string;
  };
}

class NotificationsEmitter extends EventEmitter {
  emitForUser(userId: number, notification: NotificationEvent["notification"]) {
    this.emit(`user:${userId}`, { userId, notification });
  }

  subscribeForUser(userId: number, listener: (ev: NotificationEvent) => void) {
    const channel = `user:${userId}`;
    this.on(channel, listener);
    return () => this.off(channel, listener);
  }
}

export const notificationsEmitter = new NotificationsEmitter();

notificationsEmitter.setMaxListeners(0);
