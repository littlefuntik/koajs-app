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
  props: ['users'],
  data: function () {
    return {
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
  template: [
    '<form v-on:submit.prevent="onSubmit" class="mt-4 mb-2">',
    '<h4>Create new proposal</h4>',
    '<div class="alert alert-primary alert-dismissible fade show" role="alert" v-if="messageOk">',
    '{{ messageOk }}',
    '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
    '</div>',
    '<div class="alert alert-danger alert-dismissible fade show" role="alert" v-if="messageFail">',
    '{{ messageFail }}',
    '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
    '</div>',
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

Vue.component('deal', {
  props: ['data', 'users'],
  data: function () {
    return {
      activities: [],
      canAnswer: false,
      answerMessage: '',
      answerPrice: '',
      messageOk: '',
      messageFail: ''
    };
  },
  methods: {
    refreshActivities: function () {
      var vm = this;
      api.get('deal/' + vm.data.id + '/activity').then(function (response) {
        vm.activities = response.data;
        var last = vm.lastActivity();
        if (last) {
          vm.answerPrice = last.price;
        }
        vm.refreshCanAnswer();
      }).catch(function () {
        vm.activities = [];
        vm.answerPrice = -1;
        vm.refreshCanAnswer();
      });
    },
    refreshCanAnswer: function () {
      var vm = this;
      if (vm.data.closed) {
        vm.canAnswer = false;
      } else {
        api.get('deal/' + vm.data.id + '/access').then(function (response) {
          vm.canAnswer = response.data.canAnswer;
        }).catch(function () {
          vm.canAnswer = false;
        });
      }
    },
    lastActivity: function () {
      return this.activities.length ? this.activities[this.activities.length - 1] : null;
    },
    findUser: function (id) {
      return this.users.find(function (e) {
        return e.id === id;
      }) || null;
    },
    findActivitySender: function (id) {
      var activity = this.activities.find(function (e) {
        return e.id === id;
      });
      if (!activity) {
        return null;
      }
      var usersIds = [this.data.merchantId, this.data.customerId];
      usersIds.splice(usersIds.indexOf(activity.receiverId), 1);
      return this.findUser(usersIds[0]);
    },
    onSend: function () {
      var vm = this;
      api.post('deal/' + vm.data.id + '/activity', {
        message: this.answerMessage,
        price: parseFloat(this.answerPrice)
      }).then(function (response) {
        vm.answerMessage = '';
        vm.answerPrice = -1;
        vm.messageOk = '';
        vm.messageFail = '';
        vm.$emit('deal:activity:added', response.data);
        vm.refreshActivities();
      }).catch(function (err) {
        vm.messageOk = '';
        if (err.response.data.data.length) {
          vm.messageFail = err.response.data.data[0].message;
        } else {
          vm.messageFail = err.response.data.message;
        }
      });
    },
    onDecline: function () {
      this.answerPrice = -1;
      this.onSend();
    },
    onAccept: function () {
      var vm = this;
      api.post('deal/' + vm.data.id + '/accept', {
        message: this.answerMessage
      }).then(function (response) {
        vm.messageOk = '';
        vm.messageFail = '';
        vm.$emit('deal:activity:added', response.data);
        vm.refreshActivities();
      }).catch(function (err) {
        vm.messageOk = '';
        if (err.response.data.data.length) {
          vm.messageFail = err.response.data.data[0].message;
        } else {
          vm.messageFail = err.response.data.message;
        }
      });
    }
  },
  created: function () {
    if (this.data.id && !this.activities.length) {
      this.refreshActivities();
    }
  },
  template: [
    '<div class="table-responsive mb-2">',
    '<table class="table table-sm table-borderless table-hover" v-bind:class="{\'table-secondary\': data.closed && data.finalPrice === null, \'table-success\': data.closed && data.finalPrice !== null}">',
    '<caption><template v-if="data.closed">Closed</template><template v-else>Opened</template></caption>',
    '<thead class="thead-light">',
    '<tr>',
    '<th scope="col" style="width: 90px">Sender</th>',
    '<th scope="col" style="width: 90px">Receiver</th>',
    '<th scope="col" style="width: 210px">Message</th>',
    '<th scope="col" style="width: 120px">Price</th>',
    '<th>&nbsp;</th>',
    '</tr>',
    '</thead>',
    '<tbody>',
    '<tr v-for="(activity, index) in activities">',
    '<td scope="row">{{ findActivitySender(activity.id).email }}</td>',
    '<td scope="row"><template v-if="activity.receiverId">{{ findUser(activity.receiverId).email }}</template></td>',
    '<td scope="row">{{ activity.message }}</td>',
    '<td scope="row">${{ activity.price }}</td>',
    '<td scope="row">',
    '<template v-if="canAnswer && index === (activities.length - 1)">',
    '<div class="btn-group" role="group">',
    '<input class="btn btn-success btn-sm" type="button" v-on:click="onAccept" value="Accept" />',
    '<input class="btn btn-secondary btn-sm" type="button" v-on:click="onDecline" value="Decline" />',
    '</div>',
    '</template>',
    '</td>',
    '</tr>',
    '</tbody>',
    '<tfoot v-if="canAnswer">',
    '<tr>',
    '<td><input class="form-control form-control-sm" type="text" disabled value="me" /></td>',
    '<td><input class="form-control form-control-sm" type="text" disabled name="receiver" v-bind:value="findUser(lastActivity().receiverId).email" /></td>',
    '<td><input class="form-control form-control-sm" type="text" name="message" v-model="answerMessage" /></td>',
    '<td><div class="input-group input-group-sm"><div class="input-group-prepend"><span class="input-group-text">$</span></div><input class="form-control form-control-sm" type="text" size="4" name="price" v-model="answerPrice" /></div></td>',
    '<td><button class="btn btn-primary btn-sm btn-block" type="button" v-on:click="onSend">Send</button></td>',
    '</tr>',
    '</tfoot>',
    '</table>',
    '<div class="alert alert-primary alert-dismissible fade show" role="alert" v-if="messageOk">',
    '{{ messageOk }}',
    '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
    '</div>',
    '<div class="alert alert-danger alert-dismissible fade show" role="alert" v-if="messageFail">',
    '{{ messageFail }}',
    '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
    '</div>',
    '</div>',
  ].join('')
});

new Vue({
  el: '#app',
  data: function () {
    return {
      authorized: false,
      bearerToken: '',
      user: null,
      users: [],
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
    },
    reloadUsers: function () {
      var vm = this;
      api.get('user').then(function (response) {
        vm.users = response.data;
      }).catch(function () {
        vm.users = [];
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
        this.reloadUsers();
      }
    }
  },
  created: function () {
    this.bearerToken = localStorage.getItem('bearerToken');
  }
});
