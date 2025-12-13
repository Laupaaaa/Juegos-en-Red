/**
 * API Client para comunicación con el servidor
 * Este archivo contiene funciones para realizar peticiones HTTP al servidor
 *
 * IMPORTANTE: Las funciones están definidas pero NO implementadas.
 * Debes implementar cada función usando fetch() o la librería que prefieras.
 */

const API_BASE_URL = 'http://localhost:3000';

// ==================== USUARIOS ====================

/**
 * Registra un nuevo usuario en el sistema
 * @param {Object} userData - Datos del usuario {email, name, avatar, level}
 * @returns {Promise<Object>} - Usuario creado
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
 * @returns {Promise<Object>} - Usuario encontrado
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
 * @param {Object} updates - Objeto con los campos a actualizar
 * @returns {Promise<Object>} - Usuario actualizado
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
  return response.ok;
}

// ==================== MENSAJES ====================

/**
 * Envía un mensaje al chat
 * @param {string} userEmail - Email del usuario que envía
 * @param {string} message - Contenido del mensaje
 * @returns {Promise<Object>} - Mensaje creado
 */
export async function sendMessage(userEmail, userMessage) {
  // Body: {email: userEmail, message: message}
  // El servidor debe verificar que el email existe
  // Retornar: mensaje creado con timestamp
  const response = await fetch(`${API_BASE_URL}/api/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: userEmail, 
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
