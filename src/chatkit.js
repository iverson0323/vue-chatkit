import { ChatManager, TokenProvider } from "@pusher/chatkit-client";
import moment from "moment";
import store from "./store";

const INSTANCE_LOCATOR = process.env.VUE_APP_INSTANCE_LOCATOR;
const TOKEN_URL = process.env.VUE_APP_TOKEN_URL;
// 环境变量取出来的值是字符串，需要Number格式化一下
const MESSAGE_LIMIT = Number(process.env.VUE_APP_MESSAGE_LIMIT) || 10;

// 聊天有两部分构成，当前用户和激活的房间，用户在哪个房间中进行聊天
let currentUser = null;
let activeRoom = null;

/**
 * @description 用户连接，也就是所谓的登录，让用户可以和远程进行通信，传输消息
 * @author Yang Zekun <yangzekun@100tal.com>
 * @date 2019-11-02
 * @param {*} userId
 * @returns
 */
async function connectUser(userId) {
  // 初始化ChatManager实例，聊天管理器，和用户相关的
  const chatManager = new ChatManager({
    instanceLocator: INSTANCE_LOCATOR,
    tokenProvider: new TokenProvider({ url: TOKEN_URL }),
    userId
  });
  // 进行连接
  currentUser = await chatManager.connect();
  return currentUser;
}

/**
 * @description 设置用户列表的数据，根据不同的房间进行设置
 * @author Yang Zekun <yangzekun@100tal.com>
 * @date 2019-11-02
 */
function setMembers() {
  // 将数据进行了拆分和组合
  const members = activeRoom.users.map(user => ({
    username: user.id,
    name: user.name,
    presence: user.presence.state
  }));
  store.commit("setUsers", members);
}

/**
 * @description 订阅某个房间
 * @author Yang Zekun <yangzekun@100tal.com>
 * @date 2019-11-02
 * @param {*} roomId
 * @returns
 */
async function subscribeToRoom(roomId) {
  // 每次先清除房间的数据
  // 使用之前先进行清除
  store.commit("clearChatRoom");
  activeRoom = await currentUser.subscribeToRoom({
    roomId,
    messageLimit: MESSAGE_LIMIT,
    // chatkit的hooks函数
    hooks: {
      // 接收消息
      onMessage: message => {
        store.commit("addMessage", {
          name: message.sender.name,
          username: message.senderId,
          text: message.text,
          date: moment(message.createdAt).format("h:mm:ss a D-MM-YYYY")
        });
      },
      // 用户状态变更（在线、离线）
      onPresenceChanged: () => {
        setMembers();
      },
      // 用户开始键入
      onUserStartedTyping: user => {
        store.commit("setUserTyping", user.id);
      },
      // 用户停止输入
      onUserStoppedTyping: () => {
        store.commit("setUserTyping", null);
      }
    }
  });
  setMembers();
  return activeRoom;
}

/**
 * @description 发送消息
 * @author Yang Zekun <yangzekun@100tal.com>
 * @date 2019-11-02
 * @param {*} text
 * @returns
 */
async function sendMessage(text) {
  const messageId = await currentUser.sendMessage({
    text,
    roomId: activeRoom.id
  });
  return messageId;
}

// 单独输出
export function isTyping(roomId) {
  currentUser.isTypingIn({ roomId });
}

/**
 * @description 断开连接
 * @author Yang Zekun <yangzekun@100tal.com>
 * @date 2019-11-02
 */
function disconnectUser() {
  currentUser.disconnect();
}

// 绑定输出
export default {
  connectUser,
  subscribeToRoom,
  sendMessage,
  disconnectUser
};
