/**
 * Hamster Blocker (R)
 * by Arthur Percsetter (ex. IAmOtaque)
 * Powered by Group Reflection (C) 2024 - present time
 * For Telegram only
 * AGPL-3.0 LICENSE
 */

import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { message } from "telegraf/filters";
require("dotenv").config({ path: __dirname + "/../private/.env" });

const isTokenValid = (token: string): boolean => {
  return /^[0-9]{8,10}:[a-zA-Z0-9_-]{35}$/.test(token);
};

const isGroupId = (id: number): boolean => {
  return /^-[0-9]+$/.test(id.toString());
};

const isRefLinkToBlock = (text: string): boolean => {
  return (
    /https?:\/\/t.me\/hamster_kombat_bot.{0,}/.test(text) ||
    /https?:\/\/t.me\/blumcryptobot.{0,}/.test(text)
  );
};

const isBotAdmin = async (ctx: any): Promise<boolean> => {
  const botMember = await ctx.getChatMember(ctx.botInfo.id);
  return botMember.status === "administrator";
};
const createTgBotLink = (botUserName: string, extra: string = ""): string => {
  return `https://t.me/${botUserName}${extra}`;
};
process.env.TOKEN
  ? isTokenValid(process.env.TOKEN)
    ? null
    : console.error("Invalid token")
  : console.error("You haven't created a token .env file.");

type Answers = {
  start: string;
};

const token: string = process.env.TOKEN ?? "Invalid";
const bot: Telegraf<Context<Update>> = new Telegraf(token);

bot.start(async (ctx) => {
  const chatId: number = ctx.chat.id;
  if (!isGroupId(chatId))
    await ctx.reply(
      "Hello! Welcome to the Hamster Blocker. I am not in the group. Please add me and give me the administrator privileges.",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Add me to the group",
                url: createTgBotLink("BlockHamstersBot", "?startgroup"),
              },
            ],
          ],
        },
      }
    );
  else {
    if (!(await isBotAdmin(ctx))) {
      await ctx.reply("<b>Please give me full admin rights!</b>", {
        parse_mode: "HTML",
      });
    }
  }
});

bot.on(message("text"), async (ctx) => {
  if (isGroupId(ctx.chat.id)) {
    const messageText: string = ctx.text.toLowerCase();

    if (
      isRefLinkToBlock(messageText) &&
      (await isBotAdmin(ctx)) &&
      (await ctx.getChatMember(ctx.message.from.id)).status === "member"
    ) {
      const uid: number = ctx.message.from.id;
      await ctx.reply(
        `User ${ctx.message.from.first_name} (${uid}) was permbanned.`
      );
      await ctx.banChatMember(uid);
      await ctx.deleteMessage(ctx.message.message_id);
    }
  }
});

bot.launch();
