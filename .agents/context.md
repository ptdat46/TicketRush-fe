TicketRush - Frontend Context & Guidelines
1. Tổng quan Công nghệ (Tech Stack)
Framework: React.js hoặc Next.js (App Router).

Styling: Tailwind CSS (để xử lý giao diện responsive và grid).

State Management: React Context API hoặc Redux Toolkit (quản lý giỏ hàng vé, thông tin user).

Data Fetching: Axios + React Query (TanStack Query) để quản lý cache và trạng thái loading/error.

Icons: Lucide React hoặc FontAwesome.

2. Quy tắc bắt buộc: API Communication
HARD RULE: Mọi tương tác dữ liệu giữa Frontend và Backend phải tuân thủ tuyệt đối theo file api-doc.txt.

Source of Truth: File api-doc.txt là căn cứ duy nhất để xác định Endpoint, Method (GET, POST, PUT, DELETE), cấu trúc Body và định dạng Response.

Base URL: Tất cả các request phải đi qua một instance Axios cấu hình sẵn baseURL (ví dụ: /api/v1).

Error Handling: Phải bắt các mã lỗi chuẩn từ Backend (401: Unauthorized, 422: Validation Error, 403: Forbidden) để hiển thị thông báo (Toast) phù hợp cho người dùng.

3. Logic hiển thị Sơ đồ ghế (Core Feature)
Đây là phần quan trọng nhất của dự án, yêu cầu xử lý trực quan theo cấu hình từ Backend.

3.1. Render Master Map
Dựa vào master_width và master_length từ API để tạo ra một khung chứa (Container) có tỉ lệ tương ứng.

Sử dụng CSS Grid hoặc HTML5 Canvas để render ô lưới.

Display Types:

rectangular: Render Grid chuẩn.

arc: Sử dụng CSS transform: rotate() hoặc thuật toán bẻ cong tọa độ để tạo hình vòng cung hướng về phía Stage (Sân khấu).

stadium: Render các Zone theo 4 phía (Top, Bottom, Left, Right) bao quanh tâm.

3.2. Render Zones & Seats
Mỗi Zone là một Absolute Positioned element dựa trên pos_x, pos_y của Master Map.

Zone ghế ngồi (is_seating: true): Render các ô ghế nhỏ bên trong.

Màu sắc ghế lấy từ trường color của Zone.

Trạng thái ghế: available (màu Zone), locked (màu xám nhạt/đang xử lý), sold (màu đỏ/đã bán).

Zone lối đi (is_seating: false): Để trống hoặc render các icon/màu sắc phân biệt (VD: lối thoát hiểm, lối đi bộ).

4. Quản lý trạng thái Đặt vé
Seat Selection: Người dùng có thể click chọn nhiều ghế. Lưu danh sách ghế đang chọn vào Local State.

Countdown Timer: Khi bắt đầu giữ chỗ (status: locked), Frontend phải hiển thị đồng hồ đếm ngược 10 phút. Nếu hết 10 phút mà chưa "Xác nhận thanh toán", phải thông báo và xóa trạng thái chọn ghế.

Real-time Update: Sử dụng Polling (gọi API mỗi 5-10 giây) hoặc WebSockets để cập nhật trạng thái ghế ngay lập tức nếu có người khác vừa mua mất, tránh việc User chọn vào ghế đã bị bán.

5. Các màn hình chính (Pages)
Homepage: Danh sách sự kiện, tìm kiếm, lọc theo thể loại.

Event Detail & Seat Map: Hiển thị thông tin sự kiện và sơ đồ ghế trực quan để chọn.

Checkout Preview: Hiển thị đơn hàng gồm các ghế đã chọn, tổng tiền và nút "XÁC NHẬN THANH TOÁN" (giả lập).

My Tickets: Danh sách vé đã mua kèm QR Code (được gen từ chuỗi qr_code nhận từ API).

Organizer Dashboard (Dành cho người tạo):

Công cụ vẽ Map (nhập kích thước, tọa độ Zone).

Biểu đồ thống kê (Dùng Chart.js hoặc Recharts) cho độ tuổi và giới tính.

6. UX/UI Best Practices
Loading States: Hiển thị Skeleton Screen khi đang tải dữ liệu Map (vì dữ liệu ghế có thể rất lớn).

Optimistic UI: Khi User click chọn ghế, hãy đổi màu ghế ngay lập tức trên UI trước khi nhận phản hồi từ API (sau đó rollback nếu API báo lỗi).

Responsive: Map có thể rất rộng, cần hỗ trợ tính năng Zoom hoặc Scroll ngang/dọc trên thiết bị di động.

No Refund Policy: Hiển thị cảnh báo rõ ràng tại bước thanh toán: "Vé đã mua không được phép hoàn trả".