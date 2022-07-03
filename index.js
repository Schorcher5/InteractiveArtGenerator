
// Imports libraries used in the server file
const express = require('express');
const path = require('path');

// imports express library, and sets it working directory to the public folder and info collection from the post method
const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

// Sets relative paths to retrieve certain files from the node_modules folder
app.use('/build/', express.static(path.join(__dirname, 'node_modules/three/build')));
app.use('/build/', express.static(path.join(__dirname, 'node_modules/three/build')));
app.use('/jsm/', express.static(path.join(__dirname, 'node_modules/cannon-es/dist')));



// sets working directory for view engine to views folder
app.set('view engine', 'ejs');

app.get('/', (req,res) => {
    res.redirect('/home');
});

app.get('/home', (req,res) => {
    res.render('index', {
        title: 'Home'
    });
});

// If user enters an unknown address, this function will activate

app.use((req,res) => {
    res.status(404).render('404', {title: '404'});
});

// Runs server from port 3000 if in production environment

app.listen(3000, ()=> console.log('The server is running on port 3000'));
