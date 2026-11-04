import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  const skills = [
    { name: 'React', iconName: 'Code', category: 'Frontend', description: 'Building responsive, component-based web interfaces and interactive user experiences.', level: 70, sortOrder: 1 },
    { name: 'Node.js', iconName: 'Server', category: 'Backend', description: 'Developing server-side applications and REST APIs with JavaScript and Node.js.', level: 65, sortOrder: 2 },
    { name: 'Docker', iconName: 'Terminal', category: 'Infrastructure', description: 'Packaging applications in containers for consistent development and deployment.', level: 55, sortOrder: 3 },
    { name: 'Python', iconName: 'Terminal', category: 'Backend', description: 'Writing scripts and backend utilities with Python.', level: 60, sortOrder: 4 },
    { name: 'Inkscape', iconName: 'PenTool', category: 'Design', description: 'Creating vector graphics, illustrations, and design assets.', level: 60, sortOrder: 5 },
    { name: 'Kdenlive', iconName: 'Video', category: 'Video', description: 'Editing video projects and assembling visual stories.', level: 55, sortOrder: 6 },
    { name: 'Full-Stack Development', iconName: 'Code', category: 'Development', description: 'Designing and building complete web applications across frontend interfaces, server-side logic, and data storage.', level: 65, sortOrder: 10 },
    { name: 'System Administration', iconName: 'Server', category: 'Infrastructure', description: 'Managing Linux systems, users, permissions, services, and day-to-day server operations.', level: 65, sortOrder: 11 },
    { name: 'DevOps & DevSecOps Engineering', iconName: 'Terminal', category: 'DevOps', description: 'Working with containers, deployment workflows, CI/CD practices, and security-aware development operations.', level: 55, sortOrder: 12 },
    { name: 'Cybersecurity & Digital Forensics', iconName: 'Terminal', category: 'Security', description: 'Applying security fundamentals, authorized lab-based digital forensics, and open-source intelligence methods.', level: 45, sortOrder: 13 },
    { name: 'Database Administration', iconName: 'Database', category: 'Database', description: 'Designing relational data structures and working with PostgreSQL, MySQL, and SQLite.', level: 55, sortOrder: 14 },
    { name: 'Network Administration', iconName: 'Globe', category: 'Network', description: 'Configuring and troubleshooting networks, SSH access, Samba sharing, and firewall rules.', level: 50, sortOrder: 15 },
    { name: 'Graphic Design & UI/UX Design', iconName: 'PenTool', category: 'Design', description: 'Creating vector graphics and designing clear, user-focused digital interfaces.', level: 60, sortOrder: 16 },
    { name: 'Video Editing & Motion Graphics', iconName: 'Video', category: 'Video', description: 'Editing video and producing motion-focused visual content with creative tools.', level: 55, sortOrder: 17 },
    { name: 'Data Analysis & Python Automation', iconName: 'Code', category: 'Data', description: 'Using Python scripts to process information, automate repetitive work, and support data analysis.', level: 50, sortOrder: 18 },
    { name: 'Mobile Application Development', iconName: 'Smartphone', category: 'Mobile', description: 'Building mobile experiences with web technologies and tools such as React and Capacitor.', level: 50, sortOrder: 19 },
    { name: 'API Development & Integration', iconName: 'Globe', category: 'API', description: 'Creating and integrating REST APIs to connect application interfaces, services, and data.', level: 55, sortOrder: 20 },
    { name: 'IT Support & Troubleshooting', iconName: 'Laptop', category: 'IT Support', description: 'Diagnosing and resolving common hardware, software, operating system, and user support issues.', level: 65, sortOrder: 21 },
    { name: 'Web Hosting & Server Management', iconName: 'Server', category: 'Hosting', description: 'Managing hosting environments, domains, web servers, and application deployment.', level: 55, sortOrder: 22 },
    { name: 'Sound Engineering & Audio Production', iconName: 'Video', category: 'Audio', description: 'Setting up sound systems and managing audio for production and live sound environments.', level: 45, sortOrder: 23 },
    { name: 'Technical Project Development', iconName: 'Laptop', category: 'Project Management', description: 'Planning, building, and coordinating technology projects from initial idea through delivery.', level: 60, sortOrder: 24 },
  ];

  for (const skill of skills) {
    const existing = await db.skill.findFirst({
      where: { name: { equals: skill.name, mode: 'insensitive' } },
      select: { id: true },
    });
    if (!existing) {
      const id = `seed-${skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      await db.skill.create({ data: { id, ...skill } });
    }
  }

  const projects = [
    {
      id: 'seed-faidaplus',
      title: 'FaidaPlus',
      description: 'An offline-first financial management application for entrepreneurs to track income, expenses, and overall business health.',
      tags: ['React Native', 'Node.js', 'PostgreSQL', 'Offline-First'],
      sortOrder: 1,
    },
    {
      id: 'seed-oda',
      title: 'ODA (Online Delivery Agency)',
      description: 'A campus-focused food delivery platform connecting university students and staff with campus cafeterias and nearby restaurants.',
      tags: ['React', 'Tailwind', 'Python', 'Docker'],
      sortOrder: 2,
    },
  ];

  for (const project of projects) {
    await db.softwareProject.upsert({ where: { id: project.id }, create: project, update: project });
  }

  await db.portfolioSettings.upsert({
    where: { id: 'main' },
    create: { id: 'main' },
    update: {},
  });
}

main()
  .then(async () => db.$disconnect())
  .catch(async error => {
    console.error('Database seed failed:', error);
    await db.$disconnect();
    process.exitCode = 1;
  });
