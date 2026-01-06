

export function createUserService() {
  // Estado privado: almacén de usuarios logeados
  let loggedInUsers = new Set(); // { 'usuario1', 'usuario2', ... }

  /**
   * Realiza login de un usuario
   * @param {string} username - Nombre de usuario
   * @returns {Object} Confirmación del login
   */
  function login(username) {
    if (!username) {
      throw new Error('El usuario es obligatorio');
    }

    // Validar que el usuario no esté ya logeado
    if (loggedInUsers.has(username)) {
      throw new Error('El usuario ya está logeado');
    }

    // Agregar a usuarios logeados
    loggedInUsers.add(username);
    
    console.log(`✅ LOGIN: ${username} (Total conectados: ${loggedInUsers.size})`);
    console.log(`   Usuarios activos: ${Array.from(loggedInUsers).join(', ')}`);
    
    return { username, status: 'logged-in' };
  }

  /**
   * Realiza logout de un usuario
   * @param {string} username - Nombre de usuario
   * @returns {boolean} true si se realizó el logout
   */
  function logout(username) {
    const wasLoggedIn = loggedInUsers.delete(username);
    
    if (wasLoggedIn) {
      console.log(`❌ LOGOUT: ${username} (Total conectados: ${loggedInUsers.size})`);
      if (loggedInUsers.size > 0) {
        console.log(`   Usuarios activos: ${Array.from(loggedInUsers).join(', ')}`);
      } else {
        console.log(`   Sin usuarios conectados`);
      }
    }
    
    return wasLoggedIn;
  }

  /**
   * Obtiene usuarios logeados
   * @returns {Array} Array de usuarios logeados
   */
  function getLoggedInUsers() {
    return Array.from(loggedInUsers);
  }

  /**
   * Obtiene todos los usuarios
   * @returns {Array} Array de usuarios
   */
  function getAllUsers() {
    return getLoggedInUsers();
  }

  /**
   * Busca un usuario por ID
   * @param {string} id - ID del usuario
   * @returns {Object|null} Usuario encontrado o null
   */
  function getUserById(id) {
    return null;
  }

  /**
   * Busca un usuario por email
   * @param {string} email - Email del usuario
   * @returns {Object|null} Usuario encontrado o null
   */
  function getUserByEmail(email) {
    return null;
  }

  /**
   * Actualiza un usuario
   * @param {string} id - ID del usuario
   * @param {Object} updates - Campos a actualizar
   * @returns {Object|null} Usuario actualizado o null si no existe
   */
  function updateUser(id, updates) {
    return null;
  }

  /**
   * Elimina un usuario
   * @param {string} id - ID del usuario
   * @returns {boolean} true si se eliminó, false si no existía
   */
  function deleteUser(id) {
    return false;
  }

  // Exponer la API pública del servicio
  return {
    login,
    logout,
    getLoggedInUsers,
    getAllUsers,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser
  };
}
