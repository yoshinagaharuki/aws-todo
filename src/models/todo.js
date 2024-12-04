export class Todo {
    static instanceCount = 0;
    constructor(id, title, detail, deadLine, is_done, is_deleted) {
        this.id = id;
        this.title = title;
        this.detail = detail;
        this.deadLine = deadLine;
        this.is_done = is_done;
        this.is_deleted = is_deleted;
        Todo.instanceCount++;
    }
    static getInstanceCount() {
        return Todo.instanceCount;
    }
    /* 期限切れかどうかを判定する関数 */
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
