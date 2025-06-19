# Manual de Usuario

## 1. Registro y Acceso
- **Registro:** Acceda a la ruta `/register` y complete los campos de nombre, correo electrónico y contraseña. El sistema validará la información para evitar registros duplicados.  
- **Login:** En `/login`, ingrese su correo electrónico y contraseña para acceder de manera segura a la aplicación.

## 2. Inicio
 Nos encontramos con un menu de inicio donde podremos dirigirnos a cualquiera de las funcionalidades que encontramso debajo. 
 Se tiene un diseño iontuitivo. Ademas, nos brinda información de:

 - El usuario conectado (Arriba de la pantalla).
 - Saldo actual del usuario (En el centro de la pantalla).
 - Una lista con scroll para visualizar los movimientos recientes:
 * Recargas de dinero
 * Transferencias entrantes
 * Transferencias salientes

 **Todas estas con informaci'on relevante -> Emisor, Receptor, Cantidad, Notas, etc...**

 Las funcionalidades de la aplicación serán accesibles pulsando en los botones, visibles debajo del saldo, y en el siguiente orden:
 * Recargar dinero ocn tarjeta
 * Hacer transferencia
 * Listar otras opciones

## 3. Gestión de Tarjetas
- **Listar tarjetas:** En `/cards` podrá visualizar todas las tarjetas asociadas a su cuenta.  
- **Añadir tarjeta:** En `/cards/add` debe introducir el número de tarjeta, fecha de expiración y CVC. La aplicación verifica la validez de los datos para evitar errores.  
- **Eliminar tarjeta:** Desde la lista de tarjetas, utilice el botón “Eliminar” para borrar una tarjeta. Se solicitará confirmación antes de proceder para evitar eliminaciones accidentales.  
- **Recargar saldo:** En `/cards/recharge` seleccione la tarjeta, introduzca el CVC y la cantidad a recargar. El proceso se valida de forma segura y el saldo se actualizará inmediatamente.

## 4. Solicitar Dinero
- **Formulario de solicitud:** En `/request-money` ingrese el correo electrónico del destinatario, la cantidad deseada y una nota opcional.  
- **Visualizar solicitudes:** En `/requests` encontrará tanto las solicitudes enviadas como las recibidas.  
  - **Aceptar:** Puede aceptar solicitudes recibidas si dispone de saldo suficiente.  
  - **Rechazar o cancelar:** Según corresponda, puede rechazar solicitudes recibidas o cancelar las enviadas.

## 5. Transferencia Directa de Dinero
- **Formulario:** En `/transfer-money` introduzca el correo electrónico del destinatario, la cantidad (mayor que cero) y una nota.  
- **Validaciones:** La aplicación comprueba que dispone de saldo suficiente, que no se realiza una transferencia a sí mismo y que todos los datos son correctos antes de ejecutar la transferencia.

## 6. Historial de Transacciones
- En `/profile/transactions` puede consultar un resumen detallado de todas sus transacciones, incluyendo recargas, ingresos, gastos y solicitudes.  
- Cada transacción muestra el emisor, receptor, cantidad en euros con formato adecuado, fecha y hora, así como la nota si está disponible.

## 7. Perfil de Usuario
- **Visualizar perfil:** En `/profile` podrá consultar sus datos y un resumen general de su cuenta.  
- **Editar perfil:** En `/profile/edit` es posible modificar nombre y correo electrónico, con las validaciones necesarias para mantener la integridad de los datos.  
- **Eliminar cuenta:** Desde `/profile` puede eliminar su cuenta proporcionando su contraseña. Esto borrará sus datos y cerrará la sesión para proteger su privacidad.

## Detalles Adicionales
- Uso de tokens para garantizar la seguridad de la sesion.
- Las operaciones de pago y validación de tarjetas son ficticias.
- La interfaz es responsiva, adecuada para dispositivos móviles y de escritorio.  
- Para optimizar el rendimiento, las listas y el historial están paginados o limitados.  
- Todos los controles incluyen textos descriptivos para facilitar la comprensión y uso.

