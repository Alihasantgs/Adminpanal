# Admin Panel - React Vite Boilerplate

A modern, responsive admin panel built with React, Vite, TypeScript, and Tailwind CSS. This boilerplate provides a solid foundation for building admin dashboards and management interfaces.

## 🚀 Features

- ⚡ **Vite** - Lightning fast build tool and dev server
- ⚛️ **React 19** - Latest React with TypeScript support
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 📱 **Responsive Design** - Mobile-first responsive layout
- 🧩 **Component Library** - Reusable UI components
- 🎯 **TypeScript** - Type-safe development
- 📊 **Dashboard Layout** - Ready-to-use admin dashboard
- 🔧 **Modern Tooling** - ESLint, PostCSS, and more

## 📦 What's Included

### Components
- **Sidebar** - Collapsible navigation sidebar
- **Header** - Top navigation with search and user menu
- **Dashboard** - Main dashboard with stats and charts
- **Table** - Reusable data table component
- **FormField** - Input field component with validation
- **Modal** - Modal dialog component

### Pages
- **Dashboard** - Overview with statistics and recent data
- Ready for additional pages (Users, Products, Orders, etc.)

### Styling
- Custom Tailwind configuration with admin panel colors
- Responsive design patterns
- Dark/light theme ready
- Custom component classes

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/adminpanal.git
   cd adminpanal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Top navigation
│   ├── Sidebar.tsx     # Side navigation
│   ├── Table.tsx       # Data table
│   ├── FormField.tsx   # Input field
│   └── Modal.tsx       # Modal dialog
├── pages/              # Page components
│   └── Dashboard.tsx   # Main dashboard
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## 🎨 Customization

### Colors
The project uses a custom color palette defined in `tailwind.config.js`:
- Primary colors (blue theme)
- Gray scale for text and backgrounds
- Status colors for different states

### Components
All components are built with Tailwind CSS and can be easily customized:
- Modify colors in the config file
- Update component styles directly
- Add new utility classes as needed

### Layout
The layout is fully responsive and includes:
- Mobile-first design
- Collapsible sidebar for mobile
- Flexible grid system
- Modern card-based design

## 📱 Responsive Design

- **Mobile** (< 768px): Collapsible sidebar, stacked layout
- **Tablet** (768px - 1024px): Sidebar visible, adjusted spacing
- **Desktop** (> 1024px): Full sidebar, optimal spacing

## 🔧 Development

### Adding New Pages
1. Create a new component in `src/pages/`
2. Add route to the sidebar menu in `src/components/Sidebar.tsx`
3. Update the main App component to handle routing

### Adding New Components
1. Create component in `src/components/`
2. Export from the component file
3. Import and use in your pages

### Styling Guidelines
- Use Tailwind utility classes
- Follow the existing color scheme
- Maintain responsive design principles
- Use the custom component classes when available

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Vite and deploy
3. Your admin panel will be live!

### Deploy to Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure redirects for SPA routing

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Built with ❤️ using React, Vite, and Tailwind CSS**