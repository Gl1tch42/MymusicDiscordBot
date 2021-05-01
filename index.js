const Discord = require('discord.js');
const client = new Discord.Client();
const ytdl = require('ytdl-core');
const yts = require('yt-search');
const queue = new Map();

module.exports = queue;

const {token} = require('./token.json')

const execute = require('./functions/play');
const lista = require('./functions/fila');
const passar = require('./functions/passar');


client.login(token);

client.on('ready', () => {
  console.log("bot rodando");
});

client.on('message', async message => {

  const serverQueue = queue.get(message.guild.id);

  if (!message.guild) return;

  if (message.content.startsWith(`*desculpas`)) {
    message.reply(`Desculpa ae pelos xingamentos, meu programador tem boca suja esse fdp !`);

  } else if (message.content === '-sair') {
    if (message.member.voice.channel) {
      const disconnection = await message.member.voice.channel.leave();
    }
  } else if (message.content.startsWith(`-tocar`)) {
    let msg = message.content.split("-tocar ");
    execute(msg, message, serverQueue, queue);

  } else if (message.content.startsWith('-lista')) {
    lista(message, serverQueue, queue);

  } else if (message.content.startsWith('-passar')) {
    passar(message, serverQueue, queue);
  }

});
