const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const inputSearch = document.querySelector("#search");
const btnNext = document.querySelector("#next");
const btnPrev = document.querySelector("#prev");
const spanPagina = document.querySelector("#pagina-actual");

const URL = "https://pokeapi.co/api/v2/pokemon/";
const pokemons = [];
const pageSize = 20;
let currentPage = 1;
let tipoActual = "ver-todos";
let filtroNombre = "";

// Carga inicial
for (let i = 1; i <= 151; i++) {
  fetch(URL + i)
    .then((res) => res.json())
    .then((data) => {
      pokemons.push(data);
      if (pokemons.length === 151) renderPokemons();
    });
}

function renderPokemons() {
  let filtrados = pokemons.filter(poke => {
    const nombreCoincide = poke.name.toLowerCase().includes(filtroNombre);
    const tipoCoincide = tipoActual === "ver-todos" || poke.types.some(t => t.type.name === tipoActual);
    return nombreCoincide && tipoCoincide;
  });

  const totalPages = Math.ceil(filtrados.length / pageSize);
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pagina = filtrados.slice(start, end);

  listaPokemon.innerHTML = "";

  pagina.forEach(mostrarPokemon);
  spanPagina.textContent = currentPage;
}

function mostrarPokemon(poke) {
  const tipos = poke.types.map(t => `<p class="${t.type.name} tipo">${t.type.name}</p>`).join('');
  let pokeId = poke.id.toString().padStart(3, '0');

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
  listaPokemon.append(div);
}

botonesHeader.forEach(btn => {
  btn.addEventListener("click", (e) => {
    tipoActual = e.currentTarget.id;
    currentPage = 1;
    renderPokemons();
  });
});

inputSearch.addEventListener("input", (e) => {
  filtroNombre = e.target.value.toLowerCase();
  currentPage = 1;
  renderPokemons();
});

btnNext.addEventListener("click", () => {
  currentPage++;
  renderPokemons();
});

btnPrev.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderPokemons();
  }
});
