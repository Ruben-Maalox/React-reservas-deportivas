# TAILWIND proceso para instalarlo
## 1º Ejecutar los comandos:
npm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

## 2º Añadir a tailwind.config.js lo siguiente
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}", "./index.html"],
  theme: {
    extend: {},
  },
  plugins: [],
};

## 3º Añadir a src/INDEX.css las directivas 
**index.css se refiere al fichero de entrada de css al proyecto**
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

# Estructuración de carpetas
- src/: Contiene todo el código fuente de la aplicación.
  - /assets/: Contiene recursos estáticos como imágenes y estilos globales.
  - /components/: Contiene todos los componentes de React. Cada componente puede tener su propia carpeta con su archivo de código y su archivo de prueba.
  - /utils/: Contiene funciones de utilidad que se pueden usar en todo el proyecto.
  - /services/: Contiene servicios, como llamadas a API.
  - /pages/: Contiene todas las páginas de nuestra web
  - App.tsx: Es el componente principal de la aplicación.
  - index.tsx: Es el punto de entrada de la aplicación.