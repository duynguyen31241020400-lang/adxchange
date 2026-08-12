function polishSoftLaunch() {
  document.querySelectorAll('.demo-note, .notice, .top-pill').forEach((el) => el.remove());

  const exactReplacements = new Map([
    ['Đăng nhập demo', 'Đăng nhập'],
    ['Vai trò demo', 'Vai trò'],
    ['Tiếp tục với demo', 'Tiếp tục'],
    ['Tạo campaign demo', 'Tạo campaign'],
    ['Đăng ký màn hình demo', 'Đăng ký màn hình'],
    ['Demo earnings', 'Thu nhập tháng này'],
    ['Demo revenue', 'Doanh thu'],
    ['Demo budget signal', 'Ngân sách dự kiến'],
    ['Prototype total', 'Ước tính'],
    ['Prototype estimate', 'Ước tính'],
    ['Screen demo đã sẵn sàng.', 'Màn hình đã sẵn sàng.'],
    ['Connect demo screen', 'Kết nối màn hình'],
    ['✓ Demo screen connected', '✓ Đã kết nối màn hình'],
    ['+ Add demo content', '+ Thêm nội dung'],
    ['Strong intent signal', 'YÊU CẦU ĐÃ GHI NHẬN'],
    ['Campaign request recorded.', 'Yêu cầu chiến dịch đã được ghi nhận.'],
    ['Production sẽ chuyển sang payment/approval. MVP chỉ ghi nhận intent.', 'Đội ngũ Adxchange sẽ liên hệ để xác nhận các bước tiếp theo.'],
    ['Production cần device identity và secure pairing token.', 'Màn hình đã được kết nối thành công.']
  ]);

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach((node) => {
    let text = node.nodeValue || '';
    exactReplacements.forEach((replacement, original) => {
      text = text.split(original).join(replacement);
    });
    node.nodeValue = text;
  });

  const internalPatterns = [
    /prototype/i,
    /\bdemo\b/i,
    /\bMVP\b/i,
    /production/i,
    /deck\/brief/i,
    /pitch deck/i,
    /chưa được .*xác nhận/i,
    /cần xác nhận/i,
    /chưa được định nghĩa/i,
    /chưa được khóa/i,
    /feature flag/i,
    /hard-code/i,
    /business rules/i,
    /route boundary/i,
    /strong intent/i
  ];

  document.querySelectorAll('p, .mini').forEach((el) => {
    const text = (el.textContent || '').trim();
    if (internalPatterns.some((pattern) => pattern.test(text))) el.remove();
  });

  document.querySelectorAll('.badge').forEach((el) => {
    if (/demo/i.test(el.textContent || '')) el.textContent = 'Nội dung';
  });

  const footer = document.querySelector('.footer .container');
  if (footer) footer.textContent = 'ADXCHANGE PLATFORM';
}

const softLaunchRender = render;
render = function () {
  softLaunchRender();
  polishSoftLaunch();
};

polishSoftLaunch();
