// storage.middleware.ts aca va lo de multer

import multer from 'multer';

// Configuración de multer
const storage = multer.memoryStorage(); // Utiliza la memoria para almacenar los archivos
const upload = multer({ storage });

// Exporta el middleware
export const uploadFile = upload.single('file'); // 'file' es el nombre del campo en el formulario

