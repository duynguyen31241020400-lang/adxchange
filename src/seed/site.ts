export const clientNames = [
  'Thế Giới Di Động',
  'Điện Máy Xanh',
  'TopZone',
  'An Khang',
  'Nguyễn Kim',
  'MoMo',
  'Toshiba',
  'Samsung',
  'Castrol',
  'Nestlé',
  'Nutrinest',
  'URC',
  'Galaxy Cinema',
  'Thiên Long',
  'Philips',
  'Khải Hoàn Land',
  'Kim Dental',
  'LG Clinic',
] as const

/** Brand mark files under seed-media/logos (Wikimedia zip + user extras). Nestlé/Nutrinest live in public/clients via clientLogos.ts. */
export const clientLogoFiles: Record<string, string> = {
  Samsung: 'logos/Samsung.png',
  Philips: 'logos/Philips.png',
  Toshiba: 'logos/Toshiba.png',
  Castrol: 'logos/Castrol.png',
  'Thế Giới Di Động': 'logos/TheGioiDiDong.png',
  'Điện Máy Xanh': 'logos/DienMayXanh.png',
  'An Khang': 'logos/AnKhang.png',
  'Nguyễn Kim': 'logos/NguyenKim.png',
  URC: 'logos/URC.png',
  TopZone: 'logos/TopZone.png',
  MoMo: 'logos/MoMo.png',
  'Galaxy Cinema': 'logos/GalaxyCinema.png',
  'Thiên Long': 'logos/ThienLong.png',
  'Khải Hoàn Land': 'logos/KhaiHoanLand.png',
  'Kim Dental': 'logos/KimDental.png',
  'LG Clinic': 'logos/LGClinic.png',
}

export const faqsSeed = [
  {
    order: 1,
    question: 'ADX có nhận làm trọn gói không?',
    answer:
      'Có. ADX lo từ lên ý tưởng, lập kế hoạch, sản xuất, xin phép đến triển khai và nghiệm thu. Khách chỉ cần làm việc với một đầu mối.',
  },
  {
    order: 2,
    question: 'ADX làm ở những khu vực nào?',
    answer:
      'TP. Hồ Chí Minh, Hà Nội và các tỉnh thành khác, thông qua mạng lưới đối tác trên toàn quốc.',
  },
  {
    order: 3,
    question: 'ADX có hỗ trợ xin giấy phép quảng cáo, roadshow không?',
    answer:
      'Có. ADX hỗ trợ thủ tục đăng ký nội dung quảng cáo và giấy phép roadshow theo quy định từng địa phương.',
  },
  {
    order: 4,
    question: 'Bao lâu thì chạy được chiến dịch?',
    answer:
      'Tùy hạng mục. Biển quảng cáo có sẵn có thể lên trong vài ngày. Roadshow và sự kiện thường cần 1 đến 2 tuần để sản xuất và xin phép.',
  },
  {
    order: 5,
    question: 'Làm sao để nhận báo giá?',
    answer:
      'Gọi hotline, Zalo hoặc gửi email kèm mục tiêu, thời gian và ngân sách dự kiến. ADX gửi đề xuất và báo giá trong vòng 24 giờ làm việc.',
  },
] as const

export const siteSettingsSeed = {
  displayName: 'ADX',
  slogan: 'ADX. Không thể không thấy.',
  heroSubline: 'Quảng cáo ngoài trời · Roadshow · Sự kiện · TP. Hồ Chí Minh',
  heroBanners: [
    {
      file: 'hero/roadshow-xe-buyt-2-tang.webp',
      alt: 'Xe buýt 2 tầng quảng cáo chạy trên đường phố TP.HCM',
      caption: 'Chạy một vòng, cả thành phố biết tên.',
    },
    {
      file: 'hero/roadshow-xe-ban-tai-toshiba.webp',
      alt: 'Xe bán tải Toshiba x Điện Máy Xanh trên phố',
      caption: 'Xe chạy tới đâu, khách theo tới đó.',
    },
    {
      file: 'hero/roadshow-human-billboard-nguyenkim.webp',
      alt: 'Human walking billboard Nguyễn Kim trên phố Sài Gòn',
      caption: 'Đi ngang mà không nhìn? Khó lắm.',
    },
  ],
  stats: [
    { value: '30+', label: 'Thương hiệu và agency' },
    { value: '100+', label: 'Chiến dịch' },
    { value: '1.000+', label: 'KOL/KOC' },
    { value: 'Gold', label: 'TikTok Partner Agency' },
  ],
  hotline: '+84939899283',
  hotlineLabel: '(+84) 939 899 283, Mr. Cường',
  zalo: '0939 899 283',
  zaloUrl: 'https://zalo.me/0939899283',
  email: 'cuong@adxchange.agency',
  officeAddress: 'P.4, Tầng 1, 49 Điện Biên Phủ, Phường Tân Định, TP. Hồ Chí Minh',
  branchAddress: 'Tòa nhà Saigon Paragon, Số 3 Nguyễn Lương Bằng, Phường Tân Mỹ, TP. Hồ Chí Minh',
  social: [
    { label: 'Facebook', url: '#' },
    { label: 'TikTok', url: '#' },
    { label: 'LinkedIn', url: '#' },
  ],
  legalName: 'Công ty TNHH Nine Dozen',
  taxId: '0316555777',
  foundedYear: '[Năm thành lập]',
}

export const aboutSeed = {
  intro:
    'ADX là công ty quảng cáo tại TP. Hồ Chí Minh. Bọn mình làm biển quảng cáo ngoài trời, roadshow, sự kiện tại điểm bán và các chiến dịch quảng cáo trọn gói. Gần 10 năm qua, ADX đã giúp nhiều thương hiệu bán lẻ, hàng tiêu dùng, công nghệ và bất động sản được nhiều người biết đến hơn, cả ngoài đường lẫn trên mạng.',
  vision: 'Là agency đầu tiên các thương hiệu nghĩ đến khi cần quảng cáo ngoài trời và roadshow.',
  mission: 'Giúp thương hiệu được nhìn thấy và được nhớ, với chi phí hợp lý và kết quả rõ ràng.',
  values: [
    { title: 'Làm thật', description: 'Nói được, làm được' },
    { title: 'Rõ ràng', description: 'Chi phí minh bạch, báo cáo đầy đủ' },
    { title: 'Cùng lớn', description: 'Khách hàng phát triển thì ADX mới phát triển' },
  ],
  milestones: [
    {
      year: '[Năm]',
      content: 'Thành lập Adxchange, khởi đầu với quảng cáo ngoài trời và trade marketing',
    },
    {
      year: '[Năm]',
      content: 'Triển khai roadshow, sự kiện cho Thế Giới Di Động, Điện Máy Xanh, Nguyễn Kim',
    },
    {
      year: '01/2025',
      content: 'Ra mắt dịch vụ TikTok Ads, đạt TikTok Gold Partner Agency',
    },
    {
      year: '2025',
      content:
        'Mở rộng livestream trọn gói và sản xuất nội dung TikTok (series "Chuyện Nhà" × Nguyễn Kim)',
    },
    {
      year: '2026',
      content: 'Đổi tên thương hiệu thành ADX, tập trung Branding, OOH và Below-the-line',
    },
  ],
  team: [{ name: '[...]', title: '[...]', photo: null }],
}

export const privacyPlainSections = [
  {
    heading: 'Dữ liệu thu thập',
    body: '[...] Họ tên, số điện thoại, email, công ty và nội dung yêu cầu khi bạn gửi form liên hệ trên website.',
  },
  {
    heading: 'Mục đích',
    body: '[...] Liên hệ tư vấn, gửi báo giá và hỗ trợ chiến dịch theo yêu cầu của bạn.',
  },
  {
    heading: 'Thời gian lưu',
    body: '[...] Lưu trong thời gian cần thiết để xử lý yêu cầu và theo nghĩa vụ pháp lý áp dụng.',
  },
  {
    heading: 'Quyền của chủ dữ liệu',
    body: '[...] Bạn có quyền yêu cầu xem, sửa hoặc xóa dữ liệu cá nhân đã cung cấp.',
  },
  {
    heading: 'Yêu cầu xóa dữ liệu',
    body: 'Gửi yêu cầu tới cuong@adxchange.agency. Công ty TNHH Nine Dozen sẽ xử lý theo quy định.',
  },
  {
    heading: 'Liên hệ',
    body: 'Công ty TNHH Nine Dozen · Email cuong@adxchange.agency · Hotline (+84) 939 899 283.',
  },
]
