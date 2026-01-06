/**
 * Servicio de estadísticas de partidas
 * Gestiona estadísticas tanto locales (localStorage) como en línea (servidor)
 */

const STORAGE_KEY = 'juego_magos_stats';

/**
 * Obtiene el objeto de estadísticas del usuario desde localStorage
 * @param {string} username - Nombre del usuario
 * @returns {Object} Estadísticas del usuario
 */
function getLocalStats(username) {
  try {
    const stats = localStorage.getItem(STORAGE_KEY);
    const allStats = stats ? JSON.parse(stats) : {};
    
    if (!allStats[username]) {
      allStats[username] = {
        totalPartidas: 0,
        tiempoTotal: 0,
        partidas: [],
        ultimaActualizacion: new Date().toISOString()
      };
    }
    
    return allStats[username];
  } catch (error) {
    console.error('Error al obtener estadísticas locales:', error);
    return {
      totalPartidas: 0,
      tiempoTotal: 0,
      partidas: [],
      ultimaActualizacion: new Date().toISOString()
    };
  }
}

/**
 * Guarda las estadísticas de un usuario en localStorage
 * @param {string} username - Nombre del usuario
 * @param {Object} stats - Objeto de estadísticas
 */
function saveLocalStats(username, stats) {
  try {
    const allStats = localStorage.getItem(STORAGE_KEY);
    const parsedStats = allStats ? JSON.parse(allStats) : {};
    
    parsedStats[username] = {
      ...stats,
      ultimaActualizacion: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedStats));
  } catch (error) {
    console.error('Error al guardar estadísticas locales:', error);
  }
}

/**
 * Registra una partida local
 * @param {string} username - Nombre del usuario
 * @param {number} durationMs - Duración de la partida en milisegundos
 * @returns {Object} Estadísticas actualizadas
 */
export function recordLocalGameSession(username, durationMs) {
  if (!username || typeof durationMs !== 'number' || durationMs < 0) {
    throw new Error('Datos inválidos para registrar la partida');
  }

  const stats = getLocalStats(username);
  stats.totalPartidas++;
  stats.tiempoTotal += durationMs;
  stats.partidas.push({
    duracion: durationMs,
    fecha: new Date().toISOString()
  });

  // Mantener solo las últimas 50 partidas
  if (stats.partidas.length > 50) {
    stats.partidas = stats.partidas.slice(-50);
  }

  saveLocalStats(username, stats);

  console.log(`🎮 PARTIDA LOCAL: ${username} - Duración: ${(durationMs / 1000).toFixed(2)}s`);
  console.log(`   Promedio: ${(stats.tiempoTotal / stats.totalPartidas / 1000).toFixed(2)}s`);

  return {
    username,
    modo: 'local',
    partidasJugadas: stats.totalPartidas,
    tiempoPromedio: stats.tiempoTotal / stats.totalPartidas,
    ultimaPartida: durationMs
  };
}

/**
 * Obtiene las estadísticas locales de un usuario
 * @param {string} username - Nombre del usuario
 * @returns {Object} Estadísticas del usuario
 */
export function getLocalGameStats(username) {
  if (!username) {
    throw new Error('El nombre de usuario es obligatorio');
  }

  const stats = getLocalStats(username);
  
  return {
    username,
    modo: 'local',
    totalPartidas: stats.totalPartidas,
    tiempoPromedio: stats.totalPartidas > 0 ? stats.tiempoTotal / stats.totalPartidas : 0,
    tiempoTotal: stats.tiempoTotal,
    partidas: stats.partidas,
    ultimaActualizacion: stats.ultimaActualizacion
  };
}

/**
 * Obtiene el ranking local de jugadores
 * @param {number} limit - Número máximo de jugadores
 * @returns {Array} Array de jugadores ordenados por tiempo promedio
 */
export function getLocalGameStatsRanking(limit = 10) {
  try {
    const allStats = localStorage.getItem(STORAGE_KEY);
    const stats = allStats ? JSON.parse(allStats) : {};

    const ranking = Object.entries(stats)
      .map(([username, userStats]) => ({
        username,
        totalPartidas: userStats.totalPartidas,
        tiempoPromedio: userStats.totalPartidas > 0 ? userStats.tiempoTotal / userStats.totalPartidas : 0,
        tiempoTotal: userStats.tiempoTotal
      }))
      .filter(user => user.totalPartidas > 0)
      .sort((a, b) => a.tiempoPromedio - b.tiempoPromedio)
      .slice(0, limit);

    return ranking;
  } catch (error) {
    console.error('Error al obtener ranking local:', error);
    return [];
  }
}

/**
 * Elimina las estadísticas de un usuario (limpieza)
 * @param {string} username - Nombre del usuario
 */
export function clearUserLocalStats(username) {
  try {
    const allStats = localStorage.getItem(STORAGE_KEY);
    const stats = allStats ? JSON.parse(allStats) : {};
    
    delete stats[username];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    console.log(`Estadísticas locales de ${username} eliminadas`);
  } catch (error) {
    console.error('Error al eliminar estadísticas locales:', error);
  }
}

/**
 * Limpia todas las estadísticas
 */
export function clearAllLocalStats() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Todas las estadísticas locales han sido eliminadas');
  } catch (error) {
    console.error('Error al limpiar estadísticas:', error);
  }
}
