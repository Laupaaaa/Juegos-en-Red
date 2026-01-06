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

  // Exponer la API pública del controlador
  return {
    create,
    getAll,
    getById,
    update,
    remove,
    handleLogin,
    handleLogout,
    getLoggedIn
  };
}
