// Empty initial fleet - all mockups cleared
export const INITIAL_KRATHONGS = [];

export const COUNTRY_FLAG_OPTIONS = [
  // Asian
  { code: 'TH', name: 'Thailand', emoji: '🇹🇭', region: 'Asian' },
  { code: 'JP', name: 'Japan', emoji: '🇯🇵', region: 'Asian' },
  { code: 'KR', name: 'South Korea', emoji: '🇰🇷', region: 'Asian' },
  { code: 'CN', name: 'China', emoji: '🇨🇳', region: 'Asian' },
  { code: 'IN', name: 'India', emoji: '🇮🇳', region: 'Asian' },
  { code: 'SG', name: 'Singapore', emoji: '🇸🇬', region: 'Asian' },
  { code: 'VN', name: 'Vietnam', emoji: '🇻🇳', region: 'Asian' },
  { code: 'MY', name: 'Malaysia', emoji: '🇲🇾', region: 'Asian' },
  { code: 'ID', name: 'Indonesia', emoji: '🇮🇩', region: 'Asian' },
  { code: 'PH', name: 'Philippines', emoji: '🇵🇭', region: 'Asian' },
  
  // European
  { code: 'GB', name: 'United Kingdom', emoji: '🇬🇧', region: 'European' },
  { code: 'FR', name: 'France', emoji: '🇫🇷', region: 'European' },
  { code: 'DE', name: 'Germany', emoji: '🇩🇪', region: 'European' },
  { code: 'IT', name: 'Italy', emoji: '🇮🇹', region: 'European' },
  { code: 'ES', name: 'Spain', emoji: '🇪🇸', region: 'European' },
  { code: 'SE', name: 'Sweden', emoji: '🇸🇪', region: 'European' },
  { code: 'CH', name: 'Switzerland', emoji: '🇨🇭', region: 'European' },
  { code: 'NL', name: 'Netherlands', emoji: '🇳🇱', region: 'European' },

  // USA & Americas
  { code: 'US', name: 'United States', emoji: '🇺🇸', region: 'USA' },
  { code: 'CA', name: 'Canada', emoji: '🇨🇦', region: 'Americas' },
  { code: 'BR', name: 'Brazil', emoji: '🇧🇷', region: 'Americas' },
  { code: 'MX', name: 'Mexico', emoji: '🇲🇽', region: 'Americas' },
  { code: 'AR', name: 'Argentina', emoji: '🇦🇷', region: 'Americas' },

  // Arab & Middle East
  { code: 'AE', name: 'United Arab Emirates', emoji: '🇦🇪', region: 'Arab' },
  { code: 'SA', name: 'Saudi Arabia', emoji: '🇸🇦', region: 'Arab' },
  { code: 'QA', name: 'Qatar', emoji: '🇶🇦', region: 'Arab' },
  { code: 'EG', name: 'Egypt', emoji: '🇪🇬', region: 'Arab' },
  { code: 'KW', name: 'Kuwait', emoji: '🇰🇼', region: 'Arab' },
  { code: 'OM', name: 'Oman', emoji: '🇴🇲', region: 'Arab' },

  // Global Peace
  { code: 'UN', name: 'World Peace', emoji: '🕊️', region: 'Global' }
];

export const MATERIAL_OPTIONS = [
  { id: 'banana_leaf', name: 'Classic Banana Leaf (ใบตองสด)', desc: 'Traditional folded banana leaves with fresh eco aroma', color: '#2d6a4f', textureType: 'leaf' },
  { id: 'lotus', name: 'Royal Lotus Petal (กลีบดอกบัว)', desc: 'Delicate pink and crimson layered lotus petals', color: '#b5179e', textureType: 'petal' },
  { id: 'bread', name: 'Eco-Bread (ขนมปังรักษ์โลก)', desc: '100% biodegradable fish food krathong', color: '#b08968', textureType: 'bread' },
  { id: 'ice', name: 'Crystalline Ice (น้ำแข็งละลาย)', desc: 'Translucent pure ice that melts without leaving waste', color: '#0077b6', textureType: 'ice' },
  { id: 'gold_leaf', name: 'Imperial Gold Foil (ทองคำเปลว)', desc: 'Glorious shimmering gold foil reflecting moonlight', color: '#d4af37', textureType: 'gold' }
];

export const SIZE_OPTIONS = [
  { id: 'small', name: 'Mini (กะทัดรัด)', scale: 0.75, desc: 'Nimble & swift floating krathong' },
  { id: 'medium', name: 'Standard (มาตรฐาน)', scale: 1.0, desc: 'Perfect balanced festival design' },
  { id: 'large', name: 'Grand Royal (อลังการ)', scale: 1.35, desc: 'Towering multi-layered royal showcase' }
];

export const DESIGN_STYLES = [
  { id: 'traditional', name: 'Traditional Dok Phaka (พับกลีบผกาแก้ว)' },
  { id: 'royal_lotus', name: 'Royal Lotus Blossom (บัวบานทรงเครื่อง)' },
  { id: 'modern', name: 'Modern Geometric (ร่วมสมัยมินิมอล)' },
  { id: 'floral', name: 'Ornate Marigold & Jasmine (ดอกไม้หอมพวงมาลัย)' }
];
