const client = require("../Rem")
const globalChatModel = require("../models/globalChatModel")
const { MessageEmbed } = require("discord.js")

// Image Detection:
const deepai = require("deepai")
const { DEEPAI_API_KEY } = require("../settings/config.json")
deepai.setApiKey(DEEPAI_API_KEY)

client.on("messageCreate", async (message) => {
  if (message.author.bot) return

  const channelId = message.channel.id
  const guildId = message.guild.id

  const a = await globalChatModel.findOne({
    guildId,
  })

  if (!a) {
    return
  } else {
    if (message.channel.id === a.channelId) {
      async function imgDetect() {
        const imgs = JSON.stringify(...message.attachments.values())
        for (rem = 0; rem < message.attachments.size; rem++) {
          const image =
            message.attachments.at(rem).url ||
            message.attachments.at(rem).proxyURL

          const resp = await deepai
            .callStandardApi("nsfw-detector", {
              image,
            })
            .catch((err) => {
              return message.reply({
                content:
                  "Some Error Occured with Image Detection Side.\nPlease Try Again Later or contact my dev via my support server.\n\nDev Usernames: `@Akshansh#2200`, `@Elon Dominican#2663`.",
              })
            })
          if (resp.output.nsfw_score >= 0.1) { 
          // Personally I would set this much higher to prevent false positives, maybe 0.75
            let chan = message.channel
            await chan.send({
              content:
                "Your message has a NSFW image, Please dont send it. Your message was not sent to any servers.",
            })
            return await message.delete()
          }
        }
      }

      client.guilds.cache.forEach(async (guild) => {
        const b = await globalChatModel.findOne({
          guildId: guild.id,
        })

        if (!b) {
          return
        } else {
          const otherSr = client.guilds.cache.get(guild.id)
          const otherCh = otherSr.channels.cache.get(b.channelId)

          const EM = new MessageEmbed()
            .setTitle("Global Chat: Connecting Servers.")
            .setColor("RANDOM")
            .setAuthor({
              name: message.author.tag,
              url: message.author.avatarURL({ dynamic: true }),
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .addField(
              `Message:`,
              `\n${message.content || "*(System: User did not add any text)*"}`
            )
            .addField(
              `Links:`,
              `\n[Support Server](https://discord.gg/m9q39CZuHv)\n[Top.gg](https://top.gg/bot/${client.user.id})
              `
            )
            .addField(
              `User Note:`,
              `\n*1. Don't Download any Files sent in Global Chat, If it is some harmfull file, we will not be responsible for it.*`
            )
            .setFooter({
              text: `Server Name: ${message.guild.name} | Server ID: ${message.guild.id} | Member Count: ${message.guild.memberCount}`,
            })
            .setTimestamp()

          otherCh.send({
            embeds: [EM],
            files: [...(message.attachments.values() || null)],
          })
        }
      })
    }
  }
})
