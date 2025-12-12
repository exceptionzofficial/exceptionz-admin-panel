import React, { useState, useEffect } from 'react';
import {
    EyeIcon,
    CheckIcon,
    XMarkIcon,
    ArrowDownTrayIcon,
    PencilSquareIcon,
    TrashIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import JobModal from '../components/JobModal';
import api from '../services/api';

const Career = () => {
    const [activeTab, setActiveTab] = useState('applications');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        await Promise.all([fetchJobs(), fetchApplications()]);
        setLoading(false);
    };

    const fetchJobs = async () => {
        try {
            const response = await api.get('/career/admin/jobs');
            if (response.data.success) {
                setJobs(response.data.jobs);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const fetchApplications = async () => {
        try {
            const response = await api.get('/career/admin/applications');
            if (response.data.success) {
                setApplications(response.data.applications);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Under Review': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            case 'Interview': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'Shortlisted': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'Rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';

            // Job Statuses
            case 'Active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'Draft': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
            case 'Closed': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';

            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const handleCreateJob = () => {
        setEditingJob(null);
        setIsModalOpen(true);
    };

    const handleEditJob = (job) => {
        setEditingJob(job);
        setIsModalOpen(true);
    };

    const handleDeleteJob = async (id) => {
        if (window.confirm('Are you sure you want to delete this job posting?')) {
            try {
                await api.delete(`/career/admin/jobs/${id}`);
                setJobs(jobs.filter(job => job.id !== id));
            } catch (error) {
                console.error('Error deleting job:', error);
                alert('Failed to delete job');
            }
        }
    };

    const handleSaveJob = async (jobData) => {
        try {
            if (editingJob) {
                const response = await api.put(`/career/admin/jobs/${editingJob.id}`, jobData);
                if (response.data.success) {
                    setJobs(jobs.map(job => job.id === editingJob.id ? response.data.job : job));
                }
            } else {
                const response = await api.post('/career/admin/jobs', jobData);
                if (response.data.success) {
                    setJobs([...jobs, response.data.job]);
                }
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving job:', error);
            alert('Failed to save job');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    // ... existing renders .. but updating to use API data fields ...
    const renderApplications = () => (
        <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Applications</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{applications.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">New</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{applications.filter(a => a.status === 'New').length}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">In Interview</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{applications.filter(a => a.status === 'Interview').length}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Open Positions</p>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{jobs.filter(j => j.status === 'Active').length}</p>
                </div>
            </div>

            {/* Applications List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Candidate</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Position</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Experience</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Applied</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {applications.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No applications found
                                    </td>
                                </tr>
                            ) : applications.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-semibold transition-colors">
                                                {app.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{app.name}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{app.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 dark:text-white">{app.position}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">{app.experience}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">{formatDate(app.appliedAt)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-2">
                                            {/* Action buttons placeholder - implement functionality as needed */}
                                            <button className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
                                                <EyeIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );

    const renderJobs = () => (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 dark:text-white">Active Job Openings</h3>
                <button
                    onClick={handleCreateJob}
                    className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                    <PlusIcon className="w-4 h-4 mr-2" /> Create Job
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Applications</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {jobs.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                    No jobs found
                                </td>
                            </tr>
                        ) : jobs.map((job) => (
                            <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{job.title}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Posted {formatDate(job.postedAt)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">{job.department}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">{job.location}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">{job.type}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{job.applicationsCount || 0}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                                        {job.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditJob(job)}
                                            className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                        >
                                            <PencilSquareIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteJob(job.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    if (loading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Career Management</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage job postings and review applications</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`
                            whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
                            ${activeTab === 'applications'
                                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'}
                        `}
                    >
                        Applications
                    </button>
                    <button
                        onClick={() => setActiveTab('jobs')}
                        className={`
                            whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
                            ${activeTab === 'jobs'
                                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'}
                        `}
                    >
                        Job Openings
                    </button>
                </nav>
            </div>

            {/* Content */}
            {activeTab === 'applications' ? renderApplications() : renderJobs()}

            {/* Modal */}
            <JobModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveJob}
                job={editingJob}
            />
        </div>
    );
};

export default Career;
