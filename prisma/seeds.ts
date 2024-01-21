import { PrismaClient } from '@prisma/client';
import {v4 as uuid} from 'uuid';
import fs from 'fs';

const prisma = new PrismaClient();

const blogDataTypeOfString = fs.readFileSync("/prisma/seeds/blogdata.json", 'utf-8');
const blogData = JSON.parse(blogDataTypeOfString)

async function main() {
    const toBeCreatedBlogData = blogData.contents.map(blog => {
        const {id, publishedAt, revisedAt, tags, ...filteredBlogData} = blog
        return {...filteredBlogData, id: uuid()}
    });
    const seeds = await prisma.blog.createMany({
        data: toBeCreatedBlogData
    });
    console.log(seeds)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })