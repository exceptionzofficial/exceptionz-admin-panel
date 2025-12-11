import React from 'react';
import {
    BellIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    InformationCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const Notifications = () => {
    const notifications = [
        { id: 1, type: 'success', title: 'Payment Received', message: 'Invoice #INV-001 from TechCorp has been paid', time: '5 minutes ago', read: false },
        { id: 2, type: 'warning', title: 'Project Deadline', message: 'E-Commerce Platform deadline is in 3 days', time: '1 hour ago', read: false },
        { id: 3, type: 'info', title: 'New Quote Request', message: 'Alex Turner submitted a quote for Web Development', time: '2 hours ago', read: false },
        { id: 4, type: 'alert', title: 'Support Ticket', message: 'High priority ticket #TKT-002 needs attention', time: '3 hours ago', read: true },
        { id: 5, type: 'success', title: 'Project Completed', message: 'Cloud Migration project marked as complete', time: '5 hours ago', read: true },
        { id: 6, type: 'info', title: 'New User Registration', message: 'Lisa Anderson created an account', time: '1 day ago', read: true },
        { id: 7, type: 'warning', title: 'Invoice Overdue', message: 'Invoice #INV-003 is 5 days overdue', time: '1 day ago', read: true },
        { id: 8, type: 'info', title: 'Appointment Scheduled', message: 'Meeting with Emma Wilson on Dec 11 @ 3:30 PM', time: '2 days ago', read: true },
    ];

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircleIcon className="w-6 h-6 text-green-500 dark:text-green-400" />;
            case 'warning': return <ExclamationCircleIcon className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />;
            case 'alert': return <ExclamationCircleIcon className="w-6 h-6 text-red-500 dark:text-red-400" />;
            case 'info': return <InformationCircleIcon className="w-6 h-6 text-blue-500 dark:text-blue-400" />;
            default: return <BellIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />;
        }
    };

    const getNotificationBg = (type) => {
        switch (type) {
            case 'success': return 'bg-green-50 dark:bg-green-900/20';
            case 'warning': return 'bg-yellow-50 dark:bg-yellow-900/20';
            case 'alert': return 'bg-red-50 dark:bg-red-900/20';
            case 'info': return 'bg-blue-50 dark:bg-blue-900/20';
            default: return 'bg-gray-50 dark:bg-gray-700/50';
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{unreadCount} unread notifications</p>
                </div>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Mark All as Read
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{notifications.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Unread</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{unreadCount}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Alerts</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{notifications.filter(n => n.type === 'alert').length}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Today</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{notifications.filter(n => n.time.includes('hour') || n.time.includes('minute')).length}</p>
                </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 transition-colors">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${!notification.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-lg ${getNotificationBg(notification.type)} transition-colors`}>
                                {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-1">
                                    <h3 className={`font-semibold ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {notification.title}
                                        {!notification.read && (
                                            <span className="ml-2 inline-block w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                                        )}
                                    </h3>
                                    <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors">
                                        <XMarkIcon className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{notification.message}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400 dark:text-gray-500">{notification.time}</span>
                                    {!notification.read && (
                                        <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                                            Mark as read
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
