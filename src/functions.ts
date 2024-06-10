const isTokenValid = (token: string): boolean => {
  return /^[0-9]{8,10}:[a-zA-Z0-9_-]{35}$/.test(token);
};

const isGroupId = (id: number): boolean => {
  return /^-[0-9]+$/.test(id.toString());
};

const isRefLinkToBlock = (text: string, configMode: string): boolean => {
  if (configMode !== "rude")
    return (
      /t\.me\/hamster_kombat_bot.*/.test(text) ||
      /t\.me\/blumcryptobot.*/.test(text)
    );

  return /t\.me\/[a-z][a-z0-9_]+bot\/start\?[a-z0-9_]+=[a-z0-9_]+/.test(text);
};

const isBotAdmin = async (ctx: any): Promise<boolean> => {
  const botMember = await ctx.getChatMember(ctx.botInfo.id);
  return botMember.status === "administrator";
};
const createTgBotLink = (botUserName: string, extra: string = ""): string => {
  return `https://t.me/${botUserName}${extra}`;
};

export {
  isTokenValid,
  isGroupId,
  isRefLinkToBlock,
  isBotAdmin,
  createTgBotLink,
};
