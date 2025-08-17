// src/app/hooks/useNotifications.ts
import { useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from 'react-query';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';

interface NotificationData {
  id: string;
  user_id: number;
  type: 'approval' | 'reception' | 'observation' | 'rejection';
  title: string;
  message: string;
  data?: any;
  source_module?: string;
  action_type?: string;
  timestamp: string;
  read: boolean;
}

interface TableReloadData {
  module: string;
  action: string;
  timestamp: string;
}

interface UseNotificationsConfig {
  userId: number;
  token: string;
  onNotification?: (notification: NotificationData) => void;
  onTableReload?: (data: TableReloadData) => void;
  enableBrowserNotifications?: boolean;
  enableToast?: boolean;
}

export const useNotifications = ({
  userId,
  token,
  onNotification,
  onTableReload,
  enableBrowserNotifications = true,
  enableToast = true
}: UseNotificationsConfig) => {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  // Solicitar permisos de notificación del navegador
  const requestNotificationPermission = useCallback(async () => {
    if (!enableBrowserNotifications) return;
    
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }, [enableBrowserNotifications]);

  // Mostrar notificación del navegador
  const showBrowserNotification = useCallback((notification: NotificationData) => {
    if (!enableBrowserNotifications || Notification.permission !== 'granted') return;

    const browserNotification = new Notification(notification.title, {
      body: notification.message,
      icon: '/favicon.ico',
      badge: '/badge-icon.png',
      tag: notification.id,
      requireInteraction: false,
      silent: false
    });

    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
      browserNotification.close();
    }, 5000);

    // Manejar click en la notificación
    browserNotification.onclick = () => {
      window.focus();
      browserNotification.close();
      // Aquí puedes agregar lógica para navegar a una página específica
    };
  }, [enableBrowserNotifications]);

  // Mostrar toast notification
  const showToastNotification = useCallback((notification: NotificationData) => {
    if (!enableToast) return;

    const toastOptions = {
      position: 'top-right' as const,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };

    switch (notification.type) {
      case 'approval':
        toast.success(`${notification.title}: ${notification.message}`, toastOptions);
        break;
      case 'reception':
        toast.info(`${notification.title}: ${notification.message}`, toastOptions);
        break;
      case 'observation':
        toast.warning(`${notification.title}: ${notification.message}`, toastOptions);
        break;
      case 'rejection':
        toast.error(`${notification.title}: ${notification.message}`, toastOptions);
        break;
      default:
        toast(`${notification.title}: ${notification.message}`, toastOptions);
    }
  }, [enableToast]);

  // Invalidar queries específicas basadas en el módulo
  const invalidateModuleQueries = useCallback((module: string) => {
    const moduleQueryKeys = {
      'comision': ['comisiones', 'comision-list'],
      'permiso': ['permisos', 'asistencia-permiso-list'],
      'declaratoria': ['declaratorias', 'declaratoria-comision-list'],
      'feriado': ['feriados', 'feriado-asueto-list'],
      'persona': ['personas', 'person-list'],
      'usuario': ['usuarios', 'users-list']
    };

    const keys = moduleQueryKeys[module as keyof typeof moduleQueryKeys] || [module];
    
    keys.forEach(key => {
      queryClient.invalidateQueries({ queryKey: [key] });
    });
  }, [queryClient]);

  // Conectar socket
  const connectSocket = useCallback(() => {
    if (socketRef.current?.connected) return;

    socketRef.current = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: maxReconnectAttempts,
      timeout: 20000
    });

    const socket = socketRef.current;

    // Manejo de conexión exitosa
    socket.on('connect', () => {
      console.log('🔗 Conectado al servidor de notificaciones');
      reconnectAttemptsRef.current = 0;
      
      // Enviar ping para verificar conexión
      socket.emit('ping');
    });

    // Manejo de desconexión
    socket.on('disconnect', (reason) => {
      console.log('❌ Desconectado del servidor de notificaciones:', reason);
    });

    // Manejo de errores de conexión
    socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión Socket.IO:', error.message);
      reconnectAttemptsRef.current++;
      
      if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
        console.error('❌ Máximo número de intentos de reconexión alcanzado');
        socket.disconnect();
      }
    });

    // Respuesta del ping
    socket.on('pong', (data) => {
      console.log('🏓 Pong recibido:', data.timestamp);
    });

    // Escuchar notificaciones
    socket.on('notification', (notification: NotificationData) => {
      console.log('🔔 Nueva notificación recibida:', notification);
      
      // Mostrar notificaciones visuales
      showBrowserNotification(notification);
      showToastNotification(notification);
      
      // Callback personalizado
      onNotification?.(notification);
    });

    // Escuchar eventos de recarga de tabla
    socket.on('table_reload', (data: TableReloadData) => {
      console.log('🔄 Recarga de tabla solicitada:', data);
      
      // Invalidar queries del módulo específico
      invalidateModuleQueries(data.module);
      
      // Callback personalizado
      onTableReload?.(data);
    });

    return socket;
  }, [
    token,
    showBrowserNotification,
    showToastNotification,
    invalidateModuleQueries,
    onNotification,
    onTableReload
  ]);

  // Desconectar socket
  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  // Enviar notificación de prueba
  const sendTestNotification = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('ping');
    }
  }, []);

  // Efecto principal
  useEffect(() => {
    if (!userId || !token) return;

    // Solicitar permisos de notificación
    requestNotificationPermission();

    // Conectar socket
    connectSocket();

    // Cleanup
    return () => {
      disconnectSocket();
    };
  }, [userId, token, connectSocket, disconnectSocket, requestNotificationPermission]);

  return {
    isConnected: socketRef.current?.connected || false,
    sendTestNotification,
    disconnectSocket,
    reconnectSocket: connectSocket
  };
};