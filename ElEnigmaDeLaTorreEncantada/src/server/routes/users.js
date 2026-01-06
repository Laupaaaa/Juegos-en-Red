/**
 * Rutas para la gestión de usuarios
 * Define los endpoints HTTP y los conecta con el controlador
 *
 * Patrón: Inyección de dependencias - recibe el controlador como parámetro
 */

import express from 'express';

export function createUserRoutes(userController) {
  const router = express.Router();

  // POST /api/users/login - Realizar login
  router.post('/login', userController.handleLogin);

  // POST /api/users/logout - Realizar logout
  router.post('/logout', userController.handleLogout);

  // GET /api/users/logged-in - Obtener usuarios logeados
  router.get('/logged-in', userController.getLoggedIn);

  // POST /api/users/:username/game-session - Registrar fin de partida
  router.post('/:username/game-session', userController.recordGameSession);

  // GET /api/users/:username/stats - Obtener estadísticas de un usuario
  router.get('/:username/stats', userController.getUserStats);

  // GET /api/users/stats/ranking - Obtener ranking de usuarios
  router.get('/stats/ranking', userController.getStatsRanking);

  // GET /api/users - Obtener todos los usuarios logeados
  router.get('/', userController.getAll);

  // Otros endpoints (no implementados)
  router.post('/', userController.create);
  router.get('/:id', userController.getById);
  router.put('/:id', userController.update);
  router.delete('/:id', userController.remove);

  return router;
}
