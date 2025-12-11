import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Quotes = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        try {
            const res = await api.get('/admin/quotes');
            setQuotes(res.data.quotes);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Quick Quotes</h2>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm">
                        <tr>
                            <th className="p-4 font-medium">Date</th>
                            <th className="p-4 font-medium">User</th>
                            <th className="p-4 font-medium">Project</th>
                            <th className="p-4 font-medium">Budget</th>
                            <th className="p-4 font-medium">Timeline</th>
                            <th className="p-4 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {quotes.map((quote) => (
                            <tr key={quote.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(quote.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <p className="font-medium text-sm text-gray-900 dark:text-white">{quote.userName || 'Anonymous'}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">{quote.userEmail}</p>
                                </td>
                                <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                                    <span className="capitalize">{quote.projectType}</span>
                                </td>
                                <td className="p-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                                    {quote.budget}
                                </td>
                                <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                                    {quote.timeline}
                                </td>
                                <td className="p-4">
                                    <span className={`text-xs px-2 py-1 rounded-full dark:bg-opacity-20 ${quote.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 dark:text-yellow-400' :
                                        quote.status === 'Processed' ? 'bg-green-100 text-green-700 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:text-gray-400'
                                        }`}>
                                        {quote.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {quotes.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-400 dark:text-gray-500">
                                    No quotes found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Quotes;
