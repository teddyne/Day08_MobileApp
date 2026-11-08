import { useEffect } from "react";
import { saveJSON } from "../storage/storage";

// HOOK CHUNG: mỗi khi `value` đổi (và đã nạp xong dữ liệu cũ) → tự ghi vào AsyncStorage.
// Dùng cho cart, wishlist… — không phải viết lại effect ở từng nơi.
export function useAutoPersist<T>(key: string, value: T, ready: boolean) {
  useEffect(() => {
    // Chỉ ghi khi đã đọc xong dữ liệu cũ, tránh ghi đè bằng giá trị rỗng của lần render đầu
    if (ready) saveJSON(key, value);
  }, [key, value, ready]);
}
