# Kanban Board - Project Manager

A beautiful, modern project management app built with Next.js 14, React, and Tailwind CSS v3. Features smooth drag-and-drop animations for organizing tasks across customizable columns with local storage persistence.

## Features

✨ **Beautiful UI** - Modern, clean design with gradient backgrounds and smooth animations
📋 **Kanban Board** - Default columns (TODO, In Progress, Completed) with ability to create custom columns
🔄 **Drag & Drop** - Smooth, animated card dragging with visual feedback using @dnd-kit
📝 **Task Management** - Create, edit, delete, and update task cards with titles and detailed notes
💾 **Local Storage** - Automatic persistence - your data is saved locally and restored on reload
⚡ **Animations** - Framer Motion powered animations for modals, cards, and transitions
📱 **Responsive** - Works beautifully on desktop and tablet devices
⌨️ **Keyboard Support** - Full keyboard support for drag and drop operations

## Tech Stack

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v3** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **@dnd-kit** - Headless drag-and-drop library
- **Local Storage API** - For data persistence

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd project-manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### Creating Cards

1. Click the **+ Add Card** button in any column
2. Enter a task title (required)
3. Optionally add detailed notes
4. Click **Create Card**

### Managing Cards

- **Click a card** to open the detailed view where you can:
  - View full title and notes
  - Edit the title and notes
  - Delete the card
  - See creation and update timestamps

- **Hover over a card** to reveal the delete button (×)

- **Drag cards** between columns to organize your workflow

### Creating Columns

1. Click the **+ Add Column** button in the header
2. Enter a column title (e.g., "Review", "Testing", "Deployment")
3. Click **Create Column**
4. Custom columns can be deleted by hovering over their title and clicking the × button

### Default Columns

The board comes with three default columns that cannot be deleted:
- **TODO** - For new tasks
- **In Progress** - For tasks being worked on
- **Completed** - For finished tasks

## File Structure

```
project-manager/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles and animations
├── components/
│   ├── KanbanBoard.tsx     # Main board component with drag-drop logic
│   ├── Column.tsx          # Column component
│   ├── Card.tsx            # Draggable card component
│   ├── AddCardModal.tsx    # Modal for creating new cards
│   ├── CardDetailModal.tsx # Modal for viewing/editing card details
│   └── AddColumnModal.tsx  # Modal for creating new columns
├── lib/
│   ├── storage.ts          # Local storage utilities
│   └── types.ts            # TypeScript type definitions
├── hooks/
│   └── useLocalStorage.ts  # Custom hook for localStorage
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
├── next.config.js          # Next.js configuration
└── package.json            # Project dependencies
```

## Key Components

### KanbanBoard
The main component that manages:
- Board state with columns and cards
- Drag-and-drop logic using @dnd-kit
- Modal states for creating/editing
- Local storage synchronization

### Column
Displays a single column with:
- Column title and card count
- Droppable area for cards
- Add card button
- Delete column button (for custom columns)

### Card
Individual task card with:
- Title and preview of notes
- Hover effects and animations
- Delete button on hover
- Click-to-open for detailed view

### Modals
- **AddCardModal** - Form to create new cards
- **CardDetailModal** - View and edit card details
- **AddColumnModal** - Create new columns

## Local Storage

The application automatically saves all data to browser local storage under the key `kanban_board_state`. The data structure includes:

```typescript
{
  columns: Column[]
  cards: Card[]
}
```

Data persists across browser sessions and is restored on page load.

## Animations

The app features smooth animations powered by Framer Motion and Tailwind CSS:

- **Card Drag** - Scale and shadow effects when dragging
- **Card Hover** - Lift effect with increased shadow
- **Modal Entry** - Slide up animation with backdrop blur
- **Column Highlight** - Border and background changes when dragging over
- **Smooth Transitions** - All state changes animated for better UX

## Building for Production

To create an optimized production build:

```bash
npm run build
npm start
```

## Development

For development with hot reload:

```bash
npm run dev
```

The app will rebuild automatically when you make changes.

## Customization

### Colors

Edit the color theme in `tailwind.config.ts`:

```typescript
colors: {
  primary: '#7C3AED',    // Purple
  secondary: '#06B6D4',  // Cyan
  destructive: '#EF4444', // Red
  muted: '#6B7280',      // Gray
}
```

### Animations

Customize animations in:
- `tailwind.config.ts` - for Tailwind animations
- `app/globals.css` - for custom keyframe animations

### Layout

The board uses CSS Grid and Flexbox for responsive layouts. Adjust spacing and sizing in the component files using Tailwind classes.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lightweight bundle (~150KB gzipped)
- Optimized images and code splitting
- Efficient local storage usage
- Smooth 60fps animations with GPU acceleration

## Future Enhancements

Potential features for future versions:
- Cloud sync with database
- User authentication and team collaboration
- Card attachments and comments
- Due dates and priority levels
- Card templates
- Export to CSV/PDF
- Dark mode toggle
- Mobile app version

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please check the code comments or review the component structure in the `/components` directory.

---

Built with ❤️ using Next.js and React
