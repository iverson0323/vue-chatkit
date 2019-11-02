import chatkit from "../chatkit";

// Helper function for displaying error messages
// 帮助类函数，使用时将commit或者state等，传递进来，就可以操作store
// 帮助类通用函数
function handleError(commit, error) {
  const message = error.message || error.info.error_description;
  commit("setError", message);
}

export default {
  async login({ commit, state }, userId) {
    try {
      // 每次登录之前，先将error、loading进行设置
      commit("setError", "");
      commit("setLoading", true);
      // Connect user to ChatKit service
      const currentUser = await chatkit.connectUser(userId);
      console.log("currentUser：", currentUser);
      // 存储用户信息
      commit("setUser", {
        username: currentUser.id,
        name: currentUser.name
      });

      try {
        // 生成想要的和房间相关的数据
        const rooms = currentUser.rooms.map(room => ({
          id: room.id,
          name: room.name
        }));
        commit("setRooms", rooms);

        // 订阅用户进入房间
        const activeRoom = state.activeRoom || rooms[0];
        commit("setActiveRoom", {
          id: activeRoom.id,
          name: activeRoom.name
        });

        // 订阅房间的消息，建立通信连接
        await chatkit.subscribeToRoom(activeRoom.id);
        // 返回的值依然是promise类型的
        return true;
      } catch (error) {
        // ...
      }

      commit("setReconnect", false);

      // Test state.user
      console.log(state.user);
    } catch (error) {
      handleError(commit, error);
    } finally {
      commit("setLoading", false);
    }
  },

  async changeRoom({ commit }, roomId) {
    try {
      // 去某个房间，获取房间id、房间名称
      const { id, name } = await chatkit.subscribeToRoom(roomId);
      commit("setActiveRoom", { id, name });
    } catch (error) {
      // 封装一个同步处理错误的函数
      handleError(commit, error);
    }
  },

  async sendMessage({ commit }, message) {
    try {
      // 每次进行有些特定操作时，要将数据状态进行清空或进行设置
      commit("setError", "");
      commit("setSending", true);

      const messageId = await chatkit.sendMessage(message);
      return messageId;
    } catch (error) {
      handleError(commit, error);
    } finally {
      // finally的运用
      commit("setSending", false);
    }
  },

  async logout({ commit }) {
    // 退出登录的操作，清除相关数据的时候也一定要清除周全
    // 内存内部数据状态
    // 连接状态，websocket
    // 浏览器本地化数据
    commit("reset");
    chatkit.disconnectUser();
    window.localStorage.clear();
  }
};
