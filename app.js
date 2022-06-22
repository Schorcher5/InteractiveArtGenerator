import express from 'express';

const app = express();

if (import.meta.env.PROD){
    app.listen(3000);
}

export const viteNodeApp = app;