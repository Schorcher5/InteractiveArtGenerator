import express from 'express';



const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

app.set("view engine", "ejs");

app.get("/", (req,res) => {
    res.redirect("/home");
});

app.get("/home", (req,res) => {
    res.render("index", {
        title: 'Home'
    });
});

if (import.meta.env.PROD){
    app.listen(3000);
}

export const viteNodeApp = app;