# 🪷 3D Loy Krathong Online Festival & Contest Web App
### เทศกาลลอยกระทงออนไลน์ 3 มิติ พร้อมระบบประกวดและโหวตกระทง

An interactive 3D Web Application built with **React + Vite + Tailwind CSS + Three.js** to celebrate the traditional Thai Loy Krathong festival globally across PC, Tablet, and Mobile devices.

---

## ✨ Features Implemented

1. **📱 Cross-Platform Responsive Design**:
   - Seamlessly responsive on PC, Tablet, and Mobile browsers.
   - Touch gestures for 360° spin, pinch-to-zoom, and tap-to-select.
   - Safe-area insets and mobile glassmorphism UI.

2. **🌌 3D Scene in Three.js**:
   - Glowing full moon (*พระจันทร์วันเพ็ญ*) with radial atmospheric halo.
   - Floating paper sky lanterns (*Kom Loi / โคมลอย*) rising gracefully into the night sky.
   - Dynamic flowing river water with real-time wave distortion and moonlight reflections.
   - Authentic Thai Buddhist Temple (*Wat / อุโบสถ*) with multi-tiered gables and golden *Chofa* (ช่อฟ้า) finials.
   - Golden Thai Bell Stupa (*Chedi / พระเจดีย์*) shining under the moon.
   - Traditional Thai elevated teak stilt houses (*เรือนไทยริมน้ำ*) with hanging lanterns.
   - 20 animated festival-goers (*Spectator NPCs*) enjoying the festival along the wooden boardwalk.

3. **🌊 20 Flowing Krathongs**:
   - 20 colorful, diverse Krathongs drifting downstream along the river current.
   - Realistic flickering wax candles and incense sticks with glowing tips.
   - Seamless upstream boundary recycling for infinite festival ambiance.

4. **📸 Krathong Customizer Studio with Live Camera**:
   - **Take Photo / Selfie**: WebRTC camera capture (`getUserMedia`) with front/rear camera flip.
   - **Upload Photo**: Alternative file upload from device storage.
   - **Custom Materials**: Fresh Banana Leaf (ใบตอง), Royal Lotus Petals (กลีบดอกบัว), Eco-Bread (ขนมปัง), Crystalline Ice (น้ำแข็ง), Imperial Gold Foil (ทองคำเปลว).
   - **Color Palettes**: Emerald Green, Lotus Pink, Golden Amber, Cyan, Ruby.
   - **Sizes**: Mini, Standard, Grand Royal.
   - **Styles**: Traditional Dok Phaka, Royal Lotus Blossom, Modern Geometric, Ornate Floral.
   - **Global National Flags**: Categorized across Asian, European, USA, Americas, Arab & Middle East, and World Peace.

5. **🏆 Tap-to-Vote & Leaderboard Contest System**:
   - Raycasting interaction: tap or click any floating Krathong in the 3D scene to open its profile.
   - Profile card displaying creator photo, name, country flag, wish prayer, material/design specs, and live vote score.
   - One-tap "Vote" button with celebratory confetti particles and live counter updates.
   - Top-ranked contest leaderboard drawer with instant 3D camera locator.

6. **🎵 Procedural Ambient Audio Engine**:
   - Web Audio API synthesizer playing serene Thai Khim / Ranat Ek pentatonic melodies mixed with gentle river water murmurs.
   - 100% offline ready with no external audio file dependencies.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.
