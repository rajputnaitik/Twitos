
import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import { useAppContext } from '../contexts/AppContext';
import { timeAgo } from '../lib/helpers';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '../types';

const NotificationIcon: React.FC<{ type: Notification['type'] }> = ({ type }) => {
    const iconColor = {
        like: 'text-red-500',
        comment: 'text-blue-500',
        follow: 'text-green-500',
        repost: 'text-purple-500',
    };
    const iconSvg = {
        like: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>,
        comment: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.08-3.239A8.962 8.962 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.832 12.928a6.953 6.953 0 001.168.324A8.001 8.001 0 0010 14c3.314 0 6-2.239 6-5s-2.686-5-6-5-6 2.239-6 5c0 .324.039.64.113.949l-1.08 3.238 2.8-1.259z" clipRule="evenodd" /></svg>,
        follow: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 11a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1z" /></svg>,
        repost: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M15 10a2 2 0 11-4 0 2 2 0 014 0z" /><path d="M4 10a2 2 0 11-4 0 2 2 0 014 0zM10 4a2 2 0 100-4 2 2 0 000 4z" /><path d="M10 15a2 2 0 100 4 2 2 0 000-4z" /><path d="M10 7a3 3 0 100 6 3 3 0 000-6z" /></svg>
    };
    return <div className={iconColor[type]}>{iconSvg[type]}</div>;
};

const NotificationsScreen: React.FC = () => {
    const { currentUser, notifications, markNotificationsAsRead, getUser } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        markNotificationsAsRead();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const userNotifications = notifications
        .filter(n => n.toUser === currentUser?.username)
        .sort((a, b) => b.timestamp - a.timestamp);

    const getNotificationMessage = (n: Notification) => {
        switch (n.type) {
            case 'like': return `liked your post.`;
            case 'comment': return `commented on your post.`;
            case 'follow': return `started following you.`;
            case 'repost': return `reposted your post.`;
            default: return '';
        }
    };

    return (
        <Layout title="Notifications">
            {userNotifications.length > 0 ? (
                userNotifications.map(n => {
                    const fromUser = getUser(n.fromUser);
                    return (
                        <div key={n.id} className={`flex items-start space-x-4 p-4 border-b dark:border-gray-800 ${n.read ? 'opacity-70' : 'bg-blue-50 dark:bg-[#1DA1F2]/10'}`}>
                            <div className="mt-1">
                                <NotificationIcon type={n.type} />
                            </div>
                            <div className="flex-1">
                                <img src={fromUser?.photo} alt={fromUser?.username} className="w-8 h-8 rounded-full mb-2" />
                                <p>
                                    <span className="font-bold cursor-pointer" onClick={() => navigate(`/profile/${n.fromUser}`)}>{n.fromUser}</span>
                                    {' '}
                                    {getNotificationMessage(n)}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">{timeAgo(n.timestamp)}</p>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="text-center p-8 text-gray-500">
                    <p>No notifications yet.</p>
                </div>
            )}
        </Layout>
    );
};

export default NotificationsScreen;
