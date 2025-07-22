const axios = require("axios");
const yts = require("yt-search");

async function playCommand(sock, chatId, message) {
  try {
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
    const searchQuery = text?.split(" ").slice(1).join(" ").trim();

    if (!searchQuery) {
      return await sock.sendMessage(chatId, {
        text: "❌ Jonsa Song Chahye Nam Btao...\n\n_Example: .play Tum Mile_"
      });
    }

    await sock.sendMessage(chatId, {
      text: `🎶 Intzar Kar Song Download Horaha...\n\n🤖 *${global.settings.botName}*\n👑 *Owner:* ${global.settings.botOwner}`
    });

    const searchResults = await yts(searchQuery);
    if (!searchResults.videos || searchResults.videos.length === 0) {
      return await sock.sendMessage(chatId, {
        text: `❌ Kuch Or Try Kar Jhanto "${searchQuery}".`
      });
    }

    const firstResult = searchResults.videos[0];
    const videoUrl = firstResult.url;

    const apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp3?url=${videoUrl}`;
    const response = await axios.get(apiUrl);

    if (!response.data.success || !response.data.result?.download_url) {
      return await sock.sendMessage(chatId, {
        text: `❌ Api Kharab Hogayn "${searchQuery}".`
      });
    }

    const { title, download_url } = response.data.result;

    await sock.sendMessage(chatId, {
      audio: { url: download_url },
      mimetype: "audio/mpeg",
      fileName: `${title.replace(/[\\/:*?"<>|]/g, "")}.mp3`
    }, { quoted: message });

  } catch (error) {
    console.error("Error in play command:", error);
    await sock.sendMessage(chatId, {
      text: "⚠️ Dobara try karna."
    });
  }
}

module.exports = playCommand;
