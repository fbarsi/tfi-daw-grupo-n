
# 📝 Proyecto de Encuestas – NestJS + Angular

Aplicación fullstack para crear, enviar y responder encuestas online. Incluye generación de código QR, envío por correo electrónico y visualización de estadísticas.

---

## 🌐 Tecnologías utilizadas

### Backend:
- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [NodeMailer](https://nodemailer.com/) + [Handlebars](https://handlebarsjs.com/)
- [QRCode](https://github.com/soldair/node-qrcode)

### Frontend:
- [Angular](https://angular.io/)
- [Chart.js](https://www.chartjs.org/) para estadísticas
- [Bootstrap](https://getbootstrap.com/) para estilos

---


---

## 🛠️ Instalación

### 🔧 Requisitos previos
- Node.js ≥ 18
- Angular 19
- Angular CLI (`npm install -g @angular/cli`)
- Base de datos configurada PostgreSQL

---

### 📦 Backend (NestJS)

```bash
cd backend
npm install
```

1. Crear archivo `.env`:
```env
MAIL_USER=tu-correo@gmail.com
MAIL_PASS=clave-de-aplicacion
```

2. Ejecutar servidor:
```bash
npm run start:dev
```

---

### 💻 Frontend (Angular)

```bash
cd frontend
npm install
```

1. Asegurarse de que el archivo `proxy.conf.json` está apuntando al backend:
```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false
  }
}
```

2. Ejecutar aplicación:
```bash
ng serve --proxy-config proxy.conf.json
```

---

## 👤 Autores

- **Álvarez Yamil** – 
- **Barsi Franco** – 
- **Martínez Ávalos Bárbara** – 
- **Milesi Agustín** – 
- **Moran Syra** – [@Syramoran](https://github.com/Syramoran)
- **Romanoli José** – 

---

## 📝 Licencia

Este proyecto está bajo la Licencia 
