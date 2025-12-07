import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

const ClientAutocomplete = ({ onClientSelect }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        const searchUsers = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/admin/users/search?q=${encodeURIComponent(query)}`);
                setResults(res.data.users || []);
                setShowDropdown(true);
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(searchUsers, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (user) => {
        setQuery(user.name);
        setShowDropdown(false);
        if (onClientSelect) {
            onClientSelect(user);
        }
    };

    return (
        <div ref={wrapperRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name *
            </label>
            <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name or phone..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {loading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                    </div>
                )}
            </div>

            {showDropdown && results.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {results.map((user) => (
                        <button
                            key={user.id}
                            onClick={() => handleSelect(user)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                        >
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            {user.phone && (
                                <div className="text-xs text-gray-400">{user.phone}</div>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {showDropdown && results.length === 0 && !loading && query.length >= 2 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500 text-sm">
                    No clients found
                </div>
            )}
        </div>
    );
};

export default ClientAutocomplete;
