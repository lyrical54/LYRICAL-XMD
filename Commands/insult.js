const insults = [
  "Tu badal ki tarah hai, jab chala jaye to din haseen ho jata hai!",
  "Jab tu room se nikalta hai na, sab ke chehron pe khushi aa jati hai!",
  "Main tujhse agree karun? Bhai phir dono hi galat ho jaenge.",
  "Tu bewakoof nahi hai, bas teri soch badnaseeb hai.",
  "Tere raaz hamesha mere paas safe hain... sunta hi nahi main!",
  "Tu zinda example hai ke evolution bhi kabhi kabhi break pe chala jata hai.",
  "Tere thoday thoday chins nahi... teesra wala saaf kar le zara.",
  "Tu software update jaisa lagta hai... har baar dekho to lage zaroori nahi hai abhi.",
  "Tu sabko khushi deta hai... jab tu chala jata hai.",
  "Tu ek penny jaisa hai—do chehray wala aur kisi kaam ka nahi.",
  "Kuch dimaag me chal raha tha? Arey rehne de, chhoro!",
  "Shampoo bottles pe instructions teri wajah se likhte hain bhai.",
  "Tu badal jaisa hai... idhar udhar ghoomta rehta hai bina kisi kaam ke.",
  "Tere jokes expired doodh jese hain—na hasate hain na hazam hote hain.",
  "Tu candle ki tarah hai... halki si hawa mein bujh jata hai.",
  "Tera talent hi yeh hai ke sabko barabar tang karta hai.",
  "Tu Wi-Fi jaisa hai—jab zaroorat ho tab signal weak ho jata hai.",
  "Tu proof hai ke bina filter ke bhi log bure lag sakte hain.",
  "Teri energy black hole jaisi hai—sab ki jaan choos leta hai.",
  "Tera chehra sirf radio ke liye hi theek hai.",
  "Tu traffic jam jaisa hai—koi nahi chahta, lekin sabko jhelna padta hai.",
  "Tu tooti hui pencil jaisa hai—bilkul bekaar aur pointless.",
  "Tere ideas itne naye hain ke main unhein pehle hi sun chuka hoon.",
  "Tu zinda saboot hai ke galtiyan bhi kabhi kabhi kaam ki hoti hain.",
  "Tu lazy nahi hai... bas kuch nahi karne ka bada shauk hai tujhe.",
  "Tera dimaag Windows 95 pe chal raha hai—slow aur outdated.",
  "Tu speed bump jaisa hai—na koi pasand karta hai, na koi chharta hai.",
  "Tu machharon ke jhund jaisa hai—sirf irritate karta hai.",
  "Tu logon ko sirf isliye ikattha karta hai... taake wo milke tujhe gali de saken."
];

async function insultCommand(sock, chatId, message) {
    try {
        if (!message || !chatId) {
            console.log('Invalid message or chatId:', { message, chatId });
            return;
        }

        let userToInsult;
        
        // Check for mentioned users
        if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
            userToInsult = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }
        // Check for replied message
        else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
            userToInsult = message.message.extendedTextMessage.contextInfo.participant;
        }
        
        if (!userToInsult) {
            await sock.sendMessage(chatId, { 
                text: 'Please mention someone or reply to their message to insult them!'
            });
            return;
        }

        const insult = insults[Math.floor(Math.random() * insults.length)];

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

        await sock.sendMessage(chatId, { 
            text: `Hey @${userToInsult.split('@')[0]}, ${insult}`,
            mentions: [userToInsult]
        });
    } catch (error) {
        console.error('Error in insult command:', error);
        if (error.data === 429) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
                await sock.sendMessage(chatId, { 
                    text: 'Please try again in a few seconds.'
                });
            } catch (retryError) {
                console.error('Error sending retry message:', retryError);
            }
        } else {
            try {
                await sock.sendMessage(chatId, { 
                    text: 'An error occurred while sending the insult.'
                });
            } catch (sendError) {
                console.error('Error sending error message:', sendError);
            }
        }
    }
}

module.exports = { insultCommand };
