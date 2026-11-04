# Thomas Makoye Portfolio

A Next.js App Router portfolio with a PostgreSQL database managed by Prisma. Public pages read their content from PostgreSQL on each request. The admin dashboard provides protected create, edit, and delete tools for skills, software projects, and media.

## Setup

1. Install Node.js 20.9 or newer and PostgreSQL.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env` and set `DATABASE_URL`, a strong `ADMIN_PASSWORD`, and an `ADMIN_SESSION_SECRET` of at least 32 characters.
4. Create the database named in `DATABASE_URL`, then apply the checked-in schema and starter content:

   ```sh
   npm run db:deploy
   npm run db:seed
   npm run dev
   ```

5. Open `/home`; sign in to `/admin` using `ADMIN_PASSWORD`.

For production, deploy the complete Next.js application (including its API routes) to Vercel. The Vercel build runs Prisma migrations and adds missing starter content before building. Set `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` (at least 32 characters), and `BLOB_READ_WRITE_TOKEN` in Vercel project settings. Create a Vercel Blob store and add its read/write token before using profile-image uploads.

For future schema edits, create migrations using `npm run db:migrate -- --name <description>`. Starter seeding only adds records that do not already exist, preserving admin-edited content.

## Routes

- `/home` — portfolio landing page
- `/skills` — database-managed skills
- `/software-projects` — database-managed software projects
- `/media-gallery` — image masonry and embedded/direct video gallery
- `/admin` — protected content management dashboard

Media may be supplied as an HTTPS image URL, a direct MP4/WebM/OGG URL, or a YouTube/Vimeo link. Configure the admin password and signing secret on the server; no admin credentials are stored in the browser or source.

The admin home-page settings allow editing the display name, typing-animation roles, hero description, about text, and profile photo. The photo can be supplied as an HTTP(S) URL or uploaded as a JPEG, PNG, WebP, or GIF (up to 5 MB). Uploads are stored in Vercel Blob so they persist across deployments.

Skills include an editable description and self-assessed proficiency percentage. Migrations and initial starter content are applied automatically during Vercel production builds.
