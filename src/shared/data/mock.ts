export type ProductCategory = string;

export type ProductSizeStock = {
  size: string;
  stock: number;
};

export type Product = {
  slug: string;
  title: string;
  category: ProductCategory;
  categoryLabel: string;
  description: string;
  price: number;
  imageSrc: string;
  sizes: ProductSizeStock[];
};

export type CartItem = {
  id: string;
  productSlug: string;
  size: string;
  quantity: number;
  selected: boolean;
};

export type OrderItem = {
  productSlug: string;
  quantity: number;
  size: string;
};

export type Order = {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  pickup: string;
  items: OrderItem[];
  timeline: string[];
};

export type Student = {
  slug: string;
  rank: number;
  name: string;
  faculty: string;
  group: string;
  coins: number;
  status: string;
  bio: string;
  accentColor: "pink" | "blue" | "green" | "cyan" | "violet";
  stats: {
    events: number;
    ideas: number;
    volunteerHours: number;
  };
  achievements: string[];
  badges: string[];
  lastActivity: string;
};

export const FIXED_PICKUP_INFO = "Профком, аудитория 17-10-11";

function buildProductSizes(stockBySize: Array<[string, number]>): ProductSizeStock[] {
  return stockBySize.map(([size, stock]) => ({ size, stock }));
}

export const account = {
  name: "Анна Смирнова",
  balance: 1029,
  balanceAfterCheckout: 10,
};

export const products: Product[] = [
  {
    slug: "hudi-iskra",
    title: "Худи «Искра»",
    category: "hoodies",
    categoryLabel: "Худи",
    description: "Теплое худи оверсайз с ярким принтом проекта на спине.",
    price: 499,
    imageSrc: "/merch__hero.png",
    sizes: buildProductSizes([
      ["S 42", 3],
      ["M 44", 5],
      ["L 46", 4],
    ]),
  },
  {
    slug: "futbolka-zazhigay",
    title: "Футболка «Зажигай»",
    category: "tshirts",
    categoryLabel: "Футболки",
    description: "Базовая футболка из плотного хлопка с фирменным принтом.",
    price: 260,
    imageSrc: "/merch__hero.png",
    sizes: buildProductSizes([
      ["S 42", 8],
      ["M 44", 11],
      ["L 46", 8],
    ]),
  },
  {
    slug: "panama-dvizh",
    title: "Панама «Движ»",
    category: "accessories",
    categoryLabel: "Аксессуары",
    description: "Черная панама с вышитым логотипом для активных дней.",
    price: 150,
    imageSrc: "/merch__hero.png",
    sizes: buildProductSizes([
      ["S 42", 7],
      ["M 44", 8],
      ["L 46", 4],
    ]),
  },
  {
    slug: "shopper-start",
    title: "Шоппер «Старт»",
    category: "accessories",
    categoryLabel: "Аксессуары",
    description: "Вместительный шоппер для конспектов, ноутбука и сувениров.",
    price: 110,
    imageSrc: "/merch__hero.png",
    sizes: buildProductSizes([
      ["S 42", 10],
      ["M 44", 14],
      ["L 46", 10],
    ]),
  },
  {
    slug: "stickers-flash",
    title: "Стикерпак «Вспышка»",
    category: "accessories",
    categoryLabel: "Аксессуары",
    description: "Набор ярких наклеек для ноутбука, ежедневника и бейджа.",
    price: 45,
    imageSrc: "/merch__hero.png",
    sizes: buildProductSizes([
      ["S 42", 26],
      ["M 44", 28],
      ["L 46", 26],
    ]),
  },
  {
    slug: "longsliv-impuls",
    title: "Лонгслив «Импульс»",
    category: "tshirts",
    categoryLabel: "Футболки",
    description: "Лонгслив с мягким рукавом и минималистичным знаком проекта.",
    price: 320,
    imageSrc: "/merch__hero.png",
    sizes: buildProductSizes([
      ["S 42", 5],
      ["M 44", 6],
      ["L 46", 5],
    ]),
  },
];

export const cartItems: CartItem[] = [
  {
    id: "cart-hoodie",
    productSlug: "hudi-iskra",
    size: "M 44",
    quantity: 1,
    selected: true,
  },
  {
    id: "cart-shirt",
    productSlug: "futbolka-zazhigay",
    size: "M 44",
    quantity: 1,
    selected: true,
  },
  {
    id: "cart-panama",
    productSlug: "panama-dvizh",
    size: "M 44",
    quantity: 1,
    selected: true,
  },
  {
    id: "cart-shopper",
    productSlug: "shopper-start",
    size: "M 44",
    quantity: 1,
    selected: true,
  },
];

export const orderHistory: Order[] = [
  {
    id: "ZG-2026-041",
    createdAt: "15 мая 2026",
    status: "Готов к выдаче",
    total: 759,
    pickup: FIXED_PICKUP_INFO,
    items: [
      { productSlug: "hudi-iskra", quantity: 1, size: "M 44" },
      { productSlug: "futbolka-zazhigay", quantity: 1, size: "M 44" },
    ],
    timeline: ["Оформлен", "Готов к выдаче"],
  },
  {
    id: "ZG-2026-038",
    createdAt: "28 апреля 2026",
    status: "Получен",
    total: 305,
    pickup: FIXED_PICKUP_INFO,
    items: [
      { productSlug: "panama-dvizh", quantity: 1, size: "S 42" },
      { productSlug: "stickers-flash", quantity: 1, size: "S 42" },
      { productSlug: "shopper-start", quantity: 1, size: "M 44" },
    ],
    timeline: ["Оформлен", "Готов к выдаче", "Получен"],
  },
];

const featuredStudents: Student[] = [
  {
    slug: "ivanov-ivan",
    rank: 1,
    name: "Иванов Иван Иванович",
    faculty: "Институт математики и ИТ",
    group: "22ПИ-1",
    coins: 1280,
    status: "Лидер месяца",
    bio: "Запускает студенческие инициативы, ведет команды на событиях и помогает новичкам быстро включаться в проект.",
    accentColor: "pink",
    stats: { events: 18, ideas: 9, volunteerHours: 64 },
    achievements: ["Собрал команду на городской форум", "Провел серию встреч для первокурсников", "Предложил идею кампусного квиза"],
    badges: ["Организатор", "Наставник", "Инициатор"],
    lastActivity: "Вел регистрацию на фестивале инициатив",
  },
  {
    slug: "petrov-petr",
    rank: 2,
    name: "Петров Петр Петрович",
    faculty: "Факультет экономики",
    group: "23ЭК-2",
    coins: 1000,
    status: "Амбассадор проекта",
    bio: "Отвечает за коммуникации, помогает оформлять идеи и регулярно привлекает партнеров к студенческим событиям.",
    accentColor: "green",
    stats: { events: 15, ideas: 7, volunteerHours: 52 },
    achievements: ["Подготовил партнерскую презентацию", "Собрал медиаплан проекта", "Помог команде закрыть смены волонтеров"],
    badges: ["PR", "Команда", "Партнерства"],
    lastActivity: "Координировал анонсы недели проекта",
  },
  {
    slug: "sidorov-sergey",
    rank: 3,
    name: "Сидоров Сергей Сергеевич",
    faculty: "Юридический факультет",
    group: "21ЮР-4",
    coins: 700,
    status: "Автор идей",
    bio: "Превращает сложные предложения в понятные заявки и помогает участникам доводить идеи до запуска.",
    accentColor: "violet",
    stats: { events: 11, ideas: 12, volunteerHours: 38 },
    achievements: ["Описал регламент добрых дел", "Запустил подборку полезных шаблонов", "Провел брейншторм для активистов"],
    badges: ["Идеи", "Документы", "Фасилитация"],
    lastActivity: "Модерировал встречу проектных команд",
  },
  {
    slug: "kuznetsov-aleksey",
    rank: 4,
    name: "Кузнецов Алексей Алексеевич",
    faculty: "Факультет энергетики",
    group: "22ЭН-3",
    coins: 500,
    status: "Техническая опора",
    bio: "Настраивает площадки, помогает с техникой и отвечает за спокойный запуск событий без суеты.",
    accentColor: "cyan",
    stats: { events: 12, ideas: 4, volunteerHours: 45 },
    achievements: ["Собрал чек-лист площадки", "Настроил трансляцию встречи", "Помог команде на дне открытых дверей"],
    badges: ["Техника", "События"],
    lastActivity: "Готовил площадку для лекции",
  },
  {
    slug: "smirnova-anna",
    rank: 5,
    name: "Смирнова Анна Андреевна",
    faculty: "Архитектурно-строительный факультет",
    group: "24АС-1",
    coins: 450,
    status: "Дизайн и забота",
    bio: "Делает визуальные материалы, собирает атмосферу мероприятий и следит, чтобы участникам было удобно.",
    accentColor: "violet",
    stats: { events: 10, ideas: 6, volunteerHours: 31 },
    achievements: ["Оформила навигацию для форума", "Собрала серию афиш", "Помогла с фотозоной проекта"],
    badges: ["Дизайн", "Забота"],
    lastActivity: "Готовила визуалы для встречи",
  },
  {
    slug: "vasileva-maria",
    rank: 6,
    name: "Васильева Мария Михайловна",
    faculty: "Филологический факультет",
    group: "23ФЛ-2",
    coins: 200,
    status: "Голос команды",
    bio: "Пишет тексты, берет интервью у участников и помогает проекту говорить живым языком.",
    accentColor: "cyan",
    stats: { events: 8, ideas: 5, volunteerHours: 22 },
    achievements: ["Подготовила серию постов", "Взяла интервью у лидеров", "Собрала FAQ для участников"],
    badges: ["Тексты", "Медиа"],
    lastActivity: "Писала материал о волонтерах",
  },
  {
    slug: "nikolaeva-elena",
    rank: 7,
    name: "Николаева Елена Олеговна",
    faculty: "Институт управления",
    group: "22ГУ-1",
    coins: 180,
    status: "Координатор смен",
    bio: "Расставляет роли на событиях и быстро закрывает организационные вопросы на площадке.",
    accentColor: "green",
    stats: { events: 9, ideas: 3, volunteerHours: 28 },
    achievements: ["Составила график смен", "Обучила новых волонтеров", "Собрала обратную связь после форума"],
    badges: ["Координация", "Волонтерство"],
    lastActivity: "Собирала команду на субботник",
  },
  {
    slug: "orlov-maksim",
    rank: 8,
    name: "Орлов Максим Денисович",
    faculty: "Факультет транспорта",
    group: "21ТР-2",
    coins: 160,
    status: "Логистика",
    bio: "Помогает доставлять материалы, встречать гостей и держать маршрут события под контролем.",
    accentColor: "blue",
    stats: { events: 7, ideas: 2, volunteerHours: 24 },
    achievements: ["Собрал карту площадки", "Настроил выдачу бейджей", "Помог с доставкой мерча"],
    badges: ["Логистика", "Площадка"],
    lastActivity: "Координировал встречу гостей",
  },
  {
    slug: "romanova-daria",
    rank: 9,
    name: "Романова Дарья Игоревна",
    faculty: "Химико-биологический факультет",
    group: "24ХБ-3",
    coins: 120,
    status: "Новый активист",
    bio: "Быстро включилась в проект, помогает на событиях и предлагает свежие форматы для командных встреч.",
    accentColor: "violet",
    stats: { events: 5, ideas: 4, volunteerHours: 16 },
    achievements: ["Помогла на карьерном дне", "Предложила формат мини-лекций", "Собрала отзывы участников"],
    badges: ["Старт", "Идеи"],
    lastActivity: "Работала на инфостойке",
  },
  {
    slug: "pavlov-nikita",
    rank: 100,
    name: "Павлов Никита Николаевич",
    faculty: "Исторический факультет",
    group: "25ИС-1",
    coins: 1,
    status: "Первый шаг",
    bio: "Только присоединился к проекту и уже сделал первое доброе дело.",
    accentColor: "cyan",
    stats: { events: 1, ideas: 0, volunteerHours: 2 },
    achievements: ["Помог команде на регистрации"],
    badges: ["Новичок"],
    lastActivity: "Получил первую монетку",
  },
];

const generatedLastNames = [
  "Абрамов",
  "Алексеев",
  "Андреев",
  "Белов",
  "Борисов",
  "Виноградов",
  "Гаврилов",
  "Громов",
  "Данилов",
  "Егоров",
  "Жуков",
  "Зайцев",
  "Калинин",
  "Комаров",
  "Лебедев",
  "Макаров",
  "Мельников",
  "Морозов",
  "Назаров",
  "Новиков",
  "Поляков",
  "Савельев",
  "Семенов",
  "Соколов",
  "Тарасов",
  "Федоров",
  "Фомин",
  "Чернов",
  "Шестаков",
  "Яковлев",
];

const generatedFirstNames = [
  "Артем",
  "Денис",
  "Егор",
  "Илья",
  "Кирилл",
  "Матвей",
  "Никита",
  "Павел",
  "Роман",
  "Тимур",
  "Алина",
  "Вера",
  "Дарья",
  "Екатерина",
  "Ксения",
  "Лилия",
  "Полина",
  "Софья",
  "Юлия",
  "Яна",
];

const generatedPatronymics = [
  "Александрович",
  "Андреевич",
  "Дмитриевич",
  "Игоревич",
  "Максимович",
  "Михайлович",
  "Сергеевич",
  "Александровна",
  "Андреевна",
  "Дмитриевна",
  "Игоревна",
  "Максимовна",
  "Михайловна",
  "Сергеевна",
];

const generatedFaculties = [
  "Институт математики и ИТ",
  "Факультет экономики",
  "Юридический факультет",
  "Факультет энергетики",
  "Архитектурно-строительный факультет",
  "Филологический факультет",
  "Институт управления",
  "Факультет транспорта",
  "Химико-биологический факультет",
  "Исторический факультет",
];

const generatedStatuses = [
  "Активист проекта",
  "Волонтер смен",
  "Автор инициатив",
  "Помощник команды",
  "Медиаволонтер",
  "Координатор площадки",
];

function buildGeneratedStudent(rank: number): Student {
  const nameIndex = rank - 10;
  const firstName = generatedFirstNames[nameIndex % generatedFirstNames.length];
  const lastName = generatedLastNames[nameIndex % generatedLastNames.length];
  const patronymic = generatedPatronymics[nameIndex % generatedPatronymics.length];
  const faculty = generatedFaculties[nameIndex % generatedFaculties.length];
  const status = generatedStatuses[nameIndex % generatedStatuses.length];
  const accentColor = (["blue", "green", "cyan", "violet", "pink"] as const)[nameIndex % 5];
  const coins = Math.max(30, 129 - rank);
  const events = Math.max(1, 12 - Math.floor(rank / 12));
  const ideas = nameIndex % 7;
  const volunteerHours = Math.max(3, 36 - Math.floor(rank / 4));

  return {
    slug: `student-${String(rank).padStart(3, "0")}`,
    rank,
    name: `${lastName} ${firstName} ${patronymic}`,
    faculty,
    group: `${21 + (rank % 5)}-${rank % 2 === 0 ? "ПР" : "АК"}-${(rank % 4) + 1}`,
    coins,
    status,
    bio: "Участник топ-100 проекта: помогает на событиях, берет задачи в команде и зарабатывает монетки за вклад в студенческую среду.",
    accentColor,
    stats: { events, ideas, volunteerHours },
    achievements: [
      "Участвовал в студенческом событии проекта",
      "Помог команде закрыть организационную задачу",
      "Получил монетки за активность и инициативность",
    ],
    badges: [status, "Топ-100"],
    lastActivity: "Отметился в рейтинге активности проекта",
  };
}

const generatedTopStudents = Array.from({ length: 90 }, (_, index) =>
  buildGeneratedStudent(index + 10),
);

export const students: Student[] = [
  ...featuredStudents.filter((student) => student.rank < 10),
  ...generatedTopStudents,
  ...featuredStudents.filter((student) => student.rank === 100),
].sort((first, second) => first.rank - second.rank);

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getStudentBySlug(slug: string) {
  return students.find((student) => student.slug === slug);
}

export function getCartProduct(productSlug: string) {
  const product = getProductBySlug(productSlug);

  if (!product) {
    throw new Error(`Product with slug "${productSlug}" was not found in mock data.`);
  }

  return product;
}
