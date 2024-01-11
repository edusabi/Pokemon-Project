module.exports = {
    Eadmin: function(req,res,next){
        if(req.isAuthenticated()){
            return next()
            
        }else{
            req.flash("error",'Você precisa estar logado para entrar aqui!')
            res.redirect("/")
        }
    }
}