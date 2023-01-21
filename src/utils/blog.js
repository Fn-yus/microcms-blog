// functions about blogs.

export const sortAllBlogs = (blogs) => {
    return blogs.contents.sort((a, b) =>{
      const timeA = new Date(a.publishedAt).getTime();
      const timeB = new Date(b.publishedAt).getTime();
      return timeB - timeA;
    })
}