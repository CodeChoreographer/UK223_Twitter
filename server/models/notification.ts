export class Notification {
  id: number;
  userId: number;
  message: string;
  readStatus: boolean;

  constructor(id: number, userId: number, message: string, readStatus: boolean = false) {
    this.id = id;
    this.userId = userId;
    this.message = message;
    this.readStatus = readStatus;
  }

  markAsRead(): void {
    this.readStatus = true;
    console.log('Notification marked as read.');
  }

  sendNotification(): void {
    console.log('Notification sent.');
  }
}
