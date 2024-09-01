const express = require('express');
const app = express();
const PORT = 3000;

//Middlewares para analizar el cuerpo de la solicitud
app.use(express.json());// analiza el cuerpo de las solicitudes entrantes con formato JSON
app.use(express.urlencoded({ extended: true }));//Middleware que analiza las solicitudes con datos codificados en URL (ejem, form). 
//extended: true permite la anidación de objetos.

//Array de objetos (base de datos)
let jugadores = [
    { id: 1, nombre: 'Ryu', edad: 32, lugarProcedencia: 'Japón' },
    { id: 2, nombre: 'Chun-Li', edad: 29, lugarProcedencia: 'China' },
    { id: 3, nombre: 'Guile', edad: 35, lugarProcedencia: 'Estados Unidos' },
    { id: 4, nombre: 'Dhalsim', edad: 45, lugarProcedencia: 'India' },
    { id: 5, nombre: 'Blanka', edad: 32, lugarProcedencia: 'Brasil' },
];

// Ruta principal que muestra la lista de jugadores
app.get('/', (req, res) => {
    res.send(`
    <h1>Lista de usuarios</h1>
    <ul>
    ${jugadores.map((jugador) => //Iterar sobre el array de jugadores
        `
        <li>
            ID: ${jugador.id} 
            | Nombre: ${jugador.nombre}
            | Edad: ${jugador.edad}
            | Lugar de procedencia: ${jugador.lugarProcedencia}          
        </li>
        `
      )
      .join('')}
    </ul>
    <a href="/jugadores">Jugadores JSON</a>
    `);
  });

// Ruta para devolver la lista completa de jugadores en formato JSON
app.get('/jugadores', (req, res) => {
    res.json(jugadores);
  });
  
  //Ruta que maneja las solicitudes POST para agregar un nuevo jugador.
  app.post('/jugadores', (req, res) => {
    const nuevoJugador = {
      id: jugadores.length + 1,// Genera un nuevo ID basado en la longitud del array
      nombre: req.body.nombre,// Asigna el nombre recibido en el cuerpo de la solicitud
      edad: req.body.edad,// Asigna la edad recibida en el cuerpo de la solicitud
      lugarProcedencia: req.body.lugarProcedencia// Asigna el lugar de procedencia recibido en el cuerpo de la solicitud
    };
    jugadores.push(nuevoJugador);// Agrega el nuevo jugador al array
    res.redirect('/');// Redirige a la página principal
  });

  // Ruta para obtener un jugador por nombre
  app.get('/jugadores/:nombre', (req, res) => {
    const nombre = req.params.nombre.toLowerCase();// Convierte el nombre a minúsculas para hacer la búsqueda
    const jugador = jugadores.find(gamer => gamer.nombre.toLowerCase() === nombre)// Busca el jugador por nombre
    jugador ? res.json(jugador) : res.status(404).json({ mensaje: 'Jugador no encontrado'})// Responde con el jugador encontrado o con un error 404
})

// Ruta para actualizar un jugador por nombre
  app.put('/jugadores/:nombre', (req, res) => {
    const nombre = req.params.nombre.toLowerCase();// Convierte el nombre a minúsculas para hacer la búsqueda
    const index = jugadores.findIndex(gamer => gamer.nombre.toLowerCase() === nombre)// Encuentra el índice del jugador
    // Si el jugador existe, actualiza la información; si no, responde con un error 404
    index !== -1 ? (
        jugadores[index] = {
            ...jugadores[index], // Se mantienen los datos actuales
            nombre: req.body.nombre || jugadores[index].nombre,// Actualiza el nombre si se proporciona
            edad: req.body.edad || jugadores[index].edad,// Actualiza la edad si se proporciona
            lugarProcedencia: req.body.lugarProcedencia || jugadores[index].lugarProcedencia,// Actualiza el lugar de procedencia si se proporciona
        },
        res.json(jugadores[index])// Devuelve el jugador actualizado
    ) :
        res.status(404).json({ mensaje: 'Jugador no encontrado' });// Si no se encuentra, responde con un error 404
})

// Ruta para eliminar un jugador por nombre
  app.delete('/jugadores/:nombre', (req,res) => {
    const nombre = req.params.nombre.toLowerCase();// Convierte el nombre a minúsculas para hacer la búsqueda
    const jugadoresFiltrados = jugadores.filter(gamer => gamer.nombre.toLowerCase() !== nombre);// Filtra el array para eliminar el jugador
    // Si se elimina el jugador, actualiza el array; si no, responde con un error 404
    jugadoresFiltrados.length !== jugadores.length 
    ? (jugadores = jugadoresFiltrados,// Actualiza el array de jugadores
    res.json({ mensaje: 'Jugador eliminado correctamente' })// Responde con un mensaje de éxito
    ) :
    res.status(404).json({ mensaje: 'Jugador no encontrado' });// Si no se encuentra, responde con un error 404
  })

  // Inicia el servidor en el puerto especificado
app.listen(PORT, () => {
    console.log(`Express está escuchando en http://localhost:${PORT}/`);
  });
  