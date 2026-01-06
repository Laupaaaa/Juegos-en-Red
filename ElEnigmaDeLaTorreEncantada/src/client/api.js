/**
 * API Client para comunicación con el servidor
 * Este archivo contiene funciones para realizar peticiones HTTP al servidor
 *
 * IMPORTANTE: Las funciones están definidas pero NO implementadas.
 * Debes implementar cada función usando fetch() o la librería que prefieras.
 */

import { 
  recordLocalGameSession, 
  getLocalGameStats, 
  getLocalGameStatsRanking 
} from './services/gameStatsService.js';

const API_BASE_URL = 'http://localhost:3000';

// ==================== USUARIOS ====================

/**
 * Registra un nuevo usuario en el sistema
 * @param {object} userData - Datos del usuario { name, avatar, level}
 * @returns {Promise<object>} - Usuario creado
 */
export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    // let errorTxt;

    // try{
    // const error = await response.json();
    // errorTxt = (error.error || 'Error al registrar usuario');}
    // catch{
    //   errorTxt = await response.text();
    // } 

    // throw new Error( errorTxt);

    const error = await response.json();
    throw new Error(error.error || 'Error al registrar usuario');
  }

  console.log("Usuario creado correctamente."); 
  return await response.json();
}

/**
 * Obtiene un usuario por su ID
 * @param {string} userId - ID del usuario
 * @returns {Promise<object>} - Usuario encontrado
 */
export async function getUser(userId) {
  // Retornar: usuario o lanzar error si no existe
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`);
  //no hace falta especificar el metodo por que GET es el método por defecto

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al obtener usuario');
  }

  console.log("Usuario obtenido correctamente."); 
  return await response.json(); 
}

/**
 * Obtiene todos los usuarios
 * @returns {Promise<Array>} - Array de usuarios
 */
export async function getAllUsers() {
  // Retornar: array de usuarios
  const response = await fetch(`${API_BASE_URL}/api/users`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al obtener los usuarios');
  }
  console.log("Usuarios obtenidos correctamente."); 
  return await response.json(); 
}

/**
 * Actualiza un campo específico de un usuario
 * @param {string} userId - ID del usuario
 * @param {object} updates - Objeto con los campos a actualizar
 * @returns {Promise<object>} - Usuario actualizado
 */
export async function updateUser(userId, updates) {
  // Body: updates (JSON)
  // Retornar: usuario actualizado
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });

  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al actualizar campo del usuario');
  }

  console.log("Usuario actualizado correctamente."); 
  return await response.json();
}

/**
 * Elimina un usuario del sistema
 * @param {string} userId - ID del usuario
 * @returns {Promise<void>}
 */
export async function deleteUser(userId) {
  // Retornar: confirmación o lanzar error
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: 'DELETE'
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al eliminar usuario');
  }
  console.log("Usuario eliminado correctamente."); 
}

/**
 * Realiza login de un usuario
 * @param {string} username - Nombre de usuario
 * @returns {Promise<object>} - Usuario logeado
 */
export async function loginUser(username) {
  const response = await fetch(`${API_BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al iniciar sesión');
  }

  console.log("Login exitoso.");
  return await response.json();
}

/**
 * Realiza logout de un usuario
 * @param {string} username - Nombre de usuario
 * @returns {Promise<object>} - Confirmación de logout
 */
export async function logoutUser(username) {
  const response = await fetch(`${API_BASE_URL}/api/users/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al cerrar sesión');
  }

  console.log("Logout exitoso.");
  return await response.json();
}

/**
 * Obtiene la lista de usuarios actualmente logeados
 * @returns {Promise<Array>} - Array de usuarios logeados
 */
export async function getLoggedInUsers() {
  const response = await fetch(`${API_BASE_URL}/api/users/logged-in`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al obtener usuarios logeados');
  }

  return await response.json();
}

/**
 * Registra una partida (local u online)
 * @param {string} username - Nombre del usuario
 * @param {number} durationMs - Duración de la partida en milisegundos
 * @param {string} mode - 'local' o 'online'
 * @returns {Promise<object>} - Estadísticas actualizadas
 */
export async function recordGameSession(username, durationMs, mode = 'local') {
  // Siempre guardar localmente
  const localResult = recordLocalGameSession(username, durationMs);

  // Si es online, enviar también al servidor
  if (mode === 'online') {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${username}/game-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ durationMs })
      });

      if (!response.ok) {
        const error = await response.json();
        console.warn('Advertencia: No se pudo guardar en servidor:', error.error);
      } else {
        const serverResult = await response.json();
        console.log(`Partida registrada en servidor: ${username}`);
        return {
          ...localResult,
          modo: 'online',
          sincronizadoServidor: true,
          datosServidor: serverResult
        };
      }
    } catch (error) {
      console.warn('Error al conectar con servidor, guardando solo localmente:', error);
    }
  }

  return localResult;
}

/**
 * Obtiene las estadísticas de un usuario (local u online)
 * @param {string} username - Nombre del usuario
 * @param {string} mode - 'local' o 'online'
 * @returns {Promise<object>} - Estadísticas del usuario
 */
export async function getUserGameStats(username, mode = 'local') {
  if (mode === 'local') {
    return getLocalGameStats(username);
  }

  // Modo online
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${username}/stats`);

    if (!response.ok) {
      const error = await response.json();
      console.warn('No hay estadísticas en servidor, usando locales:', error.error);
      return getLocalGameStats(username);
    }

    const serverStats = await response.json();
    console.log(`Estadísticas de ${username}:`, serverStats);
    return {
      ...serverStats,
      modo: 'online',
      fuente: 'servidor'
    };
  } catch (error) {
    console.warn('Error al obtener estadísticas del servidor, usando locales:', error);
    return getLocalGameStats(username);
  }
}

/**
 * Obtiene el ranking de jugadores (local u online)
 * @param {number} limit - Número máximo de jugadores (default: 10)
 * @param {string} mode - 'local' o 'online'
 * @returns {Promise<Array>} - Array de jugadores ordenados por tiempo promedio
 */
export async function getGameStatsRanking(limit = 10, mode = 'local') {
  if (mode === 'local') {
    return getLocalGameStatsRanking(limit);
  }

  // Modo online
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/stats/ranking?limit=${limit}`);

    if (!response.ok) {
      const error = await response.json();
      console.warn('No hay ranking en servidor, usando local:', error.error);
      return getLocalGameStatsRanking(limit);
    }

    const serverRanking = await response.json();
    console.log('Ranking de jugadores:', serverRanking);
    return serverRanking;
  } catch (error) {
    console.warn('Error al obtener ranking del servidor, usando local:', error);
    return getLocalGameStatsRanking(limit);
  }
}

// ==================== MENSAJES ====================

/**
 * Envía un mensaje al chat
 * @param {string} userMessage - Contenido del mensaje
 * @returns {Promise<object>} - Mensaje creado
 */
export async function sendMessage(userMessage) {
  // Body: {email: userEmail, message: message}
  // El servidor debe verificar que el email existe
  // Retornar: mensaje creado con timestamp
  const response = await fetch(`${API_BASE_URL}/api/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: userMessage
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al enviar mensaje');
  }

  const newMessage = await response.json();
  console.log('Mensaje creado:', newMessage);
  return newMessage; 
}

/**
 * Obtiene los últimos mensajes del chat
 * @param {number} limit - Número máximo de mensajes a obtener (default: 50)
 * @returns {Promise<Array>} - Array de mensajes
 */
export async function getMessages(limit = 50) {
  // Retornar: array de mensajes ordenados por   
  const response = await fetch(`${API_BASE_URL}/api/messages?limit=${limit}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al obtener los últimos mensajes');
  }

  const mensajes = await response.json();
  console.log('Mensajes obtenidos:', mensajes);
  return mensajes; 
}

/**
 * Obtiene mensajes desde un timestamp específico (para polling)
 * @param {string} since - Timestamp ISO desde el cual obtener mensajes
 * @returns {Promise<Array>} - Array de mensajes nuevos
 */
export async function getMessagesSince(since) {
  // Útil para implementar polling y obtener solo mensajes nuevos
  // Retornar: array de mensajes nuevos
  const response = await fetch(`${API_BASE_URL}/api/messages?since=${since}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al obtener los últimos mensajes');
  }

  const mensajes = await response.json();
  console.log('Mensajes obtenidos:', mensajes);
  return mensajes;
}
