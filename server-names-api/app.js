const express = require('express');
const mongoose = require('mongoose');
const Person = require('./person');
const cors = require('cors');
const morgan = require('morgan');


const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(morgan('dev'));

mongoose.connect('mongodb://localhost:27017/namesdb',
    {useNewUrlParser: true});

// Rotas
app.get('/', (req, res) => {
    Person.find({}).lean().exec((err, data) => {
        if (err)
            return res.status(500).json({
                error: err,
                message: 'Erro interno no servidor.'
            });
        else
            return res.status(200).json(data);
    });
});

app.get('/:text', (req, res) => {
    let text = req.params.text;

    let query = {
        $or: [
            {firstname: {$regex: text, $options: 'i'}},
            {lastname: {$regex: text, $options: 'i'}},
            {email: {$regex: text, $options: 'i'}},
            {city: {$regex: text, $options: 'i'}},
            {country: {$regex: text, $options: 'i'}}
        ]
    };

    Person.find(query).lean().exec((err, data) => {
        if (err)
            return res.status(500).json({
                error: err,
                message: 'Erro interno no servidor.'
            });
        else
            // Simula atraso no servidor
            setTimeout(() => {
                return res.status(200).json(data)
            }, 2000);
    });
});

app.use((req, res, next) => {
    res.status(404).send('Rota não existe.');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Servidor executando na porta', port);
});