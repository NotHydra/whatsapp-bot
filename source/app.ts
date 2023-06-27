import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const client: Client = new Client({ authStrategy: new LocalAuth(), puppeteer: { args: ["--no-sandbox"] } });

client.on("qr", (qr: string) => {
    qrcode.generate(qr, { small: true });
});

client.on("ready", async (): Promise<void> => {
    console.log("Bot Connected");
});

client.initialize();
