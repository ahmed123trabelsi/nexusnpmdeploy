import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Subject, map } from 'rxjs';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IMessage } from './interfaces/IMessage.interface';
import { Notification, NotificationSchema } from './notification.schema';
import { CreateNotificationsDto } from './notification.dto';
import { UpdateAllUnseenNotificationDto } from './UpdateAllUnseenNotification.dto';


@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly subject = new Subject();

  constructor(@InjectModel(Notification.name) private notificationModel: Model<Notification>) { }


  notificationListener() {
    try {
      return this.subject.asObservable().pipe(
        map((notification: Notification) => JSON.stringify(notification))
      );

    } catch (error) {
      this.logger.error('notificationListener : ' + error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  /**
   * create new notification
   * @param createNotificationsDto title & description
   * @returns message => notification sent successfully 
   */
  async createNotification(createNotificationsDto: CreateNotificationsDto): Promise<IMessage> {
    try {
      const notification = await new this.notificationModel({
        description: createNotificationsDto.description,
        title: createNotificationsDto.title,
        isSeen: false
      }).save().catch(error => { throw new Error(error) });

      // send notification
      if (notification) this.subject.next(notification);

      return { message: 'notification sent successfully' };
    } catch (error) {
      this.logger.error('createNotification : ' + error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }




  /**
   * get all notifications
   * @returns array of Notification
   */
  async getNotifications(): Promise<Notification[]> {
    return await this.notificationModel.find();
  }
     /**
   * update unseen notification by array of Ids
   * @param updateAllUnseenNotificationDto array of notifications_ids
   * @returns message => updated successfully
   */
  async updateUnseenNotificationByIds(updateAllUnseenNotificationDto: UpdateAllUnseenNotificationDto) {
    try {
      const notifications = await this.notificationModel.updateMany(
        { _id: { $in: updateAllUnseenNotificationDto.notifications_ids } },
        { isSeen: true }
      );

      if (notifications.modifiedCount >= 1) return { message: 'updated successfully' };
      else if (notifications.matchedCount < 1) throw new Error('not found');
      else throw new Error('can not update due to database error');

    } catch (error) {
      this.logger.error('updateUnseenNotificationByIds : ' + error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
