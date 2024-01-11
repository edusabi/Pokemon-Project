/////////////Jogo
const pikachu = document.querySelector(".pikachu")
const piper = document.querySelector(".piper")
// const resetButton = document.querySelector(".resetButton")
const bodyJogo = document.querySelector(".aiai") // ai ai

const jump = () => {
    pikachu.classList.add('jump')

    setTimeout(() => {
        pikachu.classList.remove('jump')
    }, 500)
}

bodyJogo.addEventListener('click', jump)
bodyJogo.addEventListener('keydown', jump)


const loop = setInterval(() => {
    const piperPosition = piper.offsetLeft
    console.log(piperPosition)
    const pikachuPosition = +window.getComputedStyle(pikachu).bottom.replace('px', '')
    console.log(pikachuPosition)

    if (piperPosition <= 105 && piperPosition > 0 && pikachuPosition < 75) {
        piper.style.animation = 'none'
        piper.style.left = `${piperPosition}px`

        pikachu.style.animation = 'none'
        pikachu.style.bottom = `${pikachuPosition}px`

        pikachu.src = "/img/pikachuTriste.webp"
        pikachu.style.marginLeft = '20px'

        clearInterval(loop)
    }
}, 10);

function resetGame(){
    window.location.reload(true)
}