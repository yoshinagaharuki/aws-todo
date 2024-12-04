export class Message {
    constructor(type, message) {
        this.type = type;
        this.message = message;
        this.create();
    }
    static messageTag = document.querySelector(".message");
    static messageBodyTag = Message.messageTag.querySelector(".message__body");
    static messageCloseBtn = Message.messageTag.querySelector(
        ".message__close-btn"
    );
    static dispose() {
        Message.messageTag.style.display = "none";
        Message.messageTag.classList.remove(this.type);
        Message.messageBodyTag.innerHTML = "";
        Message.messageTag.classList.remove("info");
        Message.messageTag.classList.remove("error");
    }
    static info(message) {
        // 現在表示されているものを削除
        Message.dispose();
        return new Message("info", message);
    }
    static error(message) {
        Message.dispose();
        return new Message("error", message);
    }
    create() {
        Message.messageTag.classList.add(this.type);
        Message.messageBodyTag.innerHTML = this.message;
        this.setEvent();
        Message.messageTag.style.display = "flex";
    }
    setEvent() {
        Message.messageCloseBtn.addEventListener("click", () => {
            Message.dispose();
        });
    }
}
