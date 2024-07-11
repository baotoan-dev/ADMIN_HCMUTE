import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './Notification.module.scss';
import avatar from 'data/product3.jpg';
import { useAppStateContext } from 'contexts/AppContext';
import socket, { subscribeToNotification, subscribeToError } from 'socket/socketService';
import { getNotificationCompaniesAction } from 'redux/slice/notificationCompaniesSlice';
import moment from 'moment';
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const Notification = ({
  handleCloseNotification
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notificationCompanies = useSelector((state) => state.notificationCompanies.notificationCompanies);
  const { themeMode } = useAppStateContext();
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(getNotificationCompaniesAction());
  }, [dispatch]);

  useEffect(() => {
    if (notificationCompanies.length > 0) {
      setNotifications(notificationCompanies);
    }
  }, [notificationCompanies]);

  useEffect(() => {
    const handleNotification = (notification) => {
      console.log('Notification received:', notification);
      setNotifications((prevNotifications) => {
        const uniqueNotifications = new Map(prevNotifications.map((n) => [n.id, n]));
        uniqueNotifications.set(notification.id, notification);
        return Array.from(uniqueNotifications.values());
      });
    };

    const handleError = (error) => {
      console.error('Error received:', error);
      setError(error);
    };

    subscribeToNotification(handleNotification);
    subscribeToError(handleError);

    // Clean up subscriptions when component unmounts
    return () => {
      socket.off('server-send-notification', handleNotification);
      socket.off('server-send-error-message', handleError);
    };
  }, []);

  return (
    <div className={cx('wrapper', themeMode === 'dark' ? 'dark' : '')}>
      {notifications.map((notif, index) => (
        <div key={index} className={cx('item', themeMode === 'dark' ? 'dark' : '')}>
          <img src={avatar} alt="" />
          <div className={cx('content')}
            onClick={() => {
              navigate(`/admin/company-manager/${notif.company_id}`);
              handleCloseNotification();
            }}
          >
            <p className={cx('sub-title')}>{notif.message}</p>
            <p className={cx('time')}>{moment(notif.created_at).format('DD-MM-YYYY HH:mm:ss')}</p>
          </div>
        </div>
      ))}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Notification;
