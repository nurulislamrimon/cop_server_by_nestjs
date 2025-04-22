import * as bcrypt from 'bcryptjs';
import { saltRounds } from '../constants/common.constants';
import { PrismaService } from '../lib/prisma/prisma.service';

export async function seedService() {
  const prisma = new PrismaService();
  await prisma.$connect();

  const isAdminExist = await prisma.member.findFirst({});

  if (!isAdminExist) {
    // create rule
    await prisma.member_access_rule.create({
      data: {
        role: 'super_admin',
        rules: [],
      },
    });
    // create user
    const password = await bcrypt.hash('Admin123', saltRounds);
    await prisma.member.create({
      data: {
        full_name: 'Nurul Islam Rimon',
        email: 'nurulislamrimon@gmail.com',
        password,
        role: 'super_admin',
        phone_number: '01715494846',
      },
    });

    console.log('✅ Admin user seeded');
  } else {
    console.log('ℹ️ Admin user already exists');
  }

  await prisma.$disconnect();
}
