# Installation Manual

## 1. Clonar el repositorio
```bash
git clone https://github.com/ignaciorodriguez10/microtransactionsApp
```
**Nota:** Es muy recomendable crear un entorno virtual en el que ejecutar npm install.

```bash
python3 -m venv venv
source venv/bin/activate
```

Una vez hecho esto esto nos situamos en el proyecto
```
cd microtransactionsApp
```

## 2. Instalar dependencias
```bash
npm install
```

## 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```
PORT=3000
MONGODB_URI=MONGO_URI=mongodb+srv://ignaciorodriguezurzaiz:71ktTMHr1Nr0kSR8@clustertranscationsapp.32kjqo6.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTranscationsApp
JWT_SECRET=<UNA_CLAVE_SECRETA_PARA_TOKENS>
CREDIT_CARD_BACKEND=http://localhost:4000/api/validate-card
```
- **MONGODB_URI**: La base de datos está alojada en MongoDB Atlas y es de acceso público. Para ello se ha configurado una regla de red que permite conexiones desde cualquier dirección IP (`0.0.0.0/0`). Copia la URI proporcionada por Atlas y cambiala en ```.env```

## 4. Iniciar la aplicación
```bash
terminal -> python3 startup.py 
NAVEGADOR -> http://localhost:3000/
```
Accede a la aplicación en tu navegador: `http://localhost:3000`

## 5. Nota sobre el Credit Card Backend
Asegúrate de que el servicio de validación de tarjetas (Credit Card Backend) esté corriendo en `http://localhost:4000/api/validate-card` antes de recargar saldo.
