import * as bcrypt from "bcrypt";

import { PrismaClient, UserRole } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Хешируем пароли
  const defaultPassword = await bcrypt.hash("password123", 10);
  const adminPassword = await bcrypt.hash("admin123", 10);

  // Создаем администратора
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {
      password: adminPassword,
      role: UserRole.ADMIN,
    },
    create: {
      email: "admin@example.com",
      name: "System Administrator",
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  // Создаем обычных пользователей
  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {
      password: defaultPassword,
      role: UserRole.USER,
    },
    create: {
      email: "alice@example.com",
      name: "Alice Johnson",
      password: defaultPassword,
      role: UserRole.USER,
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {
      password: defaultPassword,
      role: UserRole.USER,
    },
    create: {
      email: "bob@example.com",
      name: "Bob Smith",
      password: defaultPassword,
      role: UserRole.USER,
    },
  });

  const charlie = await prisma.user.upsert({
    where: { email: "charlie@example.com" },
    update: {
      password: defaultPassword,
      role: UserRole.USER,
    },
    create: {
      email: "charlie@example.com",
      name: "Charlie Brown",
      password: defaultPassword,
      role: UserRole.USER,
    },
  });

  // Создаем тестовые контакты - связи между пользователями
  const aliceContacts = await Promise.all([
    prisma.contact.upsert({
      where: { id: "alice-contact-1" },
      update: {},
      create: {
        id: "alice-contact-1",
        userId: alice.id, // Alice добавляет Bob в контакты
        contactUserId: bob.id,
        notes: "Коллега по работе, отличный разработчик",
        tags: ["работа", "разработчик", "важный"],
      },
    }),
    prisma.contact.upsert({
      where: { id: "alice-contact-2" },
      update: {},
      create: {
        id: "alice-contact-2",
        userId: alice.id, // Alice добавляет Charlie в контакты
        contactUserId: charlie.id,
        notes: "Друг из университета, дизайнер",
        tags: ["друзья", "дизайн"],
      },
    }),
    prisma.contact.upsert({
      where: { id: "alice-contact-3" },
      update: {},
      create: {
        id: "alice-contact-3",
        userId: alice.id, // Alice добавляет Admin в контакты (архивированный)
        contactUserId: admin.id,
        notes: "Системный администратор",
        tags: ["работа", "админ"],
        isActive: false, // Архивированный контакт
      },
    }),
  ]);

  // Создаем тестовые контакты для Bob
  const bobContacts = await Promise.all([
    prisma.contact.upsert({
      where: { id: "bob-contact-1" },
      update: {},
      create: {
        id: "bob-contact-1",
        userId: bob.id, // Bob добавляет Alice в контакты
        contactUserId: alice.id,
        notes: "Менеджер проекта, очень организованная",
        tags: ["работа", "менеджмент"],
      },
    }),
    prisma.contact.upsert({
      where: { id: "bob-contact-2" },
      update: {},
      create: {
        id: "bob-contact-2",
        userId: bob.id, // Bob добавляет Charlie в контакты
        contactUserId: charlie.id,
        notes: "Креативный дизайнер",
        tags: ["дизайн", "креатив"],
      },
    }),
  ]);

  console.log("✅ Database seeded successfully");
  console.log("👤 Created users:");
  console.log(`   🔐 ${admin.name} (${admin.email}) - ADMIN`);
  console.log(`   👤 ${alice.name} (${alice.email}) - USER`);
  console.log(`   👤 ${bob.name} (${bob.email}) - USER`);
  console.log(`   👤 ${charlie.name} (${charlie.email}) - USER`);
  console.log("");
  console.log("📇 Created contacts:");
  console.log(`   👤 Alice: ${aliceContacts.length} contacts (1 archived)`);
  console.log(`   👤 Bob: ${bobContacts.length} contacts`);
  console.log("");
  console.log("🔑 Default passwords:");
  console.log("   Admin: admin123");
  console.log("   Users: password123");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
