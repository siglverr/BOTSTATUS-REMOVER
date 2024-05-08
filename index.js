const { Client, Intents, TextChannel, ActivityType } = require('discord.js');
require('dotenv').config();
const express = require('express');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
});

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const statusMessages = ["💲 AZURE STORE", "✨CONFIAVEL", "discord.gg/azurestores"];

let currentIndex = 0;
let channelId = '';

async function login() {
  try {
    await client.login(process.env.TOKEN);
    console.log(`Logged in as ${client.user.tag}`);
    startStatusUpdateLoop();
  } catch (error) {
    console.error('Failed to log in:', error);
    process.exit(1);
  }
}

function startStatusUpdateLoop() {
  updateStatusAndSendMessages();
  setInterval(updateStatusAndSendMessages, 10000);
}

function updateStatusAndSendMessages() {
  const currentStatus = statusMessages[currentIndex];

  client.user.setPresence({
    activities: [{ name: currentStatus, type: ActivityType.PLAYING }],
    status: 'online'
  });

  const textChannel = client.channels.cache.get(channelId);

  if (textChannel instanceof TextChannel) {
    textChannel.send(`Bot status is: ${currentStatus}`);
  }

  currentIndex = (currentIndex + 1) % statusMessages.length;
}

client.once('ready', () => {
  console.log(`Bot is ready as ${client.user.tag}`);
  login();
});

client.on('messageCreate', (message) => {
  if (message.content === '!startstatusloop') {
    startStatusUpdateLoop();
  }
});
