/* SERVER HISTORIAL */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();

app.use(express.json()); 
app.use(express.static(__dirname));
app.use(cors());

const MONGO_URI = "mongodb+srv://Gael_Hernandez_db_user:gaelHM8080@consultoriogaeleno.kj6lpcb.mongodb.net/?appName=consultoriogaeleno";

mongoose.connect(MONGO_URI)
  .then(() => console.log("¡Conectado exitosamente a MongoDB (Historial)!"))
  .catch(err => console.error("Error al conectar a MongoDB:", err));


const historialSchema = new mongoose.Schema({
    id_cita: Number,
    fecha: String,
    hora: String,
    tipo_de_estudio: String,
    laboratorio: String,
    resultado: String,
    monto: Number,
    estatus_de_pago: String
});

const historial = mongoose.model('historial', historialSchema);


// 1. CREATE: Registrar un nuevo historial clínico
app.post('/api/historial', async (req, res) => {
    try {
       const nuevohistorial = new historial(req.body);
       await nuevohistorial.save();
       res.json({ mensaje: "Historial Guardado En MongoDB Correctamente" });
    } catch (error) {
       console.error(error);
       res.status(500).json({ error: "No se pudo registrar en la base de datos" });
    }
});

// 2. READ: Obtener todos los registros del historial
app.get('/api/historial', async (req, res) => {
  try {
      const lista = await historial.find();
      res.json(lista);
  } catch (error) {
      res.status(500).json({ error: "Error al leer historial" });
  }
});

// 3. UPDATE: Actualizar datos de un historial por su ID_CITA
app.put('/api/historial/:id', async (req, res) => {
  try {
      const actualizado = await historial.findOneAndUpdate(
          { id_cita: req.params.id },
          req.body,
          { new: true }
      );
      if (actualizado) {
          res.json({ mensaje: "Modificado con éxito en MongoDB" });
      } else {
          res.status(404).json({ error: "Historial de cita no encontrado" });
      }
  } catch (error) {
      res.status(500).json({ error: "Error al actualizar" });
  }
});

// 4. DELETE: Eliminar un registro de historial por su ID_CITA
app.delete('/api/historial/:id', async (req, res) => {
  try {
      await historial.findOneAndDelete({ id_cita: req.params.id });
      res.json({ mensaje: "Eliminado con éxito de MongoDB" });
  } catch (error) {
      res.status(500).json({ error: "Error al eliminar" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor de Historial corriendo en el puerto ${PORT}`));