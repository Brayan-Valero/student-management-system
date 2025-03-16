# Sistema de Gestión de Estudiantes

Este es un sistema de gestión de estudiantes que permite administrar información de estudiantes y sus tecnologías asociadas.

## Características

- ✨ Interfaz moderna y responsive
- 📝 Gestión completa de estudiantes (CRUD)
- 🔍 Búsqueda en tiempo real
- 💻 Gestión de tecnologías por estudiante
- 🌟 Sistema de valoración por niveles
- 🔗 Integración con GitHub

## Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5
- Font Awesome
- Supabase (Backend)

## Instalación

1. Clona el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
```

2. Abre el archivo `index.html` en tu navegador

## Uso

### Gestión de Estudiantes

- **Agregar Estudiante**: Click en "Agregar Estudiante" y completa el formulario
- **Editar Estudiante**: Click en el botón "Editar" en la tarjeta del estudiante
- **Ver Detalles**: Click en la tarjeta del estudiante
- **Buscar**: Usa la barra de búsqueda para filtrar por nombre o código

### Gestión de Tecnologías

- **Agregar Tecnología**: En los detalles del estudiante, click en "Agregar Tecnología"
- **Ver Tecnologías**: Las tecnologías se muestran en los detalles del estudiante
- **Nivel de Dominio**: Califica el nivel de dominio de 1 a 5 estrellas

## Estructura del Proyecto

```
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── api.js
│   └── app.js
└── README.md
```

## API

El proyecto utiliza Supabase como backend. Las principales endpoints son:

- `GET /student` - Obtener todos los estudiantes
- `POST /student` - Crear nuevo estudiante
- `PATCH /student` - Actualizar estudiante
- `GET /technology` - Obtener tecnologías
- `POST /student_technology` - Asignar tecnología a estudiante

## Contribuir

1. Haz un Fork del proyecto
2. Crea una rama para tu función (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información. 