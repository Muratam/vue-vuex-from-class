import Vue from 'vue/dist/vue.esm.js';
import Vuex from 'vuex';

import {bindStateToThisAtMutation, getRandomHash, mutationByAssign, mutations} from '../js/common'
import SaveData from '../js/savedata';
Vue.use(Vuex);

// WARN:
function appendHttp(url) {
  if (url !== '' && !/^https?:\/\//.test(url)) return 'http://' + url;
  return url;
}
// constructor => state
// mutation(this) => iikanji
class Store {
  constructor() {
    // state に登録されるオブジェクトを描く
    this.genres = [];
    this.hows = [];
    this.contents = [];
    this.currentGenre = 'all';
    this.currentHow = 'all';
    this.findQuery = '';
    this.saveData = new SaveData('webSocket');
    // ⬇も自動で着く
    //    ...mutationByAssign(['currentGenre', 'currentHow', 'findQuery']),
  }
  // 生えているメソッドはmutationsに
  startBlackout(type) {
    this.blackoutPalletType = type;
  }
  save(key) {
    this.saveData.save(key, this[key]);
  }
  setupSaveData() {
    this.saveData.setDefaultData(
        'genres', [{name: '❓', id: 'temporary'}, {ame: '🗑', id: 'trash'}]);
    this.saveData.setDefaultData('hows', [
      {name: 'Todo', id: 'todo'}, {name: 'Later', id: 'later'},
      {name: 'URL', id: 'url'}, {name: 'Study', id: 'study'}
    ]);
    this.saveData.setDefaultData('contents', []);
    this.saveData.autoLoad('genres', this);
    this.saveData.autoLoad('hows', this);
    this.saveData.autoLoad('contents', this);
    this.saveData.ready();
  }
  deleteContent(id) {
    let index = this.contents.findIndex(x => x.id === id);
    if (index === -1) return;
    let content = this.contents[index];
    if (content.genre === 'trash' ||
        (content.url === '' && content.title === '' && content.body === '')) {
      // 要素を削除
      this.contents.splice(index, 1);
    } else {
      // 要素をゴミ箱へ
      content.genre = 'trash';
      this.contents.splice(index, 1, content);
    }
    mutations(this).save('contents');
    mutations(this).checkDeletedGenres();
  }
  checkDeletedGenres() {
    let genreIds = this.contents.groupBy(x => x.genre).map(x => x.key);
    genreIds.push('trash');
    genreIds.push('temporary');
    let newGenres = [];
    let updated = false;
    for (let genre of this.genres) {
      let ok = genreIds.some(x => x === genre.id);
      if (ok)
        newGenres.push(genre);
      else
        updated = true;
    }
    if (!updated) return;
    this.genres = newGenres;
    this.currentGenre = 'all';
    mutations(this).save('genres');
  }
  addContent(content) {
    if (content === null) return;
    content.url = appendHttp(content.url);
    if ($.trim(content.id) === '') content.id = getRandomHash();
    if (!('how' in content)) content.how = this.currentHow;
    if (!('genre' in content)) content.genre = this.currentGenre;
    if (content.how === 'all') content.how = 'later';
    if (content.genre === 'all') content.genre = 'temporary';
    this.contents.push(content);
    mutations(this).save('contents');
  }
  updateContent(id, content) {
    let index = this.contents.findIndex(x => x.id === id);
    if (index === -1) return;
    content.url = appendHttp(content.url);
    if (!content.genre) content.genre = this.contents[index].genre;
    if (!content.how) content.how = this.contents[index].how;
    this.contents.splice(index, 1, content);
    mutations(this).save('contents');
  }
  // get のメソッドは getter に
  get howName() {
    return howId => {
      for (let how of this.hows) {
        if (how.id === howId) return how.name;
      }
      return 'all';
    };
  }
  get visibleMemoCount() {
    return this.visibleContents.map(x => x.memos.length || 0)
        .reduce((x, y) => x + y, 0);
  }
}
export default new Vuex.Store({
  state: {
    genres: [],
    hows: [],
  },
  _getters: {
    visibleMemoCount() {
      return this.visibleContents.map(x => x.memos.length || 0)
          .reduce((x, y) => x + y, 0);
    }
  },
  getters: {
    howName: state => howId => {
      for (let how of state.hows) {
        if (how.id === howId) return how.name;
      }
      console.log('no how', howId);
      return 'all';
    },
    genreName: state => genreId => {
      for (let genre of state.genres) {
        if (genre.id === genreId) return genre.name;
      }
      console.log('no genre', genreId);
      return 'all';
    },
    visibleMemoCount: (state, getters) => {
      return getters.visibleContents.map(x => x.memos.length || 0)
          .reduce((x, y) => x + y, 0);
    }
  },
  mutations: {
    ...bindStateToThisAtMutation({
      startBlackout(type) {
        this.blackoutPalletType = type;
      },
      save(key) {
        this.saveData.save(key, this[key]);
      },
    }),
    // 更新が自動で反映される
    ...mutationByAssign(['currentGenre', 'currentHow', 'findQuery']),
  },
});