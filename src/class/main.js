'use strict';
window.$ = window.jQuery = require('jquery');
import Vue from 'vue/dist/vue.esm.js';
import Class from './class';
import Store from './store';
Class.store = Store;
new Vue(Class).$mount('#app');
