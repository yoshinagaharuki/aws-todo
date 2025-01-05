import { Todo } from "../models/todo.js";
import { Message } from "../component/message.js";
import { ApiUrls } from "./config.js";

export class TodoService {

    /**
     * API 通信を行う関数の作成。
     */
    static async fetchFromApi(url, options = {}) {
        // 新しいリクエスト前に既存のメッセージを削除
        Message.dispose();
        return fetch(url, options)
            .then((res) => {
                if(!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .catch((error) => {
                // エラーが発生した場合、エラーメッセージをコンソールに表示
                console.error("API error:", error);
                // エラーを再スローして呼び出し元に通知
                throw error;
            });


    }

    /**
     * GetTodo を呼び出す関数。
     */
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
                            item.is_deleted,
                        )
                )
            )
            .catch((error) => {
                console.error("Error fetching todos:", error);
                return [];
            });
    }

    /**
     * ManageTodo を呼び出す関数。
     */
    static async update(formData) {
        // サーバーに送信するデータの作成
        const data = {
            post_type: formData.post_type,
            id: formData.id,
            title: formData.title,
            detail: formData.detail,
            deadLine: formData.deadLine,
            is_done: formData.is_done,
            is_deleted: formData.is_deleted,
        };
        return this.fetchFromApi(ApiUrls.manageTodo,  {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        })
            .then(() => true)
            .catch((error) => {
                console.error("Error updating todo:", error);
                return false;    
            });
    }
}


