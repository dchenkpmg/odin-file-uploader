# Google Drive 2

Google Drive 2 is an unofficial sequel to Google Drive. It's Google Drive, but 2. Built with Express and Postgres, with Passport for authentication and Prisma for the ORM.

## Features

- Upload files
- Download files
- Delete files

Totally not a CRUD app.

## Data Model

Quick notes:

- Two main entities: Users and Files (which can also be folders)
- Each user can only see their own files
- Very important: Each file has an optional parent field (because some files can be at the root level), and an optional children field (which is a list of file IDs that are children of this file) - folders will have children, files will not
