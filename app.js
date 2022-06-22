import express from 'express';


// imports express library, and sets it working directory to the public folder and info collection from the post method
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

// sets working directory for view engine to views folder
app.set("view engine", "ejs");

app.get("/", (req,res) => {
    res.redirect("/home");
});

app.get("/home", (req,res) => {
    res.render("index", {
        title: 'Home'
    });
});

// If user enters an unknown address, this function will activate

app.use((req,res) => {
    res.status(404).render("404", {title: "404"});
});

// Runs server from port 3000 if in production environment

if (import.meta.env.PROD){
    app.listen(3000);
}


// Exports it in a way that will allow vite to start the server from here
export const viteNodeApp = app;