import { trace, toJS, spy, observe, observable, action, computed, reaction } from 'mobx'
class Todo {
    id = Math.random();
    @observable title = '';
    @observable finished = false;
    constructor(title) {
        this.title = title
    }
    @action.bound toggle(){
        this.finished = !this.finished
    }
}

export default Todo;