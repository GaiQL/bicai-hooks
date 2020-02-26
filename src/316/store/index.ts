import {observable} from 'mobx'
var Store = observable({
    /* 一些观察的状态 */
    todos: [1,2,3,4],
    /* 推导值 */
    get completedCount() {
        return this.todos.filter((todo: { completed: unknown; }) => todo.completed).length;
    },
});
// extendObservable(Store,{...storeViews})
export default Store
