'use strict';
window.$ = window.jQuery = require('jquery');
import Vue from 'vue/dist/vue.esm.js';
import Normal from './normal';
import Store from './store';
Normal.store = Store;
new Vue(Normal).$mount('#app');
