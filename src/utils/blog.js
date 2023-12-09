// functions about blogs.

export const sortAllBlogs = (blogs) => {
    return blogs.sort((a, b) =>{
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return timeB - timeA;
    })
}