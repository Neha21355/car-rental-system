import { useEffect, useState } from 'react';
import { getCustomerNotifications, markNotificationSeen, getOwnerNotifications, markOwnerNotificationSeen } from '../api/customerApi';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, AlertCircle, Info, Bell, Check } from 'lucide-react';

export default function Notifications() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isOwner } = useAuth();
  const getNotifications = isOwner ? getOwnerNotifications : getCustomerNotifications;
  const markSeen = isOwner ? markOwnerNotificationSeen : markNotificationSeen;

  useEffect(() => {
    getNotifications().then((response) => setNotifs(response.data)).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, [isOwner]);

  const markRead = async (id) => {
    try {
      await markSeen(id);
      setNotifs((current) => current.map((notification) => notification.id === id ? { ...notification, seen: true } : notification));
      window.dispatchEvent(new Event('notifications-updated'));
    } catch (err) {
      setError(err.message || 'Unable to update notification');
    }
  };

  const markAllRead = async () => {
    setError('');
    const unread = notifs.filter((notification) => !notification.seen);
    try {
      await Promise.all(unread.map((notification) => markSeen(notification.id)));
      setNotifs((current) => current.map((notification) => ({ ...notification, seen: true })));
      window.dispatchEvent(new Event('notifications-updated'));
    } catch (err) {
      setError(err.message || 'Unable to mark notifications as read');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Bell className="w-6 h-6" /> Notifications
        </h1>
        <button onClick={markAllRead} disabled={!notifs.some((notification) => !notification.seen)} className="text-sm text-blue-600 font-medium hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed">
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>}
        {loading && <div className="text-center py-12 text-gray-500">Loading notifications...</div>}
        {!loading && notifs.map((n) => {
          const Icon = n.seen ? CheckCircle : AlertCircle;
          return (
            <div
              key={n.id}
              className={`card p-4 flex gap-4 items-start transition ${!n.seen ? 'border-l-4 border-l-blue-600 bg-blue-50/30' : ''}`}
            >
              <div className={`p-2 rounded-full shrink-0 ${n.seen ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-600'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className={`text-sm font-semibold ${!n.seen ? 'text-gray-900' : 'text-gray-700'}`}>{n.seen ? 'Read notification' : 'New notification'}</h3>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                {!n.seen && <button onClick={() => markRead(n.id)} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"><Check className="w-3.5 h-3.5" /> Mark as read</button>}
              </div>
            </div>
          );
        })}
        {!loading && !error && notifs.length === 0 && <div className="text-center py-12 text-gray-500">No notifications yet.</div>}
      </div>
    </div>
  );
}
