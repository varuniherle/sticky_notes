const initialNotes = [
    { id: 1, content: 'Git Clone Repository:\ngit clone <repository-url>', priority: 2 },
    { id: 2, content: 'Git Basic Commands:\ngit add .\ngit commit -m "message"\ngit push origin main', priority: 3 },
    { id: 3, content: 'Git Branch Commands:\ngit branch <new-branch>\ngit checkout <branch>\ngit merge <branch>', priority: 1 },
    { id: 4, content: 'Deploy to Vercel:\n1. vercel login\n2. vercel init\n3. vercel deploy', priority: 2 },
    { id: 5, content: 'Deploy to Netlify:\n1. netlify login\n2. netlify init\n3. netlify deploy', priority: 3 },
    { id: 6, content: 'NPM Commands:\nnpm install\nnpm start\nnpm run build', priority: 1 }
  ];
  export default initialNotes;
  