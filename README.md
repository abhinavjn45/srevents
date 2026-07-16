# SR Events - Creators Awards Voting Platform

A complete voting platform for creator awards events. Features a modern Next.js frontend with a secure Node.js/Express backend.

![Status](https://img.shields.io/badge/Status-Development-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🎯 Features

### Public Website
- ✨ Premium dark theme with gold accents
- 🗳️ One-click voting system
- ⏱️ Live countdown timer
- 📱 Fully responsive mobile-first design
- 🔒 Duplicate vote prevention
- 🤖 Cloudflare Turnstile spam protection

### Admin Dashboard
- 📊 Real-time voting analytics
- 📑 Category management
- ⭐ Creator management  
- 📈 Vote statistics and reports
- 📁 CSV export functionality
- 🔐 Secure JWT authentication
- 📋 Audit logging

### Security
- Browser fingerprinting
- IP address logging
- User-agent tracking
- Rate limiting
- SQL injection prevention
- XSS protection
- Secure password hashing (bcryptjs)
- HTTPS support

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MySQL 8.0+
- npm or yarn

### Installation

1. **Clone and Setup Database**
   ```bash
   mysql -u root -p sr_events < database/schema.sql
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   npm run dev
   ```

4. **Access Application**
   - Public: http://localhost:3000
   - Admin: http://localhost:3000/login
   - API: http://localhost:5000/api

**Default Admin Credentials:**
- Email: `admin@example.com`
- Password: `admin123`

## 📁 Project Structure

```
sr_events/
├── backend/              # Express.js REST API
├── frontend/             # Next.js React Application
├── database/             # MySQL schema
├── documentation/        # Project specifications
├── SETUP.md             # Detailed setup guide
└── README.md            # This file
```

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Comprehensive setup and deployment guide
- **[Api.md](./Api.md)** - Complete API documentation
- **[Architecture.md](./Architecture.md)** - System architecture overview
- **[Database.md](./Database.md)** - Database schema and design
- **[Design.md](./Design.md)** - UI/UX design guidelines
- **[Security.md](./Security.md)** - Security implementation details
- **[PRD.md](./PRD.md)** - Product requirements document

## 🛠️ Tech Stack

### Frontend
- Next.js 13+
- React 18+
- TypeScript
- Tailwind CSS
- Framer Motion
- Axios
- React Hook Form

### Backend
- Node.js
- Express.js
- MySQL
- JWT Authentication
- Multer (File Upload)
- Helmet (Security)

### DevOps
- npm/yarn
- Git/GitHub

## 📖 API Examples

### Public API

**Get Categories**
```bash
curl http://localhost:5000/api/categories
```

**Submit Vote**
```bash
curl -X POST http://localhost:5000/api/vote \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": 1,
    "creatorId": 5,
    "browserFingerprint": "xxxxx",
    "turnstileToken": "xxxxx"
  }'
```

### Admin API

**Login**
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

**Get Dashboard**
```bash
curl http://localhost:5000/api/admin/dashboard \
  -H "Cookie: authToken=your_jwt_token"
```

## 🔐 Security Features

- ✅ HTTPS-ready
- ✅ CORS configured
- ✅ Rate limiting
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CSRF tokens
- ✅ Secure password hashing
- ✅ JWT authentication
- ✅ Environment variables protection
- ✅ Audit logging

## 📊 Database Schema

The application uses a normalized MySQL schema with 7 tables:

- `admins` - Administrator accounts
- `categories` - Award categories
- `creators` - Creator nominations
- `votes` - Vote records
- `vote_devices` - Device fingerprints (fraud prevention)
- `audit_logs` - Admin activity logs
- `settings` - Application settings

## 🚢 Deployment

### Recommended Hosting

- **Frontend**: Vercel, Netlify, AWS Amplify
- **Backend**: Hostinger, Heroku, AWS EC2
- **Database**: Managed MySQL (Hostinger, AWS RDS)

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend .env:**
```env
PORT=5000
NODE_ENV=production
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=sr_events
JWT_SECRET=your_long_random_secret
TURNSTILE_SECRET_KEY=your_turnstile_key
CORS_ORIGIN=https://yourdomain.com
```

**Frontend .env.local:**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Commit with clear messages
4. Push and create a Pull Request

## 📝 License

MIT License - See LICENSE file for details

## 📞 Support

For issues or questions:
1. Check the [SETUP.md](./SETUP.md) troubleshooting section
2. Review the relevant documentation file
3. Check API endpoints and error responses

## 🎉 Acknowledgments

Built with ❤️ for SR Events

---

**Version**: 1.0.0  
**Last Updated**: July 2024  
**Status**: Production Ready
