import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Check, Trash2, MoreHorizontal, Calendar, 
  Clock, FileText, AlertTriangle, Info, CheckCircle, 
  AlertCircle, X, Eye, EyeOff 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import * as notificationService from '../../services/notification';

const NotificationDropdown = ({ isOpen, onClose, anchorRef }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dropdownRef = useRef(null);

  // Cargar notificaciones al abrir
  useEffect(() => {
    if (isOpen) {
      loadNotifications(true);
      loadUnreadCount();
    }
  }, [isOpen, filter]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && 
          !dropdownRef.current.contains(event.target) &&
          anchorRef.current &&
          !anchorRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const loadNotifications = async (reset = false) => {
    try {
      setLoading(true);
      const options = {
        page: reset ? 1 : page,
        limit: 10,
        unreadOnly: filter === 'unread'
      };
      
      const data = await notificationService.getUserNotifications(options);
      
      const newNotifications = reset ? data.notifications : [...notifications, ...data.notifications];
      setNotifications(newNotifications);
      setHasMore(data.pagination.page < data.pagination.pages);
      if (!reset) setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const data = await notificationService.getUnreadCount();
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error cargando contador:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, read: true, readAt: new Date().toISOString() }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marcando como leída:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true, readAt: new Date().toISOString() })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      const deletedNotification = notifications.find(n => n.id === notificationId);
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error eliminando notificación:', error);
    }
  };

  const getIcon = (iconType, priority) => {
    const iconProps = {
      size: 16,
      className: `${priority === 'urgent' ? 'text-red-400' : 
                   priority === 'high' ? 'text-orange-400' : 
                   'text-[#a1db87]'}`
    };

    switch (iconType) {
      case 'clock': return <Clock {...iconProps} />;
      case 'file': return <FileText {...iconProps} />;
      case 'alert': return <AlertTriangle {...iconProps} />;
      case 'info': return <Info {...iconProps} />;
      case 'success': return <CheckCircle {...iconProps} />;
      case 'warning': return <AlertCircle {...iconProps} />;
      default: return <Bell {...iconProps} />;
    }
  };

  const formatTime = (date) => {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true, 
      locale: es 
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-[#1a1a1a] border border-[#333333] rounded-xl shadow-2xl z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#333333]">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-[#a1db87]" />
            <h3 className="text-white font-semibold">Notificaciones</h3>
            {unreadCount > 0 && (
              <span className="bg-[#a1db87] text-[#333333] text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={markAllAsRead}
                className="text-xs text-[#a1db87] hover:text-[#8bc96a] font-medium"
              >
                Marcar todas
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex p-3 space-x-2 bg-[#2a2a2a]/50">
          {[
            { key: 'all', label: 'Todas' },
            { key: 'unread', label: 'No leídas' },
            { key: 'read', label: 'Leídas' }
          ].map(filterOption => (
            <motion.button
              key={filterOption.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setFilter(filterOption.key);
                setPage(1);
                setNotifications([]);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filter === filterOption.key
                  ? 'bg-[#a1db87] text-[#333333]'
                  : 'bg-[#333333] text-gray-300 hover:bg-[#444444] hover:text-white'
              }`}
            >
              {filterOption.label}
            </motion.button>
          ))}
        </div>

        {/* Lista de notificaciones */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 && !loading ? (
            <div className="p-6 text-center">
              <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">
                {filter === 'unread' 
                  ? 'No tienes notificaciones sin leer' 
                  : 'No hay notificaciones'
                }
              </p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 border-b border-[#333333] hover:bg-[#2a2a2a]/50 transition-colors ${
                  !notification.read ? 'bg-[#a1db87]/5' : ''
                }`}
              >
                <div className="flex space-x-3">
                  {/* Icono */}
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.icon, notification.priority)}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`text-sm font-medium ${
                          !notification.read ? 'text-white' : 'text-gray-300'
                        }`}>
                          {notification.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.createdAt)}
                          </span>
                          {notification.metadata?.entityName && (
                            <span className="text-xs text-[#a1db87] bg-[#a1db87]/10 px-2 py-1 rounded">
                              {notification.metadata.entityName}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center space-x-1 ml-2">
                        {!notification.read && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-gray-400 hover:text-[#a1db87] transition-colors"
                            title="Marcar como leída"
                          >
                            <Check className="w-3 h-3" />
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3 h-3" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Indicador de prioridad */}
                    {notification.priority === 'urgent' && (
                      <div className="flex items-center mt-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                        <span className="text-xs text-red-400 font-medium">Urgente</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}

          {/* Botón cargar más */}
          {hasMore && !loading && notifications.length > 0 && (
            <div className="p-3 text-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => loadNotifications(false)}
                className="text-sm text-[#a1db87] hover:text-[#8bc96a] font-medium"
              >
                Cargar más
              </motion.button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="p-4 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-[#a1db87] border-t-transparent rounded-full mx-auto"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#2a2a2a]/50 border-t border-[#333333]">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full text-xs text-[#a1db87] hover:text-[#8bc96a] font-medium"
          >
            Ver todas las notificaciones
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationDropdown;