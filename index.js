const POKEMON_API = "https://pokeapi.co/api/v2"
const POKEMON_LIMIT = 12
let offset = 0
const countSpecificationsItem = 15

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
let linksHandler = (event) => {
    // запрещаем дальнейший переход по ссылке
    event.preventDefault();

    // получаем запрошенный url
    let url = new URL(event.currentTarget.href);
    console.log(event.currentTarget.href);
    console.log(url);



    // запускаем роутер, предавая ему path
    Router.dispatch(url.pathname.replace("/C:", ""));
}

const createCard = (pokemon) => {
    console.log(pokemon);

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

//    <section class="specifications">
//                                 <div class="specificationsItems">
//                                     <div class="specificationsItem"></div>
//                                     <div class="specificationsItem"></div>
//                                     <div class="specificationsItem"></div>
//                                     <div class="specificationsItem"></div>
//                                     <div class="specificationsItem"></div>
//                                     <div class="specificationsItem"></div>
//                                     <div class="specificationsItem"></div>
//                                     <div class="specificationsItem"></div>
//                                     <div class="specificationsItem"></div>
//                                     <div class="specificationsItem"></div>
//                                     <div class="specificationsItem"></div>
//                                     <div class="specificationsItem"></div>
//                                     <div class="specificationsItem"></div>
//                                     <div class="specificationsItem"></div>
//                                     <div class="specificationsItem"></div>
//                                     <div class="specificationsTitle">stats[0].stat.name</div>
//                                     <div class="specificationsTitle">stats[0].base_stat</div>
//                                 </div>






const renderStatistics = (data) => {

    const statistics = document.querySelector(".statistics")

    const section = document.createElement("section")
    section.className = "specifications"

    function renderSpecificationsItems(data, index) {

        console.log(data, index);
        
        const a = data.stats[index]["base_stat"] * 100 / 200
        const b = Math.round(a / 100 * countSpecificationsItem)

        return b
    }

    data.stats.forEach((item, index) => {
        const specificationsItems = document.createElement("div")
        specificationsItems.className = "specificationsItems"


        for (let i = countSpecificationsItem; i >= 0; i--) {
            const specificationsItem = document.createElement("div")
            specificationsItem.className = "specificationsItem"
            //если мы находимся на 4 итерации то красим палочку
            if (i <= renderSpecificationsItems(data, index)) {
                specificationsItem.style.backgroundColor = "#30a7d7"
            }
            specificationsItems.append(specificationsItem)
        }

        const specificationsTitle = document.createElement("div")
        specificationsTitle.className = "specificationsTitle"
        specificationsTitle.innerHTML = data.stats[index].stat.name
        // specificationsTitle.innerHTML = item.stat.name

        specificationsItems.append(specificationsTitle)
        section.append(specificationsItems)
    });
    //--------------------------------------

    //--------------------------------------
    statistics.append(section)
}



const ShowInnerPokemonPage = async ({ id }) => {
    const personalType = document.querySelector(".personalType")
    const pokemon = await getPokemonById(id)
    console.log(pokemon);


    const types = document.querySelector(".types")

    const personalCardPokemonImage = document.querySelector("#personalCardPokemonImage")
    personalCardPokemonImage.src = pokemon.sprites.other["official-artwork"]["front_default"]

    const personalCardPokemonName = document.querySelector("#personalCardPokemonName")
    personalCardPokemonName.innerHTML = pokemon.name

    const personalCardPokemonId = document.querySelector("#personalCardPokemonId")
    personalCardPokemonId.innerHTML = pokemon.id

    //    const liParamCategoty = document.querySelector("#liParamCategoty")
    //    const liParamAbility = document.querySelector("#liParamAbility")
    //     liParamAbility.innerHTML = pokemon.abilities.name
    personalCardPokemonName.innerHTML = capitalizeFirstLetter(pokemon.name)
    personalCardPokemonId.innerHTML = transformationId(pokemon.id)

    pokemon.types.forEach((item) => {
        const typeItem = document.createElement("div")
        // typeItem.className = "typeItem"
        typeItem.innerHTML = item.type.name
        // typeItem.className = item.type.name + " " + "pokemonType"
        typeItem.classList.add("pokemonType")
        typeItem.classList.add(item.type.name)

        personalType.append(typeItem)

    })

    const liParamHeight = document.querySelector("#liParamHeight")
    liParamHeight.innerHTML = pokemon.height

    const liParamWeight = document.querySelector("#liParamWeight")
    liParamWeight.innerHTML = pokemon.weight

    renderStatistics(pokemon)

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

const getPokemonById = async (id) => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)

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

