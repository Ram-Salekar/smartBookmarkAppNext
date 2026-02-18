Smart Bookmark Application

Project Overview

Smart Bookmark is a full stack web application built with Nextjs App Router Supabase and Tailwind CSS The application allows users to securely log in using Google OAuth and manage personal bookmarks with full create read update and delete functionality Each user can only access their own bookmarks through database level security using Supabase Row Level Security

Technology Stack

Frontend Nextjs App Router TypeScript Tailwind CSS
Backend Supabase Auth Postgres Database Realtime
Authentication Google OAuth
Deployment Vercel

Core Features

User authentication using Google OAuth
Secure session management using Supabase
Protected dashboard route using Nextjs middleware
Create bookmark with title and url
Read bookmarks sorted by creation date
Update existing bookmarks
Delete bookmarks
Realtime synchronization across browser tabs
Row Level Security enforcing per user data isolation

Architecture Overview

Client Side

The frontend is built using Nextjs App Router with client components for interactive behavior Supabase browser client is used for authentication and database queries The dashboard subscribes to realtime updates using Supabase channels

Authentication Flow

User clicks login with Google
Google authenticates the user
Supabase handles OAuth callback
Supabase creates or retrieves user in auth users table
User session is stored in cookies
Dashboard route is protected using middleware

Database Design

Table name bookmarks

Fields

id uuid primary key
user id uuid foreign key referencing auth users
title text not null
url text not null
created at timestamp with timezone default now

Security Model

Row Level Security is enabled on the bookmarks table Four policies are defined

Select policy allowing users to read only their own bookmarks
Insert policy allowing users to insert only with their own user id
Update policy allowing users to update only their own bookmarks
Delete policy allowing users to delete only their own bookmarks

Security is enforced at the database layer and cannot be bypassed from the client

Realtime Implementation

Supabase realtime replication is enabled for the bookmarks table The dashboard subscribes to postgres changes events When an insert update or delete occurs the bookmark list automatically refreshes without page reload

Local Development Setup

Step 1 Clone repository
Step 2 Install dependencies using npm install
Step 3 Create a file named env local in the project root
Step 4 Add the following environment variables

NEXT PUBLIC SUPABASE URL
NEXT PUBLIC SUPABASE ANON KEY

Step 5 Run npm run dev
Step 6 Open http localhost 3000

Google OAuth Setup

Create Google Cloud project
Configure OAuth consent screen
Create OAuth client id as Web application
Add authorized redirect URI for Supabase callback
Enable Google provider in Supabase and add client id and client secret

Deployment

Application is deployed on Vercel

Add environment variables in Vercel project settings
Add production redirect URLs in Supabase
Add production redirect URLs in Google Cloud OAuth credentials
Redeploy application

Production Features

Secure authentication
Database level access control
Protected routes using middleware
Realtime data synchronization
Clean responsive UI using Tailwind

Future Improvements

Form validation with user feedback
Toast notifications
Optimistic UI updates
Improved loading states
Dark mode support
Pagination and search functionality

Author

Developed as a secure full stack bookmark management application using modern Nextjs and Supabase architecture
