import React from 'react';
import {
    UsersIcon,
    CurrencyDollarIcon,
    DocumentCheckIcon,
    ChartBarIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import {
    BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
    // Mock Data
    const stats = [
        { name: 'Total Revenue', value: '$248,350', change: '+12.5%', trending: 'up', icon: CurrencyDollarIcon, color: 'bg-green-500' },
        { name: 'Active Clients', value: '145', change: '+8.2%', trending: 'up', icon: UsersIcon, color: 'bg-blue-500' },
        { name: 'Active Projects', value: '32', change: '-2.4%', trending: 'down', icon: DocumentCheckIcon, color: 'bg-purple-500' },
        { name: 'Pending Invoices', value: '18', change: '+5.1%', trending: 'up', icon: ClockIcon, color: 'bg-orange-500' },
    ];

    const revenueData = [
        { month: 'Jan', revenue: 35000, expenses: 28000, profit: 7000 },
        { month: 'Feb', revenue: 42000, expenses: 32000, profit: 10000 },
        { month: 'Mar', revenue: 38000, expenses: 29000, profit: 9000 },
        { month: 'Apr', revenue: 51000, expenses: 35000, profit: 16000 },
        { month: 'May', revenue: 49000, expenses: 33000, profit: 16000 },
        { month: 'Jun', revenue: 58000, expenses: 38000, profit: 20000 },
        { month: 'Jul', revenue: 62000, expenses: 41000, profit: 21000 },
    ];

    const projectStatusData = [
        { name: 'Completed', value: 45, color: '#10b981' },
        { name: 'In Progress', value: 32, color: '#f59e0b' },
        { name: 'On Hold', value: 8, color: '#ef4444' },
        { name: 'Planning', value: 15, color: '#8b5cf6' },
    ];

    const clientGrowthData = [
        { month: 'Jan', clients: 98 },
        { month: 'Feb', clients: 105 },
        { month: 'Mar', clients: 112 },
        { month: 'Apr', clients: 125 },
        { month: 'May', clients: 135 },
        { month: 'Jun', clients: 140 },
        { month: 'Jul', clients: 145 },
    ];

    const recentActivity = [
        { id: 1, user: 'John Doe', action: 'Created new project', project: 'Website Redesign', time: '2 hours ago', avatar: 'JD' },
        { id: 2, user: 'Sarah Smith', action: 'Uploaded invoice', project: 'Mobile App', time: '4 hours ago', avatar: 'SS' },
        { id: 3, user: 'Mike Johnson', action: 'Submitted quote request', project: 'E-Commerce Platform', time: '5 hours ago', avatar: 'MJ' },
        { id: 4, user: 'Emma Wilson', action: 'Booked appointment', project: 'Consultation', time: '6 hours ago', avatar: 'EW' },
        { id: 5, user: 'David Brown', action: 'Raised support ticket', project: 'Bug Fix', time: '8 hours ago', avatar: 'DB' },
    ];

    const topProjects = [
        { name: 'E-Commerce Platform', progress: 85, budget: '$45,000', status: 'On Track' },
        { name: 'Mobile Banking App', progress: 65, budget: '$78,000', status: 'On Track' },
        { name: 'CRM System', progress: 40, budget: '$52,000', status: 'At Risk' },
        { name: 'AI Dashboard', progress: 92, budget: '$35,000', status: 'Ahead' },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <select className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-colors">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 90 days</option>
                    </select>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                        Download Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                                <div className="flex items-center mt-2">
                                    {stat.trending === 'up' ? (
                                        <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                                    ) : (
                                        <ArrowTrendingDownIcon className="w-4 h-4 text-red-500 mr-1" />
                                    )}
                                    <span className={`text-sm font-medium ${stat.trending === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {stat.change}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
                                </div>
                            </div>
                            <div className={`p-3 rounded-full ${stat.color} bg-opacity-90`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue & Expenses</h3>
                        <ChartBarIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                            <XAxis dataKey="month" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                                itemStyle={{ color: '#f3f4f6' }}
                            />
                            <Legend />
                            <Bar dataKey="revenue" fill="#4f46e5" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="expenses" fill="#10b981" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Project Status Pie */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Project Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={projectStatusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {projectStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                        {projectStatusData.map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                                    <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-white">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Client Growth */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Client Growth</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={clientGrowthData}>
                            <defs>
                                <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                            <XAxis dataKey="month" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                            />
                            <Area type="monotone" dataKey="clients" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorClients)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Projects */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Top Projects</h3>
                    <div className="space-y-4">
                        {topProjects.map((project, index) => (
                            <div key={index} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900 dark:text-white text-sm">{project.name}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${project.status === 'On Track' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                                        project.status === 'At Risk' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                                            'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                                        }`}>
                                        {project.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                                    <span>{project.budget}</span>
                                    <span>{project.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all"
                                        style={{ width: `${project.progress}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {recentActivity.map((activity) => (
                        <div key={activity.id} className="p-6 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-semibold">
                                {activity.avatar}
                            </div>
                            <div className="ml-4 flex-1">
                                <p className="text-sm text-gray-900 dark:text-white">
                                    <span className="font-semibold">{activity.user}</span> {activity.action}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{activity.project}</p>
                            </div>
                            <span className="text-xs text-gray-400 dark:text-gray-500">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
