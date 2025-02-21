import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Sun, Moon, User, Lock, Bell } from 'lucide-react';

export default function Settings() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const settingsOptions = [
    { name: 'Profile', icon: <User size={20} />, action: () => router.push('/profile') },
    { name: 'Security', icon: <Lock size={20} />, action: () => router.push('/security') },
    { name: 'Notifications', icon: <Bell size={20} />, action: () => router.push('/notifications') },
    { name: 'Dark Mode', icon: darkMode ? <Moon size={20} /> : <Sun size={20} />, action: toggleDarkMode },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <div className="w-full max-w-md bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col gap-4">
          {settingsOptions.map((option, index) => (
            <div
              key={index}
              onClick={option.action}
              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
            >
              <div className="flex items-center gap-3">
                {option.icon}
                <span className="text-lg">{option.name}</span>
              </div>
              {option.name === 'Dark Mode' && (
                <button
                  className={`w-10 h-5 flex items-center rounded-full p-1 ${darkMode ? 'bg-blue-600' : 'bg-gray-400'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDarkMode();
                  }}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transform ${darkMode ? 'translate-x-5' : ''} transition`} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}