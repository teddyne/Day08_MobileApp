# Trả lời câu hỏi bổ sung – Buổi 8

**1. Cờ `ready`.**
Ở lần render đầu, giỏ hàng trong store còn là mảng rỗng `[]`, còn dữ liệu cũ vẫn nằm trong AsyncStorage và đang được đọc bất đồng bộ. Nếu bỏ điều kiện `ready`, effect của `useAutoPersist` chạy ngay sau render đầu và ghi `[]` đè lên khóa `@bookstore/cart` trước khi `loadJSON` kịp trả về. Khi đọc xong thì dữ liệu cũ đã bị mất, nên mở lại app giỏ luôn rỗng. Cờ `ready` chỉ bật sau khi đọc xong và đã `dispatch(hydrateCart(...))`, nên việc ghi chỉ bắt đầu khi store đã có dữ liệu đúng.

**2. Token giả.**
- Mật khẩu nằm sẵn dạng chữ thô trong `db.json` và được so ngay ở phía app, nên ai mở app/gọi API cũng đọc được mật khẩu của mọi người dùng.
- Token do app tự tạo nên không có chữ ký, ai cũng có thể làm giả token để đóng vai người khác; server cũng không có cách nào kiểm chứng.

Hệ thống thật: **server** kiểm tra mật khẩu (so với mật khẩu đã băm bằng bcrypt/argon2) và cấp token có thời hạn (JWT hoặc session token). App nên lưu token bằng **expo-secure-store** (Keychain trên iOS, Keystore trên Android) thay vì AsyncStorage, vì AsyncStorage lưu chữ thô, không mã hóa.

**3. Hai effect trong `CartItemRow`.**
Nếu xóa effect `setQty(item.quantity)` thì `qty` chỉ lấy giá trị `item.quantity` ở lần render đầu của dòng đó. Số hiển thị sẽ lệch store khi store đổi từ nơi khác mà dòng không bị mount lại, ví dụ: giỏ được nạp từ AsyncStorage sau khi dòng đã render; hoặc `setQty` ở store bị giới hạn/chuẩn hóa lại (kẹp theo tồn kho); hoặc bấm "Thêm vào giỏ" cùng cuốn sách đó từ nơi khác làm số lượng trong store tăng. Khi đó nút vẫn hiện số cũ, còn tổng tiền ở chân giỏ (tính từ store) thì đã khác.

**4. Một nguồn state.**
Nếu mỗi `HeartButton` giữ `useState` riêng thì mỗi nơi là một bản sao độc lập: thả tim ở lưới sách, vào trang chi tiết vẫn thấy ♡ trắng (và ngược lại), tải lại thì mất hết vì không ai lưu. Với store, mọi `HeartButton` đều đọc cùng một mảng `ids` qua `useWishlist()` và cùng gọi `toggle`; store đổi thì mọi component đang đọc nó tự render lại, nên tim ở lưới, ở chi tiết và màn Yêu thích luôn khớp nhau, và chỉ cần một chỗ (`useAutoPersist`) để lưu.

**5. Nút 👁 hiện/ẩn mật khẩu.**
Đã làm trong `src/screens/LoginScreen.tsx`:

```tsx
const [showPassword, setShowPassword] = useState(false);

<View>
  <FormField label="Mật khẩu" value={password} onChangeText={setPassword}
             error={errors.password} secureTextEntry={!showPassword} />
  <Pressable style={styles.eye} onPress={() => setShowPassword((v) => !v)} hitSlop={8}
             accessibilityLabel={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>
    <Text style={[styles.eyeIcon, !showPassword && styles.eyeOff]}>👁</Text>
  </Pressable>
</View>
```

Biểu tượng 👁 nằm ở mép phải ô Mật khẩu (`position: "absolute"`); khi đang ẩn mật khẩu biểu tượng mờ đi, bấm vào thì hiện chữ và biểu tượng sáng lên.

> Ảnh chụp màn hình: môi trường làm bài không chạy được Expo, nên chưa chụp. Bạn chạy `npx expo start`, mở màn Đăng nhập, bấm 👁 và chụp lại để nộp.
