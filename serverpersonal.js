/* SERVER PERSONAL */
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


const personalSchema = new mongoose.Schema({
    id_personal: Number,
    nombre: String,
    puesto: String,
    horario_entrada: String,
    horario_salida: String,
    turno: String,
    dias_trabajo: String,
    cedula_profesional: Number
});

const personal = mongoose.model('personal', personalSchema);


// 1. CREATE: Registrar un nuevo empleado
app.post('/api/personal', async (req, res) => {
    try {
       const nuevoempleado = new personal(req.body);
       await nuevoempleado.save();
       res.json({ mensaje: "Personal Guardado En MongoDB Correctamente" });
    } catch (error) {
       console.error(error);
       res.status(500).json({ error: "No se pudo registrar en la base de datos" });
    }
});

// 2. READ: Obtener todo el personal
app.get('/api/personal', async (req, res) => {
  try {
      const lista = await personal.find();
      res.json(lista);
  } catch (error) {
      res.status(500).json({ error: "Error al leer personal" });
  }
});

// 3. UPDATE: Actualizar datos de un empleado por su ID_PERSONAL
app.put('/api/personal/:id', async (req, res) => {
  try {
      const actualizado = await personal.findOneAndUpdate(
          { id_personal: req.params.id },
          req.body,
          { new: true }
      );
      if (actualizado) {
          res.json({ mensaje: "Modificado con éxito en MongoDB" });
      } else {
          res.status(404).json({ error: "Empleado no encontrado" });
      }
  } catch (error) {
      res.status(500).json({ error: "Error al actualizar" });
  }
});

// 4. DELETE: Eliminar un empleado por su ID_PERSONAL
app.delete('/api/personal/:id', async (req, res) => {
  try {
      await personal.findOneAndDelete({ id_personal: req.params.id });
      res.json({ mensaje: "Eliminado con éxito de MongoDB" });
  } catch (error) {
      res.status(500).json({ error: "Error al eliminar" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor Backend corriendo en el puerto ${PORT}`));