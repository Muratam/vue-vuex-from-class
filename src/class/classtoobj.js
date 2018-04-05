// classで書くことによってVueに依存せず使えるし,静的解析も可能になる

class Component {
  // data に登録されるオブジェクトを描く
  // args は props
  // デフォルト引数 / ... はどうなるか未定義
  constructor(args) {
    this.currentGenre = 'all';
  }
  // getter / setter は computed へ行く
  get computedHoge() {}
  set computedHoge(value) {}
  // $$(.store.state)から始まるとstore参照を自動生成
  // hoge : this.$store.state.hoge; を computed に追加
  get $$hoge() {}
  // hoge : this.$store.commit('$hoge', value); を computed に追加
  set $$hoge(_) {}
  // 特別なAPIのものは外にだす
  mounted() {}
  // それ以外のものは methods へ
  iikanji() {}
  // watch は生っぽい書き方になるがいたしかたなし
  watch() {
    return {};
  }
  // static は無視されるがthisに依存しないので問題なく使える
  static me() {}
}

// WARN: 自動で: ...mutationByAssign(['currentGenre',]),
class Store {
  // state に登録されるオブジェクト
  constructor() {
    this.currentGenre = 'all';
  }
  // 生えているメソッドはmutationsに行く
  iikanji(genre) {}
  // get のメソッドは getter に
  get genreCount() {}
  // $$hoge(state, value){state.hoge = value;} をmutationに追加 (要は外部公開)
  set hoge(v) {}
  // static は無視されるがthisに依存しないので使える
  static me() {}
  // actions は知らない
}

function getParams(func, isConstructor = false) {
  // コメントと空白を取り除いて正規化
  let source = func.toString().replace(/\/\/.*$|\/\*[\s\S]*?\*\/|\s/gm, '');
  if (!isConstructor) {
    // 最初の丸かっこのもの
    let params = source.match(/\((.*?)\)/)[1].split(',');
    if (params.length === 1 && params[0] === '') return [];
    return params;
  }
  let firstName = source.replace(/^.*?\{/, '').replace(/\(.*$/, '');
  console.assert(firstName === 'constructor', 'declare consturctor first!!');
  return getParams(func, false);
}
function getStatics(Class) {
  return Reflect.ownKeys(Class).filter(
      x => x !== 'length' && x !== 'prototype' && x !== 'name');
}
function getMethods(Class) {
  let funcs =
      Reflect.ownKeys(Class.prototype)
          .filter(x => x !== 'constructor')
          .map(x => Reflect.getOwnPropertyDescriptor(Class.prototype, x));
  let res = {
    methods: {},
    getters: {},
    setters: {},
  };
  for (let func of funcs) {
    if (func.value) res.methods.push(func.value);
    if (func.get) res.getters.push(func.get);
    if (func.set) res.setters.push(func.set);
  }
  return res;
}
function getMembers(instance) {
  return Reflect.ownKeys(instance);
}
function getName(Class) {
  return Class.name;
}


/*
function translate(Class) {
  let object = new Class();
  let result = {state: {}, getters: {}, mutations: {}};
  for (let k of Object.keys(object)) {
    result.state[k] = object[k];
  }
  for (let k of Object.getOwnPropertyNames(Class.prototype)) {
    if (k === 'constructor') continue;
    if (typeof (object[k]) === 'function') {
      result.mutations[k] = object[k];
    } else {
      result.getters[k] = object[k];
    }
  }
  return result;
}
console.log(translate(Store));
console.log(translate(Component));
*/
/*
let translated = {
  state: {
    genres: [{ name: 'aa', id: 0 }, { name: 'bb', id: 1 }],
    currentGenre: 'all',
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
    // ...mutationByAssign(['currentGenre', 'currentHow', 'findQuery']),
  },
};
*/
