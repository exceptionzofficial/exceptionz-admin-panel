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

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Quick Quotes</h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm">
                        <tr>
                            <th className="p-4 font-medium">Date</th>
                            <th className="p-4 font-medium">User</th>
                            <th className="p-4 font-medium">Project</th>
                            <th className="p-4 font-medium">Budget</th>
                            <th className="p-4 font-medium">Timeline</th>
                            <th className="p-4 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {quotes.map((quote) => (
                            <tr key={quote.id} className="hover:bg-gray-50">
                                <td className="p-4 text-sm text-gray-500">
                                    {new Date(quote.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <p className="font-medium text-sm">{quote.userName || 'Anonymous'}</p>
                                    <p className="text-xs text-gray-400">{quote.userEmail}</p>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    <span className="capitalize">{quote.projectType}</span>
                                </td>
                                <td className="p-4 text-sm text-gray-600 font-medium">
                                    {quote.budget}
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    {quote.timeline}
                                </td>
                                <td className="p-4">
                                    <span className={`text-xs px-2 py-1 rounded-full ${quote.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                            quote.status === 'Processed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {quote.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {quotes.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-400">
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
