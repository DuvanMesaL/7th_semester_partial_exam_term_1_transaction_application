# API de Usuarios

Esta API permite la gestión de usuarios, incluyendo la creación, autenticación, obtención, actualización y eliminación de usuarios.

---

## Endpoints

### 1. Autenticación y Creación de Usuarios

#### Crear Usuario

**URL:** `POST http://localhost:3001/user`

**Cuerpo de la solicitud:**
```json
{
  "name": "Juan",
  "lastname": "Perez",
  "email": "juanperez@example.com",
  "phone": "333666999",
  "gender": "M",
  "password": "123456",
  "documentType": "DNI",
  "documentNumber": "123456789"
}
```

**Respuesta exitosa:**
```json
{
  "id": 2,
  "message": "User created successfully"
}
```

#### Iniciar Sesión

**URL:** `POST http://localhost:3001/user/login`

**Cuerpo de la solicitud:**
```json
{
  "email": "juanperez@example.com",
  "password": "123456"
}
```

**Respuesta exitosa:**
```json
{
  "token": "Header Auth True"
}
```

---

## 2. Operaciones sobre Usuarios

### Obtener Usuarios

#### Obtener Todos los Usuarios

**URL:** `GET http://localhost:3001/user`

**Encabezados:**
```
Header Auth True
```

**Respuesta exitosa:**
```json
[
  {
    "id": 2,
    "name": "Juan",
    "lastname": "Perez",
    "email": "juanperez@example.com",
    "phone": "333666999",
    "gender": "M",
    "password": "(hash de contraseña)",
    "documentType": "DNI",
    "documentNumber": "123456789",
    "createdAt": "2025-03-03T06:03:01.164Z",
    "updatedAt": "2025-03-03T06:03:01.164Z",
    "deletedAt": null
  }
]
```

#### Obtener Usuario por ID

**URL:** `GET http://localhost:3001/user/2`

**Encabezados:**
```
Header Auth True
```

**Respuesta exitosa:**
```json
{
  "id": 2,
  "name": "Juan",
  "lastname": "Perez",
  "email": "juanperez@example.com",
  "phone": "333666999",
  "gender": "M",
  "password": "(hash de contraseña)",
  "documentType": "DNI",
  "documentNumber": "123456789",
  "createdAt": "2025-03-03T06:03:01.164Z",
  "updatedAt": "2025-03-03T06:03:01.164Z",
  "deletedAt": null
}
```

---

### Modificación y Eliminación de Usuarios

#### Actualizar Usuario

**URL:** `PUT http://localhost:3001/user/2`

**Encabezados:**
```
Header Auth True
```

**Respuesta exitosa:**
```json
{
  "message": "User updated successfully",
  "user": {
    "message": "User updated successfully"
  }
}
```

#### Eliminar Usuario

**URL:** `DELETE http://localhost:3001/user/2`

**Encabezados:**
```
Header Auth True
```

**Respuesta exitosa:**
```json
{
  "message": "User deleted successfully"
}
```

---

### 3. Validación de Sesión

#### Validar Token

**URL:** `POST http://localhost:3001/user/validate`

**Encabezados:**
```
Header Auth True
```

**Respuesta exitosa:**
```json
{
  "message": "Token is valid",
  "user": {
    "id": 2,
    "email": "juanperez@example.com",
    "iat": 1740981895,
    "exp": 1740985495
  }
}
```
