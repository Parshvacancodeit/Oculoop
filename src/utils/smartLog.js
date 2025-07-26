// smartLog.js
import axios from 'axios';

const logCache = new Map();

const generateKey = (log) => {
  return `${log.url}-${[...log.type].sort().join(',')}-${log.liked}`;
};

// This was missing
const sendToBackend = async (log) => {
  try {
    await axios.post('http://localhost:5051/log-behavior', log);
    console.log('📤 Sent to backend:', log);
  } catch (err) {
    console.error('❌ Error sending to backend:', err);
  }
};

const smartLog = async (log) => {
  const key = generateKey(log);
  const cached = logCache.get(key);

  // Merge new types with existing log if needed
  if (cached) {
    const mergedTypes = Array.from(new Set([...(cached.type || []), ...(log.type || [])]));
    const mergedLog = { ...cached, ...log, type: mergedTypes };
    console.log('📦 Merged Log:', mergedLog);
    logCache.set(key, mergedLog);
    await sendToBackend(mergedLog); // ✅ Now works
  } else {
    logCache.set(key, log);
    console.log('📥 Received Log:', log);
    await sendToBackend(log); // ✅ Now works
  }
};

export default smartLog;
