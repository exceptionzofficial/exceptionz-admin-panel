import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
    XMarkIcon
} from '@heroicons/react/24/outline';

const Layout = () => {
    const { logout, user } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/', icon: HomeIcon },
        { name: 'Projects', href: '/projects', icon: FolderIcon },
        { name: 'Invoices', href: '/invoices', icon: DocumentTextIcon },
        { name: 'Users', href: '/users', icon: UsersIcon },
        { name: 'Support Tickets', href: '/tickets', icon: TicketIcon },
        { name: 'Appointments', href: '/appointments', icon: CalendarIcon },
        { name: 'Quick Quotes', href: '/quotes', icon: CurrencyDollarIcon },
        { name: 'Career', href: '/career', icon: BriefcaseIcon },
        { name: 'Notifications', href: '/notifications', icon: BellIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
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
                {/* Top bar */}
                <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow-sm">
                    <button
                        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                    <div className="flex-1 px-4 flex justify-between items-center">
                        <div className="flex-1 flex">
                            <div className="w-full flex md:ml-0">
                                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
                                        <MagnifyingGlassIcon className="h-5 w-5" />
                                    </div>
                                    <input
                                        className="block w-full h-full pl-10 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                                        placeholder="Search..."
                                        type="search"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="ml-4 flex items-center md:ml-6">
                            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 relative">
                                <BellIcon className="h-6 w-6" />
                                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                            </button>
                        </div>
                    </div>
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
