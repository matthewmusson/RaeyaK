# Messages for Raeya

A beautiful, minimalist React app for displaying family messages over the years.

## Features

- Home page displaying messages as cards
- Messages sorted by date (most recent first)
- Tab selection to filter by family member
- Minimalist card design with timestamp and signature
- Responsive design for mobile and desktop

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Adding Messages

Edit `src/data/messages.js` to add new messages. Each message should have:
- `id`: unique identifier
- `text`: the message content
- `name`: the family member's name
- `date`: date in YYYY-MM-DD format

## Future Enhancements

- Randomize message display option
- Filter by family member (already implemented via tabs)
- Backend integration for dynamic message storage
- Authentication (if needed in the future)

