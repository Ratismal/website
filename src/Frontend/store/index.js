export function state() {
  return {
    user: null
  };
}

export const getters = {
};

export const mutations = {
  setUser(state, user) {
    state.user = user;
  }
};

export const actions = {
  async nuxtServerInit({ commit }, { app: { $axios } }) {
    const res = await $axios.$get('/auth');
    commit('setUser', res || null);
    console.log(res);
  }
};
