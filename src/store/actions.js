import chatkit from "../chatkit";

// Helper function for displaying error messages
function handleError(commit, error) {
  const message = error.message || error.info.error_description;
  commit("setError", message);
}

export default {
  async login({ commit, state }, userId) {
    try {
      commit("setError", "");
      commit("setLoading", true);
      // Connect user to ChatKit service
      const currentUser = await chatkit.connectUser(userId);
      commit("setUser", {
        username: currentUser.id,
        name: currentUser.name
      });

      try {
        // 保存用户的房间
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
        // 进入房间
        await chatkit.subscribeToRoom(activeRoom.id);

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
      commit("setError", "");
      commit("setSending", true);

      const messageId = await chatkit.sendMessage(message);
      return messageId;
    } catch (error) {
      handleError(commit, error);
    } finally {
      commit("setSending", false);
    }
  },

  async logout({ commit }) {
    commit("reset");
    chatkit.disconnectUser();
    window.localStorage.clear();
  }
};
