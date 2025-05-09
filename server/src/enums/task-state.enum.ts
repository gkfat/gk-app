export enum TaskState {
    /**
     * 等待被執行（預設）
     */
    PENDING,
    /**
     * 已放入執行 queue 中等待處理
     */
    QUEUED,
    /**
     * 正在執行中
     */
    PROCESSING,
    /**
     * 呼叫成功並記錄 response
     */
    SUCCESS,
    /**
     * 呼叫失敗，有錯誤回應
     */
    FAILED,
    /**
     * 重試中（視 retry policy）
     */
    RETRYING,
    /**
     * 被手動取消
     */
    CANCELLED,
    /**
     * 超過 timeout 或條件不符而跳過
     */
    SKIPPED
}