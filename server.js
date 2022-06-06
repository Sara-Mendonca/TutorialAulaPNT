//importando o nosso express
const express = require('express')
const app = express()

//importando e configurando o nosso banco
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
//uri para o banco na nossa máquina
const uri = 'mongodb://localhost:27017'

//uri para o nosso banco na cloud
//a nossa string de conexão. <password> é a senha que cadastramos no user dbUser
//mongodb+srv://dbUser:<password>@cluster0.jwmmh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
//const uri = "mongodb+srv://dbUser:dbUser@cluster0.jwmmh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

//Paa ler as informações do nosso body no html e extraor ps dados da tag <form>
app.use(express.urlencoded({extended:true}))

//setando a nossa view ejs e configurando o nosso express para ler views
app.set('view engine', 'ejs')
app.use(express.static('views'))

//conexão e criação da nossa database teste-bd no banco e conexão com o nosso servidor local
MongoClient.connect(uri,(err,client) => {
    if (err) return console.log(err)
    db = client.db('teste-bd')

//permite servidor se comunicar com o navegador
    app.listen(3000, () => {
        console.log('o nosso servidor está rodando na porta 3000')
    })
})

//GET
//'/' primeiro argumento informando a rota
// (req, res) segundo argumento = callback com dois argumentos, no qual um solicita e o outro responde.
//=> arrow function
app.get('/', (req, res) => {
    res.render('index.ejs')
})

//POST
//Adicionando a rota do nosso post que está sendo usado na nossa view index.ejs
app.post('/show', (req, res) => {
    db.collection('crud').insertOne(req.body, (err, result) =>{
         if(err) return console.log(err)
         console.log("salvou no nosso banco mongodb")
         res.redirect('/')
         db.collection('crud').find().toArray((err, results) => {
             console.log(results)
         })
    })
})

//adicionando o nosso o nosso read (ler) para encontrar(find()) o conteúdo salvo no nosso banco e retornar
app.get('/', (req, res) => {
    let cursor = db.collection('crud').find()
})

//renderizar e retornar o conteúdo do nosso banco
app.get('/show', (req, res) => {
    db.collection('crud').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show.ejs', {crud: results})
    })
})

//criando a nossa rota e comandos para editar
app.route('/edit/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('crud').find(ObjectId(id)).toArray((err, result) => {
        if(err) return res.send(err)
        res.render('edit.ejs', {crud: result})
    })
})
.post((req, res) => {
    var id = req.params.id
    var name = req.body.name
    var surname = req.body.surname

    db.collection('crud').updateOne({_id: ObjectId(id)}, {
        $set: {
            name: name,
            surname: surname
        }
    }, (err, result) => {
        if(err) return res.send(err)
        res.redirect('/show')
        console.log('Banco de dados atualizado')


    })
})

//criando a nossa rota e comandos para deletar
app.route ('/delete/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('crud').deleteOne({_id: ObjectId(id)}, (err, result) => {
        if(err) return res.send(500, err)
        console.log('Deletando do nosso banco de dados!')
        res.redirect('/show')
    })
})