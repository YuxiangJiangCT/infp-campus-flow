/**
 * Debug utility to inspect localStorage data
 */

export function debugLocalStorage() {
  console.log('=== LocalStorage Debug Info ===');
  
  // List all keys
  const keys = Object.keys(localStorage);
  console.log('Total keys:', keys.length);
  console.log('Keys:', keys);
  
  // Check reflections specifically
  const reflectionsKey = 'dailyReflections';
  const reflectionsData = localStorage.getItem(reflectionsKey);
  
  if (reflectionsData) {
    try {
      const parsed = JSON.parse(reflectionsData);
      console.log('\n=== Daily Reflections ===');
      console.log('Total reflections:', Object.keys(parsed).length);
      
      // Show each reflection
      Object.entries(parsed).forEach(([date, reflection]: [string, any]) => {
        console.log(`\n📅 ${date}:`);
        console.log('  Content length:', reflection.content?.length || 0);
        console.log('  First 100 chars:', reflection.content?.substring(0, 100));
        console.log('  Mood:', reflection.mood);
        console.log('  Word count:', reflection.wordCount);
        console.log('  Has translation:', !!reflection.contentEn || !!reflection.contentZh);
      });
    } catch (e) {
      console.error('Failed to parse reflections:', e);
    }
  } else {
    console.log('No reflections found in localStorage');
  }
  
  // Check other important data
  const scheduleKey = 'flexibleSchedules';
  const scheduleData = localStorage.getItem(scheduleKey);
  if (scheduleData) {
    const parsed = JSON.parse(scheduleData);
    console.log('\n=== Flexible Schedules ===');
    console.log('Total days:', Object.keys(parsed).length);
  }
  
  // Show storage size
  const totalSize = new Blob(Object.values(localStorage)).size;
  console.log('\n=== Storage Info ===');
  console.log('Total storage used:', Math.round(totalSize / 1024), 'KB');
  
  return {
    keys,
    reflections: reflectionsData ? JSON.parse(reflectionsData) : null,
    totalSize
  };
}

// Add to window for easy console access
if (typeof window !== 'undefined') {
  (window as any).debugStorage = debugLocalStorage;
  console.log('💡 Tip: Run debugStorage() in console to inspect localStorage');
}