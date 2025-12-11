import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    HomeIcon,
    FolderIcon,
    DocumentTextIcon,
    UsersIcon,
    TicketIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    BriefcaseIcon,
    BellIcon,
    ArrowLeftOnRectangleIcon,
    MagnifyingGlassIcon,
    Bars3Icon,
    XMarkIcon,
    Cog6ToothIcon,
    ClipboardDocumentListIcon,
    SunIcon,
    MoonIcon,
} from '@heroicons/react/24/outline';

const Layout = () => {
    const { logout, user } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/', icon: HomeIcon },
        { name: 'Projects', href: '/projects', icon: FolderIcon },
        { name: 'Invoices', href: '/invoices', icon: DocumentTextIcon },
        { name: 'Users', href: '/users', icon: UsersIcon },
        { name: 'Support Tickets', href: '/tickets', icon: TicketIcon },
        { name: 'Appointments', href: '/appointments', icon: CalendarIcon },
        { name: 'Quote Requests', href: '/quote-requests', icon: ClipboardDocumentListIcon },
        { name: 'Quote Pricing', href: '/quote-pricing', icon: Cog6ToothIcon },
        { name: 'Career', href: '/career', icon: BriefcaseIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-200">
            {/* Sidebar for Desktop */}
            <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
                <div className="flex flex-col flex-grow bg-gradient-to-b from-indigo-900 to-indigo-800 overflow-y-auto">
                    <div className="flex items-center flex-shrink-0 px-6 py-6">
                        <h1 className="text-2xl font-bold text-white">Exceptionz</h1>
                    </div>

                    <nav className="flex-1 px-3 pb-4 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${location.pathname === item.href
                                    ? 'bg-indigo-700 text-white shadow-lg'
                                    : 'text-indigo-100 hover:bg-indigo-700/50 hover:text-white'
                                    }`}
                            >
                                <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${location.pathname === item.href ? 'text-white' : 'text-indigo-300'
                                    }`} />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex-shrink-0 flex border-t border-indigo-700 p-4">
                        <div className="flex items-center w-full">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                                    <span className="text-lg font-bold text-white">{user?.name?.[0] || 'A'}</span>
                                </div>
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-white">{user?.name || 'Admin'}</p>
                                <button
                                    onClick={logout}
                                    className="text-xs text-indigo-300 hover:text-white flex items-center mt-1 transition-colors"
                                >
                                    <ArrowLeftOnRectangleIcon className="w-3 h-3 mr-1" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile sidebar */}
            <div className={`lg:hidden fixed inset-0 z-40 ${sidebarOpen ? '' : 'pointer-events-none'}`}>
                <div className={`fixed inset-0 bg-gray-600 transition-opacity ${sidebarOpen ? 'opacity-75' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)} />
                <div className={`fixed inset-y-0 left-0 flex flex-col w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex items-center justify-between px-6 py-6">
                        <h1 className="text-2xl font-bold text-white">Exceptionz</h1>
                        <button onClick={() => setSidebarOpen(false)} className="text-white">
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                    <nav className="flex-1 px-3 pb-4 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg ${location.pathname === item.href
                                    ? 'bg-indigo-700 text-white'
                                    : 'text-indigo-100 hover:bg-indigo-700/50 hover:text-white'
                                    }`}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:pl-64 flex flex-col flex-1">
                {/* Top bar with Toggle */}
                <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200 justify-end px-6 items-center">
                    <button
                        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none lg:hidden mr-auto"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>

                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        aria-label="Toggle Theme"
                    >
                        {isDarkMode ? (
                            <SunIcon className="w-6 h-6 text-yellow-500" />
                        ) : (
                            <MoonIcon className="w-6 h-6 text-indigo-500" />
                        )}
                    </button>
                </div>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="py-6 px-4 sm:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
