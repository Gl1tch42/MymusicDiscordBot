const Discord = require('discord.js');
const client = new Discord.Client();
const ytdl = require('ytdl-core');
const yts = require('yt-search')
const queue = new Map();
const token = require('./token.json')

// const tocar = require('./class/tocar');
// const Lista = require('./class/lista');
// const passar = require('./class/passar');


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
      const disconnection = await message.member.voice.channel.leave(); ""
    }
  } else if (message.content.startsWith(`-tocar`)) {
    let msg = message.content.split("-tocar ");
    execute(msg, message, serverQueue);

  } else if (message.content.startsWith('-lista')) {
    lista(message, serverQueue);

  } else if (message.content.startsWith('-passar')) {
    passar(message, serverQueue);
  }

});

async function execute(msg, message, serverQueue) {
  
  let url = msg[msg.length - 1];
  if (!url.startsWith('https://www.yout')) {
    const r = await yts(msg[msg.length - 1])
    const videos = r.videos.slice(0, 1)
    videos.forEach(v => {
      url = v.url
    })
  }


  if (message.member.voice.channel) {

    const songInfo = await ytdl.getInfo(url);

    const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url
    };
    // console.log(song)
    if (!serverQueue) {
      const queueContruct = {
        textChannel: message.channel,
        voiceChannel: message.member.voice.channel,
        connection: null,
        songs: [],
        volume: 10,
        playing: true
      };

      queue.set(message.guild.id, queueContruct);

      queueContruct.songs.push(song);

      try {
        let connection = await queueContruct.voiceChannel.join();
        queueContruct.connection = connection;
        play(message.guild, queueContruct.songs[0]);

      } catch (err) {
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send(err);
      }
    } else {
      serverQueue.songs.push(song);
      return message.channel.send(`A musica ${song.title} foi adicionada!`);
    }
  } else {
    message.reply('Entra no canal de voz porra !');
  }
}


function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolume(0.5);
  serverQueue.textChannel.send(`iniciando musica: *${song.title}*`);
}

function lista(message, serverQueue) {
  if (serverQueue.songs) {

    message.channel.send('lista das Musicas');
    for (let index = 0; index < serverQueue.songs.length; index++) {
      const element = serverQueue.songs[index].title;
      message.channel.send(`[${index + 1}] : [${element}]`);
    }

  } else {
    message.channel.send('lista esta vazia!');
  }

}

function passar(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "Entra no canal de voz porra !"
    );
  if (!serverQueue)
    return message.channel.send("nao tem musica para passar seu cego filho da puta!, use o comando *lista");
  serverQueue.connection.dispatcher.end();
}













    // const song = songs[index];
    // const connection = await message.member.voice.channel.join();
    // const dispatcher = connection.play(ytdl(song, { filter: 'audioonly' }));
    // dispatcher.setVolume(0.5);