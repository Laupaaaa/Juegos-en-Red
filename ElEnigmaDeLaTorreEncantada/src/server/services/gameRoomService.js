/**
 * Game Room service - manages active game rooms and game state
 */
export function createGameRoomService() {
  const rooms = new Map(); // roomId -> room data
  const roomsByCode = new Map(); // roomCode -> roomId
  let nextRoomId = 1;



function generateRoomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code;
    do {
      code = '';
      for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length)); // seleccionar un caracter aleatorio
      }
    } while (roomsByCode.has(code)); // asegurar que el código es único

    if(code !== null){
      console.log("Código de sala generado: " + code);
    }
    return code;
  }

  /**
   * Create a new game room with two players
   * @param {WebSocket} player1Ws - Player 1's WebSocket
   * @returns {object} Room ID and room code
   */
  function createRoom(player1Ws) {
    const roomId = `room_${nextRoomId++}`;
    const code = generateRoomCode();

    const room = {
      id: roomId,
      player1: {
        ws: null,
        score: 0,
        state: null,
        username: null
      },
      player2: {
        ws: null,
        score: 0,
        state: null,
        username: null
      },
      active: true,
      ballActive: true,
      code: code,
      status: 'waiting'
    };

    rooms.set(roomId, room);
    roomsByCode.set(code, roomId);
    // Initial player states
    // room.player1.state = { x: 50, y: 400, vx: 0, vy: 0 };
    // room.player2.state = { x: 950, y: 400, vx: 0, vy: 0 };

    const joinResult = joinRoom(code, player1Ws, true); //El creador se une automaticamente a la sala
    // Store room ID on WebSocket for quick lookup
    // player1Ws.roomId = roomId;
    // player2Ws.roomId = roomId;

    if (!joinResult.success) {
      console.error('Error al unir al creador a la sala:', joinResult.message);
      rooms.delete(roomId);
      roomsByCode.delete(code);
      return null;
    }
    return { roomId: roomId, code: code, success: true  };
  }

  function findRoomByCode(code) {
    const roomCode = roomsByCode.get(code.toUpperCase());
    if (!roomCode) return null;
    return rooms.get(roomCode);
  }

  function findRoomById(roomId) {
    return rooms.get(roomId);
  }

  function joinRoom(code, playerWs, silent = false) {
    const room = findRoomByCode(code);
    if (!room || !room.active) return {success: false, message: 'Sala no encontrada o inactiva'};
    if (room.status !== 'waiting') return {success: false, message: 'La partida ya ha comenzado'};


    if (!room.player1.ws) {
      room.player1.ws = playerWs;
      room.player1.state = {x:50 , y:400, vx: 0, vy: 0};
      playerWs.roomId = room.id;

      console.log(`Jugador 1 se ha unido a la sala ${room.id}`);

      return {success: true,
              playerNumber: 1,
              message: 'Te has unido como Jugador 1',
              room: room};

    } else if (!room.player2.ws) {
      room.player2.ws = playerWs;
      room.player2.state = {x:950 , y:400, vx: 0, vy: 0};
      playerWs.roomId = room.id;

      room.status = 'playing'; 

      console.log(`Jugador 2 se ha unido a la sala ${room.id}. La partida comienza.`);

      if(!silent){
        
        room.player1.ws.send(JSON.stringify({
          type: 'startGame',
          roomId: room.id,
          role: 'player1',
          roomCode: room.code,
          message: 'La partida ha comenzado'
        }));

        room.player2.ws.send(JSON.stringify({
          type: 'startGame',
          roomId: room.id,
          role: 'player2',
          roomCode: room.code,
          message: 'La partida ha comenzado'
        }));
    }

      return {success: true,
              playerNumber: 2, 
              message: 'Te has unido como Jugador 2', 
              code: room.code,
              id: room.id,
              room: room};

    } else {
      return {success: false, message: 'La sala está llena'};
    }
  }

  function leaveRoom(playerWs) {
    const roomId = playerWs.roomId;
    if (!roomId) return false;

    const room = rooms.get(roomId);
    if (!room) return false;

    if (room.player1.ws === playerWs) {
      room.player1.ws = null;
      room.player1.state = null;
    } else if (room.player2.ws === playerWs) { 
      room.player2.ws = null;
      room.player2.state = null;
    }
    playerWs.roomId = null;

    // If both players have left, delete the room
    if (!room.player1.ws && !room.player2.ws) {
      room.active = false;
      rooms.delete(roomId);
      roomsByCode.delete(room.code);
    } else {
      // Notify remaining player that opponent has left
      broadcastToRoom(roomId, {
        type: 'playerDisconnected',
        message: 'Tu compañero ha abandonado la partida'
      });
    } 
    return true;
  }

  

  function broadcastToRoom(roomId, message) {
    const room = rooms.get(roomId);
    if (!room) return;

    [room.player1.ws, room.player2.ws].forEach(ws => {
      if (ws && ws.readyState === 1) { // WebSocket.OPEN
        ws.send(JSON.stringify(message));
      }
    });
  }

  function getRoomInfo(code) {
    const room = findRoomByCode(code);
    if (!room) return null;

    return {
      id: room.id,
      code: room.code,
      status: room.status,
      players: {
        player1: room.player1.ws ? true : false,
        player2: room.player2.ws ? true : false
      }
    };
  }

  function startGame(roomId) {
    const room = rooms.get(roomId);
    if (!room || !room.active) return {success: false, message: 'Sala no encontrada o inactiva'};
    if (room.status !== 'waiting') return {success: false, message: 'La partida ya ha comenzado o finalizado'};
    room.status = 'playing';
    broadcastToRoom(roomId, {
      type: 'startGame',
      roomId: roomId,
      roomCode: room.code,
      message: 'La partida ha comenzado'
    });
    return {success: true};
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
    const roomId = ws.roomId; // obtener el id de la sala del jugador que usa el caldero
    if (!roomId) return; 
    const room = rooms.get(roomId);
    if (!room || !room.active) return;
    
    const inventario = data.inventario; 
    let resultado = {};
    let elemRecogidos = inventario.filter(elem => elem === true); // crear un segundo array con unicamente los elementos recogidos
    if (elemRecogidos.length === 3 || elemRecogidos.length === 4) {
      if (inventario[3] && inventario[5] && inventario[7]) { // comprobar que esos elementos recogidos son las pociones verde, azul y naranja 
        console.log("Poción de disminuir tamaño creada");
        resultado = { type: 'usarCaldero', exito: true };
      }
    } else {
      if (inventario.length < 3) console.log('Te faltan ingredientes para crear una poción');
      else if (inventario.length > 4) console.log('Tienes demasiados ingredientes en el inventario');
      else console.log('No tienes los ingredientes necesarios para crear la poción de disminuir tamaño');
      let aleatorio = Math.random()  < 0.5 ? 1 : 2; // generar un número aleatorio entre 1 y 2 para elegir que jugador recibe daño
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
   * Handle force field button press from a player
   * @param {WebSocket} ws - Player's WebSocket
   * @param {object} data - Button data
   */
  function handleBotonCampoFuerza(ws, data) {
    const roomId = ws.roomId;
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    // Avisar a ambos jugadores que se ha pulsado un boton 
    const resultado = { type: 'botonCF', b: data.boton };
    room.player1.ws.send(JSON.stringify(resultado));
    room.player2.ws.send(JSON.stringify(resultado));
  }

  /**
   * Handle force field deactivation from a player
   * @param {WebSocket} ws - Player's WebSocket
   */
  function handleDesactivarCampoFuerza(ws) {
    const roomId = ws.roomId;
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    // Avisar al oponente que se ha desactivado el campo de fuerza
    const opponent = room.player1.ws === ws ? room.player2.ws : room.player1.ws;
    if (opponent.readyState === 1) { // WebSocket.OPEN
      opponent.send(JSON.stringify({
        type: 'desactivarCF'
      }));
    }
  }

  /**
   * Handle 'L' key press from a player
   * @param {WebSocket} ws - Player's WebSocket
   */
  function handleLPulsada(ws) {
    const roomId = ws.roomId;
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    // Avisar al otro jugador que se ha pulsado la L
    const opponent = room.player1.ws === ws ? room.player2.ws : room.player1.ws;
    if (opponent.readyState === 1) { // WebSocket.OPEN
      opponent.send(JSON.stringify({
        type: 'lOponente',
        valor: true
      }));
    }
  }

  /**
   * Handle player reaching the final door
   * @param {WebSocket} ws - Player's WebSocket
   * @param {object} data - Jugador data
   */
  function handlePuertaFinal(ws, data) {
    const roomId = ws.roomId;
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    // generar un jugador aleatorio que será el que pueda elegir
      let aleatorio = Math.random()  < 0.5 ? 1 : 2; 
    // Avisar a ambos jugadores que un jugador ha llegado a la puerta final
    const resultado = { type: 'puertaFinal', jugador: data.player, desactivado: data.desactivado, ganador: aleatorio};
    room.player1.ws.send(JSON.stringify(resultado));
    room.player2.ws.send(JSON.stringify(resultado));
  }

  function handleEscenaFinal(ws, data){
    console.log(" escena final"); 
    const roomId = ws.roomId;
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    // avisar a ambos jugadores que tienen que cambiar de escena
    const resultado = { type: 'final', escena: data.escena};
    room.player1.ws.send(JSON.stringify(resultado));
    room.player2.ws.send(JSON.stringify(resultado));
  }

  /**
   * Handle player changing size
   * @param {WebSocket} ws - Player's WebSocket
   * @param {object} data - Jugador data
   */
  function handleSize (ws, data){
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    // avisar a ambos jugadores que tienen que cambiar su tamaño
    const resultado = { type: 'size', estado:data.estado};
    room.player1.ws.send(JSON.stringify(resultado));
    room.player2.ws.send(JSON.stringify(resultado));
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
      const secondPlayer = room.player1.ws === ws ? room.player2.ws : room.player1.ws;    

      if(!secondPlayer){
        console.log(`Room ${room.id}: disconnect with no opponent.`);
        return;
      }

      if (secondPlayer.readyState === 1) { // WebSocket.OPEN
        secondPlayer.send(JSON.stringify({
          type: 'playerDisconnected'
        }));
      }
    }

    // Clean up room
    room.active = false;
    roomsByCode.delete(room.code);
    rooms.delete(roomId);
  }

  /**
   * Get number of active rooms
   * @returns {number} Number of active rooms
   */
  function getActiveRoomCount() {
    return Array.from(rooms.values()).filter(room => room.active).length;
  }

  function handleSetUsername(ws, data) {
    const { username, playerRole } = data;
    
    for (const room of rooms.values()) {
      if (room.active) {
        const isPlayer1 = room.player1.ws === ws;
        const isPlayer2 = room.player2.ws === ws;
        
        if (isPlayer1) {
          room.player1.username = username;
        } else if (isPlayer2) {
          room.player2.username = username;
        } else {
          continue;
        }

        if (room.player1.username && room.player2.username) {
          if (room.player1.ws && room.player1.ws.readyState === 1) {
            room.player1.ws.send(JSON.stringify({
              type: 'usernames',
              player1: room.player1.username,
              player2: room.player2.username
            }));
          }
          if (room.player2.ws && room.player2.ws.readyState === 1) {
            room.player2.ws.send(JSON.stringify({
              type: 'usernames',
              player1: room.player1.username,
              player2: room.player2.username
            }));
          }
        }
        break;
      }
    }
  }


  return {
    findRoomById,
    findRoomByCode,
    joinRoom,
    leaveRoom,
    startGame,
    getRoomInfo,
    createRoom,
    handlePlayerMove,
    handleDaño,
    handleCaldero,
    handleInventario, 
    handleBotonCampoFuerza,
    handleDesactivarCampoFuerza,
    handleLPulsada,
    handlePuertaFinal,
    handleEscenaFinal, 
    handleSize, 
    handleDisconnect,
    getActiveRoomCount,
    handleSetUsername
  };
}
