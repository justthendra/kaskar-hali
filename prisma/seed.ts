import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const branches = [
    {
      username: 'kaskarhali1',
      password: 'kaskarcam', // Will be hashed
      name: 'Kaşkar Halı - Camlıkahve',
      email: 'camlikahve@kaskarhali.com', // Placeholder email
      role: 'ADMIN' // Giving ADMIN access so they can log in to the panel
    },
    {
      username: 'kaskarhali2',
      password: 'kaskargul',
      name: 'Kaşkar Halı - Gültepe',
      email: 'gultepe@kaskarhali.com',
      role: 'ADMIN'
    },
    {
      username: 'kaskarhali3',
      password: 'kaskaresen',
      name: 'Kaşkar Halı - Atışalanı',
      email: 'atisalani@kaskarhali.com',
      role: 'ADMIN'
    },
  ];

  for (const branch of branches) {
    const hashedPassword = await bcrypt.hash(branch.password, 10);
    
    const user = await prisma.user.upsert({
      where: { username: branch.username },
      update: {
        password: hashedPassword,
        name: branch.name,
        role: branch.role
      },
      create: {
        username: branch.username,
        email: branch.email,
        password: hashedPassword,
        name: branch.name,
        role: branch.role
      },
    });
    
    console.log(`Upserted user: ${user.username} (${user.name})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
