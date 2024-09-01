const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let jugadores = [
    { id: 1, nombre: 'Ryu', edad: 32, lugarProcedencia: 'Japón' },
    { id: 2, nombre: 'Chun-Li', edad: 29, lugarProcedencia: 'China' },
    { id: 3, nombre: 'Guile', edad: 35, lugarProcedencia: 'Estados Unidos' },
    { id: 4, nombre: 'Dhalsim', edad: 45, lugarProcedencia: 'India' },
    { id: 5, nombre: 'Blanka', edad: 32, lugarProcedencia: 'Brasil' },
];

app.get('/', (req, res) => {
    res.send(`
    <h1>Lista de usuarios</h1>
    <ul>
    ${jugadores
      .map(
        (jugador) => `<li>ID: ${jugador.id} | Nombre: ${jugador.nombre}
    </li>`
      )
      .join('')}
    </ul>
    <form action="/usuarios" method="post">
    <label for="nombre">Nombre</label>
    <input type="text" id="nombre" name="nombre" required>
    <button type="submit">Agregar usuario</button>
    </form>
    <a href="/usuarios">Usuarios JSON</a>
    `);
  });
  
  app.get('/jugadores', (req, res) => {
    res.json(jugadores);
  });
  
  app.post('/jugadores', (req, res) => {
    const nuevoJugador = {
      id: jugadores.length + 1,
      nombre: req.body.nombre,
    };
    jugadores.push(nuevoJugador);
    res.redirect('/');
  });

  app.get('/jugadores/:nombre', (req, res) => {
    const nombre = req.params.nombre;
    const jugador = jugadores.find(gamer => gamer.nombre.toLowerCase() === nombre.toLowerCase())
    jugador ? res.json(jugador) : res.status(404).json({ mensaje: 'Jugador no encontrado'})
})

app.listen(PORT, () => {
    console.log(`Express está escuchando en http://localhost:${PORT}/`);
  });
  