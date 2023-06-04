import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import { Configuration, OpenAIApi } from 'openai'

dotenv.config();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.'
        },
        {
          role: 'user',
          content: `${prompt}`//prompt
        }
      ],
      prompt: `${prompt}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const { choices } = response.data;
    const botReply = choices[0].message.content;

    res.status(200).send({
      bot: botReply
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error || 'Something went wrong');
  }
});

app.listen(5000, () => console.log('AI server started on http://localhost:5000'));
