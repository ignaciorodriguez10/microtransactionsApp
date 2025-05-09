# User’s Manual

## Requisitos Previos
- Usuario registrado y sesión iniciada.

## 1. Registro y Login
- **Registro**: Ve a `/register`, completa nombre, email y contraseña.
- **Login**: Accede a `/login` con email y contraseña.

## 2. Gestión de Tarjetas
- **Listar tarjetas**: Navega a `/cards`.
- **Añadir tarjeta**: Completa número, mes/año de expiración y CVC en `/cards/add`.
- **Eliminar tarjeta**: Usa el botón “Eliminar” en `/cards`.
- **Recargar saldo**: En `/cards/recharge`, selecciona tarjeta, introduce CVC y cantidad. Se validará externamente y actualizará tu saldo.

## 3. Solicitar Dinero
- **Formulario de solicitud**: Ve a `/request-money`, introduce email del destinatario, cantidad y nota.
- **Ver solicitudes**: `/requests` muestra solicitudes entrantes y salientes.
  - **Aceptar**: Como destinatario con saldo suficiente.
  - **Rechazar/Cancelar**: Según corresponda.

## 4. Transferencia Directa de Dinero
- **Formulario**: Accede a `/transfer-money`.
- **Enviar transferencia**: Introduce email destinatario, cantidad (>0) y nota. Se validan saldo y se evita auto-transferencia.

## 5. Historial de Transacciones
- Navega a `/profile/transactions` para ver las transacciones enviadas.

## 6. Perfil de Usuario
- **Ver perfil**: `/profile`
- **Editar perfil**: `/profile/edit` (nombre y email).
- **Eliminar cuenta**: En `/profile`, ingresa tu contraseña y confirma. La cuenta se eliminará y se limpiará la cookie.
