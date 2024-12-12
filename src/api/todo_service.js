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
    }

    /**
     * GetTodo を呼び出す関数。
     */
    static async getAll() {}

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
    }
}
