/* SERVER PACIENTES */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();


app.use(express.json()); 
app.use(express.static(__dirname));
app.use(cors());


const MONGO_URI = "mongodb+srv://Gael_Hernandez_db_user:gaelHM8080@consultoriogaeleno.kj6lpcb.mongodb.net/?appName=consultoriogaeleno";

mongoose.connect(MONGO_URI)
  .then(() => console.log("¡Conectado exitosamente a MongoDB!"))
  .catch(err => console.error("Error al conectar a MongoDB:", err));


const pacientesSchema = new mongoose.Schema({
    id_paciente: Number,
    nombre: String,
    fecha_nacimiento: String,
    curp: String,
    genero: String,
    telefono: Number,
    correo_electronico: String,
    direccion: String,
    tipo_de_sangre: String,
    contacto_de_emergencia: String,
    seguro_medico: String,
    observaciones: String
});

const pacientes = mongoose.model('pacientes', pacientesSchema);


// 1. CREATE: Registrar un nuevo paciente
app.post('/api/pacientes', async (req, res) => {
    try {
       const nuevopaciente = new pacientes(req.body);
       await nuevopaciente.save();
       res.json({ mensaje: "Paciente Guardado En MongoDB Correctamente" });
    } catch (error) {
       console.error(error);
       res.status(500).json({ error: "No se pudo registrar en la base de datos" });
    }
});

// 2. READ: Obtener todos los pacientes
app.get('/api/pacientes', async (req, res) => {
  try {
      const lista = await pacientes.find();
      res.json(lista);
  } catch (error) {
      res.status(500).json({ error: "Error al leer pacientes" });
  }
});

// 3. UPDATE: Actualizar datos de un paciente por su ID_PACIENTE
app.put('/api/pacientes/:id', async (req, res) => {
  try {
      const actualizado = await pacientes.findOneAndUpdate(
          { id_paciente: req.params.id },
          req.body,
          { new: true }
      );
      if (actualizado) {
          res.json({ mensaje: "Modificado con éxito en MongoDB" });
      } else {
          res.status(404).json({ error: "Paciente no encontrado" });
      }
  } catch (error) {
      res.status(500).json({ error: "Error al actualizar" });
  }
});

// 4. DELETE: Eliminar un paciente por su ID_PACIENTE
app.delete('/api/pacientes/:id', async (req, res) => {
  try {
      await pacientes.findOneAndDelete({ id_paciente: req.params.id });
      res.json({ mensaje: "Eliminado con éxito de MongoDB" });
  } catch (error) {
      res.status(500).json({ error: "Error al eliminar" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor Backend corriendo en el puerto ${PORT}`));


