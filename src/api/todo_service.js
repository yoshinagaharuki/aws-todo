import { Todo } from "../models/todo.js";
import { Message } from "../component/message.js";
import { ApiUrls } from "./config.js";

export class TodoService {
    static async fetchFromApi(url, options = {}) {
        // 新しいリクエストの直前に削除
        Message.dispose();
        return fetch(url, options)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .catch((error) => {
                console.error("API error:", error);
                throw error;
            });
    }

    static async getAll() {
        return this.fetchFromApi(ApiUrls.getTodo)
            .then((data) =>
                data.map(
                    (item) =>
                        new Todo(
                            item.id,
                            item.title,
                            item.detail,
                            item.deadLine,
                            item.is_done,
                            item.is_deleted
                        )
                )
            )
            .catch((error) => {
                console.error("Error fetching todos:", error);
                return [];
            });
    }

    static async update(formData) {
        const data = {
            post_type: formData.post_type,
            id: formData.id,
            title: formData.title,
            detail: formData.detail,
            deadLine: formData.deadLine,
            is_done: formData.is_done,
            is_deleted: formData.is_deleted,
        };

        return this.fetchFromApi(ApiUrls.manageTodo, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
            .then(() => true)
            .catch((error) => {
                console.error("Error updating todo:", error);
                return false;
            });
    }
}
