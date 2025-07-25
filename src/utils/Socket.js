const socket = require("socket.io");

const { Chat } = require("../models/Chat");

const initilizeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  io.on("connection", (socket) => {
    //event handlers

    socket.on("joinChat", ({ userId, targetUserId, Name }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      console.log("Id :" + roomId);
      socket.join(roomId);
    });
    socket.on("sendMessage", async ({ Name, userId, targetUserId, text }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      console.log("Message: " + text);

      try {
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        });

        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
          });
        }

        chat.messages.push({
          senderId: userId,

          text,
        });

        await chat.save();
      } catch (err) {
        console.log(err.message);
      }
      io.to(roomId).emit("messageReceived", { Name, text });
    });
    socket.on("disconnect", () => {});
  });
};
module.exports = initilizeSocket;
