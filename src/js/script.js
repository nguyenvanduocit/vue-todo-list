(function($, Vue, window){
    var Header = Vue.extend({
       template:$('#header-template').html()
    });
var todolist = new Vue({
    el:'#app',
    components:{
        'top-header':Header
    },
    template:$('#app-template').html()
});
})(jQuery, Vue, window);
