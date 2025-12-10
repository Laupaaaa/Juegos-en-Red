/**
 * Servicio de gestión de mensajes usando closures
 *
 *
 * Requisitos:
 * - Usar closures para mantener estado privado
 * - Mantener un array de mensajes en memoria
 * - Cada mensaje debe tener: {id, email, message, timestamp}
 * - IMPORTANTE: Verificar que el email existe usando userService.getUserByEmail()
 *   antes de crear un mensaje
 */

//import { getMessages } from "../../client/api";

export function createMessageService(userService) {
  let messages = []; // - Array de mensajes
  let nextId = 1;// - Contador para IDs

  /**
   * Crea un nuevo mensaje
   * @param {string} email - Email del usuario que envía
   * @param {string} message - Contenido del mensaje
   * @returns {Object} Mensaje creado
   * @throws {Error} Si el email no existe
   */
  function createMessage(email, message) {
    // 1. Verificar que el usuario existe (userService.getUserByEmail)
    const user = userService.getUserByEmail(email);
    // 2. Si no existe, lanzar error
    if (!user) throw new Error('Usuario no encontrado');
    // 3. Crear objeto mensaje con id, email, message, timestamp
    const mensaje = {
      id: String(nextId++),
      email,
      message,
      timestamp: new Date().toISOString()
    }
    // 4. Agregar a la lista
    messages.push(mensaje); 
    // 5. Retornar el mensaje creado
    return mensaje; 
  }

  /**
   * Obtiene los últimos N mensajes
   * @param {number} limit - Cantidad de mensajes a retornar
   * @returns {Array} Array de mensajes
   */
  function getRecentMessages(limit = 50) {
    // Retornar los últimos 'limit' mensajes, ordenados por timestamp
    const recientes = getMessages(limit); 
    return recientes; 
  }

  /**
   * Obtiene mensajes desde un timestamp específico
   * @param {string} since - Timestamp ISO
   * @returns {Array} Mensajes nuevos desde ese timestamp
   */
  function getMessagesSince(since) {
    // Filtrar mensajes cuyo timestamp sea mayor que 'since'
    const desde = getMessagesSince(since);
    return desde; 
  }

  // Exponer la API pública del servicio
  return {
    createMessage,
    getRecentMessages,
    getMessagesSince
  };
}
