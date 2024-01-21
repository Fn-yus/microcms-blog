import { Blog } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Blog[]>,
) {
  const blogs = await prisma.blog.findMany();
  res.status(200).json(blogs);
}