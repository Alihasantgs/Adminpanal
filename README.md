# Admin Panel - React Vite Admin Dashboard

A modern, responsive admin panel built with React, Vite, TypeScript, and Tailwind CSS. This project provides a complete authentication system with a clean, professional dashboard interface.

## 🚀 Tech Stack

- **⚡ Vite** - Lightning-fast build tool and development server
- **⚛️ React 19** - Latest React with TypeScript support
- **🎨 Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **📘 TypeScript** - Type-safe development with enhanced developer experience
- **🔄 React Router DOM** - Client-side routing for single-page applications
- **🍞 React Hot Toast** - Beautiful toast notifications
- **🌐 Axios** - HTTP client for API requests
- **🔐 JWT Authentication** - Secure token-based authentication

## ✨ Features

### 🔐 Authentication System
- **Secure Login** - JWT token-based authentication
- **Protected Routes** - Automatic redirection based on authentication status
- **Token Management** - Automatic token storage and refresh handling
- **Error Handling** - Comprehensive error handling with user-friendly messages
- **Toast Notifications** - Real-time feedback for user actions

### 🎨 User Interface
- **Responsive Design** - Mobile-first responsive layout
- **Modern UI** - Clean, professional design with Tailwind CSS
- **Dark Theme Ready** - Easy theme customization
- **Component Library** - Reusable UI components
- **Professional Layout** - Admin dashboard with sidebar and header

### 📊 Dashboard Features
- **Data Table** - Advanced data table with pagination
- **User Management** - User profile dropdown with logout functionality
- **Real-time Updates** - Live data updates and notifications
- **Professional Styling** - Consistent design system

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/adminpanal.git
   cd adminpanal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://192.168.0.111:3000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |

## 🏗️ Project Structure

```
src/
├── api/                    # API layer
│   ├── auth.ts            # Authentication API endpoints
│   └── axios.ts           # Axios configuration & interceptors
├── components/             # Reusable UI components
│   ├── DataTable.tsx      # Data table with pagination
│   ├── Header.tsx         # Top navigation bar
│   ├── Sidebar.tsx        # Side navigation menu
│   └── UserDropdown.tsx   # User profile dropdown
├── context/                # React Context providers
│   └── AuthContext.tsx    # Authentication state management
├── pages/                  # Page components
│   ├── AuthForm.tsx       # Login form page
│   └── Dashboard.tsx      # Main dashboard page
├── App.tsx                # Main application component
├── main.tsx               # Application entry point
└── index.css              # Global styles & Tailwind imports
```

## 🔧 Configuration

### Environment Variables
- `VITE_API_BASE_URL` - Backend API base URL

### Tailwind CSS
The project uses a custom Tailwind configuration with:
- Custom color palette optimized for admin interfaces
- Responsive breakpoints
- Custom component classes
- Dark mode support ready

### API Configuration
- Automatic token injection in requests
- Request/response interceptors
- Error handling for 401 responses
- Automatic logout on token expiration

## 🎨 Customization

### Colors & Theming
Modify `tailwind.config.js` to customize:
- Primary color scheme
- Typography settings
- Spacing and sizing
- Component variants

### Components
All components are built with Tailwind CSS and can be easily customized:
- Modify component styles directly
- Add new utility classes
- Extend the design system
- Implement custom themes

### Layout
The layout system includes:
- Responsive sidebar navigation
- Flexible header with user controls
- Main content area with proper spacing
- Mobile-optimized interactions

## 📱 Responsive Design

| Breakpoint | Description | Layout |
|------------|-------------|---------|
| Mobile (< 768px) | Collapsible sidebar, stacked layout | Single column |
| Tablet (768px - 1024px) | Sidebar visible, adjusted spacing | Two column |
| Desktop (> 1024px) | Full sidebar, optimal spacing | Three column |

## 🔐 Authentication Flow

1. **Login Process**
   - User enters credentials
   - API validates credentials
   - JWT token received and stored
   - User redirected to dashboard

2. **Token Management**
   - Automatic token injection in API requests
   - Token expiration handling
   - Automatic logout on invalid token

3. **Route Protection**
   - Protected routes require authentication
   - Public routes redirect authenticated users
   - Loading states during authentication checks

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options

#### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Vercel automatically detects Vite configuration
3. Deploy with zero configuration

#### Netlify
1. Build the project: `npm run build`
2. Upload `dist` folder to Netlify
3. Configure redirects for SPA routing

#### Traditional Hosting
1. Build the project: `npm run build`
2. Upload `dist` folder to your web server
3. Configure server for SPA routing

## 🧪 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Implement proper error handling
- Use meaningful component and variable names

### Component Development
- Create reusable components
- Use proper TypeScript interfaces
- Implement responsive design
- Follow accessibility guidelines

### API Integration
- Use the configured Axios instance
- Implement proper error handling
- Use TypeScript interfaces for API responses
- Handle loading and error states

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Contribution Guidelines
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Check the documentation
- Review the code examples

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the fast build tool
- Tailwind CSS team for the utility-first CSS framework
- All contributors and the open-source community

---

**Built with ❤️ using React, Vite, TypeScript, and Tailwind CSS**

*Professional admin panel solution for modern web applications*
