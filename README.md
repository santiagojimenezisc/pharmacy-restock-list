# Lista de resurtido farmacéutico

[![CI](https://github.com/santiagojimenezisc/pharmacy-restock-list/actions/workflows/ci.yml/badge.svg)](https://github.com/santiagojimenezisc/pharmacy-restock-list/actions/workflows/ci.yml)

Lista de resurtido digital para farmacias de barrio pequeñas.

**Demo en línea:** próximamente en `lista-resurtido.santiagojmz.com`

![Lista de productos de un anaquel, con precio por cantidad, proveedor y totales](docs/capturas/lista-anaquel-ligero.png)

## El problema

En nuestras farmacias familiares, cada domingo hacíamos a mano la lista de lo que se terminó en la semana. Por cada producto anotábamos nombre, gramaje, marca, precio y con qué proveedor comprarlo, y al final sumábamos todo para saber el presupuesto de resurtido de la semana.

Esta app guarda los productos con su precio de costo y su proveedor, los organiza por sector (el anaquel donde están) y calcula los totales sola. Menos tiempo escribiendo, menos errores al sumar y la lista siempre a la mano.

## Funcionalidades

- Sectores (anaqueles) agrupados en con pendientes, completos y sin productos, con su avance; desde un anaquel vacío se agregan productos directo.
- Crear anaqueles (sin nombres repetidos, aunque cambien acentos o mayúsculas), cambiarles el nombre desde su tarjeta y eliminar los que están vacíos, con confirmación.
- Lista de productos por sector, con laboratorio, precio de costo × cantidad y proveedor.
- Agregar y editar productos en un formulario con validación por campo: los laboratorios, proveedores y anaqueles se cargan del servidor, y el anaquel abierto viene preseleccionado.
- Eliminar productos desde el menú de cada renglón, con confirmación.
- Marcar productos como comprados al instante; si el servidor falla, el cambio se revierte y se avisa.
- Resumen de cada anaquel: por comprar, comprado, total, porcentaje de avance y cuánto falta comprarle a cada proveedor.
- Filtros de todos, pendientes y comprados, combinables con la búsqueda.
- Búsqueda de productos que ignora acentos y mayúsculas ("acido" encuentra "Ácido").
- Modo claro y oscuro: recuerda la elección o sigue el del sistema.
- Estados de carga y de error en cada pantalla, y diseño adaptado a celular, tableta y escritorio.

| Anaqueles con su avance | Agregar un producto |
| --- | --- |
| ![Lista de anaqueles con barra de avance](docs/capturas/anaqueles-modo-ligero.png) | ![Formulario para agregar un producto](docs/capturas/agregar-producto-ligero.png) |

## Tecnologías

- **Vue 3** (Composition API + `<script setup>`) con **TypeScript**
- **PrimeVue** para componentes de interfaz, elegido por ser más ligero que Quasar o Vuetify, y **PrimeVue Forms** para la validación de formularios
- **Tailwind CSS**
- **Vue Router**
- **Vite**
- **Vitest** para pruebas, **ESLint** para revisar el código y **Prettier** para darle formato
- **GitHub Actions** (CI): en cada PR revisa tipos, lint, formato y pruebas, y compila
- Servidor (backend): **Express.js** + **MySQL** (repositorio aparte)

## Cómo correrlo

Requisitos: Node.js 22.18+ o 24.12+, y el backend corriendo.

```sh
npm install
cp .env.example .env    # llena las variables de la tabla de abajo
npm run dev
```

| Variable               | Descripción                                                                                   | Ejemplo                 |
| ---------------------- | --------------------------------------------------------------------------------------------- | ----------------------- |
| `VITE_API_URL`         | URL base del API (Express)                                                                    | `http://localhost:3000` |
| `VITE_PRIMEUI_LICENSE` | Clave de licencia de PrimeVue 5. La licencia Community es gratuita y se obtiene creando una cuenta en [PrimeStore](https://primeui.store/). Sin ella, la app muestra el aviso "Invalid PrimeUI License". | `tu-clave`              |

Otros comandos:

```sh
npm run build        # revisa tipos y compila para producción
npm run type-check   # solo revisa tipos
npm run test:unit    # pruebas con Vitest (en modo vigilancia)
npm run lint         # revisa el código con ESLint y corrige lo automático
npm run format       # da formato al código con Prettier
```

## Estructura

```
src/
├── pages/        pantallas (lista de anaqueles y productos de un anaquel)
├── components/   piezas de interfaz (listas, resumen del anaquel y formularios de producto y anaquel)
├── services/     llamadas al API; los componentes nunca usan fetch directo
├── helpers/      funciones puras (formato de moneda, búsqueda sin acentos, reglas del formulario)
├── interfaces/   tipos de TypeScript
└── mocks/        respuestas de ejemplo del API, para trabajar sin backend (en preparación)

docs/capturas/    imágenes de este README
```

## Próximos pasos

Este es el primer módulo de un punto de venta pensado para el flujo de trabajo de una farmacia de barrio. La idea es que la lista de resurtido se genere sola a partir de las ventas, sin olvidos ni costos desactualizados.

- [x] ~~Agregar productos~~
- [x] ~~Editar y borrar productos~~
- [x] ~~Crear, editar y borrar anaqueles~~
- [ ] Total por comprar de cada anaquel en la vista de anaqueles
- [ ] Vista de compras agrupada por proveedor, con el total a pagar en cada uno
- [ ] Modo sin backend con datos de ejemplo (MSW)
- [x] ~~Pruebas automatizadas y linter~~
- [ ] Demo en línea
