import { Bot } from 'grammy'

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!) // <-- put your bot token between the ""

// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// Handle the /start command.
bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'))
// Handle other messages.
bot.on('message', (ctx) => ctx.reply('Got another message!'))

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

bot.api.setChatMenuButton({
  menu_button: {
    type: 'web_app',
    text: 'Telegram Web App',
    web_app: {
      url: 'https://ton-minter-ashen.vercel.app',
    },
  },
})

// Start the bot.
bot.start()
