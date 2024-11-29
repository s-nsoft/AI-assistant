const rp = require("request-promise");
const { WebClient } = require("@slack/web-api");

// Bot Tokenを設定
const botToken = "xoxb-XXXXXXXXXXXX"; // 取得したBotトークン
const web = new WebClient(botToken);

// メッセージを送信する関数
async function sendMessage(channel, text) {
    try {
        const result = await web.chat.postMessage({
            channel: channel, // チャンネル名（例: #general）
            text: text,
        });

        console.log("メッセージ送信成功:", result.ts);
    } catch (error) {
        console.error("メッセージ送信失敗:", error);
    }
}
(async () => {
    const information = await checkInformation(
        "お休み前に小学校低学年の子ども向けのお話を答えてください。",
        200
    );
    // 実行例
    sendMessage(
        "#お休み前の読書",
        `\n\n\n----------------------------------\n\n\n${information}`
    );
})();

async function checkInformation(theme, length) {
    var options = {
        method: "POST",
        uri: "https://api.openai.com/v1/chat/completions",
        timeout: 30 * 1000, // タイムアウト指定しないと帰ってこない場合がある
        headers: {
            "content-type": "application/json",
            Authorization: "Bearer sk-XXXXXXXXXXXX", // 取得したAPIキー
        },
        body: {
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `${theme}${length}程度でお願いします。内容の漢字は小学校2年生までのもの必ず含めてください。お話の最後には内容の確認をする問題を3問お願いします。`,
                },
            ],
        },
        json: true,
    };
    const res = await rp(options);
    return res.choices[0].message.content;
}
