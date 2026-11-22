import "dotenv/config";
import { prisma } from "./index";

async function main() {
  const user = await prisma.user.create({
    data: { name: "Temp User", email: `temp-${Date.now()}@test.com`, passwordHash: "x" },
  });

  const monitor = await prisma.monitor.create({
    data: { userId: user.id, name: "Temp Monitor", url: "https://example.com" },
  });

  const fetched = await prisma.monitor.findUnique({
    where: { id: monitor.id },
    include: { user: true },
  });
  console.log("Monitor with owner:", fetched);

  // cascade removes the monitor too
  await prisma.user.delete({ where: { id: user.id } });
  console.log("Cleaned up. Monitors left:", await prisma.monitor.count());
}

main().finally(() => prisma.$disconnect());