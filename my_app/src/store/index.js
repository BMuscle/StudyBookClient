import { createStore } from "vuex";
import VuexORM from 'vuex-orm';
import md_header from "./md_header";
import { User, Post } from "./database";

const database = new VuexORM.Database()
database.register(User, {}) // Userモデルとusersモジュールを登録
database.register(Post, {}) // Postモデルとpostsモジュールを登録

export default createStore({
  plugins: [VuexORM.install(database)],
  state: {},
  mutations: {},
  actions: {},
  modules: {
    md_header
  }
})
