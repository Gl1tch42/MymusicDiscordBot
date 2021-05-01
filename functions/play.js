module.exports = execute;

const queue = require('./../index');
const ytdl = require('ytdl-core');
const yts = require('yt-search');

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
        //serverQueue.connection.dispatcher.end();
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

