import { DEMO_CITIZENS, DEMO_AUTHORITIES, DEMO_COMPLAINTS } from '../data/demoData';

// In-memory demo store. Resets when the page reloads. Replace these calls with API requests later.
export const store = {
  citizens: structuredClone(DEMO_CITIZENS),
  authorities: structuredClone(DEMO_AUTHORITIES),
  complaints: structuredClone(DEMO_COMPLAINTS),
};
