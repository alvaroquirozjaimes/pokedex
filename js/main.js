// Obtener referencias a los elementos del DOM
const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const inputSearch = document.querySelector("#search");
const btnNext = document.querySelector("#next");
const btnPrev = document.querySelector("#prev");
const spanPagina = document.querySelector("#pagina-actual");

// URL base de la API de Pokémon
const URL = "https://pokeapi.co/api/v2/pokemon/";

// Arreglo donde se almacenarán todos los pokémon
const pokemons = [];

// Tamaño de página (cantidad de pokémon por página)
const pageSize = 20;

// Página actual
let currentPage = 1;

// Filtro de tipo (por defecto "ver-todos")
let tipoActual = "ver-todos";

// Filtro por nombre
let filtroNombre = "";

// 🔽 Carga inicial de los 151 pokémon (1ra generación)
for (let i = 1; i <= 151; i++) {
  fetch(URL + i)
    .then((res) => res.json())
    .then((data) => {
      pokemons.push(data); // Agrega cada pokémon al arreglo
      if (pokemons.length === 151) renderPokemons(); // Renderiza cuando estén todos cargados
    });
}

// 🔄 Función principal para mostrar los pokémon filtrados y paginados
function renderPokemons() {
  // Filtrar por nombre y tipo
  let filtrados = pokemons.filter(poke => {
    const nombreCoincide = poke.name.toLowerCase().includes(filtroNombre);
    const tipoCoincide = tipoActual === "ver-todos" || poke.types.some(t => t.type.name === tipoActual);
    return nombreCoincide && tipoCoincide;
  });

  // Calcular cantidad total de páginas
  const totalPages = Math.ceil(filtrados.length / pageSize);
  if (currentPage > totalPages) currentPage = totalPages;

  // Determinar el rango de pokémon a mostrar en esta página
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pagina = filtrados.slice(start, end);

  // Limpiar lista actual
  listaPokemon.innerHTML = "";

  // Mostrar cada pokémon en la página
  pagina.forEach(mostrarPokemon);

  // Actualizar número de página en el DOM
  spanPagina.textContent = currentPage;
}

// 🧱 Función para crear y mostrar un pokémon en el DOM
function mostrarPokemon(poke) {
  // Obtener tipos y darles clase según el tipo
  const tipos = poke.types.map(t => `<p class="${t.type.name} tipo">${t.type.name}</p>`).join('');

  // Formatear ID del pokémon a 3 cifras
  let pokeId = poke.id.toString().padStart(3, '0');

  // Crear el div del pokémon
  const div = document.createElement("div");
  div.classList.add("pokemon");
  div.innerHTML = `
    <p class="pokemon-id">#${pokeId}</p>
    <img src="${poke.sprites.other['official-artwork'].front_default}" alt="${poke.name}">
    <h2 class="pokemon-nombre">${poke.name}</h2>
    <div class="pokemon-tipos">${tipos}</div>
    <div class="pokemon-stats">
      <p>${poke.height}m</p>
      <p>${poke.weight}kg</p>
    </div>
  `;

  // Agregar al contenedor principal
  listaPokemon.append(div);
}

// 🎯 Filtrado por tipo al hacer clic en un botón
botonesHeader.forEach(btn => {
  btn.addEventListener("click", (e) => {
    tipoActual = e.currentTarget.id; // El ID del botón representa el tipo
    currentPage = 1; // Reiniciar a la página 1
    renderPokemons(); // Volver a renderizar
  });
});

// 🔍 Filtrado por nombre al escribir en el input
inputSearch.addEventListener("input", (e) => {
  filtroNombre = e.target.value.toLowerCase(); // Guardar texto en minúsculas
  currentPage = 1; // Reiniciar a la página 1
  renderPokemons(); // Volver a renderizar
});

// ⏭ Botón "Siguiente página"
btnNext.addEventListener("click", () => {
  currentPage++;
  renderPokemons();
});

// ⏮ Botón "Página anterior"
btnPrev.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderPokemons();
  }
});
