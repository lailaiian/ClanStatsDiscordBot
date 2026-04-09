const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
// ===== 設定 =====
const DISCORD_TOKEN = '保密';
const API_TOKEN = '保密';
const CLAN_TAG = '保密'; // 記得 # → %23


// ===== 建立 bot =====
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ===== 抓部落成員 =====
async function getClanMembers() {
    try {
        const res = await axios.get(
            `https://api.clashofclans.com/v1/clans/${CLAN_TAG}/members`,
            {
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`
                }
            }
        );

        return res.data.items;
    } catch (err) {
        console.error('API 錯誤:', err.response?.status);
        return [];
    }
}

// ===== 篩選捐兵 = 0 =====
function filterZeroDonations(members) {
    return members.filter(m => m.donations === 0);
}

// ===== 指令 =====
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content === '!donation') {
        const members = await getClanMembers();
        const zeroList = filterZeroDonations(members);

        if (zeroList.length === 0) {
            return message.reply('✅ 沒有人捐兵為 0');
        }

        let msg = '📢 捐兵為 0 的成員：\n';

        zeroList.forEach(m => {
            msg += `- ${m.name} (${m.tag})\n`;
        });

        message.reply(msg);
    }
});

// ===== 啟動 =====
client.once('ready', () => {
    console.log(`✅ 已登入 ${client.user.tag}`);
});

client.login(DISCORD_TOKEN);