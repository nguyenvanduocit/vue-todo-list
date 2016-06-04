(function ($, Vue, window) {

    var ListStore = {
        state: {
            items: []
        },
        newItem: function (title, color) {
            this.state.items.unshift({title: title, color: color, isNew: true});
        },
        isStorageAvailable: function () {
            try {
                var storage = window.localStorage,
                    x = '__storage_test__';
                storage.setItem(x, x);
                storage.removeItem(x);
                return true;
            }
            catch (e) {
                return false;
            }
        },
        load: function () {
            var dataString = window.localStorage.getItem('task-list');
            if (dataString) {
                this.state.items = JSON.parse(dataString);
            }
            return true;
        },
        push: function () {
            window.localStorage.setItem('task-list', JSON.stringify(this.state.items));
        }
    };

    var Header = Vue.extend({
        template: $('#header-template').html(),
        data: function () {
            return {
                listState: ListStore.state,
                hoursRemain: 0
            };
        },
        computed: {
            hoursRemainPercent: function () {
                return 100 - this.hoursRemain / 24 * 100;
            },
            taskRemain: function () {
                return this.listState.items.length;
            }
        },
        ready: function () {
            var self = this;
            self.calculateHoursRemain();
            setInterval(function () {
                self.calculateHoursRemain();
            }, 1000);
        },
        methods: {
            calculateHoursRemain: function () {
                var d = new Date();
                this.hoursRemain = 24 - d.getHours();
            },
            add: function () {
                ListStore.newItem('Type your task...', '#ffc62e');
            }
        }
    });

    var Item = Vue.extend({
        props: ['model'],
        data: function () {
            return {
                isEditting: false
            };
        },
        template: $('#item-template').html(),
        methods: {
            turnEditting: function () {
                this.isEditting = true;
                this.$nextTick(function () {
                    $(this.$el).find('.input').focus();
                });
            },
            save: function () {
                this.model.isNew = false;
                this.isEditting = false;
                ListStore.push();
            },
            done: function () {
                this.$dispatch('item-deleted', this.model);
                this.$nextTick(function () {
                    ListStore.push();
                });
            }
        }
    });

    var List = Vue.extend({
        props: ['collection'],
        components: {
            'item': Item
        },
        template: $('#list-template').html(),
        events: {
            'item-deleted': function (model) {
                this.collection.$remove(model);
            }
        }
    });

    var todolist = new Vue({
        el: '#app',
        components: {
            'top-header': Header,
            'list': List,
        },
        data: function () {
            return {
                listState: ListStore.state,
            };
        },
        template: $('#app-template').html(),
        ready: function () {
            ListStore.load();
        },
        computed: {
            isStorageAvailable: function () {
                return ListStore.isStorageAvailable();
            }
        }

    });
})(jQuery, Vue, window);
