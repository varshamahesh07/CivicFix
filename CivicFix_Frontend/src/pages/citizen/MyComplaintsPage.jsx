import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import CitizenLayout from '../../components/layout/CitizenLayout';
import EmptyState from '../../components/common/EmptyState';
import { StatusBadge, PriorityBadge, RiskScoreBadge, CategoryBadge } from '../../components/common/Badge';
import { CIVIC_CATEGORIES } from '../../data/mockComplaints';
import {
  Search, Filter, PlusCircle, RotateCcw, ArrowUpDown, MapPin, Calendar, Eye, ArrowRight
} from 'lucide-react';

export default function MyComplaintsPage() {
  const { currentUser } = useAuth();
  const { getCitizenComplaints } = useComplaints();

  const userComplaints = getCitizenComplaints(currentUser?.id);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'

  const filteredComplaints = useMemo(() => {
    return userComplaints.filter((item) => {
      if (selectedStatus !== 'All' && item.status !== selectedStatus) return false;
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = item.id.toLowerCase().includes(q);
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchLoc = (item.location || '').toLowerCase().includes(q);
        if (!matchId && !matchTitle && !matchLoc) return false;
      }
      return true;
    }).sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [userComplaints, selectedStatus, selectedCategory, searchQuery, sortOrder]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('All');
    setSelectedCategory('All');
    setSortOrder('newest');
  };

  const statusOptions = ['All', 'Registered', 'Ongoing', 'Waiting List', 'Resolved', 'Denied'];

  return (
    <CitizenLayout>
      <div className="py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-civic-teal-700">
              Citizen Registry
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-civic-navy-950 mt-1">
              My Reported Complaints
            </h1>
            <p className="text-xs sm:text-sm text-civic-charcoal-600 mt-0.5">
              Review current status, timeline updates, and resolution records for your issues.
            </p>
          </div>

          <Link
            to="/citizen/report"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-civic-teal-600 hover:bg-civic-teal-700 shadow-xs transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report New Issue</span>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-civic-navy-200/80 shadow-xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            
            {/* Search */}
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-civic-charcoal-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Complaint ID (e.g. CF-2026-0001) or Title..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50"
              />
            </div>

            {/* Category Filter */}
            <div className="lg:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs rounded-lg border border-civic-navy-200 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50 text-civic-navy-950"
              >
                <option value="All">All Categories</option>
                {CIVIC_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div className="lg:col-span-2">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full text-xs rounded-lg border border-civic-navy-200 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50 text-civic-navy-950"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
              </select>
            </div>

            {/* Reset */}
            <div className="lg:col-span-2 flex justify-end">
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-civic-charcoal-600 hover:text-civic-navy-900 hover:bg-civic-sand-100 border border-civic-navy-200 transition-colors w-full justify-center"
              >
                <RotateCcw className="w-3.5 h-3.5 text-civic-charcoal-400" />
                <span>Reset</span>
              </button>
            </div>

          </div>

          {/* Status Tabs (All 5 statuses) */}
          <div className="flex items-center gap-1 overflow-x-auto pt-2 border-t border-civic-navy-100 text-xs">
            {statusOptions.map((st) => {
              const isSelected = selectedStatus === st;
              const count = st === 'All'
                ? userComplaints.length
                : userComplaints.filter((c) => c.status === st).length;

              return (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-civic-navy-900 text-white font-semibold shadow-xs'
                      : 'text-civic-charcoal-600 hover:bg-civic-sand-100 hover:text-civic-navy-900'
                  }`}
                >
                  <span>{st}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? 'bg-civic-navy-800 text-civic-teal-300' : 'bg-civic-navy-100 text-civic-navy-800'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
            <span className="ml-auto text-[11px] text-civic-charcoal-500 font-mono hidden sm:inline">
              Showing {filteredComplaints.length} of {userComplaints.length} reports
            </span>
          </div>
        </div>

        {/* Complaints Presentation: Clean Table on Desktop, Cards on Mobile */}
        {filteredComplaints.length === 0 ? (
          <EmptyState
            icon="search"
            title="No matching complaints found"
            description="No reports match your current filter selection or search query."
            action={
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-civic-teal-700 bg-civic-teal-50 hover:bg-civic-teal-100 border border-civic-teal-200 transition-colors"
              >
                Clear all filters
              </button>
            }
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-2xl border border-civic-navy-200/90 shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-civic-sand-100 border-b border-civic-navy-200 text-civic-navy-950 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Complaint ID</th>
                    <th className="py-3 px-4">Title & Details</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Reported On</th>
                    <th className="py-3 px-4">Priority & Risk</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-civic-navy-100">
                  {filteredComplaints.map((item) => (
                    <tr key={item.id} className="hover:bg-civic-sand-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-civic-navy-950 whitespace-nowrap">
                        {item.id}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="font-semibold text-civic-navy-950 truncate">{item.title}</p>
                        <p className="text-[11px] text-civic-charcoal-500 line-clamp-1">{item.description}</p>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <CategoryBadge category={item.category} />
                      </td>
                      <td className="py-3.5 px-4 max-w-[150px] truncate text-civic-charcoal-600">
                        {item.location}
                      </td>
                      <td className="py-3.5 px-4 text-civic-charcoal-500 font-mono text-[11px] whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <PriorityBadge priority={item.priority} size="xs" />
                          <RiskScoreBadge score={item.riskScore} />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={item.status} size="xs" />
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Link
                          to={`/citizen/complaints/${item.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-civic-sand-100 hover:bg-civic-sand-200 text-civic-navy-900 font-bold text-[11px] transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-civic-teal-700" />
                          <span>View Details</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Compact Cards View */}
            <div className="md:hidden space-y-3">
              {filteredComplaints.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-civic-navy-200/90 p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-xs bg-civic-sand-100 px-2 py-0.5 rounded text-civic-navy-950">
                      {item.id}
                    </span>
                    <StatusBadge status={item.status} size="xs" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-civic-navy-950">{item.title}</h3>
                    <p className="text-xs text-civic-charcoal-600 line-clamp-2 mt-1">{item.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-civic-navy-100 text-civic-charcoal-500">
                    <span className="truncate">{item.location}</span>
                    <span className="font-mono text-[11px]">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="pt-2 border-t border-civic-navy-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <PriorityBadge priority={item.priority} size="xs" />
                      <RiskScoreBadge score={item.riskScore} />
                    </div>
                    <Link
                      to={`/citizen/complaints/${item.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-civic-teal-700 hover:text-civic-teal-900"
                    >
                      <span>Details &rarr;</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </CitizenLayout>
  );
}
