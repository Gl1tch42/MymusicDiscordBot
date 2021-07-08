module.exports = passar;

function passar(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "Entra no canal de voz porra !"
        );
    if (!serverQueue)
        return message.channel.send("nao tem musica para passar seu cego filho da puta!, use o comando -lista");
    serverQueue.connection.dispatcher.end();
}