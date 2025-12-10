/**
 * Servicio de gestión de usuarios usando closures
 * Este servicio mantiene el estado de los usuarios en memoria
 * y proporciona métodos para realizar operaciones CRUD
 */

export function createUserService() {
  // Estado privado: almacén de usuarios
  let users = [];
  let nextId = 1;

  /**
   * Crea un nuevo usuario
   * @param {Object} userData - {email, name, avatar, level}
   * @returns {Object} Usuario creado
   */
  function createUser(userData) {
    // 1. Validar que el email no exista ya
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // 2. Crear objeto usuario con id único y createdAt
    const newUser = {
      id: String(nextId),
      email: userData.email,
      name: userData.name,
      avatar: userData.avatar || '',
      level: userData.level || 1,
      createdAt: new Date().toISOString()
    };

    // 3. Agregar a la lista de usuarios
    users.push(newUser);

    // 4. Incrementar nextId
    nextId++;

    // 5. Retornar el usuario creado
    return newUser;
  }

  /**
   * Obtiene todos los usuarios
   * @returns {Array} Array de usuarios
   */
  function getAllUsers() {
    // Retornar una copia del array de usuarios
    return users.map(user => ({...user}));  //para evitar modificaciones, se crea uno nuevo con todas las propiedades y usuarios
  }

  /**
   * Busca un usuario por ID
   * @param {string} id - ID del usuario
   * @returns {Object|null} Usuario encontrado o null
   */
  function getUserById(id) {
    const user = users.find(u => u.id === id);
    return user || null;
  }

  /**
   * Busca un usuario por email
   * @param {string} email - Email del usuario
   * @returns {Object|null} Usuario encontrado o null
   */
  function getUserByEmail(email) {
    // Buscar y retornar el usuario por email, o null si no existe
    // IMPORTANTE: Esta función será usada por el chat para verificar emails
    const user = users.find(u => u.email === email);
    return user || null;  
  }

  /**
   * Actualiza un usuario
   * @param {string} id - ID del usuario
   * @param {Object} updates - Campos a actualizar
   * @returns {Object|null} Usuario actualizado o null si no existe
   */
  function updateUser(id, updates) {
    // 1. Buscar el usuario por id
    const user = users.find(u => u.id === id); 
    // 2. Si no existe, retornar null
    if(!user) return null; 
    // 3. Actualizar solo los campos permitidos (name, avatar, level)
    const {name, avatar, level} = updates; 
    // 4. NO permitir actualizar id, email, o createdAt
    if (name !== undefined) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (level !== undefined) user.level = level; 
    // 5. Retornar el usuario actualizado
    return user; 
  }

  /**
   * Elimina un usuario
   * @param {string} id - ID del usuario
   * @returns {boolean} true si se eliminó, false si no existía
   */
  function deleteUser(id) {
    // 1. Buscar el índice del usuario
    const user = users.findIndex(u => u.id === id);
    // 2. Si existe, eliminarlo del array
    if(user !== -1) {
      users.splice(u, 1);
      return true
    }
    // 3. Retornar true si se eliminó, false si no existía
    return false
  }

  // Exponer la API pública del servicio
  return {
    createUser,
    getAllUsers,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser
  };
}
