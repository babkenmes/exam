import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import mongoose from 'mongoose';
import examRouter from './routes/exam'
import Question from './Models/Question';
import Option from './Models/Option';

dotenv.config({ path: __dirname + '/.env' });

const { MONGO_CONNECTION, PORT } = process.env;
console.log("MONGO_CONNECTION", MONGO_CONNECTION)
console.log("PORT", PORT)

if (!MONGO_CONNECTION)
  throw new Error("MONGO_CONNECTION not set")

mongoose.connect(MONGO_CONNECTION)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', async function () {

  const question = await Question.findOne();
  if (!question) {
    await Question.insertMany([
      {
        text: "Նշվածներից ո՞րը քաղաքացիական զենքի տեսակ չէ․",
        options: [
          (await new Option({ text: "ինքնապաշտպանական", is_correct: true }).save())._id,
          (await new Option({ text: "սառը", is_correct: false }).save())._id,
          (await new Option({ text: "ողորկափող", is_correct: false }).save())._id,
          (await new Option({ text: "ակոսափող", is_correct: false }).save())._id,
        ]
      },
      {
        text: "Տարեկան քանի՞ միավոր զենք ներկրելու իրավունք ունեն ֆիզիկական և իրավաբանական անձինք․",
        options: [
          (await new Option({ text: "1", is_correct: false }).save())._id,
          (await new Option({ text: "10", is_correct: false }).save())._id,
          (await new Option({ text: "3", is_correct: true }).save())._id,
          (await new Option({ text: "5", is_correct: false }).save())._id,
        ]
      },
      {
        text: "Արդյո՞ք քաղաքացին իրավունք ունի հարդարելու անձնական զենքն առանց զենքի հարդարման լիցենզիա ունենալու․",
        options: [
          (await new Option({ text: "ոչ", is_correct: false }).save())._id,
          (await new Option({ text: "այո", is_correct: true }).save())._id,
        ]
      },
      {
        text: "Զենք գործադրելուց առաջ ի՞նչ պետք է հայտարարեք այն անձին ում նկատմամբ պատրաստվում եք զենք գործադրել, բացառությամբ այն դեպքերի, երբ գործադրման ձգձգումը կարող է անմիջական վտանգի տակ դնել մարդկանց կյանքը կամ առաջացնել այլ ծանր հետևանքներ:",
        options: [
          (await new Option({ text: "հայտարարել իրավունքները", is_correct: false }).save())._id,
          (await new Option({ text: "պարզորոշ նախազգուշացնել", is_correct: true }).save())._id,
          (await new Option({ text: "գրավոր նախազգուշացնել", is_correct: false }).save())._id,
        ]
      },
      {
        text: "Ֆիզիկական անձանց ի՞նչ ժամկետով է տրամադրվում զենք, հրազենի հիմնական բաղկացուցիչ մասեր, փամփուշտներ ներկրելու կամ արտահանելու թույլտվությունը․",
        options: [
          (await new Option({ text: "ամիս գործողության ժամկետով", is_correct: true }).save())._id,
          (await new Option({ text: "3 ամիս գործողության ժամկետով", is_correct: false }).save())._id,
          (await new Option({ text: "10 տարի գործողության ժամկետով", is_correct: false }).save())._id,
          (await new Option({ text: "անժամկետ", is_correct: false }).save())._id,
        ]
      }
    ])
  }

  console.log("mongoose connected")
})

const app: Express = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded())
app.use("/api/exam", examRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});