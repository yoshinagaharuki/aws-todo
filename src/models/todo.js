export class Todo {
    static instanceCount = 0;
    constructor(id, title, detail, deadLine, is_done, is_deleted) {
        this.id = id;
        this.title = title;
        this.detail = detail;
        this.deadLine = deadLine;
        this.is_done = is_done;
        // db上で削除されているかどうか(論理削除)
        this.is_deleted = is_deleted;
        Todo.instanceCount++;
    }
    static getInstanceCount() {
        return Todo.instanceCount;
    }
    isExpired() {
        const deadLineDate = new Date(this.deadLine).setHours(0, 0, 0, 0);
        const today = new Date().setHours(0, 0, 0, 0);
        if (deadLineDate >= today) {
            return false;
        } else {
            return true;
        }
    }
}
