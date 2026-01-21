# Church Inventory System - Project Context

## Project Goals
- Build a web-based inventory system for church assets.
- Workflow: Input Form -> Database Save -> Generate QR Code -> Print -> Scan to View.

## Tech Stack (Strictly Free)
- **Frontend/Backend**: Next.js (App Router) - Hosted on Vercel (Free Tier).
- **Database**: Supabase (PostgreSQL) - Free Tier.
- **Barcode Library**: `qrcode.react` (for QR codes).
- **Auth**: Supabase Auth (Free Tier).

## Data Schema (Assets)
- `id` (UUID, primary key)
- `name` (text)
- `specification` (text)
- `purchase_date` (date)
- `price` (numeric)
- `notes` (text)
- `qrcode_url` (text) - Link to the asset detail page.

## Development Rules
- Always use Tailwind CSS for styling.
- Ensure all forms have validation (use `react-hook-form`).
- When generating QRCode, use the `id` as the encoded value.
- Do not suggest paid services (AWS, Google Cloud Paid, etc.).