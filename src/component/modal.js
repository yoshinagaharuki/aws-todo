import { TodoService } from "../api/todo_service.js";
import { Message } from "./message.js";
import { Card } from "./card.js";
import { CardToglle } from "./card_toggle.js";
export class Modal {
    /* カードがないとき(追加ボタンを押したとき)は空のカードを作成 */
    constructor(is_new, card) {
        this.is_new = is_new;
        this.card = card;
        this.create();
        this.is_submitted = false;
    }
    static modalMask = document.querySelector(".modal_mask");
    static modal = document.querySelector(".modal");
    static modalCloseBtn = document.querySelector(".modal__close-btn");
    static modalSubmit = document.querySelector(".modal__submit");

    // モーダル内のform
    static formTitle = Modal.modal.querySelector(".modal__title");
    static formDetail = Modal.modal.querySelector(".modal__detail");
    static formDeadLine = Modal.modal.querySelector(".modal__deadline");
    static new(card) {
        return new Modal(true, card);
    }

    static edit(card) {
        return new Modal(false, card);
    }

    static dispose() {
        Modal.modalMask.style.display = "none";
        Modal.modal.style.display = "none";
    }
    /* 既存のモーダルを(カード情報を元に)上書きする */
    create() {
        // モーダルの内容を作成
        this.setFormValue();
        this.setEvents();
        Modal.modalMask.style.display = "block";
        Modal.modal.style.display = "flex";
    }
    setFormValue() {
        Modal.formTitle.value = this.card.todo.title || "";
        Modal.formDetail.value = this.card.todo.detail || "";
        Modal.formDeadLine.value = this.card.todo.deadLine;
    }

    createFormData() {
        if (this.is_new) {
            return {
                post_type: "create_new",
                id: null,
                title: Modal.formTitle.value || "",
                detail: Modal.formDetail.value || "",
                deadLine: Modal.formDeadLine.value || this.getTodayDate(),
                is_done: false,
                is_deleted: false,
            };
        } else {
            return {
                post_type: "update_content",
                id: this.card.todo.id,
                title: Modal.formTitle.value || this.card.title,
                detail: Modal.formDetail.value || this.card.detail,
                deadLine: Modal.formDeadLine.value || this.card.deadLine,
                is_done: this.card.todo.is_done,
                is_deleted: this.card.todo.is_deleted,
            };
        }
    }
    getTodayDate() {
        const today = new Date();
        const year = today.getFullYear(); // 年を取得
        const month = String(today.getMonth() + 1).padStart(2, "0"); // 月を取得（0から始まるため +1）
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
    async onSave() {
        const formData = this.createFormData();
        const is_success = await TodoService.update(formData);
        if (!is_success) {
            if (this.is_new) {
                Modal.dispose();
                Message.error("作成に失敗しました");
            } else {
                Modal.dispose();
                Message.error("変更の保存に失敗しました");
            }
            return;
        } else {
            Card.disposeAll();
            // 再描画する
            await this.getTodos();

            // 最終的にモーダルを閉じる
            Modal.dispose();
            // 結果を通知する(例)
            Message.info("todoを保存しました");
        }
    }

    setEvents() {
        // 既存のイベントを削除する
        Modal.modalCloseBtn.removeEventListener("click", this.handleModalClose);
        Modal.modalMask.removeEventListener("click", this.handleModalClose);
        Modal.modalSubmit.removeEventListener("click", this.handleModalSubmit);
        this.handleModalClose = () => {
            Modal.dispose();
        };
        this.handleModalSubmit = async () => {
            if (!this.is_submitted) {
                await this.onSave();
                this.is_submitted = true;
            }
        };
        Modal.modalCloseBtn.addEventListener("click", this.handleModalClose);
        Modal.modalMask.addEventListener("click", this.handleModalClose);
        Modal.modalSubmit.addEventListener("click", this.handleModalSubmit);
    }

    async getTodos() {
        const todos = await TodoService.getAll();
        // リストを返す
        const cards = todos.map((todo) => new Card(todo));
        const sortedCards = cards.sort((a, b) => {
            const dateA = new Date(a.todo.deadLine);
            const dateB = new Date(b.todo.deadLine);
            // 過去の日付を優先するため、dateAがdateBよりも早い場合（過去の日付の場合）
            return dateA < dateB ? -1 : 1;
        });
        sortedCards.forEach((card) => card.create());
        // toggleの反映
        CardToglle.resetShowCard();
    }
}
