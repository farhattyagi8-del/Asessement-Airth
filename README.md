# Job Queue Dashboard

A full-stack Job Queue Dashboard built with **ReactJS** and **NestJS**.  
It allows users to create, monitor, update, filter, and delete jobs through a simple dashboard.

## Live Demo

- **Frontend:** https://asessement-airth.vercel.app/
- **Backend API:** https://asessement-airth.onrender.com/

## Tech Stack

### Frontend
- ReactJS
- Vite
- CSS
- Fetch API

### Backend
- NestJS
- TypeScript
- TypeORM
- SQLite

### Deployment
- Frontend: Vercel
- Backend: Render

## Features

- Create new jobs
- View all jobs
- Filter jobs by status
- View job statistics
- Update job status
- Delete jobs
- Loading states
- Error handling
- Backend-enforced status transitions
- Concurrent status update protection
- Persistent job data using SQLite

## Job Status Flow

Jobs follow these allowed transitions:

```text
pending → running
running → completed
running → failed
