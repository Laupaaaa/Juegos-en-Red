/**
 * Game Room service - manages active game rooms and game state
 */
export function createGameRoomService() {
  const rooms = new Map(); // roomId -> room data
  let nextRoomId = 1;

  /**
   * Create a new game room with two players
   * @param {WebSocket} player1Ws - Player 1's WebSocket
   * @param {WebSocket} player2Ws - Player 2's WebSocket
   * @returns {string} Room ID
   */
  function createRoom(player1Ws, player2Ws) {
    const roomId = `room_${nextRoomId++}`;

    const room = {
      id: roomId,
      player1: {
        ws: player1Ws,
        score: 0
      },
      player2: {
        ws: player2Ws,
        score: 0
      },
      active: true,
      ballActive: true // Track if ball is in play (prevents duplicate goals)
    };

    rooms.set(roomId, room);
    room.player1.state = { x: 50, y: 400, vx: 0, vy: 0 };
    room.player2.state = { x: 950, y: 400, vx: 0, vy: 0 };

    // Store room ID on WebSocket for quick lookup
    player1Ws.roomId = roomId;
    player2Ws.roomId = roomId;

    return roomId;
  }

  
  /**
   * Handle player movement from a player
   * @param {WebSocket} ws - Player's WebSocket
   * @param {object} data - posicion del jugador
   */
  function handlePlayerMove(ws, data) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    
    const player = room.player1.ws === ws ? room.player1 : room.player2;
    player.state.y = data.y;
    player.state.x = data.x;

    player.state.direction=data.direction;
    player.state.isMoving=data.isMoving;
    player.state.flipX=data.flipX;

    // Relay to the other player
    const opponent = room.player1.ws === ws ? room.player2.ws : room.player1.ws;

    if (opponent.readyState === 1) { // WebSocket.OPEN
      opponent.send(JSON.stringify({
        type: 'movimientoJugador',
        player: player === room.player1 ? 'player1' : 'player2',
        x: data.x,    
        y: data.y,
        direction: data.direction,
        isMoving: data.isMoving,
        flipX: data.flipX 
      }));
    }
  }

  /**
   * Handle damage event from a player
   * @param {WebSocket} ws - Player's WebSocket
   * @param {object} data - Damage data
   */
  function handleDaño(ws, data) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    // conseguir el jugador que ha recibido el daño del data y actualizar su vida
    const herido = data.player === room.player1 ? room.player1 : room.player2;
    herido.state.vida = data.vida;

    // Reenviar el daño al oponente
    const opponent = room.player1.ws === ws ? room.player2.ws : room.player1.ws;
    if (opponent.readyState === 1) { // WebSocket.OPEN
      opponent.send(JSON.stringify({
        type: 'daño',
        player: data.player,
        vida: data.vida
      }));
    }
  }


  /** 
   * Handle caldero usage event from a player
   * @param {WebSocket} ws - Player's WebSocket
   * @param {object} data - Inventario data
   */ 
  function handleCaldero(ws, data) {
    const roomId = ws.roomId;
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room || !room.active) return;
    
    const inventario = data.inventario;
    let resultado = {};

    if (inventario[3] && inventario[5] && inventario[7]) { // comprobar que esos elementos recogidos son las pociones verde, azul y naranja 
      console.log("Poción de disminuir tamaño creada");
      resultado = { type: 'usarCaldero', exito: true };

    } else {
      console.log("No tienes las pociones necesarias para crear la poción de disminuir tamaño");

      let aleatorio = Math.random()  < 0.5 ? 1 : 2; // generar un número aleatorio entre 1 y 2 para elegir que jugador recibe daño
      const jugDañado = aleatorio === 1 ? room.player1 : room.player2;
      resultado = { type: 'usarCaldero', exito: false, jugadorDañado: aleatorio};
    }

    // broadcasta a los dos jugadores con el resultado de usar el caldero
    room.player1.ws.send(JSON.stringify(resultado));
    room.player2.ws.send(JSON.stringify(resultado));

  }

  /**
   * Handle inventory update from a player
   * @param {WebSocket} ws - Player's WebSocket
   * @param {object} data - Inventario data
   */
  function handleInventario(ws, data) {
    const roomId = ws.roomId;
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    // Avisar al otro jugador que se ha actualizdo su inventario
    const opponent = room.player1.ws === ws ? room.player2.ws : room.player1.ws;
    if (opponent.readyState === 1) { // WebSocket.OPEN
      opponent.send(JSON.stringify({
        type: 'Inventario',
        inventario: data.inventario
      }));
    }
  }

  /**
   * Handle player disconnection
   * @param {WebSocket} ws - Disconnected player's WebSocket
   */
  function handleDisconnect(ws) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    // Only notify the other player if the game is still active
    // If the game already ended (room.active = false), don't send disconnect message
    if (room.active) {
      const opponent = room.player1.ws === ws ? room.player2.ws : room.player1.ws;

      if (opponent.readyState === 1) { // WebSocket.OPEN
        opponent.send(JSON.stringify({
          type: 'playerDisconnected'
        }));
      }
    }

    // Clean up room
    room.active = false;
    rooms.delete(roomId);
  }

  /**
   * Get number of active rooms
   * @returns {number} Number of active rooms
   */
  function getActiveRoomCount() {
    return Array.from(rooms.values()).filter(room => room.active).length;
  }

  return {
    createRoom,
    handlePlayerMove,
    handleDaño,
    handleCaldero,
    handleInventario, 
    handleDisconnect,
    getActiveRoomCount
  };
}
