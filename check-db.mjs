import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
try {
  const mentors = await p.user.findMany({
    where: { role: 'MENTOR', deletedAt: null },
    select: { id: true, name: true, email: true, sid: true, deletedAt: true }
  });
  console.log('Active mentors:', JSON.stringify(mentors, null, 2));

  const allMentors = await p.user.findMany({
    where: { role: 'MENTOR' },
    select: { id: true, name: true, email: true, sid: true, deletedAt: true }
  });
  console.log('\nAll mentors (incl deleted):', JSON.stringify(allMentors, null, 2));
} catch (e) {
  console.error('ERROR:', e.message);
}
await p.$disconnect();
