(function ($, Vue, window) {

    var ListStore = {
        state: {
            items: [
                {
                    title: 'Mua sách cho con',
                    color: '#F5A623'
                }, {
                    title: 'Đi chụp ảnh chùa Từ Tân',
                    color: '#D0021B'
                }, {
                    title: 'Gọi điện cho ngoại',
                    color: '#4A90E2'
                },
            ]
        },
newItem:function(title, color){
    this.state.items.unshift({title:title, color:color, isNew:true});
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
            add:function(){
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
                this.$nextTick(function(){
                    $(this.$el).find('.input').focus();
                });
            },
            save: function () {
                this.model.isNew = false;
                this.isEditting = false;
            },
            done: function () {
                this.$dispatch('item-deleted', this.model);
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
        template: $('#app-template').html()
    });
})(jQuery, Vue, window);
