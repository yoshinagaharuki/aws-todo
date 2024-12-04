export class CardToglle {
    constructor() {
        this.setEvents();
    }
    static toggle = document.querySelector(".card-toggle");
    static toggleValue = document.querySelector(".card-toggle>input");
    static cardContainer = document.querySelector(".card-container");

    static resetShowCard() {
        const _cards = CardToglle.cardContainer.querySelectorAll(".card");
        if (CardToglle.toggleValue.checked) {
            this.hiddenIsDone(_cards);
        } else {
            this.showAll(_cards);
        }
    }

    static hiddenIsDone(cards) {
        cards.forEach((card) => {
            if (card.classList.contains("is_done")) {
                card.style.display = "none";
            } else {
                card.style.display = "flex";
            }
        });
    }
    static showAll(cards) {
        cards.forEach((card) => {
            card.style.display = "flex";
        });
    }

    setEvents() {
        CardToglle.toggle.addEventListener("change", (eve) => {
            CardToglle.resetShowCard();
        });
    }
}
