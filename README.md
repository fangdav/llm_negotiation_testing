# llm_negotiation
Code to run an experiment with LLMs for negotiation in Empirica. 

# Getting started:
1. Clone the repo, then run `npm install` within the main directory and each of the `client` and `server` directories. 
2. Add a `.env.local` file to the `client` directory containing the following:.
```
VITE_CHAT_API_PORT="5000"
```
3. Add a `.env` file to the `server` directory containing the following and replacing `<YOUR_OPENAI_KEY>` with your OpenAI API key:
```
OPENAI_API_KEY="<YOUR_OPENAI_KEY>"
CHAT_API_PORT="5000"
```
4. From the main directory, run the command `empirica`. 
5. Go to `http://localhost:3000/admin` in your browser to access the admin console, create a treatment from the factors already defined, and create a batch to negotiate with an LLM. 

# Notes:
We should NEVER commit the `.env` files (they're in `.gitignore`)

# To-do: 
Clean up the init process when cloning this repo -- there's probably a cleaner way, and if there isn't, we should just have one bash script that does all we need. 