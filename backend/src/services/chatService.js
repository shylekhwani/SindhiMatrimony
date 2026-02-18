import CHAT from "../schemas/chatSchema.js";
import MATCH from "../schemas/matchSchema.js";

// 🔎 Check if users are matched
export const areUsersMatched = async (userA, userB) => {
  const match = await MATCH.findOne({
    users: { $all: [userA, userB] },
  });

  return !!match;
};

// 💬 Get or Create Chat
export const getOrCreateChat = async (userA, userB) => {
  // Step 1: check match
  const matched = await areUsersMatched(userA, userB);

  if (!matched) {
    throw new Error("Users are not matched");
  }

  // Step 2: find existing chat
  let chat = await CHAT.findOne({
    participants: { $all: [userA, userB] },
  });

  // Step 3: create if not exists
  if (!chat) {
    chat = await CHAT.create({
      participants: [userA, userB],
    });
  }

  return chat;
};
