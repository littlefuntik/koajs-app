var api = axios.create({
  baseURL: '/api/',
  headers: {'Accept': 'application/json'}
});

api.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

Vue.component('Registration', {
  data: function () {
    return {
      email: '',
      password: '',
      hasErrors: false,
      messageOk: '',
      messageFail: ''
    };
  },
  computed: {
    errorClass: function () {
      return {
        'is-invalid': this.hasErrors
      };
    }
  },
  methods: {
    onSubmit: function () {
      var vm = this;
      api.post('user', {
        email: this.email,
        password: this.password
      }).then(function (response) {
        vm.hasErrors = false;
        vm.email = '';
        vm.password = '';
        vm.messageOk = 'Registration success. Please, login.';
        vm.messageFail = '';
      }).catch(function (err) {
        vm.hasErrors = true;
        vm.password = '';
        vm.messageOk = '';
        if (err.response.data.data.length) {
          vm.messageFail = err.response.data.data[0].message;
        } else {
          vm.messageFail = err.response.data.message;
        }
      });
    }
  },
  template: [
    '<form v-on:submit.prevent="onSubmit" class="mt-4 mb-2">',
    '<h4>Create account</h4>',
    '<div class="alert alert-primary" role="alert" v-if="messageOk">{{ messageOk }}</div>',
    '<div class="alert alert-danger" role="alert" v-if="messageFail">{{ messageFail }}</div>',
    '<div class="form-group">',
    '<label>Email address</label>',
    '<input class="form-control mr-sm-2" v-bind:class="[errorClass]" type="text" name="email" placeholder="Email" v-model="email" v-on:keyup="hasErrors = false">',
    '</div>',
    '<div class="form-group">',
    '<label>Password</label>',
    '<input class="form-control mr-sm-2" v-bind:class="[errorClass]" type="password" name="password" placeholder="Password" v-model="password" v-on:keyup="hasErrors = false">',
    '</div>',
    '<button class="btn btn-outline-success my-2 my-sm-0" type="submit">Sign Up</button>',
    '</form>'
  ].join('')
});

Vue.component('Login', {
  data: function () {
    return {
      email: '',
      password: '',
      hasErrors: false
    };
  },
  computed: {
    errorClass: function () {
      return {
        'is-invalid': this.hasErrors
      };
    }
  },
  methods: {
    onSubmit: function () {
      var vm = this;
      api.post('login', {
        email: vm.email,
        password: vm.password
      }).then(function (response) {
        vm.hasErrors = false;
        vm.password = '';
        vm.$emit('authorized', response.data.token);
      }).catch(function () {
        vm.hasErrors = true;
        vm.password = '';
      });
    }
  },
  template: [
    '<form class="mt-4 mb-2" v-on:submit.prevent="onSubmit">',
    '<h4>Login</h4>',
    '<div class="form-group">',
    '<label>Email address</label>',
    '<input class="form-control mr-sm-2" v-bind:class="[errorClass]" type="text" name="email" placeholder="Email" v-model="email" v-on:keyup="hasErrors = false">',
    '</div>',
    '<div class="form-group">',
    '<label>Password</label>',
    '<input class="form-control mr-sm-2" v-bind:class="[errorClass]" type="password" name="password" placeholder="Password" v-model="password" v-on:keyup="hasErrors = false">',
    '</div>',
    '<button class="btn btn-outline-success my-2 my-sm-0" type="submit">Sign In</button>',
    '</form>'
  ].join('')
});

Vue.component('Logout', {
  props: ['username'],
  methods: {
    onSubmit: function () {
      this.$emit('unauthorized');
    }
  },
  template: [
    '<form class="form-inline my-2 my-lg-0" v-on:submit.prevent="onSubmit">',
    '<input class="form-control form-control-plaintext mr-sm-2" type="text" readonly v-model="username" />',
    '<button class="btn btn-outline-success my-2 my-sm-0" type="submit">Logout</button>',
    '</form>'
  ].join('')
});

Vue.component('create-deal', {
  data: function () {
    return {
      users: [],
      receiver: '',
      message: '',
      price: -1,
      messageOk: '',
      messageFail: ''
    };
  },
  methods: {
    onSubmit: function () {
      var vm = this;
      api.post('deal', {
        receiver: parseInt(this.receiver),
        message: this.message,
        price: parseFloat(this.price)
      }).then(function (response) {
        vm.receiver = '';
        vm.message = '';
        vm.price = -1;
        vm.messageOk = 'Success added.';
        vm.messageFail = '';
        vm.$emit('deal:added', response.data);
      }).catch(function (err) {
        if (err.response.data.data.length) {
          vm.messageFail = err.response.data.data[0].message;
        } else {
          vm.messageFail = err.response.data.message;
        }
      });
    }
  },
  created: function () {
    var vm = this;
    api.get('user').then(function (response) {
      vm.users = response.data;
    }).catch(function () {
      vm.users = [];
    });
  },
  template: [
    '<form v-on:submit.prevent="onSubmit" class="mt-4 mb-2">',
    '<h4>Create new proposal</h4>',
    '<div class="alert alert-primary" role="alert" v-if="messageOk">{{ messageOk }}</div>',
    '<div class="alert alert-danger" role="alert" v-if="messageFail">{{ messageFail }}</div>',
    '<div class="form-group">',
    '<label>Receiver</label>',
    '<select class="form-control mr-sm-2" v-model="receiver" required>',
    '<option value="">( not selected )</option>',
    '<option v-for="user in users" v-bind:value="user.id">{{ user.email }}</option>',
    '</select>',
    '</div>',
    '<div class="form-group">',
    '<label>Message</label>',
    '<input class="form-control mr-sm-2" type="text" name="message" v-model="message" required>',
    '</div>',
    '<div class="form-group">',
    '<label>Price</label>',
    '<input class="form-control mr-sm-2" type="text" name="price" v-model="price" required>',
    '</div>',
    '<button class="btn btn-outline-success my-2 my-sm-0" type="submit">Send</button>',
    '</form>'
  ].join('')
});

Vue.component('Deal', {
  props: ['data'],
  data: function () {
    return {
      activities: []
    };
  },
  methods: {
    refreshActivities: function () {
      var vm = this;
      api.get('deal/' + vm.data.id + '/activity').then(function (response) {
        vm.activities = response.data;
      }).catch(function () {
        vm.activities = [];
      });
    }
  },
  created: function () {
    if (this.data.id && !this.activities.length) {
      this.refreshActivities();
    }
  },
  template: [
    '<table class="table table-sm table-bordered mb-2">',
    '<thead>',
    '<tr>',
    '<th>Sender</th>',
    '<th>Receiver</th>',
    '<th>Message</th>',
    '<th>Price</th>',
    '</tr>',
    '</thead>',
    '<tbody>',
    '<tr v-for="activity in activities">',
    '<td>{{ activity.senderId }}</td>',
    '<td>{{ activity.receiverId }}</td>',
    '<td>{{ activity.message }}</td>',
    '<td>{{ activity.price }}</td>',
    '</tr>',
    '</tbody>',
    '</table>'
  ].join('')
});

new Vue({
  el: '#app',
  data: function () {
    return {
      authorized: false,
      bearerToken: '',
      user: null,
      deals: []
    };
  },
  methods: {
    reloadIdentity: function () {
      var vm = this;
      if ('' === vm.bearerToken) {
        vm.authorized = false;
        localStorage.removeItem('bearerToken');
      } else {
        api.get('me').then(function (response) {
          vm.authorized = true;
          vm.user = response.data;
          localStorage.setItem('bearerToken', vm.bearerToken);
        }).catch(function () {
          vm.authorized = false;
          localStorage.removeItem('bearerToken');
        });
      }
    },
    reloadDeals: function () {
      var vm = this;
      api.get('deal').then(function (response) {
        vm.deals = response.data;
      }).catch(function () {
        vm.deals = [];
      });
    }
  },
  watch: {
    bearerToken: function (newValue) {
      api.defaults.headers.common['Authorization'] = newValue;
      this.reloadIdentity();
    },
    authorized: function (newValue) {
      if (newValue) {
        this.reloadDeals();
      }
    }
  },
  created: function () {
    this.bearerToken = localStorage.getItem('bearerToken');
  }
});
