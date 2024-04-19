import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import * as path from "path";

dotenv.config({ path: __dirname + '/.env' });

const PORT = process.env.PORT || 5001;

console.log("PORT", PORT)

const app: Express = express();

app.use(express.json())
app.use(express.urlencoded())


app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => res.sendFile(path.resolve('client', 'build', 'index.html')));
