

export function createUserService() {
  // Estado privado: almacén de usuarios logeados
  let loggedInUsers = new Set(); // { 'usuario1', 'usuario2', ... }
  
  // Estado privado: estadísticas de partidas por usuario
  let userGameStats = {}; // { username: { totalPartidas: 0, tiempoTotal: 0, partidas: [...] } }

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
    
    // Inicializar estadísticas si no existen
    if (!userGameStats[username]) {
      userGameStats[username] = {
        totalPartidas: 0,
        tiempoTotal: 0,
        partidas: []
      };
    }
    
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

  /**
   * Registra el final de una partida con su duración
   * @param {string} username - Nombre del usuario
   * @param {number} durationMs - Duración de la partida en milisegundos
   * @returns {Object} Estadísticas actualizadas del usuario
   */
  function recordGameSession(username, durationMs) {
    if (!username) {
      throw new Error('El usuario es obligatorio');
    }

    if (typeof durationMs !== 'number' || durationMs < 0) {
      throw new Error('La duración debe ser un número positivo');
    }

    // Inicializar estadísticas si no existen
    if (!userGameStats[username]) {
      userGameStats[username] = {
        totalPartidas: 0,
        tiempoTotal: 0,
        partidas: []
      };
    }

    const stats = userGameStats[username];
    stats.totalPartidas++;
    stats.tiempoTotal += durationMs;
    stats.partidas.push({
      duracion: durationMs,
      fecha: new Date().toISOString()
    });

    console.log(`🎮 PARTIDA: ${username} - Duración: ${(durationMs / 1000).toFixed(2)}s`);
    console.log(`   Promedio: ${(stats.tiempoTotal / stats.totalPartidas / 1000).toFixed(2)}s`);

    return {
      username,
      partidasJugadas: stats.totalPartidas,
      tiempoPromedio: stats.tiempoTotal / stats.totalPartidas,
      ultimaPartida: durationMs
    };
  }

  /**
   * Obtiene las estadísticas de partidas de un usuario
   * @param {string} username - Nombre del usuario
   * @returns {Object|null} Estadísticas del usuario o null si no existen
   */
  function getUserGameStats(username) {
    if (!username) {
      throw new Error('El usuario es obligatorio');
    }

    if (!userGameStats[username]) {
      return null;
    }

    const stats = userGameStats[username];
    return {
      username,
      totalPartidas: stats.totalPartidas,
      tiempoPromedio: stats.totalPartidas > 0 ? stats.tiempoTotal / stats.totalPartidas : 0,
      tiempoTotal: stats.tiempoTotal,
      partidas: stats.partidas
    };
  }

  /**
   * Obtiene el ranking de usuarios por tiempo promedio
   * @param {number} limit - Número máximo de usuarios a retornar (default: 10)
   * @returns {Array} Array de usuarios ordenados por tiempo promedio (menor primero)
   */
  function getGameStatsRanking(limit = 10) {
    const ranking = Object.entries(userGameStats)
      .map(([username, stats]) => ({
        username,
        totalPartidas: stats.totalPartidas,
        tiempoPromedio: stats.totalPartidas > 0 ? stats.tiempoTotal / stats.totalPartidas : 0,
        tiempoTotal: stats.tiempoTotal
      }))
      .filter(user => user.totalPartidas > 0) // Solo usuarios con partidas
      .sort((a, b) => a.tiempoPromedio - b.tiempoPromedio) // Ordenar por tiempo promedio (menor es mejor)
      .slice(0, limit);

    return ranking;
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
    deleteUser,
    recordGameSession,
    getUserGameStats,
    getGameStatsRanking
  };
}
