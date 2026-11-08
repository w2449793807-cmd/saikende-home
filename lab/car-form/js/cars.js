(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.CarData = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const categories = [
  {
    "id": "lt20_fuel_sedan",
    "name": "20万以下燃油轿车",
    "roman": "I",
    "meta": "燃油 / 指导价 20 万以下",
    "description": "先看线条，再看谁更顺眼",
    "cover": "assets/cars/003.webp",
    "count": 16,
    "choiceCount": 15
  },
  {
    "id": "lt20_fuel_suv",
    "name": "20万以下燃油SUV",
    "roman": "II",
    "meta": "燃油 / 指导价 20 万以下",
    "description": "家用尺寸，也有各自的精气神",
    "cover": "assets/cars/v3-020.webp",
    "count": 16,
    "choiceCount": 15
  },
  {
    "id": "lt20_nev_sedan",
    "name": "20万以下新能源轿车",
    "roman": "III",
    "meta": "新能源 / 指导价 20 万以下",
    "description": "这个价位，设计已经不太将就",
    "cover": "assets/cars/022.webp",
    "count": 16,
    "choiceCount": 15
  },
  {
    "id": "lt20_nev_suv",
    "name": "20万以下新能源SUV",
    "roman": "IV",
    "meta": "新能源 / 指导价 20 万以下",
    "description": "车身变高以后，比例更重要",
    "cover": "assets/cars/018.webp",
    "count": 16,
    "choiceCount": 15
  },
  {
    "id": "20to50_fuel_sedan",
    "name": "20–50万燃油轿车",
    "roman": "V",
    "meta": "燃油 / 指导价 20–50 万",
    "description": "到了这个预算，细节开始说话",
    "cover": "assets/cars/033.webp",
    "count": 16,
    "choiceCount": 15
  },
  {
    "id": "20to50_fuel_suv",
    "name": "20–50万燃油SUV",
    "roman": "VI",
    "meta": "燃油 / 指导价 20–50 万",
    "description": "豪华感，先从体态开始",
    "cover": "assets/cars/v3-082.webp",
    "count": 16,
    "choiceCount": 15
  },
  {
    "id": "20to50_nev_sedan",
    "name": "20–50万新能源轿车",
    "roman": "VII",
    "meta": "新能源 / 指导价 20–50 万",
    "description": "新品牌最敢做造型的一组",
    "cover": "assets/cars/050.webp",
    "count": 16,
    "choiceCount": 15
  },
  {
    "id": "20to50_nev_suv",
    "name": "20–50万新能源SUV",
    "roman": "VIII",
    "meta": "新能源 / 指导价 20–50 万",
    "description": "大车身，也能做出轻盈感",
    "cover": "assets/cars/052.webp",
    "count": 16,
    "choiceCount": 15
  },
  {
    "id": "50to100_sedan",
    "name": "50–100万轿车",
    "roman": "IX",
    "meta": "指导价 50–100 万",
    "description": "旗舰气场，各有各的解法",
    "cover": "assets/cars/066.webp",
    "count": 16,
    "choiceCount": 15
  },
  {
    "id": "50to100_suv",
    "name": "50–100万SUV",
    "roman": "X",
    "meta": "指导价 50–100 万",
    "description": "体量、线条和收尾的较量",
    "cover": "assets/cars/v3-147.webp",
    "count": 16,
    "choiceCount": 15
  },
  {
    "id": "luxury_sedan",
    "name": "奢华轿车",
    "roman": "XI",
    "meta": "奢华车型 / 不限价格",
    "description": "四门旗舰，怎样把贵写得含蓄",
    "cover": "assets/cars/081.webp",
    "count": 16,
    "choiceCount": 15
  },
  {
    "id": "luxury_suv",
    "name": "奢华SUV",
    "roman": "XII",
    "meta": "奢华车型 / 不限价格",
    "description": "超大车身，也讲究分寸",
    "cover": "assets/cars/082.webp",
    "count": 16,
    "choiceCount": 15
  },
  {
    "id": "sports",
    "name": "跑车",
    "roman": "XIII",
    "meta": "双门跑车 / 不限价格",
    "description": "低、宽、长，一眼就能分出偏好",
    "cover": "assets/cars/104.webp",
    "count": 16,
    "choiceCount": 15
  }
];
  const cars = [
  {
    "id": "car-001",
    "categoryId": "lt20_fuel_sedan",
    "brand": "大众",
    "model": "朗逸",
    "trim": "1.5L 自动得逸版",
    "image": "assets/cars/001.webp",
    "imageAlt": "大众 朗逸 1.5L 自动得逸版 前三侧外观照片"
  },
  {
    "id": "car-002",
    "categoryId": "lt20_fuel_sedan",
    "brand": "日产",
    "model": "轩逸",
    "trim": "1.6L CVT 悦享版",
    "image": "assets/cars/002.webp",
    "imageAlt": "日产 轩逸 1.6L CVT 悦享版 前三侧外观照片"
  },
  {
    "id": "car-003",
    "categoryId": "lt20_fuel_sedan",
    "brand": "本田",
    "model": "思域",
    "trim": "240TURBO CVT 智趣Plus",
    "image": "assets/cars/003.webp",
    "imageAlt": "本田 思域 240TURBO CVT 智趣Plus 前三侧外观照片"
  },
  {
    "id": "car-004",
    "categoryId": "lt20_fuel_sedan",
    "brand": "丰田",
    "model": "卡罗拉",
    "trim": "1.2T S-CVT 先锋版",
    "image": "assets/cars/004.webp",
    "imageAlt": "丰田 卡罗拉 1.2T S-CVT 先锋版 前三侧外观照片"
  },
  {
    "id": "car-005",
    "categoryId": "lt20_fuel_sedan",
    "brand": "别克",
    "model": "君威",
    "trim": "25T 超享版",
    "image": "assets/cars/005.webp",
    "imageAlt": "别克 君威 25T 超享版 前三侧外观照片"
  },
  {
    "id": "car-006",
    "categoryId": "lt20_fuel_sedan",
    "brand": "福特",
    "model": "蒙迪欧",
    "trim": "2.0T EcoBoost 豪华型",
    "image": "assets/cars/006.webp",
    "imageAlt": "福特 蒙迪欧 2.0T EcoBoost 豪华型 前三侧外观照片"
  },
  {
    "id": "car-007",
    "categoryId": "lt20_fuel_sedan",
    "brand": "吉利",
    "model": "星瑞",
    "trim": "2.0TD 望月版",
    "image": "assets/cars/007.webp",
    "imageAlt": "吉利 星瑞 2.0TD 望月版 前三侧外观照片"
  },
  {
    "id": "car-008",
    "categoryId": "lt20_fuel_sedan",
    "brand": "长安",
    "model": "UNI-V",
    "trim": "2.0T 运动版",
    "image": "assets/cars/008.webp",
    "imageAlt": "长安 UNI-V 2.0T 运动版 前三侧外观照片"
  },
  {
    "id": "car-009",
    "categoryId": "lt20_fuel_sedan",
    "brand": "奇瑞",
    "model": "艾瑞泽8",
    "trim": "2.0T 御+",
    "image": "assets/cars/009.webp",
    "imageAlt": "奇瑞 艾瑞泽8 2.0T 御+ 前三侧外观照片"
  },
  {
    "id": "car-010",
    "categoryId": "lt20_fuel_sedan",
    "brand": "名爵",
    "model": "MG7",
    "trim": "2.0T Trophy+ 超级运动版",
    "image": "assets/cars/010.webp",
    "imageAlt": "名爵 MG7 2.0T Trophy+ 超级运动版 前三侧外观照片"
  },
  {
    "id": "car-011",
    "categoryId": "lt20_fuel_sedan",
    "brand": "红旗",
    "model": "H5",
    "trim": "1.5T DCT 旗韵版",
    "image": "assets/cars/011.webp",
    "imageAlt": "红旗 H5 1.5T DCT 旗韵版 前三侧外观照片"
  },
  {
    "id": "car-012",
    "categoryId": "lt20_fuel_sedan",
    "brand": "现代",
    "model": "伊兰特",
    "trim": "1.5L CVT 尊贵版",
    "image": "assets/cars/013.webp",
    "imageAlt": "现代 伊兰特 1.5L CVT 尊贵版 前三侧外观照片"
  },
  {
    "id": "car-013",
    "categoryId": "lt20_fuel_sedan",
    "brand": "雪佛兰",
    "model": "迈锐宝XL",
    "trim": "2.0T 自动锐联版",
    "image": "assets/cars/015.webp",
    "imageAlt": "雪佛兰 迈锐宝XL 2.0T 自动锐联版 前三侧外观照片"
  },
  {
    "id": "car-014",
    "categoryId": "lt20_fuel_sedan",
    "brand": "起亚",
    "model": "K3",
    "trim": "1.5L CVT 尊贵版",
    "image": "assets/cars/v3-014.webp",
    "imageAlt": "起亚 K3 1.5L CVT 尊贵版 前三侧外观照片"
  },
  {
    "id": "car-015",
    "categoryId": "lt20_fuel_sedan",
    "brand": "马自达",
    "model": "3 昂克赛拉",
    "trim": "2.0L 质尊版",
    "image": "assets/cars/v3-015.webp",
    "imageAlt": "马自达 3 昂克赛拉 2.0L 质尊版 前三侧外观照片"
  },
  {
    "id": "car-016",
    "categoryId": "lt20_fuel_sedan",
    "brand": "标致",
    "model": "508L",
    "trim": "400THP 驭动旗舰版",
    "image": "assets/cars/v3-016.webp",
    "imageAlt": "标致 508L 400THP 驭动旗舰版 前三侧外观照片"
  },
  {
    "id": "car-017",
    "categoryId": "lt20_fuel_suv",
    "brand": "马自达",
    "model": "CX-50 行也",
    "trim": "2.5L 尊行版",
    "image": "assets/cars/012.webp",
    "imageAlt": "马自达 CX-50 行也 2.5L 尊行版 前三侧外观照片"
  },
  {
    "id": "car-018",
    "categoryId": "lt20_fuel_suv",
    "brand": "起亚",
    "model": "狮铂拓界",
    "trim": "1.5T 两驱尊贵版",
    "image": "assets/cars/016.webp",
    "imageAlt": "起亚 狮铂拓界 1.5T 两驱尊贵版 前三侧外观照片"
  },
  {
    "id": "car-019",
    "categoryId": "lt20_fuel_suv",
    "brand": "本田",
    "model": "CR-V",
    "trim": "240TURBO 两驱活力版",
    "image": "assets/cars/v3-019.webp",
    "imageAlt": "本田 CR-V 240TURBO 两驱活力版 前三侧外观照片"
  },
  {
    "id": "car-020",
    "categoryId": "lt20_fuel_suv",
    "brand": "丰田",
    "model": "RAV4荣放",
    "trim": "2.0L CVT 两驱风尚Plus版",
    "image": "assets/cars/v3-020.webp",
    "imageAlt": "丰田 RAV4荣放 2.0L CVT 两驱风尚Plus版 前三侧外观照片"
  },
  {
    "id": "car-021",
    "categoryId": "lt20_fuel_suv",
    "brand": "大众",
    "model": "T-ROC探歌",
    "trim": "1.5T DSG 辰光版",
    "image": "assets/cars/v3-021.webp",
    "imageAlt": "大众 T-ROC探歌 1.5T DSG 辰光版 前三侧外观照片"
  },
  {
    "id": "car-022",
    "categoryId": "lt20_fuel_suv",
    "brand": "吉利",
    "model": "星越L",
    "trim": "2.0TD 两驱云起版",
    "image": "assets/cars/v3-022.webp",
    "imageAlt": "吉利 星越L 2.0TD 两驱云起版 前三侧外观照片"
  },
  {
    "id": "car-023",
    "categoryId": "lt20_fuel_suv",
    "brand": "长安",
    "model": "CS75 PLUS",
    "trim": "第四代 1.5T 新蓝鲸 尊享型",
    "image": "assets/cars/v3-023.webp",
    "imageAlt": "长安 CS75 PLUS 第四代 1.5T 新蓝鲸 尊享型 前三侧外观照片"
  },
  {
    "id": "car-024",
    "categoryId": "lt20_fuel_suv",
    "brand": "奇瑞",
    "model": "瑞虎8 PLUS",
    "trim": "1.6T 尊贵型",
    "image": "assets/cars/v3-024.webp",
    "imageAlt": "奇瑞 瑞虎8 PLUS 1.6T 尊贵型 前三侧外观照片"
  },
  {
    "id": "car-025",
    "categoryId": "lt20_fuel_suv",
    "brand": "哈弗",
    "model": "H6",
    "trim": "1.5T 自动两驱Max版",
    "image": "assets/cars/v3-025.webp",
    "imageAlt": "哈弗 H6 1.5T 自动两驱Max版 前三侧外观照片"
  },
  {
    "id": "car-026",
    "categoryId": "lt20_fuel_suv",
    "brand": "日产",
    "model": "逍客",
    "trim": "2.0L CVT 旗舰版",
    "image": "assets/cars/v3-026.webp",
    "imageAlt": "日产 逍客 2.0L CVT 旗舰版 前三侧外观照片"
  },
  {
    "id": "car-027",
    "categoryId": "lt20_fuel_suv",
    "brand": "福特",
    "model": "领睿",
    "trim": "1.5T 铂领型",
    "image": "assets/cars/v3-027.webp",
    "imageAlt": "福特 领睿 1.5T 铂领型 前三侧外观照片"
  },
  {
    "id": "car-028",
    "categoryId": "lt20_fuel_suv",
    "brand": "现代",
    "model": "途胜L",
    "trim": "1.5T 尊贵版",
    "image": "assets/cars/v3-028.webp",
    "imageAlt": "现代 途胜L 1.5T 尊贵版 前三侧外观照片"
  },
  {
    "id": "car-029",
    "categoryId": "lt20_fuel_suv",
    "brand": "雪佛兰",
    "model": "探界者",
    "trim": "1.5T 四驱拓界版",
    "image": "assets/cars/v3-029.webp",
    "imageAlt": "雪佛兰 探界者 1.5T 四驱拓界版 前三侧外观照片"
  },
  {
    "id": "car-030",
    "categoryId": "lt20_fuel_suv",
    "brand": "别克",
    "model": "昂扬",
    "trim": "1.5T 智享版",
    "image": "assets/cars/v3-030.webp",
    "imageAlt": "别克 昂扬 1.5T 智享版 前三侧外观照片"
  },
  {
    "id": "car-031",
    "categoryId": "lt20_fuel_suv",
    "brand": "名爵",
    "model": "MG ONE",
    "trim": "1.5T 旗舰版",
    "image": "assets/cars/v3-031.webp",
    "imageAlt": "名爵 MG ONE 1.5T 旗舰版 前三侧外观照片"
  },
  {
    "id": "car-032",
    "categoryId": "lt20_fuel_suv",
    "brand": "捷途",
    "model": "X70 PLUS",
    "trim": "1.5T 旗舰版",
    "image": "assets/cars/v3-032.webp",
    "imageAlt": "捷途 X70 PLUS 1.5T 旗舰版 前三侧外观照片"
  },
  {
    "id": "car-033",
    "categoryId": "lt20_nev_sedan",
    "brand": "比亚迪",
    "model": "秦L DM-i",
    "trim": "120KM 领先型",
    "image": "assets/cars/017.webp",
    "imageAlt": "比亚迪 秦L DM-i 120KM 领先型 前三侧外观照片"
  },
  {
    "id": "car-034",
    "categoryId": "lt20_nev_sedan",
    "brand": "吉利",
    "model": "银河L6",
    "trim": "EM-i 140km 星舰版",
    "image": "assets/cars/v3-034.webp",
    "imageAlt": "吉利 银河L6 EM-i 140km 星舰版 前三侧外观照片"
  },
  {
    "id": "car-035",
    "categoryId": "lt20_nev_sedan",
    "brand": "长安",
    "model": "启源A07",
    "trim": "增程 230km 尊贵型",
    "image": "assets/cars/019.webp",
    "imageAlt": "长安 启源A07 增程 230km 尊贵型 前三侧外观照片"
  },
  {
    "id": "car-036",
    "categoryId": "lt20_nev_sedan",
    "brand": "深蓝",
    "model": "SL03",
    "trim": "135Plus增程版",
    "image": "assets/cars/v3-036.webp",
    "imageAlt": "深蓝 SL03 135Plus增程版 前三侧外观照片"
  },
  {
    "id": "car-037",
    "categoryId": "lt20_nev_sedan",
    "brand": "零跑",
    "model": "C01",
    "trim": "增程 316 尊享版",
    "image": "assets/cars/v3-037.webp",
    "imageAlt": "零跑 C01 增程 316 尊享版 前三侧外观照片"
  },
  {
    "id": "car-038",
    "categoryId": "lt20_nev_sedan",
    "brand": "小鹏",
    "model": "MONA M03",
    "trim": "620 超长续航 Max",
    "image": "assets/cars/022.webp",
    "imageAlt": "小鹏 MONA M03 620 超长续航 Max 前三侧外观照片"
  },
  {
    "id": "car-039",
    "categoryId": "lt20_nev_sedan",
    "brand": "埃安",
    "model": "AION S MAX",
    "trim": "80 星辰版",
    "image": "assets/cars/v3-039.webp",
    "imageAlt": "埃安 AION S MAX 80 星辰版 前三侧外观照片"
  },
  {
    "id": "car-040",
    "categoryId": "lt20_nev_sedan",
    "brand": "五菱",
    "model": "星光",
    "trim": "150km 领航型",
    "image": "assets/cars/v3-040.webp",
    "imageAlt": "五菱 星光 150km 领航型 前三侧外观照片"
  },
  {
    "id": "car-041",
    "categoryId": "lt20_nev_sedan",
    "brand": "奇瑞",
    "model": "风云A8",
    "trim": "145km 豪华型",
    "image": "assets/cars/v3-041.webp",
    "imageAlt": "奇瑞 风云A8 145km 豪华型 前三侧外观照片"
  },
  {
    "id": "car-042",
    "categoryId": "lt20_nev_sedan",
    "brand": "东风奕派",
    "model": "eπ007",
    "trim": "530Pro 纯电版",
    "image": "assets/cars/026.webp",
    "imageAlt": "东风奕派 eπ007 530Pro 纯电版 前三侧外观照片"
  },
  {
    "id": "car-043",
    "categoryId": "lt20_nev_sedan",
    "brand": "荣威",
    "model": "D7 DMH",
    "trim": "125km 旗舰版",
    "image": "assets/cars/027.webp",
    "imageAlt": "荣威 D7 DMH 125km 旗舰版 前三侧外观照片"
  },
  {
    "id": "car-044",
    "categoryId": "lt20_nev_sedan",
    "brand": "领克",
    "model": "07 EM-P",
    "trim": "126 长续航 Halo",
    "image": "assets/cars/v3-044.webp",
    "imageAlt": "领克 07 EM-P 126 长续航 Halo 前三侧外观照片"
  },
  {
    "id": "car-045",
    "categoryId": "lt20_nev_sedan",
    "brand": "极狐",
    "model": "阿尔法S5",
    "trim": "560 MAX",
    "image": "assets/cars/v3-045.webp",
    "imageAlt": "极狐 阿尔法S5 560 MAX 前三侧外观照片"
  },
  {
    "id": "car-046",
    "categoryId": "lt20_nev_sedan",
    "brand": "哪吒",
    "model": "S",
    "trim": "增程 1060 Lite版",
    "image": "assets/cars/v3-046.webp",
    "imageAlt": "哪吒 S 增程 1060 Lite版 前三侧外观照片"
  },
  {
    "id": "car-047",
    "categoryId": "lt20_nev_sedan",
    "brand": "宝骏",
    "model": "享境",
    "trim": "PHEV 140km 豪华版",
    "image": "assets/cars/v3-047.webp",
    "imageAlt": "宝骏 享境 PHEV 140km 豪华版 前三侧外观照片"
  },
  {
    "id": "car-048",
    "categoryId": "lt20_nev_sedan",
    "brand": "启辰",
    "model": "D60 EV",
    "trim": "智享版",
    "image": "assets/cars/v3-048.webp",
    "imageAlt": "启辰 D60 EV 智享版 前三侧外观照片"
  },
  {
    "id": "car-049",
    "categoryId": "lt20_nev_suv",
    "brand": "比亚迪",
    "model": "元PLUS",
    "trim": "智驾版 510KM 超越型",
    "image": "assets/cars/v3-049.webp",
    "imageAlt": "比亚迪 元PLUS 智驾版 510KM 超越型 前三侧外观照片"
  },
  {
    "id": "car-050",
    "categoryId": "lt20_nev_suv",
    "brand": "吉利",
    "model": "银河E5",
    "trim": "530km 星舰版",
    "image": "assets/cars/018.webp",
    "imageAlt": "吉利 银河E5 530km 星舰版 前三侧外观照片"
  },
  {
    "id": "car-051",
    "categoryId": "lt20_nev_suv",
    "brand": "长安",
    "model": "启源Q05",
    "trim": "125km 尊贵型",
    "image": "assets/cars/v3-051.webp",
    "imageAlt": "长安 启源Q05 125km 尊贵型 前三侧外观照片"
  },
  {
    "id": "car-052",
    "categoryId": "lt20_nev_suv",
    "brand": "深蓝",
    "model": "S05",
    "trim": "510Max 纯电版",
    "image": "assets/cars/020.webp",
    "imageAlt": "深蓝 S05 510Max 纯电版 前三侧外观照片"
  },
  {
    "id": "car-053",
    "categoryId": "lt20_nev_suv",
    "brand": "零跑",
    "model": "C10",
    "trim": "530 激光雷达版",
    "image": "assets/cars/021.webp",
    "imageAlt": "零跑 C10 530 激光雷达版 前三侧外观照片"
  },
  {
    "id": "car-054",
    "categoryId": "lt20_nev_suv",
    "brand": "埃安",
    "model": "AION Y Plus",
    "trim": "610 智享版",
    "image": "assets/cars/023.webp",
    "imageAlt": "埃安 AION Y Plus 610 智享版 前三侧外观照片"
  },
  {
    "id": "car-055",
    "categoryId": "lt20_nev_suv",
    "brand": "五菱",
    "model": "星光S",
    "trim": "510km 领航型",
    "image": "assets/cars/024.webp",
    "imageAlt": "五菱 星光S 510km 领航型 前三侧外观照片"
  },
  {
    "id": "car-056",
    "categoryId": "lt20_nev_suv",
    "brand": "奇瑞",
    "model": "iCAR 03",
    "trim": "501km 四驱长续航智驾版",
    "image": "assets/cars/025.webp",
    "imageAlt": "奇瑞 iCAR 03 501km 四驱长续航智驾版 前三侧外观照片"
  },
  {
    "id": "car-057",
    "categoryId": "lt20_nev_suv",
    "brand": "哈弗",
    "model": "枭龙MAX",
    "trim": "Hi4 110 Pro",
    "image": "assets/cars/028.webp",
    "imageAlt": "哈弗 枭龙MAX Hi4 110 Pro 前三侧外观照片"
  },
  {
    "id": "car-058",
    "categoryId": "lt20_nev_suv",
    "brand": "捷途",
    "model": "山海T2",
    "trim": "129km 发现版",
    "image": "assets/cars/031.webp",
    "imageAlt": "捷途 山海T2 129km 发现版 前三侧外观照片"
  },
  {
    "id": "car-059",
    "categoryId": "lt20_nev_suv",
    "brand": "极狐",
    "model": "阿尔法T5",
    "trim": "520 MAX",
    "image": "assets/cars/032.webp",
    "imageAlt": "极狐 阿尔法T5 520 MAX 前三侧外观照片"
  },
  {
    "id": "car-060",
    "categoryId": "lt20_nev_suv",
    "brand": "smart",
    "model": "精灵#1",
    "trim": "灵动标准版",
    "image": "assets/cars/030.webp",
    "imageAlt": "smart 精灵#1 灵动标准版 前三侧外观照片"
  },
  {
    "id": "car-061",
    "categoryId": "lt20_nev_suv",
    "brand": "宝骏",
    "model": "云海",
    "trim": "500km 智尊版",
    "image": "assets/cars/v3-061.webp",
    "imageAlt": "宝骏 云海 500km 智尊版 前三侧外观照片"
  },
  {
    "id": "car-062",
    "categoryId": "lt20_nev_suv",
    "brand": "哪吒",
    "model": "L",
    "trim": "增程 310 红衣版",
    "image": "assets/cars/v3-062.webp",
    "imageAlt": "哪吒 L 增程 310 红衣版 前三侧外观照片"
  },
  {
    "id": "car-063",
    "categoryId": "lt20_nev_suv",
    "brand": "东风风神",
    "model": "L7",
    "trim": "205km 尊享版",
    "image": "assets/cars/v3-063.webp",
    "imageAlt": "东风风神 L7 205km 尊享版 前三侧外观照片"
  },
  {
    "id": "car-064",
    "categoryId": "lt20_nev_suv",
    "brand": "启辰",
    "model": "VX6",
    "trim": "520 Max",
    "image": "assets/cars/v3-064.webp",
    "imageAlt": "启辰 VX6 520 Max 前三侧外观照片"
  },
  {
    "id": "car-065",
    "categoryId": "20to50_fuel_sedan",
    "brand": "宝马",
    "model": "3系",
    "trim": "330Li M运动曜夜套装",
    "image": "assets/cars/033.webp",
    "imageAlt": "宝马 3系 330Li M运动曜夜套装 前三侧外观照片"
  },
  {
    "id": "car-066",
    "categoryId": "20to50_fuel_sedan",
    "brand": "奔驰",
    "model": "C级",
    "trim": "C 260 L 运动版",
    "image": "assets/cars/034.webp",
    "imageAlt": "奔驰 C级 C 260 L 运动版 前三侧外观照片"
  },
  {
    "id": "car-067",
    "categoryId": "20to50_fuel_sedan",
    "brand": "奥迪",
    "model": "A4L",
    "trim": "40 TFSI 豪华动感型",
    "image": "assets/cars/035.webp",
    "imageAlt": "奥迪 A4L 40 TFSI 豪华动感型 前三侧外观照片"
  },
  {
    "id": "car-068",
    "categoryId": "20to50_fuel_sedan",
    "brand": "沃尔沃",
    "model": "S60",
    "trim": "B5 智雅运动版",
    "image": "assets/cars/036.webp",
    "imageAlt": "沃尔沃 S60 B5 智雅运动版 前三侧外观照片"
  },
  {
    "id": "car-069",
    "categoryId": "20to50_fuel_sedan",
    "brand": "雷克萨斯",
    "model": "ES",
    "trim": "200 卓越版",
    "image": "assets/cars/037.webp",
    "imageAlt": "雷克萨斯 ES 200 卓越版 前三侧外观照片"
  },
  {
    "id": "car-070",
    "categoryId": "20to50_fuel_sedan",
    "brand": "凯迪拉克",
    "model": "CT5",
    "trim": "28T 城市运动版",
    "image": "assets/cars/038.webp",
    "imageAlt": "凯迪拉克 CT5 28T 城市运动版 前三侧外观照片"
  },
  {
    "id": "car-071",
    "categoryId": "20to50_fuel_sedan",
    "brand": "捷豹",
    "model": "XEL",
    "trim": "250PS 曜黑运动版",
    "image": "assets/cars/039.webp",
    "imageAlt": "捷豹 XEL 250PS 曜黑运动版 前三侧外观照片"
  },
  {
    "id": "car-072",
    "categoryId": "20to50_fuel_sedan",
    "brand": "红旗",
    "model": "H6",
    "trim": "2.0T 致臻版",
    "image": "assets/cars/v3-072.webp",
    "imageAlt": "红旗 H6 2.0T 致臻版 前三侧外观照片"
  },
  {
    "id": "car-073",
    "categoryId": "20to50_fuel_sedan",
    "brand": "捷尼赛思",
    "model": "G80",
    "trim": "2.5T 四驱豪华版",
    "image": "assets/cars/046.webp",
    "imageAlt": "捷尼赛思 G80 2.5T 四驱豪华版 前三侧外观照片"
  },
  {
    "id": "car-074",
    "categoryId": "20to50_fuel_sedan",
    "brand": "林肯",
    "model": "Z",
    "trim": "2.0T 尊耀版",
    "image": "assets/cars/v3-074.webp",
    "imageAlt": "林肯 Z 2.0T 尊耀版 前三侧外观照片"
  },
  {
    "id": "car-075",
    "categoryId": "20to50_fuel_sedan",
    "brand": "大众",
    "model": "迈腾",
    "trim": "380TSI 尊贵版",
    "image": "assets/cars/v3-075.webp",
    "imageAlt": "大众 迈腾 380TSI 尊贵版 前三侧外观照片"
  },
  {
    "id": "car-076",
    "categoryId": "20to50_fuel_sedan",
    "brand": "丰田",
    "model": "皇冠 Sedan",
    "trim": "2.5L HEV 至享版",
    "image": "assets/cars/v3-076.webp",
    "imageAlt": "丰田 皇冠 Sedan 2.5L HEV 至享版 前三侧外观照片"
  },
  {
    "id": "car-077",
    "categoryId": "20to50_fuel_sedan",
    "brand": "本田",
    "model": "英仕派",
    "trim": "260TURBO 精耀版",
    "image": "assets/cars/v3-077.webp",
    "imageAlt": "本田 英仕派 260TURBO 精耀版 前三侧外观照片"
  },
  {
    "id": "car-078",
    "categoryId": "20to50_fuel_sedan",
    "brand": "日产",
    "model": "天籁",
    "trim": "2.0T XV 尊享版",
    "image": "assets/cars/v3-078.webp",
    "imageAlt": "日产 天籁 2.0T XV 尊享版 前三侧外观照片"
  },
  {
    "id": "car-079",
    "categoryId": "20to50_fuel_sedan",
    "brand": "别克",
    "model": "君越",
    "trim": "28T 尊贵型",
    "image": "assets/cars/v3-079.webp",
    "imageAlt": "别克 君越 28T 尊贵型 前三侧外观照片"
  },
  {
    "id": "car-080",
    "categoryId": "20to50_fuel_sedan",
    "brand": "起亚",
    "model": "K5",
    "trim": "2.0T 旗舰版",
    "image": "assets/cars/v3-080.webp",
    "imageAlt": "起亚 K5 2.0T 旗舰版 前三侧外观照片"
  },
  {
    "id": "car-081",
    "categoryId": "20to50_fuel_suv",
    "brand": "宝马",
    "model": "X3",
    "trim": "xDrive30L 领先型 M运动套装",
    "image": "assets/cars/v3-081.webp",
    "imageAlt": "宝马 X3 xDrive30L 领先型 M运动套装 前三侧外观照片"
  },
  {
    "id": "car-082",
    "categoryId": "20to50_fuel_suv",
    "brand": "奔驰",
    "model": "GLC",
    "trim": "GLC 260 L 4MATIC 动感型",
    "image": "assets/cars/v3-082.webp",
    "imageAlt": "奔驰 GLC GLC 260 L 4MATIC 动感型 前三侧外观照片"
  },
  {
    "id": "car-083",
    "categoryId": "20to50_fuel_suv",
    "brand": "奥迪",
    "model": "Q5L",
    "trim": "40 TFSI 豪华动感型",
    "image": "assets/cars/v3-083.webp",
    "imageAlt": "奥迪 Q5L 40 TFSI 豪华动感型 前三侧外观照片"
  },
  {
    "id": "car-084",
    "categoryId": "20to50_fuel_suv",
    "brand": "沃尔沃",
    "model": "XC60",
    "trim": "B5 智远豪华版",
    "image": "assets/cars/v3-084.webp",
    "imageAlt": "沃尔沃 XC60 B5 智远豪华版 前三侧外观照片"
  },
  {
    "id": "car-085",
    "categoryId": "20to50_fuel_suv",
    "brand": "雷克萨斯",
    "model": "NX",
    "trim": "350h 前驱创驰版",
    "image": "assets/cars/v3-085.webp",
    "imageAlt": "雷克萨斯 NX 350h 前驱创驰版 前三侧外观照片"
  },
  {
    "id": "car-086",
    "categoryId": "20to50_fuel_suv",
    "brand": "凯迪拉克",
    "model": "XT5",
    "trim": "28T 四驱豪华型",
    "image": "assets/cars/v3-086.webp",
    "imageAlt": "凯迪拉克 XT5 28T 四驱豪华型 前三侧外观照片"
  },
  {
    "id": "car-087",
    "categoryId": "20to50_fuel_suv",
    "brand": "路虎",
    "model": "发现运动版",
    "trim": "249PS R-Dynamic SE",
    "image": "assets/cars/v3-087.webp",
    "imageAlt": "路虎 发现运动版 249PS R-Dynamic SE 前三侧外观照片"
  },
  {
    "id": "car-088",
    "categoryId": "20to50_fuel_suv",
    "brand": "福特",
    "model": "探险者",
    "trim": "2.3T 四驱钛金版",
    "image": "assets/cars/041.webp",
    "imageAlt": "福特 探险者 2.3T 四驱钛金版 前三侧外观照片"
  },
  {
    "id": "car-089",
    "categoryId": "20to50_fuel_suv",
    "brand": "坦克",
    "model": "300",
    "trim": "2.0T 征服者",
    "image": "assets/cars/042.webp",
    "imageAlt": "坦克 300 2.0T 征服者 前三侧外观照片"
  },
  {
    "id": "car-090",
    "categoryId": "20to50_fuel_suv",
    "brand": "大众",
    "model": "途昂",
    "trim": "380TSI 四驱出众版",
    "image": "assets/cars/043.webp",
    "imageAlt": "大众 途昂 380TSI 四驱出众版 前三侧外观照片"
  },
  {
    "id": "car-091",
    "categoryId": "20to50_fuel_suv",
    "brand": "丰田",
    "model": "汉兰达",
    "trim": "2.5L 双擎四驱尊贵版",
    "image": "assets/cars/v3-091.webp",
    "imageAlt": "丰田 汉兰达 2.5L 双擎四驱尊贵版 前三侧外观照片"
  },
  {
    "id": "car-092",
    "categoryId": "20to50_fuel_suv",
    "brand": "本田",
    "model": "UR-V",
    "trim": "370TURBO 四驱尊耀版",
    "image": "assets/cars/v3-092.webp",
    "imageAlt": "本田 UR-V 370TURBO 四驱尊耀版 前三侧外观照片"
  },
  {
    "id": "car-093",
    "categoryId": "20to50_fuel_suv",
    "brand": "日产",
    "model": "奇骏",
    "trim": "e-POWER 四驱至尊版",
    "image": "assets/cars/v3-093.webp",
    "imageAlt": "日产 奇骏 e-POWER 四驱至尊版 前三侧外观照片"
  },
  {
    "id": "car-094",
    "categoryId": "20to50_fuel_suv",
    "brand": "别克",
    "model": "昂科威Plus",
    "trim": "28T 四驱艾维亚",
    "image": "assets/cars/v3-094.webp",
    "imageAlt": "别克 昂科威Plus 28T 四驱艾维亚 前三侧外观照片"
  },
  {
    "id": "car-095",
    "categoryId": "20to50_fuel_suv",
    "brand": "林肯",
    "model": "冒险家",
    "trim": "2.0T 四驱尊雅版",
    "image": "assets/cars/045.webp",
    "imageAlt": "林肯 冒险家 2.0T 四驱尊雅版 前三侧外观照片"
  },
  {
    "id": "car-096",
    "categoryId": "20to50_fuel_suv",
    "brand": "捷尼赛思",
    "model": "GV70",
    "trim": "2.5T 四驱旗舰版",
    "image": "assets/cars/v3-096.webp",
    "imageAlt": "捷尼赛思 GV70 2.5T 四驱旗舰版 前三侧外观照片"
  },
  {
    "id": "car-097",
    "categoryId": "20to50_nev_sedan",
    "brand": "特斯拉",
    "model": "Model 3",
    "trim": "后轮驱动版",
    "image": "assets/cars/049.webp",
    "imageAlt": "特斯拉 Model 3 后轮驱动版 前三侧外观照片"
  },
  {
    "id": "car-098",
    "categoryId": "20to50_nev_sedan",
    "brand": "小米",
    "model": "SU7",
    "trim": "后驱超长续航高阶智驾Pro版",
    "image": "assets/cars/050.webp",
    "imageAlt": "小米 SU7 后驱超长续航高阶智驾Pro版 前三侧外观照片"
  },
  {
    "id": "car-099",
    "categoryId": "20to50_nev_sedan",
    "brand": "极氪",
    "model": "007",
    "trim": "后驱智驾版",
    "image": "assets/cars/051.webp",
    "imageAlt": "极氪 007 后驱智驾版 前三侧外观照片"
  },
  {
    "id": "car-100",
    "categoryId": "20to50_nev_sedan",
    "brand": "蔚来",
    "model": "ET5",
    "trim": "75kWh",
    "image": "assets/cars/053.webp",
    "imageAlt": "蔚来 ET5 75kWh 前三侧外观照片"
  },
  {
    "id": "car-101",
    "categoryId": "20to50_nev_sedan",
    "brand": "小鹏",
    "model": "P7+",
    "trim": "725 超长续航 Max",
    "image": "assets/cars/054.webp",
    "imageAlt": "小鹏 P7+ 725 超长续航 Max 前三侧外观照片"
  },
  {
    "id": "car-102",
    "categoryId": "20to50_nev_sedan",
    "brand": "阿维塔",
    "model": "12",
    "trim": "后驱 Max版",
    "image": "assets/cars/v3-102.webp",
    "imageAlt": "阿维塔 12 后驱 Max版 前三侧外观照片"
  },
  {
    "id": "car-103",
    "categoryId": "20to50_nev_sedan",
    "brand": "比亚迪",
    "model": "汉L EV",
    "trim": "701KM 激光雷达尊享型",
    "image": "assets/cars/057.webp",
    "imageAlt": "比亚迪 汉L EV 701KM 激光雷达尊享型 前三侧外观照片"
  },
  {
    "id": "car-104",
    "categoryId": "20to50_nev_sedan",
    "brand": "腾势",
    "model": "Z9",
    "trim": "插混 1100 豪华型",
    "image": "assets/cars/v3-104.webp",
    "imageAlt": "腾势 Z9 插混 1100 豪华型 前三侧外观照片"
  },
  {
    "id": "car-105",
    "categoryId": "20to50_nev_sedan",
    "brand": "智己",
    "model": "L6",
    "trim": "长续航灵蜥智驾版",
    "image": "assets/cars/v3-105.webp",
    "imageAlt": "智己 L6 长续航灵蜥智驾版 前三侧外观照片"
  },
  {
    "id": "car-106",
    "categoryId": "20to50_nev_sedan",
    "brand": "岚图",
    "model": "追光",
    "trim": "PHEV 四驱旗舰版",
    "image": "assets/cars/v3-106.webp",
    "imageAlt": "岚图 追光 PHEV 四驱旗舰版 前三侧外观照片"
  },
  {
    "id": "car-107",
    "categoryId": "20to50_nev_sedan",
    "brand": "智界",
    "model": "S7",
    "trim": "Max 后驱长续航版",
    "image": "assets/cars/062.webp",
    "imageAlt": "智界 S7 Max 后驱长续航版 前三侧外观照片"
  },
  {
    "id": "car-108",
    "categoryId": "20to50_nev_sedan",
    "brand": "领克",
    "model": "Z10",
    "trim": "后驱 Max版",
    "image": "assets/cars/v3-108.webp",
    "imageAlt": "领克 Z10 后驱 Max版 前三侧外观照片"
  },
  {
    "id": "car-109",
    "categoryId": "20to50_nev_sedan",
    "brand": "昊铂",
    "model": "GT",
    "trim": "710 后驱特高压版",
    "image": "assets/cars/v3-109.webp",
    "imageAlt": "昊铂 GT 710 后驱特高压版 前三侧外观照片"
  },
  {
    "id": "car-110",
    "categoryId": "20to50_nev_sedan",
    "brand": "红旗",
    "model": "EH7",
    "trim": "690 Pro",
    "image": "assets/cars/v3-110.webp",
    "imageAlt": "红旗 EH7 690 Pro 前三侧外观照片"
  },
  {
    "id": "car-111",
    "categoryId": "20to50_nev_sedan",
    "brand": "星途",
    "model": "星纪元 ES",
    "trim": "增程 Max版",
    "image": "assets/cars/v3-111.webp",
    "imageAlt": "星途 星纪元 ES 增程 Max版 前三侧外观照片"
  },
  {
    "id": "car-112",
    "categoryId": "20to50_nev_sedan",
    "brand": "极狐",
    "model": "阿尔法S",
    "trim": "525S",
    "image": "assets/cars/064.webp",
    "imageAlt": "极狐 阿尔法S 525S 前三侧外观照片"
  },
  {
    "id": "car-113",
    "categoryId": "20to50_nev_suv",
    "brand": "特斯拉",
    "model": "Model Y",
    "trim": "后轮驱动版",
    "image": "assets/cars/v3-113.webp",
    "imageAlt": "特斯拉 Model Y 后轮驱动版 前三侧外观照片"
  },
  {
    "id": "car-114",
    "categoryId": "20to50_nev_suv",
    "brand": "小米",
    "model": "YU7",
    "trim": "后驱标准版",
    "image": "assets/cars/v3-114.webp",
    "imageAlt": "小米 YU7 后驱标准版 前三侧外观照片"
  },
  {
    "id": "car-115",
    "categoryId": "20to50_nev_suv",
    "brand": "极氪",
    "model": "7X",
    "trim": "后驱智驾版",
    "image": "assets/cars/v3-115.webp",
    "imageAlt": "极氪 7X 后驱智驾版 前三侧外观照片"
  },
  {
    "id": "car-116",
    "categoryId": "20to50_nev_suv",
    "brand": "理想",
    "model": "L6",
    "trim": "Pro 智能焕新版",
    "image": "assets/cars/052.webp",
    "imageAlt": "理想 L6 Pro 智能焕新版 前三侧外观照片"
  },
  {
    "id": "car-117",
    "categoryId": "20to50_nev_suv",
    "brand": "蔚来",
    "model": "ES6",
    "trim": "75kWh",
    "image": "assets/cars/v3-117.webp",
    "imageAlt": "蔚来 ES6 75kWh 前三侧外观照片"
  },
  {
    "id": "car-118",
    "categoryId": "20to50_nev_suv",
    "brand": "问界",
    "model": "M5",
    "trim": "增程 Ultra 后驱版",
    "image": "assets/cars/056.webp",
    "imageAlt": "问界 M5 增程 Ultra 后驱版 前三侧外观照片"
  },
  {
    "id": "car-119",
    "categoryId": "20to50_nev_suv",
    "brand": "阿维塔",
    "model": "07",
    "trim": "Pro+增程版",
    "image": "assets/cars/055.webp",
    "imageAlt": "阿维塔 07 Pro+增程版 前三侧外观照片"
  },
  {
    "id": "car-120",
    "categoryId": "20to50_nev_suv",
    "brand": "比亚迪",
    "model": "唐L EV",
    "trim": "670KM 激光雷达尊享型",
    "image": "assets/cars/v3-120.webp",
    "imageAlt": "比亚迪 唐L EV 670KM 激光雷达尊享型 前三侧外观照片"
  },
  {
    "id": "car-121",
    "categoryId": "20to50_nev_suv",
    "brand": "腾势",
    "model": "N7",
    "trim": "702 智驾版",
    "image": "assets/cars/058.webp",
    "imageAlt": "腾势 N7 702 智驾版 前三侧外观照片"
  },
  {
    "id": "car-122",
    "categoryId": "20to50_nev_suv",
    "brand": "领克",
    "model": "08 EM-P",
    "trim": "245 超长续航 Halo",
    "image": "assets/cars/059.webp",
    "imageAlt": "领克 08 EM-P 245 超长续航 Halo 前三侧外观照片"
  },
  {
    "id": "car-123",
    "categoryId": "20to50_nev_suv",
    "brand": "智己",
    "model": "LS6",
    "trim": "长续航灵蜥智驾版",
    "image": "assets/cars/060.webp",
    "imageAlt": "智己 LS6 长续航灵蜥智驾版 前三侧外观照片"
  },
  {
    "id": "car-124",
    "categoryId": "20to50_nev_suv",
    "brand": "岚图",
    "model": "FREE 318",
    "trim": "四驱探索版",
    "image": "assets/cars/061.webp",
    "imageAlt": "岚图 FREE 318 四驱探索版 前三侧外观照片"
  },
  {
    "id": "car-125",
    "categoryId": "20to50_nev_suv",
    "brand": "智界",
    "model": "R7",
    "trim": "纯电 Max版",
    "image": "assets/cars/v3-125.webp",
    "imageAlt": "智界 R7 纯电 Max版 前三侧外观照片"
  },
  {
    "id": "car-126",
    "categoryId": "20to50_nev_suv",
    "brand": "乐道",
    "model": "L60",
    "trim": "85kWh 后驱版",
    "image": "assets/cars/063.webp",
    "imageAlt": "乐道 L60 85kWh 后驱版 前三侧外观照片"
  },
  {
    "id": "car-127",
    "categoryId": "20to50_nev_suv",
    "brand": "星途",
    "model": "星纪元 ET",
    "trim": "增程 Max版",
    "image": "assets/cars/v3-127.webp",
    "imageAlt": "星途 星纪元 ET 增程 Max版 前三侧外观照片"
  },
  {
    "id": "car-128",
    "categoryId": "20to50_nev_suv",
    "brand": "方程豹",
    "model": "豹5",
    "trim": "云辇旗舰版",
    "image": "assets/cars/v3-128.webp",
    "imageAlt": "方程豹 豹5 云辇旗舰版 前三侧外观照片"
  },
  {
    "id": "car-129",
    "categoryId": "50to100_sedan",
    "brand": "宝马",
    "model": "5系",
    "trim": "530Li 尊享型 M运动套装",
    "image": "assets/cars/065.webp",
    "imageAlt": "宝马 5系 530Li 尊享型 M运动套装 前三侧外观照片"
  },
  {
    "id": "car-130",
    "categoryId": "50to100_sedan",
    "brand": "奔驰",
    "model": "E级",
    "trim": "E 300 L 豪华型",
    "image": "assets/cars/066.webp",
    "imageAlt": "奔驰 E级 E 300 L 豪华型 前三侧外观照片"
  },
  {
    "id": "car-131",
    "categoryId": "50to100_sedan",
    "brand": "奥迪",
    "model": "A6L",
    "trim": "55 TFSI quattro 尊享动感型",
    "image": "assets/cars/067.webp",
    "imageAlt": "奥迪 A6L 55 TFSI quattro 尊享动感型 前三侧外观照片"
  },
  {
    "id": "car-132",
    "categoryId": "50to100_sedan",
    "brand": "沃尔沃",
    "model": "S90",
    "trim": "B5 智雅豪华版",
    "image": "assets/cars/068.webp",
    "imageAlt": "沃尔沃 S90 B5 智雅豪华版 前三侧外观照片"
  },
  {
    "id": "car-133",
    "categoryId": "50to100_sedan",
    "brand": "雷克萨斯",
    "model": "LS",
    "trim": "500h 行政版",
    "image": "assets/cars/v3-133.webp",
    "imageAlt": "雷克萨斯 LS 500h 行政版 前三侧外观照片"
  },
  {
    "id": "car-134",
    "categoryId": "50to100_sedan",
    "brand": "捷尼赛思",
    "model": "G90",
    "trim": "3.5T 四驱旗舰版",
    "image": "assets/cars/v3-134.webp",
    "imageAlt": "捷尼赛思 G90 3.5T 四驱旗舰版 前三侧外观照片"
  },
  {
    "id": "car-135",
    "categoryId": "50to100_sedan",
    "brand": "捷豹",
    "model": "XJ",
    "trim": "3.0 SC 典雅商务版",
    "image": "assets/cars/v3-135.webp",
    "imageAlt": "捷豹 XJ 3.0 SC 典雅商务版 前三侧外观照片"
  },
  {
    "id": "car-136",
    "categoryId": "50to100_sedan",
    "brand": "玛莎拉蒂",
    "model": "Ghibli",
    "trim": "2.0T GT",
    "image": "assets/cars/v3-136.webp",
    "imageAlt": "玛莎拉蒂 Ghibli 2.0T GT 前三侧外观照片"
  },
  {
    "id": "car-137",
    "categoryId": "50to100_sedan",
    "brand": "蔚来",
    "model": "ET9",
    "trim": "100kWh",
    "image": "assets/cars/073.webp",
    "imageAlt": "蔚来 ET9 100kWh 前三侧外观照片"
  },
  {
    "id": "car-138",
    "categoryId": "50to100_sedan",
    "brand": "仰望",
    "model": "U7",
    "trim": "纯电五座豪华版",
    "image": "assets/cars/074.webp",
    "imageAlt": "仰望 U7 纯电五座豪华版 前三侧外观照片"
  },
  {
    "id": "car-139",
    "categoryId": "50to100_sedan",
    "brand": "小米",
    "model": "SU7 Ultra",
    "trim": "标准版",
    "image": "assets/cars/v3-139.webp",
    "imageAlt": "小米 SU7 Ultra 标准版 前三侧外观照片"
  },
  {
    "id": "car-140",
    "categoryId": "50to100_sedan",
    "brand": "路特斯",
    "model": "Emeya",
    "trim": "600 豪华版",
    "image": "assets/cars/v3-140.webp",
    "imageAlt": "路特斯 Emeya 600 豪华版 前三侧外观照片"
  },
  {
    "id": "car-141",
    "categoryId": "50to100_sedan",
    "brand": "红旗",
    "model": "H9",
    "trim": "3.0T 旗领四座版",
    "image": "assets/cars/040.webp",
    "imageAlt": "红旗 H9 3.0T 旗领四座版 前三侧外观照片"
  },
  {
    "id": "car-142",
    "categoryId": "50to100_sedan",
    "brand": "宝马",
    "model": "i5 M60",
    "trim": "xDrive M运动套装",
    "image": "assets/cars/v3-142.webp",
    "imageAlt": "宝马 i5 M60 xDrive M运动套装 前三侧外观照片"
  },
  {
    "id": "car-143",
    "categoryId": "50to100_sedan",
    "brand": "奔驰",
    "model": "EQS",
    "trim": "450+ 先型特别版",
    "image": "assets/cars/v3-143.webp",
    "imageAlt": "奔驰 EQS 450+ 先型特别版 前三侧外观照片"
  },
  {
    "id": "car-144",
    "categoryId": "50to100_sedan",
    "brand": "奥迪",
    "model": "e-tron GT",
    "trim": "quattro",
    "image": "assets/cars/v3-144.webp",
    "imageAlt": "奥迪 e-tron GT quattro 前三侧外观照片"
  },
  {
    "id": "car-145",
    "categoryId": "50to100_suv",
    "brand": "宝马",
    "model": "X5",
    "trim": "xDrive30Li 尊享型 M运动套装",
    "image": "assets/cars/v3-145.webp",
    "imageAlt": "宝马 X5 xDrive30Li 尊享型 M运动套装 前三侧外观照片"
  },
  {
    "id": "car-146",
    "categoryId": "50to100_suv",
    "brand": "奔驰",
    "model": "GLE",
    "trim": "GLE 350 4MATIC 时尚型",
    "image": "assets/cars/v3-146.webp",
    "imageAlt": "奔驰 GLE GLE 350 4MATIC 时尚型 前三侧外观照片"
  },
  {
    "id": "car-147",
    "categoryId": "50to100_suv",
    "brand": "奥迪",
    "model": "Q7",
    "trim": "45 TFSI quattro S line 运动型",
    "image": "assets/cars/v3-147.webp",
    "imageAlt": "奥迪 Q7 45 TFSI quattro S line 运动型 前三侧外观照片"
  },
  {
    "id": "car-148",
    "categoryId": "50to100_suv",
    "brand": "沃尔沃",
    "model": "XC90",
    "trim": "B6 智雅豪华版",
    "image": "assets/cars/v3-148.webp",
    "imageAlt": "沃尔沃 XC90 B6 智雅豪华版 前三侧外观照片"
  },
  {
    "id": "car-149",
    "categoryId": "50to100_suv",
    "brand": "雷克萨斯",
    "model": "RX",
    "trim": "500h F SPORT Performance",
    "image": "assets/cars/069.webp",
    "imageAlt": "雷克萨斯 RX 500h F SPORT Performance 前三侧外观照片"
  },
  {
    "id": "car-150",
    "categoryId": "50to100_suv",
    "brand": "丰田",
    "model": "普拉多",
    "trim": "2.4T 悍野WX版",
    "image": "assets/cars/070.webp",
    "imageAlt": "丰田 普拉多 2.4T 悍野WX版 前三侧外观照片"
  },
  {
    "id": "car-151",
    "categoryId": "50to100_suv",
    "brand": "问界",
    "model": "M9",
    "trim": "增程 Ultra 五座版",
    "image": "assets/cars/071.webp",
    "imageAlt": "问界 M9 增程 Ultra 五座版 前三侧外观照片"
  },
  {
    "id": "car-152",
    "categoryId": "50to100_suv",
    "brand": "极星",
    "model": "3",
    "trim": "双电机长续航版",
    "image": "assets/cars/076.webp",
    "imageAlt": "极星 3 双电机长续航版 前三侧外观照片"
  },
  {
    "id": "car-153",
    "categoryId": "50to100_suv",
    "brand": "路特斯",
    "model": "Eletre",
    "trim": "600 豪华版",
    "image": "assets/cars/077.webp",
    "imageAlt": "路特斯 Eletre 600 豪华版 前三侧外观照片"
  },
  {
    "id": "car-154",
    "categoryId": "50to100_suv",
    "brand": "Jeep",
    "model": "大切诺基",
    "trim": "2.0T 四驱远峰版",
    "image": "assets/cars/080.webp",
    "imageAlt": "Jeep 大切诺基 2.0T 四驱远峰版 前三侧外观照片"
  },
  {
    "id": "car-155",
    "categoryId": "50to100_suv",
    "brand": "大众",
    "model": "途锐",
    "trim": "3.0TSI 锐尊版",
    "image": "assets/cars/079.webp",
    "imageAlt": "大众 途锐 3.0TSI 锐尊版 前三侧外观照片"
  },
  {
    "id": "car-156",
    "categoryId": "50to100_suv",
    "brand": "红旗",
    "model": "E-HS9",
    "trim": "660km 旗畅版",
    "image": "assets/cars/078.webp",
    "imageAlt": "红旗 E-HS9 660km 旗畅版 前三侧外观照片"
  },
  {
    "id": "car-157",
    "categoryId": "50to100_suv",
    "brand": "路虎",
    "model": "卫士",
    "trim": "110 3.0T P400 X-Dynamic HSE",
    "image": "assets/cars/v3-157.webp",
    "imageAlt": "路虎 卫士 110 3.0T P400 X-Dynamic HSE 前三侧外观照片"
  },
  {
    "id": "car-158",
    "categoryId": "50to100_suv",
    "brand": "保时捷",
    "model": "Macan",
    "trim": "2.0T",
    "image": "assets/cars/v3-158.webp",
    "imageAlt": "保时捷 Macan 2.0T 前三侧外观照片"
  },
  {
    "id": "car-159",
    "categoryId": "50to100_suv",
    "brand": "英菲尼迪",
    "model": "QX60",
    "trim": "2.0T 四驱旗舰版",
    "image": "assets/cars/v3-159.webp",
    "imageAlt": "英菲尼迪 QX60 2.0T 四驱旗舰版 前三侧外观照片"
  },
  {
    "id": "car-160",
    "categoryId": "50to100_suv",
    "brand": "凯迪拉克",
    "model": "XT6",
    "trim": "28T 四驱铂金型",
    "image": "assets/cars/v3-160.webp",
    "imageAlt": "凯迪拉克 XT6 28T 四驱铂金型 前三侧外观照片"
  },
  {
    "id": "car-161",
    "categoryId": "luxury_sedan",
    "brand": "保时捷",
    "model": "Panamera",
    "trim": "2.9T",
    "image": "assets/cars/081.webp",
    "imageAlt": "保时捷 Panamera 2.9T 前三侧外观照片"
  },
  {
    "id": "car-162",
    "categoryId": "luxury_sedan",
    "brand": "保时捷",
    "model": "Taycan",
    "trim": "Taycan 4",
    "image": "assets/cars/v3-162.webp",
    "imageAlt": "保时捷 Taycan Taycan 4 前三侧外观照片"
  },
  {
    "id": "car-163",
    "categoryId": "luxury_sedan",
    "brand": "梅赛德斯-迈巴赫",
    "model": "S级",
    "trim": "S 480 4MATIC",
    "image": "assets/cars/083.webp",
    "imageAlt": "梅赛德斯-迈巴赫 S级 S 480 4MATIC 前三侧外观照片"
  },
  {
    "id": "car-164",
    "categoryId": "luxury_sedan",
    "brand": "奔驰",
    "model": "S级",
    "trim": "S 500 L 4MATIC",
    "image": "assets/cars/v3-164.webp",
    "imageAlt": "奔驰 S级 S 500 L 4MATIC 前三侧外观照片"
  },
  {
    "id": "car-165",
    "categoryId": "luxury_sedan",
    "brand": "宝马",
    "model": "7系",
    "trim": "740Li 尊享型 M运动套装",
    "image": "assets/cars/084.webp",
    "imageAlt": "宝马 7系 740Li 尊享型 M运动套装 前三侧外观照片"
  },
  {
    "id": "car-166",
    "categoryId": "luxury_sedan",
    "brand": "奥迪",
    "model": "A8L",
    "trim": "55 TFSI quattro 旗舰型",
    "image": "assets/cars/085.webp",
    "imageAlt": "奥迪 A8L 55 TFSI quattro 旗舰型 前三侧外观照片"
  },
  {
    "id": "car-167",
    "categoryId": "luxury_sedan",
    "brand": "宾利",
    "model": "飞驰",
    "trim": "4.0T V8",
    "image": "assets/cars/088.webp",
    "imageAlt": "宾利 飞驰 4.0T V8 前三侧外观照片"
  },
  {
    "id": "car-168",
    "categoryId": "luxury_sedan",
    "brand": "宾利",
    "model": "慕尚",
    "trim": "6.75T 标准版",
    "image": "assets/cars/v3-168.webp",
    "imageAlt": "宾利 慕尚 6.75T 标准版 前三侧外观照片"
  },
  {
    "id": "car-169",
    "categoryId": "luxury_sedan",
    "brand": "劳斯莱斯",
    "model": "古思特",
    "trim": "6.75T",
    "image": "assets/cars/089.webp",
    "imageAlt": "劳斯莱斯 古思特 6.75T 前三侧外观照片"
  },
  {
    "id": "car-170",
    "categoryId": "luxury_sedan",
    "brand": "劳斯莱斯",
    "model": "幻影",
    "trim": "6.75T 标准版",
    "image": "assets/cars/v3-170.webp",
    "imageAlt": "劳斯莱斯 幻影 6.75T 标准版 前三侧外观照片"
  },
  {
    "id": "car-171",
    "categoryId": "luxury_sedan",
    "brand": "玛莎拉蒂",
    "model": "Quattroporte",
    "trim": "3.0T 豪华版",
    "image": "assets/cars/v3-171.webp",
    "imageAlt": "玛莎拉蒂 Quattroporte 3.0T 豪华版 前三侧外观照片"
  },
  {
    "id": "car-172",
    "categoryId": "luxury_sedan",
    "brand": "阿斯顿·马丁",
    "model": "Rapide",
    "trim": "6.0L S",
    "image": "assets/cars/v3-172.webp",
    "imageAlt": "阿斯顿·马丁 Rapide 6.0L S 前三侧外观照片"
  },
  {
    "id": "car-173",
    "categoryId": "luxury_sedan",
    "brand": "红旗",
    "model": "国雅",
    "trim": "3.0T 尊雅版",
    "image": "assets/cars/095.webp",
    "imageAlt": "红旗 国雅 3.0T 尊雅版 前三侧外观照片"
  },
  {
    "id": "car-174",
    "categoryId": "luxury_sedan",
    "brand": "红旗",
    "model": "L5",
    "trim": "6.0L 国宾版",
    "image": "assets/cars/v3-174.webp",
    "imageAlt": "红旗 L5 6.0L 国宾版 前三侧外观照片"
  },
  {
    "id": "car-175",
    "categoryId": "luxury_sedan",
    "brand": "宝马",
    "model": "i7",
    "trim": "M70L",
    "image": "assets/cars/v3-175.webp",
    "imageAlt": "宝马 i7 M70L 前三侧外观照片"
  },
  {
    "id": "car-176",
    "categoryId": "luxury_sedan",
    "brand": "奥迪",
    "model": "S8",
    "trim": "4.0TFSI quattro",
    "image": "assets/cars/v3-176.webp",
    "imageAlt": "奥迪 S8 4.0TFSI quattro 前三侧外观照片"
  },
  {
    "id": "car-177",
    "categoryId": "luxury_suv",
    "brand": "保时捷",
    "model": "Cayenne Coupé",
    "trim": "3.0T",
    "image": "assets/cars/082.webp",
    "imageAlt": "保时捷 Cayenne Coupé 3.0T 前三侧外观照片"
  },
  {
    "id": "car-178",
    "categoryId": "luxury_suv",
    "brand": "路虎",
    "model": "揽胜",
    "trim": "3.0 L6 400PS 盛世加长版",
    "image": "assets/cars/086.webp",
    "imageAlt": "路虎 揽胜 3.0 L6 400PS 盛世加长版 前三侧外观照片"
  },
  {
    "id": "car-179",
    "categoryId": "luxury_suv",
    "brand": "玛莎拉蒂",
    "model": "Levante",
    "trim": "2.0T GT",
    "image": "assets/cars/087.webp",
    "imageAlt": "玛莎拉蒂 Levante 2.0T GT 前三侧外观照片"
  },
  {
    "id": "car-180",
    "categoryId": "luxury_suv",
    "brand": "阿斯顿·马丁",
    "model": "DBX",
    "trim": "4.0T V8",
    "image": "assets/cars/090.webp",
    "imageAlt": "阿斯顿·马丁 DBX 4.0T V8 前三侧外观照片"
  },
  {
    "id": "car-181",
    "categoryId": "luxury_suv",
    "brand": "捷尼赛思",
    "model": "GV80",
    "trim": "3.5T 四驱旗舰版",
    "image": "assets/cars/092.webp",
    "imageAlt": "捷尼赛思 GV80 3.5T 四驱旗舰版 前三侧外观照片"
  },
  {
    "id": "car-182",
    "categoryId": "luxury_suv",
    "brand": "凯迪拉克",
    "model": "凯雷德",
    "trim": "3.0T 四驱铂金版",
    "image": "assets/cars/093.webp",
    "imageAlt": "凯迪拉克 凯雷德 3.0T 四驱铂金版 前三侧外观照片"
  },
  {
    "id": "car-183",
    "categoryId": "luxury_suv",
    "brand": "林肯",
    "model": "领航员",
    "trim": "3.5T 四驱总统版",
    "image": "assets/cars/094.webp",
    "imageAlt": "林肯 领航员 3.5T 四驱总统版 前三侧外观照片"
  },
  {
    "id": "car-184",
    "categoryId": "luxury_suv",
    "brand": "仰望",
    "model": "U8",
    "trim": "豪华版",
    "image": "assets/cars/096.webp",
    "imageAlt": "仰望 U8 豪华版 前三侧外观照片"
  },
  {
    "id": "car-185",
    "categoryId": "luxury_suv",
    "brand": "宾利",
    "model": "添越",
    "trim": "4.0T V8",
    "image": "assets/cars/v3-185.webp",
    "imageAlt": "宾利 添越 4.0T V8 前三侧外观照片"
  },
  {
    "id": "car-186",
    "categoryId": "luxury_suv",
    "brand": "劳斯莱斯",
    "model": "库里南",
    "trim": "6.75T 标准版",
    "image": "assets/cars/v3-186.webp",
    "imageAlt": "劳斯莱斯 库里南 6.75T 标准版 前三侧外观照片"
  },
  {
    "id": "car-187",
    "categoryId": "luxury_suv",
    "brand": "梅赛德斯-迈巴赫",
    "model": "GLS",
    "trim": "GLS 600 4MATIC 礼乐版",
    "image": "assets/cars/v3-187.webp",
    "imageAlt": "梅赛德斯-迈巴赫 GLS GLS 600 4MATIC 礼乐版 前三侧外观照片"
  },
  {
    "id": "car-188",
    "categoryId": "luxury_suv",
    "brand": "宝马",
    "model": "XM",
    "trim": "Label Red限量版",
    "image": "assets/cars/v3-188.webp",
    "imageAlt": "宝马 XM Label Red限量版 前三侧外观照片"
  },
  {
    "id": "car-189",
    "categoryId": "luxury_suv",
    "brand": "奥迪",
    "model": "RS Q8",
    "trim": "4.0TFSI quattro",
    "image": "assets/cars/v3-189.webp",
    "imageAlt": "奥迪 RS Q8 4.0TFSI quattro 前三侧外观照片"
  },
  {
    "id": "car-190",
    "categoryId": "luxury_suv",
    "brand": "兰博基尼",
    "model": "Urus",
    "trim": "Performante",
    "image": "assets/cars/v3-190.webp",
    "imageAlt": "兰博基尼 Urus Performante 前三侧外观照片"
  },
  {
    "id": "car-191",
    "categoryId": "luxury_suv",
    "brand": "雷克萨斯",
    "model": "LX",
    "trim": "700h 四座 VIP版",
    "image": "assets/cars/v3-191.webp",
    "imageAlt": "雷克萨斯 LX 700h 四座 VIP版 前三侧外观照片"
  },
  {
    "id": "car-192",
    "categoryId": "luxury_suv",
    "brand": "Jeep",
    "model": "Grand Wagoneer",
    "trim": "3.0T 四驱旗舰版",
    "image": "assets/cars/v3-192.webp",
    "imageAlt": "Jeep Grand Wagoneer 3.0T 四驱旗舰版 前三侧外观照片"
  },
  {
    "id": "car-193",
    "categoryId": "sports",
    "brand": "丰田",
    "model": "GR Supra",
    "trim": "3.0T 标准型",
    "image": "assets/cars/097.webp",
    "imageAlt": "丰田 GR Supra 3.0T 标准型 前三侧外观照片"
  },
  {
    "id": "car-194",
    "categoryId": "sports",
    "brand": "斯巴鲁",
    "model": "BRZ",
    "trim": "2.4L 手动版",
    "image": "assets/cars/098.webp",
    "imageAlt": "斯巴鲁 BRZ 2.4L 手动版 前三侧外观照片"
  },
  {
    "id": "car-195",
    "categoryId": "sports",
    "brand": "马自达",
    "model": "MX-5 RF",
    "trim": "2.0L 自动版",
    "image": "assets/cars/099.webp",
    "imageAlt": "马自达 MX-5 RF 2.0L 自动版 前三侧外观照片"
  },
  {
    "id": "car-196",
    "categoryId": "sports",
    "brand": "宝马",
    "model": "Z4",
    "trim": "M40i M运动性能版",
    "image": "assets/cars/100.webp",
    "imageAlt": "宝马 Z4 M40i M运动性能版 前三侧外观照片"
  },
  {
    "id": "car-197",
    "categoryId": "sports",
    "brand": "福特",
    "model": "Mustang",
    "trim": "5.0L V8 Dark Horse",
    "image": "assets/cars/101.webp",
    "imageAlt": "福特 Mustang 5.0L V8 Dark Horse 前三侧外观照片"
  },
  {
    "id": "car-198",
    "categoryId": "sports",
    "brand": "捷豹",
    "model": "F-TYPE",
    "trim": "P300 75周年典藏版",
    "image": "assets/cars/102.webp",
    "imageAlt": "捷豹 F-TYPE P300 75周年典藏版 前三侧外观照片"
  },
  {
    "id": "car-199",
    "categoryId": "sports",
    "brand": "路特斯",
    "model": "Emira",
    "trim": "2.0T First Edition",
    "image": "assets/cars/103.webp",
    "imageAlt": "路特斯 Emira 2.0T First Edition 前三侧外观照片"
  },
  {
    "id": "car-200",
    "categoryId": "sports",
    "brand": "保时捷",
    "model": "911",
    "trim": "Carrera",
    "image": "assets/cars/104.webp",
    "imageAlt": "保时捷 911 Carrera 前三侧外观照片"
  },
  {
    "id": "car-201",
    "categoryId": "sports",
    "brand": "梅赛德斯-AMG",
    "model": "AMG GT",
    "trim": "63 4MATIC+",
    "image": "assets/cars/105.webp",
    "imageAlt": "梅赛德斯-AMG AMG GT 63 4MATIC+ 前三侧外观照片"
  },
  {
    "id": "car-202",
    "categoryId": "sports",
    "brand": "阿斯顿·马丁",
    "model": "Vantage",
    "trim": "4.0T V8",
    "image": "assets/cars/106.webp",
    "imageAlt": "阿斯顿·马丁 Vantage 4.0T V8 前三侧外观照片"
  },
  {
    "id": "car-203",
    "categoryId": "sports",
    "brand": "法拉利",
    "model": "296 GTB",
    "trim": "3.0T V6 PHEV",
    "image": "assets/cars/107.webp",
    "imageAlt": "法拉利 296 GTB 3.0T V6 PHEV 前三侧外观照片"
  },
  {
    "id": "car-204",
    "categoryId": "sports",
    "brand": "兰博基尼",
    "model": "Revuelto",
    "trim": "6.5L PHEV",
    "image": "assets/cars/108.webp",
    "imageAlt": "兰博基尼 Revuelto 6.5L PHEV 前三侧外观照片"
  },
  {
    "id": "car-205",
    "categoryId": "sports",
    "brand": "迈凯伦",
    "model": "Artura",
    "trim": "3.0T PHEV",
    "image": "assets/cars/109.webp",
    "imageAlt": "迈凯伦 Artura 3.0T PHEV 前三侧外观照片"
  },
  {
    "id": "car-206",
    "categoryId": "sports",
    "brand": "玛莎拉蒂",
    "model": "MC20",
    "trim": "3.0T 标准版",
    "image": "assets/cars/110.webp",
    "imageAlt": "玛莎拉蒂 MC20 3.0T 标准版 前三侧外观照片"
  },
  {
    "id": "car-207",
    "categoryId": "sports",
    "brand": "日产",
    "model": "GT-R",
    "trim": "3.8T Premium Edition",
    "image": "assets/cars/111.webp",
    "imageAlt": "日产 GT-R 3.8T Premium Edition 前三侧外观照片"
  },
  {
    "id": "car-208",
    "categoryId": "sports",
    "brand": "奥迪",
    "model": "R8",
    "trim": "V10 Performance",
    "image": "assets/cars/112.webp",
    "imageAlt": "奥迪 R8 V10 Performance 前三侧外观照片"
  }
];
  return { categories, cars };
});
