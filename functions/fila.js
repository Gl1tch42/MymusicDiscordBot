module.exports = lista;

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