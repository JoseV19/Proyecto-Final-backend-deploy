# habits-tracker
Habits Tracker App
Aplicación para registro de habitos
Actividad 01 Programación Avanzada

## Requisitos Previos

Antes de ejecutar la aplicación, asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) (versión recomendada: 20.x o superior)
- [npm](https://www.npmjs.com/) (incluido con Node.js)

## Instalación

1. Clona el repositorio:

   ```sh
   git clone https://github.com/24000472/habits-tracker.git
   ```

2. Entra en el directorio del proyecto:

   ```sh
   cd <nombre-del-proyecto>
   ```

3. Instala las dependencias:

   ```sh
   npm install
   ```

## Ejecución

Para iniciar la aplicación en modo desarrollo, usa el siguiente comando:

```sh
npm start
```

## Configuración

Está aplicación requiere variables de entorno, créalas en un archivo `.env` en la raíz del proyecto. Ejemplo:

```ini
PORT=3000
DATABASE_URL=mongodb://localhost:3000/mi_basededatos
```

## Construcción y Despliegue

Si necesitas construir la aplicación para producción, usa:

```sh
npm run build
```

Para ejecutarla en producción:

```sh
npm run start:prod
```

## Pruebas TBD

Para ejecutar las pruebas:

```sh
npm test
```

## Contribución

Si deseas contribuir, por favor abre un issue o envía un pull request.

## Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).

