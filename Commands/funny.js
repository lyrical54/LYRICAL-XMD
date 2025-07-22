const fs = require('fs');
const path = require('path');

module.exports = async function (sock, chatId, message) {
    try {
        const videoPath = path.join(__dirname, '../assets/funny.mp4');

        if (!fs.existsSync(videoPath)) {
            return await sock.sendMessage(chatId, { text: '❌ Funny video not found!' });
        }

        await sock.sendMessage(chatId, {
            video: fs.readFileSync(videoPath),
            caption: '🤣 Here\'s something funny for you!',
            mimetype: 'video/mp4',
            gifPlayback: false
        }, { quoted: message });

    } catch (err) {
        console.error('Funny command error:', err);
        await sock.sendMessage(chatId, { text: '❌ Failed to send funny video.' });
    }
};
