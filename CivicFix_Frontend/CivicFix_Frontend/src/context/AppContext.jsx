import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as authService from '../services/authService';
import * as complaintService from '../services/complaintService';

// One shared source of truth for both portals. Citizens and authorities read the same store,
// filtered by role, so every authority update is visible to the citizen immediately.
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => authService.getSessionUser());
  const [version, setVersion] = useState(0);
  const bump = useCallback(() => setVersion((v) => v + 1), []);

  const complaints = useMemo(() => complaintService.listComplaints(user), [user, version]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(
    () => ({
      user,
      complaints,
      login: async (role, creds) => {
        const u = await authService.login(role, creds);
        setUser(u);
        bump();
        return u;
      },
      logout: () => {
        authService.logout();
        setUser(null);
      },
      registerCitizen: (d) => authService.registerCitizen(d),
      registerAuthority: (d, file) => authService.registerAuthority(d, file),
      submitComplaint: async (payload) => {
        const c = await complaintService.createComplaint(payload, user);
        bump();
        return c;
      },
      updateStatus: async (id, update) => {
        const c = await complaintService.updateComplaintStatus(id, update, user);
        bump();
        return c;
      },
      updateProfile: async (patch) => {
        const u = await authService.updateProfile(user.id, patch);
        setUser(u);
        return u;
      },
    }),
    [user, complaints, bump]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
