import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { complaintService } from '../services/complaintService';
import { useAuth } from './AuthContext';

const ComplaintContext = createContext(null);

export function ComplaintProvider({ children }) {
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const data = await complaintService.getAllComplaints();
      setComplaints(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  // Submit new complaint (Citizen)
  const submitComplaint = async (formData) => {
    try {
      const created = await complaintService.createComplaint(formData, currentUser);
      setComplaints((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update status (Authority)
  const updateComplaintStatus = async (id, newStatus, note) => {
    try {
      const updated = await complaintService.updateStatus(id, newStatus, note, currentUser);
      setComplaints((prev) =>
        prev.map((item) => (item.id.toUpperCase() === id.toUpperCase() ? updated : item))
      );
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Reset demo storage to default seed
  const resetDemoData = () => {
    const defaultData = complaintService.resetDemoData();
    setComplaints(defaultData);
    return defaultData;
  };

  // Dynamic Authority KPI stats (using the exact 5 platform statuses)
  const authorityStats = useMemo(() => {
    const total = complaints.length;
    const registered = complaints.filter((c) => c.status === 'Registered').length;
    const ongoing = complaints.filter((c) => c.status === 'Ongoing').length;
    const waitingList = complaints.filter((c) => c.status === 'Waiting List').length;
    const resolved = complaints.filter((c) => c.status === 'Resolved').length;
    const denied = complaints.filter((c) => c.status === 'Denied').length;

    const critical = complaints.filter((c) => c.priority === 'Critical').length;
    const high = complaints.filter((c) => c.priority === 'High').length;
    const medium = complaints.filter((c) => c.priority === 'Medium').length;
    const low = complaints.filter((c) => c.priority === 'Low').length;
    const criticalOrHigh = critical + high;

    const avgRisk = total > 0
      ? Math.round(complaints.reduce((acc, curr) => acc + (curr.riskScore || 0), 0) / total)
      : 0;

    // Distribution by category
    const byCategory = complaints.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      registered,
      ongoing,
      waitingList,
      resolved,
      denied,
      critical,
      high,
      medium,
      low,
      criticalOrHigh,
      avgRisk,
      byCategory
    };
  }, [complaints]);

  // Priority Queue: sorted Critical -> High -> Medium -> Low, then risk score desc, then date desc
  const priorityQueue = useMemo(() => {
    const priorityWeights = {
      Critical: 4,
      High: 3,
      Medium: 2,
      Low: 1
    };

    return [...complaints].sort((a, b) => {
      const weightDiff = (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
      if (weightDiff !== 0) return weightDiff;

      const riskDiff = (b.riskScore || 0) - (a.riskScore || 0);
      if (riskDiff !== 0) return riskDiff;

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [complaints]);

  // Citizen complaints getter
  const getCitizenComplaints = (citizenId) => {
    if (!citizenId) return [];
    return complaints.filter((c) => c.citizenId === citizenId);
  };

  // Citizen statistics
  const getCitizenStats = (citizenId) => {
    const userComplaints = getCitizenComplaints(citizenId);
    return {
      total: userComplaints.length,
      registered: userComplaints.filter((c) => c.status === 'Registered').length,
      ongoing: userComplaints.filter((c) => c.status === 'Ongoing').length,
      waitingList: userComplaints.filter((c) => c.status === 'Waiting List').length,
      resolved: userComplaints.filter((c) => c.status === 'Resolved').length,
      denied: userComplaints.filter((c) => c.status === 'Denied').length
    };
  };

  // Enforces citizen privacy: citizen can only view their own complaint
  const getComplaintForUser = (id, user) => {
    const complaint = complaints.find((c) => c.id.toUpperCase() === id.toUpperCase());
    if (!complaint) {
      return { allowed: false, complaint: null, reason: 'Complaint record not found.' };
    }

    if (user?.role === 'authority') {
      return { allowed: true, complaint };
    }

    if (user?.role === 'citizen' && complaint.citizenId === user.id) {
      return { allowed: true, complaint };
    }

    return {
      allowed: false,
      complaint: null,
      reason: 'Access Restricted: Citizens can only inspect complaints submitted by their own authenticated account.'
    };
  };

  const value = {
    complaints,
    priorityQueue,
    loading,
    error,
    authorityStats,
    submitComplaint,
    updateComplaintStatus,
    resetDemoData,
    getCitizenComplaints,
    getCitizenStats,
    getComplaintForUser,
    refreshComplaints: loadComplaints
  };

  return <ComplaintContext.Provider value={value}>{children}</ComplaintContext.Provider>;
}

export function useComplaints() {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
}
