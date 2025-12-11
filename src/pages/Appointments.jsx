import React, { useState, useEffect } from 'react';
import {
    CalendarIcon,
    ClockIcon,
    UserIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/admin/appointments');
            if (res.data.success) {
                setAppointments(res.data.appointments || []);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        try {
            await api.put(`/admin/appointments/${selectedAppointment.id}`, { status: newStatus });
            await fetchAppointments();
            setShowStatusModal(false);
            setSelectedAppointment(null);
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this appointment?')) return;

        try {
            await api.delete(`/admin/appointments/${id}`);
            setAppointments(appointments.filter(a => a.id !== id));
        } catch (error) {
            console.error('Error deleting appointment:', error);
            alert('Failed to delete appointment');
        }
    };

    const openStatusModal = (appointment) => {
        setSelectedAppointment(appointment);
        setNewStatus(appointment.status);
        setShowStatusModal(true);
    };

    const upcomingToday = appointments.filter(a => {
        const appointmentDate = new Date(a.date);
        const today = new Date();
        return appointmentDate.toDateString() === today.toDateString();
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Completed': return 'bg-blue-100 text-blue-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Appointments</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage client meetings and consultations</p>
                </div>
            </div>

            {/* Today's Appointments */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                <h3 className="text-lg font-bold mb-4">Today's Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-indigo-100 text-sm mb-1">Total Today</p>
                        <p className="text-3xl font-bold">{upcomingToday.length}</p>
                    </div>
                    <div>
                        <p className="text-indigo-100 text-sm mb-1">Total Appointments</p>
                        <p className="text-3xl font-bold">{appointments.length}</p>
                    </div>
                    <div>
                        <p className="text-indigo-100 text-sm mb-1">Pending</p>
                        <p className="text-3xl font-bold">{appointments.filter(a => a.status === 'Pending').length}</p>
                    </div>
                </div>
            </div>

            {/* Appointments List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 transition-colors">
                {appointments.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                        No appointments yet
                    </div>
                ) : (
                    appointments.map((appointment) => (
                        <div key={appointment.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-bold text-gray-900 dark:text-white">{appointment.name}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(appointment.status)} dark:bg-opacity-20`}>
                                            {appointment.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{appointment.email}</p>
                                    {appointment.phone && <p className="text-sm text-gray-500 dark:text-gray-400">{appointment.phone}</p>}
                                    {appointment.purpose && (
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                            <span className="font-medium text-gray-900 dark:text-white">Purpose:</span> {appointment.purpose}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300 mb-4">
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                                    <span>{new Date(appointment.date).toLocaleDateString()}</span>
                                </div>
                                {appointment.time && (
                                    <div className="flex items-center gap-2">
                                        <ClockIcon className="w-4 h-4 text-gray-400" />
                                        <span>{appointment.time}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => openStatusModal(appointment)}
                                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                                >
                                    Update Status
                                </button>
                                <button
                                    onClick={() => handleDelete(appointment.id)}
                                    className="px-3 py-1.5 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Status Update Modal */}
            {showStatusModal && selectedAppointment && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-all">
                    <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Update Appointment Status</h3>
                            <button onClick={() => setShowStatusModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Appointment with</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{selectedAppointment.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(selectedAppointment.date).toLocaleDateString()}</p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-colors"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Appointments;
