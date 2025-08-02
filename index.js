const POKEMON_API = "https://pokeapi.co/api/v2"
const POKEMON_LIMIT = 12
let offset = 0

const app = document.querySelector("#app")
const container = document.createElement("div")
container.className = "container"
container.style.background = "url('assets/img/container_bg.png')"
app.append(container)

// console.log(container);

const personalCardPokemon = document.querySelector(".personalCardPokemon")
personalCardPokemon.style.display = "none"

const cardImage = document.querySelector(".cardImage")


const cardContainer = document.createElement("div")
cardContainer.className = "cardContainer"
container.prepend(cardContainer)

const btn = document.querySelector(".btn")
container.append(btn)


const capitalizeFirstLetter = (name) => {
    // if (name.length > 5) {
    //     return name[0].toUpperCase() + name.slice(1, 8) + '...';
    // }

    return name[0].toUpperCase() + name.slice(1);
}

const transformationId = (id) => {
    return "#" + id.toString().padStart(4, 0)
}

// обработчик нажатий на ссылки
let linksHandler = event =>  {
    // запрещаем дальнейший переход по ссылке
    event.preventDefault();
    
  // получаем запрошенный url
  let url = new URL(event.currentTarget.href);
  
  // запускаем роутер, предавая ему path
  Router.dispatch(url.pathname);
}

const createCard = (pokemon) => {
    // console.log(pokemon);

    const card = document.createElement("div")
    card.className = "card"

    let link = document.createElement('a');
    link.style.textDecoration = 'none';
    link.href = `/pokemons/${pokemon.id}`;
    
    const img = document.createElement("img")
    img.className = "cardImage"
    img.src = pokemon.sprites.other["official-artwork"]["front_default"]
    img.alt = "default images"
    // img.onclick = (event) => {
    //     console.log(event);   
    // }
        
    //повесить событие при клике скурвть один блок показать второй

    link.append(img);

    const id = document.createElement("p")
    id.className = "cardId"
    // id.innerHTML = "#0001"
    id.innerHTML = transformationId(pokemon.id)

    const name = document.createElement("h5")
    name.className = "cardName"
    name.innerHTML = capitalizeFirstLetter(pokemon.name)

    const types = document.createElement("div")
    types.className = "types"

    pokemon.types.forEach((item) => {
        const typeItem = document.createElement("div")
        // typeItem.className = "typeItem"
        typeItem.innerHTML = item.type.name
        // typeItem.className = item.type.name + " " + "pokemonType"
        typeItem.classList.add("pokemonType")
        typeItem.classList.add(item.type.name)
        
        types.append(typeItem)
       
    })

    card.append(link, id, name, types)

    cardContainer.append(card)

    link.onclick = linksHandler;
}

const ShowMainPage = () => {
    console.log('ShowMainPage');
    getAllPokemons(offset)

    container.style.display = "flex"
    personalCardPokemon.style.display = "none"
}

const ShowInnerPokemonPage = async ({ id }) => {
  console.log('ShowInnerPokemonPage', id);
  // если хэша нет - добавляем его в историю
  if (!window.location.href.match('#')) {
    history.pushState({}, null, window.location.href + `#pokemonId=${id}`);
  }

  container.style.display = "none"
  personalCardPokemon.style.display = "flex"
};

const fetchPokemonData = async (url) => {
    const res = await fetch(url)

    return await res.json()
}

const getAllPokemons = async (offset) => {
    console.log('offset', offset);

    // const response = await fetch(`${POKEMON_API}/pokemon`)
    const response = await fetch(`${POKEMON_API}/pokemon?limit=${POKEMON_LIMIT}&offset=${offset}`, { method: "GET" })
    const allPokemons = await response.json()
    // console.log(allPokemons);

    // const pokemonRes = await fetch(allPokemons.results[10].url)
    // const pokemon = await pokemonRes.json()
    // console.log(pokemon);
    // createCard(pokemon)


    const pokemonsData = await Promise.allSettled(allPokemons.results.map((item) => {
        const pokemonUrl = item.url

        return fetchPokemonData(pokemonUrl)
    }))

    console.log('pokemonsData', pokemonsData);

    pokemonsData.forEach((pokemon) => {
        createCard(pokemon.value)
    })
}

if (window.location.href.match('#')) {
  const pokemonId = getPokemonIdFromUrl(window.location.href);

  ShowInnerPokemonPage({ id: pokemonId });
} else {
  getAllPokemons(offset)
}


btn.addEventListener("click", () => {
    offset += POKEMON_LIMIT
    getAllPokemons(offset)
    // TODO: сделать проверку 
})

