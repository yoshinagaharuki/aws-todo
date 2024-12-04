import { Todo } from "./models/todo.js";
import { Card } from "./component/card.js";
import { Modal } from "./component/modal.js";
import { TodoService } from "./api/todo_service.js";
import { Message } from "./component/message.js";
import { CardToglle } from "./component/card_toggle.js";

document.addEventListener("DOMContentLoaded", () => {
    const indexManager = new IndexManager();
    const card_toggle = new CardToglle();
});

class IndexManager {
    constructor() {
        this.floatingBtn = document.querySelector(".floating-btn");
        // todoをリストで管理(インデックスもそのまま利用)
        this.todos = [];
        this.setEvents();
        this.getTodos();
    }
    setEvents() {
        this.floatingBtn.addEventListener("click", () => {
            // this.openModal();
            // モーダルインスタンスの作成処理をかく
            const newTodo = new Todo();
            console.log(newTodo);
            const newCard = new Card(newTodo);
            Modal.new(newCard);
            console.log(newCard);
        });
    }
    /* モーダルの保存・作成ボタンを押した時の処理 */
    async modalOnSave() {
        const formId = document.querySelector(".modal").id;
        const formTitle = document.querySelector(".modal__title").value;
        const formDetail = document.querySelector(".modal__detail").value;
        const formDeadLine = document.querySelector(".modal__deadline").value;
        const is_new = document.querySelector(".modal__is_new").value;
        let post_type = "";
        if (is_new) {
            post_type = "create_new";
        } else {
            post_type = "update_content";
        }
        const data = {
            post_type: post_type,
            id: formId,
            title: formTitle,
            detail: formDetail,
            deadline: formDeadLine,
            is_done: null,
            is_deleted: null,
        };
        is_success = await TodoService.update(data);
        if (!is_success) {
            Message.error("更新に失敗しました");
        }
        // 再度データを取得して再描画
    }
    /* todoを取得しtodosに追加 */
    async getTodos() {
        this.todos = await TodoService.getAll();
        console.log(this.todos);
        // リストを返す
        const cards = this.todos.map((todo) => new Card(todo));
        const sortedCards = cards.sort((a, b) => {
            const dateA = new Date(a.todo.deadLine);
            const dateB = new Date(b.todo.deadLine);
            // 過去の日付を優先するため、dateAがdateBよりも早い場合（過去の日付の場合）
            return dateA < dateB ? -1 : 1;
        });
        sortedCards.forEach((card) => card.create());
        // toggleの反映(コンストラクタを非同期にできないので)
        CardToglle.resetShowCard();
    }
}
