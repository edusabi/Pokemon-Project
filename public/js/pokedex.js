const pokemonName = document.querySelector(".pokemon_name")
    const pokemonNumber = document.querySelector(".pokemon_number")
    const pokemonImage = document.querySelector(".pokemon_image")

    const form = document.querySelector(".form")
    const input = document.querySelector(".input_search")

    const buttonPrev = document.querySelector(".btn-prev")
    const buttonNext = document.querySelector(".btn-next")

    let searchPokemon = 1

    const fetchPokemon = async (pokemon) => {
        const APIresponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)

        if (APIresponse.status == 200) {
            const data = await APIresponse.json()
            return data
        }
    }

    const renderPokemon = async (pokemon) => {

        pokemonName.innerHTML = "loading..."

        const data = await fetchPokemon(pokemon)

        if (data) {
            pokemonImage.style.display = 'block'
            pokemonNumber.innerHTML = data.id
            pokemonName.innerHTML = data.name
            pokemonImage.src = data["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_default"]
            input.value = '';
            searchPokemon = data.id
        } else {
            pokemonName.innerHTML = "Not found :("
            pokemonNumber.innerHTML = ''
            pokemonImage.style.display = 'none'
            input.value = '';
        }
    }

    form.addEventListener("submit", (event) => {

        event.preventDefault();

        renderPokemon(input.value.toLowerCase());
    })


    buttonPrev.addEventListener("click", () => {
        if (searchPokemon > 1) {
            searchPokemon -= 1
            renderPokemon(searchPokemon)
        }
    })

    buttonNext.addEventListener("click", () => {
        searchPokemon += 1
        renderPokemon(searchPokemon)
    });

    renderPokemon(searchPokemon);
