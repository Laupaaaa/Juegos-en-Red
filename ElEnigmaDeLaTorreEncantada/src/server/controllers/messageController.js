/**
 * Controlador de mensajes usando closures
 * Requisitos:
 * - Usar closures para encapsular las funciones
 * - Recibir el servicio como parámetro (inyección de dependencias)
 * - Manejar errores apropiadamente
 * - Usar códigos de estado HTTP correctos
 * - Validar datos de entrada
 */

//import { getMessagesSince } from "../../client/api.js";

export function createMessageController(messageService) {
  /**
   * POST /api/messages - Enviar un nuevo mensaje
   * Body: {email, message}
   */
  async function create(req, res, next) {
    try {
      // 1. Extraer email y message del body
      const {email,message}  = req.body; 
      // 2. Validar que ambos campos estén presentes
      if(!message){
        return res.status(400).json({
          error: 'Los campos email y mensaje no se han encontrado.'
        });
      }
      // 3. Llamar a messageService.createMessage()
      const newMensaje = await messageService.createMessage(message); 

      // 5. Si el email no existe, retornar 400 con error descriptivo
      if (!newMensaje) {
        return res.status(400).json({ error: "El mensaje no existe en el sistema" });
      }
      // 4. Retornar 201 con el mensaje creado
      return res.status(201).json(newMensaje);

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/messages - Obtener mensajes
   * Query params: ?limit=N o ?since=timestamp
   */
  async function getMessages(req, res, next) {
    try {
      // 1. Revisar si hay query param 'since'
      //    - Si existe, llamar a messageService.getMessagesSince()
      const queryy = req.query.since; 
      let mensaje; 
      if (queryy) {
         mensaje = await messageService.getMessagesSince(Number(queryy)); 
      }
      // 2. Si no hay 'since', revisar query param 'limit'
      //    - Llamar a messageService.getRecentMessages(limit)
      else{
        mensaje = await messageService.getRecentMessages(req.query.limit || 50); 
      }
      // 3. Retornar 200 con los mensajes
      return res.status(200).json(mensaje); 
    } catch (error) {
      next(error);
    }
  }

  // Exponer la API pública del controlador
  return {
    create,
    getMessages
  };
}
