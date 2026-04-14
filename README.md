# Off Road Izamal

Aplicacion web full stack para la gestion de reservaciones de una agencia de tours en ATV.

## Stack

- Frontend: React + Vite + Tailwind CSS + Framer Motion
- Backend: Node.js + Express + MongoDB + Mongoose
- Seguridad: JWT + bcrypt

## Estructura

```text
off road/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed/
│   │   ├── services/
│   │   └── utils/
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── utils/
│   └── .env.example
└── README.md
```

## Funcionalidades

- Login obligatorio sin registro publico
- Roles `admin` y `empleado`
- Crear, editar y eliminar reservaciones
- Marcar reservaciones como pagadas
- Calculo automatico de restante y status
- Bloqueo de horarios duplicados
- Filtros por fecha, status y busqueda por nombre
- Dashboard con ingresos, tours del dia, pagados y pendientes
- Exportacion a Excel y PDF
- Interfaz responsive con look off-road agresivo

## Variables de entorno

### Backend

1. Copia `backend/.env.example` a `backend/.env`
2. Configura:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/off-road-izamal
JWT_SECRET=change_this_super_secret_key
CLIENT_URL=http://localhost:5173
APP_TIMEZONE=America/Mexico_City
ADMIN_USER=admin
ADMIN_PASSWORD=Admin123!
ADMIN_ROLE=admin
```

### Frontend

1. Copia `frontend/.env.example` a `frontend/.env`
2. Configura:

```env
VITE_API_URL=http://localhost:5000/api
```

## Como correr el proyecto

Requisitos:

- Node.js 18 o superior
- MongoDB local o remoto

### 1. Instalar dependencias

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Crear usuario administrador

```bash
cd backend
npm run seed:admin
```

### 3. Levantar backend

```bash
cd backend
npm run dev
```

### 4. Levantar frontend

```bash
cd frontend
npm run dev
```

## Credenciales iniciales

- Usuario: valor de `ADMIN_USER`
- Contraseña: valor de `ADMIN_PASSWORD`

## API principal

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/tours`
- `POST /api/tours`
- `PUT /api/tours/:id`
- `PATCH /api/tours/:id/pay`
- `DELETE /api/tours/:id`
- `GET /api/dashboard/summary`
- `GET /api/export/excel`
- `GET /api/export/pdf`

## Nota

En este entorno no estaba instalado Node.js ni npm, asi que el proyecto no pudo ejecutarse ni validarse localmente aqui. El codigo queda listo para correr en una maquina con Node y MongoDB configurados.
