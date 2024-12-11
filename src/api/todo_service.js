import { Todo } from "../models/todo.js";
import { Message } from "../component/message.js";
import { ApiUrls } from "./config.js";

export class TodoService {
    /**
     * APIからデータを取得する汎用関数。
     * @param {string} url - リクエスト先のURL。
     * @param {object} options - fetch関数のオプション（メソッド、ヘッダー、ボディなど）。
     * @returns {Promise<object>} サーバーからのレスポンスデータ（JSON形式）。
     * @throws {Error} ステータスエラーまたは通信エラーが発生した場合。
     */
    static async fetchFromApi(url, options = {}) {
        // 新しいリクエスト前に既存のメッセージを削除
        Message.dispose();

        return fetch(url, options)
            .then((res) => {
                if (!res.ok) {
                    // ステータスコードが200系以外の場合はエラーをスロー
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                // レスポンスをJSONとして返却
                return res.json();
            })
            .catch((error) => {
                console.error("API error:", error);
                // エラーを呼び出し元に伝播
                throw error;
            });
    }

    /**
     * サーバーからすべてのTodoデータを取得。
     * @returns {Promise<Todo[]>} Todoデータの配列。
     * @throws {Error} 通信エラーが発生した場合。
     *
     * 返却されるJSONデータ形式:
     * [
     *   {
     *     "id": 1,               // TodoのユニークID (number)
     *     "title": "タイトル",   // Todoのタイトル (string)
     *     "detail": "詳細説明",  // Todoの詳細内容 (string)
     *     "deadLine": "2024-12-31", // 締め切り日
     *     "is_done": false,      // Todoの完了ステータス (boolean)
     *     "is_deleted": false    // Todoの削除フラグ (boolean)
     *   },
     *   {
     *     "id": 2,
     *     "title": "別のTodo",
     *     "detail": "詳細はこちら",
     *     "deadLine": "2025-01-15",
     *     "is_done": true,
     *     "is_deleted": false
     *   }
     * ]
     *
     */
    static async getAll() {
        return this.fetchFromApi(ApiUrls.getTodo)
            .then((data) =>
                // サーバーから取得したデータをTodoクラスのインスタンスに変換
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
                // エラー時は空配列を返却
                return [];
            });
    }

    /**
     * サーバーにTodoデータを送信して新規作成または更新を実行。
     * @param {object} formData - ユーザーが入力したTodoデータ。
     * @param {string} formData.post_type - 操作タイプ。
     *   - `create_new`: 新規作成
     *   - `update_content`: `title`, `detail`, `deadLine` の更新
     *   - `update_is_done`: `is_done` の変更
     *   - `update_is_deleted`: `is_deleted`を`true``にする(todoの削除)
     * @param {number} formData.id - TodoのID（更新時のみ必要）。
     * @param {string} formData.title - Todoのタイトル。
     * @param {string} formData.detail - Todoの詳細。
     * @param {string} formData.deadLine - Todoの締め切り日。
     * @param {boolean} formData.is_done - Todoの完了ステータス。
     * @param {boolean} formData.is_deleted - Todoの削除フラグ。
     * @returns {Promise<boolean>} 成功時はtrue、失敗時はfalseを返却。
     *
     *
     *  formDataの例：
     *  {
     *      post_type: "create_new", // 新規作成を示す
     *      title: "Buy groceries", // Todoのタイトル
     *      detail: "Milk, bread, eggs", // Todoの詳細
     *      deadLine: "2024-12-15", // 締め切り日
     *      is_done: false, // 完了状態（新規作成時は未完了）
     *      is_deleted: false, // 削除フラグ（新規作成時は削除されていない）
     *  }
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

        return (
            this.fetchFromApi(ApiUrls.manageTodo, {
                method: "POST", // POSTメソッドで送信
                headers: { "Content-Type": "application/json" }, // JSON形式のデータを指定
                body: JSON.stringify(data), // データをJSON文字列に変換して送信
            })
                /* 返却されるjsonデータ例：
                 * {message: 'Todo is_deleted updated successfully!'}
                 */
                .then(() => true) // 成功時はtrueを返却
                .catch((error) => {
                    console.error("Error updating todo:", error);
                    // エラー時はfalseを返却
                    return false;
                })
        );
    }
}
