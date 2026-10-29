import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';
import AuthorityLayout from '../../components/layout/AuthorityLayout';
import { StatusBadge, PriorityBadge, RiskScoreBadge, CategoryBadge } from '../../components/common/Badge';
import StatusUpdateModal from '../../components/complaints/StatusUpdateModal';
import EmptyState from '../../components/common/EmptyState';
import { CIVIC_CATEGORIES } from '../../data/mockComplaints';
import {
  ShieldAlert, Clock, Wrench, CheckCircle2, XCircle, Hourglass, ArrowRight,
  TrendingUp, Users, Building2, Flame, MapPin, Eye, Edit3, Filter, Search, RotateCcw
} from 'lucide-react';

export default function AuthorityDashboardPage() {
  const { currentUser } = useAuth();
  const { complaints, priorityQueue, authorityStats } = useComplaints();

  const [activeModalComplaint, setActiveModalComplaint] = useState(null);

  // Table filtering state on Dashboard
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [riskRange, setRiskRange] = useState('All');

  // Filtered complaints for dashboard table
  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      if (selectedStatus !== 'All' && item.status !== selectedStatus) return false;
      if (selectedPriority !== 'All' && item.priority !== selectedPriority) return false;
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;

      if (riskRange !== 'All') {
        const score = item.riskScore || 0;
        if (riskRange === 'Critical' && score < 85) return false;
        if (riskRange === 'High' && (score < 68 || score >= 85)) return false;
        if (riskRange === 'Medium' && (score < 45 || score >= 68)) return false;
        if (riskRange === 'Low' && score >= 45) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = item.id.toLowerCase().includes(q);
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchLoc = (item.location || '').toLowerCase().includes(q);
        const matchCit = (item.citizenName || '').toLowerCase().includes(q);
        if (!matchId && !matchTitle && !matchLoc && !matchCit) return false;
      }

      return true;
    });
  }, [complaints, selectedStatus, selectedPriority, selectedCategory, riskRange, searchQuery]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('All');
    setSelectedPriority('All');
    setSelectedCategory('All');
    setRiskRange('All');
  };

  return (
    <AuthorityLayout>
      <div className="py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Workspace Command Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-civic-navy-950 text-white p-6 rounded-2xl border border-civic-navy-800 shadow-md">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-civic-teal-900/80 text-civic-teal-300 border border-civic-teal-700">
                Civic Operations Command Desk
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-xs text-slate-300 font-mono">
                {currentUser?.department || 'Central Operations'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
              Operations Triage & Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Officer in charge: <strong className="text-civic-teal-300">{currentUser?.name || 'Commissioner Priya Nair'}</strong> ({currentUser?.designation || 'Senior Operations Lead'}).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/authority/complaints"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-civic-navy-950 bg-civic-teal-400 hover:bg-civic-teal-300 transition-colors shadow-xs"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>All Complaints Registry</span>
            </Link>
          </div>
        </div>

        {/* Dynamic 5-Status Operational Metrics (Calculated from actual complaints) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-xl border border-civic-navy-200/90 shadow-xs">
            <span className="text-[11px] font-bold text-civic-charcoal-500 uppercase tracking-wider block">
              Total Complaints
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-civic-navy-950 mt-1">
              {authorityStats.total}
            </p>
            <span className="text-[10px] text-civic-charcoal-400 mt-1 block">Active dataset</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-600" /> Registered
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-800 mt-1">
              {authorityStats.registered}
            </p>
            <span className="text-[10px] text-slate-500 mt-1 block">Awaiting triage</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
              <Wrench className="w-3 h-3 text-blue-600" /> Ongoing
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-700 mt-1">
              {authorityStats.ongoing}
            </p>
            <span className="text-[10px] text-blue-600 mt-1 block">Crews deployed</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
              <Hourglass className="w-3 h-3 text-amber-700" /> Waiting List
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-700 mt-1">
              {authorityStats.waitingList}
            </p>
            <span className="text-[10px] text-amber-600 mt-1 block">Equipment queued</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Resolved
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-700 mt-1">
              {authorityStats.resolved}
            </p>
            <span className="text-[10px] text-emerald-600 mt-1 block">Ground verified</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
              <XCircle className="w-3 h-3 text-rose-600" /> Denied
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-700 mt-1">
              {authorityStats.denied}
            </p>
            <span className="text-[10px] text-rose-600 mt-1 block">Outside purview</span>
          </div>
        </div>

        {/* SECTION 1: PROMINENT PRIORITY QUEUE */}
        <section id="priority-queue" className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-600" />
                <h2 className="text-lg font-bold text-civic-navy-950">
                  Operational Priority Queue
                </h2>
              </div>
              <p className="text-xs text-civic-charcoal-500 mt-0.5">
                Automatically sorted: <strong>Critical → High → Medium → Low</strong>, prioritized by assessed risk score & report timestamp.
              </p>
            </div>
            <span className="text-xs font-mono text-civic-charcoal-500 bg-civic-sand-100 px-3 py-1 rounded-lg border border-civic-navy-200 self-start sm:self-auto">
              Queue Length: {priorityQueue.filter((c) => c.status !== 'Resolved' && c.status !== 'Denied').length} Active Issues
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {priorityQueue
              .filter((c) => c.status !== 'Resolved' && c.status !== 'Denied')
              .slice(0, 6)
              .map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl p-5 shadow-xs border transition-all flex flex-col justify-between ${
                    item.priority === 'Critical'
                      ? 'border-l-4 border-l-rose-600 border-civic-navy-200/90'
                      : item.priority === 'High'
                      ? 'border-l-4 border-l-orange-500 border-civic-navy-200/90'
                      : 'border-civic-navy-200/80'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-xs bg-civic-sand-100 text-civic-navy-950 px-2 py-0.5 rounded border border-civic-navy-200">
                        {item.id}
                      </span>
                      <PriorityBadge priority={item.priority} size="xs" />
                    </div>

                    <h3 className="text-sm font-bold text-civic-navy-950 line-clamp-1">
                      {item.title}
                    </h3>

                    <p className="text-xs text-civic-charcoal-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-civic-navy-100 text-civic-charcoal-500">
                      <span className="truncate flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-civic-teal-700 flex-shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </span>
                      <RiskScoreBadge score={item.riskScore} />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-civic-navy-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setActiveModalComplaint(item)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-civic-teal-700 hover:text-civic-teal-900"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Update Status</span>
                    </button>
                    <Link
                      to={`/authority/complaints/${item.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-civic-navy-900 hover:text-civic-teal-700"
                    >
                      <span>Analysis Details &rarr;</span>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* SECTION 2: COMPLAINT MANAGEMENT TABLE WITH SEARCH & FILTERS */}
        <section className="bg-white rounded-2xl border border-civic-navy-200/90 shadow-xs overflow-hidden space-y-4">
          <div className="p-6 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-civic-navy-950">
                Incoming Complaints Management Table
              </h2>
              <p className="text-xs text-civic-charcoal-500">
                Inspect, filter by risk score or ward, and transition complaint statuses in real time.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-civic-sand-100 text-civic-navy-900">
              Showing {filteredComplaints.length} of {complaints.length} Records
            </span>
          </div>

          {/* Filtering toolbar */}
          <div className="px-6 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
              <div className="relative lg:col-span-2">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-civic-charcoal-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ID, Title, Citizen, or Location..."
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-civic-navy-200 text-xs focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50"
                />
              </div>

              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full p-2 rounded-lg border border-civic-navy-200 bg-white text-xs"
                >
                  <option value="All">All Statuses</option>
                  <option value="Registered">Registered</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Waiting List">Waiting List</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Denied">Denied</option>
                </select>
              </div>

              <div>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full p-2 rounded-lg border border-civic-navy-200 bg-white text-xs"
                >
                  <option value="All">All Priorities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="flex gap-2">
                <select
                  value={riskRange}
                  onChange={(e) => setRiskRange(e.target.value)}
                  className="w-full p-2 rounded-lg border border-civic-navy-200 bg-white text-xs"
                >
                  <option value="All">All Risk</option>
                  <option value="Critical">Risk 85-100</option>
                  <option value="High">Risk 68-84</option>
                  <option value="Medium">Risk 45-67</option>
                  <option value="Low">Risk &lt; 45</option>
                </select>
                <button
                  onClick={resetFilters}
                  className="p-2 rounded-lg border border-civic-navy-200 hover:bg-civic-sand-100 text-civic-charcoal-600"
                  title="Reset filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          {filteredComplaints.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon="search"
                title="No complaints match current filters"
                description="Try loosening your search terms or priority thresholds."
                action={
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-civic-teal-700 bg-civic-teal-50 hover:bg-civic-teal-100 border border-civic-teal-200"
                  >
                    Clear Filters
                  </button>
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-civic-sand-100 border-y border-civic-navy-200 text-civic-navy-950 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Complaint ID</th>
                    <th className="py-3 px-4">Title & Details</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Citizen Name</th>
                    <th className="py-3 px-4">Priority & Risk</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-civic-navy-100">
                  {filteredComplaints.map((item) => (
                    <tr key={item.id} className="hover:bg-civic-sand-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-civic-navy-950 whitespace-nowrap">
                        {item.id}
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <p className="font-semibold text-civic-navy-950 truncate">{item.title}</p>
                        <p className="text-[11px] text-civic-charcoal-500 line-clamp-1">{item.description}</p>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <CategoryBadge category={item.category} />
                      </td>
                      <td className="py-3 px-4 text-civic-charcoal-600 max-w-[140px] truncate">
                        {item.location}
                      </td>
                      <td className="py-3 px-4 text-civic-navy-900 font-medium whitespace-nowrap">
                        {item.citizenName}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <PriorityBadge priority={item.priority} size="xs" />
                          <RiskScoreBadge score={item.riskScore} />
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-civic-charcoal-500 whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <StatusBadge status={item.status} size="xs" />
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setActiveModalComplaint(item)}
                            className="px-2.5 py-1 rounded bg-civic-sand-100 hover:bg-civic-sand-200 text-civic-navy-900 font-bold text-[11px] transition-colors"
                          >
                            Update
                          </button>
                          <Link
                            to={`/authority/complaints/${item.id}`}
                            className="p-1 rounded text-civic-charcoal-500 hover:text-civic-teal-700"
                            title="Inspect Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>

      {/* Status Update Modal */}
      {activeModalComplaint && (
        <StatusUpdateModal
          isOpen={!!activeModalComplaint}
          complaint={activeModalComplaint}
          onClose={() => setActiveModalComplaint(null)}
        />
      )}
    </AuthorityLayout>
  );
}
