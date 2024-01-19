const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const path = require("path")
const firebase = require("firebase")
const bcrypt = require("bcryptjs")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
require("./config/auth")
const {Eadmin} = require("./helps/Eadmin")



/////////Sessao
app.use(session({
    secret: "qualquerCoisa",
    cookie: {
        maxAge: 86400000*3,
      },
      saveUninitialized: true,
      resave: false,
}))

/////////////Flash
app.use(flash())

/////////passport
app.use(passport.initialize())
app.use(passport.session()) 

const firebaseConfig = {
    apiKey: "AIzaSyA1PraygMwPYzkXdAcrU0OFFAfaGHsb2JA",
    authDomain: "meu-projeto-ofc.firebaseapp.com",
    projectId: "meu-projeto-ofc",
    storageBucket: "meu-projeto-ofc.appspot.com",
    messagingSenderId: "945798836453",
    appId: "1:945798836453:web:d5440772ab655cb42e240c",
    measurementId: "G-XNDK4KHF5X"
  };
  firebase.initializeApp(firebaseConfig);


/////Body-Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

///////////Static public
app.use(express.static(path.join(__dirname, "public")))

///////////////EJS
app.set("view engine", "ejs")

////////////FIREBASE

//////Rotas
app.get("/", (req,res)=>{
    res.render("principal", {user: req.user, messages:req.flash()})
})

app.get("/criarConta",(req,res)=>{
    res.render("login/criarConta" ,{erros:req.flash()})
})

app.post("/get/registro", (req,res)=>{

var erros = []

if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome === null) {
    req.flash("error","Nome inválido!")
    erros.push({text:"Nome inválido!"})
}
    
if (!req.body.email || typeof req.body.email == undefined || req.body.email === null) {
    req.flash("error","Email inválido!")
    erros.push({text:"Email inválido!"})
}

if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha === null) {
    req.flash("error","Senha inválida!")
    erros.push({text:"Senha inválida!"})
}

if (req.body.senha.length < 4) {
    req.flash("error","Senha muito curta!")
    erros.push({text:"Senha muito curta!"})
}

if (req.body.senha != req.body.senha2) {
    req.flash("error","As senhas são diferentes, tente novamente!")
    erros.push({text:"As senhas são diferentes, tente novamente!"})
}
if (erros.length > 0) {
    console.log(erros)
    res.render("login/criarConta", { erros: req.flash() })
} else {
    firebase.database().ref(`usuarios`).once("value")
    .then((email) => {
        for (let mail in email.val()) {
            if (String(email.val()[mail].email).toLowerCase() === String(req.body.email).toLowerCase()) {
                        req.flash('error',"Já existe uma conta com este email no nosso sistema!")
                        return res.redirect("/criarConta");
                    };
                };

                const novoUsuario = {
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                };

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if (erro) {
                            req.flash('error', "Houve um erro no salvamento do usuário!");
                            res.redirect("/login/criarConta");
                        } else {
                            novoUsuario.senha = hash;

                            firebase.database().ref("usuarios").push(novoUsuario)
                                .then(
                                    req.flash("success","Usuário criado com sucesso!"),
                                    res.redirect("/login")
                                )
                                .catch((err) => {
                                    req.flash('error',"Houve um erro ao criar o usuário, tente novamente!");
                                    return res.redirect("/login/criarConta");
                                })
                        }
                    })
                })
            })
            .catch((err) => {
                console.log("Email já cadastrado!")
                res.redirect("/criarConta")
            })
    }
});

app.get("/login",(req,res)=>{
    res.render("login/login", {messages:req.flash()})
})

app.post("/get/login", passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
    failureMessage: true,
    failureFlash: true,
}), (req, res) => {
    
    if (!req.user) {
        // Lida com o redirecionamento ou mensagem de erro aqui
        res.redirect("/login",{messages:message});
        return;
    }else{
        res.redirect("/");
    }
});

app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { 
            return next(err); 
        }
        req.flash("success",'Deslogado com sucesso!')
        res.redirect('/');
    });
});

app.get("/pokedex", Eadmin, (req,res)=>{
    res.render("pokedex/pokedex",{user: req.user})
})

app.get("/jogo", Eadmin, (req,res)=>{
    res.render("jogo/jogo", {user: req.user})
})

app.get("/sobremim",  (req,res)=>{
    res.render("eu/sobremim", {user: req.user})
})

const PORTA = 9000
app.listen(PORTA, ()=>{
    console.log("Servidor rodando corretamente!")
})