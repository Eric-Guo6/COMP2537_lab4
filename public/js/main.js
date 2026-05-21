let currentOffset = 0;
let loading = false;
const LIMIT = 10;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const LoaderBox = document.getElementById("loaderBox");

async function loadPokemon() {
  if (loading) return;
  loading = true;
  LoaderBox.querySelector(".btn").classList.add("hidden");
  LoaderBox.querySelector(".loaderContainer").classList.remove("hidden");

  //mock loading time
  await sleep(1000);
  LoaderBox.querySelector(".btn").classList.remove("hidden");
  LoaderBox.querySelector(".loaderContainer").classList.add("hidden");

  let response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${currentOffset}&limit=${LIMIT}`,
  );
  let data = await response.json();

  try {
    await Promise.all(
      data.results.map(async (pokemon) => {
        const res2 = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`,
        );
        const detail = await res2.json();
        pokemon.imageUrl =
          detail.sprites.other["official-artwork"].front_default;
        pokemon.types = detail.types.map((typeInfo) => typeInfo.type.name);
        pokemon.weight = detail.weight;
        pokemon.height = detail.height;
        pokemon.abilities = detail.abilities.map(
          (abilityInfo) => abilityInfo.ability.name,
        );
        pokemon.id = detail.id;
      }),
    );
    console.log("Successfully fetched Pokémon details");
  } catch (error) {
    console.error("Error fetching Pokémon details:", error);
  }

  const container = document.getElementById("pokemonList");
  data.results.forEach((pokemon) => {
    const card = document.createElement("div");
    card.classList.add("col-md-4", "col-sm-6", "mb-4");
    card.innerHTML = `
    <div class="card h-100 shadow-sm border-0 ">
        <div class="card-img-top d-flex justify-content-center align-items-center p-3 hovereffect"
             style="background-color: #f5f5f5;">
            <img src="${pokemon.imageUrl}" alt="${pokemon.name}"
                 class="img-fluid" style="max-height: 200px;">
            <div class="overlay">
            <h2>${pokemon.name} details</h2>
              <p>Type: ${pokemon.types.join(", ")}</p>
              <p>Weight: ${pokemon.weight}</p>
              <p>Height: ${pokemon.height}</p>
              <p class="Abilities">Abilities: ${pokemon.abilities.join(", ")}</p>
        </div>
        </div>
        <div class="card-body text-center">
            <h5 class="card-title text-capitalize fw-bold">${pokemon.name}</h5>
            <span class="badge bg-secondary">#${String(pokemon.id).padStart(4, "0")}</span>
        </div>
    </div>
`;
    container.appendChild(card);
  });

  currentOffset += LIMIT;
  loading = false;
}

loadPokemon();

document.addEventListener("scroll", function () {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  let scrollHeight =
    document.documentElement.scrollHeight || document.body.scrollHeight;
  let clientHeight =
    document.documentElement.clientHeight || document.body.clientHeight;

  if (scrollTop + clientHeight >= scrollHeight) {
    // loadPokemon();
  }
});
