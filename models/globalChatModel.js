const { Schema, model } = require("mongoose")

const StrUnq = {
  type: String,
  required: true,
  unique: true,
}

const Str = {
  type: String,
  required: true,
  unique: false,
}

const Arr = {
  type: Array,
  required: true,
  unique: false,
}

const Num = {
  type: Number,
  required: true,
  unique: false,
}

const globalChat = new Schema(
  {
    channelId: StrUnq,
    guildId: StrUnq,
  },
  {
    collection: "global-chat",
  }
)

const globalChatModel = model("GlobalChat", globalChat)

module.exports = globalChatModel
