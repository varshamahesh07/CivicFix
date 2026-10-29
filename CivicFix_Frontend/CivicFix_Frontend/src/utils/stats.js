export function countByStatus(list) {
  const out = { total: list.length, Registered: 0, Ongoing: 0, 'Waiting List': 0, Resolved: 0, Denied: 0 };
  list.forEach((c) => { if (c.status in out) out[c.status] += 1; });
  return out;
}

export function countBy(list, key) {
  return list.reduce((acc, c) => {
    const k = c[key] || 'Not assessed';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
}
