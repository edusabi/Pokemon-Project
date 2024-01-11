const navBar = document.querySelector('.nav-bar')

const itens = document.querySelector('.itens')
const acessos = document.querySelector('.acessos')
const contas = document.querySelector('.contas')

const linha1 = document.querySelector(".line1")
const linha2 = document.querySelector(".line2")
const linha3 = document.querySelector(".line3")

navBar.addEventListener('click',()=>{
    itens.classList.toggle("ativado")

    if(itens.classList.contains('ativado')){
    document.querySelector("body").style.overflowY = "hidden";

    linha1.style.transform = 'rotate(-45deg) translate(-7px,7px)'
    linha3.style.transform = 'rotate(45deg) '
    
    linha2.style.display = 'none'
    linha2.style.display = 'none'
}else{
    linha1.style.transform = 'rotate(0) translate(0,0)'
    linha3.style.transform = 'rotate(0deg) '
    linha2.style.display = 'block'
    document.querySelector("body").style.overflowY = "auto";
    }
})
