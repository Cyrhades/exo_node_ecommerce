db.createUser({
    user: "root",
    pwd: "example",
    roles: [{role: "readWrite", db: "boutik" }]
});

db.users.createIndex({email:1}, {unique:true})