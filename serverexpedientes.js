/* SERVER EXPEDIENTES */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();

app.use(express.json()); 
app.use(express.static(__dirname));
app.use(cors());

const MONGO_URI = "mongodb+srv://Gael_Hernandez_db_user:gaelHM8080@consultoriogaeleno.kj6lpcb.mongodb.net/?appName=consultoriogaeleno";

mongoose.connect(MONGO_URI)
  .then(() => console.log("¡Conectado exitosamente a MongoDB (Expedientes)!"))
  .catch(err => console.error("Error al conectar a MongoDB:", err));


// Esquema del Expediente Clínico
const expedienteSchema = new mongoose.Schema({
    id_consulta: Number,
    id_paciente: Number,
    tipo_de_sangre: String,
    peso: Number,
    presion: String,
    diagnostico: String,
    receta: String
});

const expediente = mongoose.model('expediente', expedienteSchema);


// 1. CREATE: Registrar un nuevo expediente clínico
app.post('/api/expedientes', async (req, res) => {
    try {
       const nuevoexpediente = new expediente(req.body);
       await nuevoexpediente.save();
       res.json({ mensaje: "Expediente Guardado En MongoDB Correctamente" });
    } catch (error) {
       console.error(error);
       res.status(500).json({ error: "No se pudo registrar en la base de datos" });
    }
});

// 2. READ: Obtener todos los registros de expedientes
app.get('/api/expedientes', async (req, res) => {
  try {
      const lista = await expediente.find();
      res.json(lista);
  } catch (error) {
      res.status(500).json({ error: "Error al leer expedientes" });
  }
});

// 3. UPDATE: Actualizar datos de un expediente por su ID_CONSULTA
app.put('/api/expedientes/:id', async (req, res) => {
  try {
      const actualizado = await expediente.findOneAndUpdate(
          { id_consulta: req.params.id },
          req.body,
          { new: true }
      );
      if (actualizado) {
          res.json({ mensaje: "Modificado con éxito en MongoDB" });
      } else {
          res.status(404).json({ error: "Expediente de consulta no encontrado" });
      }
  } catch (error) {
      res.status(500).json({ error: "Error al actualizar" });
  }
});

// 4. DELETE: Eliminar un expediente por su ID_CONSULTA
app.delete('/api/expedientes/:id', async (req, res) => {
  try {
      await expediente.findOneAndDelete({ id_consulta: req.params.id });
      res.json({ mensaje: "Eliminado con éxito de MongoDB" });
  } catch (error) {
      res.status(500).json({ error: "Error al eliminar" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor de Expedientes corriendo en el puerto ${PORT}`));