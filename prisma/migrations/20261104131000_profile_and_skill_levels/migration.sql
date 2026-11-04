ALTER TABLE "skills"
ADD COLUMN "level" INTEGER NOT NULL DEFAULT 50;

CREATE TABLE "portfolio_settings" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "displayName" TEXT NOT NULL DEFAULT 'Thomas Makoye',
    "roles" TEXT[] NOT NULL DEFAULT ARRAY['Full-Stack Developer', 'System Administrator', 'Graphic Designer']::TEXT[],
    "heroDescription" TEXT NOT NULL DEFAULT 'Bridging the gap between robust system administration, creative design, and innovative full-stack software engineering.',
    "aboutIntro" TEXT NOT NULL DEFAULT 'I am a dedicated IT Officer and Full-Stack Developer. My career is fueled by a deep passion for both system administration and software engineering.',
    "aboutDescription" TEXT NOT NULL DEFAULT 'I believe understanding underlying infrastructure is just as important as writing clean, efficient code. From configuring robust Linux environments and containerizing applications to designing intuitive UI/UX with Inkscape and building complex React applications.',
    "profilePhotoUrl" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolio_settings_pkey" PRIMARY KEY ("id")
);

INSERT INTO "skills" ("id", "name", "iconName", "category", "description", "level", "sortOrder", "updatedAt")
SELECT starter."id", starter."name", starter."iconName", starter."category", starter."description", starter."level", starter."sortOrder", CURRENT_TIMESTAMP
FROM (VALUES
    ('seed-react', 'React', 'Code', 'Frontend', 'Building responsive, component-based web interfaces and interactive user experiences.', 70, 1),
    ('seed-node-js', 'Node.js', 'Server', 'Backend', 'Developing server-side applications and REST APIs with JavaScript and Node.js.', 65, 2),
    ('seed-docker', 'Docker', 'Terminal', 'Infrastructure', 'Packaging applications in containers for consistent development and deployment.', 55, 3),
    ('seed-python', 'Python', 'Terminal', 'Backend', 'Writing scripts and backend utilities with Python.', 60, 4),
    ('seed-inkscape', 'Inkscape', 'PenTool', 'Design', 'Creating vector graphics, illustrations, and design assets.', 60, 5),
    ('seed-kdenlive', 'Kdenlive', 'Video', 'Video', 'Editing video projects and assembling visual stories.', 55, 6)
) AS starter("id", "name", "iconName", "category", "description", "level", "sortOrder")
WHERE NOT EXISTS (
    SELECT 1 FROM "skills" existing WHERE LOWER(existing."name") = LOWER(starter."name")
);
