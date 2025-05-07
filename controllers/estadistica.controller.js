import { pool } from '../helpers/mysql-config.js'

// Obtener todas las estadísticas
const getEstadistica = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM estadistica');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener estadistica:', error);
    res.status(500).json({ error: 'Error al obtener las estadisticas' });
  }
};

// Obtener estadísticas por tipo
const getEstadisticaPorTipo = async (req, res) => {
  try {
    // CORRECCIÓN: Usar idTipo en lugar de id en los parámetros de ruta si así está definida la ruta
    // Asumiendo que la ruta es /api/estadistica/tipo/:idTipo
    const { idTipo } = req.params;
    const tipoIdNumerico = parseInt(idTipo, 10);

    if (isNaN(tipoIdNumerico)) {
        return res.status(400).json({ error: 'El idTipo debe ser un número.' });
    }
    console.log(`Buscando estadísticas con idTipo: ${tipoIdNumerico}`);

    // First, check if the tipo exists
    const [tipoExists] = await pool.query('SELECT * FROM tipoEstadistica WHERE id = ?', [tipoIdNumerico]);

    if (tipoExists.length === 0) {
      console.log(`No existe un tipo de estadística con id: ${tipoIdNumerico}`);
      // CORRECCIÓN: No necesitas llamar a getTiposEstadistica aquí, solo devuelve el error
      return res.status(404).json({
        error: `No existe un tipo de estadística con id: ${tipoIdNumerico}`
      });
    }

    // CORRECCIÓN: Query estadistica table filtering by idTipo
    const [rows] = await pool.query(
      'SELECT * FROM estadistica WHERE idTipo = ?',
      [tipoIdNumerico]
    );

    console.log(`Resultados encontrados para idTipo ${tipoIdNumerico}: ${rows.length}`);

    if (rows.length === 0) {
      // If no records found, return a more informative message
      return res.json({
        message: `No hay estadísticas registradas para el tipo con id: ${tipoIdNumerico} (${tipoExists[0].nombre})`,
        tipo: tipoExists[0]
      });
    }

    res.json(rows);
  } catch (error) {
    console.error('Error al obtener estadistica por tipo:', error);
    res.status(500).json({ error: 'Error al obtener las estadisticas por tipo' });
  }
};

// Helper function to get all tipos de estadistica
// Obtener todos los tipos de estadísticas
const getTiposEstadistica = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tipoEstadistica');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener tipos de estadística:', error);
    res.status(500).json({ error: 'Error al obtener los tipos de estadística' });
  }
};
// Obtener estadísticas de un usuario
// Obtener las ÚLTIMAS estadísticas de cada tipo para un usuario
const getEstadisticaUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const usuarioIdNumerico = parseInt(idUsuario, 10);
    if (isNaN(usuarioIdNumerico)) {
        return res.status(400).json({ error: 'idUsuario debe ser un número.' });
    }

    // MODIFICADO: Consulta para obtener la entrada con el MÁXIMO valor_INT para cada tipo de estadística de este usuario
    const query = `
      SELECT e.*
      FROM estadistica e
      INNER JOIN (
          SELECT idTipo, MAX(valor_INT) as MaxValorInt 
          FROM estadistica
          WHERE idUsuario = ? 
            AND valor_INT IS NOT NULL -- Asegurarse de que solo consideramos entradas con valor_INT
          GROUP BY idTipo
      ) AS maximas 
      ON e.idTipo = maximas.idTipo AND e.valor_INT = maximas.MaxValorInt
      WHERE e.idUsuario = ?
      ORDER BY e.idTipo ASC; 
    `;
    // Nota: Si hay múltiples entradas con el mismo valor_INT máximo para un tipo,
    // esta consulta podría devolverlas todas. Si solo quieres una (por ejemplo, la más reciente
    // entre las que tienen el valor máximo), la consulta necesitaría ser más compleja,
    // posiblemente usando ROW_NUMBER() si tu versión de MySQL lo soporta, o una subconsulta adicional.
    // Por ahora, esto devolverá todas las entradas que empaten en el valor máximo.

    const [rows] = await pool.query(query, [usuarioIdNumerico, usuarioIdNumerico]);

    // Opcional: Si quieres asegurarte de que solo devuelves UNA fila por idTipo,
    // incluso si hay empates en valor_INT, puedes procesar 'rows' aquí.
    // Podrías crear un Map para quedarte con la primera que encuentres por idTipo.
    const estadisticasUnicas = new Map();
    rows.forEach(row => {
        if (!estadisticasUnicas.has(row.idTipo)) {
            estadisticasUnicas.set(row.idTipo, row);
        }
        // Si quieres la más reciente en caso de empate, podrías comparar fechas aquí:
        // else {
        //     const existente = estadisticasUnicas.get(row.idTipo);
        //     if (new Date(row.fecha_hora) > new Date(existente.fecha_hora)) {
        //         estadisticasUnicas.set(row.idTipo, row);
        //     }
        // }
    });

    // Convertir el Map de nuevo a un array para la respuesta JSON
    const resultadoFinal = Array.from(estadisticasUnicas.values());


    res.json(resultadoFinal); // Devolver el array de las estadísticas con máximo valor_INT por tipo

  } catch (error) {
    console.error('Error al obtener las estadísticas con máximo valor del usuario:', error);
    res.status(500).json({ error: 'Error al obtener las estadísticas con máximo valor del usuario' });
  }
};

// Obtener estadísticas de un usuario por tipo
const getEstadisticaUsuarioPorTipo = async (req, res) => {
  try {
    const { idUsuario, idTipo } = req.params;
    const usuarioIdNumerico = parseInt(idUsuario, 10);
    const tipoIdNumerico = parseInt(idTipo, 10);

    if (isNaN(usuarioIdNumerico) || isNaN(tipoIdNumerico)) {
        return res.status(400).json({ error: 'idUsuario e idTipo deben ser números.' });
    }

    const [rows] = await pool.query(
      // MODIFICADO: Añadir ORDER BY y LIMIT 1
      `SELECT * 
       FROM estadistica 
       WHERE idUsuario = ? AND idTipo = ? 
       ORDER BY fecha_hora DESC 
       LIMIT 1`,
      [usuarioIdNumerico, tipoIdNumerico]
    );

    if (rows.length === 0) {
      // MODIFICADO: Devolver un objeto indicando que no hay datos, en lugar de 404
      // Esto permite al frontend manejar la ausencia de datos específicos.
      // Podríamos devolver un valor predeterminado o null según la necesidad del frontend.
      // Por ejemplo, para niveles completados (idTipo 2), podríamos devolver 0.
      let defaultValue = null;
      if (tipoIdNumerico === 2) { // Asumiendo que 2 es 'Niveles Completados'
          defaultValue = { valor_INT: 0 }; // O la estructura que espere el frontend
      }
      // Si necesitas devolver algo genérico o dejar que el frontend decida:
      // return res.status(200).json({ mensaje: 'No se encontraron estadísticas para este usuario y tipo', datos: null });
      // Por ahora, devolvemos un objeto con valor_INT 0 para el tipo 2, y null para otros.
       return res.status(200).json(defaultValue);
    }

    res.json(rows[0]); // Devolver solo el objeto más reciente
  } catch (error) {
    console.error('Error al obtener estadistica del usuario por tipo:', error);
    res.status(500).json({ error: 'Error al obtener las estadisticas del usuario por tipo' });
  }
};



// Obtener tiempo de juego de un usuario
const getTiempoJuegoUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const usuarioIdNumerico = parseInt(idUsuario, 10);
     if (isNaN(usuarioIdNumerico)) {
        return res.status(400).json({ error: 'idUsuario debe ser un número.' });
    }

    const [rows] = await pool.query(
      // MODIFICADO: Añadir ORDER BY y LIMIT 1
      `SELECT e.valor_TIME 
       FROM estadistica e 
       JOIN tipoEstadistica t ON e.idTipo = t.id 
       WHERE e.idUsuario = ? AND t.nombre = "Tiempo de juego total" 
       ORDER BY e.fecha_hora DESC 
       LIMIT 1`,
      [usuarioIdNumerico]
    );

    if (rows.length === 0 || rows[0].valor_TIME === null) { // Comprobar también si el valor es NULL
      // Devolver 0 si no hay registro o es NULL
      return res.json({ tiempoTotal: "00:00:00", tiempoFormateado: "0 h 0 m" });
    }

    // El valor es de tipo TIME en formato hh:mm:ss
    const tiempoString = rows[0].valor_TIME;

    // Extraer las horas del formato TIME
    const [horas, minutos, segundos] = tiempoString.split(':').map(Number);

    res.json({
      tiempoTotal: tiempoString,
      tiempoFormateado: `${horas} h ${minutos} m`
    });
  } catch (error) {
    console.error('Error al obtener tiempo de juego:', error);
    res.status(500).json({ error: 'Error al obtener el tiempo de juego' });
  }
};

// ------- NUEVA FUNCIÓN: Insertar o Actualizar Estadística (UPSERT) -------
const upsertEstadistica = async (req, res) => {
  // 1. Obtener idUsuario del token JWT (añadido por verifyJWT middleware)
  const idUsuario = req.user?.userId;
  if (!idUsuario) {
    return res.status(401).json({ error: 'Usuario no autenticado o ID no encontrado en el token.' });
  }

  // 2. Obtener idTipo y valor del cuerpo de la solicitud (request body)
  const { idTipo, valor } = req.body;

  // 3. Validaciones básicas
  if (idTipo === undefined || valor === undefined) {
    return res.status(400).json({ error: 'Faltan los campos requeridos: idTipo y valor.' });
  }

  const tipoIdNumerico = parseInt(idTipo, 10);
  if (isNaN(tipoIdNumerico)) {
      return res.status(400).json({ error: 'El idTipo debe ser un número.' });
  }

  console.log(`[UPSERT Estadistica] Recibido - Usuario ID: ${idUsuario}, Tipo ID: ${tipoIdNumerico}, Valor recibido: ${valor}`);

  try {
    // 4. Determinar la columna de valor y preparar valores para INSERT/UPDATE
    let valorIntAInsertar = null;
    let valorTimeAInsertar = null;
    let esTipoIncremental = false;

    // ID 1 es 'Tiempo de juego total' (TIME) - Reemplaza
    if (tipoIdNumerico === 1) {
        if (!/^\d{2}:\d{2}:\d{2}$/.test(valor)) {
           return res.status(400).json({ error: `El valor para idTipo ${tipoIdNumerico} (Tiempo de juego) debe estar en formato HH:MM:SS.` });
        }
        valorTimeAInsertar = valor; // Valor para INSERT y UPDATE (reemplazo)
    }
    // IDs 2 a 6 son INT - Incrementan
    else if (tipoIdNumerico >= 2 && tipoIdNumerico <= 6) {
        esTipoIncremental = true;
        const incremento = parseInt(valor, 10); // El valor recibido es el incremento (ej: 1)
        if (isNaN(incremento)) {
          return res.status(400).json({ error: `El valor para idTipo ${tipoIdNumerico} debe ser un número entero.` });
        }
        // Para INSERT, el valor inicial es el propio incremento.
        // Para UPDATE, usaremos este incremento en la consulta SQL.
        valorIntAInsertar = incremento;
    } else {
        // Validar si el idTipo existe en la BD aunque no lo manejemos aquí
         const [tipoExists] = await pool.query('SELECT id FROM tipoEstadistica WHERE id = ?', [tipoIdNumerico]);
         if (tipoExists.length === 0) {
             return res.status(404).json({ error: `El tipo de estadística con id ${tipoIdNumerico} no existe.` });
         }
         // Si existe pero no está en el rango 1-6
         return res.status(400).json({ error: `Tipo de estadística con id ${tipoIdNumerico} no manejado para inserción/actualización.` });
    }

    console.log(`[UPSERT Estadistica] Procesado - Usuario ID: ${idUsuario}, Tipo ID: ${tipoIdNumerico}, Valor INT (Insert/Incremento): ${valorIntAInsertar}, Valor TIME (Insert/Update): ${valorTimeAInsertar}`);

    // 5. Ejecutar la consulta UPSERT modificada para sumar en tipos incrementales
    // Se asume clave única (UNIQUE KEY) en (idUsuario, idTipo) en la tabla 'estadistica'
    const sql = `
      INSERT INTO estadistica (idUsuario, idTipo, valor_INT, valor_TIME, fecha_hora)
      VALUES (?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE
        valor_INT = IF(VALUES(idTipo) BETWEEN 2 AND 6, COALESCE(estadistica.valor_INT, 0) + VALUES(valor_INT), estadistica.valor_INT),
        valor_TIME = IF(VALUES(idTipo) = 1, VALUES(valor_TIME), estadistica.valor_TIME),
        fecha_hora = NOW()
    `;
    // Explicación del UPDATE:
    // - valor_INT: Si el idTipo insertado/actualizado está entre 2 y 6, suma el nuevo valor (VALUES(valor_INT), que es el incremento)
    //   al valor existente (estadistica.valor_INT). COALESCE maneja el caso donde el valor existente sea NULL (lo trata como 0).
    //   Si el idTipo no está en ese rango (es 1), simplemente mantiene el valor_INT existente (que debería ser NULL para el tipo 1).
    // - valor_TIME: Si el idTipo insertado/actualizado es 1, actualiza al nuevo valor (VALUES(valor_TIME)).
    //   Si no es 1, mantiene el valor_TIME existente (que debería ser NULL para los tipos 2-6).
    // - fecha_hora: Siempre se actualiza a la hora actual.

    const [result] = await pool.query(sql, [idUsuario, tipoIdNumerico, valorIntAInsertar, valorTimeAInsertar]);

    console.log('[UPSERT Estadistica] Resultado de la consulta:', result);

    // 6. Enviar respuesta
    if (result.affectedRows > 0) {
      // affectedRows = 1 para INSERT, 2 para UPDATE (en MySQL con ON DUPLICATE KEY UPDATE)
      const message = (result.affectedRows === 1 && result.insertId !== 0) ? 'Estadística creada/inicializada exitosamente.' : 'Estadística actualizada exitosamente.';
       // Podrías querer devolver el nuevo valor acumulado si fuera necesario
      res.status(result.insertId ? 201 : 200).json({ message });
    } else {
       // Esto podría ocurrir si el valor a actualizar es 0 para un tipo incremental y ya existe,
       // o si el valor de tiempo es idéntico al existente.
       console.warn('[UPSERT Estadistica] La consulta no afectó ninguna fila (posiblemente el valor no cambió o el incremento fue 0).', result);
       res.status(200).json({ message: 'No se realizaron cambios en la estadística (valor existente o incremento 0).' });
    }

  } catch (error) {
    // Manejo de errores específicos (ej: clave duplicada si no usas ON DUPLICATE KEY UPDATE correctamente)
    if (error.code === 'ER_DUP_ENTRY') {
         console.error('[UPSERT Estadistica] Error de clave duplicada. Esto no debería ocurrir con ON DUPLICATE KEY UPDATE bien configurado.', error);
         return res.status(409).json({ error: 'Conflicto al intentar guardar la estadística.' });
    }
    console.error('[UPSERT Estadistica] Error general al insertar/actualizar estadística:', error);
    res.status(500).json({ error: 'Error interno al guardar la estadística.' });
  }
};
// --------------------------------------------------------------------


// ------- NUEVA FUNCIÓN: Obtener Tiempo de Juego Semanal (para MonitoringCard1) -------
const getTiempoJuegoSemanalUsuario = async (req, res) => {
  // Obtener idUsuario del token JWT (añadido por verifyJWT middleware)
  // Usamos req.user.userId en lugar de req.params.idUsuario por seguridad,
  // así un usuario solo puede ver sus propios datos.
  const idUsuario = req.user?.userId;

  if (!idUsuario) {
    // Esto no debería ocurrir si verifyJWT funciona correctamente, pero es una buena verificación.
    return res.status(401).json({ error: 'Usuario no autenticado o ID no encontrado en el token.' });
  }

  console.log(`[Tiempo Semanal] Solicitud para usuario ID: ${idUsuario}`);

  try {
    // Consulta SQL para obtener la suma de segundos jugados por día de la semana actual (Lunes=0 a Domingo=6)
    // YEARWEEK(fecha, 1) considera que la semana empieza en Lunes.
    // COALESCE se usa por si duracion_segundos es NULL, calcularlo con TIMESTAMPDIFF.
    // Se filtran solo sesiones completadas (con fecha_fin o duracion_segundos).
    const sql = `
      SELECT
          WEEKDAY(fecha_inicio) AS dia_semana, -- 0=Lunes, 1=Martes, ..., 6=Domingo
          SUM(COALESCE(duracion_segundos, TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin))) AS segundos_totales_dia
      FROM
          sesion_juego
      WHERE
          idUsuario = ?
          AND YEARWEEK(fecha_inicio, 1) = YEARWEEK(CURDATE(), 1) -- Filtra por la semana actual (Lunes-Domingo)
          AND (duracion_segundos IS NOT NULL OR fecha_fin IS NOT NULL) -- Asegura que la sesión haya terminado
      GROUP BY
          dia_semana
      ORDER BY
          dia_semana;
    `;

    const [rows] = await pool.query(sql, [idUsuario]);

    // Inicializar un array para los 7 días de la semana (Lunes a Domingo) con 0 horas
    const horasSemanales = Array(7).fill(0);

    // Llenar el array con los datos obtenidos de la base de datos
    rows.forEach(row => {
      const diaIndex = row.dia_semana; // 0 para Lunes, ..., 6 para Domingo
      const segundos = parseInt(row.segundos_totales_dia, 10);

      if (diaIndex >= 0 && diaIndex < 7 && !isNaN(segundos)) {
        // Convertir segundos a horas (con decimales)
        horasSemanales[diaIndex] = segundos / 3600;
      }
    });

    console.log(`[Tiempo Semanal] Datos calculados para usuario ID ${idUsuario}:`, horasSemanales);

    // Devolver el array con las horas jugadas para cada día (Lun-Dom)
    res.json(horasSemanales);

  } catch (error) {
    console.error(`[Tiempo Semanal] Error al obtener tiempo de juego semanal para usuario ID ${idUsuario}:`, error);
    res.status(500).json({ error: 'Error interno al obtener el tiempo de juego semanal.' });
  }
};
// --------------------------------------------------------------------


// ------- NUEVA FUNCIÓN: Obtener Monedas Gastadas por Nivel (para MonitoringCard2) -------
const getMonedasGastadasPorNivelUsuario = async (req, res) => {
  // Obtener idUsuario del token JWT (añadido por verifyJWT middleware)
  const idUsuario = req.user?.userId;

  if (!idUsuario) {
    return res.status(401).json({ error: 'Usuario no autenticado o ID no encontrado en el token.' });
  }

  console.log(`[Monedas Nivel] Solicitud para usuario ID: ${idUsuario}`);

  try {
    // --- CORRECCIÓN: Ya no necesitamos determinar maxLevel dinámicamente ---
    // El frontend espera explícitamente 13 niveles.

    // Paso 1: Consultar las monedas gastadas por nivel para el usuario
    // --- CORRECCIÓN: Cambiar alias SQL a totalMonedasGastadas ---
    const sql = `
      SELECT
          idNivel,
          SUM(cantidad) AS totalMonedasGastadas 
      FROM
          transaccion_monedas
      WHERE
          idUsuario = ?
          AND idNivel IS NOT NULL 
          AND idNivel BETWEEN 1 AND 13 -- Opcional: Filtrar ya en la consulta por los niveles relevantes
      GROUP BY
          idNivel
      ORDER BY
          idNivel;
    `;

    const [rows] = await pool.query(sql, [idUsuario]);

    // Paso 2: Crear un mapa para almacenar los resultados de la consulta
    const monedasPorNivelMap = new Map();
    rows.forEach(row => {
      // Asegurarse de que idNivel es un número y totalMonedasGastadas existe
      if (row.idNivel != null && row.totalMonedasGastadas != null) {
         // Convertir totalMonedasGastadas a número (SUM puede devolver string o number)
         const monedas = parseInt(row.totalMonedasGastadas, 10);
         if (!isNaN(monedas)) {
            monedasPorNivelMap.set(row.idNivel, monedas);
         } else {
             // Si la conversión falla, registrar advertencia y usar 0
             console.warn(`[Monedas Nivel] Valor inválido para totalMonedasGastadas en nivel ${row.idNivel}: ${row.totalMonedasGastadas}. Usando 0.`);
             monedasPorNivelMap.set(row.idNivel, 0);
         }
      } else {
          console.warn(`[Monedas Nivel] Fila inválida recibida de la BD:`, row);
      }
    });

    // Paso 3: Crear el array final con 13 niveles, usando el mapa o 0 por defecto
    // --- CORRECCIÓN: Siempre generar 13 niveles ---
    const numeroDeNiveles = 13; // Definido explícitamente
    const resultadoFinal = Array.from({ length: numeroDeNiveles }, (_, i) => {
      const nivel = i + 1;
      return {
        nivel: nivel,
        // Obtener del mapa o devolver 0 si no existe entrada para ese nivel
        totalMonedasGastadas: monedasPorNivelMap.get(nivel) || 0
      };
    });

    console.log(`[Monedas Nivel] Datos enviados para usuario ID ${idUsuario}:`, resultadoFinal);

    // Devolver siempre un array (puede estar lleno de objetos con valor 0 si no hay datos)
    res.json(resultadoFinal);

  } catch (error) {
    console.error(`[Monedas Nivel] Error al obtener monedas gastadas por nivel para usuario ID ${idUsuario}:`, error);
    // --- CORRECCIÓN: Devolver array vacío en caso de error grave ---
    // O podrías devolver un array de 13 niveles con 0 monedas si prefieres que el gráfico no muestre error
    // Por consistencia con la petición original, devolvemos array vacío en error.
    res.status(500).json([]); // Devolver array vacío en lugar de objeto de error
  }
};

// --- NUEVA FUNCIÓN: Registrar Gasto de Monedas por Nivel ---
const registrarGastoMonedasPorNivel = async (req, res) => {
  // idUsuario se obtiene del token JWT verificado por el middleware
  const idUsuario = req.user?.userId;
  const { idNivel, cantidad } = req.body; // Obtener del cuerpo de la solicitud

  // Validaciones básicas
  if (!idUsuario) {
    return res.status(401).json({ error: 'Usuario no autenticado.' });
  }
  if (typeof idNivel !== 'number' || idNivel <= 0) {
    return res.status(400).json({ error: 'El campo "idNivel" es requerido y debe ser un número positivo.' });
  }
  if (typeof cantidad !== 'number' || cantidad <= 0) {
    return res.status(400).json({ error: 'El campo "cantidad" es requerido y debe ser un número positivo.' });
  }

  console.log(`[Gasto Monedas] Registrando gasto para Usuario ID: ${idUsuario}, Nivel: ${idNivel}, Cantidad: ${cantidad}`);

  try {
    const sql = `
      INSERT INTO transaccion_monedas (idUsuario, idNivel, cantidad, fecha_hora)
      VALUES (?, ?, ?, NOW())
    `;
    const [result] = await pool.query(sql, [idUsuario, idNivel, cantidad]);

    if (result.affectedRows > 0) {
      console.log(`[Gasto Monedas] Gasto registrado exitosamente. ID de transacción: ${result.insertId}`);
      res.status(201).json({ message: 'Gasto de monedas registrado correctamente.' });
    } else {
      console.error('[Gasto Monedas] No se insertó ninguna fila al registrar el gasto.');
      res.status(500).json({ error: 'Error al registrar el gasto de monedas.' });
    }
  } catch (error) {
    console.error(`[Gasto Monedas] Error al insertar en transaccion_monedas para Usuario ID ${idUsuario}:`, error);
    res.status(500).json({ error: 'Error interno del servidor al registrar el gasto.' });
  }
};
// --- FIN NUEVA FUNCIÓN ---

// ------- NUEVAS FUNCIONES: Manejo de Sesiones de Juego -------

// Iniciar una nueva sesión de juego
const iniciarSesionJuego = async (req, res) => {
  const idUsuario = req.user?.userId;
  if (!idUsuario) {
    return res.status(401).json({ error: 'Usuario no autenticado.' });
  }

  try {
    const fechaInicio = new Date(); // Hora actual del servidor
    const [result] = await pool.query(
      'INSERT INTO sesion_juego (idUsuario, fecha_inicio) VALUES (?, ?)',
      [idUsuario, fechaInicio]
    );

    const sesionId = result.insertId;
    console.log(`[Sesion Juego] Iniciada sesión ${sesionId} para usuario ${idUsuario}`);
    res.status(201).json({ sesionId: sesionId, fechaInicio: fechaInicio });

  } catch (error) {
    console.error('Error al iniciar sesión de juego:', error);
    res.status(500).json({ error: 'Error interno al iniciar la sesión de juego.' });
  }
};

// Finalizar una sesión de juego existente
const finalizarSesionJuego = async (req, res) => {
  const idUsuario = req.user?.userId;
  if (!idUsuario) {
    return res.status(401).json({ error: 'Usuario no autenticado.' });
  }

  const { sesionId } = req.body; // Recibimos el ID de la sesión a finalizar

  if (!sesionId) {
    return res.status(400).json({ error: 'Falta el ID de la sesión (sesionId).' });
  }

  try {
    const fechaFin = new Date(); // Hora actual del servidor

    // 1. Obtener la fecha de inicio para calcular la duración
    const [sesiones] = await pool.query(
      'SELECT fecha_inicio FROM sesion_juego WHERE id = ? AND idUsuario = ? AND fecha_fin IS NULL',
      [sesionId, idUsuario]
    );

    if (sesiones.length === 0) {
      return res.status(404).json({ error: 'Sesión no encontrada, ya finalizada o no pertenece al usuario.' });
    }

    const fechaInicio = new Date(sesiones[0].fecha_inicio);
    const duracionSegundos = Math.round((fechaFin.getTime() - fechaInicio.getTime()) / 1000);

    // 2. Actualizar la sesión con la fecha de fin y la duración
    const [result] = await pool.query(
      'UPDATE sesion_juego SET fecha_fin = ?, duracion_segundos = ? WHERE id = ? AND idUsuario = ?',
      [fechaFin, duracionSegundos, sesionId, idUsuario]
    );

    if (result.affectedRows === 0) {
       // Esto no debería ocurrir si la consulta SELECT funcionó, pero es una doble verificación
       return res.status(404).json({ error: 'No se pudo actualizar la sesión.' });
    }

    console.log(`[Sesion Juego] Finalizada sesión ${sesionId} para usuario ${idUsuario}. Duración: ${duracionSegundos}s`);
    res.status(200).json({ mensaje: 'Sesión finalizada correctamente.', duracionSegundos: duracionSegundos });

  } catch (error) {
    console.error('Error al finalizar sesión de juego:', error);
    res.status(500).json({ error: 'Error interno al finalizar la sesión de juego.' });
  }
};

// --- Exportar TODO ---
export {
  getEstadistica,
  getEstadisticaPorTipo,
  getTiposEstadistica,
  getEstadisticaUsuario,
  getEstadisticaUsuarioPorTipo,
  getTiempoJuegoUsuario,
  upsertEstadistica,
  getTiempoJuegoSemanalUsuario, // Ya existente
  getMonedasGastadasPorNivelUsuario, // Ya existente
  registrarGastoMonedasPorNivel, // Ya existente
  iniciarSesionJuego, // <-- Añadido
  finalizarSesionJuego // <-- Añadido
};