import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import AuthorityLayout from '../../components/layout/AuthorityLayout';
import { StatusBadge, PriorityBadge, RiskScoreBadge, CategoryBadge } from '../../components/common/Badge';
import StatusUpdateModal from '../../components/complaints/StatusUpdateModal';
import EmptyState from '../../components/common/EmptyState';
import { CIVIC_CATEGORIES } from '../../data/mockComplaints';
import {
  Search, Filter, RotateCcw, Eye, Edit3, ArrowUpDown, MapPin, Building2, Calendar
} from 'lucide-react';

export default function AllComplaintsPage() {
  const { complaints } = useComplaints();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [locationQuery, setLocationQuery] = useState('');
  const [riskRange, setRiskRange] = useState('All');
  const [sortField, setSortField] = useState('createdAt');
  const [sortAsc, setSortAsc] = useState(false);

  // Status Modal State
  const [modalComplaint, setModalComplaint] = useState(null);

  // Dynamic Filtering Logic
  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      // 1. Search Query (ID or Title)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = item.id.toLowerCase().includes(q);
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchCit = (item.citizenName || '').toLowerCase().includes(q);
        if (!matchId && !matchTitle && !matchCit) return false;
      }

      // 2. Category
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // 3. Priority
      if (selectedPriority !== 'All' && item.priority !== selectedPriority) {
        return false;
      }

      // 4. Status (using 5 platform statuses)
      if (selectedStatus !== 'All' && item.status !== selectedStatus) {
        return false;
      }

      // 5. Location query
      if (locationQuery.trim()) {
        const loc = locationQuery.toLowerCase().trim();
        if (!item.location || !item.location.toLowerCase().includes(loc)) {
          return false;
        }
      }

      // 6. Risk score range
      if (riskRange !== 'All') {
        const score = item.riskScore || 0;
        if (riskRange === 'Critical' && score < 85) return false;
        if (riskRange === 'High' && (score < 68 || score >= 85)) return false;
        if (riskRange === 'Medium' && (score < 45 || score >= 68)) return false;
        if (riskRange === 'Low' && score >= 45) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortField === 'riskScore') {
        return sortAsc ? (a.riskScore || 0) - (b.riskScore || 0) : (b.riskScore || 0) - (a.riskScore || 0);
      }
      if (sortField === 'id') {
        return sortAsc ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
      }
      // default: createdAt
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortAsc ? dateA - dateB : dateB - dateA;
    });
  }, [
    complaints, searchQuery, selectedCategory, selectedPriority,
    selectedStatus, locationQuery, riskRange, sortField, sortAsc
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPriority('All');
    setSelectedStatus('All');
    setLocationQuery('');
    setRiskRange('All');
  };

  return (
    <AuthorityLayout>
      <div className="py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-civic-teal-700">
              Operations Control
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-civic-navy-950 mt-1">
              All Municipal Complaints Registry
            </h1>
            <p className="text-xs sm:text-sm text-civic-charcoal-600 mt-0.5">
              Comprehensive triage queue across all 5 platform statuses. Filter by safety risk and dispatch work crews.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white border border-civic-navy-200 font-semibold text-civic-navy-900 shadow-xs">
              Showing {filteredComplaints.length} of {complaints.length} Records
            </span>
          </div>
        </div>

        {/* Multi-Facet Filter Toolbar */}
        <div className="bg-white p-5 rounded-2xl border border-civic-navy-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-civic-navy-100 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-civic-navy-900 uppercase tracking-wider">
              <Filter className="w-4 h-4 text-civic-teal-700" />
              <span>Multi-Facet Search & Operational Filters</span>
            </div>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-civic-charcoal-500 hover:text-rose-600 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            
            {/* Search ID or Title */}
            <div className="lg:col-span-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-civic-charcoal-400">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ID (e.g. CF-2026-0001) or Title..."
                className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50"
              />
            </div>

            {/* Category */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs rounded-lg border border-civic-navy-200 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50"
              >
                <option value="All">All Categories</option>
                {CIVIC_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full text-xs rounded-lg border border-civic-navy-200 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50"
              >
                <option value="All">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Status (All 5 platform statuses) */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full text-xs rounded-lg border border-civic-navy-200 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50"
              >
                <option value="All">All Statuses</option>
                <option value="Registered">Registered</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Waiting List">Waiting List</option>
                <option value="Resolved">Resolved</option>
                <option value="Denied">Denied</option>
              </select>
            </div>

            {/* Risk Score Range */}
            <div>
              <select
                value={riskRange}
                onChange={(e) => setRiskRange(e.target.value)}
                className="w-full text-xs rounded-lg border border-civic-navy-200 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50"
              >
                <option value="All">All Risk Scores</option>
                <option value="Critical">Risk 85–100 (Critical)</option>
                <option value="High">Risk 68–84 (High)</option>
                <option value="Medium">Risk 45–67 (Medium)</option>
                <option value="Low">Risk &lt; 45 (Low)</option>
              </select>
            </div>

          </div>

          {/* Location & Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 text-xs">
            <div className="relative sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-civic-charcoal-400">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Filter by ward or street location..."
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-civic-charcoal-500 font-mono text-[11px]">Sort By:</span>
              <button
                type="button"
                onClick={() => {
                  if (sortField === 'riskScore') setSortAsc(!sortAsc);
                  else { setSortField('riskScore'); setSortAsc(false); }
                }}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 border ${
                  sortField === 'riskScore'
                    ? 'bg-civic-navy-900 text-white border-civic-navy-900'
                    : 'bg-white text-civic-charcoal-600 border-civic-navy-200 hover:bg-civic-sand-50'
                }`}
              >
                <span>Risk Score</span>
                <ArrowUpDown className="w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (sortField === 'createdAt') setSortAsc(!sortAsc);
                  else { setSortField('createdAt'); setSortAsc(false); }
                }}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 border ${
                  sortField === 'createdAt'
                    ? 'bg-civic-navy-900 text-white border-civic-navy-900'
                    : 'bg-white text-civic-charcoal-600 border-civic-navy-200 hover:bg-civic-sand-50'
                }`}
              >
                <span>Date</span>
                <ArrowUpDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        {filteredComplaints.length === 0 ? (
          <EmptyState
            icon="search"
            title="No complaints match current filters"
            description="Try loosening your search query, priority selector, or risk score threshold."
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
          <div className="bg-white rounded-2xl border border-civic-navy-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-civic-sand-100 border-b border-civic-navy-200/80 text-civic-navy-950 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Complaint ID</th>
                    <th className="py-3.5 px-4">Title & Details</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Citizen Reporter</th>
                    <th className="py-3.5 px-4">Priority & Risk</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-civic-navy-100">
                  {filteredComplaints.map((item) => {
                    const formattedDate = new Date(item.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    });

                    return (
                      <tr key={item.id} className="hover:bg-civic-sand-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-civic-navy-950 whitespace-nowrap">
                          {item.id}
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="font-semibold text-civic-navy-950 truncate">{item.title}</p>
                          <div className="flex items-center gap-2 text-[11px] text-civic-charcoal-400 mt-0.5">
                            <span className="flex items-center gap-1 font-mono">
                              <Calendar className="w-3 h-3" />
                              {formattedDate}
                            </span>
                            <span>•</span>
                            <span className="truncate">{item.issueDurationDays}d duration</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <CategoryBadge category={item.category} />
                        </td>

                        <td className="py-3.5 px-4 text-civic-charcoal-600 max-w-[150px] truncate">
                          {item.location}
                        </td>

                        <td className="py-3.5 px-4 text-civic-navy-900 font-medium whitespace-nowrap">
                          {item.citizenName}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <PriorityBadge priority={item.priority} size="xs" />
                            <RiskScoreBadge score={item.riskScore} />
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-[11px] text-civic-charcoal-700 max-w-[150px] truncate">
                          {item.suggestedDepartment}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <StatusBadge status={item.status} size="xs" />
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setModalComplaint(item)}
                              className="px-2.5 py-1 rounded bg-civic-navy-100 hover:bg-civic-navy-200 text-civic-navy-900 font-bold text-[11px] transition-colors"
                            >
                              Update Status
                            </button>
                            <Link
                              to={`/authority/complaints/${item.id}`}
                              className="p-1.5 rounded text-civic-charcoal-500 hover:text-civic-teal-700 hover:bg-civic-sand-100 transition-colors"
                              title="Inspect Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Modal for Status Changes */}
      {modalComplaint && (
        <StatusUpdateModal
          isOpen={!!modalComplaint}
          complaint={modalComplaint}
          onClose={() => setModalComplaint(null)}
        />
      )}
    </AuthorityLayout>
  );
}
