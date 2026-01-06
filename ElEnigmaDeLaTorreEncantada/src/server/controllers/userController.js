export function createUserController(userService) {
  /**
   * POST /api/users/login - Realizar login
   */
  async function handleLogin(req, res, next) {
    try {
      const { username } = req.body;

      if (!username) {
        return res.status(400).json({
          error: 'El usuario es obligatorio'
        });
      }

      const result = userService.login(username);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === 'El usuario ya está logeado') {
        return res.status(409).json({ error: error.message });
      }
      next(error);
    }
  }

  /**
   * POST /api/users/logout - Realizar logout
   */
  async function handleLogout(req, res, next) {
    try {
      const { username } = req.body;

      if (!username) {
        return res.status(400).json({
          error: 'El usuario es obligatorio'
        });
      }

      const success = userService.logout(username);
      if (!success) {
        return res.status(400).json({
          error: 'El usuario no está logeado'
        });
      }

      res.status(200).json({ message: 'Logout exitoso' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/logged-in - Obtener usuarios logeados
   */
  async function getLoggedIn(req, res, next) {
    try {
      const loggedInUsers = userService.getLoggedInUsers();
      res.status(200).json(loggedInUsers);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users - Obtener todos los usuarios logeados
   */
  async function getAll(req, res, next) {
    try {
      const users = userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/:id - Obtener un usuario por ID (no implementado)
   */
  async function getById(req, res, next) {
    res.status(404).json({ error: 'No implementado' });
  }

  /**
   * POST /api/users - Crear nuevo usuario (no implementado)
   */
  async function create(req, res, next) {
    res.status(404).json({ error: 'No implementado' });
  }

  /**
   * PUT /api/users/:id - Actualizar un usuario (no implementado)
   */
  async function update(req, res, next) {
    res.status(404).json({ error: 'No implementado' });
  }

  /**
   * DELETE /api/users/:id - Eliminar un usuario (no implementado)
   */
  async function remove(req, res, next) {
    res.status(404).json({ error: 'No implementado' });
  }

  /**
   * POST /api/users/:username/game-session - Registrar fin de partida
   */
  async function recordGameSession(req, res, next) {
    try {
      const { username } = req.params;
      const { durationMs } = req.body;

      if (!username) {
        return res.status(400).json({
          error: 'El usuario es obligatorio'
        });
      }

      if (typeof durationMs !== 'number' || durationMs < 0) {
        return res.status(400).json({
          error: 'La duración debe ser un número positivo en milisegundos'
        });
      }

      const result = userService.recordGameSession(username, durationMs);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/:username/stats - Obtener estadísticas de un usuario
   */
  async function getUserStats(req, res, next) {
    try {
      const { username } = req.params;

      if (!username) {
        return res.status(400).json({
          error: 'El usuario es obligatorio'
        });
      }

      const stats = userService.getUserGameStats(username);
      
      if (!stats) {
        return res.status(404).json({
          error: 'El usuario no tiene estadísticas registradas'
        });
      }

      // Convertir milisegundos a segundos para la respuesta
      res.status(200).json({
        ...stats,
        tiempoPromedio: (stats.tiempoPromedio / 1000).toFixed(2) + 's',
        tiempoTotal: (stats.tiempoTotal / 1000).toFixed(2) + 's'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/stats/ranking - Obtener ranking de usuarios
   */
  async function getStatsRanking(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const ranking = userService.getGameStatsRanking(limit);

      // Convertir milisegundos a segundos para la respuesta
      const rankingFormato = ranking.map(user => ({
        ...user,
        tiempoPromedio: (user.tiempoPromedio / 1000).toFixed(2) + 's',
        tiempoTotal: (user.tiempoTotal / 1000).toFixed(2) + 's'
      }));

      res.status(200).json(rankingFormato);
    } catch (error) {
      next(error);
    }
  }

  // Exponer la API pública del controlador
  return {
    create,
    getAll,
    getById,
    update,
    remove,
    handleLogin,
    handleLogout,
    getLoggedIn,
    recordGameSession,
    getUserStats,
    getStatsRanking
  };
}
