# ZaminBazaar - Developer Guide

## Project Overview
ZaminBazaar is India's leading plot ZaminBazzar built with React, TypeScript, and Supabase.

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn UI
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM v6

---

## Project Structure

```
src/
├── assets/              # Static images and assets
├── components/          # Reusable UI components
│   ├── ui/              # Shadcn UI components
│   ├── AdminSidebar.tsx # Admin dashboard sidebar
│   ├── Navbar.tsx       # Main navigation
│   ├── Footer.tsx       # Site footer
│   ├── PropertyCard.tsx # Property listing card
│   └── ...
├── contexts/            # React contexts
│   ├── AuthContext.tsx  # Authentication state
│   └── CompareContext.tsx
├── hooks/               # Custom React hooks
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── integrations/
│   └── supabase/
│       ├── client.ts    # Supabase client (auto-generated)
│       └── types.ts     # Database types (auto-generated)
├── lib/
│   ├── utils.ts         # Utility functions
│   └── validation.ts    # Form validation schemas
├── pages/               # Page components
│   ├── Index.tsx        # Homepage
│   ├── BrowsePlots.tsx  # Property listings
│   ├── PropertyDetail.tsx
│   ├── AddPlot.tsx      # Add property form
│   ├── AdminDashboard.tsx
│   ├── SellerDashboard.tsx
│   └── ...
└── App.tsx              # Main app with routes
```

---

## Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `profiles` | User profiles (id, full_name, phone, avatar_url) |
| `plots` | Property listings with all details |
| `saved_plots` | User's saved/favorited plots |
| `plot_views` | View tracking for analytics |
| `blogs` | Blog posts |
| `conversations` | Buyer-seller chat threads |
| `messages` | Individual chat messages |
| `user_roles` | Role-based access (admin, moderator, user) |

### Key Fields in `plots` Table
- Basic: `id`, `title`, `description`, `price`, `area`
- Location: `city`, `state`, `locality`, `exact_address`, `google_map_pin`
- Details: `plot_type`, `plot_facing`, `dimensions`, `road_access`
- Seller: `seller_name`, `seller_type`, `phone_primary`, `seller_email`
- Status: `status`, `is_verified`, `is_boosted`, `listing_score`
- Media: `images[]`, `video_url`, `drone_view_url`

---

## Authentication

### AuthContext Usage
```typescript
import { useAuth } from '@/contexts/AuthContext';

const Component = () => {
  const { user, session, signIn, signUp, signOut, loading } = useAuth();
  
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/auth" />;
  
  return <Dashboard />;
};
```

### User Roles
```typescript
// Check if user is admin
const { data: isAdmin } = await supabase
  .rpc('has_role', { _user_id: user.id, _role: 'admin' });
```

---

## Supabase Client Usage

```typescript
import { supabase } from '@/integrations/supabase/client';

// Fetch data
const { data, error } = await supabase
  .from('plots')
  .select('*')
  .eq('status', 'active')
  .order('created_at', { ascending: false });

// Insert data
const { data, error } = await supabase
  .from('plots')
  .insert({ title: 'New Plot', price: 500000, ... })
  .select()
  .single();

// Update data
const { error } = await supabase
  .from('plots')
  .update({ status: 'sold' })
  .eq('id', plotId);

// Delete data
const { error } = await supabase
  .from('plots')
  .delete()
  .eq('id', plotId);
```

---

## Edge Functions

Located in `supabase/functions/`:

| Function | Purpose |
|----------|---------|
| `generate-description` | AI-powered property descriptions |
| `calculate-listing-score` | Property listing quality score |

---

## Storage Buckets

| Bucket | Public | Purpose |
|--------|--------|---------|
| `property-images` | Yes | Plot photos and media |
| `profile-images` | Yes | User avatars |

### Upload Example
```typescript
const { data, error } = await supabase.storage
  .from('property-images')
  .upload(`${userId}/${fileName}`, file);

const publicUrl = supabase.storage
  .from('property-images')
  .getPublicUrl(data.path).data.publicUrl;
```

---

## Key Components

### PropertyCard
Displays a property listing with image, price, location, and actions.

### SearchBar
Hero search with location dropdown and property type filter.

### AdminSidebar
Collapsible sidebar for admin dashboard navigation.

### UserSidebar
Sidebar for seller/user dashboard.

---

## Environment Variables

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...
VITE_SUPABASE_PROJECT_ID=xxx
```

---

## Running Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## Admin Access

1. User must have role in `user_roles` table with `role = 'admin'`
2. Access admin dashboard at `/admin`
3. Admin features: Manage listings, users, blogs, analytics

---

## Design System

Colors and themes defined in:
- `src/index.css` - CSS variables
- `tailwind.config.ts` - Tailwind config

Primary color: Purple theme throughout the app.

---

## Contact

For questions, reach out to the Zaminwale team.
