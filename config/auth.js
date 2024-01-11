const LocalStrategy = require("passport-local").Strategy;
const firebase = require("firebase");
const bcrypt = require("bcryptjs");
const passport = require("passport");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const userRef = firebase.database().ref(`usuarios/${id}`);
    userRef.once(
        "value",
        (snapshot) => {
            const user = snapshot.val();
            if (user) {
                done(null, user);
            } else {
                done(new Error(`User with id ${id} not found;`));
            }
        },
        (error) => {
            done(error);
        }
    );
});

passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'senha' }, (email, senha, done) =>{
    console.log(email);
    console.log(senha);
    const usersRef = firebase.database().ref("usuarios");

    usersRef.orderByChild("email").equalTo(email).once("value")
        .then((snap) => {
            const user = snap.val();
            if (!user) {
                return done(null, null, {message:'Email inválido'}); 
            }
            
            const userId = Object.keys(user)[0];
            const userData = user[userId];
            
            console.log(userId);
            console.log(userData);
            
            bcrypt.compare(senha, userData.senha, (err, isMatch) =>{
                if (err) {
                    return done(err);
                }
                
                if (!isMatch) {
                    return done(null, null, {message:'Senha inválida'}); 
                }

                userData.id = userId;
                return done(null, userData); 
            });
        })
        .catch((err) => {
            return done(err);
        });
}));
