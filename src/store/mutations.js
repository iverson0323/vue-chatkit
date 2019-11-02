export default {
  // 使用set的方式，设置用户的各种属性
  setError(state, error) {
    state.error = error;
  },
  setLoading(state, loading) {
    state.loading = loading;
  },
  setUser(state, user) {
    state.user = user;
  },
  // 是否重新连接
  setReconnect(state, reconnect) {
    state.reconnect = reconnect;
  },
  setActiveRoom(state, roomId) {
    state.activeRoom = roomId;
  },
  setRooms(state, rooms) {
    state.rooms = rooms;
  },
  setUsers(state, users) {
    state.users = users;
  },
  // 统一操作的mutation
  clearChatRoom(state) {
    state.users = [];
    state.messages = [];
  },
  setMessages(state, messages) {
    state.messages = messages;
  },
  addMessage(state, message) {
    state.messages.push(message);
  },
  setSending(state, status) {
    state.sending = status;
  },
  setUserTyping(state, userId) {
    state.userTyping = userId;
  },
  reset(state) {
    // 清除值的时候，注意清除的顺序
    state.error = null;
    state.users = [];
    state.messages = [];
    state.rooms = [];
    state.user = null;
  }
};
