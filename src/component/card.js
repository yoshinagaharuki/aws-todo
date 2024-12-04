import { TodoService } from "../api/todo_service.js";
import { Modal } from "./modal.js";
import { CardToglle } from "./card_toggle.js";
import { Message } from "./message.js";

export class Card {
    constructor(todo) {
        this.todo = todo;
    }
    static cardTemplate = document.querySelector("#cardTemplate");
    static cardContainer = document.querySelector(".card-container");

    static disposeAll() {
        while (Card.cardContainer.firstChild) {
            const firstChild = Card.cardContainer.firstChild;
            Card.cardContainer.removeChild(firstChild);
        }
        console.info("すべてのカードが削除されました");
    }

    /* todoクラスからcardを作成しDOMに追加する */
    create() {
        const cardFragment = Card.cardTemplate.content.cloneNode(true);
        this.card = cardFragment.querySelector(".card");
        this.cardTitleHeader = this.card.querySelector(".card__title--header");
        this.cardTitleBody = this.card.querySelector(".card__title--body");
        this.cardTitleDetail = this.card.querySelector(".card__title--detail");
        this.cardBodyDeadline = this.card.querySelector(
            ".card__body--deadline"
        );
        this.cardIsDone = this.card.querySelector(".button__is-done");
        this.cardIsNotDone = this.card.querySelector(".button__is-not-done");
        this.cardEditBtn = this.card.querySelector(".button-edit");
        this.cardDeleteBtn = this.card.querySelector(".button-delete");
        this.card.id = this.todo.id;
        if (this.todo.is_done) {
            this.card.classList.add("is_done");
        }

        this.cardTitleBody.innerHTML = this.todo.title;
        this.cardTitleDetail.innerHTML = this.todo.detail;
        this.cardBodyDeadline.innerHTML = this.todo.deadLine;
        // カードのチェックボタン
        this.setCheckBtn();
        if (this.todo.isExpired()) {
            this.cardTitleHeader.classList.add("is_expired");
            this.cardBodyDeadline.classList.add("is_expired");
        }
        // イベントを追加する
        this.setEvents();
        // 最終的に描画する
        Card.cardContainer.appendChild(this.card);
    }
    setEvents() {
        this.setCheckEvent();
        this.setModalEvent();
        this.setIsDeletedEvent();
    }
    setCheckEvent() {
        this.cardIsDone.addEventListener("click", () => {
            this.changeToNotDone();
        });
        this.cardIsNotDone.addEventListener("click", () => {
            this.changeToDone();
        });
    }
    setModalEvent() {
        this.cardEditBtn.addEventListener("click", () => {
            Modal.edit(this);
        });
    }

    setIsDeletedEvent() {
        this.cardDeleteBtn.addEventListener("click", () => {
            this.updateIsDeleted();
        });
    }
    setCheckBtn() {
        if (this.todo.is_done) {
            this.cardIsDone.style.display = "block";
            this.cardIsNotDone.style.display = "none";
        } else {
            this.cardIsDone.style.display = "none";
            this.cardIsNotDone.style.display = "block";
        }
    }
    // 削除ボタンを操作
    async updateIsDeleted() {
        const post_type = "update_is_deleted";
        this.todo.is_deleted = true;
        const data = {
            post_type: post_type,
            id: this.todo.id,
            title: null,
            detail: null,
            is_done: null,
            is_deleted: this.todo.is_deleted,
        };
        const is_success = await TodoService.update(data);
        if (!is_success) {
            Message.error("削除に失敗しました");
            // 失敗した場合は元に戻す
            this.todo.is_deleted = false;
        } else {
            // 成功したので画面からも削除
            this.dispose();
        }
    }
    // is_doneを処理する
    async changeToDone() {
        this.todo.is_done = true;
        await this.updateIsDone();
    }
    async changeToNotDone() {
        this.todo.is_done = false;
        await this.updateIsDone();
    }
    async updateIsDone() {
        const post_type = "update_is_done";
        const data = {
            post_type: post_type,
            id: this.todo.id,
            title: null,
            detail: null,
            is_done: this.todo.is_done,
            is_deleted: null,
        };
        const is_success = await TodoService.update(data);
        if (!is_success) {
            Message.error("更新に失敗しました");
            // 失敗したので元に戻す
            this.todo.is_done = !this.todo.is_done;
        } else {
            if (this.todo.is_done) {
                this.card.classList.add("is_done");
            } else {
                this.card.classList.remove("is_done");
            }
            // トグルの更新
            CardToglle.resetShowCard();
        }
        this.setCheckBtn();
    }
    dispose() {
        Card.cardContainer.removeChild(this.card);
        this.card = null;
    }
}
